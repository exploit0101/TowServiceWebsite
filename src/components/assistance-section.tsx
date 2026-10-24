import Link from 'next/link';
import { Clock3, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { ContactForm } from './contact-form';
import { callsEnabled, phoneContact, siteConfig } from '@/lib/site-config';
import { services } from '@/lib/content';

export function AssistanceSection() {
  if (!callsEnabled || !phoneContact) return null;
  return <div className="assistance-panel">
    <div className="assistance-intro">
      <div className="assistance-summary">
        <div className="eyebrow"><span />LET’S GET YOU MOVING</div>
        <h2>Car trouble? <em>We’re here to help.</em></h2>
        <p>Call for urgent roadside help, or send a request below.</p>
        <div className="assistance-facts"><span><Clock3 size={16} aria-hidden="true" />Available 24/7</span><span><MapPin size={16} aria-hidden="true" />Across Winnipeg</span></div>
      </div>
      <div className="assistance-priority">
        <a className="assistance-call" href={phoneContact.href}>
          <span className="assistance-call-icon"><Phone size={24} aria-hidden="true" /></span>
          <span><small>NEED HELP NOW? CALL 24/7</small><strong>{phoneContact.display}</strong></span>
          <ArrowUpRight size={23} aria-hidden="true" />
        </a>
        <Link href="/rates-and-disclosures" className="assistance-details">Quotes & service details<ArrowUpRight size={15} aria-hidden="true" /></Link>
      </div>
    </div>
    <ContactForm services={services.filter(service => siteConfig.offers.includes(service.id)).map(({ id, name }) => ({ id, name }))} phoneHref={phoneContact.href} displayPhone={phoneContact.display} />
  </div>;
}
