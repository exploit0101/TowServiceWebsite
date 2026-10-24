import type { MetadataRoute } from 'next';
import { seoContext } from '@/lib/seo';
import { createRobots } from '@/lib/seo-policy';
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {
  return createRobots(seoContext);
}
