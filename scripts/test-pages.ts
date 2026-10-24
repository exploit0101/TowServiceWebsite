import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { services } from '../src/lib/content';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'pages-out');
const basePath = process.env.GITHUB_PAGES_BASE_PATH || '';
const routes = ['/', '/services', ...services.map(service => `/services/${service.id}`), '/request-help', '/about', '/contact', '/rates-and-disclosures', '/privacy', '/terms', '/accessibility'];
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
  assert.match(html, /name="robots" content="noindex, nofollow"/, `${route}: noindex preview`);
  assert.match(html, /pre-launch/i, `${route}: proposed operating status disclosed`);
  assert.ok(!html.includes('DEMO PHONE'),`${route}: demo phone removed`);
  assert.match(html,/easytowing/,`${route}: owner brand`);
  assert.ok(!html.includes('rel="canonical"') && !html.includes('application/ld+json'), `${route}: no unverified launch metadata`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/name="description" content="([^"]+)"/)?.[1];
  assert.ok(title && !titles.has(title), `${route}: unique title`); titles.add(title);
  assert.ok(description && !descriptions.has(description), `${route}: unique description`); descriptions.add(description);
  const telephoneTargets = [...html.matchAll(/href="(tel:[^"]+)"/g)].map(match => match[1]);
  assert.ok(telephoneTargets.length >= 2 && telephoneTargets.every(target => target === 'tel:+16728899764'), `${route}: owner-provided dialer links`);
  assert.match(html,/672-889-9764/,`${route}: readable phone number`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1].replace(/&amp;/g, '&');
    if (url.startsWith('/') && !url.startsWith('//')) {
      assert.ok(existsSync(localFile(url)), `${route}: valid link/asset ${url}`);
      assets.add(url);
    }
  }
}
assert.ok(!existsSync(join(root, 'api')) && !existsSync(join(root, 'areas')), 'No server callback or unverified location route');
assert.ok(existsSync(join(root, '.nojekyll')) && existsSync(join(root, '404.html')), 'GitHub Pages assets and real 404');
assert.ok(!readFileSync(join(root, 'sitemap.xml'), 'utf8').includes('<loc>'), 'Preview sitemap stays empty');
assert.ok(!readFileSync(join(root, 'robots.txt'), 'utf8').includes('Sitemap:'), 'No advertised live sitemap');
const home = readFileSync(join(root, 'index.html'), 'utf8');
for (const id of ['services','fleet','how-it-works','contact']) assert.ok(home.includes(`id="${id}"`),`Home: #${id} section exists`);
assert.match(home,/alt="White easytowing flatbed truck carrying a grey SUV"/,'Hero has descriptive alt text');
assert.match(home,/width="1448" height="1086"/,'Hero has intrinsic dimensions');
for (const name of ['flatbed','highway','wheel-lift','loading','flatbed-night','recovery']) {
  const path=`${basePath}/images/easytowing-${name}.webp`;
  assert.ok(home.includes(path),`${name}: image uses the repository base path`);
  assert.ok(statSync(localFile(path)).size < 300000,`${name}: optimized source is under 300KB`);
}
function hasServiceLink(markup: string, id: string) {
  return [...markup.matchAll(/href="([^"]+)"/g)].some(match => match[1].replace(/\/$/, '') === `${basePath}/services/${id}`);
}
const serviceCards = [...home.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]).filter(markup => services.some(service => hasServiceLink(markup,service.id)));
assert.equal(serviceCards.length,services.length,'Home renders all seven service articles');
for (const service of services) {
  const card=serviceCards.find(markup => hasServiceLink(markup,service.id));
  assert.ok(card,`${service.name}: service detail link`);
  assert.match(card,/<svg\b[^>]*aria-hidden="true"/,`${service.name}: decorative service icon`);
}
assert.ok(!home.includes('/_next/image?'), 'Static image needs no Next image server');
console.log(`Passed GitHub Pages checks: ${routes.length} pages, ${assets.size} local destinations/assets, metadata, owner-provided dialer, six fleet images, sitemap and route exclusions.`);
