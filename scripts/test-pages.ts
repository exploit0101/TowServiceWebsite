import assert from 'node:assert/strict';
import { formspreeEndpoint, whatsappLink } from '../src/lib/contact';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { services } from '../src/lib/content';
import launch from '../config/launch.json';
import { launchErrors } from '../src/lib/launch';
import { resolveSiteConfig } from '../src/lib/configuration';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'pages-out');
const basePath = process.env.GITHUB_PAGES_BASE_PATH || '';
const production = process.env.GITHUB_PAGES_PRODUCTION === '1';
const configured = resolveSiteConfig(launch, process.env.CANONICAL_DOMAIN);
if (production) assert.deepEqual(launchErrors(configured), [], 'Production export requires complete business configuration and approvals');
const availableServices = production ? services.filter(service => configured.offers.includes(service.id)) : services;
const routes = ['/', '/services', ...availableServices.map(service => `/services/${service.id}`), '/request-help', '/about', '/contact', '/rates-and-disclosures', '/privacy', '/terms', '/accessibility', ...(production ? [`/areas/${configured.pilotMarket}`] : [])];
const canonical = (route: string) => new URL(`${basePath}${route === '/' ? '/' : `${route}/`}`, configured.canonicalDomain).href;
const expectedTelephone = `tel:${configured.supportPhone}`;
const titles = new Set<string>();
const descriptions = new Set<string>();
const assets = new Set<string>();
function localFile(url: string) {
  const pathname = decodeURIComponent(new URL(url, 'https://pages.test').pathname);
  assert.ok(!basePath || pathname === basePath || pathname.startsWith(`${basePath}/`), `Missing base path: ${url}`);
  const relative = basePath ? pathname.slice(basePath.length) : pathname;
  const file = resolve(root, `.${relative}`);
  assert.ok(file === root || file.startsWith(root + sep), `Asset leaves output directory: ${url}`);
  assert.ok(existsSync(file), `Missing exported destination: ${url}`);
  return statSync(file).isDirectory() ? join(file, 'index.html') : file;
}
for (const route of routes) {
  const html = readFileSync(localFile(`${basePath}${route}`), 'utf8');
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route}: one H1`);
  const approved = production && configured.approvedIndexableRoutes.includes(route);
  assert.ok(html.includes(`name="robots" content="${approved ? 'index, follow' : 'noindex, nofollow'}"`), `${route}: approved robots metadata`);
  assert.match(html, /independent|coordinat|call centre/i, `${route}: service provider role is visible`);
  assert.ok(!html.includes('DEMO PHONE'),`${route}: demo phone removed`);
  assert.match(html,/easytowing/,`${route}: owner brand`);
  if (production) {
    assert.ok(html.includes(`rel="canonical" href="${canonical(route)}"`), `${route}: canonical matches deployed route`);
    const structured = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]) as { '@type'?: string });
    assert.ok(structured.some(item => item['@type'] === 'Organization'), `${route}: verified organization schema`);
  } else assert.ok(!html.includes('rel="canonical"') && !html.includes('application/ld+json'), `${route}: no unverified launch metadata`);
  assert.doesNotMatch(html,/aggregateRating|ratingValue|reviewCount/,`${route}: no invented rating data`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/name="description" content="([^"]+)"/)?.[1];
  assert.ok(title && !titles.has(title), `${route}: unique title`); titles.add(title);
  assert.ok(description && !descriptions.has(description), `${route}: unique description`); descriptions.add(description);
  const telephoneTargets = [...html.matchAll(/href="(tel:[^"]+)"/g)].map(match => match[1]);
  assert.ok(telephoneTargets.length >= 2 && telephoneTargets.every(target => target === expectedTelephone), `${route}: configured dialer links`);
  assert.ok(html.includes(configured.displayPhone), `${route}: readable phone number`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1].replace(/&amp;/g, '&');
    if (url.startsWith('/') && !url.startsWith('//')) {
      assert.ok(existsSync(localFile(url)), `${route}: valid link/asset ${url}`);
      assets.add(url);
    }
  }
}
assert.ok(!existsSync(join(root, 'api')), 'No server callback endpoint on static hosting');
if (production) {
  assert.ok(existsSync(join(root, 'areas', configured.pilotMarket, 'index.html')), 'Selected approved area exported');
  for (const area of ['winnipeg-bridgwater', 'winnipeg-transcona', 'brampton-bramalea']) {
    if (area !== configured.pilotMarket) assert.ok(!existsSync(join(root, 'areas', area)), 'No unselected area exported');
  }
} else assert.ok(!existsSync(join(root, 'areas')), 'No unverified location route');
assert.ok(existsSync(join(root, '.nojekyll')) && existsSync(join(root, '404.html')), 'GitHub Pages assets and real 404');
const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
const robots = readFileSync(join(root, 'robots.txt'), 'utf8');
if (production) {
  const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(sitemapUrls.sort(), [...new Set(configured.approvedIndexableRoutes)].map(canonical).sort(), 'Only approved canonical routes in live sitemap');
  assert.ok(robots.includes(`Sitemap: ${new URL(`${basePath}/sitemap.xml`, configured.canonicalDomain).href}`), 'Correct deployed sitemap advertised');
} else {
  assert.ok(!sitemap.includes('<loc>'), 'Preview sitemap stays empty');
  assert.ok(!robots.includes('Sitemap:'), 'No advertised live sitemap');
}
const home = readFileSync(join(root, 'index.html'), 'utf8');
for (const route of ['/', '/request-help']) {
  const html = readFileSync(localFile(`${basePath}${route}`), 'utf8');
  assert.ok(html.includes(`action="${formspreeEndpoint}" method="POST"`), `${route}: native Formspree form is exported`);
  const scene = `${basePath}/images/easytowing-wheel-lift-640w.webp`;
  assert.ok(html.includes(`--assistance-scene:url(&quot;${scene}&quot;)`), `${route}: decorative form image uses the deployed base path`);
  assert.ok(existsSync(localFile(scene)), `${route}: optimized form background exists`);
  for (const field of ['name', 'phone', 'location', 'email', 'service', 'message', 'contact_notice', '_gotcha']) assert.ok(html.includes(`name="${field}"`), `${route}: enquiry field ${field}`);
  for (const service of availableServices) assert.ok(html.includes(`<option value="${service.name.replace(/&/g, '&amp;')}">`), `${route}: approved service ${service.id} available`);
  assert.ok(html.includes(whatsappLink(configured.supportPhone)!.replace(/&/g, '&amp;')), `${route}: correct WhatsApp number and draft`);
}
for (const id of ['services','fleet','reviews','contact']) assert.ok(home.includes(`id="${id}"`),`Home: #${id} section exists`);
assert.ok(home.includes('class="service-list"'), 'Compact service grid is server-rendered');
assert.equal((home.match(/class="review-card"/g)||[]).length,3,'Home renders the three owner-supplied customer quotes');
assert.ok(home.includes('Rating and customer feedback supplied by EasyTowing'),'Review source remains visible');
assert.ok(home.replace(/<!--[\s\S]*?-->/g,'').includes('25-minute arrival estimate'),'Home shows the owner-confirmed arrival estimate');
assert.match(home,/alt="White easytowing flatbed truck carrying a grey SUV"/,'Gallery has descriptive alt text');
assert.match(home,/width="1448" height="1086"/,'Gallery has intrinsic dimensions');
assert.match(home,/class="hero-brand-watermark" aria-hidden="true"/,'Decorative hero emblem is hidden from assistive technology');
assert.match(home,/data-theme="light"/,'Server-rendered default theme is light');
assert.match(home,/class="hero-highlights"/,'Compact service facts are server-rendered');
assert.match(home,/class="hero-rating"/,'Supplied rating is present in the hero');
assert.match(home, /fetchPriority="high"/i, 'Hero image has high loading priority');
assert.match(home, /srcSet="[^"]+easytowing-emblem-640w\.webp 640w/i, 'Static hero emblem offers responsive image sizes');
for (const match of home.matchAll(/(?:srcSet|imageSrcSet)="([^"]+)"/gi)) {
  for (const candidate of match[1].split(',')) {
    const url = candidate.trim().split(/\s+/)[0];
    assert.ok(existsSync(localFile(url)), `Responsive image exists: ${url}`);
    assets.add(url);
  }
}
for (const name of ['flatbed','highway','wheel-lift','loading','flatbed-night','recovery']) {
  const path=`${basePath}/images/easytowing-${name}.webp`;
  assert.ok(home.includes(path.replace('.webp', '-640w.webp')),`${name}: responsive image uses the repository base path`);
  assert.ok(statSync(localFile(path)).size < 300000,`${name}: optimized source is under 300KB`);
}
function hasServiceLink(markup: string, id: string) {
  return [...markup.matchAll(/href="([^"]+)"/g)].some(match => match[1].replace(/\/$/, '') === `${basePath}/services/${id}`);
}
for (const [route,shown] of [
  ['/',availableServices],
  ['/services',availableServices],
] as const) {
  const markup=readFileSync(localFile(`${basePath}${route}`),'utf8');
  const serviceCards = [...markup.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]).filter(card => services.some(service => hasServiceLink(card,service.id)));
  assert.equal(serviceCards.length,shown.length,`${route}: all intended service articles render`);
  for (const service of shown) {
    const card=serviceCards.find(markup => hasServiceLink(markup,service.id));
    assert.ok(card,`${route}: ${service.name} service detail link`);
    assert.match(card,/<svg\b[^>]*aria-hidden="true"/,`${route}: ${service.name} decorative service icon`);
    if (route !== '/') assert.ok(card.includes(`href="${expectedTelephone}"`),`${route}: ${service.name} uses configured phone`);
  }
}
assert.ok(!home.includes('/_next/image?'), 'Static image needs no Next image server');
console.log(`Passed GitHub Pages checks: ${routes.length} pages, ${assets.size} local destinations/assets, metadata, owner-provided dialer, six fleet images, sitemap and route exclusions.`);
