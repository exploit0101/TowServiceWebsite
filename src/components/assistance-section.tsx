import { Phone, ArrowUpRight } from 'lucide-react';
import { ContactForm } from './contact-form';
import { callsEnabled, phoneContact, siteConfig } from '@/lib/site-config';
import { services } from '@/lib/content';

export function AssistanceSection() {
  if (!callsEnabled || !phoneContact) return null;
  return <div className="assistance-panel">
    <div className="assistance-intro">
      <div className="assistance-summary">
        <h2>Car trouble? <em>We’re here.</em></h2>
        <p>Call 24/7 or send a request.</p>
      </div>
      <div className="assistance-priority">
        <a className="assistance-call" href={phoneContact.href}>
          <span className="assistance-call-icon"><Phone size={24} aria-hidden="true" /></span>
          <span><small>URGENT HELP · CALL 24/7</small><strong>{phoneContact.display}</strong></span>
          <ArrowUpRight size={23} aria-hidden="true" />
        </a>
      </div>
    </div>
    <ContactForm services={services.filter(service => siteConfig.offers.includes(service.id)).map(({ id, name }) => ({ id, name }))} phoneHref={phoneContact.href} displayPhone={phoneContact.display} />
  </div>;
}
