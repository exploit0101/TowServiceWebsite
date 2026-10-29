import Link from 'next/link';
import { ArrowUpRight, Phone } from 'lucide-react';
import { ServiceIcon } from './service-icon';
import type { Service } from '@/lib/content';
import type { ServiceId } from '@/lib/service-catalog';
import { callsEnabled, phoneContact } from '@/lib/site-config';

const captions: Record<ServiceId, string> = {
  'local-towing': 'Local breakdown transport',
  'heavy-duty-towing': 'Heavy vehicle transport',
  'motorcycle-towing': 'Motorcycle transport',
  'battery-boost': 'Help for a discharged battery',
  'winch-out': 'Stuck in snow or mud?',
  'flat-tire': 'Find the right next step',
  'flat-tire-help': 'Fit your usable spare',
  'lockout': 'Keys locked inside?',
  'fuel-delivery': 'Fuel when you run low',
  'battery-replacement': 'Check battery fitment',
  'tire-repair': 'A repair assessment first',
};

export function CompactServiceGrid({ items }: { items: readonly Service[] }) {
  return <div className="service-list" role="region" aria-label="Service options">
    {items.map(service => <article className="service-list-item" key={service.id}>
      <Link href={`/services/${service.id}`} aria-labelledby={`service-${service.id}`}>
        <span className="service-card-icon"><ServiceIcon icon={service.icon} size={36} /></span>
        <ArrowUpRight className="service-card-arrow" size={20} aria-hidden="true" />
        <div className="service-card-copy"><h3 id={`service-${service.id}`}>{service.name}</h3><p>{captions[service.id]}</p></div>
      </Link>
    </article>)}
    {callsEnabled && phoneContact && <div className="service-help-card">
      <span className="service-help-icon"><Phone size={27} aria-hidden="true" /></span>
      <h3>Not sure what you need?</h3>
      <a href={phoneContact.href} aria-label={`Call easytowing at ${phoneContact.display}`}><span>{phoneContact.display}</span><ArrowUpRight size={19} aria-hidden="true" /></a>
    </div>}
  </div>;
}
