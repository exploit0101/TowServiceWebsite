import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isLive, siteConfig, pilot } from '@/lib/site-config';
import { services } from '@/lib/content';
import { pageMetadata, StructuredBreadcrumbs } from '@/lib/seo';
import { Breadcrumbs, PageIntro, SafetyNote, NextStep } from '@/components/ui';
type Props = {params:Promise<{area:string}>};
export function generateStaticParams() { return isLive ? [{area:siteConfig.pilotMarket}] : []; }
function check(area:string) { if (!isLive || !pilot || area !== siteConfig.pilotMarket) notFound(); return pilot; }
export async function generateMetadata({params}:Props) { const selected = check((await params).area); return pageMetadata(`Roadside help in ${selected.label}`, `Check roadside dispatch availability in the verified ${selected.label} service zone in ${selected.city}.`, `/areas/${siteConfig.pilotMarket}`); }
export default async function AreaPage({params}:Props) {
  const selected = check((await params).area);
  return <div className="container subpage"><Breadcrumbs items={[{label:selected.label}]}/><PageIntro eyebrow={`${selected.city.toUpperCase()} · ${selected.province.toUpperCase()}`} title={`Roadside help in ${selected.label}.`}><p>Call to check your specific location, partner availability and a quote before agreeing to service.</p></PageIntro><div className="content-grid"><section className="content-block"><h2>Verified service zone</h2><ul>{siteConfig.areas.map(area => <li key={area}>{area}</li>)}</ul><p>Being inside the service zone does not guarantee immediate availability. Access, weather and available operators affect whether a job can be accepted.</p><h2>Available service types</h2><ul>{services.filter(service => siteConfig.offers.includes(service.id)).map(service => <li key={service.id}><Link href={`/services/${service.id}`}>{service.name}</Link> — {service.description}</li>)}</ul></section><aside className="service-sidebar"><div className="eyebrow">DISPATCH INFORMATION</div><h2>Check before you travel.</h2><p>Dispatch hours: {siteConfig.serviceHours} ({selected.timezone}).</p><p>{siteConfig.providerRole}</p><p>{siteConfig.operatorDetails}</p><p>No customer-facing depot or physical office is represented by this coverage page.</p></aside></div><SafetyNote/><NextStep/><StructuredBreadcrumbs items={[{name:selected.label,path:`/areas/${siteConfig.pilotMarket}`}]} /></div>;
}
