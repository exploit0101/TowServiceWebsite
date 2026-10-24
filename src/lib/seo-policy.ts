import type { Metadata, MetadataRoute } from 'next';

export type SeoContext = {
  live: boolean;
  brand: string;
  origin: string;
  approvedRoutes: readonly string[];
};

export function canonicalUrl(path: string, origin: string): string {
  if (!path.startsWith('/') || path.startsWith('//') || /[\\?#]/.test(path))
    throw new Error('Canonical paths must be absolute local paths without query strings or fragments.');
  return new URL(path, origin).href;
}

export function createPageMetadata(title: string, description: string, path: string, context: SeoContext): Metadata {
  const indexable = context.live && context.approvedRoutes.includes(path);
  const url = context.live ? canonicalUrl(path, context.origin) : undefined;
  const image = context.live ? {
    url: canonicalUrl('/images/easytowing-flatbed.webp', context.origin),
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
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    ...(context.live ? { sitemap: canonicalUrl('/sitemap.xml', context.origin) } : {}),
  };
}

export function createSitemap(context: SeoContext): MetadataRoute.Sitemap {
  if (!context.live) return [];
  return [...new Set(context.approvedRoutes)].map(path => ({ url: canonicalUrl(path, context.origin) }));
}
