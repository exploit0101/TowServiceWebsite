import Image from "next/image";
import Link from "next/link";
import { ServiceCarousel } from "@/components/service-carousel";
import { FleetGallery, type FleetImage } from "@/components/fleet-gallery";
import { PrimaryAction } from "@/components/ui";
import { AvailabilityBadge } from "@/components/availability-badge";
import { CustomerReviews } from "@/components/customer-reviews";
import { ArrivalEstimate } from "@/components/arrival-estimate";
import {
  ArrowUpRight,
  ArrowRight,
  Phone,
  ClipboardCheck,
  Navigation,
  Check,
} from "@/components/icons";
import { services } from "@/lib/content";
import { homepageServiceIds } from "@/lib/service-catalog";
import { getAvailability } from "@/lib/availability";
import { publicAssetPath } from "@/lib/asset-path";
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
  const shown = homepageServiceIds.flatMap((id) =>
    services.filter(
      (service) =>
        service.id === id && (!isLive || siteConfig.offers.includes(id)),
    ),
  );
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <AvailabilityBadge config={siteConfig.availability} />
            <div className="eyebrow">
              <span />
              TOWING & ROADSIDE ASSISTANCE
            </div>
            <h1>
              Winnipeg towing.
              <br />
              <em>Made easy.</em>
            </h1>
            <p>
              Car trouble anywhere in Winnipeg? Call for towing or roadside
              assistance, a clear quote and an arrival estimate.
            </p>
            <div className="hero-actions">
              <PrimaryAction label="Call for roadside help" />
              <Link href="#services" className="text-link">
                Our services
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <div className="hero-promise">
              <Check size={17} aria-hidden="true" />
              <span>Confirm the price before you agree to service.</span>
            </div>
            <ArrivalEstimate estimate={siteConfig.arrivalEstimate} />
          </div>
          <figure className="hero-visual">
            <Image
              src={publicAssetPath("/images/easytowing-flatbed.webp")}
              alt="White easytowing flatbed truck carrying a grey SUV"
              width={1448}
              height={1086}
              sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1280px) 52vw, 650px"
              preload
              fetchPriority="high"
            />
            <figcaption>
              <span className="hero-photo-tag">
                <Navigation size={19} aria-hidden="true" />A way forward.
              </span>
            </figcaption>
          </figure>
        </div>
      </section>
      <div className="trust-strip">
        <div className="container">
          <span>
            <ClipboardCheck size={21} aria-hidden="true" />
            Quote before service
          </span>
          <span>
            <Phone size={21} aria-hidden="true" />
            One number. Nine services.
          </span>
          <span>
            <Navigation size={21} aria-hidden="true" />
            Availability confirmed by phone
          </span>
        </div>
      </div>
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
          <div className="contact-panel">
            <div>
              <div className="eyebrow">
                <span />
                LET’S GET YOU MOVING
              </div>
              <h2>
                Car trouble?
                <br />
                Start with a call.
              </h2>
              <p>
                Discuss your vehicle and location.
                <br />
                Confirm availability before making plans.
              </p>
            </div>
            <div className="contact-action">
              {callsEnabled && phoneContact && (
                <>
                  <span>CALL OR DIAL DIRECTLY</span>
                  <a className="contact-number" href={phoneContact.href}>
                    {phoneContact.display}
                    <ArrowUpRight size={27} aria-hidden="true" />
                  </a>
                </>
              )}
              <PrimaryAction label="Call easytowing" />
              <Link href="/contact" className="text-link">
                Contact & service information
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <p className="safety-line">
            <strong>In immediate danger? Call 911.</strong> Use this site only
            when safely stopped, away from active traffic.
          </p>
        </div>
      </section>
    </div>
  );
}
