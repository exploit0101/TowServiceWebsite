import type { MetadataRoute } from 'next';
import { isLive, siteConfig, indexableRoutes, brand } from '@/lib/site-config';
import { createRobots } from '@/lib/seo-policy';
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {
  return createRobots({ live: isLive, brand, origin: siteConfig.canonicalDomain, approvedRoutes: indexableRoutes });
}
