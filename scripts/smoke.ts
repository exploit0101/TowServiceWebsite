import assert from 'node:assert/strict';
import { services } from '../src/lib/content';
import { isDemoPhone, phoneContact } from '../src/lib/site-config';
const escapeHtml = (text:string) => text.replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;'}[character]!));
async function main() {
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:3000';
const serviceRoutes = services.map(service => `/services/${service.id}`);
const routes = ['/', '/services', ...serviceRoutes, '/request-help', '/about', '/contact', '/rates-and-disclosures', '/privacy', '/terms', '/accessibility'];
const discovered = new Set<string>();
const titles = new Set<string>();
const descriptions = new Set<string>();
for (const route of routes) {
  const response=await fetch(`${origin}${route}`); assert.equal(response.status,200,route);
  const html=await response.text();
  const title=html.match(/<title>(.*?)<\/title>/)?.[1];
  const description=html.match(/name="description" content="([^"]+)"/)?.[1];
  assert.ok(title && !titles.has(title),`${route}: unique title`); titles.add(title);
  assert.ok(description && !descriptions.has(description),`${route}: unique meta description`); descriptions.add(description);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${route}: exactly one H1`);
  assert.match(html, /name="robots" content="noindex, nofollow"/,`${route}: preview robots`);
  const telephoneTargets = [...html.matchAll(/href="(tel:[^"]+)"/g)].map(match => match[1]);
  if (isDemoPhone && phoneContact) {
    const expectedPhoneHref = phoneContact.href;
    assert.ok(telephoneTargets.length >= 2, `${route}: call CTA and readable top phone link`);
    assert.ok(telephoneTargets.every(target => target === expectedPhoneHref), `${route}: one consistent demo dial target`);
    assert.match(html, /DEMO PHONE/, `${route}: temporary number clearly disclosed`);
    assert.match(html, /No roadside service or dispatch/, `${route}: no live service implied`);
  } else assert.ok(!telephoneTargets.length,`${route}: no unconfigured phone links`);
  assert.ok(!html.includes('application/ld+json'),`${route}: no unverified organization claims`);
  assert.ok(!html.includes('rel="canonical"'),`${route}: no invented canonical origin`);
  assert.ok(!html.includes('googletagmanager.com/gtag/js'),`${route}: no analytics loaded`);
  if (route === '/' || route === '/services') {
    const cards = [...html.matchAll(/<article\b[^>]*class="service-card(?:\s[^"]*)?"[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]);
    assert.equal(cards.length, services.length, `${route}: all seven service cards rendered on the server`);
    for (const service of services) {
      const card = cards.find(markup => markup.includes(`href="/services/${service.id}"`));
      assert.ok(card, `${route}: ${service.name} detail link`);
      assert.ok(card.includes(escapeHtml(service.name)), `${route}: ${service.name} visible label`);
      assert.match(card, /class="service-symbol[^"]*"[\s\S]*?<svg\b[^>]*aria-hidden="true"/, `${route}: ${service.name} decorative SVG icon`);
    }
  }
  if (serviceRoutes.includes(route)) {
    const service = services.find(item => `/services/${item.id}` === route)!;
    assert.equal(description, escapeHtml(service.description), `${route}: scoped meta description`);
    assert.ok(title.includes(escapeHtml(service.name)), `${route}: service-specific title`);
    assert.ok(html.includes(escapeHtml(service.title)), `${route}: scoped service headline`);
    assert.ok(html.includes(escapeHtml(service.intro)), `${route}: service-specific scope is server-rendered`);
    assert.ok(html.includes(escapeHtml(service.limit)), `${route}: service-specific limitations are visible`);
    assert.ok(html.includes('href="/services"'), `${route}: link back to service hub`);
  }
  if (route === '/') {
    assert.match(html, /alt="3D illustration of a yellow flatbed tow truck transporting a silver car\."/, 'hero has descriptive alt text');
    assert.match(html, /srcSet="[^"]*towing-3d-hero/, 'hero has responsive image sources');
    assert.ok(!html.includes('scene-grid'), 'old SVG grid has been replaced');
    assert.match(html, /width="1448" height="1086"/, 'image dimensions prevent layout shift');
  }
  for(const match of html.matchAll(/href="(\/[^"?]*)"/g)) { const path=match[1].split('#')[0]; if (!path.startsWith('/_next') && !path.startsWith('//')) discovered.add(path); }
  console.log(`PASS ${route}: SSR, H1, preview metadata, contact and schema guards`);
}
for (const route of discovered) { const response=await fetch(`${origin}${route}`); assert.equal(response.status,200,`Broken internal link: ${route}`); }
for (const route of ['/areas/winnipeg-bridgwater','/areas/winnipeg-transcona','/areas/brampton-bramalea','/services/winch-out','/nonexistent']) assert.equal((await fetch(`${origin}${route}`)).status,404,`${route}: unapproved route must be 404`);
const robots=await (await fetch(`${origin}/robots.txt`)).text();
assert.match(robots,/Allow: \/\s/); assert.match(robots,/Disallow: \/api\//);
assert.ok(!/^Disallow: \/\s*$/m.test(robots),'Crawlers must reach HTML to read noindex and load rendering assets');
assert.ok(!robots.includes('Sitemap:'),'Preview does not advertise an indexable sitemap');
const sitemap=await (await fetch(`${origin}/sitemap.xml`)).text(); assert.ok(!sitemap.includes('<loc>'));
const callback=await fetch(`${origin}/api/callback`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:'204-555-0100'})});
assert.equal(callback.status,503); assert.match((await callback.json()).error,/not available/);
console.log(`PASS ${discovered.size} internal destinations; 5 blocked routes; robots, empty sitemap and disabled callback API.`);
const image=await fetch(`${origin}/images/towing-3d-hero.webp`);
assert.equal(image.status,200); assert.match(image.headers.get('content-type') || '',/image\/webp/);
assert.ok((await image.arrayBuffer()).byteLength < 300000, 'hero source is under 300KB');
const optimized=await fetch(`${origin}/_next/image?url=%2Fimages%2Ftowing-3d-hero.webp&w=640&q=75`,{headers:{Accept:'image/webp'}});
assert.equal(optimized.status,200); assert.match(optimized.headers.get('content-type') || '',/image\/webp/);
assert.equal((await fetch(`${origin}/icon.svg`)).status,200);
console.log('PASS descriptive hero alt, responsive sources, intrinsic dimensions, optimized WebP delivery and site icon.');
}
main().catch(error => { console.error(error); process.exitCode=1; });
