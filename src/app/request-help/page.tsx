import { AssistanceSection } from "@/components/assistance-section";
import {
  Breadcrumbs,
  PageIntro,
  SafetyNote,
} from "@/components/ui";
import { pageMetadata, StructuredBreadcrumbs } from "@/lib/seo";
export const metadata = pageMetadata(
  "Request towing & roadside help in Winnipeg",
  "Call easytowing or send a service enquiry for Winnipeg towing and roadside assistance. Share your vehicle, location and the help you need.",
  "/request-help",
);
export default function RequestHelp() {
  return (
    <div className="container subpage">
      <Breadcrumbs items={[{ label: "Request help" }]} />
      <PageIntro
        eyebrow="WINNIPEG ROADSIDE HELP"
        title="Let’s get you moving."
      >
        <p>
          Call for urgent help or send a service enquiry. Confirm the service,
          quote and arrival estimate with the team.
        </p>
      </PageIntro>
      <AssistanceSection />
      <SafetyNote />
      <StructuredBreadcrumbs
        items={[{ name: "Request help", path: "/request-help" }]}
      />
    </div>
  );
}
