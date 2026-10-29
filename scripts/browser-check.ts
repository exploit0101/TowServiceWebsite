import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, expect, type Page } from '@playwright/test';
import { services } from '../src/lib/content';

const origin = (process.env.TEST_ORIGIN || 'http://127.0.0.1:3000').replace(/\/+$/, '');
const screenshotDirectory = resolve('.qa');
const widths = [320,375,390,768,1024,1440];
const phoneHref = 'tel:+16728899764';
const homepageServices = services;

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
  assert.ok(ticker.height>=30,`${label}: the complete service strip remains visible`);
  assert.ok(header.y >= ticker.y+ticker.height-1,`${label}: the strip does not overlap the header`);
  const parts = ['.brand','.menu-toggle','#main-navigation','.header-contact','.theme-toggle'];
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
  const cards=page.locator('#services .service-list-item');
  await expect(cards).toHaveCount(services.length);
  await expect(page.locator('.floating-call')).toHaveCount(0);
  for (const service of services) await expect(cards.getByRole('link',{name:service.name,exact:true})).toHaveAttribute('href',new RegExp('/services/'+service.id+'/?$'));
  const grid=await page.locator('.service-list').evaluate(element=>({columns:getComputedStyle(element).gridTemplateColumns.split(' ').length,width:element.clientWidth,content:element.scrollWidth}));
  assert.equal(grid.columns,width<768?2:3);
  assert.ok(grid.content<=grid.width+1);
  for (const card of await cards.all()) {
    await expect(card.locator('.service-card-icon svg')).toHaveCount(1);
    assert.equal(await card.evaluate(element => getComputedStyle(element).animationName), 'none', 'service cards stay still');
    const text=await card.locator('.service-card-copy').evaluate(element=>({width:element.clientWidth,content:element.scrollWidth}));
    assert.ok(text.content<=text.width+1, 'service card text fits without clipping');
  }
  await expect(page.locator('.service-help-card a')).toHaveAttribute('href',phoneHref);
  await expect(page.locator('.hero-whatsapp')).toHaveAttribute('href',/^https:\/\/wa.me\/16728899764\?text=/);
  await expect(page.locator('.hero-email')).toHaveAttribute('href',/^mailto:info.easytowing.ca@gmail.com/);
  await expect(page.locator('#reviews')).toBeVisible();
  await expect(page.locator('#reviews .review-summary')).toContainText('4.9/5');
  await expect(page.locator('#reviews .review-card')).toHaveCount(3);
  await expect(page.locator('#reviews .review-source')).toContainText('supplied by EasyTowing');
  await expect(page.locator('#reviews .review-person > strong')).toHaveText(['Michael Thompson','Sarah Mitchell','Mathew']);
  await expect(page.locator('#reviews .review-date-label')).toHaveText(['1 week ago','2 weeks ago','4 weeks ago']);
  await expect(page.locator('.hero-summary')).toHaveCount(1);
  const facts=page.locator('.hero-highlights');
  for (const fact of ['Open 24 hours','Winnipeg','Licensed & insured','Service partners','25-minute arrival estimate']) {
    await expect(facts).toContainText(fact);
  }
  assert.equal(await facts.locator('svg').count(),4,'the four concise hero facts each have an icon');
  const actionsBox=await page.locator('.hero-actions').boundingBox();
  const factsBox=await facts.boundingBox();
  assert.ok(actionsBox && factsBox && factsBox.y >= actionsBox.y+actionsBox.height-1,'hero facts sit below the call and service actions');
  await expect(page.locator('.hero-rating')).toContainText('4.9/5');
  await expect(page.locator('.hero-rating')).toHaveAttribute('href','#reviews');
  await expect(page.locator('.hero-brand-watermark')).toHaveAttribute('aria-hidden','true');
  await expect(page.locator('.hero-brand-watermark .brand-symbol')).toBeVisible();
  await expect(page.locator('.review-quote-mark, #reviews svg.lucide-quote')).toHaveCount(0);
  const quoteDecoration=await page.locator('#reviews blockquote').evaluateAll(elements => elements.map(element => ({
    text:element.textContent?.trim() || '',
    before:getComputedStyle(element,'::before').content,
    after:getComputedStyle(element,'::after').content,
  })));
  for (const quote of quoteDecoration) {
    assert.ok(!/^["“”]|["“”]$/.test(quote.text),'review text has no added quotation marks');
    for (const content of [quote.before,quote.after]) assert.ok(['none','normal','""',"''"].includes(content),'review text has no quotation-mark pseudo-elements');
  }
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

