import Image from "next/image";
import Link from "next/link";
import { ServiceCarousel } from "@/components/service-carousel";
import { FleetGallery, type FleetImage } from "@/components/fleet-gallery";
import { PrimaryAction } from "@/components/ui";
import {
  ArrowUpRight,
  ArrowRight,
  Phone,
  ClipboardCheck,
  Navigation,
  Check,
} from "@/components/icons";
import { services } from "@/lib/content";
import { publicAssetPath } from "@/lib/asset-path";
import { pageMetadata } from "@/lib/seo";
import {
  isLive,
  pilot,
  siteConfig,
  callsEnabled,
  phoneContact,
} from "@/lib/site-config";

export const metadata = pageMetadata(
  pilot
    ? `Towing & roadside assistance in ${pilot.label}, ${pilot.city}`
    : "Towing & roadside assistance, made easy",
  "Towing, jump starts, lockouts, tire changes, fuel delivery, battery replacement and tire repair. Call easytowing at 672-889-9764 to check availability.",
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
    alt: "AI-generated black easytowing flatbed with a sedan at blue hour",
    label: "Flatbed concept",
    width: 1600,
    height: 900,
    generated: true,
  },
  {
    id: "recovery",
    src: "/images/easytowing-recovery.webp",
    alt: "AI-generated white easytowing wheel-lift truck in daylight",
    label: "Wheel-lift concept",
    width: 1600,
    height: 900,
    generated: true,
  },
];
export default function Home() {
  const shown = isLive
    ? services.filter((service) => siteConfig.offers.includes(service.id))
    : services;
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span />
              TOWING & ROADSIDE ASSISTANCE
            </div>
            <h1>
              Roadside help.
              <br />
              <em>Made easy.</em>
            </h1>
            <p>
              {pilot
                ? `Need help in ${pilot.label}, ${pilot.city}? `
                : "Car trouble? "}
              Tell us what happened. Call to check availability, get a quote and
              confirm your next step.
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
          </div>
          <figure className="hero-visual">
            <Image
              src={publicAssetPath("/images/easytowing-flatbed.webp")}
              alt="White easytowing flatbed truck carrying a grey SUV"
              width={1448}
              height={1086}
              sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1280px) 52vw, 650px"
              preload
            />
            <figcaption>
              <span className="photo-caption">Rebranded vehicle image</span>
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
            One number. Seven services.
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
                FLEET GALLERY
              </div>
              <h2>A closer look.</h2>
            </div>
            <p>
              Rebranded photos & generated concepts.
              <br />
              Independent partners supply service vehicles.
            </p>
          </div>
          <FleetGallery images={images} />
        </div>
      </section>
      <section id="how-it-works" className="section container process-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span />
              HOW IT WORKS
            </div>
            <h2>One call. A clear plan.</h2>
          </div>
          <Link href="/about" className="text-link">
            About easytowing
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <ol className="process-grid">
          <li>
            <span className="step-number">01</span>
            <div>
              <h3>Tell us what’s wrong</h3>
              <p>Your vehicle, the problem and your general location.</p>
            </div>
          </li>
          <li>
            <span className="step-number">02</span>
            <div>
              <h3>Confirm your quote</h3>
              <p>
                Check the operator, total price, service and arrival estimate.
              </p>
            </div>
          </li>
          <li>
            <span className="step-number">03</span>
            <div>
              <h3>Agree on the next step</h3>
              <p>A partner accepts the job before dispatch is confirmed.</p>
            </div>
          </li>
        </ol>
        <p className="provider-note">
          {isLive
            ? siteConfig.providerRole
            : "Proposed service model: a call centre coordinates independent partners who carry out on-site work."}
        </p>
      </section>
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
