# Technical SEO review — October 22, 2026

The site remains an unpublished, non-indexable preview. Technical preparation does not establish business eligibility, legal approval, rankings or real-world Core Web Vitals.

## Changes

- Shared canonical configuration accepts `CANONICAL_DOMAIN` or the verified `canonicalDomain` in `config/launch.json`. A valid HTTPS origin is normalized without a trailing slash so metadata, schema IDs, sitemap URLs and callback-origin checks agree. Invalid domains remain invalid and cannot bypass the existing launch gates.
- Per-page metadata provides a title, description, Canadian English Open Graph locale, site name and Twitter card. Approved live mode adds absolute canonical/social URLs and the generated towing illustration for social sharing. The image is explicitly described as an illustration.
- Preview pages retain `noindex, nofollow`, omit canonical and social image URLs, and return an empty sitemap. Configuring a domain alone cannot enable indexing, calls or submissions.
- Live sitemap entries come only from approved routes, with duplicates removed. Modification timestamps are omitted because there is no authoritative per-page update history.
- Crawlers can reach HTML to read `noindex`, and can load JavaScript, CSS and images. The previous blanket `Disallow: /` prevented that. `/api/` remains disallowed. Preview does not advertise a sitemap. Robots directives are not authentication; use host-level access protection for staging that must remain private.
- No address, rating, reviews, certifications, unverified area or `LocalBusiness` data has been invented. Organization, Service and breadcrumb schema remain restricted to verified live mode.

## Verification

Following the owner's seven-service request, the catalogue now includes towing, jump start, lockout, tire change, fuel delivery, battery replacement and tire repair. All seven have unique, server-rendered scope pages with one H1, unique titles/descriptions and internal links. Original URLs are preserved. The latest combined verification is 23 passing unit/component/SEO tests and 16 passing public-page HTTP checks, including the seven service cards/icons and their detail links. The original SEO checks below describe the earlier three-service run.

The root implementation also adds a 262 KB WebP 3D towing hero through Next Image, responsive source sets, descriptive alt text, intrinsic dimensions, preload, and a site icon. Homepage and service-page H1s explicitly name their subject; live homepage title includes the selected verified pilot. Footer service links respect the approved live service list. Optional `GOOGLE_SITE_VERIFICATION` appears only in approved live mode.

`npm.cmd test` passed 19 tests, including eight new SEO tests. These cover environment-origin normalization and rejection, external/tracking canonical-path rejection, preview metadata and sitemap exclusion, approved live page metadata, consistent social URLs, sitemap route deduplication, crawl access and the actual preview metadata/robots/sitemap exports. `npm.cmd run typecheck` passed.

The smoke script additionally checks rendered HTML for unique titles/descriptions, one H1, noindex preview metadata, internal link integrity, blocked service-area routes and empty preview sitemap. Run it with the server available:

The combined run passed all 12 pages, all 12 linked destinations and five blocked routes, plus responsive hero markup, original and optimized WebP delivery and the site icon. No placeholder-grid markup remained in the homepage HTML.

```powershell
npm.cmd run test:smoke
```

## Before public indexing

Complete `PRELAUNCH_CHECKLIST.md` and the configured launch checks. Review actual identity, business role, partner coverage, availability, service text, rates and legal notices. Approve only genuine routes for indexing; do not add unverified locality pages. Configure the real HTTPS origin consistently at build and runtime. Root-layout Search Console verification is optional and does not itself submit or index pages.

Once the verified public domain and final content exist, validate Organization/Service/BreadcrumbList data with Google's testing tools and inspect canonical/indexing results in Search Console. Measure mobile performance and field LCP/INP/CLS on the real deployment; no p75 performance result is claimed by this review.

Reference for the crawl/noindex correction: [Google Search Central: block indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing). Framework APIs were checked against the installed Next.js documentation in `node_modules/next/dist/docs/`.
