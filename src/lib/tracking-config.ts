import { isLive, siteConfig } from './site-config';
import { resolveTrackingConfig } from './tracking';

// One configuration powers the rendered privacy notice and browser integration.
export const trackingConfig = resolveTrackingConfig({
  live: isLive, approved: siteConfig.approvals.analytics,
  ga4Id: process.env.NEXT_PUBLIC_GOOGLE_TAG_ID,
  adsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  phoneLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_PHONE_LABEL,
  leadLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL,
});
