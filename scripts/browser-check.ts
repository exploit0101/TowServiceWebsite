import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, expect, type Page } from '@playwright/test';
import { services } from '../src/lib/content';
import { homepageServiceIds } from '../src/lib/service-catalog';

const origin = (process.env.TEST_ORIGIN || 'http://127.0.0.1:3000').replace(/\/+$/, '');
const screenshotDirectory = resolve('.qa');
const widths = [320,375,390,768,1024,1440];
const phoneHref = 'tel:+16728899764';
const homepageServices = homepageServiceIds.map(id => services.find(service => service.id === id)!);

async function checkLayout(page: Page, label: string) {
  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),
  }));
  assert.ok(overflow.content <= overflow.viewport + 1,`${label}: horizontal page overflow ${JSON.stringify(overflow)}`);
  const chrome=await page.locator('.site-chrome').boundingBox();
  const ticker=await page.locator('.service-ticker').boundingBox();
  const header=await page.locator('.site-header').boundingBox();
  assert.ok(chrome && ticker && header,`${label}: sticky header and service strip exist`);
  assert.ok(Math.abs(ticker.y)<1,`${label}: the service strip stays at the top while scrolling`);
  assert.ok(ticker.height>=38,`${label}: the complete service strip remains visible`);
  assert.ok(header.y >= ticker.y+ticker.height-1,`${label}: the strip does not overlap the header`);
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
  await expect(page.locator('footer')).toContainText('easytowing coordinates independent');
  await expect(page.locator('footer')).not.toContainText(/pre-launch/i);
}

