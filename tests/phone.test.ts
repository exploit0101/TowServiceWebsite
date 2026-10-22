import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getPhoneContact } from '../src/lib/phone';

// Reserved fictional number: these tests never call a telephone handler.
const fixturePhone = '+12045550100';

test('telephone contact uses an E.164 dial target and preserves readable formatting', () => {
  for (const display of ['204-555-0100', '(204) 555-0100', '+1 (204) 555-0100', '1 204 555 0100']) {
    assert.deepEqual(getPhoneContact(fixturePhone, display), {
      href: 'tel:+12045550100', display,
    });
  }
});

test('telephone contact rejects absent, malformed and non-NANP dial targets', () => {
  for (const phone of ['', '911', '2045550100', '12045550100', '+442071234567', '+11045550100', '+12041550100', '+1204555010', '+120455501000', 'tel:+12045550100']) {
    assert.equal(getPhoneContact(phone, '204-555-0100'), null, phone);
  }
});

test('telephone contact rejects missing or mismatched display numbers', () => {
  for (const display of ['', '   ', 'Phone number coming soon', '204-555-0101', '555-0100', '+44 204 555 0100', '204-555-0100 ext 12']) {
    assert.equal(getPhoneContact(fixturePhone, display), null, display);
  }
});
