import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { services } from '../src/lib/content';
import { homepageServiceIds, serviceIds } from '../src/lib/service-catalog';
import { validateRequest } from '../src/lib/request-validation';
import { RequestForm } from '../src/components/request-form';
import { ServiceIcon } from '../src/components/service-icon';

const expectedHomepageIds = ['local-towing', 'heavy-duty-towing', 'motorcycle-towing', 'battery-boost', 'winch-out', 'flat-tire', 'flat-tire-help', 'lockout', 'fuel-delivery'];
const expectedIds = [...expectedHomepageIds, 'battery-replacement', 'tire-repair'];
const request = {phone:'204-555-0100', name:'Alex', area:'General neighbourhood', consent:true, website:''};

test('the full service catalogue preserves existing routes and provides distinct scope and metadata', () => {
  assert.deepEqual([...serviceIds].sort(), [...expectedIds].sort());
  assert.deepEqual(services.map(service => service.id).sort(), [...expectedIds].sort());
  for (const field of ['id', 'name', 'description', 'title', 'intro', 'limit'] as const)
    assert.equal(new Set(services.map(service => service[field])).size, expectedIds.length, `unique ${field}`);
  for (const service of services) {
    assert.ok(service.description.length >= 40, `${service.id}: meaningful search description`);
    assert.ok(service.scope.length >= 2, `${service.id}: service scope`);
    assert.ok(service.prepare.length >= 2, `${service.id}: information to prepare`);
    assert.ok(service.limit.length >= 40, `${service.id}: limitations`);
  }
});

test('the homepage presents the nine requested categories in the requested order', () => {
  assert.deepEqual([...homepageServiceIds], expectedHomepageIds);
  const shown = homepageServiceIds.map(id => services.find(service => service.id === id));
  assert.ok(shown.every(Boolean), 'each homepage category has a real service detail route');
  assert.deepEqual(shown.map(service => service?.name.toLowerCase()), [
    'car towing', 'heavy duty towing', 'motorcycle towing', 'boosting & jump start',
    'winch out', 'flat tire', 'tire change', 'lockout', 'fuel delivery',
  ]);
});

test('each service has its own server-renderable decorative SVG icon', () => {
  const shapes = new Set<string>();
  for (const service of services) {
    const markup = renderToStaticMarkup(createElement(ServiceIcon, {icon:service.icon}));
    assert.match(markup, /^<svg\b/);
    assert.match(markup, /aria-hidden="true"/);
    const shapesMarkup = markup.slice(markup.indexOf('>') + 1);
    assert.ok(!shapes.has(shapesMarkup), `${service.id}: icon differs from other services`);
    shapes.add(shapesMarkup);
  }
});

test('callback validation accepts all supported service choices and rejects unsupported work', () => {
  for (const service of expectedIds) {
    const result = validateRequest({...request, service});
    assert.ok(result.ok, `${service}: supported request choice`);
    assert.equal(result.value.service, service);
  }
  for (const service of ['collision-recovery', 'impound', 'toString', ''])
    assert.equal(validateRequest({...request, service}).ok, false, `${service}: unsupported request`);
});

test('preview request choices show the full catalogue; live choices show approved offers only', () => {
  const preview = renderToStaticMarkup(createElement(RequestForm, {enabled:false, offers:[]}));
  for (const id of expectedIds) assert.ok(preview.includes(`<option value="${id}">`), `preview: ${id}`);
  const approved = ['lockout', 'fuel-delivery'];
  const live = renderToStaticMarkup(createElement(RequestForm, {enabled:true, offers:approved}));
  for (const id of expectedIds)
    assert.equal(live.includes(`<option value="${id}">`), approved.includes(id), `live option approval: ${id}`);
  assert.match(preview, /No vehicle has been dispatched|Submitting a request does not confirm availability, a booking, a price or dispatch/);
});
