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
  assert.equal(resolved.businessStatus, 'proposed');
  assert.deepEqual(resolved.approvals, launch.approvals);
  assert.ok(launchErrors(resolved).length > 0, 'A real domain alone cannot open launch gates');
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
  for (const path of ['//other.test/', '/\\other.test/', 'https://other.test', '/?utm_source=ad', '/#services'])
    assert.throws(() => canonicalUrl(path, liveContext.origin));
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
  assert.deepEqual(metadata.twitter, { card: 'summary_large_image', title: 'Battery boost | Fixture', description: 'Fixture description', images: [{ url: 'https://fixture.test/images/towing-3d-hero.webp', alt: '3D illustration of a yellow flatbed tow truck transporting a silver car', width: 1448, height: 1086 }] });
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
