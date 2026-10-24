import type { Metadata, MetadataRoute } from 'next';

export type SeoContext = {
  live: boolean;
  brand: string;
  origin: string;
  approvedRoutes: readonly string[];
  basePath?: string;
  trailingSlash?: boolean;
};

export function canonicalUrl(path: string, origin: string, basePath = '', trailingSlash = Boolean(basePath)): string {
  if (!/^(?:\/[A-Za-z0-9._-]+)*$/.test(basePath) || basePath.split('/').some(part => part === '.' || part === '..'))
    throw new Error('The deployment base path must contain safe local path segments without a trailing slash.');
  if (!path.startsWith('/') || path.startsWith('//') || /[\\?#\s]/.test(path) || path.split('/').some(part => {
    const decoded = decodeURIComponent(part);
    return decoded === '.' || decoded === '..' || /[\\/]/.test(decoded);
  }))
    throw new Error('Canonical paths must be absolute local paths without query strings or fragments.');
  const filePath = /\/[^/]+\.[^/]+$/.test(path) || path.startsWith('/.well-known/');
  const canonicalPath = `${basePath}${path}${trailingSlash && !filePath && !path.endsWith('/') ? '/' : ''}`;
  return new URL(canonicalPath, origin).href;
}

export function createPageMetadata(title: string, description: string, path: string, context: SeoContext): Metadata {
  const indexable = context.live && context.approvedRoutes.includes(path);
  const url = context.live ? canonicalUrl(path, context.origin, context.basePath, context.trailingSlash) : undefined;
  const image = context.live ? {
    url: canonicalUrl('/images/easytowing-flatbed.webp', context.origin, context.basePath, context.trailingSlash),
    alt: 'White easytowing flatbed truck carrying a grey SUV',
    width: 1448,
    height: 1086,
  } : undefined;
  const socialTitle = `${title} | ${context.brand}`;
  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    robots: { index: indexable, follow: indexable },
    openGraph: {
      title: socialTitle,
      description,
      siteName: context.brand,
      type: 'website',
      locale: 'en_CA',
      ...(url ? { url } : {}),
      ...(image ? { images: [image] } : {}),
    },
    twitter: { card: image ? 'summary_large_image' : 'summary', title: socialTitle, description, ...(image ? { images: [image] } : {}) },
  };
}

export function createRobots(context: SeoContext): MetadataRoute.Robots {
  // Crawlers need access to HTML to read noindex, and to CSS/JS/images to render it.
  // robots.txt is not access control: sensitive staging needs host authentication.
  return {
    rules: { userAgent: '*', allow: '/', disallow: `${context.basePath || ''}/api/` },
    ...(context.live ? { sitemap: canonicalUrl('/sitemap.xml', context.origin, context.basePath, context.trailingSlash) } : {}),
  };
}

export function createSitemap(context: SeoContext): MetadataRoute.Sitemap {
  if (!context.live) return [];
  return [...new Set(context.approvedRoutes)].map(path => ({ url: canonicalUrl(path, context.origin, context.basePath, context.trailingSlash) }));
}
