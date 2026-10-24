import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, expect, type Page } from '@playwright/test';

const origin = (process.env.TEST_ORIGIN || 'http://127.0.0.1:3000').replace(/\/+$/, '');
const screenshotDirectory = resolve('.qa');
const widths = [320,375,390,768,1024,1440];
const phoneHref = 'tel:+16728899764';

async function checkLayout(page: Page, label: string) {
  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),
  }));
  assert.ok(overflow.content <= overflow.viewport + 1,`${label}: horizontal page overflow ${JSON.stringify(overflow)}`);
  const parts = ['.brand','.menu-toggle','#main-navigation','.header-contact'];
  const boxes: { selector:string; x:number; y:number; width:number; height:number }[] = [];
  for (const selector of parts) {
    const element = page.locator(`.site-header ${selector}`);
    if (await element.isVisible()) {
      const box = await element.boundingBox();
      if (box) boxes.push({selector,...box});
    }
  }
  for (let first=0;first<boxes.length;first++) for (let second=first+1;second<boxes.length;second++) {
    const a=boxes[first],b=boxes[second];
    const overlapWidth=Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x);
    const overlapHeight=Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y);
    assert.ok(overlapWidth <= 1 || overlapHeight <= 1,`${label}: header overlap between ${a.selector} and ${b.selector}`);
  }
  const readablePhone=page.locator('.header-phone-number');
  await expect(readablePhone).toBeVisible();
  await expect(readablePhone).toHaveAttribute('href',phoneHref);
  await expect(readablePhone).toContainText('672-889-9764');
  const numberBox=await readablePhone.boundingBox();
  const callBox=await page.locator('.header-call').boundingBox();
  assert.ok(numberBox && callBox,`${label}: both header contact actions have layout`);
  assert.ok(Math.min(numberBox.x+numberBox.width,callBox.x+callBox.width)-Math.max(numberBox.x,callBox.x) <= 1 || Math.min(numberBox.y+numberBox.height,callBox.y+callBox.height)-Math.max(numberBox.y,callBox.y) <= 1,`${label}: number overlaps call button`);
  const targets=await page.locator('a[href^="tel:"]').evaluateAll(elements => elements.map(element => element.getAttribute('href')));
  assert.ok(targets.length >= 2 && targets.every(target => target === phoneHref),`${label}: every telephone action uses the owner-provided number`);
}

async function checkHomeInteractions(page: Page, width: number) {
  const cards=page.locator('#services article.compact-service-card');
  await expect(cards).toHaveCount(7);
  assert.equal(await cards.locator('.compact-service-icon svg').count(),7,'all seven services have icons');
  const track=page.locator('.service-carousel-track');
  await expect(page.getByRole('button',{name:'Next services',exact:true})).toBeEnabled();
  const startingScroll=await track.evaluate(element => element.scrollLeft);
  await page.getByRole('button',{name:'Next services',exact:true}).click();
  await expect.poll(() => track.evaluate(element => element.scrollLeft)).toBeGreaterThan(startingScroll+5);
  await page.getByRole('button',{name:'View all services',exact:true}).click();
  await expect(track).toHaveClass(/is-expanded/);
  await expect(page.getByRole('button',{name:'Show carousel',exact:true})).toHaveAttribute('aria-pressed','true');
  await checkLayout(page,`${width}px expanded services`);
  await page.getByRole('button',{name:'Show carousel',exact:true}).click();
  await expect(track).not.toHaveClass(/is-expanded/);

  const menu=page.getByRole('button',{name:'Open navigation',exact:true});
  if (await menu.isVisible()) {
    await menu.click();
    await expect(page.getByRole('button',{name:'Close navigation',exact:true})).toHaveAttribute('aria-expanded','true');
    await expect(page.locator('#main-navigation')).toBeVisible();
    await page.locator('#main-navigation').getByRole('link',{name:'Contact',exact:true}).click();
    await expect(page.getByRole('button',{name:'Open navigation',exact:true})).toHaveAttribute('aria-expanded','false');
    await expect(page.locator('#main-navigation')).toBeHidden();
    await expect(page).toHaveURL(/#contact$/);
  }

  const tiles=page.locator('.fleet-tile');
  await expect(tiles).toHaveCount(6);
  for (let index=0;index<6;index++) {
    const image=tiles.nth(index).locator('img');
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0),{message:`${width}px gallery image ${index+1} loads`}).toBe(true);
    assert.ok(await image.getAttribute('alt'),`gallery image ${index+1} has descriptive alt text`);
  }
  const trigger=tiles.first();
  await trigger.click();
  const dialog=page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  assert.equal(await dialog.evaluate(element => element instanceof HTMLDialogElement && element.open),true,'gallery uses an open native dialog');
  await expect(page.locator('.lightbox-counter')).toHaveText('1 of 6');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.lightbox-counter')).toHaveText('2 of 6');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await checkLayout(page,`${width}px after gallery`);
}

async function main() {
  await mkdir(screenshotDirectory,{recursive:true});
  const browser=await chromium.launch({channel:process.env.TEST_BROWSER_CHANNEL || 'chrome',headless:true});
  try {
    for (const width of widths) {
      const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
      const page=await context.newPage();
      page.setDefaultTimeout(15000);
      const errors:string[]=[];
      page.on('pageerror',error => errors.push(error.message));
      page.on('console',message => { if (message.type() === 'error') errors.push(message.text()); });
      const response=await page.goto(origin,{waitUntil:'networkidle',timeout:60000});
      assert.ok(response,`${width}px home navigation returns a response`);
      assert.equal(response.status(),200,`${width}px home loads`);
      const serverHtml=await response.text();
      assert.equal((serverHtml.match(/<article class="compact-service-card"/g) || []).length,7,'service cards are server-rendered');
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('.site-header .brand')).toContainText('easytowing');
      await page.evaluate(() => document.fonts.ready);
      await checkLayout(page,`${width}px home`);
      await checkHomeInteractions(page,width);
      if (width === 390 || width === 1440) {
        await page.goto(origin,{waitUntil:'networkidle',timeout:60000});
        for (const image of await page.locator('.fleet-grid img').all()) {
          await image.scrollIntoViewIfNeeded();
          await expect.poll(() => image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
        }
        await page.evaluate(() => window.scrollTo(0,0));
        await page.screenshot({path:resolve(screenshotDirectory,`easytowing-${width}-full.png`),fullPage:true});
        await page.locator('.hero').screenshot({path:resolve(screenshotDirectory,`easytowing-${width}-hero.png`)});
      }
      if (width === 320 || width === 390) {
        for (const path of ['/contact','/services/battery-boost']) {
          const response=await page.goto(`${origin}${path}/`,{waitUntil:'networkidle',timeout:60000});
          assert.equal(response?.status(),200,`${width}px ${path} loads`);
          await checkLayout(page,`${width}px ${path}`);
        }
      }
      assert.deepEqual(errors,[],`${width}px: no JavaScript or browser console errors`);
      await context.close();
      console.log(`PASS ${width}px: layout, visible phone, service carousel, mobile navigation, gallery keyboard flow and loaded images`);
    }
    console.log(`PASS browser QA; desktop/mobile screenshots saved to ${screenshotDirectory}. No call links were activated.`);
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode=1; });
