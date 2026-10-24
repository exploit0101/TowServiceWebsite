import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ServiceTicker } from '../src/components/service-ticker';
import { services } from '../src/lib/content';

test('service strip renders the real catalogue and an accessible pause control without duplicate focus targets', () => {
  const html = renderToStaticMarkup(createElement(ServiceTicker, { items: services }));
  assert.match(html, /aria-label="Pause service names" aria-pressed="false"/);
  const groups = [...html.matchAll(/<ul\b[^>]*>[\s\S]*?<\/ul>/g)].map(match => match[0]);
  assert.equal(groups.length, 2);
  assert.match(groups[1], /aria-hidden="true"/);
  for (const service of services) assert.ok(groups[0].includes(service.name.replaceAll('&', '&amp;')));
  assert.equal((groups[0].match(/<li>/g) || []).length, services.length);
  assert.ok(!groups[1].includes('<a') && !groups[1].includes('<button'));
  assert.equal(renderToStaticMarkup(createElement(ServiceTicker, { items: [] })), '');
});
