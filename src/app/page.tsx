import Link from "next/link";
import { ServiceCarousel } from "@/components/service-carousel";
import { FleetGallery, type FleetImage } from "@/components/fleet-gallery";
import { PrimaryAction } from "@/components/ui";
import { AvailabilityBadge } from "@/components/availability-badge";
import { CustomerReviews } from "@/components/customer-reviews";
import { BrandMark } from "@/components/brand-logo";
import { AssistanceSection } from "@/components/assistance-section";
import {
  ArrowRight,
} from "@/components/icons";
import { Clock3, MapPin, ShieldCheck, Timer, Star } from 'lucide-react';
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
  phoneContact,
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
  const shown = homepageServiceIds.flatMap((id) =>
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
            <AvailabilityBadge config={siteConfig.availability} />
            <h1>
              Winnipeg towing.
              <br />
              <em>Made easy.</em>
            </h1>
            <p className="hero-summary">Towing and roadside assistance across Winnipeg. One call for a clear quote and the help you need.</p>
            <div className="hero-actions">
              <PrimaryAction label="Call for roadside help" />
              <Link href="#services" className="text-link">
                Our services
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              {hasPublishableReviews(customerReviews) && <a className="hero-rating" href="#reviews" aria-label={`${customerReviews.rating} out of 5. Rating supplied by EasyTowing. Read customer feedback.`}>
                <Star size={20} aria-hidden="true"/><span><strong>{customerReviews.rating?.toFixed(1)}/5</strong><small>Customer feedback</small></span>
              </a>}
            </div>
            <ul className="hero-highlights">
              <li><Clock3 aria-hidden="true"/><span><strong>{availability.dispatch24h ? 'Open 24 hours' : 'Call for availability'}</strong><small>{availability.dispatch24h ? '7 days a week' : 'Discuss dispatch timing'}</small></span></li>
              <li><MapPin aria-hidden="true"/><span><strong>Winnipeg</strong><small>Citywide service</small></span></li>
              <li><ShieldCheck aria-hidden="true"/><span><strong>{siteConfig.approvals.partnerCredentialsAndInsurance ? 'Licensed & insured' : 'Independent'}</strong><small>Service partners</small></span></li>
              <li><Timer aria-hidden="true"/><span><strong>{arrival ? `${arrival.minutes}-minute arrival ${arrival.status === 'target' ? 'target' : 'estimate'}` : 'Arrival estimate'}</strong><small>Confirm timing on your call</small></span></li>
            </ul>
            <p className="hero-note">Independent partners provide on-site service. Arrival varies with traffic, weather and availability.</p>
          </div>
        </div>
      </section>
      <section id="services" className="section container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span />
              OUR SERVICES
            </div>
            <h2>
              Whatever stopped you,
              <br />
              start here.
            </h2>
          </div>
          <p>
            Choose the help you need.
            <br />
            Call to discuss availability and a quote.
          </p>
        </div>
        <ServiceCarousel
          items={shown}
          phoneHref={callsEnabled ? phoneContact?.href : undefined}
          displayPhone={phoneContact?.display}
        />
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
