'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { hasTracking, parseTrackingChoice, trackingChoiceKey, trackingPermissions, type TrackingChoice, type TrackingConfig } from '@/lib/tracking';
import { applyTrackingChoice, trackContactEvent, trackPageView } from '@/lib/tracking-client';

let memoryChoice: TrackingChoice | null = null;
function snapshot() {
  try { return parseTrackingChoice(sessionStorage.getItem(trackingChoiceKey)) ?? memoryChoice; }
  catch { return memoryChoice; }
}
function subscribe(listener: () => void) {
  window.addEventListener('easytowing:measurement-choice', listener);
  return () => window.removeEventListener('easytowing:measurement-choice', listener);
}
function saveChoice(choice: TrackingChoice) {
  memoryChoice = choice;
  try { sessionStorage.setItem(trackingChoiceKey, choice); } catch { /* Works when storage is blocked. */ }
  window.dispatchEvent(new Event('easytowing:measurement-choice'));
}
export function Consent({ config }: { config: TrackingConfig }) {
  const choice = useSyncExternalStore(subscribe, snapshot, () => null);
  // Without JavaScript there are no tags and no working consent controls.
  // Keep the panel out of server HTML so it cannot cover the native contact form.
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [settings, setSettings] = useState(false);
  const pathname = usePathname();
  const enabled = hasTracking(config);
  const selected = trackingPermissions(choice, config);
  useEffect(() => {
    if (!enabled) return;
    applyTrackingChoice(choice, config);
    trackPageView();
    const phone = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a[href^="tel:"]')) trackContactEvent('phone_link_click');
    };
    const lead = () => trackContactEvent('generate_lead');
    document.addEventListener('click', phone);
    window.addEventListener('easytowing:lead-sent', lead);
    return () => { document.removeEventListener('click', phone); window.removeEventListener('easytowing:lead-sent', lead); };
  }, [choice, config, enabled]);
  useEffect(() => { if (enabled) trackPageView(); }, [enabled, pathname]);
  if (!enabled || !hydrated) return null;
  function choose(value: TrackingChoice) { saveChoice(value); setSettings(false); }
  return <>
    <button className="privacy-settings" onClick={() => setSettings(!settings)} aria-expanded={!choice || settings} aria-controls="measurement-preferences">Privacy choices</button>
    {(!choice || settings) && <aside className="consent-panel" id="measurement-preferences" aria-label="Optional measurement">
      <strong>Your privacy, your choice</strong>
      <p>Allow Google to measure website use or ad enquiries. These optional tools may use cookies and process information outside Canada. You can use every service without them. <Link href="/privacy">Privacy notice</Link>.</p>
      <form key={choice || 'new'} onSubmit={event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        choose(data.has('analytics') ? data.has('ads') ? 'all' : 'analytics' : data.has('ads') ? 'ads' : 'none');
      }}>
        {config.ga4Id && <label><input type="checkbox" name="analytics" defaultChecked={selected.analytics}/><span>Usage analytics<small>Page views, phone taps and delivered enquiries.</small></span></label>}
        {config.adsId && <label><input type="checkbox" name="ads" defaultChecked={selected.ads}/><span>Ad measurement<small>Measure enquiries from Google Ads. No personalised ads.</small></span></label>}
        <div className="consent-actions"><button className="button consent-decline" type="button" onClick={() => choose('none')}>Decline all</button><button className="button consent-save" type="submit">Save choices</button></div>
      </form>
      <small className="consent-session">Your choice is remembered in this tab. Change it anytime below.</small>
    </aside>}
  </>;
}
