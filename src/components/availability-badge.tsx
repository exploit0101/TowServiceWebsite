import { Clock3 } from "./icons";
import { getAvailability, type AvailabilityConfig } from "@/lib/availability";

export function AvailabilityBadge({ config }: { config?: AvailabilityConfig }) {
  const availability = getAvailability(config);
  return (
    <div
      className={`availability-badge${availability.confirmed ? " is-confirmed" : ""}`}
    >
      <span className="availability-icon">
        <Clock3 size={17} aria-hidden="true" />
      </span>
      <span>{availability.label}</span>
      {availability.confirmed && (
        <span className="availability-dot" aria-hidden="true" />
      )}
    </div>
  );
}
