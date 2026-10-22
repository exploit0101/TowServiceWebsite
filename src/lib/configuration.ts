import type { LaunchConfig } from './launch';

/** Use the same canonical origin for launch checks, rendered metadata and callbacks. */
export function resolveSiteConfig(config: LaunchConfig, canonicalDomainOverride?: string): LaunchConfig {
  let canonicalDomain = canonicalDomainOverride?.trim() || config.canonicalDomain.trim();
  try {
    const url = new URL(canonicalDomain);
    // Preserve invalid input so launchErrors can reject it instead of repairing it.
    if (url.protocol === 'https:' && url.pathname === '/' && !url.search && !url.hash && !url.username && !url.password)
      canonicalDomain = url.origin;
  } catch { /* Validation is handled by the existing launch gate. */ }
  return { ...config, canonicalDomain };
}
