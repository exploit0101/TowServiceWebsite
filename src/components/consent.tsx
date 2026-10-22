'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; } }
export function Consent({ enabled }: { enabled: boolean }) {
  const [choice, setChoice] = useState<'accepted' | 'declined' | null>(null);
  const [settings, setSettings] = useState(false);
  const tag = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;
  useEffect(() => {
    if (choice !== 'accepted' || !enabled || !tag) return;
    const trackPhone = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest('a[href^="tel:"]') : null;
      if (anchor) window.gtag?.('event', 'phone_link_click', { event_category: 'micro_conversion' });
    };
    document.addEventListener('click', trackPhone);
    return () => document.removeEventListener('click', trackPhone);
  }, [choice, enabled, tag]);
  function choose(value: 'accepted' | 'declined') {
    setChoice(value); setSettings(false);
    // Session-only consent: no non-essential persistence or URL identifiers before consent.
    if (value === 'accepted' && window.gtag) window.gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    if (value === 'accepted' && enabled && tag && /^G-[A-Z0-9]+$/.test(tag) && !document.getElementById('google-tag')) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function (...args: unknown[]) { window.dataLayer?.push(args); };
      window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      window.gtag('js', new Date());
      window.gtag('config', tag, { send_page_view: false, ads_data_redaction: true, allow_google_signals: false, allow_ad_personalization_signals: false });
      // Do not transmit query strings, caller details or advertising identifiers.
      window.gtag('event', 'page_view', { page_location: `${location.origin}${location.pathname}`, page_title: document.title });
      const script = document.createElement('script'); script.id = 'google-tag'; script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${tag}`; document.head.appendChild(script);
    }
    if (value === 'declined' && window.gtag) {
      window.gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    }
  }
  if (!enabled || !tag) return null;
  return <><button className="privacy-settings" onClick={() => setSettings(!settings)}>Analytics preferences</button>{(!choice || settings) && <aside className="consent-panel" aria-label="Analytics preferences"><strong>Optional analytics</strong><p>With your permission, Google receives usage information to help improve this site. You can decline and still use every service. <Link href="/privacy">Read the privacy notice</Link>.</p><div><button className="button button-dark" onClick={() => choose('declined')}>Decline</button><button className="button button-yellow" onClick={() => choose('accepted')}>Allow analytics</button></div></aside>}</>;
}
