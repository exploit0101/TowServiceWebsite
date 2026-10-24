import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Header } from "@/components/header";
import { Phone, ArrowUpRight, Truck } from "@/components/icons";
import { Consent } from "@/components/consent";
import {
  brand,
  isLive,
  callsEnabled,
  phoneContact,
  siteConfig,
} from "@/lib/site-config";
import { JsonLd } from "@/lib/seo";

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
    <html lang="en-CA">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header
          brand={brand}
          phone={siteConfig.supportPhone}
          displayPhone={siteConfig.displayPhone}
          live={isLive}
          phoneMode={siteConfig.phoneMode}
          pilotLabel=""
        />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="site-footer">
          <div className="container">
            <div className="footer-top">
              <Link href="/" className="brand">
                <span className="brand-mark">
                  <Truck size={25} aria-hidden="true" />
                </span>
                <span>
                  {brand}
                  <small>TOWING & ROADSIDE</small>
                </span>
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
                ? `${siteConfig.legalName}. ${siteConfig.providerRole} ${siteConfig.operatorDetails}`
                : "Pre-launch preview. Hours, partner coverage and operating details are being confirmed. A call does not confirm a booking or dispatch."}
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
            </div>
          </div>
        </footer>
        {callsEnabled && phoneContact && (
          <a
            className="floating-call"
            href={phoneContact.href}
            aria-label={`Call easytowing at ${phoneContact.display}`}
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
              "@id": `${siteConfig.canonicalDomain}/#organization`,
              name: brand,
              legalName: siteConfig.legalName,
              url: siteConfig.canonicalDomain,
              telephone: siteConfig.supportPhone,
              email: siteConfig.supportEmail,
              description: siteConfig.providerRole,
            }}
          />
        )}
      </body>
    </html>
  );
}