async function checkMobileMotion(browser: Awaited<ReturnType<typeof chromium.launch>>) {
  const context=await browser.newContext({viewport:{width:390,height:664},reducedMotion:'no-preference'});
  try {
    const page=await context.newPage();
    await page.goto(origin,{waitUntil:'networkidle'});
    const track=page.locator('.service-ticker-track');
    await expect(page.locator('.service-ticker-pause')).toBeVisible();
    assert.notEqual(await track.evaluate(e=>getComputedStyle(e).animationName),'none');
    await page.locator('.service-ticker-pause').click();
    assert.equal(await track.evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
    assert.notEqual(await page.locator('.availability-dot').evaluate(e=>getComputedStyle(e).animationName),'none');
    await expect(page.locator('.service-list-item')).toHaveCount(services.length);
    const facts=await page.locator('.hero-highlights').boundingBox();
    assert.ok(facts && facts.y+facts.height<=664,'all four trust facts fit the mobile opening screen');
    for (const [width,height] of [[320,568],[390,664],[768,900],[1440,900]]) {
      // Each opening-screen check starts a fresh document. Reusing a scrolled
      // #services page can preserve an in-progress smooth scroll after resizing.
      await page.goto('about:blank');
      await page.setViewportSize({width,height});
      await page.goto(origin,{waitUntil:'networkidle'});
      await expect.poll(async () => (await page.locator('#services').boundingBox())?.y).toBeGreaterThanOrEqual(height-1);
      const hero=await page.locator('.hero').boundingBox();
      const facts=await page.locator('.hero-highlights').boundingBox();
      const explore=await page.locator('.hero-explore').boundingBox();
      assert.ok(hero && Math.abs(hero.y+hero.height-height)<2,'the hero fills the first screen at '+width+'x'+height);
      assert.ok(facts && facts.y+facts.height<height && explore && explore.y+explore.height<=height,'hero trust facts and explore link remain in the first screen at '+width+'x'+height);
      await page.locator('.hero-explore').click();
      await expect(page).toHaveURL(/#services$/);
      await expect.poll(async () => {
        const heading=await page.locator('#services h2').boundingBox();
        const chrome=await page.locator('.site-chrome').boundingBox();
        return !!(heading && chrome && heading.y>=chrome.height && heading.y+heading.height<=height);
      },{message:'Explore services scrolls the heading into view below the sticky header'}).toBe(true);
    }
    for (const [width,height] of [[320,568],[390,664],[1440,900]]) {
      await page.setViewportSize({width,height});
      await page.locator('.assistance-form-card').scrollIntoViewIfNeeded();
      const form=await page.locator('.assistance-form-card').boundingBox();
      const chrome=await page.locator('.site-chrome').boundingBox();
      assert.ok(form && chrome && form.height<=height-chrome.height,'the entire form fits below the header at '+width+'x'+height);
    }
    console.log('PASS first-screen hero, services below the fold, anchor navigation, complete form height, service ticker pause and 24/7 pulse.');
  } finally {await context.close();}
}

async function checkTextContrast(page: Page, label: string) {
  const measurements=await page.evaluate(() => {
    type Color=[number,number,number,number];
    const canvas=document.createElement('canvas');
    canvas.width=canvas.height=1;
    const context=canvas.getContext('2d',{willReadFrequently:true})!;
    // Method syntax preserves native names without a tsx/esbuild __name helper
    // leaking into the function Playwright serializes for the browser.
    const helpers={
    color(value:string): Color {
      context.clearRect(0,0,1,1);
      context.fillStyle=value;
      context.fillRect(0,0,1,1);
      const rgba=context.getImageData(0,0,1,1).data;
      return [rgba[0]/255,rgba[1]/255,rgba[2]/255,rgba[3]/255];
    },
    over(foreground:Color,background:Color): Color { return [
      foreground[0]*foreground[3]+background[0]*(1-foreground[3]),
      foreground[1]*foreground[3]+background[1]*(1-foreground[3]),
      foreground[2]*foreground[3]+background[2]*(1-foreground[3]),
      1,
    ]; },
    luminance(value:Color) { return value.slice(0,3).reduce((sum,channel,index) => sum+(channel<=.04045 ? channel/12.92 : ((channel+.055)/1.055)**2.4)*[.2126,.7152,.0722][index],0); },
    contrast(first:Color,second:Color) {
      const a=luminance(first),b=luminance(second);
      return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    },
    };
    const {color,over,luminance,contrast}=helpers;
    const selectors=['.hero h1','.hero h1 em','.hero-summary','.hero-note','.hero-highlights strong','.hero-highlights small','.hero-rating','.hero-explore','#services .eyebrow','.service-list-item h3','.service-card-copy p','.service-help-card h3','.service-help-card a','.review-card blockquote','.review-person > strong','.review-source','.assistance-intro h2','.assistance-intro h2 em','.assistance-intro p','.assistance-facts span','.assistance-call strong','.assistance-call small','.assistance-details','.assistance-form-caption','.assistance-form-heading h3','.assistance-form-heading p','.assistance-field label','.assistance-field label small','.assistance-send-notice','.assistance-send-notice a','.assistance-submit','.assistance-form-notice','.footer-whatsapp'];
    return selectors.flatMap(selector => Array.from(document.querySelectorAll<HTMLElement>(selector))).filter(element => element.getClientRects().length && element.textContent?.trim()).map(element => {
      const chain:Element[]=[];
      for (let ancestor:Element|null=element;ancestor;ancestor=ancestor.parentElement) chain.unshift(ancestor);
      let backgrounds:Color[]=[[1,1,1,1]];
      for (const ancestor of chain) {
        const style=getComputedStyle(ancestor);
        const solid=color(style.backgroundColor);
        backgrounds=backgrounds.map(background => over(solid,background));
        // The design uses colour gradients; check each stop as a conservative
        // contrast sample instead of treating a transparent gradient as white.
        const stops=(style.backgroundImage.match(/rgba?\([^)]+\)/g) || []).map(color);
        if (stops.length) backgrounds=backgrounds.flatMap(background => stops.map(stop => over(stop,background)));
      }
      const style=getComputedStyle(element);
      const foreground=color(style.color);
      const ratios=backgrounds.map(background => contrast(over(foreground,background),background));
      const fontSize=parseFloat(style.fontSize),weight=parseInt(style.fontWeight,10);
      return {text:element.textContent?.trim().slice(0,65),ratio:Math.min(...ratios),minimum:fontSize>=24 || fontSize>=18.66 && weight>=700 ? 3 : 4.5};
    });
  });
  assert.ok(measurements.length >= 20,`${label}: hero, service and review text are included in readability checks`);
  const failures=measurements.filter(measurement => measurement.ratio < measurement.minimum-.02).map(measurement => `${measurement.ratio.toFixed(2)} < ${measurement.minimum}: ${measurement.text}`);
  assert.deepEqual(failures,[],`${label}: insufficient text contrast against the design's background/gradient colours`);
}

async function checkThemeModes(browser: Awaited<ReturnType<typeof chromium.launch>>) {
  for (const width of [390,1440]) {
    const context=await browser.newContext({viewport:{width,height:900},colorScheme:'dark',reducedMotion:'reduce'});
    const page=await context.newPage();
    page.setDefaultTimeout(15000);
    const errors:string[]=[];
    page.on('pageerror',error => errors.push(error.message));
    page.on('console',message => { if (message.type() === 'error') errors.push(message.text()); });
    try {
      const contrastFailures:string[]=[];
      await page.goto(origin,{waitUntil:'networkidle',timeout:60000});
      await expect(page.locator('html')).toHaveAttribute('data-theme','light');
      await expect(page.getByRole('button',{name:'Switch to dark theme',exact:true})).toHaveAttribute('aria-pressed','false');
      assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme),'light','fresh visitors see light even when the OS prefers dark');
      try { await checkTextContrast(page,`${width}px light`); }
      catch (error) { contrastFailures.push(error instanceof Error ? error.message : String(error)); }

      await page.getByRole('button',{name:'Switch to dark theme',exact:true}).click();
      await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
      await expect(page.getByRole('button',{name:'Switch to light theme',exact:true})).toHaveAttribute('aria-pressed','true');
      assert.equal(await page.evaluate(() => localStorage.getItem('easytowing-theme')),'dark','dark mode is remembered after the explicit choice');
      await checkLayout(page,`${width}px dark home`);
      try { await checkTextContrast(page,`${width}px dark`); }
      catch (error) { contrastFailures.push(error instanceof Error ? error.message : String(error)); }
      await page.reload({waitUntil:'networkidle'});
      await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
      for (const image of await page.locator('.fleet-grid img').all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth>0)).toBe(true);
      }
      await page.evaluate(() => window.scrollTo(0,0));
      await page.screenshot({path:resolve(screenshotDirectory,`easytowing-${width}-dark-full.png`),fullPage:true});
      await page.locator('.hero').screenshot({path:resolve(screenshotDirectory,`easytowing-${width}-dark-hero.png`)});

      for (const path of ['/contact','/services/battery-boost']) {
        const response=await page.goto(`${origin}${path}/`,{waitUntil:'networkidle',timeout:60000});
        assert.equal(response?.status(),200,`${width}px dark ${path} loads`);
        await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
        await checkLayout(page,`${width}px dark ${path}`);
      }
      await page.getByRole('button',{name:'Switch to light theme',exact:true}).click();
      await expect(page.locator('html')).toHaveAttribute('data-theme','light');
      await page.reload({waitUntil:'networkidle'});
      await expect(page.locator('html')).toHaveAttribute('data-theme','light');
      assert.equal(await page.evaluate(() => localStorage.getItem('easytowing-theme')),'light','switching back to light also persists');
      assert.deepEqual(errors,[],`${width}px theme changes have no browser errors`);
      assert.deepEqual(contrastFailures,[],`${width}px both themes meet the checked text contrast thresholds`);
      console.log(`PASS ${width}px themes: light default despite dark OS, explicit toggle, saved choice across reload/routes, readable text and no layout overflow.`);
    } finally {
      await context.close();
    }
  }
}

