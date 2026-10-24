import Link from 'next/link';
import { Clock3, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { ContactForm } from './contact-form';
import { callsEnabled, phoneContact, siteConfig } from '@/lib/site-config';
import { services } from '@/lib/content';

export function AssistanceSection() {
  if (!callsEnabled || !phoneContact) return null;
  return <div className="assistance-panel">
    <div className="assistance-intro">
      <div className="eyebrow"><span />LET’S GET YOU MOVING</div>
      <h2>Car trouble?<br /><em>We’re here to help.</em></h2>
      <p>Call for immediate assistance, or send us the details using the form.</p>
      <a className="assistance-call" href={phoneContact.href}><span className="assistance-call-icon"><Phone size={23} aria-hidden="true" /></span><span><small>CALL EASYTOWING 24/7</small><strong>{phoneContact.display}</strong></span><ArrowUpRight size={22} aria-hidden="true" /></a>
      <div className="assistance-facts"><span><Clock3 size={17} aria-hidden="true" />Open 24 hours</span><span><MapPin size={17} aria-hidden="true" />Winnipeg</span></div>
      <Link href="/rates-and-disclosures" className="assistance-details">Quotes & service details<ArrowUpRight size={16} aria-hidden="true" /></Link>
      <span className="assistance-road" aria-hidden="true" />
    </div>
    <ContactForm services={services.filter(service => siteConfig.offers.includes(service.id)).map(({ id, name }) => ({ id, name }))} phoneHref={phoneContact.href} displayPhone={phoneContact.display} />
  </div>;
}
