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
  assert.match(html, /name="robots" content="noindex, nofollow"/, `${route}: noindex demo`);
  assert.match(html, /DEMO PHONE/);
  assert.match(html, /No roadside service or dispatch/);
  assert.ok(!html.includes('rel="canonical"') && !html.includes('application/ld+json'), `${route}: no unverified launch metadata`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/name="description" content="([^"]+)"/)?.[1];
  assert.ok(title && !titles.has(title), `${route}: unique title`); titles.add(title);
  assert.ok(description && !descriptions.has(description), `${route}: unique description`); descriptions.add(description);
  const telephoneTargets = [...html.matchAll(/href="(tel:[^"]+)"/g)].map(match => match[1]);
  assert.ok(telephoneTargets.length >= 2 && telephoneTargets.every(target => target === 'tel:+12045550100'), `${route}: demo dialer links`);
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
assert.ok(!readFileSync(join(root, 'sitemap.xml'), 'utf8').includes('<loc>'), 'Demo sitemap stays empty');
assert.ok(!readFileSync(join(root, 'robots.txt'), 'utf8').includes('Sitemap:'), 'No advertised live sitemap');
const home = readFileSync(join(root, 'index.html'), 'utf8');
assert.ok(home.includes(`${basePath}/images/towing-3d-hero.webp`), 'Hero uses the repository base path');
assert.ok(!home.includes('/_next/image?'), 'Static image needs no Next image server');
console.log(`Passed GitHub Pages checks: ${routes.length} pages, ${assets.size} local destinations/assets, metadata, demo dialer, hero, sitemap and route exclusions.`);
