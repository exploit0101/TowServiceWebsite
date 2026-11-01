import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
import { services } from '../src/lib/content';
import launch from '../config/launch.json';

const origin=(process.env.TEST_ORIGIN || 'http://127.0.0.1:3000').replace(/\/+$/,'');
async function main() {
const browser=await chromium.launch({channel:process.env.TEST_BROWSER_CHANNEL || 'chrome',headless:true});
await mkdir('.qa',{recursive:true});
try {
  for(const [width,height] of [[320,568],[390,844],[768,900],[1440,1000]]) {
    const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
    const page=await context.newPage();
    const errors:string[]=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error') errors.push(message.text());});
    for(const service of services) {
      const response=await page.goto(`${origin}/services/${service.id}/`,{waitUntil:'networkidle'});
      assert.equal(response?.status(),200,service.id);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toContainText(service.name);
      await expect(page.locator('h1')).toContainText('in Winnipeg');
      assert.equal(await page.locator('.service-artwork [data-service-icon]').getAttribute('data-service-icon'),service.icon);
      for(const theme of ['light','dark']) {
        await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
        const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
        assert.ok(overflow<=1,`${width}px ${theme} ${service.id}: no horizontal overflow`);
        const call=page.locator('.service-landing-actions').getByRole('link',{name:'Call',exact:true});
        await expect(call).toHaveAttribute('href',`tel:${launch.supportPhone}`);
        const box=await call.boundingBox();
        assert.ok(box && box.height>=44 && box.y>=0 && box.y+box.height<=height,`${width}×${height} ${service.id}: Call is in the opening screen (${JSON.stringify(box)})`);
        await expect(page.locator('.service-landing-phone')).toContainText(launch.displayPhone);
        await expect(page.locator('.service-landing-request')).toHaveAttribute('href',/\/request-help\/?$/);
        const text=await page.locator('.service-landing-copy').evaluate(element=>({width:element.clientWidth,scroll:element.scrollWidth}));
        assert.ok(text.scroll<=text.width+1,`${service.id}: hero copy fits`);
      }
      await page.evaluate(()=>document.documentElement.dataset.theme='light');
      const quote=page.locator('.service-fine-details details').nth(1);
      await quote.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(quote).toHaveAttribute('open','');
      await expect(quote.getByRole('link')).toHaveAttribute('href',/\/rates-and-disclosures\/?$/);
      await expect(page.locator('.service-other .service-list-item')).toHaveCount(services.length-1);
      for(const target of await page.locator('a[href^="tel:"]').evaluateAll(links=>links.map(link=>link.getAttribute('href')))) assert.equal(target,`tel:${launch.supportPhone}`);
      const html=await response!.text();
      assert.ok(!html.includes('Call to check availability'),'short Call label is server-rendered');
      for(const scope of service.scope) await expect(page.getByText(scope,{exact:true})).toHaveCount(1);
      if(['local-towing','battery-boost','fuel-delivery'].includes(service.id) && [390,1440].includes(width)) {
        await page.evaluate(()=>window.scrollTo(0,0));
        await page.screenshot({path:`.qa/service-${service.id}-${width}.png`,fullPage:true});
        await page.evaluate(()=>document.documentElement.dataset.theme='dark');
        await page.locator('.service-landing-top').screenshot({path:`.qa/service-${service.id}-${width}-dark.png`});
      }
    }
    assert.deepEqual(errors,[],`${width}px service pages have no browser errors`);
    await context.close();
    console.log(`PASS ${width}×${height}: all ${services.length} service destinations, both themes, first-screen Call, readable number, request links, keyboard details, scope and related links.`);
  }
} finally { await browser.close(); }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
