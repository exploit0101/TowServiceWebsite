# Verification report

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
