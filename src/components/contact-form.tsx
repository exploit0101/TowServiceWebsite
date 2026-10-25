'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2, LoaderCircle, Send, UserRound, Phone, Mail, MapPin, Wrench, MessageSquareText } from 'lucide-react';
import { formspreeEndpoint, validateContact, contactNotice } from '@/lib/contact';

type ServiceOption = { id: string; name: string };
type Feedback = { kind: 'success' | 'error'; message: string; verification?: boolean } | null;

export function ContactForm({ services, phoneHref, displayPhone }: {
  services: ServiceOption[]; phoneHref: string; displayPhone: string;
}) {
  const id = useId();
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const submitting = useRef(false);
  const result = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => { if (feedback) result.current?.focus(); }, [feedback]);
  useEffect(() => () => controller.current?.abort(), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const nativeVerification = (event.nativeEvent as SubmitEvent).submitter?.getAttribute('value') === 'verify';
    if (submitting.current) { event.preventDefault(); return; }
    // Formspree can present its hosted spam challenge; also works without JavaScript.
    if (nativeVerification) return;
    event.preventDefault();
    setFeedback(null);
    const data = new FormData(form);
    const error = validateContact(data, services.map(service => service.name));
    if (error) { setFeedback({ kind: 'error', message: error }); return; }
    if (!String(data.get('email') || '').trim()) data.delete('email');
    submitting.current = true;
    setPending(true);
    controller.current = new AbortController();
    const timeout = window.setTimeout(() => controller.current?.abort(), 20000);
    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST', body: data, headers: { Accept: 'application/json' },
        credentials: 'omit', signal: controller.current.signal,
      });
      const body: { ok?: boolean; errors?: { message?: string; code?: string }[]; error?: string } = await response.json();
      if (!response.ok || body.ok !== true) {
        if (response.status === 429) {
          setFeedback({ kind: 'error', message: 'The form is temporarily busy. Please call for help instead.' });
        } else {
          const challenge = /captcha/i.test(JSON.stringify(body));
          setFeedback({ kind: 'error',
            message: challenge ? 'Formspree needs a security check. Continue below to verify and send your request.'
              : 'Your request was not confirmed. Please check your details or call us for help.',
            verification: response.status >= 400 && response.status < 500,
          });
        }
        return;
      }
      form.reset();
      setFeedback({ kind: 'success', message: 'Your request has been sent. We’ll use your details to respond. A booking and dispatch still need to be confirmed.' });
    } catch {
      setFeedback({ kind: 'error', message: 'We couldn’t confirm delivery. Please call us before sending again so your request isn’t duplicated.' });
    } finally {
      window.clearTimeout(timeout);
      submitting.current = false;
      setPending(false);
    }
  }

  return <div className="assistance-form-card">
    <div className="assistance-form-heading">
      <span className="assistance-form-icon"><Send size={23} aria-hidden="true" /></span>
      <h3>Request assistance</h3>
    </div>
    <form action={formspreeEndpoint} method="POST" onSubmit={submit} aria-label="Request roadside assistance" aria-describedby={`${id}-notice`} aria-busy={pending}>
      <input type="hidden" name="_subject" value="EasyTowing — roadside service enquiry" />
      <input type="hidden" name="contact_notice" value={contactNotice} />
      <div className="assistance-fields">
        <div className="assistance-field"><label htmlFor={`${id}-name`}><UserRound size={15} aria-hidden="true" />Name <span>*</span></label><input id={`${id}-name`} name="name" autoComplete="name" placeholder="Your name" required maxLength={80} /></div>
        <div className="assistance-field"><label htmlFor={`${id}-phone`}><Phone size={15} aria-hidden="true" />Phone number <span>*</span></label><input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Your phone" required minLength={7} maxLength={30} /></div>
        <div className="assistance-field"><label htmlFor={`${id}-email`}><Mail size={15} aria-hidden="true" />Email <small>(optional)</small></label><input id={`${id}-email`} name="email" type="email" autoComplete="email" placeholder="Email address" maxLength={254} /></div>
        <div className="assistance-field assistance-field-location"><label htmlFor={`${id}-location`}><MapPin size={15} aria-hidden="true" />Address / location <span>*</span></label><input id={`${id}-location`} name="location" autoComplete="off" placeholder="Your location" required minLength={2} maxLength={200} /></div>
        <div className="assistance-field"><label htmlFor={`${id}-service`}><Wrench size={15} aria-hidden="true" />Service type <span>*</span></label><select id={`${id}-service`} name="service" defaultValue="" required><option value="" disabled>Choose service</option>{services.map(service => <option key={service.id} value={service.name}>{service.name}</option>)}</select></div>
        <div className="assistance-field assistance-field-wide"><label htmlFor={`${id}-message`}><MessageSquareText size={15} aria-hidden="true" />Message <small>(optional)</small></label><textarea id={`${id}-message`} name="message" placeholder="Your message" maxLength={2000} rows={1} /></div>
      </div>
      <div className="assistance-honeypot" aria-hidden="true"><label htmlFor={`${id}-website`}>Leave this field empty</label><input id={`${id}-website`} name="_gotcha" tabIndex={-1} autoComplete="off" /></div>
      <div className="assistance-form-footer">
        <p className="assistance-send-notice" id={`${id}-notice`}>{contactNotice} <Link href="/privacy">Privacy</Link>. Sending does not confirm dispatch.</p>
        <button className="button button-yellow assistance-submit" type="submit" disabled={pending}>{pending ? <><LoaderCircle className="assistance-spinner" size={19} aria-hidden="true" />Sending request…</> : <>Send request<ArrowUpRight size={20} aria-hidden="true" /></>}</button>
      </div>
      <div ref={result} tabIndex={-1} role={feedback?.kind === 'error' ? 'alert' : 'status'} aria-atomic="true" className={feedback ? `assistance-feedback is-${feedback.kind}` : undefined}>
        {feedback && <>{feedback.kind === 'success' && <CheckCircle2 size={22} aria-hidden="true" />}<div><p>{feedback.message}</p>{feedback.kind === 'error' && <a href={phoneHref}>Call {displayPhone}<ArrowUpRight size={16} aria-hidden="true" /></a>}{feedback.verification && <button className="assistance-verify" type="submit" name="submission" value="verify">Continue with Formspree verification<ArrowUpRight size={16} aria-hidden="true" /></button>}</div></>}
      </div>
    </form>
  </div>;
}
