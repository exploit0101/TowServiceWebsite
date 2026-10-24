import Link from 'next/link';
import { ArrowUpRight, Phone } from './icons';
import { ServiceIcon } from './service-icon';
import type { Service } from '@/lib/content';
import { isLive, siteConfig, callsEnabled, isDemoPhone, phoneContact } from '@/lib/site-config';

function ServiceCall({ name, dark = false }: { name: string; dark?: boolean }) {
  const label = isDemoPhone ? 'Open dialer with demo number' : `Call for ${name.toLowerCase()}`;
  const content = <><Phone size={16} aria-hidden="true"/><span>{callsEnabled ? (isDemoPhone ? 'Call · demo' : 'Call for help') : 'Call · coming soon'}</span></>;
  const className = dark ? 'service-call-button service-call-button-dark' : 'service-call-button';
  return callsEnabled && phoneContact
    ? <a className={className} href={phoneContact.href} aria-label={`${label} at ${phoneContact.display}`}>{content}</a>
    : <button className={className} type="button" disabled aria-label={`${label} — phone number coming soon`}>{content}</button>;
}

export function ServiceGrid({ items, includeCallCard = false }: { items: readonly Service[]; includeCallCard?: boolean }) {
  return <div className="service-grid expanded-service-grid">
    {items.map(service => <article className={`service-card service-card-${service.icon}`} key={service.id}>
      <Link className="service-card-main" href={`/services/${service.id}`}>
        <div className="service-card-top"><span className="service-symbol"><ServiceIcon icon={service.icon} className="service-icon" size={44}/></span><span className="service-number">/{service.number}</span></div>
        <span className="service-problem">{service.problem}</span>
        <h3>{service.name}</h3>
        <p>{service.description}</p>
      </Link>
      <div className="service-card-bottom"><Link className="service-details-link" href={`/services/${service.id}`} aria-label={`View ${service.name.toLowerCase()} details`}>Details<ArrowUpRight size={16} aria-hidden="true"/></Link><ServiceCall name={service.name}/></div>
    </article>)}
    {includeCallCard && <aside className="service-call-card"><span className="service-call-badge"><Phone size={22} aria-hidden="true"/></span><div className="eyebrow">START WITH A CALL</div><h3>One call.<br/>A clearer plan.</h3><p>{isLive ? 'Tell the team what happened. Check availability, get a quote and confirm the next step.' : 'Describe the problem. Discuss the service you need, availability and a quote before you decide.'}</p><ServiceCall name="roadside assistance" dark/><small>{isLive ? 'Arrival estimate and pricing confirmed on the call.' : isDemoPhone ? `Demo: ${siteConfig.displayPhone}. Not a live service number.` : callsEnabled ? `Call ${siteConfig.displayPhone}. Availability must be confirmed.` : 'Phone number coming soon.'}</small></aside>}
  </div>;
}
