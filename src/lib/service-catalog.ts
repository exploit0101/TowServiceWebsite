/** Canonical service IDs shared by content, launch approval and request validation. */
export const serviceIds = [
  'local-towing',
  'battery-boost',
  'lockout',
  'flat-tire-help',
  'fuel-delivery',
  'battery-replacement',
  'tire-repair',
] as const;

export type ServiceId = typeof serviceIds[number];

export type ServiceIconName =
  | 'truck'
  | 'battery'
  | 'lockout'
  | 'tire'
  | 'fuel'
  | 'battery-replacement'
  | 'tire-repair';
