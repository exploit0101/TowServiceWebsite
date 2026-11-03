export type TrackingConfig = { ga4Id: string; adsId: string; phoneLabel: string; leadLabel: string };
export type TrackingChoice = 'all' | 'analytics' | 'ads' | 'none';
export const trackingChoiceKey = 'easytowing.measurement.v1';

/** Public destination IDs only. Unconfigured, unapproved and preview builds stay off. */
export function resolveTrackingConfig(input: {
  live: boolean; approved: boolean; ga4Id?: string; adsId?: string; phoneLabel?: string; leadLabel?: string;
}): TrackingConfig {
  const valid = (value: string | undefined, pattern: RegExp) => pattern.test(value?.trim() || '') ? value!.trim() : '';
  if (!input.live || !input.approved) return { ga4Id: '', adsId: '', phoneLabel: '', leadLabel: '' };
  const adsId = valid(input.adsId, /^AW-\d+$/);
  return {
    ga4Id: valid(input.ga4Id, /^G-[A-Z0-9]+$/), adsId,
    phoneLabel: adsId ? valid(input.phoneLabel, /^[A-Za-z0-9_-]+$/) : '',
    leadLabel: adsId ? valid(input.leadLabel, /^[A-Za-z0-9_-]+$/) : '',
  };
}
export function hasTracking(config: TrackingConfig) { return Boolean(config.ga4Id || config.adsId); }
export function parseTrackingChoice(value: string | null): TrackingChoice | null {
  return value === 'all' || value === 'analytics' || value === 'ads' || value === 'none' ? value : null;
}
export function trackingPermissions(choice: TrackingChoice | null, config: TrackingConfig) {
  return {
    analytics: Boolean(config.ga4Id && (choice === 'all' || choice === 'analytics')),
    ads: Boolean(config.adsId && (choice === 'all' || choice === 'ads')),
  };
}
/** Strip arbitrary query values, fragments and external referrer paths from analytics. */
export function measurementPage(location: string, referrer = '') {
  const url = new URL(location);
  let pageReferrer = '';
  try {
    const previous = new URL(referrer);
    if (/^https?:$/.test(previous.protocol)) pageReferrer = previous.origin === url.origin ? `${previous.origin}${previous.pathname}` : previous.origin;
  } catch { /* Missing referrer is normal. */ }
  return { page_location: `${url.origin}${url.pathname}`, page_referrer: pageReferrer };
}
