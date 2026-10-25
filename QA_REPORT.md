# Verification report

## One field per row — October 25, 2026

Updated `src/components/contact-form.tsx` and `src/components/refinements.css`: all six fields are now in one column at every width, with aligned labels beside the controls. Controls are 40px high (previously 44px), use 16px input text and retain visible focus. The submit action remains at least 44px. The desktop form is centred within an 880px maximum width. Removed the extra form tagline and required-fields caption; the main brand headline remains concise and unchanged.

Updated `scripts/contact-browser-check.ts` to assert one column, a separate vertical position for every input, and consistent alignment in light/dark modes at 320/390/768/1440px. Lint, typecheck and 55 tests passed. Existing form response/error/native POST checks passed, as did the full browser suite covering six widths, theme contrast, gallery interaction, mobile opening and form height. Inspected mobile and desktop screenshots. No live enquiry or outbound message was sent.

No SEO copy, metadata, routes or schema were added or removed by this form layout change. Production/export checks validate the existing nineteen sitemap URLs and server-rendered, labelled form controls. Commands: `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd test`, `npm.cmd run test:contact`, `npm.cmd run test:browser`, and the README production build/export commands. Historical layouts below are superseded by this entry.

## Changings reference update — October 25, 2026

Implemented the three local screenshot references. Removed the fixed yellow call footer, styled the header phone badge with a yellow handset, replaced the homepage carousel with a joined navy/gold grid of all eleven services, and made review cards dark/white/dark. The hero has WhatsApp and email icon links. The owner-supplied email is info.easytowing.ca@gmail.com and is also used on the contact page and in Organization schema.

The compact form uses six fields in three desktop or two mobile columns. Its message box can be resized. The checkbox is removed; Send is accompanied by a visible request-to-contact/privacy notice, with the same notice included in the Formspree payload. No consent is fabricated as a checked checkbox. At 320×568, 390×664 and 1440×900, the full form fits beneath the sticky header. Mobile opening checks confirm the complete licence/insurance and arrival facts plus the first service row. Reference images stay in the local, ignored Changings folder.

