import { test } from 'node:test';
import assert from 'node:assert/strict';
import launch from '../config/launch.json';
import { launchErrors, type LaunchConfig } from '../src/lib/launch';
function verifiedFixture(): LaunchConfig {
  return { ...launch, businessStatus:'operating', brandName:'Test fixture',legalName:'Fixture business',providerRole:'Coordinator of independent operators',phoneMode:'verified',supportPhone:'+12045551234',displayPhone:'204-555-1234',supportEmail:'test@fixture.test',canonicalDomain:'https://fixture.test',serviceHours:'Owner-approved hours',operatorDetails:'Fixture quote and invoice responsibilities',areas:['Verified test zone'],offers:['battery-boost'],prices:['Approved quote terms'],approvedIndexableRoutes:['/','/services','/services/battery-boost'],approvals:Object.fromEntries(Object.keys(launch.approvals).map(key => [key,true])) };
}
test('proposed checked-in configuration blocks launch', () => { const errors=launchErrors(launch); assert.ok(errors.length >= 10); assert.ok(errors.some(x=>x.includes('operating'))); });
test('complete fixture passes structural gates; each required approval fails closed', () => {
  const config=verifiedFixture(); assert.deepEqual(launchErrors(config),[]);
  for (const field of ['identity','monitoredCanadianPhone','partnerCoverage','provincialCompliance','partnerCredentialsAndInsurance','ratesAndConsent','privacyAndRetention','legalTexts']) {
    assert.ok(launchErrors({...config,approvals:{...config.approvals,[field]:false}}).some(error=>error.includes(field)));
  }
});
test('reject unknown markets, services, unapproved route indexing and placeholder canonical origins', () => {
  const config=verifiedFixture();
  for (const pilotMarket of ['', 'toString', 'all-winnipeg']) assert.ok(launchErrors({...config,pilotMarket}).length);
  assert.ok(launchErrors({...config,offers:['winch-out']}).length);
  assert.ok(launchErrors({...config,approvedIndexableRoutes:['/','/services/local-towing']}).length);
  for (const canonicalDomain of ['http://fixture.test','https://example.com','https://localhost','https://fixture.test/path','https://fixture.test?key=x']) assert.ok(launchErrors({...config,canonicalDomain}).length);
});
test('Ontario selection needs separate restricted-highway handling approval', () => {
  const config=verifiedFixture();
  assert.ok(launchErrors({...config,pilotMarket:'brampton-bramalea',approvals:{...config.approvals,restrictedHighwayHandling:false}}).some(error=>error.includes('restricted-highway')));
});

test('production rejects demo mode and reserved fictional numbers even with approvals', () => {
  const config=verifiedFixture();
  assert.ok(launchErrors({...config,phoneMode:'demo'}).length);
  assert.ok(launchErrors({...config,phoneMode:'unconfigured'}).length);
  for (const ending of ['0100','0150','0199']) {
    assert.ok(launchErrors({...config,supportPhone:`+1204555${ending}`,displayPhone:`204-555-${ending}`}).length);
  }
});
