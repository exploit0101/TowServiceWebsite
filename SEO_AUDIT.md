# Technical SEO review — October 22, 2026

## New contact number and compact service design — October 29, 2026

The configured business number is now `+14314515110`, displayed as 431-451-5110. Native telephone links, WhatsApp destinations, homepage description and Organization schema share the updated configuration. Contact-page metadata also reads the configured number, removing its previous literal. Static export verification checks every Organization telephone against configuration as well as all native phone targets.

The hero no longer contains Explore services or its arrow; header navigation and all eleven server-rendered service-detail links remain. Shorter navy/ivory cards preserve semantic headings, concise scope captions, decorative SVG icons, keyboard access and both-theme contrast. One H1, unique metadata, absolute easytowing.ca canonicals, approved schema and nineteen indexable sitemap URLs are preserved. No new dependency, image payload, third-party script or search-ranking claim was added.

## Custom domain and service cards — October 29, 2026

The canonical origin is now `https://easytowing.ca` in source configuration and the GitHub repository variable. GitHub Pages supplies an empty base path for the custom domain; rebuilding removes the obsolete `/TowServiceWebsite/` prefix from CSS, JavaScript, images and internal links. HTTPS is enforced. Read-only checks confirm `www.easytowing.ca` and the former GitHub project URL permanently redirect to the apex domain. Canonicals, social URLs, Organization/Service/BreadcrumbList schema and the nineteen approved sitemap URLs use the new domain.

The opening hero fills the first screen, and the services section begins below it. Eleven linked service articles, their headings, concise scope captions and decorative SVG icons are server-rendered. The service grid has no carousel JavaScript, raster icon downloads or new dependencies. The header measures its height for responsive hero and anchor clearance; it does not control indexing or main content visibility. One H1, unique metadata, approved indexing rules and the existing contact form are preserved. Browser checks cover text contrast in both themes, native links and six responsive widths. These checks do not establish rankings or field Core Web Vitals.

## Reference-style assistance form — October 25, 2026

The form's labels are now visually hidden, with native label/control associations preserved for assistive technology and clear prompts inside each field. All controls and the native POST action remain server-rendered. A reused, 40KB optimized decorative image uses the deployment-aware asset helper; the export check validates its base path. No new dependency or third-party script is introduced. Existing page metadata, single H1, canonicals, structured data, service links and nineteen approved sitemap URLs are preserved.

## Single-column enquiry form — October 25, 2026

The form now shows one field per row, with shorter controls and no secondary form tagline. Its six explicit labels, native POST action, keyboard order and server-rendered HTML remain. The existing H1, page titles/descriptions, absolute canonicals, internal service links, Organization/Service/BreadcrumbList schema and nineteen approved sitemap URLs are preserved. This layout change adds no scripts, dependencies or keyword-heavy text.

## Changings reference refresh — October 25, 2026

The homepage now server-renders eleven concise service links/icons in a static grid. It retains one H1 and logical service headings. All existing unique service routes, canonical metadata, crawl rules and nineteen approved sitemap URLs are preserved. The hero's compact text is responsive, with complete provider/arrival facts visible on tested mobile opening screens. The owner-supplied support email is used consistently in native mail links, contact details and Organization schema. WhatsApp opens a draft via a native link. No new third-party widget, tracking script or client-only main copy is introduced. The unused homepage carousel JavaScript is no longer imported. Preview and production export/metadata checks pass; no SEO ranking or field Core Web Vitals result is claimed.

## Formspree and WhatsApp update — October 25, 2026

The assistance form is included in server-rendered homepage/request-help HTML, with labelled controls and a real POST action. Existing single-H1 structure, canonical URLs, unique metadata, approved structured data and nineteen sitemap URLs are preserved. The request utility page remains excluded from indexing. Contact links expose the form and footer WhatsApp route without embedding a third-party widget. Form entries are sent in the POST body, never page/query URLs or analytics. New form-specific CSS supports both themes and mobile layouts; no new image payloads, dependency or third-party script is added. Privacy metadata now describes Formspree and WhatsApp accurately. Historical preview findings below are retained as a record of earlier checks.

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

After production deployment, direct HTTPS checks passed for all nineteen approved URLs, sitemap/canonical agreement, real 404 behavior, phone-only support and Organization identity. Lighthouse 12.8.2 on the public GitHub Pages URL scored **SEO 100, accessibility 100, best practices 100 and performance 96** in its standard mobile simulation, with LCP 2.4s and CLS 0. This is a single laboratory run; field performance and Google indexing/rankings are not established. Responsive WebP variants, matching responsive preload and high hero priority are available on static hosting. The owner can submit `https://exploit0101.github.io/TowServiceWebsite/sitemap.xml` through Search Console and inspect actual Google indexing.

## Compact hero and appearance revision - October 24, 2026

The simplified hero remains server rendered and contains one service/location H1, concise supporting copy, native phone and service links, scoped partner credentials, the documented arrival estimate and the company-supplied rating. It adds no new local doorway routes or aggregate-rating schema. The replacement decorative emblem has empty alternative text and aria-hidden, responsive WebP sizes and fixed intrinsic dimensions; the six gallery photographs retain descriptive alternatives. Favicon metadata now points to the matching PNG.

The appearance initializer and accessible light/dark control change only presentation. Default HTML is light and all service content remains available without theme JavaScript. Local browser storage is solely the explicit appearance preference; no tracking/consent tags were added. Privacy reflects that behaviour. The nineteen approved sitemap URLs, matching deployment-prefix canonicals, Organization/Service/BreadcrumbList records and preview noindex boundaries still pass exported checks. New theme and existing SEO tests pass; browser checks cover readable text in both themes. Search Console submission/actual Google indexing and field Core Web Vitals remain external operational measurements.
