import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, ClipboardList, MapPin, MessageSquare, Phone, ShieldCheck } from 'lucide-react';
import { AvailabilityBadge } from './availability-badge';
import { CompactServiceGrid } from './compact-service-grid';
import { ServiceIcon } from './service-icon';
import { Breadcrumbs, PrimaryAction, SafetyNote } from './ui';
import type { Service } from '@/lib/content';
import { servicePresentation } from '@/lib/service-presentation';
import { phoneContact, siteConfig } from '@/lib/site-config';

export function ServiceLanding({ service, related }: { service: Service; related: readonly Service[] }) {
  const presentation = servicePresentation[service.id];
  return <div className="service-landing">
    <div className="service-landing-top">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Services', href: '/services' }, { label: service.name }]} />
        <section className="service-landing-hero" aria-labelledby="service-title">
          <div className="service-landing-copy">
            <AvailabilityBadge config={siteConfig.availability} />
            <div className="service-landing-eyebrow">{service.problem}</div>
            <h1 id="service-title">{service.name}<br /><em>in Winnipeg.</em></h1>
            <p className="service-landing-lead">{presentation.lead}</p>
            <div className="service-landing-actions">
              <PrimaryAction />
              {phoneContact && <a className="service-landing-phone" href={phoneContact.href}>{phoneContact.display}<ArrowUpRight size={17} aria-hidden="true" /></a>}
            </div>
            <Link className="service-landing-request" href="/request-help"><MessageSquare size={16} aria-hidden="true" />Prefer to write? Send a request<ArrowRight size={16} aria-hidden="true" /></Link>
            <p className="service-landing-note">EasyTowing coordinates independent service partners. Quote and arrival estimate confirmed on your call.</p>
          </div>
          <div className="service-artwork" aria-hidden="true">
            <div className="service-artwork-top"><span>easy<b>towing</b></span><small>/{service.number}</small></div>
            <svg className="service-artwork-road" viewBox="0 0 500 350" fill="none"><path d="M-60 285C70 405 470 375 420 180C380 30 100 45 130 185C150 270 335 280 560 130" stroke="currentColor" strokeWidth="55" /><path d="M-60 285C70 405 470 375 420 180C380 30 100 45 130 185C150 270 335 280 560 130" stroke="#ddbd6b" strokeWidth="2" strokeDasharray="12 15" /></svg>
            <div className="service-artwork-tile"><ServiceIcon icon={service.icon} size={148} strokeWidth={1.35} /></div>
            <div className="service-artwork-caption"><span>{presentation.detail}</span><strong>{presentation.cue}</strong></div>
          </div>
        </section>
        <div className="service-landing-facts">
          <div><MapPin aria-hidden="true" /><span><strong>Across Winnipeg</strong><small>Citywide partner coverage</small></span></div>
          <div><ShieldCheck aria-hidden="true" /><span><strong>A clear quote first</strong><small>Approve the work before it starts</small></span></div>
          <div><Phone aria-hidden="true" /><span><strong>One point of contact</strong><small>Talk through your next step</small></span></div>
        </div>
      </div>
    </div>
    <div className="container service-landing-body">
      <div className="service-landing-details">
        <section className="service-included" aria-labelledby="included-title">
          <div className="service-landing-eyebrow">THE HELP YOU NEED</div>
          <h2 id="included-title">What this service covers<span>.</span></h2>
          <p className="service-included-intro">{service.intro}</p>
          <ul>{service.scope.map(line => <li key={line}><span><Check size={17} aria-hidden="true" /></span><p>{line}</p></li>)}</ul>
        </section>
        <aside className="service-prepare" aria-labelledby="prepare-title">
          <span className="service-prepare-icon"><ClipboardList size={25} aria-hidden="true" /></span>
          <div className="service-landing-eyebrow">BEFORE YOU CALL</div>
          <h2 id="prepare-title">A few details.<br /> A clearer plan.</h2>
          <ol>{service.prepare.map((line, index) => <li key={line}><span>0{index + 1}</span><p>{line}</p></li>)}</ol>
          <PrimaryAction />
        </aside>
      </div>
      <section className="service-fine-details" aria-label="Service and quotation details">
        <details open><summary><span>Service limits & safety</span><ChevronDown size={19} aria-hidden="true" /></summary><p>{service.limit}</p></details>
        <details><summary><span>Quotes, consent & dispatch</span><ChevronDown size={19} aria-hidden="true" /></summary><div><p>Confirm the operator, work included, total CAD quote, taxes and possible additional fees before agreeing. The provider, consent, payment and invoice arrangements are explained before service. Any change to the work or price needs your consent.</p><p>Arrival depends on location, safe access, weather and available operators. Sending a request does not confirm a booking or dispatch.</p><Link href="/rates-and-disclosures">Rates & service disclosures<ArrowUpRight size={16} aria-hidden="true" /></Link></div></details>
      </section>
      <section className="service-landing-cta">
        <div><small>LET’S FIND YOUR NEXT STEP</small><h2>Need {service.name.toLowerCase()}?</h2><p>Speak with EasyTowing in Winnipeg.</p></div>
        <div><PrimaryAction />{phoneContact && <a className="service-landing-cta-phone" href={phoneContact.href}>{phoneContact.display}</a>}</div>
      </section>
      <section className="service-other"><div className="service-other-heading"><h2>Other ways we can help.</h2><Link href="/services">All services<ArrowUpRight size={17} aria-hidden="true" /></Link></div><CompactServiceGrid items={related} /></section>
      <SafetyNote />
    </div>
  </div>;
}
