import type { Metadata } from 'next';
import { indexableRoutes, isLive, siteConfig, brand } from './site-config';
import { canonicalUrl, createPageMetadata, type SeoContext } from './seo-policy';
export const seoContext: SeoContext = {
  live: isLive,
  brand,
  origin: siteConfig.canonicalDomain,
  approvedRoutes: indexableRoutes,
  basePath: process.env.NEXT_PUBLIC_SITE_BASE_PATH || '',
  trailingSlash: process.env.NEXT_PUBLIC_SITE_TRAILING_SLASH === 'true' || Boolean(process.env.NEXT_PUBLIC_SITE_BASE_PATH),
};
export function canonicalSiteUrl(path: string): string {
  return canonicalUrl(path, seoContext.origin, seoContext.basePath, seoContext.trailingSlash);
}
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return createPageMetadata(title, description, path, seoContext);
}
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
export function StructuredBreadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  if (!isLive) return null;
  return <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ name: 'Home', path: '/' }, ...items].map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: canonicalSiteUrl(item.path) })) }} />;
}
