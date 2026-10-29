import assert from 'node:assert/strict';
import { services } from '../src/lib/content';
import { callsEnabled, isDemoPhone, phoneContact, siteConfig } from '../src/lib/site-config';
const escapeHtml = (text:string) => text.replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;'}[character]!));
async function main() {
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:3000';
const serviceRoutes = services.map(service => `/services/${service.id}`);
const routes = ['/', '/services', ...serviceRoutes, '/request-help', '/about', '/contact', '/rates-and-disclosures', '/privacy', '/terms', '/accessibility'];
const discovered = new Set<string>();
const titles = new Set<string>();
const descriptions = new Set<string>();
const fleetImages = ['flatbed','highway','wheel-lift','loading','flatbed-night','recovery'].map(name => `/images/easytowing-${name}.webp`);
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
  if (callsEnabled && phoneContact) {
    const expectedPhoneHref = phoneContact.href;
    assert.ok(telephoneTargets.length >= 2, `${route}: call CTA and readable top phone link`);
    assert.ok(telephoneTargets.every(target => target === expectedPhoneHref), `${route}: one consistent dial target`);
    if (isDemoPhone) {
      assert.match(html, /DEMO PHONE/, `${route}: temporary number clearly disclosed`);
      assert.match(html, /No roadside service or dispatch/, `${route}: no live service implied`);
    } else {
      assert.equal(expectedPhoneHref,'tel:+14314515110',`${route}: owner-provided easytowing number`);
      assert.ok(html.includes(escapeHtml(siteConfig.displayPhone)),`${route}: readable phone number`);
      assert.ok(!html.includes('DEMO PHONE'),`${route}: demo number removed`);
    }
  } else assert.ok(!telephoneTargets.length,`${route}: no unconfigured phone links`);
  assert.ok(!html.includes('application/ld+json'),`${route}: no unverified organization claims`);
  assert.doesNotMatch(html,/aggregateRating|ratingValue|reviewCount/,`${route}: no invented rating data`);
  assert.ok(!html.includes('rel="canonical"'),`${route}: no invented canonical origin`);
  assert.ok(!html.includes('googletagmanager.com/gtag/js'),`${route}: no analytics loaded`);
  if (route === '/' || route === '/services') {
    const expectedServices = services;
    const cards = [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]).filter(markup => services.some(service => markup.includes(`href="/services/${service.id}"`)));
    assert.equal(cards.length, expectedServices.length, `${route}: all intended service cards rendered on the server`);
    for (const service of expectedServices) {
      const card = cards.find(markup => markup.includes(`href="/services/${service.id}"`));
      assert.ok(card, `${route}: ${service.name} detail link`);
      assert.ok(card.includes(escapeHtml(service.name)), `${route}: ${service.name} visible label`);
      assert.match(card, /<svg\b[^>]*aria-hidden="true"/, `${route}: ${service.name} decorative SVG icon`);
      if (phoneContact && route !== '/') assert.ok(card.includes(`href="${phoneContact.href}"`), `${route}: ${service.name} uses the configured dial target`);
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
    assert.match(html,/class="service-list"/,'homepage renders the compact service grid');
    assert.ok(!html.includes('id="how-it-works"') && !html.includes('/#how-it-works'),'removed process section has no section or navigation target');
    assert.ok(!html.includes('Rebranded vehicle image'),'hero image has no removed label');
    assert.match(html,/<h1\b[^>]*>[\s\S]*?Winnipeg towing[\s\S]*?Made easy\./,'homepage has the Winnipeg towing headline');
    assert.equal((html.match(/class="review-card"/g)||[]).length,3,'home renders three supplied customer quotes');
    assert.ok(html.includes('Rating and customer feedback supplied by EasyTowing'),'review source is visible');
    assert.ok(html.replace(/<!--[\s\S]*?-->/g,'').includes('25-minute arrival estimate'),'arrival estimate reflects owner confirmation');
    assert.match(html,/easytowing/,'owner brand rendered');
    for (const id of ['services','fleet','reviews','contact']) assert.ok(html.includes(`id="${id}"`),`home: #${id} section exists`);
    assert.match(html, /alt="White easytowing flatbed truck carrying a grey SUV"/, 'gallery has descriptive alt text');
    assert.match(html, /srcSet="[^"]*easytowing-emblem/, 'hero emblem has responsive image sources');
    assert.match(html,/class="hero-brand-watermark" aria-hidden="true"/,'background emblem is decorative');
    assert.match(html,/data-theme="light"/,'light is the server-rendered default');
    assert.ok(!html.includes('scene-grid'), 'old SVG grid has been replaced');
    assert.match(html, /width="1448" height="1086"/, 'gallery dimensions prevent layout shift');
    for (const image of fleetImages) assert.ok(html.includes(image.slice(1)) || html.includes(encodeURIComponent(image)),`home: ${image} rendered`);
  }
  const footer=html.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/)?.[0];
  assert.ok(footer,`${route}: shared footer is rendered`);
  assert.match(footer,/easytowing coordinates independent/,`${route}: actual coordinator role remains visible`);
  assert.doesNotMatch(footer,/pre-launch/i,`${route}: removed pre-launch footer copy stays removed`);
  for(const match of html.matchAll(/href="(\/[^"?]*)"/g)) { const path=match[1].split('#')[0]; if (!path.startsWith('/_next') && !path.startsWith('//')) discovered.add(path); }
  console.log(`PASS ${route}: SSR, H1, preview metadata, contact and schema guards`);
}
for (const route of discovered) { const response=await fetch(`${origin}${route}`); assert.equal(response.status,200,`Broken internal link: ${route}`); }
for (const route of ['/areas/winnipeg-bridgwater','/areas/winnipeg-transcona','/areas/brampton-bramalea','/services/collision-recovery','/services/tire-repair','/nonexistent']) assert.equal((await fetch(`${origin}${route}`)).status,404,`${route}: unapproved or removed route must be 404`);
const robots=await (await fetch(`${origin}/robots.txt`)).text();
assert.match(robots,/Allow: \/\s/); assert.match(robots,/Disallow: \/api\//);
assert.ok(!/^Disallow: \/\s*$/m.test(robots),'Crawlers must reach HTML to read noindex and load rendering assets');
assert.ok(!robots.includes('Sitemap:'),'Preview does not advertise an indexable sitemap');
const sitemap=await (await fetch(`${origin}/sitemap.xml`)).text(); assert.ok(!sitemap.includes('<loc>'));
const callback=await fetch(`${origin}/api/callback`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:'204-555-0100'})});
assert.equal(callback.status,503); assert.match((await callback.json()).error,/not available/);
console.log(`PASS ${discovered.size} internal destinations; 6 blocked routes; robots, empty sitemap and disabled callback API.`);
for (const imagePath of fleetImages) {
  const image=await fetch(`${origin}${imagePath}`);
  assert.equal(image.status,200,imagePath); assert.match(image.headers.get('content-type') || '',/image\/webp/);
  assert.ok((await image.arrayBuffer()).byteLength < 300000, `${imagePath}: source is under 300KB`);
}
const optimized=await fetch(`${origin}/_next/image?url=%2Fimages%2Feasytowing-flatbed.webp&w=640&q=75`,{headers:{Accept:'image/webp'}});
assert.equal(optimized.status,200); assert.match(optimized.headers.get('content-type') || '',/image\/webp/);
assert.equal((await fetch(`${origin}/icon.png`)).status,200);
console.log('PASS responsive hero emblem, descriptive gallery alt, intrinsic dimensions, six fleet WebP images, optimized delivery and site icon.');
}
main().catch(error => { console.error(error); process.exitCode=1; });
