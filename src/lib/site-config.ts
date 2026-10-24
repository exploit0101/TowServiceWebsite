import launch from '../../config/launch.json';
import { launchErrors, markets, type LaunchConfig, type MarketKey } from './launch';
import { resolveSiteConfig } from './configuration';
import { getPhoneContact } from './phone';
export const siteConfig: LaunchConfig = resolveSiteConfig(launch, process.env.CANONICAL_DOMAIN);
export const isStaticHost = process.env.SITE_BUILD_STATIC_HOST === 'github-pages';
export const isLive = process.env.SITE_BUILD_DEPLOYMENT === 'production' && (process.env.SITE_DEPLOYMENT === 'production' || isStaticHost) && launchErrors(siteConfig).length === 0;
export const phoneContact = getPhoneContact(siteConfig.supportPhone,siteConfig.displayPhone);
export const isDemoPhone = siteConfig.phoneMode === 'demo';
export const callsEnabled = Boolean(phoneContact && (isLive || isDemoPhone || siteConfig.phoneMode === 'owner-provided' || siteConfig.phoneMode === 'verified'));
export const pilot = isLive ? markets[siteConfig.pilotMarket as MarketKey] : null;
export const brand = siteConfig.brandName || 'Roadside';
export const callbacksEnabled = isLive && !isStaticHost && siteConfig.approvals.callbackStaffing &&
  Boolean(process.env.CALLBACK_WEBHOOK_URL && process.env.CALLBACK_WEBHOOK_TOKEN && process.env.RATE_LIMIT_REDIS_URL && process.env.RATE_LIMIT_REDIS_TOKEN && process.env.RATE_LIMIT_HASH_SECRET);
export const indexableRoutes = isLive ? [...new Set(siteConfig.approvedIndexableRoutes)] : [];
