import { serviceIds } from './service-catalog';
import { getPhoneContact } from './phone';
import type { AvailabilityConfig } from './availability';
export { serviceIds } from './service-catalog';
export const markets = {
  'winnipeg-bridgwater': { label: 'Bridgwater / Waverley West', city: 'Winnipeg', province: 'Manitoba', timezone: 'America/Winnipeg' },
  'winnipeg-transcona': { label: 'Transcona', city: 'Winnipeg', province: 'Manitoba', timezone: 'America/Winnipeg' },
  'brampton-bramalea': { label: 'Bramalea', city: 'Brampton', province: 'Ontario', timezone: 'America/Toronto' },
} as const;
export type MarketKey = keyof typeof markets;
export type LaunchConfig = {
  businessStatus: string; brandName: string; legalName: string; providerRole: string;
  supportPhone: string; displayPhone: string; phoneMode: string; supportEmail: string; canonicalDomain: string;
  pilotMarket: string; serviceHours: string; physicalOfficeVerified: boolean;
  availability?: AvailabilityConfig;
  areas: string[]; offers: string[]; prices: string[]; certifications: string[];
  operatorDetails: string; approvedIndexableRoutes: string[];
  approvals: Record<string, boolean>;
};
export const coreRoutes = ['/', '/services', '/request-help', '/about', '/contact', '/rates-and-disclosures', '/privacy', '/terms', '/accessibility'];
export function launchErrors(config: LaunchConfig): string[] {
  const errors: string[] = [];
  for (const field of ['brandName', 'legalName', 'providerRole', 'serviceHours', 'operatorDetails'] as const)
    if (!config[field].trim()) errors.push(`${field} must be verified and configured.`);
  if (config.businessStatus !== 'operating') errors.push('Business must be approved as operating.');
  if (!/^\+1[2-9]\d{9}$/.test(config.supportPhone)) errors.push('A verified Canadian E.164 phone is required.');
  if (!config.displayPhone.trim()) errors.push('A readable displayPhone is required.');
  if (config.phoneMode !== 'verified') errors.push('Confirm the owner-provided phone as a verified, monitored service line before production.');
  if (config.supportPhone && config.displayPhone && !getPhoneContact(config.supportPhone,config.displayPhone)) errors.push('The dial target and displayed phone number must be valid and match.');
  if (/^\+1[2-9]\d{2}55501\d{2}$/.test(config.supportPhone)) errors.push('Reserved demonstration phone numbers cannot be used for a live service.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.supportEmail)) errors.push('A verified support email is required.');
  try {
    const url = new URL(config.canonicalDomain);
    if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password || !url.hostname.includes('.') || /localhost|example\.|\.invalid$/.test(url.hostname)) throw new Error();
  } catch { errors.push('A real HTTPS canonical origin is required.'); }
  if (!Object.hasOwn(markets, config.pilotMarket)) errors.push('Owner must explicitly select a valid PILOT_MARKET.');
  if (!config.areas.length || config.areas.some(area => !area.trim())) errors.push('Confirm the specific partner service zone.');
  if (!config.offers.length || config.offers.some(id => !serviceIds.includes(id as typeof serviceIds[number]))) errors.push('Approve at least one supported service.');
  if (!config.prices.length) errors.push('Approve quote / rate and fee disclosures.');
  for (const key of ['identity', 'monitoredCanadianPhone', 'partnerCoverage', 'provincialCompliance', 'partnerCredentialsAndInsurance', 'ratesAndConsent', 'privacyAndRetention', 'legalTexts'])
    if (config.approvals[key] !== true) errors.push(`Approval missing: ${key}.`);
  if (config.pilotMarket === 'brampton-bramalea' && !config.approvals.restrictedHighwayHandling) errors.push('Ontario restricted-highway handling must be approved.');
  const allowed = [...coreRoutes, ...config.offers.map(id => `/services/${id}`), `/areas/${config.pilotMarket}`];
  if (!config.approvedIndexableRoutes.includes('/')) errors.push('Approve the homepage for indexing.');
  if (config.approvedIndexableRoutes.some(route => !allowed.includes(route))) errors.push('Indexable routes contain an unavailable or unapproved page.');
  return errors;
}
