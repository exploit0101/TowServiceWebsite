import type { MetadataRoute } from 'next';
import { seoContext } from '@/lib/seo';
import { createSitemap } from '@/lib/seo-policy';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return createSitemap(seoContext);
}
