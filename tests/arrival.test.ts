import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ArrivalEstimate } from '../src/components/arrival-estimate';
const fixture = { minutes:25,status:'unverified',confirmedAt:'',confirmationSource:'' };
test('arrival component omits unsupported 25-minute promises', () => {
  for (const estimate of [undefined,fixture,{...fixture,status:'measured'}]) {
    const html=renderToStaticMarkup(createElement(ArrivalEstimate,{estimate}));
    assert.match(html,/Arrival estimate on your call/);
    assert.ok(!html.includes('25-minute'));
    const tagline=renderToStaticMarkup(createElement(ArrivalEstimate,{estimate,tagline:true}));
    assert.ok(!tagline.includes('25-minute'));
    assert.match(tagline,/Call for an arrival estimate/);
  }
});
test('documented arrival targets stay distinct from measured estimates', () => {
  for (const status of ['target','measured']) {
    const html=renderToStaticMarkup(createElement(ArrivalEstimate,{estimate:{...fixture,status,confirmedAt:'2026-10-24',confirmationSource:'Owner fixture with supporting records'}}));
    assert.match(html,status==='target' ? /25-minute arrival target/ : /25-minute arrival estimate/);
    assert.match(html,/Traffic, weather and available operators affect arrival/);
    assert.ok(!html.includes('guarantee'));
    const tagline=renderToStaticMarkup(createElement(ArrivalEstimate,{estimate:{...fixture,status,confirmedAt:'2026-10-24',confirmationSource:'Owner fixture'},tagline:true}));
    assert.match(tagline,/Quick roadside help/);
    assert.match(tagline,status==='target' ? /25-minute arrival target/ : /25-minute arrival estimate/);
  }
});
