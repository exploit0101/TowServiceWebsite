import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formspreeEndpoint, validateContact, whatsappLink, whatsappMessage } from '../src/lib/contact';

const serviceNames = ['Car towing', 'Boosting & jump start'];
function enquiry(changes: Record<string, string | undefined> = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ name: 'QA Visitor', phone: '+1 (204) 555-0100', location: 'Winnipeg intersection', service: 'Car towing', email: '', message: '', _gotcha: '', ...changes })) data.set(key, value || '');
  return data;
}
test('enquiry accepts minimum details without requiring email or a precise address', () => {
  assert.equal(validateContact(enquiry(), serviceNames), null);
  assert.equal(validateContact(enquiry({ phone: '+44 20 7946 0123', email: 'qa@example.com', message: 'Need roadside help.' }), serviceNames), null);
  assert.equal(formspreeEndpoint, 'https://formspree.io/f/xkjjownd');
});
test('enquiry rejects unknown services, invalid contact details, spam and excessive text', () => {
  for (const change of [{ name: ' ' }, { name: 'a'.repeat(81) }, { phone: '911' }, { phone: 'not-a-phone' }, { location: '' }, { location: 'a'.repeat(201) }, { service: 'Unapproved service' }, { email: 'bad-email' }, { message: 'a'.repeat(2001) }, { _gotcha: 'spam' }]) {
    assert.ok(validateContact(enquiry(change), serviceNames), JSON.stringify(change));
  }
});
test('WhatsApp links use the actual international business number and a URL-encoded draft', () => {
  const link = whatsappLink('+14314515110');
  assert.ok(link);
  const url = new URL(link);
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/14314515110');
  assert.equal(url.searchParams.get('text'), whatsappMessage);
  for (const invalid of ['', '431-451-5110', '+0000', '+1<script>']) assert.equal(whatsappLink(invalid), null);
});
