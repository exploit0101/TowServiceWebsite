# Technical SEO review — October 22, 2026

The site remains a non-indexable pre-launch preview. Technical preparation does not establish business eligibility, legal approval, rankings or real-world Core Web Vitals.

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

## easytowing redesign review — October 24, 2026

The owner supplied the trading brand **easytowing** and number **672-889-9764** (`+16728899764`). `phoneMode: "owner-provided"` enables consistent native dialer links without changing `isLive`, the business status or any approval flag. A supplied number is not evidence of a monitored dispatch operation. The site remains proposed and non-indexable.

The shorter homepage retains a service-specific H1, seven service cards with distinct detail links, descriptive photo alternatives, intrinsic image dimensions, responsive image delivery, a concise process/provider explanation, a safety note and essential policy/contact links. Carousel and gallery controls do not replace the underlying server-rendered service and image content. The six rebranded/generated photos are labelled as illustrative; they do not prove owned vehicles, staff, neighbourhood coverage or completed jobs. The detailed content and original service URLs remain available after the homepage is shortened.

Technical SEO is prepared for a verified launch: shared metadata, canonical-origin configuration, approved-route sitemap, crawl access for page-level directives, social metadata and optional Search Console verification are implemented. In the current preview, `noindex, nofollow` remains active, canonical/schema claims are omitted, the sitemap has no indexable URLs, analytics stays off, callback handling stays disabled, and unverified locality routes remain unavailable. The owner-provided phone does not bypass any of these controls.

Public indexing remains blocked until the legal entity and advertised role, service hours and monitored phone status, partner coverage/credentials, provincial requirements, pricing/consent disclosures, privacy/legal texts, support email and final HTTPS origin are configured and approved. No location is inferred from the phone's area code. The selected Winnipeg pilot remains a planning choice until coverage gates pass. Structured-data testing, Search Console inspection and deployment/mobile performance measurements still require the final approved public site.

This section records a source/configuration review of the redesign. Earlier test counts above are historical; consult [QA_REPORT.md](QA_REPORT.md) for the final combined checks on the current redesign. See [REFERENCE_REDESIGN.md](REFERENCE_REDESIGN.md) for the observed reference flow and the easytowing implementation decisions.

## Availability and expanded service update ? October 24, 2026

Owner confirmation of 24/7 call answering and partner dispatch is recorded with date/source in the shared launch configuration. The homepage now shows Available 24/7 and nine primary service categories in an initially expanded grid. Four new scoped routes cover heavy duty towing, motorcycle towing, winch out and flat tire guidance; existing URLs remain intact, including battery replacement and tire repair. There are twenty public preview pages. Each new route has unique metadata and useful, distinct scope text. Flat tire guidance and tire change are separate customer needs, not duplicate doorway pages.

The Reviews section currently invites customer feedback. No 4.9 score, review quotations or aggregateRating markup is published without actual sourced feedback. The review component and validated data shape support a real summary and up to four genuine testimonials later. Preview noindex, canonical/schema gates and approved-route sitemap rules remain unchanged.

## Deployment-path SEO readiness — October 24, 2026

Canonical, social, breadcrumb and sitemap URL helpers now accept an explicit deployment base path. For a future approved GitHub project deployment, the origin stays `https://exploit0101.github.io` and the separate base path is `/TowServiceWebsite`: the homepage resolves to `https://exploit0101.github.io/TowServiceWebsite/`, a service resolves under that prefix with the static export's trailing slash, and image/XML URLs keep their filenames. This avoids canonicals accidentally pointing to the account's root site. Origin configuration remains origin-only; adding a repository path to `CANONICAL_DOMAIN` is not supported. The shared SEO context reads `NEXT_PUBLIC_SITE_BASE_PATH`; optional `NEXT_PUBLIC_SITE_TRAILING_SLASH=true` also covers an exported site mounted at a domain root.

Three regression tests prove repository-prefix handling, matching canonical/social/sitemap shapes, unsafe-path rejection and unchanged preview exclusion. At this implementation point, all **41 unit/component tests**, lint and direct TypeScript checks passed. These fixture checks do not activate production or establish that the public deployment is indexable. Deployment wiring and exported-HTML checks must also use the shared context; see the final combined verification in `QA_REPORT.md`.

Google recommends absolute canonical URLs and consistent signals, including sitemap entries. Sitemaps should contain the preferred absolute URLs intended for Search. The helper follows those requirements without inventing modification dates. [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

Google must crawl HTML to see `noindex`, so preview pages remain crawlable while retaining `noindex, nofollow`, no canonical/schema claims and an empty sitemap. On a GitHub project URL, the exported `/TowServiceWebsite/robots.txt` is below the host root and is not the host-level robots file; page-level directives provide the preview exclusion. A verified future launch should submit the prefixed sitemap directly in Search Console or configure robots at the actual host root. [Google noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [robots file location rules](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt).

This is technical preparation. Legal/business identity, approved provider role, exact coverage, required registrations/credentials, rates/consent, privacy/legal texts and final deployment configuration remain launch gates where not yet verified. Owner-confirmed hours are tracked separately from those remaining approvals. No review score, address, LocalBusiness claim or ranking guarantee has been added.

## Production release - October 24, 2026

The owner supplied legal name EasyTowing and explicitly chose phone-only customer support. The configured real Canadian number is used for support; an email is omitted rather than invented. The owner confirmed citywide service for the listed categories, a 25-minute arrival estimate supported by dispatch records, and the operating/provider/partner/consent/privacy/legal approvals. Launch validation now passes on those recorded attestations.

The production export enables nineteen approved indexable URLs with unique metadata/H1, matching repository-prefixed HTTPS canonicals and social URLs, a nineteen-entry sitemap, and coherent Organization, Service and BreadcrumbList records. Service area is Winnipeg. The legacy pilot page and request utility remain noindex. The project robots.txt cannot control the github.io host root; HTML directives and explicit sitemap submission are the relevant deployment controls. The three supplied customer quotes and owner-supplied 4.9 rating are visibly attributed to EasyTowing; no Google affiliation, review counts, personal reviewer identity/date or aggregateRating markup is fabricated.

How it works and public project/draft labels were removed. Short customer-facing role, quotation, consent and image-nature information remains. Static hosting uses a phone-only request page and no callback API. Automated movement pauses on hover/focus, explicit controls, reduced motion and offscreen conditions; the browser suite verifies actual movement and pause behavior. See QA_REPORT.md for final build/browser/SEO audit results.
