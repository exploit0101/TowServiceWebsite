import type { LaunchConfig } from './launch';

export function getDocumentedArrivalEstimate(estimate?: LaunchConfig['arrivalEstimate']) {
  return estimate && estimate.confirmationSource.trim() && estimate.confirmedAt && Number.isInteger(estimate.minutes) && estimate.minutes > 0 && ['measured', 'target'].includes(estimate.status)
    ? estimate : undefined;
}