Changed application files: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/[page]/page.tsx`, `src/components/header.tsx`, `src/components/assistance-section.tsx`, `src/components/contact-form.tsx`, `src/components/whatsapp-link.tsx`, `src/lib/contact.ts`, `config/launch.json`. Added `src/components/compact-service-grid.tsx` and `src/components/refinements.css`. Updated browser/contact/HTTP/export checks, contact unit tests, `.gitignore` and release documentation.

Passed local lint, typecheck, 55 tests, launch validation, 20-page HTTP checks, the production Pages build and 21-page/92-destination export verification. Browser checks passed at 320/375/390/768/1024/1440px, both themes, contrast, gallery keyboard interaction, mobile opening/form height, service strip pause and reduced motion. Form checks passed with mocked acknowledgement, 422/429/network/malformed responses, native verification and JavaScript disabled. Visually inspected the 390×664 opening, 320×568 form and dark/white/dark review stack. No actual form enquiry, phone call, email or WhatsApp message was sent. Live inbox/account delivery remains an external operational check.

Runnable commands: `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd test`, `npm.cmd run check:launch`, `npm.cmd run test:smoke`, `npm.cmd run test:browser`, `npm.cmd run test:contact`; production build/export commands are in README. Older findings below describe earlier designs.

## Unified assistance design — October 25, 2026

Updated `src/components/assistance-section.tsx`, `src/components/contact-form.tsx` and `src/components/contact-form.css` to combine urgent calling and written enquiries into one card. The gold phone banner precedes the form, with a shared header, refined typography, label icons, three/two/one-column responsive fields, and a compact consent/submit row. Both themes are coordinated. Field order remains logical for keyboard users. The Formspree destination, six fields, eleven service options, consent and delivery handling are preserved.

Updated `scripts/contact-browser-check.ts` to verify phone-first placement, the revised reading order and all three grid states; `scripts/browser-check.ts` also checks the new header, number and caption text contrast. Local lint, typecheck, 55 tests and contact checks passed, including 320×568 phones, form failure states, native verification and JavaScript-disabled POST. Theme checks passed at 390/1440px. Empty desktop/light and mobile/dark screenshots were visually inspected. Light input placeholders measure 4.67:1 against the field background; field borders measure 3.07:1. No live enquiry or phone/WhatsApp message was sent. Production build and deployment results are checked separately before release.

The production Pages build and static artifact checks also passed: 21 pages, 92 local destinations/assets, correct canonical metadata and the existing nineteen approved sitemap URLs. No routes, metadata, structured data or third-party integrations changed in this design refresh. Runnable checks are `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd test`, `npm.cmd run test:contact`, `npm.cmd run test:browser -- --themes-only`, and the production Pages build/export checks documented in README.

## Latest change — Formspree enquiries and WhatsApp, October 25, 2026

The release adds a reusable navy-and-gold assistance panel to the homepage contact section and `/request-help`, six labelled fields, all eleven approved services, optional email/message, contact consent, and Formspree POST delivery to the owner-supplied endpoint. Footer WhatsApp links use the business number and an editable draft. Privacy, terms and contact information now describe these channels.

New sources: `src/lib/contact.ts`, `src/components/contact-form.tsx`, `src/components/contact-form.css`, `src/components/assistance-section.tsx`, `src/components/whatsapp-link.tsx`, `tests/contact.test.ts`, `scripts/contact-browser-check.ts`. Updated sources: homepage, root layout, request-help, information pages, static export/browser checks, package scripts and Pages workflow. No dependencies added.

The new browser checks intercept **every Formspree submission**, using reserved example contact details. They cover empty and invalid input, consent, payload fields, success/reset/focus, 422 challenge, 429, network failure, malformed success, retained entries on errors, native challenge handoff, keyboard field order, JavaScript-disabled native POST, responsive layouts and both themes. WhatsApp URL, number, draft and external-link attributes are checked without opening a real chat. No customer enquiry, live inbox delivery, actual phone call or WhatsApp message is sent or claimed.

Historical reports below describe prior states, including the initial non-indexable preview. The current site is the owner-authorized GitHub Pages production release.

Local release checks passed: lint, TypeScript, **55 unit/component/SEO tests**, configured launch validator, production Pages build and **21-page / 92-destination** artifact checks. Existing browser checks passed at 320, 375, 390, 768, 1024 and 1440px; theme and text-contrast checks passed at 390/1440px, including the new form. Contact checks passed at 320/390/768/1440px and with JavaScript disabled. Screenshots of the empty request page and mobile footer were visually inspected. Read-only GET of the Formspree endpoint returned its expected POST-required response; inbox delivery/account configuration remains unverified.

A 320×568 phone check found that the floating call action could obscure the bottom of focused form feedback. Form controls and delivery feedback now have bottom scroll clearance. Browser checks assert that both success and error messages stay below the sticky header and above the call action, including the short phone viewport.

Implementation checked on October 22, 2026. This is a **local pre-launch preview**, not an operating roadside service. Selected pilot: Winnipeg — Bridgwater / Waverley West. No production deployment, actual customer request or call was made.

## Executed checks

| Command | Result |
| --- | --- |
| `npm.cmd run lint` | Passed, no ESLint findings. |
| `npm.cmd run typecheck` | Passed, no TypeScript errors. |
| `npm.cmd test` | Passed, 28 unit/component/SEO tests after the temporary-number dialer update. |
| `npm.cmd run build:preview` | Passed, optimized Next.js 16.4.2 build. |
| `npm.cmd run start` | Served the compiled preview successfully on 127.0.0.1:3000 for HTTP verification. |
| `npm.cmd run test:smoke` | Passed: 16 pages, 16 linked internal destinations, all seven service cards/icons, 5 blocked routes, robots, sitemap and callback guard. |
| `npm.cmd run check:launch` | Expected rejection: incomplete verified identity, contacts, rates, coverage, approvals and indexable routes. |
| `npm.cmd run build` | Expected rejection before compilation for the same outstanding launch gates. |

The Windows sandbox initially prevented npm registry access and the tsx runner’s Windows user lookup. Installation and tsx-based verification succeeded with approved execution outside the sandbox. PowerShell execution policy blocks `npm.ps1`; `npm.cmd` works. An initial smoke-script module-format issue was corrected before the successful final checks.

The initial temporary verification server was stopped after testing. A development server was subsequently started at the owner’s request and remains available at http://127.0.0.1:3000.

## Latest temporary-number dialer update

The owner requested native dialer behaviour, a readable number at the top, then explicitly asked for a temporary number. The preview now uses 204-555-0100 in demo mode. Header, primary and service-card actions share the native `tel:+12045550100` target; the header also provides a separate readable number link. The demo banner and button labels state that this is not a roadside service line. No actual telephone call was made during validation, and no actual device dialer handoff was observed because browser/native-device control is unavailable.

The phone helper rejects invalid NANP format and mismatches between displayed and dialled numbers. Production launch validation rejects demo/unconfigured mode and the reserved 555-0100–0199 range. Noindex, empty preview sitemap, disabled callbacks and business approval gates remain in place. All 28 tests pass, alongside lint, typecheck, the optimized preview build and HTTP checks for all 16 pages. Tests cover phone normalization, display matching, two native header links, demo disclosure and production rejection, alongside the existing service and SEO checks.

Files changed/added: `src/lib/phone.ts`, `src/lib/launch.ts`, `src/lib/site-config.ts`, `config/launch.json`, `src/components/header.tsx`, `src/components/header.css`, `src/components/service-grid.tsx`, `src/components/ui.tsx`, `src/app/layout.tsx`, `tests/phone.test.ts`, `tests/components.test.ts`, `tests/launch.test.ts`, `scripts/smoke.ts`, `README.md`, `PRELAUNCH_CHECKLIST.md` and this report. The HTTP smoke check now verifies that every preview telephone link has the same demo destination and that every page discloses its demo status.

## Earlier seven-service expansion

The owner explicitly requested towing, jump start, lockout, tire change, fuel delivery, battery replacement and tire repair. All seven now appear on the homepage, service hub, individual scope pages, footer and preview request form. Original canonical service paths remain intact. Each service has a distinct decorative SVG icon, problem label, description, separate details link and call action. The desktop 4-column service grid includes an eighth call-process panel; tablet and phone layouts use two and one columns respectively.

Calls remain disabled with a visible coming-soon label while the number is missing and the site is a preview. No immediate-arrival promise, fake booking, approval or live dispatch was introduced. Live offer filtering continues to control which services are displayed and accepted by the callback endpoint.

All 23 unit/component/SEO tests pass. Expanded smoke checks pass all 16 pages, all seven service cards/icons on homepage and hub, scoped detail copy/metadata, all 16 linked destinations and the existing preview/image safeguards. Lint, typecheck and optimized preview build pass. The dev server was restarted to refresh the new statically enumerated routes and remains on port 3000. Browser inventory remains empty: actual mobile/device visual checks are still unverified.

Files changed/added: `src/lib/service-catalog.ts`, `src/lib/content.ts`, `src/lib/launch.ts`, `src/lib/request-validation.ts`, `src/components/service-icon.tsx`, `src/components/service-grid.tsx`, `src/app/page.tsx`, `src/app/services/page.tsx`, `src/app/design.css`, `tests/services.test.ts`, `tests/request.test.ts`, `tests/launch.test.ts`, `scripts/smoke.ts`, `README.md`, `PRELAUNCH_CHECKLIST.md` and this report. No contact values, business approvals or indexable-route configuration were activated.

## Earlier top call button update

Added a prominent yellow “Call for roadside help” action outside the navigation menu. In preview it is a disabled button with visible “Phone number coming soon” text, not a fabricated telephone link. On approved live configuration it renders an E.164 telephone link and readable number. Regression checks cover both modes and invalid/missing contact configuration.

At phone/tablet widths the call action spans a separate full-width header row. The menu toggle is at least 44px, the call action at least 56px, the dropdown scrolls within short viewports, and the header remains visible in portrait scrolling. Landscape screens with limited height use a non-sticky header to preserve content space. Browser inventory was still empty for this update; actual mobile viewport interaction and visual checks remain unverified.

Changed for this update: `src/components/header.tsx`, new `src/components/header.css`, `src/app/layout.tsx`, `tests/components.test.ts`, `README.md`, `PRELAUNCH_CHECKLIST.md` and this report. Lint, typecheck, all 11 tests, the optimized preview build and all 12 HTTP page checks passed after the update. SEO and launch guards remain in place.

## Latest SEO and 3D image update

Replaced the grid/map SVG with an AI-generated 3D render of a yellow flatbed transporting a silver car. The source PNG is retained in `assets/source/`; the 1448 × 1086 WebP in `public/images/` is 261,918 bytes. Responsive Next Image markup includes descriptive alt text, intrinsic dimensions and preload. The visible caption identifies it as conceptual artwork. The source file and an optimized 640px image response both returned HTTP 200 with WebP content type; the old `scene-grid` no longer appears in rendered HTML. A site icon now resolves successfully.

The latest audit added environment-aware canonical normalization, Open Graph/Twitter cards, a live Search Console verification hook, service-descriptive headings and approved-service footer links. **The old blanket robots disallow was corrected**: crawlers can now read HTML noindex and load assets, while API crawling is disallowed. Preview still has no canonical origin, no invented Organization data, an empty sitemap and explicit noindex. Remote staging should be access-protected; robots rules are not privacy controls.

All 19 tests passed, including eight new SEO policy/route tests. Lint, typecheck and HTTP smoke checks passed across all 12 public pages, 12 linked destinations and five blocked routes. The smoke checks now also verify descriptive hero alt, responsive sources, dimensions, absence of the old grid, source-image size, optimized image serving and the site icon. See `SEO_AUDIT.md` and `assets/README.md` for audit and image-generation details. No mobile visual, public structured-data-tool, search ranking or Core Web Vitals result is claimed.

Files changed/added in this update: `.env.example`, `scripts/build.ts`, `scripts/check-launch.ts`, `scripts/smoke.ts`, `src/lib/configuration.ts`, `src/lib/seo-policy.ts`, `src/lib/seo.tsx`, `src/lib/site-config.ts`, `src/lib/content.ts`, `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/services/page.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/icon.svg`, `src/app/design.css`, `src/components/roadside-scene.tsx`, `tests/seo.test.ts`, `public/images/towing-3d-hero.webp`, `assets/source/towing-3d-hero.png`, `assets/README.md`, `SEO_AUDIT.md`, `README.md` and this report.

## Earlier SEO and content audit (superseded where noted above)

### Visual design refinement

The homepage was subsequently restyled with a dark navy hero, larger yellow-accented typography, quick service links, a refined original vector scene, larger service cards, differentiated towing card, roomier process steps and a clearer FAQ layout. Shared service/information pages use larger body text and consistent rounded panels. Mobile rules increase readable text and touch targets. The sticky top call action remains outside navigation and disabled while unconfigured; duplicate live-mode bottom call markup was removed to preserve a single sticky call action.

Files changed in this refinement: `src/app/page.tsx`, `src/app/layout.tsx`, new `src/app/design.css`, `src/components/roadside-scene.tsx`, and this report. Lint, typecheck, all 11 tests, the optimized preview build and HTTP checks for all 12 pages passed. No revenue, conversion uplift, visual screenshot, browser/device interaction or Core Web Vitals result is claimed. All pre-launch/SEO guards remain in place.

- All 12 public preview pages returned HTTP 200 with server-rendered content, a unique title, a unique meta description and exactly one H1.
- Every checked preview page explicitly outputs `noindex, nofollow`.
- All 12 discovered internal destinations resolve successfully. Service details have related-service links and visible breadcrumbs.
- The three candidate area URLs, an unsupported service and a nonexistent page returned HTTP 404. No area page is available before verified live mode.
- Preview `robots.txt` disallows crawling, and `sitemap.xml` contains no URL entries.
- No invented canonical origin, telephone link, Organization/LocalBusiness schema or loaded analytics tag is present in the checked preview HTML.
- Live-only schema and canonical output are implemented but not activated or submitted to Google’s validators: a real domain and verified identity are prerequisites.
- No testimonials, rating counts, prices, physical office, fleet ownership, certification claims, insurance affiliation, response-time promises or fabricated performance figures were introduced.
- The SVG roadside scene is original code and is explicitly identified as illustrative, not an actual fleet photograph.
- The selected pilot is recorded from the owner’s answer. Selection is clearly distinguished from verified coverage.

## Tests and actual limits

Unit/component tests verify launch rejection, required approval gates, unsupported market/service/route rejection, HTTPS canonical-origin rules, Ontario highway handling, callback validation and normalization, spam/consent checks, conditional phone links and labelled form/consent/navigation markup.

The callback API returns 503 in preview **before processing request content**. Live delivery, external Redis, call-centre workflows and webhook durability have not been tested because no approved providers or credentials exist. Those integrations remain disabled.

Browser inventory was empty and an in-app-browser attempt returned “Browser is not available: iab.” Consequently no rendered screenshot, real mobile viewport, interactive form submission, menu/FAQ interaction, keyboard flow, screen-reader, zoom, Lighthouse or field Core Web Vitals result is claimed. Responsive CSS, focus treatment, native details elements, reduced-motion support and accessibility markup are implemented; manual browser verification remains required.

## Exact added files

The original instructions in `AGENTS.md` and the supplied `Market_Selection_22_10_2026.md` were preserved. On subsequent development-server startup, Next.js automatically appended its generated framework-instruction block to `AGENTS.md`. No Git repository existed, so no commit or Git diff was created.

```text
.env.example
.gitignore
README.md
PRELAUNCH_CHECKLIST.md
QA_REPORT.md
package.json
package-lock.json
next.config.ts
next-env.d.ts
tsconfig.json
eslint.config.mjs
config/launch.json
scripts/build.ts
scripts/check-launch.ts
scripts/smoke.ts
src/app/layout.tsx
src/app/page.tsx
src/app/globals.css
src/app/design.css
src/app/not-found.tsx
src/app/robots.ts
src/app/sitemap.ts
src/app/[page]/page.tsx
src/app/services/page.tsx
src/app/services/[service]/page.tsx
src/app/request-help/page.tsx
src/app/areas/[area]/page.tsx
src/app/api/callback/route.ts
src/components/consent.tsx
src/components/header.tsx
src/components/header.css
src/components/icons.tsx
src/components/request-form.tsx
src/components/roadside-scene.tsx
src/components/ui.tsx
src/lib/content.ts
src/lib/launch.ts
src/lib/request-validation.ts
src/lib/seo.tsx
src/lib/site-config.ts
tests/components.test.ts
tests/launch.test.ts
tests/request.test.ts
```

Generated dependencies, Next build output and TypeScript incremental cache are ignored. Package versions are pinned and the lockfile is included. See `PRELAUNCH_CHECKLIST.md` for the precise business/legal inputs and manual verification needed before production.

## easytowing redesign verification ? October 24, 2026

Replaced the long homepage with an original photo-led, call-first design informed by the reference flow. Configured easytowing and owner-provided 672-889-9764; the same E.164 target is used by all call actions. Added a seven-service carousel/all-services grid and six-image keyboard-accessible gallery. Four supplied photos were rebranded with built-in ImageGen and two vehicle concepts generated; originals remain local. See assets/README.md for exact prompts and provenance.

Current checks:

- `npm.cmd run lint`: pass.
- `npm.cmd run typecheck`: pass (Next route type generation and TypeScript).
- `npm.cmd test`: 34/34 pass, including four Windows static-segment regression cases.
- `npm.cmd run test:smoke`: 16 pages pass; service icons, unique metadata/H1, internal links, 404 guards, phone links, image delivery, robots/sitemap and disabled callback API pass.
- `npm.cmd run build:pages` with `/TowServiceWebsite`: pass. Produces a static artifact; Windows export normalization adds 16 byte-identical RSC aliases. Linux flat exports remain unchanged.
- `npm.cmd run test:pages`: 16 exported pages and 41 local destinations/assets pass; all six WebP files are below 300 KB, all links use the owner number, noindex remains active and unverified locality/API routes are excluded.
- `npm.cmd run test:browser`: pass in headless installed Chrome at 320, 375, 390, 768, 1024 and 1440px, against both the development site and the static Pages artifact. Checks no page overflow/header overlap, readable telephone links, seven SSR icon cards, carousel navigation and expanded view, mobile menu, six loaded images, native dialog ArrowRight/Escape controls and focus return. Mobile contact and battery-boost pages also pass. No JavaScript/console errors. No call links were activated.
- Desktop and mobile screenshots were visually inspected. Fresh-page captures include loaded gallery images; screenshots are in ignored `.qa/`.
- `npm.cmd run check:launch`: intentionally blocked by outstanding operational facts and approvals. No verified operating status or public indexing is asserted.

The GitHub workflow now runs the browser/mobile checks against its exported artifact before deployment. The earlier Windows-only Next.js RSC prefetch path mismatch was reproduced and corrected in packaging, with original payloads preserved and collisions rejected; no framework package was patched.

The main content is server-rendered, concise and service-specific. The preview has noindex, no canonical/Organization/LocalBusiness claims, no live locality page and no analytics. Verified live mode still supports approved canonicals, schema and sitemap. Outstanding inputs: legal identity/role, actual monitored hours/phone handling, approved partner coverage/services/credentials, provincial requirements, rates/consent, final domain/email and privacy/legal approval. Real-device calling, screen readers, zoom and field Core Web Vitals remain unmeasured; browser emulation is not a carrier/call-centre test.

Changed files for this redesign (including removal of obsolete layered CSS):

```
.github/workflows/pages.yml
.gitignore
GITHUB_DEPLOYMENT.md
PRELAUNCH_CHECKLIST.md
QA_REPORT.md
README.md
REFERENCE_REDESIGN.md
SEO_AUDIT.md
assets/README.md
config/launch.json
package-lock.json
package.json
public/images/easytowing-flatbed-night.webp
public/images/easytowing-flatbed.webp
public/images/easytowing-highway.webp
public/images/easytowing-loading.webp
public/images/easytowing-recovery.webp
public/images/easytowing-wheel-lift.webp
scripts/browser-check.ts
scripts/build-pages.ts
scripts/normalize-static-segments.ts
scripts/smoke.ts
scripts/test-pages.ts
src/app/[page]/page.tsx
src/app/design.css
src/app/globals.css
src/app/icon.svg
src/app/layout.tsx
src/app/page.tsx
src/app/services/page.tsx
src/components/fleet-gallery.tsx
src/components/header.css
src/components/header.tsx
src/components/service-carousel.tsx
src/components/service-grid.tsx
src/components/ui.tsx
src/lib/launch.ts
src/lib/seo-policy.ts
src/lib/site-config.ts
tests/components.test.ts
tests/launch.test.ts
tests/phone.test.ts
tests/seo.test.ts
tests/static-segments.test.ts
```

## Nine services, availability and customer feedback update - October 24, 2026

Added a compact, owner-confirmed Available 24/7 badge above the headline. The dated source record confirms both call answering and partner dispatch; individual eligibility, job acceptance and arrival estimates remain subject to confirmation. No other operating/legal approval flag was enabled.

All nine requested categories are visible in the default grid with distinct icons and real telephone links: Car towing; Heavy duty towing; Motorcycle towing; Boosting & jump start; Winch out; Flat tire; Tire change; Lockout; Fuel delivery. Optional carousel controls remain available. Battery replacement and tire repair stay accessible as secondary services, preserving eleven service routes. Flat tire guidance has distinct content from spare-wheel installation.

Added a compact Reviews section and navigation link. It currently invites genuine customer feedback. No unverified 4.9 score or invented review text is public. A typed, validated data source supports a real sourced summary and up to four review cards when available. Tests verify that missing/unverified feedback produces no score, quotation cards or aggregateRating markup.

Verification:

- Lint and Next route generation/TypeScript: pass.
- Unit/component/SEO/regression tests: 38/38 pass.
- HTTP smoke: all twenty preview pages pass, including nine homepage cards, eleven service hub cards, distinct icons, metadata, internal links, phone targets, image delivery and noindex/API/locality guards.
- Headless Chrome: pass at 320, 375, 390, 768, 1024 and 1440px; expanded grid visibility, carousel transitions, five-link responsive navigation, Reviews/Contact anchors, telephone targets, image gallery keyboard/focus flow, zero overflow/overlap and zero browser errors. Mobile contact/battery pages pass. Desktop/mobile screenshots were visually inspected.
- Pages build: pass; twenty Windows RSC aliases normalized. Static verification: twenty pages and forty-six local destinations/assets pass.
- Native carrier calls, real devices, screen readers and field performance were not measured. No call links were activated during checks.

Indexing, callbacks and unverified locality routes remain gated. Production still needs the legal identity/role, exact service zone and per-service partners/equipment, credentials/compliance, rates/consent, final domain/email and privacy/legal approval. The 24/7 owner statement does not supply those missing facts.

Changed files:

```
PRELAUNCH_CHECKLIST.md
QA_REPORT.md
README.md
SEO_AUDIT.md
config/launch.json
scripts/browser-check.ts
scripts/smoke.ts
scripts/test-pages.ts
src/app/[page]/page.tsx
src/app/globals.css
src/app/layout.tsx
src/app/page.tsx
src/components/availability-badge.tsx
src/components/customer-reviews.tsx
src/components/header.tsx
src/components/service-carousel.tsx
src/components/service-icon.tsx
src/lib/availability.ts
src/lib/content.ts
src/lib/launch.ts
src/lib/reviews.ts
src/lib/service-catalog.ts
tests/claims.test.ts
tests/launch.test.ts
tests/request.test.ts
tests/services.test.ts
```

## Production release - October 24, 2026

The owner supplied legal name EasyTowing, explicitly selected phone-only support at 672-889-9764, confirmed all advertised services throughout Winnipeg, and confirmed that the 25-minute arrival estimate is supported by actual dispatch records. The owner also confirmed provider/partner, provincial, rates/consent, privacy and legal-text approvals and requested production publication. These are recorded owner attestations, not an independent legal determination.

Removed How it works and customer-facing project/draft labels. The shorter homepage retains service scope, independent-provider identity, quote/consent information and essential safety guidance. The nine primary service cards now move horizontally, with hover/focus/touch and explicit pause controls, swipe/arrows, an expanded view and reduced-motion support. The supplied three customer quotes and company-supplied 4.9 rating are visible with source attribution; no reviewer names, dates, platform, total count or review-rating schema are invented.

Production Pages now has a guarded opt-in that validates configured business facts before export. Repository variables select production and the final HTTPS origin. Nineteen approved pages become indexable with unique titles/descriptions, one H1, repository-prefixed canonicals/social URLs, coherent Organization/Service/BreadcrumbList data and an approved sitemap. The legacy pilot page and phone-request utility remain noindex. No LocalBusiness, street address, coordinates, fleet ownership or certificate claim is invented. There is no static callback endpoint or unsupported public form.

Static Next Image delivery now uses forty-two pre-sized WebP variants, responsive source sets and high-priority hero loading. Image resizing/encoding does not change the creative content. Accessible call labels include the visible button wording, and the brand uses its visible text as its accessible name.

Verification on the production artifact:

- Launch configuration validator, lint and Next route generation/TypeScript: pass.
- Unit/component/SEO/regression suite: **48/48 pass**.
- Guarded production static build: pass, including twenty-one Windows RSC aliases.
- Exported HTML/link/image/canonical/sitemap verification: **21 pages and 81 local destinations/assets pass**, including responsive image candidates.
- Headless Chrome: pass at **320, 375, 390, 768, 1024 and 1440px**. Navigation, visible phone targets, service expansion, gallery keyboard/focus flows, image loading and overflow checks pass, with zero browser errors. Separate normal-motion checks verify movement, hover/focus pause, manual pause/resume, offscreen suspension and looping. No call links were activated.
- Structured-data checks: eleven Service records use the canonical repository prefix, Organization provider ID and Winnipeg service area. Nineteen sitemap URLs match approved canonicals. Organization has the real legal name and phone, and omits email for phone-only support.
- Local Lighthouse 12.8.2 mobile simulation after responsive image delivery: SEO **100**, accessibility **100**, best practices **100**, performance **78**; LCP **6.0s**, TBT **20ms**, CLS **0**. The temporary Python server does not supply production compression or caching; this is a local laboratory result and does not establish deployed/field performance. Image over-delivery fell from an estimated 1,031 KiB to 211 KiB. A visible-name issue outside the scored accessibility checks was subsequently corrected in the brand link. Field LCP/INP/CLS and real devices remain unmeasured.

Runnable checks are documented in README.md and PRELAUNCH_CHECKLIST.md. Google Search Console sitemap submission/index inspection and actual carrier/call-centre handling remain owner-side operational checks; successful deployment does not guarantee indexing or rankings.

Public verification after deployment of `8d3a3b0`: [GitHub Actions run 40113021374](https://github.com/exploit0101/TowServiceWebsite/actions/runs/40113021374) passed lint, typecheck, all 48 tests, production artifact checks and every browser check before deployment. HTTPS checks on [the live site](https://exploit0101.github.io/TowServiceWebsite/) confirm all nineteen approved pages return 200 with one H1 and indexable HTML directives, matching sitemap/canonical URLs, all nine primary service cards, three supplied reviews, 25-minute estimate, correct phone-only support and truthful Organization data. The phone utility remains noindex without a form; an unknown route returns 404. GitHub serves gzip and a 600-second cache policy.

Lighthouse 12.8.2 against the **public deployment**, using its standard mobile simulation: **performance 96, accessibility 100, best practices 100, SEO 100**. FCP 1.8s, LCP 2.4s, TBT 60ms, CLS 0, Speed Index 3.1s. The visible-label/accessibility-name audit now passes. These are a single laboratory run, not real-user p75 Core Web Vitals or a ranking guarantee. Raw local reports are in ignored `.qa/lighthouse-live.json` and `.qa/lighthouse-responsive.json`; production compression and caching explain why the deployed result differs from the temporary Python server.

Files changed for this release (including generated responsive image assets):

```text
.github/workflows/pages.yml
assets/README.md
config/launch.json
GITHUB_DEPLOYMENT.md
next.config.ts
PRELAUNCH_CHECKLIST.md
public/images/easytowing-flatbed-1200w.webp
public/images/easytowing-flatbed-1440w.webp
public/images/easytowing-flatbed-320w.webp
public/images/easytowing-flatbed-480w.webp
public/images/easytowing-flatbed-640w.webp
public/images/easytowing-flatbed-768w.webp
public/images/easytowing-flatbed-960w.webp
public/images/easytowing-flatbed-night-1200w.webp
public/images/easytowing-flatbed-night-1440w.webp
public/images/easytowing-flatbed-night-320w.webp
public/images/easytowing-flatbed-night-480w.webp
public/images/easytowing-flatbed-night-640w.webp
public/images/easytowing-flatbed-night-768w.webp
public/images/easytowing-flatbed-night-960w.webp
public/images/easytowing-highway-1200w.webp
public/images/easytowing-highway-1440w.webp
public/images/easytowing-highway-320w.webp
public/images/easytowing-highway-480w.webp
public/images/easytowing-highway-640w.webp
public/images/easytowing-highway-768w.webp
public/images/easytowing-highway-960w.webp
public/images/easytowing-loading-1200w.webp
public/images/easytowing-loading-1440w.webp
public/images/easytowing-loading-320w.webp
public/images/easytowing-loading-480w.webp
public/images/easytowing-loading-640w.webp
public/images/easytowing-loading-768w.webp
public/images/easytowing-loading-960w.webp
public/images/easytowing-recovery-1200w.webp
public/images/easytowing-recovery-1440w.webp
public/images/easytowing-recovery-320w.webp
public/images/easytowing-recovery-480w.webp
public/images/easytowing-recovery-640w.webp
public/images/easytowing-recovery-768w.webp
public/images/easytowing-recovery-960w.webp
public/images/easytowing-wheel-lift-1200w.webp
public/images/easytowing-wheel-lift-1440w.webp
public/images/easytowing-wheel-lift-320w.webp
public/images/easytowing-wheel-lift-480w.webp
public/images/easytowing-wheel-lift-640w.webp
public/images/easytowing-wheel-lift-768w.webp
public/images/easytowing-wheel-lift-960w.webp
QA_REPORT.md
README.md
scripts/browser-check.ts
scripts/build-pages.ts
scripts/smoke.ts
scripts/test-pages.ts
SEO_AUDIT.md
src/app/[page]/page.tsx
src/app/areas/[area]/page.tsx
src/app/globals.css
src/app/layout.tsx
src/app/page.tsx
src/app/request-help/page.tsx
src/app/robots.ts
src/app/services/[service]/page.tsx
src/app/sitemap.ts
src/components/arrival-estimate.tsx
src/components/customer-reviews.tsx
src/components/fleet-gallery.tsx
src/components/header.tsx
src/components/service-carousel.css
src/components/service-carousel.tsx
src/components/service-grid.tsx
src/components/ui.tsx
src/lib/launch.ts
src/lib/reviews.ts
src/lib/seo.tsx
src/lib/seo-policy.ts
src/lib/site-config.ts
src/lib/static-image-loader.ts
tests/arrival.test.ts
tests/carousel.test.ts
tests/claims.test.ts
tests/components.test.ts
tests/launch.test.ts
tests/seo.test.ts
```

## Mobile service layout and availability motion - October 24, 2026

Phones up to 767px now show all nine primary service cards in a static two-column grid, with coloured icons, concise titles and individual call links. No carousel controls or automatic card movement appear at these sizes, including before hydration. Desktop carousel behaviour is retained. Resizing between 767px and 768px switches layout and cancels/restarts automatic card movement appropriately.

A slim navy strip above the header scrolls all eleven actual service names. It supports hover/focus pause and an explicit pause/resume button. The loop's second visual copy is hidden from assistive technology and contains no focus targets. With reduced motion, the names remain a static, manually scrollable list. The confirmed green availability dot has a gentle 2.4-second pulse; reduced motion disables it. This highlights configured opening hours rather than claiming a live presence-monitoring integration.

Verification: lint, Next route generation/TypeScript, **49 unit/component/SEO tests**, guarded production export and **21-page/81-destination static checks** pass. Headless Chrome passes all six existing widths (320, 375, 390, 768, 1024, 1440px), gallery/navigation/phone checks and desktop movement regressions. New normal-motion checks verify static mobile cards at 390/767px, the 768px switch and return to mobile, scrolling service names, hover/manual pause/resume and availability animation. Reduced-motion checks verify both new animations stop. Mobile header and service screenshots were visually inspected. No native calls were placed.

SEO metadata, canonicals, approved sitemap and business claims are unchanged; exported-HTML checks still pass. Previous Lighthouse scores above describe the preceding deployment and were not remeasured for this bounded UI update. No additional business/legal input is required for these presentation changes.

Run `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd test`, `npm.cmd run test:browser` against the running portal, and the existing production `build:pages`/`test:pages` commands from README.md. Publication uses the existing GitHub Pages workflow.

Changed files:

```text
README.md
QA_REPORT.md
scripts/browser-check.ts
src/app/globals.css
src/app/layout.tsx
src/components/service-carousel.css
src/components/service-carousel.tsx
src/components/service-ticker.css
src/components/service-ticker.tsx
tests/ticker.test.ts
```

## Sticky services, brand identity and supplied reviewer profiles - October 24, 2026

The moving service strip and header now share a sticky container. The complete strip remains at the viewport top while scrolling and sits above the header; section anchors account for the combined height. Phone service cards retain their static two-column layout.

Added an original native SVG tow-truck mark with a navy/gold wordmark, hover and keyboard-focus effects, matching favicon and a faint hero watermark. The background treatment follows the large translucent-logo idea observed on the owner-requested Panda reference; no competitor artwork or branding was copied. The original logo lives in src/components/brand-logo.tsx and src/app/icon.svg. Reduced motion suppresses animated logo transitions. The confirmed availability dot increased from 6px to 11px.

The hero tagline now says Quick roadside help. 25-minute arrival estimate. It uses the same documented-estimate validation as the existing arrival note, including distinguishing a target from a measured estimate and omitting unsupported numeric claims.

Review cards now use the exact supplied Michael Thompson, Sarah Mitchell and Mathew quotes, reviewer names, review/photo profile counts and relative timing labels. Initial avatars, date pills and a navy feature card provide the requested visual treatment. Counts are reviewer profile metadata, not the business's total reviews. No personal photos, review-platform links/affiliation, individual star ratings or precise review timestamps were inferred. The company-supplied source remains visible and profile details are identified as of October 24, 2026 so static relative labels do not imply live freshness.

Validation: lint, Next route generation/TypeScript, all 49 unit/component/SEO tests, guarded production export and 21-page/81-destination exported checks pass. Headless Chrome checks pass at 320, 375, 390, 768, 1024 and 1440px. They verify the service strip stays at the top without overlapping the header through homepage, gallery, services, contact and mobile subpage flows, plus exact supplied review metadata, hero watermark, tagline, enlarged dot, interactive logo, static mobile services and existing desktop/pause/reduced-motion behaviour. Desktop/mobile hero and review screenshots were visually inspected. No telephone links were activated.

SEO titles, descriptions, H1, canonical URLs, structured-data identity, review-rating schema exclusion and the nineteen approved sitemap URLs remain intact. Earlier Lighthouse measurements apply to their recorded deployments and were not repeated for this presentation update. No new business/legal inputs are required. Run the existing lint, typecheck, test, test:browser, build:pages and test:pages commands in README.md.

Changed files:

```text
README.md
QA_REPORT.md
assets/README.md
scripts/browser-check.ts
src/app/icon.svg
src/app/layout.tsx
src/app/page.tsx
src/components/arrival-estimate.tsx
src/components/brand-logo.tsx
src/components/brand.css
src/components/customer-reviews.tsx
src/components/customer-reviews.css
src/components/header.tsx
src/lib/reviews.ts
tests/arrival.test.ts
tests/claims.test.ts
```

## Compact hero, new emblem and light/dark appearance - October 24, 2026

The requested fresh review of https://www.pandatowing.ca/ included desktop/mobile screenshots, raw HTML, headings and a full interaction inventory. The reference's useful visual strengths are its short first-screen hierarchy, prominent call/rating pair, small icon-fact row, soft colour wash and large decorative logo. It has approximately 415 visible words and the flow hero → six services → four fleet photographs → three reviews → contact/emergency call → footer. Interactions are anchor navigation, phone links, a floating phone CTA and carousel/grid controls. It does not add a form, map, FAQ, gallery dialog or theme switch that EasyTowing is missing.

The revision adopts that compact hierarchy with original branding and content. EasyTowing's first screen now has one short paragraph, call/service actions, the company-supplied 4.9 rating, and four facts below the actions: Open24hours, Winnipeg, Licensed &insured / Servicepartners, and 25-minute arrival estimate. The credential fact is scoped to independent partners; the business configuration does not identify EasyTowing itself as a certified operator. One short provider/timing note remains. Repeated ETA text, the price-promise row, separate trust strip and foreground photo were removed. The photos remain in the accessible gallery.

The reference's raw HTML is a small client-rendered shell with a generic React description, no canonical or JSON-LD. Those weaknesses, generic hashtag copy, business identity, own-fleet implications, rating provenance and credential/response claims were not transferred. EasyTowing retains server-rendered service content, one H1, unique metadata, absolute deployment-aware canonicals, accurate schema, approved sitemap and real 404 behaviour.

A newly generated original flatbed/car emblem combines a sweeping road and hook in navy, amber and silver. No Panda logo/artwork was used as input. It replaces the previous native icon in header/background/favicon; native text supplies the wordmark. Artwork provenance, prompt and optimized sizes are in assets/README.md. Header hover/focus and reduced-motion support remain.

The new theme switch defaults to light even if the device prefers dark. Only an explicit remembered dark choice changes that. The small pre-paint initializer avoids a flash of the wrong saved theme; client controls update appearance without changing service content or SEO metadata. Stored choice survives reloads/routes, storage access failures remain usable, and no cookie/third-party analytics integration was introduced. Privacy explains the functional browser preference. All review quotation glyphs and added quote punctuation have been removed while customer words remain intact.

Verification: launch validator, lint, TypeScript, **52 unit/component/SEO tests** and **20 preview HTTP pages** pass. Guarded production export and **21 pages/90 local destinations and assets** pass. Browser checks pass at320/375/390/768/1024/1440px and independently verify light/dark390/1440px, default despite darkOS, persisted selection across reload/routes, accessible button state, actual text contrast, header overflow, visible/decoded logo artwork, quote removal, static mobile services, sticky strip, normal/reduced motion, gallery keyboard flow and phone targets. Zero browser errors and no telephone links activated. Light/dark hero, full-page, contact and service screenshots were visually inspected. These are browser/lab checks; carrier calls and field Core Web Vitals are not measured by them.

The approved sitemap still has nineteen URLs. The default preview remains noindex and production indexing still requires the existing validated release configuration. No new business/legal input is required for these scoped presentation changes. Existing approval evidence remains owner supplied. Previous Lighthouse measurements are historical; no result for this revision is assumed. Run README.md commands, including test:browser (or -- --themes-only for the focused theme checks), build:pages and test:pages.

Changed files and generated brand assets for this release:
```text
assets/README.md
public/images/easytowing-emblem.webp
public/images/easytowing-emblem-112w.webp
public/images/easytowing-emblem-1200w.webp
public/images/easytowing-emblem-1440w.webp
public/images/easytowing-emblem-224w.webp
public/images/easytowing-emblem-320w.webp
public/images/easytowing-emblem-480w.webp
public/images/easytowing-emblem-640w.webp
public/images/easytowing-emblem-768w.webp
public/images/easytowing-emblem-960w.webp
QA_REPORT.md
README.md
REFERENCE_REDESIGN.md
scripts/browser-check.ts
scripts/smoke.ts
scripts/test-pages.ts
SEO_AUDIT.md
src/app/[page]/page.tsx
src/app/icon.png
src/app/icon.svg
src/app/layout.tsx
src/app/page.tsx
src/components/arrival-estimate.tsx
src/components/brand.css
src/components/brand-logo.tsx
src/components/customer-reviews.css
src/components/customer-reviews.tsx
src/components/header.tsx
src/components/service-carousel.css
src/components/theme.css
src/components/theme-toggle.tsx
src/lib/arrival.ts
src/lib/theme.ts
tests/theme.test.ts
```
