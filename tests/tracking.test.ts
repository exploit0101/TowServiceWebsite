import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasTracking, measurementPage, parseTrackingChoice, resolveTrackingConfig, trackingPermissions } from '../src/lib/tracking';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Consent } from '../src/components/consent';

const input = { live: true, approved: true, ga4Id: 'G-FIXTURE123', adsId: 'AW-123456789', phoneLabel: 'Phone_Label-1', leadLabel: 'Lead_Label-2' };
test('without JavaScript, consent controls cannot cover the native form or contact links', () => {
  assert.equal(renderToStaticMarkup(createElement(Consent,{config:resolveTrackingConfig(input)})),'');
});
test('measurement requires a live, approved build and actual valid destinations', () => {
  for (const override of [{live:false}, {approved:false}, {ga4Id:'',adsId:''}, {ga4Id:'GTM-INVALID',adsId:'AW-not-a-number'}])
    assert.equal(hasTracking(resolveTrackingConfig({...input,...override})), false);
  assert.deepEqual(resolveTrackingConfig({...input, ga4Id:' G-FIXTURE123 '}), {ga4Id:'G-FIXTURE123',adsId:input.adsId,phoneLabel:input.phoneLabel,leadLabel:input.leadLabel});
  const noAds = resolveTrackingConfig({...input, adsId:''});
  assert.equal(noAds.phoneLabel, ''); assert.equal(noAds.leadLabel, '');
  assert.equal(resolveTrackingConfig({...input,phoneLabel:'AW-123/invalid'}).phoneLabel,'');
});
test('analytics and ad measurement require separate opt-ins with no default permission', () => {
  const config = resolveTrackingConfig(input);
  for (const choice of [null, 'none'] as const) assert.deepEqual(trackingPermissions(choice,config),{analytics:false,ads:false});
  assert.deepEqual(trackingPermissions('analytics',config),{analytics:true,ads:false});
  assert.deepEqual(trackingPermissions('ads',config),{analytics:false,ads:true});
  assert.deepEqual(trackingPermissions('all',config),{analytics:true,ads:true});
  assert.deepEqual(trackingPermissions('all',resolveTrackingConfig({...input,live:false})),{analytics:false,ads:false});
  for (const invalid of [null,'accepted','true','{"analytics":true}']) assert.equal(parseTrackingChoice(invalid),null);
});
test('measurement removes query strings, fragments and external referrer paths', () => {
  assert.deepEqual(measurementPage('https://easytowing.ca/services/lockout/?email=private@example.test#gclid', 'https://search.test/private?phone=123'), {
    page_location:'https://easytowing.ca/services/lockout/',page_referrer:'https://search.test',
  });
  assert.equal(measurementPage('https://easytowing.ca/', 'https://easytowing.ca/services/?name=private#form').page_referrer,'https://easytowing.ca/services/');
  assert.equal(measurementPage('https://easytowing.ca/', 'javascript:alert(1)').page_referrer,'');
});

test('tracking runtime gates destinations, deduplicates views, and stops events on withdrawal', async () => {
  const previous = new Map(['window','document','location'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  const scripts: { id?: string; src?: string }[] = [];
  const location = { href:'https://easytowing.ca/services/local-towing/?email=private@example.test#contact',hostname:'easytowing.ca' };
  const window = {location} as unknown as Window;
  const document = {referrer:'https://search.test/?name=private',title:'Car towing',cookie:'_ga=fixture; _gcl_aw=fixture',getElementById:(id:string)=>scripts.find(script=>script.id===id),createElement:()=>({}),head:{appendChild:(script:{id?:string;src?:string})=>scripts.push(script)}};
  for (const [key,value] of Object.entries({window,document,location})) Object.defineProperty(globalThis,key,{configurable:true,writable:true,value});
  try {
    const {applyTrackingChoice,trackPageView,trackContactEvent} = await import('../src/lib/tracking-client');
    const config = resolveTrackingConfig(input);
    const commands = () => (window.dataLayer || []).map(command=>Array.from(command as ArrayLike<unknown>));
    const events = () => commands().filter(command=>command[0]==='event');
    applyTrackingChoice(null,config); trackPageView(); trackContactEvent('phone_link_click');
    assert.equal(scripts.length,0); assert.equal(window.gtag,undefined);
    applyTrackingChoice('analytics',config); trackPageView(); trackPageView(); trackContactEvent('phone_link_click');
    assert.equal(scripts.length,1);
    assert.equal(events().filter(command=>command[1]==='page_view').length,1);
    assert.equal(events().filter(command=>command[1]==='phone_link_click').length,1);
    assert.equal(events().filter(command=>command[1]==='conversion').length,0);
    assert.ok(!JSON.stringify(commands()).includes('private'));
    applyTrackingChoice('all',config); trackContactEvent('generate_lead');
    assert.equal(scripts.length,1,'one shared Google loader');
    assert.equal(events().filter(command=>command[1]==='conversion').length,1);
    const conversion=events().find(command=>command[1]==='conversion')![2] as Record<string,unknown>;
    assert.equal(conversion.send_to,`${input.adsId}/${input.leadLabel}`);
    assert.equal(conversion.value,undefined,'no fabricated revenue');
    applyTrackingChoice('none',config);
    const count=events().length; trackPageView(); trackContactEvent('phone_link_click'); trackContactEvent('generate_lead');
    assert.equal(events().length,count,'withdrawn permission prevents application events');
    assert.equal((window as unknown as Record<string,unknown>)[`ga-disable-${input.ga4Id}`],true);
    assert.ok(document.cookie.includes('Max-Age=0'));
    applyTrackingChoice('ads',config); trackContactEvent('phone_link_click');
    assert.equal(events().length,count+1,'ads-only choice sends only its labelled conversion');
  } finally {
    for (const [key,descriptor] of previous) { if (descriptor) Object.defineProperty(globalThis,key,descriptor); else Reflect.deleteProperty(globalThis,key); }
  }
});
