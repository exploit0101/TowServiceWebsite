import type { Metadata } from 'next';
import { indexableRoutes, isLive, siteConfig, brand } from './site-config';
import { canonicalUrl, createPageMetadata } from './seo-policy';
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return createPageMetadata(title, description, path, { live: isLive, brand, origin: siteConfig.canonicalDomain, approvedRoutes: indexableRoutes });
}
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
export function StructuredBreadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  if (!isLive) return null;
  return <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ name: 'Home', path: '/' }, ...items].map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: canonicalUrl(item.path, siteConfig.canonicalDomain) })) }} />;
}