async function main() {
  await mkdir(screenshotDirectory,{recursive:true});
  const browser=await chromium.launch({channel:process.env.TEST_BROWSER_CHANNEL || 'chrome',headless:true});
  try {
    if (process.argv.includes('--themes-only')) {
      await checkThemeModes(browser);
      return;
    }
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
      assert.equal((serverHtml.match(/<article class="service-list-item"/g) || []).length,homepageServices.length,'all eleven homepage categories are server-rendered');
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toContainText('Winnipeg towing');
      await expect(page.locator('h1')).toContainText('Made easy.');
      await expect(page.locator('#how-it-works')).toHaveCount(0);
      assert.deepEqual(await page.locator('#main-navigation a').allTextContents(),['Services','Gallery','Reviews','Contact'],'header has only the four current section links');
      await expect(page.locator('.site-header .brand')).toContainText('easytowing');
      for (const mark of await page.locator('.site-header .brand-symbol img, .hero-brand-watermark img').all()) {
        await expect.poll(() => mark.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth>0),{message:'new logo and hero emblem load'}).toBe(true);
      }
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
      console.log(`PASS ${width}px: layout, visible phone, service cards and icons, mobile navigation, gallery keyboard flow and loaded images`);
    }
    await checkThemeModes(browser);
    await checkMobileMotion(browser);
    console.log(`PASS browser QA; desktop/mobile screenshots saved to ${screenshotDirectory}. No call links were activated.`);
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode=1; });
