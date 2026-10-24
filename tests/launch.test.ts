import { test } from 'node:test';
import assert from 'node:assert/strict';
import launch from '../config/launch.json';
import { launchErrors, type LaunchConfig } from '../src/lib/launch';
function verifiedFixture(): LaunchConfig {
  return { ...launch, businessStatus:'operating', brandName:'Test fixture',legalName:'Fixture business',providerRole:'Coordinator of independent operators',phoneMode:'verified',supportPhone:'+12045551234',displayPhone:'204-555-1234',supportEmail:'test@fixture.test',canonicalDomain:'https://fixture.test',serviceHours:'Owner-approved hours',operatorDetails:'Fixture quote and invoice responsibilities',areas:['Verified test zone'],offers:['battery-boost'],prices:['Approved quote terms'],approvedIndexableRoutes:['/','/services','/services/battery-boost'],approvals:Object.fromEntries(Object.keys(launch.approvals).map(key => [key,true])) };
}
test('proposed business status blocks an otherwise complete launch fixture', () => { const errors=launchErrors({...verifiedFixture(),businessStatus:'proposed'}); assert.ok(errors.some(error=>error.includes('operating'))); });
test('complete fixture passes structural gates; each required approval fails closed', () => {
  const config=verifiedFixture(); assert.deepEqual(launchErrors(config),[]);
  for (const field of ['identity','monitoredCanadianPhone','partnerCoverage','provincialCompliance','partnerCredentialsAndInsurance','ratesAndConsent','privacyAndRetention','legalTexts']) {
    assert.ok(launchErrors({...config,approvals:{...config.approvals,[field]:false}}).some(error=>error.includes(field)));
  }
});
test('reject unknown markets, services, unapproved route indexing and placeholder canonical origins', () => {
  const config=verifiedFixture();
  for (const pilotMarket of ['', 'toString', 'all-winnipeg']) assert.ok(launchErrors({...config,pilotMarket}).length);
  assert.ok(launchErrors({...config,offers:['collision-recovery']}).length);
  assert.ok(launchErrors({...config,approvedIndexableRoutes:['/','/services/local-towing']}).length);
  for (const canonicalDomain of ['http://fixture.test','https://example.com','https://localhost','https://fixture.test/path','https://fixture.test?key=x']) assert.ok(launchErrors({...config,canonicalDomain}).length);
});
test('Ontario selection needs separate restricted-highway handling approval', () => {
  const config=verifiedFixture();
  assert.ok(launchErrors({...config,pilotMarket:'brampton-bramalea',approvals:{...config.approvals,restrictedHighwayHandling:false}}).some(error=>error.includes('restricted-highway')));
});

test('owner-approved phone-only support permits launch without an invented email', () => {
  const config=verifiedFixture();
  assert.deepEqual(launchErrors({...config,supportChannel:'phone',supportEmail:''}),[]);
  assert.ok(launchErrors({...config,supportChannel:'email',supportEmail:''}).some(error=>error.includes('email')));
  assert.ok(launchErrors({...config,supportChannel:'phone',supportEmail:'invalid'}).some(error=>error.includes('email')));
});

test('production rejects unverified phone modes and reserved fictional numbers even with approvals', () => {
  const config=verifiedFixture();
  assert.ok(launchErrors({...config,phoneMode:'demo'}).length);
  assert.ok(launchErrors({...config,phoneMode:'unconfigured'}).length);
  assert.ok(launchErrors({...config,phoneMode:'owner-provided'}).length);
  for (const ending of ['0100','0150','0199']) {
    assert.ok(launchErrors({...config,supportPhone:`+1204555${ending}`,displayPhone:`204-555-${ending}`}).length);
  }
});
