import { test } from 'node:test';
import assert from 'node:assert/strict';
import launch from '../config/launch.json';
import { resolveSiteConfig } from '../src/lib/configuration';
import { launchErrors } from '../src/lib/launch';
import { canonicalUrl, createPageMetadata, createRobots, createSitemap, type SeoContext } from '../src/lib/seo-policy';
import { pageMetadata } from '../src/lib/seo';
import robots from '../src/app/robots';
import sitemap from '../src/app/sitemap';

const liveContext: SeoContext = { live: true, brand: 'Fixture', origin: 'https://fixture.test', approvedRoutes: ['/', '/services/battery-boost'] };
const previewContext: SeoContext = { ...liveContext, live: false, origin: '' };

test('environment canonical override is shared, normalized, and never changes business approvals', () => {
  const resolved = resolveSiteConfig(launch, ' https://fixture.test/ ');
  assert.equal(resolved.canonicalDomain, 'https://fixture.test');
  assert.equal(resolved.businessStatus, launch.businessStatus);
  assert.deepEqual(resolved.approvals, launch.approvals);
  assert.equal(launchErrors(resolved).length,launchErrors(launch).length, 'A canonical origin override does not change business approvals');
  assert.equal(resolveSiteConfig({ ...launch, canonicalDomain: 'https://fixture.test/' }, '').canonicalDomain, 'https://fixture.test');
});

test('canonical config preserves invalid environment input for launch rejection', () => {
  for (const invalid of ['http://fixture.test', 'https://fixture.test/path', 'https://fixture.test?tracking=x', 'https://user:pass@fixture.test', 'https://fixture.test/#fragment', 'not a domain']) {
    const resolved = resolveSiteConfig(launch, invalid);
    assert.equal(resolved.canonicalDomain, invalid);
    assert.ok(launchErrors(resolved).some(error => error.includes('canonical')));
  }
});

test('canonical URLs use a consistent absolute origin and reject external or tracking paths', () => {
  assert.equal(canonicalUrl('/', liveContext.origin), 'https://fixture.test/');
  assert.equal(canonicalUrl('/services/battery-boost', liveContext.origin), 'https://fixture.test/services/battery-boost');
  for (const path of ['//other.test/', '/\\other.test/', 'https://other.test', '/?utm_source=ad', '/#services', '/../services', '/%2e%2e/services', '/%2fother.test', '/two words'])
    assert.throws(() => canonicalUrl(path, liveContext.origin));
});

test('repository deployment canonicals preserve the prefix and match static HTML/file URLs', () => {
  const origin = 'https://exploit0101.github.io';
  const basePath = '/TowServiceWebsite';
  assert.equal(canonicalUrl('/', origin, basePath), 'https://exploit0101.github.io/TowServiceWebsite/');
  assert.equal(canonicalUrl('/services/battery-boost', origin, basePath), 'https://exploit0101.github.io/TowServiceWebsite/services/battery-boost/');
  assert.equal(canonicalUrl('/services/battery-boost/', origin, basePath), 'https://exploit0101.github.io/TowServiceWebsite/services/battery-boost/');
  assert.equal(canonicalUrl('/sitemap.xml', origin, basePath), 'https://exploit0101.github.io/TowServiceWebsite/sitemap.xml');
  assert.equal(canonicalUrl('/images/easytowing-flatbed.webp', origin, basePath), 'https://exploit0101.github.io/TowServiceWebsite/images/easytowing-flatbed.webp');
  assert.equal(canonicalUrl('/.well-known/config', origin, basePath), 'https://exploit0101.github.io/TowServiceWebsite/.well-known/config');
  assert.equal(canonicalUrl('/contact', origin, '', true), 'https://exploit0101.github.io/contact/');
  assert.equal(canonicalUrl('/contact', origin, basePath, false), 'https://exploit0101.github.io/TowServiceWebsite/contact');
  for (const invalid of ['/', '//other.test', '/repo/', '/repo?key=x', '/repo#fragment', '/repo/../other', '/%2e%2e', '/repo name', '/repo\\other'])
    assert.throws(() => canonicalUrl('/contact', origin, invalid));
});

test('repository deployment metadata, social assets, breadcrumbs and sitemap share one URL shape', () => {
  const context = { ...liveContext, origin: 'https://exploit0101.github.io', basePath: '/TowServiceWebsite' };
  const path = '/services/battery-boost';
  const expected = 'https://exploit0101.github.io/TowServiceWebsite/services/battery-boost/';
  const metadata = createPageMetadata('Battery boost', 'Fixture description', path, context);
  assert.equal(metadata.alternates?.canonical, expected);
  assert.ok(metadata.openGraph && 'url' in metadata.openGraph);
  assert.equal(metadata.openGraph.url, expected);
  assert.deepEqual(metadata.openGraph.images, [{ url: 'https://exploit0101.github.io/TowServiceWebsite/images/easytowing-flatbed.webp', alt: 'White easytowing flatbed truck carrying a grey SUV', width: 1448, height: 1086 }]);
  assert.deepEqual(createSitemap(context), [{ url: 'https://exploit0101.github.io/TowServiceWebsite/' }, { url: expected }]);
  assert.equal(canonicalUrl(path, context.origin, context.basePath), expected, 'Breadcrumb URLs use the same canonical helper');
  assert.deepEqual(createRobots(context), { rules: { userAgent: '*', allow: '/', disallow: '/TowServiceWebsite/api/' }, sitemap: 'https://exploit0101.github.io/TowServiceWebsite/sitemap.xml' });
});

