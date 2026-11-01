import { notFound } from 'next/navigation';
import { services } from '@/lib/content';
import { isLive, siteConfig, pilot } from '@/lib/site-config';
import { pageMetadata, JsonLd, StructuredBreadcrumbs, canonicalSiteUrl } from '@/lib/seo';
import { ServiceLanding } from '@/components/service-landing';
export function generateStaticParams() { return services.filter(s => !isLive || siteConfig.offers.includes(s.id)).map(s => ({service:s.id})); }
export const dynamicParams = false;
type Props = {params: Promise<{service: string}>};
function getService(id: string) { const service = services.find(s => s.id === id); if (!service || (isLive && !siteConfig.offers.includes(id))) notFound(); return service; }
export async function generateMetadata({params}: Props) { const service = getService((await params).service); return pageMetadata(`${service.name} in Winnipeg`, service.description, `/services/${service.id}`); }
export default async function ServicePage({params}: Props) {
  const service = getService((await params).service);
  return <><ServiceLanding service={service} related={services.filter(s => s.id !== service.id && (!isLive || siteConfig.offers.includes(s.id)))} />
    <StructuredBreadcrumbs items={[{name:'Services',path:'/services'},{name:service.name,path:`/services/${service.id}`}]}/>
    {isLive && pilot && <JsonLd data={{'@context':'https://schema.org','@type':'Service',name:service.name,description:service.description,serviceType:service.name,areaServed:siteConfig.areas,provider:{'@id':`${canonicalSiteUrl('/')}#organization`},url:canonicalSiteUrl(`/services/${service.id}`)}}/>}
  </>;
}
