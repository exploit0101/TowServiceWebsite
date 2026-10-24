import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "@/components/service-carousel.css";
import "@/components/service-ticker.css";
import "@/components/brand.css";
import "@/components/customer-reviews.css";
import "@/components/contact-form.css";
import "@/components/theme.css";
import { themeInitializationScript } from '@/lib/theme';
import { BrandLogo } from "@/components/brand-logo";
import { ServiceTicker } from "@/components/service-ticker";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { services } from "@/lib/content";
import { Header } from "@/components/header";
import { Phone, ArrowUpRight } from "@/components/icons";
import { Consent } from "@/components/consent";
import {
  brand,
  isLive,
  callsEnabled,
  phoneContact,
  siteConfig,
} from "@/lib/site-config";
import { JsonLd, canonicalSiteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: `${brand} | Towing & roadside assistance`,
    template: `%s | ${brand}`,
  },
  description:
    "Towing and roadside assistance options. Call easytowing to discuss your vehicle, check availability and request a quote.",
  robots: { index: false, follow: false },
  ...(isLive
    ? {
        metadataBase: new URL(siteConfig.canonicalDomain),
        verification: {
          google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
        },
      }
    : {}),
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA" data-theme="light" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html: themeInitializationScript}}/></head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="site-chrome">
        <ServiceTicker items={services.filter(service => !isLive || siteConfig.offers.includes(service.id)).map(({ id, name }) => ({ id, name }))} />
        <Header
          brand={brand}
          phone={siteConfig.supportPhone}
          displayPhone={siteConfig.displayPhone}
          live={isLive}
          phoneMode={siteConfig.phoneMode}
          pilotLabel=""
        />
        </div>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="site-footer">
          <div className="container">
            <div className="footer-top">
              <Link href="/" className="brand">
                <BrandLogo name={brand}/>
              </Link>
              <nav aria-label="Footer navigation">
                <Link href="/services">Services</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/rates-and-disclosures">Rates & disclosures</Link>
              </nav>
              {callsEnabled && phoneContact && (
                <a href={phoneContact.href} className="footer-phone">
                  <Phone size={19} aria-hidden="true" />
                  {phoneContact.display}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              )}
            </div>
            <p className="footer-disclosure">
              {isLive
                ? `${siteConfig.legalName}. ${siteConfig.providerRole}`
                : siteConfig.providerRole}
            </p>
            <div className="footer-bottom">
              <span>
                © {new Date().getFullYear()} {brand}
              </span>
              <nav aria-label="Legal information">
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
                <Link href="/accessibility">Accessibility</Link>
              </nav>
              {callsEnabled && <WhatsAppLink phone={siteConfig.supportPhone} />}
            </div>
          </div>
        </footer>
        {callsEnabled && phoneContact && (
          <a
            className="floating-call"
            href={phoneContact.href}
          >
            <span className="floating-call-icon">
              <Phone size={22} aria-hidden="true" />
            </span>
            <span>
              <small>CALL EASYTOWING</small>
              <strong>{phoneContact.display}</strong>
            </span>
            <ArrowUpRight size={19} aria-hidden="true" />
          </a>
        )}
        <Consent enabled={isLive && siteConfig.approvals.analytics} />
        {isLive && (
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${canonicalSiteUrl("/")}#organization`,
              name: brand,
              legalName: siteConfig.legalName,
              url: canonicalSiteUrl("/"),
              telephone: siteConfig.supportPhone,
              ...(siteConfig.supportEmail
                ? { email: siteConfig.supportEmail }
                : {}),
              description: siteConfig.providerRole,
            }}
          />
        )}
      </body>
    </html>
  );
}