test('custom-domain deployment uses root URLs consistently without the former repository prefix', () => {
  const context = { ...liveContext, origin: 'https://easytowing.ca', basePath: '', trailingSlash: true };
  const expected = 'https://easytowing.ca/services/battery-boost/';
  const metadata = createPageMetadata('Battery boost', 'Fixture description', '/services/battery-boost', context);
  assert.equal(metadata.alternates?.canonical, expected);
  assert.ok(metadata.openGraph && 'url' in metadata.openGraph);
  assert.equal(metadata.openGraph.url, expected);
  assert.deepEqual(createSitemap(context), [{ url: 'https://easytowing.ca/' }, { url: expected }]);
  assert.deepEqual(createRobots(context), { rules: { userAgent: '*', allow: '/', disallow: '/api/' }, sitemap: 'https://easytowing.ca/sitemap.xml' });
  assert.equal(canonicalUrl('/images/easytowing-flatbed.webp', context.origin, context.basePath, true), 'https://easytowing.ca/images/easytowing-flatbed.webp');
});

test('repository base path does not open preview indexing or schema/canonical gates', () => {
  const context = { ...previewContext, origin: 'https://exploit0101.github.io', basePath: '/TowServiceWebsite' };
  const metadata = createPageMetadata('Preview', 'Fixture description', '/', context);
  assert.deepEqual(metadata.robots, { index: false, follow: false });
  assert.equal(metadata.alternates, undefined);
  assert.ok(metadata.openGraph && !('url' in metadata.openGraph) && !('images' in metadata.openGraph));
  assert.deepEqual(createSitemap(context), []);
  assert.equal(createRobots(context).sitemap, undefined);
});

test('preview never emits indexable metadata, canonical, sitemap, or invented social URL even with approved routes', () => {
  const metadata = createPageMetadata('Battery boost', 'Fixture description', '/', previewContext);
  assert.deepEqual(metadata.robots, { index: false, follow: false });
  assert.equal(metadata.alternates, undefined);
  assert.ok(metadata.openGraph && !('url' in metadata.openGraph));
  assert.ok(metadata.openGraph && !('images' in metadata.openGraph));
  assert.deepEqual(createSitemap(previewContext), []);
  assert.equal(createRobots(previewContext).sitemap, undefined);
});

test('only approved live HTML becomes indexable, with matching canonical and social URLs', () => {
  const metadata = createPageMetadata('Battery boost', 'Fixture description', '/services/battery-boost', liveContext);
  assert.deepEqual(metadata.robots, { index: true, follow: true });
  assert.equal(metadata.alternates?.canonical, 'https://fixture.test/services/battery-boost');
  assert.ok(metadata.openGraph && 'url' in metadata.openGraph);
  assert.equal(metadata.openGraph.url, metadata.alternates?.canonical);
  assert.equal(metadata.openGraph.siteName, 'Fixture');
  assert.deepEqual(metadata.twitter, { card: 'summary_large_image', title: 'Battery boost | Fixture', description: 'Fixture description', images: [{ url: 'https://fixture.test/images/easytowing-flatbed.webp', alt: 'White easytowing flatbed truck carrying a grey SUV', width: 1448, height: 1086 }] });
  assert.deepEqual(createPageMetadata('Terms', 'Fixture terms', '/terms', liveContext).robots, { index: false, follow: false });
});

test('sitemap includes only approved live routes, without duplicates or invented modification dates', () => {
  const entries = createSitemap({ ...liveContext, approvedRoutes: [...liveContext.approvedRoutes, '/'] });
  assert.deepEqual(entries, [{ url: 'https://fixture.test/' }, { url: 'https://fixture.test/services/battery-boost' }]);
  assert.equal(createRobots(liveContext).sitemap, 'https://fixture.test/sitemap.xml');
});

test('crawl rules let search engines see noindex HTML and render assets in both modes', () => {
  for (const context of [previewContext, liveContext])
    assert.deepEqual(createRobots(context).rules, { userAgent: '*', allow: '/', disallow: '/api/' });
});

test('actual preview route exports stay closed while allowing noindex to be read', () => {
  assert.deepEqual(sitemap(), []);
  assert.equal(robots().sitemap, undefined);
  assert.deepEqual(pageMetadata('Preview', 'Fixture description', '/').robots, { index: false, follow: false });
  assert.equal(pageMetadata('Preview', 'Fixture description', '/').alternates, undefined);
});
