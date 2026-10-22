import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import '@/components/header.css';
import './design.css';
import { Header } from '@/components/header';
import { ArrowUpRight, Phone } from '@/components/icons';
import { Consent } from '@/components/consent';
import { brand, isLive, siteConfig } from '@/lib/site-config';
import { markets, type MarketKey } from '@/lib/launch';
import { JsonLd } from '@/lib/seo';
import { services } from '@/lib/content';
export const metadata: Metadata = { title: { default: `${brand} | Roadside assistance, made clearer`, template: `%s | ${brand}` }, description: 'Understand your next step for battery boosts, flat tire help and eligible local towing.', robots: { index: false, follow: false }, ...(isLive ? { metadataBase: new URL(siteConfig.canonicalDomain), verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined } } : {}) };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pilot = markets[siteConfig.pilotMarket as MarketKey];
  return <html lang="en-CA"><body>
    <a href="#main" className="skip-link">Skip to content</a>
    <Header brand={brand} phone={siteConfig.supportPhone} displayPhone={siteConfig.displayPhone} live={isLive} phoneMode={siteConfig.phoneMode} pilotLabel={pilot?.label || 'Not selected'} />
    <main id="main" tabIndex={-1}>{children}</main>
    <footer className="site-footer"><div className="container"><div className="footer-top"><div className="footer-brand"><Link href="/" className="brand"><span className="brand-mark"><span/><span/><span/></span><span>{brand}<small>ASSISTANCE & TOWING</small></span></Link><p>A difficult moment.<br/>A clearer way forward.</p></div><div><h2>Find your next step</h2>{services.filter(service => !isLive || siteConfig.offers.includes(service.id)).map(service => <Link key={service.id} href={`/services/${service.id}`}>{service.name} <ArrowUpRight size={13}/></Link>)}</div><div><h2>Good to know</h2><Link href="/about">About the service</Link><Link href="/rates-and-disclosures">Rates & disclosures</Link><Link href="/request-help">{isLive ? 'Request help' : 'Request process'}</Link><Link href="/contact">Contact & availability</Link></div><div className="footer-status"><span className="eyebrow">{isLive ? 'SERVICE INFORMATION' : 'BEFORE WE HIT THE ROAD'}</span><p>{isLive ? siteConfig.providerRole : 'This service is being prepared for launch. No bookings or dispatch are available through this preview.'}</p>{isLive && <a href={`tel:${siteConfig.supportPhone}`} className="footer-phone"><Phone size={17}/>{siteConfig.displayPhone}</a>}</div></div>
      <div className="footer-disclosure">{isLive ? `${siteConfig.legalName}. ${siteConfig.providerRole} ${siteConfig.operatorDetails}` : 'Proposed service model: a separately managed call centre coordinates independent service partners. Business identity, coverage and operating arrangements require verification before launch.'}</div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} {brand}{!isLive && ' · Design preview'}</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/accessibility">Accessibility</Link></div></div>
    </div></footer>
    <Consent enabled={isLive && siteConfig.approvals.analytics} />
    {isLive && <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Organization', '@id': `${siteConfig.canonicalDomain}/#organization`, name: brand, legalName: siteConfig.legalName, url: siteConfig.canonicalDomain, telephone: siteConfig.supportPhone, email: siteConfig.supportEmail, description: siteConfig.providerRole }} />}
  </body></html>;
}
