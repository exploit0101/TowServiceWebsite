import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ServiceCarousel } from '../src/components/service-carousel';
import { services } from '../src/lib/content';
import { homepageServiceIds } from '../src/lib/service-catalog';

const items=homepageServiceIds.map(id => services.find(service => service.id === id)!);

test('the service carousel renders every real service link and an accessible motion control before hydration', () => {
  const html=renderToStaticMarkup(createElement(ServiceCarousel,{items,phoneHref:'tel:+16728899764',displayPhone:'672-889-9764'}));
  assert.match(html,/role="region" aria-label="Service options" aria-roledescription="carousel"/);
  assert.match(html,/class="service-carousel-track"/);
  assert.match(html,/Resume movement/,'server-rendered motion control honours the safe reduced-motion fallback');
  assert.match(html,/aria-pressed="false"/);
  assert.match(html,/View all services/);
  const cards=[...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]);
  assert.equal(cards.length,items.length,'services are present in HTML without duplicated loop slides');
  for (const item of items) {
    const card=cards.find(markup => markup.includes('data-service-id="' + item.id + '"'));
    assert.ok(card,item.id + ': real service article');
    assert.ok(card.includes('href="/services/' + item.id + '"'),item.id + ': detail link');
    assert.match(card,/<svg\b[^>]*aria-hidden="true"/,item.id + ': decorative icon');
    assert.ok(card.includes('href="tel:+16728899764"'),item.id + ': configured dial target');
  }
});

test('expanded service view omits automatic-motion controls and unconfigured phone links', () => {
  const html=renderToStaticMarkup(createElement(ServiceCarousel,{items,defaultExpanded:true}));
  assert.match(html,/class="service-carousel-track is-expanded"/);
  assert.match(html,/Show carousel/);
  assert.match(html,/aria-pressed="true"/);
  assert.ok(!html.includes('Resume movement') && !html.includes('Pause movement'));
  assert.ok(!html.includes('tel:'),'no made-up phone target when contact is unconfigured');
});
