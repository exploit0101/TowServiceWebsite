import Link from 'next/link';
import { ServiceIcon } from './service-icon';
import type { Service } from '@/lib/content';

export function CompactServiceGrid({ items }: { items: readonly Service[] }) {
  return <div className="service-list" role="region" aria-label="Service options">
    {items.map(service => <article className="service-list-item" key={service.id}>
      <Link href={`/services/${service.id}`}><ServiceIcon icon={service.icon} /><h3>{service.name}</h3></Link>
    </article>)}
  </div>;
}
