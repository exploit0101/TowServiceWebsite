'use client';
import { measurementPage, trackingPermissions, type TrackingChoice, type TrackingConfig } from './tracking';

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; }
}
let activeConfig: TrackingConfig = { ga4Id: '', adsId: '', phoneLabel: '', leadLabel: '' };
let permissions = { analytics: false, ads: false };
const configured = new Set<string>();
let lastPage = '';

function pageParameters() { return measurementPage(window.location.href, document.referrer); }
function disableAnalytics(id: string, disabled: boolean) {
  if (id) (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = disabled;
}
function clearMeasurementCookies() {
  const host = location.hostname;
  const domains = ['', ...host.split('.').map((_, index, parts) => `.${parts.slice(index).join('.')}`)];
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim();
    if (!/^(?:_ga(?:_|$)|_gid$|_gat(?:_|$)|_gcl_)/.test(name)) continue;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain ? `; domain=${domain}` : ''}`;
  }
}

export function applyTrackingChoice(choice: TrackingChoice | null, config: TrackingConfig) {
  activeConfig = config;
  permissions = trackingPermissions(choice, config);
  disableAnalytics(config.ga4Id, !permissions.analytics);
  const allowedId = permissions.analytics ? config.ga4Id : permissions.ads ? config.adsId : '';
  if (!allowedId && !window.gtag) {
    if (choice === 'none') clearMeasurementCookies();
    return; // Basic mode: no Google requests before opt-in.
  }
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    // Keep Google's documented Arguments queue format for gtag.js.
    // eslint-disable-next-line prefer-rest-params
    window.gtag = function () { window.dataLayer?.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('set', 'ads_data_redaction', true);
    window.gtag('set', 'url_passthrough', false);
    window.gtag('js', new Date());
  }
  window.gtag('consent', 'update', {
    analytics_storage: permissions.analytics ? 'granted' : 'denied', ad_storage: permissions.ads ? 'granted' : 'denied',
    ad_user_data: permissions.ads ? 'granted' : 'denied', ad_personalization: 'denied',
  });
  window.gtag('set', pageParameters());
  for (const id of [permissions.analytics ? config.ga4Id : '', permissions.ads ? config.adsId : '']) {
    if (!id || configured.has(id)) continue;
    window.gtag('config', id, {
      send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
      allow_enhanced_conversions: false, ...pageParameters(),
    });
    configured.add(id);
  }
  if (allowedId && !document.getElementById('google-tag')) {
    const script = document.createElement('script'); script.id = 'google-tag'; script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${allowedId}`; document.head.appendChild(script);
  }
  if (!permissions.analytics) lastPage = '';
  if (!permissions.analytics && !permissions.ads) clearMeasurementCookies();
}
export function trackPageView() {
  if (!permissions.analytics) return;
  const page = pageParameters();
  if (lastPage === page.page_location) return;
  lastPage = page.page_location;
  window.gtag?.('set', page);
  window.gtag?.('event', 'page_view', { ...page, page_title: document.title, send_to: activeConfig.ga4Id });
}
export function trackContactEvent(event: 'phone_link_click' | 'generate_lead') {
  if (!permissions.analytics && !permissions.ads) return;
  const page = pageParameters(); window.gtag?.('set', page);
  if (permissions.analytics) window.gtag?.('event', event, {
    ...page, send_to: activeConfig.ga4Id,
    ...(event === 'phone_link_click' ? { event_category: 'micro_conversion' } : { lead_source: 'website_form' }),
  });
  const label = event === 'phone_link_click' ? activeConfig.phoneLabel : activeConfig.leadLabel;
  if (permissions.ads && label) window.gtag?.('event', 'conversion', { send_to: `${activeConfig.adsId}/${label}`, ...page });
}
/** No form fields, personal details or fabricated revenue are shared with measurement. */
export function reportLeadSent() { window.dispatchEvent(new Event('easytowing:lead-sent')); }
