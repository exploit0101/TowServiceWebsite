import { services } from '@/lib/content';
import { pageMetadata, StructuredBreadcrumbs } from '@/lib/seo';
import { isLive, siteConfig } from '@/lib/site-config';
import { ServiceGrid } from '@/components/service-grid';
import { Breadcrumbs, PageIntro, SafetyNote, NextStep } from '@/components/ui';

export const metadata = pageMetadata('Roadside assistance & towing services', 'Explore towing, jump starts, lockouts, tire changes, fuel delivery, battery replacement and tire repair. Read the scope and request availability by phone.', '/services');

export default function ServicesPage() {
  const shown = isLive ? services.filter(service => siteConfig.offers.includes(service.id)) : services;
  return <div className="container subpage"><Breadcrumbs items={[{ label: 'Services' }]}/>
    <PageIntro eyebrow="ONE CALL. THE RIGHT NEXT STEP." title="Roadside services for the unexpected."><p>{isLive ? 'Call to describe the problem, check availability and get a quote. The team confirms the operator and arrival estimate before service.' : 'Explore the full requested service range below. Calling will be the primary way to check availability and arrange help once the phone line and launch details are ready.'}</p></PageIntro>
    <ServiceGrid items={shown} includeCallCard/>
    <SafetyNote/><NextStep/>
    <StructuredBreadcrumbs items={[{ name: 'Services', path: '/services' }]}/>
  </div>;
}
