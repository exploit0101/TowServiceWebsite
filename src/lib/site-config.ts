import launch from '../../config/launch.json';
import { launchErrors, markets, type LaunchConfig, type MarketKey } from './launch';
import { resolveSiteConfig } from './configuration';
import { getPhoneContact } from './phone';
export const siteConfig: LaunchConfig = resolveSiteConfig(launch, process.env.CANONICAL_DOMAIN);
export const isLive = process.env.SITE_BUILD_DEPLOYMENT === 'production' && process.env.SITE_DEPLOYMENT === 'production' && launchErrors(siteConfig).length === 0;
export const phoneContact = getPhoneContact(siteConfig.supportPhone,siteConfig.displayPhone);
export const isDemoPhone = siteConfig.phoneMode === 'demo';
export const callsEnabled = Boolean(phoneContact && (isLive || isDemoPhone || siteConfig.phoneMode === 'owner-provided'));
export const pilot = isLive ? markets[siteConfig.pilotMarket as MarketKey] : null;
export const brand = siteConfig.brandName || 'Roadside';
export const callbacksEnabled = isLive && siteConfig.approvals.callbackStaffing &&
  Boolean(process.env.CALLBACK_WEBHOOK_URL && process.env.CALLBACK_WEBHOOK_TOKEN && process.env.RATE_LIMIT_REDIS_URL && process.env.RATE_LIMIT_REDIS_TOKEN && process.env.RATE_LIMIT_HASH_SECRET);
export const indexableRoutes = isLive ? [...new Set(siteConfig.approvedIndexableRoutes)] : [];
