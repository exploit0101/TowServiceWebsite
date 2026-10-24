import { Clock3 } from "./icons";
import type { LaunchConfig } from "@/lib/launch";
import { getDocumentedArrivalEstimate } from "@/lib/arrival";

export function ArrivalEstimate({
  estimate,
  tagline = false,
}: {
  estimate?: LaunchConfig["arrivalEstimate"];
  tagline?: boolean;
}) {
  const publishable = getDocumentedArrivalEstimate(estimate);
  if (tagline) return <p className="hero-tagline">Quick roadside help. {publishable ? <strong>{publishable.minutes}-minute arrival {publishable.status === 'target' ? 'target' : 'estimate'}.</strong> : 'Call for an arrival estimate.'}</p>;
  return (
    <div className="arrival-estimate">
      <Clock3 size={18} aria-hidden="true" />
      <span>
        {publishable ? (
          <>
            <strong>
              {publishable.minutes}-minute{" "}
              {publishable.status === "target"
                ? "arrival target"
                : "arrival estimate"}
            </strong>
            <small>
              Confirm timing on your call. Traffic, weather and available
              operators affect arrival.
            </small>
          </>
        ) : (
          <>
            <strong>Arrival estimate on your call</strong>
            <small>Check timing and availability for your location.</small>
          </>
        )}
      </span>
    </div>
  );
}
