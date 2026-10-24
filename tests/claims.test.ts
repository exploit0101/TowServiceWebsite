import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getAvailability, type AvailabilityConfig } from '../src/lib/availability';
import { AvailabilityBadge } from '../src/components/availability-badge';
import { CustomerReviews } from '../src/components/customer-reviews';
import { customerReviews, hasPublishableReviews, type ReviewSummary } from '../src/lib/reviews';

const confirmed: AvailabilityConfig = { callLine24hConfirmed:true, partnerDispatch24hConfirmed:true, confirmedAt:'2026-10-24', confirmationSource:'Owner confirmation fixture' };
test('24/7 badge distinguishes documented dispatch coverage from call answering and unknown hours', () => {
  assert.equal(getAvailability(confirmed).label,'Available 24/7');
  assert.equal(getAvailability({...confirmed,partnerDispatch24hConfirmed:false}).label,'Calls answered 24/7');
  for (const config of [undefined,{...confirmed,confirmationSource:''},{...confirmed,confirmedAt:''},{...confirmed,callLine24hConfirmed:false}])
    assert.equal(getAvailability(config).label,'Call to check availability');
  const html=renderToStaticMarkup(createElement(AvailabilityBadge,{config:confirmed}));
  assert.match(html,/Available 24\/7/);
  assert.ok(!html.includes('guarantee') && !html.includes('minutes'));
});

test('unverified feedback stays unpublished', () => {
  const unverified={...customerReviews,verified:false};
  assert.equal(hasPublishableReviews(unverified),false);
  const html=renderToStaticMarkup(createElement(CustomerReviews,{reviews:unverified}));
  assert.match(html,/id="reviews"/);
  assert.match(html,/Share your feedback/);
  assert.ok(!html.includes('4.9') && !html.includes('review-summary') && !html.includes('review-card'));
  assert.ok(!html.includes('aggregateRating') && !html.includes('application/ld+json'));
});

test('owner-supplied feedback preserves three actual quotes without fabricated authors, dates or counts', () => {
  assert.equal(hasPublishableReviews(customerReviews),true);
  const html=renderToStaticMarkup(createElement(CustomerReviews));
  assert.equal((html.match(/class="review-card"/g)||[]).length,3);
  for (const review of customerReviews.entries) assert.ok(html.includes(review.text));
  assert.match(html,/4\.9/); assert.match(html,/Rating and customer feedback supplied by EasyTowing/);
  assert.ok(!html.includes('<time') && !html.includes('From 3 customer reviews'));
  assert.ok(!html.includes('aggregateRating') && !html.includes('ratingValue'));
});

test('genuine review fixture renders only with explicit verification, source and valid feedback', () => {
  const fixture: ReviewSummary = { verified:true,sourceUrl:'https://reviews.fixture.test/easytowing',rating:4.9,totalReviews:10,entries:[{author:'Fixture customer',text:'Test-only customer feedback.',rating:5,date:'2026-10-24'}] };
  assert.equal(hasPublishableReviews(fixture),true);
  for (const config of [{...fixture,verified:false},{...fixture,sourceUrl:''},{...fixture,sourceUrl:'javascript:alert(1)'},{...fixture,rating:5.5},{...fixture,totalReviews:0},{...fixture,entries:[]},{...fixture,entries:[{...fixture.entries[0],text:''}]}])
    assert.equal(hasPublishableReviews(config),false);
  const html=renderToStaticMarkup(createElement(CustomerReviews,{reviews:fixture}));
  assert.match(html,/4\.9/); assert.match(html,/Fixture customer/);
  assert.match(html,/https:\/\/reviews\.fixture\.test\/easytowing/);
});
