import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, expect, type Browser } from '@playwright/test';
import { formspreeEndpoint, whatsappMessage } from '../src/lib/contact';
import { services } from '../src/lib/content';

const origin = (process.env.TEST_ORIGIN || 'http://127.0.0.1:3000').replace(/\/+$/, '');

export async function checkContactForm(browser: Browser) {
  await mkdir(resolve('.qa'), { recursive: true });
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width === 320 ? 568 : 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    let mode: 'success' | 'reject' | 'busy' | 'network' | 'invalid-json' | 'native' = 'success';
    const submissions: string[] = [];
    // Every Formspree request is intercepted. QA never sends an enquiry to the live inbox.
    await context.route('https://formspree.io/**', async route => {
      assert.equal(route.request().url(), formspreeEndpoint);
      assert.equal(route.request().method(), 'POST');
      submissions.push(route.request().postData() || '');
      if (mode === 'native') {
        assert.ok(route.request().isNavigationRequest(), 'hosted verification uses a native POST');
        return route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Formspree verification test</h1>' });
      }
      assert.equal(route.request().headers().accept, 'application/json');
      if (mode === 'network') return route.abort('failed');
      if (mode === 'invalid-json') return route.fulfill({ status: 200, contentType: 'text/html', body: '<html>Not a delivery acknowledgement</html>' });
      if (mode === 'reject') return route.fulfill({ status: 422, json: { errors: [{ code: 'RECAPTCHA_FAILED', message: 'Security check required' }] } });
      if (mode === 'busy') return route.fulfill({ status: 429, json: { errors: [{ message: 'Too many requests' }] } });
      await new Promise(done => setTimeout(done, 250));
      return route.fulfill({ status: 200, json: { ok: true } });
    });
    try {
      const response = await page.goto(origin, { waitUntil: 'networkidle' });
      const html = await response!.text();
      assert.ok(html.includes(`action="${formspreeEndpoint}"`), 'real POST destination is server-rendered');
      const form = page.getByRole('form', { name: 'Request roadside assistance' });
      await expect(form).toHaveAttribute('method', 'POST');
      await expect(form.getByRole('option')).toHaveCount(services.length + 1);
      await form.locator('[name="name"]').focus();
      const priority = page.locator('.assistance-priority');
      const priorityBox = await priority.boundingBox();
      const formBox = await form.boundingBox();
      assert.ok(priorityBox && formBox && priorityBox.y + priorityBox.height <= formBox.y, 'urgent phone contact comes before the request form at every width');
      await expect(priority.locator('a[href^="tel:"]')).toHaveAttribute('href', 'tel:+14314515110');
      for (const field of ['phone', 'location', 'email', 'service', 'message']) {
        await page.keyboard.press('Tab');
        await expect(form.locator(`[name="${field}"]`)).toBeFocused();
      }
      for (const label of ['Name', 'Phone number', 'Address / location', 'Email', 'Service type', 'Message']) await expect(form.getByLabel(label, { exact: false }).first()).toBeVisible();
      await form.getByRole('button', { name: 'Send request', exact: true }).click();
      assert.equal(submissions.length, 0, 'empty required fields do not submit');
      await form.getByLabel('Name', { exact: false }).fill('QA Visitor');
      await form.getByLabel('Phone number', { exact: false }).fill('not-a-phone');
      await form.getByLabel('Address / location', { exact: false }).fill('Winnipeg test intersection');
      await form.getByLabel('Service type', { exact: false }).selectOption({ index: 1 });
      await form.getByRole('button', { name: 'Send request', exact: true }).click();
      await expect(form.getByRole('alert')).toContainText('phone number');
      assert.equal(submissions.length, 0, 'invalid contact details do not submit');
      await form.getByLabel('Phone number', { exact: false }).fill('204-555-0100');
      await form.getByLabel('Email', { exact: false }).fill('qa@example.com');
      await form.getByLabel('Message', { exact: false }).fill('Automated QA fixture, intercepted locally.');
      await form.getByRole('button', { name: 'Send request', exact: true }).click();
      await expect(form.getByRole('button', { name: 'Sending request' })).toBeDisabled();
      await expect(form.getByRole('status')).toContainText('Your request has been sent');
      assert.equal(submissions.length, 1, 'one POST per submission');
      for (const field of ['name', 'phone', 'location', 'email', 'service', 'message', 'contact_notice', '_gotcha']) assert.ok(submissions[0].includes(`name="${field}"`), `${field} reaches the provider`);
      await expect(form.getByLabel('Name', { exact: false })).toHaveValue('');
      await expect(form.getByRole('checkbox')).toHaveCount(0);
      await expect(form.getByRole('status')).toBeFocused();
      const feedbackBox = await form.getByRole('status').boundingBox();
      const chromeBox = await page.locator('.site-chrome').boundingBox();
      const callBox = {y: page.viewportSize()!.height - 5};
      assert.ok(feedbackBox && chromeBox && callBox);
      assert.ok(feedbackBox.y >= chromeBox.y + chromeBox.height, 'confirmation stays below the sticky header');
      assert.ok(feedbackBox.y + feedbackBox.height <= callBox.y, 'confirmation stays inside the viewport, including short phones');

      await form.getByLabel('Name', { exact: false }).fill('QA Visitor');
      await form.getByLabel('Phone number', { exact: false }).fill('204-555-0100');
      await form.getByLabel('Address / location', { exact: false }).fill('Winnipeg test intersection');
      await form.getByLabel('Service type', { exact: false }).selectOption({ index: 1 });
      for (const failure of ['reject', 'busy', 'network', 'invalid-json'] as const) {
        mode = failure;
        await form.getByRole('button', { name: 'Send request', exact: true }).click();
        await expect(form.getByRole('alert')).toBeVisible();
        await expect(form.getByRole('alert')).toBeFocused();
        const errorBox = await form.getByRole('alert').boundingBox();
        const stickyBox = await page.locator('.site-chrome').boundingBox();
        const floatingBox = {y: page.viewportSize()!.height - 5};
        assert.ok(errorBox && stickyBox && floatingBox);
        assert.ok(errorBox.y >= stickyBox.y + stickyBox.height && errorBox.y + errorBox.height <= floatingBox.y, 'delivery errors remain below the header and within the viewport');
        await expect(form.getByLabel('Name', { exact: false })).toHaveValue('QA Visitor');
        await expect(form.getByRole('button', { name: 'Send request', exact: true })).toBeEnabled();
        if (failure === 'reject') await expect(form.getByRole('button', { name: 'Continue with Formspree verification' })).toBeVisible();
        if (failure === 'busy') await expect(form.getByRole('alert')).toContainText('temporarily busy');
        if (failure === 'network' || failure === 'invalid-json') await expect(form.getByRole('alert')).toContainText('couldn’t confirm delivery');
        assert.ok(!submissions.at(-1)!.includes('name="email"'), 'blank optional email is omitted');
      }
      const whatsapp = page.getByRole('link', { name: 'Chat with easytowing on WhatsApp (opens in a new tab)' });
      await expect(whatsapp).toBeVisible();
      await expect(whatsapp).toHaveAttribute('target', '_blank');
      await expect(whatsapp).toHaveAttribute('rel', 'noopener noreferrer');
      const url = new URL((await whatsapp.getAttribute('href'))!);
      assert.equal(url.pathname, '/14314515110');
      assert.equal(url.searchParams.get('text'), whatsappMessage);
      await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
      for (const theme of ['light', 'dark']) {
        await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
        await page.locator('.assistance-panel').scrollIntoViewIfNeeded();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${width}px ${theme}: no horizontal overflow`);
        const fieldLayout = await page.locator('.assistance-fields').evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length);
        assert.equal(fieldLayout, 1, 'each field occupies its own row');
        const inputBoxes = await form.locator('.assistance-field :is(input, select, textarea)').evaluateAll(elements => elements.map(element => {
          const box = element.getBoundingClientRect();
          return { top: box.top, bottom: box.bottom, left: box.left, width: box.width };
        }));
        for (let index = 1; index < inputBoxes.length; index++) {
          assert.ok(inputBoxes[index].top >= inputBoxes[index - 1].bottom, 'input boxes never share a row');
          assert.ok(Math.abs(inputBoxes[index].left - inputBoxes[0].left) < 1, 'input boxes align consistently');
        }
        const fieldWidth = await form.locator('.assistance-fields').evaluate(element => element.getBoundingClientRect().width);
        for (const box of inputBoxes) assert.ok(Math.abs(box.width - fieldWidth) < 1, 'inputs use the full available width');
        const labelBoxes = await form.locator('.assistance-field label').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().width));
        assert.ok(labelBoxes.every(width => width <= 1), 'field labels stay available to assistive technology without a visible label column');
        if (width === 390 || width === 1440) {
          await page.locator('.assistance-panel').screenshot({ path: resolve('.qa', `contact-${width}-${theme}.png`), style: '.site-chrome, .floating-call, .skip-link, nextjs-portal { visibility: hidden !important; }' });
          await page.locator('.site-footer').screenshot({ path: resolve('.qa', `footer-${width}-${theme}.png`), style: '.site-chrome, .floating-call, .skip-link, nextjs-portal { visibility: hidden !important; }' });
        }
      }
      mode = 'reject';
      await form.getByRole('button', { name: 'Send request', exact: true }).click();
      await expect(form.getByRole('button', { name: 'Continue with Formspree verification' })).toBeVisible();
      mode = 'native';
      await form.getByRole('button', { name: 'Continue with Formspree verification' }).click();
      await expect(page.getByRole('heading', { name: 'Formspree verification test' })).toBeVisible();
      await page.goto(`${origin}/request-help/`, { waitUntil: 'networkidle' });
      await expect(page.getByRole('form', { name: 'Request roadside assistance' })).toHaveCount(1);
      console.log(`PASS ${width}px: SSR form, all 11 services, validation, mocked success/422/429/network/malformed response, hosted verification, both themes and WhatsApp draft.`);
    } finally { await context.close(); }
  }
  const noScript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  try {
    const page = await noScript.newPage();
    await noScript.route('https://formspree.io/**', async route => {
      assert.equal(route.request().url(), formspreeEndpoint);
      assert.equal(route.request().method(), 'POST');
      return route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Native form test received</h1>' });
    });
    await page.goto(`${origin}/request-help/`);
    const form = page.getByRole('form', { name: 'Request roadside assistance' });
    await form.locator('[name="name"]').fill('QA Visitor');
    await form.locator('[name="phone"]').fill('204-555-0100');
    await form.locator('[name="location"]').fill('Winnipeg test intersection');
    await form.locator('[name="service"]').selectOption({ index: 1 });
    await form.getByRole('button', { name: 'Send request' }).click();
    await expect(page.getByRole('heading', { name: 'Native form test received' })).toBeVisible();
    console.log('PASS keyboard field order and native POST with JavaScript disabled. No live enquiry or WhatsApp message sent.');
  } finally { await noScript.close(); }
}

async function main() {
  const browser = await chromium.launch({ channel: process.env.TEST_BROWSER_CHANNEL || 'chrome', headless: true });
  try { await checkContactForm(browser); } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
