import Link from 'next/link';
import { notFound } from 'next/navigation';
import { services } from '@/lib/content';
import { isLive, siteConfig, pilot } from '@/lib/site-config';
import { pageMetadata, JsonLd, StructuredBreadcrumbs } from '@/lib/seo';
import { Breadcrumbs, PageIntro, SafetyNote, NextStep, PrimaryAction } from '@/components/ui';
import { ArrowUpRight } from '@/components/icons';
export function generateStaticParams() { return services.filter(s => !isLive || siteConfig.offers.includes(s.id)).map(s => ({service:s.id})); }
export const dynamicParams = false;
type Props = {params: Promise<{service: string}>};
function getService(id: string) { const service = services.find(s => s.id === id); if (!service || (isLive && !siteConfig.offers.includes(id))) notFound(); return service; }
export async function generateMetadata({params}: Props) { const service = getService((await params).service); return pageMetadata(`${service.name}${pilot ? ` in ${pilot.label}` : ''}`, service.description, `/services/${service.id}`); }
export default async function ServicePage({params}: Props) {
  const service = getService((await params).service);
  return <div className="container subpage"><Breadcrumbs items={[{label:'Services',href:'/services'},{label:service.name}]}/><PageIntro eyebrow={service.tag} title={service.title}><p>{service.intro}</p></PageIntro>
    {!isLive && <div className="notice"><strong>Planned service · not available to book</strong>This preview explains intended service scope. Coverage, operator arrangements and operating hours are not yet verified.</div>}
    <div className="content-grid"><div><section className="content-block"><h2>What this service covers</h2><ul>{service.scope.map(line => <li key={line}>{line}</li>)}</ul></section><section className="content-block"><h2>Before you agree to service</h2><p>Ask for the actual operator’s name, what they will do, the quote, applicable taxes and any possible extra fees. Confirm who is responsible for consent, invoicing and complaints. Only approve work you understand.</p><p>Arrival time depends on safe access, road conditions and available operators. A website request does not mean a partner has accepted or been dispatched.</p><Link href="/rates-and-disclosures">Read about quotes and service disclosures</Link></section><section className="content-block"><h2>Know the limits</h2><p>{service.limit}</p></section></div><aside className="service-sidebar"><div className="eyebrow">BEFORE YOU CALL</div><h2>A little information helps.</h2><ul>{service.prepare.map(line => <li key={line}>{line}</li>)}</ul><PrimaryAction/></aside></div>
    <SafetyNote/><section className="related-services"><h2>Looking for something else?</h2><div className="related-links">{services.filter(s => s.id !== service.id && (!isLive || siteConfig.offers.includes(s.id))).map(s => <Link className="text-link" href={`/services/${s.id}`} key={s.id}>{s.name}<ArrowUpRight size={17}/></Link>)}</div></section><NextStep/>
    <StructuredBreadcrumbs items={[{name:'Services',path:'/services'},{name:service.name,path:`/services/${service.id}`}]}/>
    {isLive && pilot && <JsonLd data={{'@context':'https://schema.org','@type':'Service',name:service.name,description:service.description,serviceType:service.name,areaServed:siteConfig.areas,provider:{'@id':`${siteConfig.canonicalDomain}/#organization`},url:new URL(`/services/${service.id}`, siteConfig.canonicalDomain).href}}/>}
  </div>;
}
