'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from './icons';
import { validateRequest } from '@/lib/request-validation';
import { services } from '@/lib/content';
export function RequestForm({ enabled, offers }: {enabled:boolean; offers:string[]}) {
  const [result,setResult] = useState<'preview'|'sent'|null>(null);
  const [pending,setPending] = useState(false);
  const [error,setError] = useState('');
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setResult(null); setError('');
    const form = event.currentTarget;
    const data = new FormData(form);
    const request = { phone:String(data.get('phone') || ''), name:String(data.get('name') || ''), service:String(data.get('service') || ''), area:String(data.get('area') || ''), consent:data.get('consent') === 'on', website:String(data.get('website') || '') };
    const validated = validateRequest(request);
    if (!validated.ok) { setError(validated.error); return; }
    if (!enabled) { setResult('preview'); return; }
    setPending(true);
    try {
      const response = await fetch('/api/callback', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(validated.value)});
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'The request could not be sent. Please call instead.');
      setResult('sent'); form.reset();
    } catch(error) { setError(error instanceof Error ? error.message : 'The request could not be sent.'); }
    finally { setPending(false); }
  }
  return <div className="form-card"><h2>{enabled ? 'Request a callback' : 'Explore the request process'}</h2><p className="form-note">{enabled ? 'Share only what the team needs to discuss your options. This form is not monitored for emergencies.' : 'This is a local form preview. Nothing is sent, stored or booked. You can try it without entering your real contact details.'}</p>
    <form onSubmit={submit} aria-describedby="request-disclaimer">
      <div className="field"><label htmlFor="service">What do you need help with?</label><select id="service" name="service" required defaultValue=""><option value="" disabled>Choose a service</option>{services.filter(s => !enabled || offers.includes(s.id)).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
      <div className="field"><label htmlFor="area">General neighbourhood or intersection</label><input id="area" name="area" required minLength={2} maxLength={80} autoComplete="off" aria-describedby="area-hint"/><small id="area-hint">Please do not enter your precise location, home address or vehicle registration.</small></div>
      <div className="field"><label htmlFor="phone">Canadian callback number</label><input id="phone" name="phone" type="tel" inputMode="tel" required maxLength={24} autoComplete={enabled ? 'tel' : 'off'} aria-describedby="phone-hint"/><small id="phone-hint">{enabled ? 'Use a number where the team can reach you.' : 'For this preview, you may use a reserved example number: 204-555-0100.'}</small></div>
      <div className="field"><label htmlFor="name">First name <span className="form-note">(optional)</span></label><input id="name" name="name" maxLength={60} autoComplete={enabled ? 'given-name' : 'off'}/></div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" tabIndex={-1} autoComplete="off"/></div>
      <div className="checkbox-field"><input type="checkbox" id="consent" name="consent" required/><label htmlFor="consent">{enabled ? 'I agree to be contacted about this request and understand how the information is used in the ' : 'For this preview, I understand how callback consent will work. Read the draft '}<Link href="/privacy">privacy notice</Link>. This is not consent to roadside work or marketing.</label></div>
      <p className="form-note" id="request-disclaimer">Submitting a request does not confirm availability, a booking, a price or dispatch. Do not wait for a callback if you are in danger.</p>
      <button className="button button-yellow" type="submit" disabled={pending}>{pending ? 'Sending request…' : enabled ? 'Request a callback' : 'Review request (preview)'}<ArrowUpRight size={18}/></button>
      <div role="alert" className={error ? 'form-error' : undefined}>{error}</div>
    </form>
    <div aria-live="polite" aria-atomic="true">{result && <div className="form-result"><h3>{result === 'preview' ? 'Preview complete. Nothing has been sent.' : 'Your callback request has been received.'}</h3><p>{result === 'preview' ? 'Your entries remain only on this page. No service team has been contacted. Leave or reload the page to clear the preview.' : 'The team will review your request. A callback request does not confirm a booking or dispatch.'}</p><p><strong>No vehicle has been dispatched.</strong></p></div>}</div>
  </div>;
}
