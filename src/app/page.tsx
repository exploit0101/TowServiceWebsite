import { CompactServiceGrid } from "@/components/compact-service-grid";
import { FleetGallery, type FleetImage } from "@/components/fleet-gallery";
import { PrimaryAction } from "@/components/ui";
import { AvailabilityBadge } from "@/components/availability-badge";
import { CustomerReviews } from "@/components/customer-reviews";
import { BrandMark } from "@/components/brand-logo";
import { AssistanceSection } from "@/components/assistance-section";
import { ArrowDown, Clock3, MapPin, ShieldCheck, Timer, Star, Mail } from 'lucide-react';
import { WhatsAppIcon } from '@/components/whatsapp-link';
import { whatsappLink } from '@/lib/contact';
import { getDocumentedArrivalEstimate } from '@/lib/arrival';
import { customerReviews, hasPublishableReviews } from '@/lib/reviews';
import { services } from "@/lib/content";
import { homepageServiceIds } from "@/lib/service-catalog";
import { getAvailability } from "@/lib/availability";
import { pageMetadata } from "@/lib/seo";
import {
  isLive,
  siteConfig,
  callsEnabled,
} from "@/lib/site-config";

export const metadata = pageMetadata(
  "Winnipeg towing & roadside assistance",
  `Towing and roadside assistance across Winnipeg. Car, motorcycle and heavy duty towing, jump starts, tires, lockouts and fuel. Call${getAvailability(siteConfig.availability).dispatch24h ? " 24/7" : ""} ${siteConfig.displayPhone}.`,
  "/",
);
const images: FleetImage[] = [
  {
    id: "flatbed",
    src: "/images/easytowing-flatbed.webp",
    alt: "White easytowing flatbed truck carrying a grey SUV",
    label: "Flatbed transport",
    width: 1448,
    height: 1086,
  },
  {
    id: "highway",
    src: "/images/easytowing-highway.webp",
    alt: "Black easytowing flatbed carrying a grey sedan on a road",
    label: "Vehicle transport",
    width: 1448,
    height: 1086,
  },
  {
    id: "wheel-lift",
    src: "/images/easytowing-wheel-lift.webp",
    alt: "Black easytowing wheel-lift truck with a grey sedan",
    label: "Wheel-lift equipment",
    width: 1600,
    height: 900,
  },
  {
    id: "loading",
    src: "/images/easytowing-loading.webp",
    alt: "A sedan secured on an easytowing flatbed",
    label: "Flatbed loading",
    width: 1600,
    height: 900,
  },
  {
    id: "flatbed-night",
    src: "/images/easytowing-flatbed-night.webp",
    alt: "Black easytowing flatbed transporting a sedan at dusk",
    label: "Flatbed towing",
    width: 1600,
    height: 900,
    generated: true,
  },
  {
    id: "recovery",
    src: "/images/easytowing-recovery.webp",
    alt: "White easytowing wheel-lift truck with a sedan in daylight",
    label: "Wheel-lift towing",
    width: 1600,
    height: 900,
    generated: true,
  },
];
export default function Home() {
  const arrival = getDocumentedArrivalEstimate(siteConfig.arrivalEstimate);
  const availability = getAvailability(siteConfig.availability);
  const shown = [...homepageServiceIds, 'battery-replacement', 'tire-repair'].flatMap((id) =>
    services.filter(
      (service) =>
        service.id === id && (!isLive || siteConfig.offers.includes(id)),
    ),
  );
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-brand-watermark" aria-hidden="true"><BrandMark hero/></div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-status-row">
              <AvailabilityBadge config={siteConfig.availability} />
              {hasPublishableReviews(customerReviews) && <a className="hero-rating" href="#reviews" aria-label={`${customerReviews.rating} out of 5. Rating supplied by EasyTowing. Read customer feedback.`}>
                <Star size={16} aria-hidden="true"/><strong>{customerReviews.rating?.toFixed(1)}/5</strong>
              </a>}
            </div>
            <h1>
              Winnipeg towing.
              <br />
              <em>Made easy.</em>
            </h1>
            <p className="hero-summary">24/7 roadside help. A clear quote. One call.</p>
            <div className="hero-actions">
              <PrimaryAction label="Call for roadside help" />
              {callsEnabled && whatsappLink(siteConfig.supportPhone) && <a className="hero-contact-icon hero-whatsapp" href={whatsappLink(siteConfig.supportPhone)!} target="_blank" rel="noopener noreferrer" aria-label="Message easytowing on WhatsApp (opens in a new tab)" title="Message us on WhatsApp"><WhatsAppIcon /></a>}
              {siteConfig.supportEmail && <a className="hero-contact-icon hero-email" href={`mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent('Roadside assistance enquiry')}`} aria-label={`Email easytowing at ${siteConfig.supportEmail}`} title={siteConfig.supportEmail}><Mail size={22} aria-hidden="true" /></a>}
            </div>
            <ul className="hero-highlights">
              <li><Clock3 aria-hidden="true"/><span><strong>{availability.dispatch24h ? 'Open 24 hours' : 'Call for availability'}</strong><small>{availability.dispatch24h ? '7 days a week' : 'Discuss dispatch timing'}</small></span></li>
              <li><MapPin aria-hidden="true"/><span><strong>Winnipeg</strong><small>Citywide service</small></span></li>
              <li><ShieldCheck aria-hidden="true"/><span><strong>{siteConfig.approvals.partnerCredentialsAndInsurance ? 'Licensed & insured' : 'Independent'}</strong><small>Service partners</small></span></li>
              <li><Timer aria-hidden="true"/><span><strong>{arrival ? `${arrival.minutes}-minute arrival ${arrival.status === 'target' ? 'target' : 'estimate'}` : 'Arrival estimate'}</strong><small>Confirm timing on your call</small></span></li>
            </ul>
            <p className="hero-note">Independent partners perform service. Arrival varies with conditions.</p>
          </div>
          <a className="hero-explore" href="#services"><span><ArrowDown size={19} aria-hidden="true" /></span>Explore services</a>
        </div>
      </section>
      <section id="services" className="section container">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span />ROADSIDE HELP, MADE EASY</div>
            <h2>Our services<span className="services-heading-dot" aria-hidden="true">.</span></h2>
          </div>
          <p>Choose a service. Call for availability and a quote.</p>
        </div>
        <CompactServiceGrid items={shown} />
      </section>
      <section id="fleet" className="fleet-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span />
                VEHICLE GALLERY
              </div>
              <h2>A closer look.</h2>
            </div>
            <p>
              Images illustrate vehicle types.
              <br />
              Independent partners perform on-site service.
            </p>
          </div>
          <FleetGallery images={images} />
        </div>
      </section>
      <CustomerReviews />
      <section id="contact" className="contact-section">
        <div className="container">
          <AssistanceSection />
          <p className="safety-line">
            <strong>In immediate danger? Call 911.</strong> Use this site only
            when safely stopped, away from active traffic.
          </p>
        </div>
      </section>
    </div>
  );
}
