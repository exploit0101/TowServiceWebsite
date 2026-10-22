import type { MetadataRoute } from 'next';
import { siteConfig, indexableRoutes, isLive, brand } from '@/lib/site-config';
import { createSitemap } from '@/lib/seo-policy';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return createSitemap({ live: isLive, brand, origin: siteConfig.canonicalDomain, approvedRoutes: indexableRoutes });
}