async function checkHomeInteractions(page: Page, width: number) {
  const cards=page.locator('#services article.compact-service-card');
  await expect(cards).toHaveCount(homepageServices.length);
  assert.equal(await cards.locator('.compact-service-icon svg').count(),homepageServices.length,'all nine homepage services have icons');
  const track=page.locator('.service-carousel-track');
  const mobile=width <= 767;
  if (mobile) await expect(track).toHaveClass(/is-expanded/);
  else await expect(track).not.toHaveClass(/is-expanded/);
  await track.scrollIntoViewIfNeeded();
  await page.mouse.move(0,0);
  const reducedStart=await track.evaluate(element => element.scrollLeft);
  await page.waitForTimeout(450);
  assert.ok(Math.abs(await track.evaluate(element => element.scrollLeft)-reducedStart) <= 1,'reduced motion stops automatic movement');
  if (mobile) {
    await expect(page.locator('.carousel-controls')).toHaveCount(0);
    await expect(page.locator('.service-carousel-toggle')).toHaveCount(0);
    const grid=await track.evaluate(element => ({width:element.clientWidth,content:element.scrollWidth,left:element.scrollLeft,columns:getComputedStyle(element).gridTemplateColumns.split(' ').length}));
    assert.ok(grid.content <= grid.width+1 && grid.left === 0,'mobile service cards all fit the static grid');
    assert.equal(grid.columns,2,'mobile services use two readable columns');
    await expect(page.getByRole('region',{name:'Service options',exact:true})).not.toHaveAttribute('aria-roledescription','carousel');
  } else await expect(page.getByRole('button',{name:'Resume movement',exact:true})).toBeVisible();
  assert.equal(await page.locator('.service-ticker-track').evaluate(element => getComputedStyle(element).animationName),'none','reduced motion stops the top strip');
  assert.equal(await page.locator('.availability-dot').evaluate(element => getComputedStyle(element).animationName),'none','reduced motion stops the availability pulse');
  await expect(page.locator('.service-ticker-group:not([aria-hidden]) li')).toHaveCount(services.length);
  for (const service of homepageServices) {
    const card=cards.filter({has:page.getByRole('heading',{name:service.name,exact:true})});
    await expect(card.getByRole('heading',{name:service.name,exact:true})).toBeVisible();
    await expect(card.locator('a[href^="tel:"]')).toHaveAttribute('href',phoneHref);
    await expect(card.locator('a[href*="/services/"]').first()).toHaveAttribute('href',new RegExp('/services/' + service.id + '/?$'));
  }
  if (!mobile) {
  await expect(page.getByRole('button',{name:'Next services',exact:true})).toBeEnabled();
  const startingScroll=await track.evaluate(element => element.scrollLeft);
  await page.getByRole('button',{name:'Next services',exact:true}).click();
  await expect.poll(() => track.evaluate(element => element.scrollLeft)).toBeGreaterThan(startingScroll+5);
  await expect(page.getByRole('button',{name:'Resume movement',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'View all services',exact:true}).click();
  await expect(track).toHaveClass(/is-expanded/);
  await expect(page.getByRole('button',{name:'Show carousel',exact:true})).toHaveAttribute('aria-pressed','true');
  await checkLayout(page,`${width}px expanded services`);
  const grid=await track.evaluate(element => ({width:element.clientWidth,content:element.scrollWidth,left:element.scrollLeft}));
  assert.ok(grid.content <= grid.width+1,width + 'px: expanded categories do not hide in a horizontal carousel');
  assert.ok(grid.left <= 1,'expanding resets the horizontal reading position');
  await page.getByRole('button',{name:'Show carousel',exact:true}).click();
  await expect(track).not.toHaveClass(/is-expanded/);
  await expect(page.getByRole('button',{name:'Resume movement',exact:true})).toBeVisible();
  }
  await expect(page.locator('#reviews')).toBeVisible();
  await expect(page.locator('#reviews .review-summary')).toContainText('4.9/5');
  await expect(page.locator('#reviews .review-card')).toHaveCount(3);
  await expect(page.locator('#reviews .review-source')).toContainText('supplied by EasyTowing');
  await expect(page.locator('#reviews .review-person > strong')).toHaveText(['Michael Thompson','Sarah Mitchell','Mathew']);
  await expect(page.locator('#reviews .review-date-label')).toHaveText(['1 week ago','2 weeks ago','4 weeks ago']);
  await expect(page.locator('.hero-tagline')).toContainText('Quick roadside help. 25-minute arrival estimate.');
  await expect(page.locator('.hero-brand-watermark')).toHaveAttribute('aria-hidden','true');
  await expect(page.locator('.arrival-estimate')).toContainText('25-minute arrival estimate');
  const menu=page.getByRole('button',{name:'Open navigation',exact:true});
  if (await menu.isVisible()) {
    await menu.click();
    await expect(page.getByRole('button',{name:'Close navigation',exact:true})).toHaveAttribute('aria-expanded','true');
    await expect(page.locator('#main-navigation')).toBeVisible();
    await page.locator('#main-navigation').getByRole('link',{name:'Reviews',exact:true}).click();
    await expect(page.getByRole('button',{name:'Open navigation',exact:true})).toHaveAttribute('aria-expanded','false');
    await expect(page.locator('#main-navigation')).toBeHidden();
    await expect(page).toHaveURL(/#reviews$/);
    await menu.click();
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

async function checkAutomaticCarousel(browser: Awaited<ReturnType<typeof chromium.launch>>) {
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
  const page=await context.newPage();
  page.setDefaultTimeout(15000);
  const errors:string[]=[];
  page.on('pageerror',error => errors.push(error.message));
  page.on('console',message => { if (message.type() === 'error') errors.push(message.text()); });
  try {
    await page.goto(origin,{waitUntil:'networkidle',timeout:60000});
    const region=page.getByRole('region',{name:'Service options',exact:true});
    const logo=page.locator('.site-header .brand');
    await logo.hover();
    await expect.poll(() => logo.locator('.brand-vehicle').evaluate(element => getComputedStyle(element).transform)).not.toBe('none');
    await logo.focus();
    await page.mouse.move(0,0);
    assert.notEqual(await logo.locator('.brand-vehicle').evaluate(element => getComputedStyle(element).transform),'none','keyboard focus activates the same logo interaction');
    await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
    const track=page.locator('.service-carousel-track');
    const position=() => track.evaluate(element => element.scrollLeft);
    const blur=async () => page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    });
    const staysStill=async (label:string) => {
      await page.waitForTimeout(100);
      const start=await position();
      await page.waitForTimeout(450);
      assert.ok(Math.abs(await position()-start) <= 1,label);
    };
    const moves=async (label:string) => {
      const start=await position();
      await expect.poll(position,{message:label,timeout:5000}).toBeGreaterThan(start+8);
    };
    await track.scrollIntoViewIfNeeded();
    await page.mouse.move(0,0);
    await expect(page.getByRole('button',{name:'Pause movement',exact:true})).toBeVisible();
    await moves('normal motion automatically moves the visible carousel');

    await region.hover();
    await staysStill('hover pauses automatic service movement');
    await page.mouse.move(0,0);
    await moves('automatic movement resumes after pointer leaves');

    const firstService=track.locator('a').first();
    await firstService.evaluate(element => {
      if (element instanceof HTMLElement) element.focus({preventScroll:true});
    });
    await staysStill('keyboard focus pauses automatic service movement');
    await blur();
    await moves('automatic movement resumes when focus leaves the carousel');

    await page.getByRole('button',{name:'Pause movement',exact:true}).click();
    await page.mouse.move(0,0);
    await blur();
    await expect(page.getByRole('button',{name:'Resume movement',exact:true})).toBeVisible();
    await staysStill('manual pause persists after pointer and focus leave');
    await page.getByRole('button',{name:'Resume movement',exact:true}).click();
    await page.mouse.move(0,0);
    await blur();
    await moves('Resume movement explicitly restarts automatic service movement');

    await page.locator('footer').scrollIntoViewIfNeeded();
    await staysStill('automatic movement stops while the carousel is offscreen');
    await track.scrollIntoViewIfNeeded();
    await page.mouse.move(0,0);
    await moves('automatic movement restarts when the carousel returns onscreen');

    await region.hover();
    await track.evaluate(element => { element.scrollLeft=element.scrollWidth-element.clientWidth-1; });
    await page.waitForTimeout(100);
    await page.mouse.move(0,0);
    await expect.poll(position,{message:'automatic carousel loops back after the last service',timeout:5000}).toBeLessThan(100);
    assert.deepEqual(errors,[],'normal-motion carousel has no JavaScript or console errors');
    console.log('PASS normal motion: visible auto-scroll, hover/focus pause and resume, manual pause/resume, offscreen suspension and end-of-track loop.');
  } finally {
    await context.close();
  }
}

async function checkMobileMotion(browser: Awaited<ReturnType<typeof chromium.launch>>) {
  const context=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'no-preference'});
  const page=await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(origin,{waitUntil:'networkidle',timeout:60000});
    const ticker=page.locator('.service-ticker-track');
    const offset=() => ticker.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41);
    const blur=() => page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
    const still=async (label:string) => {
      await page.waitForTimeout(80);
      const start=await offset();
      await page.waitForTimeout(350);
      assert.ok(Math.abs(await offset()-start)<1,label);
    };
    await page.mouse.move(0,150);
    const start=await offset();
    await expect.poll(offset).toBeLessThan(start-5);
    await page.locator('.service-ticker').hover();
    await still('hover pauses the moving service-name strip');
    await page.getByRole('button',{name:'Pause service names',exact:true}).click();
    await page.mouse.move(0,150);
    await blur();
    await still('manual strip pause persists after focus and pointer leave');
    await page.getByRole('button',{name:'Resume service names',exact:true}).click();
    await page.mouse.move(0,150);
    await blur();
    const resumed=await offset();
    await expect.poll(offset).toBeLessThan(resumed-5);
    assert.equal(await page.locator('.availability-dot').evaluate(element => getComputedStyle(element).animationName),'availability-online-pulse','confirmed availability dot pulses in normal-motion mode');
    assert.equal(await page.locator('.availability-dot').evaluate(element => getComputedStyle(element).width),'11px','availability dot is larger and easy to see');

    const track=page.locator('.service-carousel-track');
    for (const width of [390,767]) {
      await page.setViewportSize({width,height:900});
      await expect(track).toHaveClass(/is-expanded/);
      await track.scrollIntoViewIfNeeded();
      const grid=await track.evaluate(element => ({left:element.scrollLeft,width:element.clientWidth,content:element.scrollWidth}));
      await page.waitForTimeout(650);
      assert.equal(await track.evaluate(element => element.scrollLeft),0,`${width}px cards stay stationary with normal motion enabled`);
      assert.ok(grid.content<=grid.width+1,`${width}px every service fits without horizontal scrolling`);
      await expect(page.getByRole('button',{name:'Pause movement',exact:true})).toHaveCount(0);
    }
    await page.setViewportSize({width:768,height:900});
    await expect(track).not.toHaveClass(/is-expanded/);
    await track.scrollIntoViewIfNeeded();
    await page.mouse.move(0,150);
    const desktopStart=await track.evaluate(element => element.scrollLeft);
    await expect.poll(() => track.evaluate(element => element.scrollLeft)).toBeGreaterThan(desktopStart+5);
    await page.setViewportSize({width:390,height:900});
    await expect(track).toHaveClass(/is-expanded/);
    assert.equal(await track.evaluate(element => element.scrollLeft),0,'returning to mobile clears the carousel scroll position');
    console.log('PASS mobile motion: static service grids at 390/767px, responsive switch at 768px, moving top strip with hover/manual pause, and pulsing availability.');
  } finally {
    await context.close();
  }
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
      assert.equal((serverHtml.match(/<article class="compact-service-card"/g) || []).length,homepageServices.length,'all nine homepage categories are server-rendered');
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toContainText('Winnipeg towing');
      await expect(page.locator('h1')).toContainText('Made easy.');
      await expect(page.locator('#how-it-works')).toHaveCount(0);
      assert.deepEqual(await page.locator('#main-navigation a').allTextContents(),['Services','Gallery','Reviews','Contact'],'header has only the four current section links');
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
    await checkAutomaticCarousel(browser);
    await checkMobileMotion(browser);
    console.log(`PASS browser QA; desktop/mobile screenshots saved to ${screenshotDirectory}. No call links were activated.`);
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode=1; });
