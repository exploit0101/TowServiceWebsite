export type AvailabilityConfig = {
  callLine24hConfirmed: boolean;
  partnerDispatch24hConfirmed: boolean;
  confirmedAt: string;
  confirmationSource: string;
};

/** Hours are an owner-confirmed claim, separate from per-job acceptance and ETA. */
export function getAvailability(config?: AvailabilityConfig) {
  const documented = Boolean(
    config?.confirmationSource.trim() &&
    /^\d{4}-\d{2}-\d{2}$/.test(config.confirmedAt),
  );
  const calls = documented && config?.callLine24hConfirmed === true;
  const dispatch = calls && config?.partnerDispatch24hConfirmed === true;
  return {
    label: dispatch
      ? "Available 24/7"
      : calls
        ? "Calls answered 24/7"
        : "Call to check availability",
    confirmed: calls,
    dispatch24h: dispatch,
  };
}
