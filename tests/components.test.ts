import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Header } from '../src/components/header';
import { RequestForm } from '../src/components/request-form';
test('preview header offers service information without fabricated live telephone links', () => {
  const html=renderToStaticMarkup(createElement(Header,{brand:'Roadside',phone:'',displayPhone:'',live:false,pilotLabel:'Selected pilot'}));
  assert.match(html,/PRE-LAUNCH PREVIEW/); assert.ok(!html.includes('tel:'));
  assert.match(html,/class="header-call" disabled=""/);
  assert.match(html,/Phone number coming soon/);
  assert.ok(html.indexOf('class="header-call"') > html.indexOf('</nav>'), 'call action stays outside the collapsed mobile menu');
  assert.match(html,/aria-expanded="false"/); assert.match(html,/aria-controls="main-navigation"/);
});
test('approved live header displays readable and E.164 phone links', () => {
  const html=renderToStaticMarkup(createElement(Header,{brand:'Fixture',phone:'+12045551234',displayPhone:'204-555-1234',live:true,phoneMode:'verified',pilotLabel:'Fixture zone'}));
  assert.equal((html.match(/href="tel:\+12045551234"/g) || []).length,2, 'both the readable number and call button open the same dial target');
  assert.match(html,/<a[^>]*class="header-phone-number"[^>]*>[\s\S]*?204-555-1234[\s\S]*?<\/a>/);
  assert.match(html,/<a[^>]*class="header-call"[^>]*href="tel:\+12045551234"/);
  assert.ok(!html.includes('PRE-LAUNCH PREVIEW'));
  const navStart=html.indexOf('<nav');
  const navEnd=html.indexOf('</nav>') + '</nav>'.length;
  const phonePosition=html.indexOf('class="header-phone-number"');
  assert.ok(phonePosition < navStart || phonePosition > navEnd, 'readable phone number stays outside the collapsed mobile menu');
  assert.ok(!html.includes('tel:911'));
});
test('call action stays disabled when live flag lacks a valid number or display number', () => {
  for (const [phone,displayPhone] of [['',''],['911','911'],['+12045550100',''],['+12045550100','204-555-0101']]) {
    const html=renderToStaticMarkup(createElement(Header,{brand:'Fixture',phone,displayPhone,live:true,phoneMode:'verified',pilotLabel:'Fixture zone'}));
    assert.ok(!html.includes('tel:'));
    assert.match(html,/class="header-call" disabled=""/);
  }
});

test('explicit demo phone opens the dial target while visibly remaining a preview', () => {
  const html=renderToStaticMarkup(createElement(Header,{brand:'Roadside',phone:'+12045550100',displayPhone:'204-555-0100',phoneMode:'demo',live:false,pilotLabel:'Selected pilot'}));
  assert.equal((html.match(/href="tel:\+12045550100"/g) || []).length,2);
  assert.match(html,/DEMO PHONE/);
  assert.match(html,/No roadside service or dispatch/);
  assert.match(html,/<a[^>]*class="header-phone-number"[^>]*>[\s\S]*?204-555-0100[\s\S]*?<\/a>/);
  assert.ok(!html.includes('disabled=""'));
});
test('preview callback form labels local-only action, minimal fields, consent and dispatch limits', () => {
  const html=renderToStaticMarkup(createElement(RequestForm,{enabled:false,offers:[]}));
  assert.match(html,/Review request \(preview\)/); assert.match(html,/Nothing is sent, stored or booked/);
  assert.match(html,/does not confirm availability, a booking, a price or dispatch/);
  for (const field of ['service','area','phone','name','consent']) assert.ok(html.includes(`for="${field}"`));
  assert.match(html,/aria-live="polite"/); assert.match(html,/role="alert"/);
  assert.ok(!html.includes('type="password"')); assert.ok(!html.includes('geolocation'));
});
