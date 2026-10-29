/** Primary homepage categories in the owner's requested display order. */
export const homepageServiceIds = [
  'local-towing',
  'heavy-duty-towing',
  'motorcycle-towing',
  'battery-boost',
  'winch-out',
  'flat-tire',
  'flat-tire-help',
  'lockout',
  'fuel-delivery',
] as const;

/** Canonical IDs shared by content, launch approval and request validation. */
export const serviceIds = [
  ...homepageServiceIds,
  'battery-replacement',
] as const;

export type ServiceId = typeof serviceIds[number];

export type ServiceIconName =
  | 'truck'
  | 'heavy-duty'
  | 'motorcycle'
  | 'battery'
  | 'winch'
  | 'flat-tire'
  | 'lockout'
  | 'tire'
  | 'fuel'
  | 'battery-replacement';
