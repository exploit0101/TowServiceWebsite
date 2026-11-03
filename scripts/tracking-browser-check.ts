import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium, expect, type Page } from '@playwright/test';
import { formspreeEndpoint } from '../src/lib/contact';

const origin = (process.env.TEST_ORIGIN || 'http://127.0.0.1:3000').replace(/\/+$/, '');
const commands = (page: Page) => page.evaluate(() => (window.dataLayer || []).map(command => Array.from(command as ArrayLike<unknown>)));
async function eventCount(page: Page, name: string) { return (await commands(page)).filter(command => command[0] === 'event' && command[1] === name).length; }
async function main() {
  const browser = await chromium.launch({channel:process.env.TEST_BROWSER_CHANNEL || 'chrome',headless:true});
  await mkdir('.qa',{recursive:true});
  try {
    for (const width of [320,390,1440]) {
      const context = await browser.newContext({viewport:{width,height:width===320?568:900},reducedMotion:'reduce'});
      const requests: string[] = [];
      await context.route(/https:\/\/[^/]*(?:googletagmanager|google-analytics|googleadservices|doubleclick)\.(?:com|net)\//, async route => {
        requests.push(route.request().url());
        await route.fulfill({status:200,contentType:'application/javascript',body:'/* Measurement mocked: no data sent to Google. */'});
      });
      const page = await context.newPage();
      const errors: string[] = []; page.on('pageerror',error=>errors.push(error.message));
      await page.addInitScript(() => document.addEventListener('click', event => {
        if (event.target instanceof Element && event.target.closest('a[href^="tel:"]')) event.preventDefault();
      },true));
      try {
        await page.goto(`${origin}/?email=private@example.test#gclid`,{waitUntil:'networkidle'});
        const panel = page.getByRole('complementary',{name:'Optional measurement'});
        const active = await panel.count() > 0;
        if (process.env.EXPECT_TRACKING === '1') assert.equal(active,true,'the active integration must be exercised with test destination IDs');
        assert.equal(requests.length,0,'no Google request before an opt-in');
        if (!active) {
          assert.equal(await page.locator('#google-tag').count(),0);
          await expect(page.getByRole('button',{name:'Privacy choices',exact:true})).toHaveCount(0);
          await page.evaluate(() => sessionStorage.setItem('easytowing.measurement.v1','all'));
          await page.reload({waitUntil:'networkidle'});
          assert.equal(requests.length,0,'a remembered opt-in cannot enable disabled tracking');
          await expect(page.locator('#google-tag, #measurement-preferences, .privacy-settings')).toHaveCount(0);
          await page.goto(`${origin}/privacy/`,{waitUntil:'networkidle'});
          await expect(page.locator('main')).toContainText('No Google analytics or advertising tags load');
          console.log(`PASS ${width}px: tracking stays off, no consent UI, remembered opt-in ignored and privacy notice matches`);
          continue;
        }
        const analytics = panel.locator('input[name="analytics"]');
        const ads = panel.locator('input[name="ads"]');
        const hasAnalytics = await analytics.count() > 0;
        const hasAds = await ads.count() > 0;
        if (hasAnalytics) await expect(analytics).not.toBeChecked();
        if (hasAds) await expect(ads).not.toBeChecked();
        assert.ok(await panel.evaluate(element => element.getBoundingClientRect().width <= innerWidth-20));
        for (const button of await panel.getByRole('button').all()) {
          const box=await button.boundingBox(); assert.ok(box && box.height>=44 && box.y+box.height <= (width===320?568:900));
        }
        await page.screenshot({path:`.qa/measurement-${width}-light.png`});
        await panel.getByRole('button',{name:'Decline all',exact:true}).click();
        await expect(panel).toBeHidden();
        await page.locator('.header-call').click();
        assert.equal(requests.length,0); assert.equal((await commands(page)).length,0);
        await page.reload({waitUntil:'networkidle'});
        await expect(panel).toBeHidden(); assert.equal(requests.length,0,'decline survives reload');
        await page.getByRole('button',{name:'Privacy choices',exact:true}).click();
        if (hasAnalytics) await analytics.check(); else await ads.check();
        await panel.getByRole('button',{name:'Save choices',exact:true}).click();
        await expect.poll(()=>requests.length).toBe(1);
        const gaId=(await commands(page)).find(command=>command[0]==='config' && String(command[1]).startsWith('G-'))?.[1];
        if (hasAnalytics) {
          assert.ok(gaId); assert.equal(await eventCount(page,'page_view'),1);
          assert.equal((await commands(page)).filter(command=>command[0]==='config' && String(command[1]).startsWith('AW-')).length,0,'analytics alone does not configure Ads');
          await page.locator('.header-call').click();
          assert.equal(await eventCount(page,'phone_link_click'),1);
          assert.equal(await eventCount(page,'conversion'),0);
        }
        assert.ok(!JSON.stringify(await commands(page)).includes('private@example.test'),'application events exclude query-string personal details');
        await page.locator('.service-list-item a').first().click();
        await expect(page.locator('.service-landing')).toBeVisible();
        if (hasAnalytics) await expect.poll(()=>eventCount(page,'page_view')).toBe(2);
        await page.getByRole('button',{name:'Privacy choices',exact:true}).click();
        if (hasAds) await ads.check();
        await panel.getByRole('button',{name:'Save choices',exact:true}).click();
        await page.locator('.service-landing-request').click();
        await expect(page.locator('.assistance-form-card')).toBeVisible();
        let successful = false;
        await page.route(formspreeEndpoint,route=>route.fulfill({status:successful?200:500,contentType:'application/json',body:JSON.stringify(successful?{ok:true}:{error:'test failure'})}));
        const form=page.getByRole('form',{name:'Request roadside assistance'});
        await form.getByLabel('Name',{exact:true}).fill('Private fixture name');
        await form.getByLabel('Phone number').fill('204-555-0100');
        await form.getByLabel('Address / location').fill('Private fixture location');
        await form.getByLabel('Service type').selectOption({index:1});
        const countBefore=await eventCount(page,'generate_lead');
        const conversionsBefore=await eventCount(page,'conversion');
        await form.getByRole('button',{name:'Send request'}).click();
        await expect(form.getByRole('alert')).toBeVisible();
        assert.equal(await eventCount(page,'generate_lead'),countBefore,'failed form delivery is not a lead');
        assert.equal(await eventCount(page,'conversion'),conversionsBefore,'failed form delivery is not an Ads conversion');
        successful=true;
        await form.getByRole('button',{name:'Send request'}).click();
        await expect(form.getByRole('status')).toContainText('Your request has been sent');
        if (hasAnalytics) assert.equal(await eventCount(page,'generate_lead'),countBefore+1);
        if (hasAds && process.env.EXPECT_TRACKING === '1') assert.equal(await eventCount(page,'conversion'),conversionsBefore+1,'confirmed delivery sends the configured Ads lead conversion once');
        assert.ok(!JSON.stringify(await commands(page)).includes('Private fixture'),'form data stays out of events');
        const adId=(await commands(page)).find(command=>command[0]==='config' && String(command[1]).startsWith('AW-'))?.[1];
        if (hasAds) assert.ok(adId,'Ads config is only added after its opt-in');
        await page.getByRole('button',{name:'Privacy choices',exact:true}).click();
        await panel.getByRole('button',{name:'Decline all',exact:true}).click();
        const afterDecline=await commands(page);
        await page.locator('.header-call').click();
        assert.equal((await commands(page)).length,afterDecline.length,'withdrawal prevents new application events');
        if (hasAnalytics) assert.equal(await page.evaluate(id=>(window as unknown as Record<string,unknown>)[`ga-disable-${id}`],String(gaId)),true);
        await page.getByRole('button',{name:'Privacy choices',exact:true}).click();
        if (hasAds) {
          await ads.check();
          await panel.getByRole('button',{name:'Save choices',exact:true}).click();
          const phoneEvents=await eventCount(page,'phone_link_click');
          const adEvents=await eventCount(page,'conversion');
          await page.locator('.header-call').click();
          assert.equal(await eventCount(page,'phone_link_click'),phoneEvents,'ad-only permission does not send GA4 events');
          if (process.env.EXPECT_TRACKING === '1') assert.equal(await eventCount(page,'conversion'),adEvents+1,'phone tap sends only the configured Ads micro-conversion');
          await page.getByRole('button',{name:'Privacy choices',exact:true}).click();
        }
        await page.getByRole('button',{name:'Switch to dark theme'}).click();
        await page.screenshot({path:`.qa/measurement-${width}-dark.png`});
        assert.deepEqual(errors,[]);
        console.log(`PASS ${width}px: opt-ins, decline, reload, route views, phone micro-events, failed/successful forms, withdrawal and themes (Google/Formspree mocked)`);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
