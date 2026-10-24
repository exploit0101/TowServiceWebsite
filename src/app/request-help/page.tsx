import Link from "next/link";
import { RequestForm } from "@/components/request-form";
import {
  Breadcrumbs,
  PageIntro,
  SafetyNote,
  PrimaryAction,
} from "@/components/ui";
import { callbacksEnabled, siteConfig, phoneContact } from "@/lib/site-config";
import { pageMetadata, StructuredBreadcrumbs } from "@/lib/seo";
export const metadata = pageMetadata(
  "Request towing & roadside help in Winnipeg",
  "Call easytowing for Winnipeg towing and roadside assistance. Describe your vehicle and location, confirm the service and get a quote.",
  "/request-help",
);
export default function RequestHelp() {
  return (
    <div className="container subpage">
      <Breadcrumbs items={[{ label: "Request help" }]} />
      <PageIntro
        eyebrow="WINNIPEG ROADSIDE HELP"
        title="Need help? Start with a call."
      >
        <p>
          Tell us your vehicle, what happened and where you are in Winnipeg.
          Confirm the service, quote and arrival estimate on your call.
        </p>
      </PageIntro>
      <div className="content-grid request-grid">
        {callbacksEnabled ? (
          <RequestForm enabled offers={siteConfig.offers} />
        ) : (
          <section className="contact-card">
            <h2>Call easytowing 24/7</h2>
            {phoneContact && (
              <a href={phoneContact.href}>{phoneContact.display}</a>
            )}
            <p>
              For car trouble, towing, a flat tire, a no-start or keys locked
              inside, speak to the team directly.
            </p>
            <div className="request-call-action">
              <PrimaryAction label="Call for roadside help" />
            </div>
          </section>
        )}
        <aside className="service-sidebar">
          <div className="eyebrow">BEFORE YOUR CALL</div>
          <h2>A few details help.</h2>
          <ul>
            <li>Your vehicle make, model and the problem.</li>
            <li>Your pickup location and safe access.</li>
            <li>Your preferred destination if you need a tow.</li>
          </ul>
          <p>
            <Link href="/rates-and-disclosures" className="text-link">
              Quotes & service information
            </Link>
          </p>
        </aside>
      </div>
      <SafetyNote />
      <StructuredBreadcrumbs
        items={[{ name: "Request help", path: "/request-help" }]}
      />
    </div>
  );
}
