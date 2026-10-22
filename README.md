# Roadside assistance website

Pre-launch implementation of `AGENTS.md`: Next.js App Router, TypeScript, React, modern CSS and Lucide icons. A separate static demo build and GitHub Pages deployment workflow are available; see [GitHub deployment](GITHUB_DEPLOYMENT.md).

## Run on Windows

Node.js 22+ and npm are required. Use `npm.cmd` in PowerShell if its script execution policy blocks `npm.ps1`.

```powershell
npm.cmd ci
npm.cmd run dev
```

Open <http://127.0.0.1:3000>. No environment variables are needed for the local preview.

To serve an optimized preview:

```powershell
npm.cmd run build:preview
npm.cmd run start
```

The explicit preview build disables live mode at compile time. Setting a production runtime variable cannot turn a preview artifact into a live service.

For GitHub Pages, `npm.cmd run build:pages` produces `pages-out/`, and `npm.cmd run test:pages` checks the artifact. Set `GITHUB_PAGES_BASE_PATH` consistently (for example `/TowServiceWebsite`). The automatic `main` workflow derives it from the repository's Pages configuration. This is a static **demo** with no server callback endpoint; it does not enable live service or search indexing.

## Checks

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build:preview
# Run with the preview server on port 3000:
npm.cmd run test:smoke
# Intentionally fails until verified business data and approvals exist:
npm.cmd run check:launch
npm.cmd run build
```

`test:smoke` checks all 16 rendered pages, the seven service cards and distinct icons, internal destinations, exactly one H1, non-indexable preview metadata, absence of invented contacts/canonicals/schema, blocked service-area routes, robots, sitemap and the disabled callback API. The 23 unit/component/SEO tests cover approval gates, province-specific restrictions, service catalogue consistency, request validation, contact links and form accessibility markup. They do not replace browser, screen-reader or real-device testing. See `QA_REPORT.md` for actual results.

## What was built

- `/`: responsive navy/cream/yellow design, an original AI-generated 3D towing hero, service cards, process, provider model, safety note and expandable questions. The grid SVG has been replaced.
- `/services` and seven scoped detail pages: towing (`local-towing`), jump start (`battery-boost`), lockout, tire change (`flat-tire-help`), fuel delivery, battery replacement and tire repair. Existing URLs are retained.
- `/request-help`: interactive local-only form preview. Its successful review states that nothing was sent and no vehicle was dispatched.
- `/about`, `/contact`, `/rates-and-disclosures`, `/privacy`, `/terms`, `/accessibility`: identity and process information, draft legal content and explicit status of unavailable contact channels.
- `/areas/[area]`: returns 404 until verified live mode; only the selected pilot may resolve. No multi-city pages are generated.
- `/api/callback`: disabled before launch. When approved and configured: origin enforcement, bounded request body, server validation, honeypot, Redis-backed rate limit, authenticated HTTPS webhook and fail-closed handling.
- Approved live mode supports verified phone CTAs, Organization/Service/BreadcrumbList schema, absolute canonicals and a sitemap from the explicit indexable-route list.

## Configuration and launch

`config/launch.json` is the owner-maintained, non-secret source of truth. The owner explicitly selected `winnipeg-bridgwater` during this session. This **does not** verify partner coverage or compliance. The “Roadside” wordmark is a design label, not an approved business identity. No fake number, price, address, review, certification or arrival-time promise is used.

At the owner's request, the header now displays the temporary **204-555-0100** number separately from the yellow call action. Header, hero and service call actions use native `tel:+12045550100` links, handing off to the device's phone/calling app without JavaScript or an automatic call. The visitor completes the call in the dialer. `phoneMode: "demo"` enables this clearly labelled preview interaction without enabling live indexing, callback submissions or dispatch. NANPA reserves 555-0100 through 555-0199 for fictional, non-working use ([source](https://nanpa.com/numbering/555-line-numbers)); the demo does not reach a roadside service.

To replace it, configure the real `supportPhone` and matching `displayPhone`, set `phoneMode` to `verified`, and complete the existing live-mode approvals. Production validation rejects demo mode, reserved demonstration numbers and mismatched display/dial targets. Without a usable configured number, calling stays disabled. On phones/tablets the readable number and large call action sit outside the mobile menu and stay visible while scrolling in portrait mode. Short landscape screens use a non-sticky header to preserve reading space.

Each service card also has its own call action and a separate details link, with no nested anchors. The shared seven-service catalogue (`src/lib/service-catalog.ts`) drives content, request validation and approved production service IDs. The card grid is four columns on wide screens, two on tablets and one on phones; all seven icons are distinct. The eighth panel explains the call process. The owner requested all seven categories on October 22, 2026. This updates the planned catalogue without creating evidence of verified coverage or guaranteed immediate dispatch. Availability, quote, partner acceptance and arrival estimate must be confirmed by the eventual live service line; the current number is only a demo.

Fill in verified identity, real phone, email, hours, exact service zone, approved services, role, rate disclosures, operator information, real domain and documentary approval flags. Approval flags record owner decisions; software cannot establish legal approval. Complete and review legal and consumer disclosures before setting their approval flag. The controller, actual processors, processing countries, retention schedule and complaints responsibilities must be reflected in final public copy. Read `PRELAUNCH_CHECKLIST.md` before changing the business status to `operating`.

Production requires a successful `npm.cmd run build`, and `SITE_DEPLOYMENT=production` at build and runtime. A normal `next build` with no production environment remains a non-indexable preview. Never use the preview build to bypass the launch review. Deploy with a host supporting Next.js Node route handlers; no static export is configured.

For technical SEO, set the final verified HTTPS origin with `CANONICAL_DOMAIN` (or `canonicalDomain` in the launch config). The same normalization is used for launch validation, canonical/social URLs, schema and callback-origin checks. `GOOGLE_SITE_VERIFICATION` optionally adds the real owner's Search Console token in approved live mode. Crawlers are allowed to read page-level noindex and load rendering assets; robots blocks `/api/`, and only approved live routes enter the sitemap. Use host authentication to keep remote staging private. See `SEO_AUDIT.md` for the audit and remaining deployment checks.

The towing hero is `public/images/towing-3d-hero.webp`: a 1448 × 1086, 262 KB conceptual 3D render, delivered through responsive `next/image` with intrinsic dimensions and preload. It is explicitly labelled as an illustration, not an actual fleet photo. Generation prompt, tool and source provenance are recorded in `assets/README.md`.

`America/Winnipeg` applies to the selected Manitoba pilot. `America/Toronto` applies only to the Brampton option. This resolves the older Ontario-only timezone wording in AGENTS.md using the selected province.

## Callback integration

Copy `.env.example` to `.env.local` and configure only approved service providers. The API requires `CALLBACK_WEBHOOK_URL`, `CALLBACK_WEBHOOK_TOKEN`, `RATE_LIMIT_REDIS_URL`, `RATE_LIMIT_REDIS_TOKEN` and a strong `RATE_LIMIT_HASH_SECRET`. The Redis REST endpoint must support EVAL, returning a numeric `result`; no in-memory fallback is used. Limits are three attempts per normalized callback number per 15-minute window. This prevents repeated-number abuse, not all distributed spam; assess additional edge protection before enabling a public callback endpoint.

The webhook receives `{phone, name, service, area, consent, requestedAt, kind: "callback_request_not_dispatch"}` over authenticated HTTPS. It must durably accept the request before returning success. Requests time out after eight seconds; uncertain delivery never displays a booking or dispatch confirmation. Do not enable callback staffing approval until staffing, processor security, retention, deletion, complaints and timeout reconciliation are ready. Exact coordinates and vehicle identifiers are intentionally not collected. There is no payment or referral commission functionality.

## Measurement

Optional Google analytics is off unless live mode, owner analytics approval and `NEXT_PUBLIC_GOOGLE_TAG_ID` are all present **and** the visitor explicitly accepts. Decline is equally accessible; consent is held only in page memory. No advertising/campaign identifiers or UTM parameters are persisted. After consent, a page view omits query parameters; telephone taps generate `phone_link_click` as a micro-conversion. Advertising consent remains denied. No call is recorded by the app.

Production call tracking remains a separate integration: obtain a verified PBX/call-tracking provider, caller notice and recording consent if applicable; connect `call_connected`, `call_qualified`, `job_booked` and `job_completed` to authoritative CRM events with deduplication. Do not optimize ads to telephone taps. Campaign persistence and Ads conversion imports remain deliberately deferred pending privacy review and a real provider. No performance metrics or Keyword Planner figures are fabricated.

## Source status

Read `AGENTS.md` and the subsequently supplied `Market_Selection_22_10_2026.md`. The exact referenced `MARKET_SELECTION_2026-10-22.md`, `MARKET_RESEARCH.md` and `KEYWORD_MATRIX.csv` were not supplied. This project does not reconstruct them or present hypotheses as research results. The market document differs slightly on who manages calls; the final owner-approved `providerRole` must resolve this before launch.

The setup follows the official [Next.js installation documentation](https://nextjs.org/docs/app/getting-started/installation). No new legal determination was made during implementation.
