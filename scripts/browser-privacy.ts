import type { BrowserContext } from '@playwright/test';

/** Layout/contact QA must never opt a visitor into measurement or send test conversions. */
export async function prepareBrowserPrivacy(context: BrowserContext) {
  await context.addInitScript(() => { try { sessionStorage.setItem('easytowing.measurement.v1', 'none'); } catch { /* No storage. */ } });
  await context.route(/https:\/\/[^/]*(?:googletagmanager|google-analytics|googleadservices|doubleclick)\.(?:com|net)\//, route => route.abort());
}
