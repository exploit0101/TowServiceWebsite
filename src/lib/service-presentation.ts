import type { ServiceId } from './service-catalog';

/** Concise landing-page copy; full scope stays in the shared service catalogue. */
export const servicePresentation = {
  'local-towing': { lead: 'Car broken down? Arrange local towing with the right equipment and your destination confirmed before the journey.', cue: 'A clearer road ahead.', detail: 'Local breakdown transport' },
  'heavy-duty-towing': { lead: 'A larger vehicle needs the right capacity. Tell us about your truck, load and location to arrange a suitable towing partner.', cue: 'The right capacity matters.', detail: 'Heavy vehicle enquiries' },
  'motorcycle-towing': { lead: 'Your bike deserves suitable transport. Arrange motorcycle towing with loading, securement and destination checked first.', cue: 'Two wheels. A clear plan.', detail: 'Motorcycle transport' },
  'battery-boost': { lead: 'Dead battery? Talk to our team about a jump start and get a clear quote for your vehicle and location.', cue: 'A brighter next step.', detail: 'Battery boost support' },
  'winch-out': { lead: 'Stuck in snow or mud? Describe the ground and vehicle position so a partner can assess safe access and suitable equipment.', cue: 'Find your way forward.', detail: 'Stuck vehicle assessment' },
  'flat-tire': { lead: 'A flat tire needs a practical plan. We can help arrange a usable spare-wheel change or towing when a roadside change is unsuitable.', cue: 'Keep your next step simple.', detail: 'Spare-wheel help or towing' },
  'flat-tire-help': { lead: 'Have a flat and a usable spare? Arrange roadside tire change help, with safe access and wheel compatibility checked first.', cue: 'Your spare. A way forward.', detail: 'Usable spare installation' },
  'lockout': { lead: 'Keys locked in your car? Arrange vehicle access help with an independent partner, subject to ownership and access checks.', cue: 'Help when keys are out of reach.', detail: 'Vehicle access assistance' },
  'fuel-delivery': { lead: 'Out of fuel? Arrange a delivery with the correct fuel type, quantity and total charges confirmed before service.', cue: 'An empty tank. A clear plan.', detail: 'Compatible fuel delivery' },
  'battery-replacement': { lead: 'Need a replacement battery? Discuss compatibility, supply and installation with the team before approving the work.', cue: 'The right battery for your car.', detail: 'Compatibility checked first' },
} satisfies Record<ServiceId, { lead: string; cue: string; detail: string }>;
