# easytowing

Short, call-first towing and roadside website built with Next.js 16, React, TypeScript and Lucide icons. The owner-provided number is **672-889-9764** (`tel:+16728899764`).

Website: https://exploit0101.github.io/TowServiceWebsite/

## Run and check

Node.js 22+ is required. Use `npm.cmd` in Windows PowerShell.

```powershell
npm.cmd ci
npm.cmd run dev
# Open http://127.0.0.1:3000
```

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
# With the local server running:
npm.cmd run test:smoke
npm.cmd run test:browser
```

Browser checks use installed Google Chrome in headless mode. `TEST_BROWSER_CHANNEL` can select another installed Playwright channel; `TEST_ORIGIN` overrides the server URL. Screenshots go into ignored `.qa/`. Six viewport widths, service carousel, mobile navigation, gallery keyboard controls, focus restoration, images and contact links are checked. Actual phone calls are not placed.

## Design and content

The homepage follows a concise flow: Winnipeg towing hero, moving service cards, vehicle gallery, customer reviews and contact. Header, service cards, contact panel and floating call action use the same readable number and native telephone link. The user completes the call in their device calling app.

On desktop the service carousel moves automatically, pauses on hover or keyboard focus, and offers explicit Pause/Resume, arrows and an expanded grid. Phones up to 767px show every primary service card immediately in a static two-column grid, without carousel controls. A slim strip above the header scrolls all eleven service names, with hover/focus pause and a pause button. The strip and header stay together at the top while scrolling. The larger green availability dot gently pulses to highlight the owner-confirmed 24/7 hours. Reduced-motion preferences stop the strip and dot animations and keep the desktop carousel still unless the visitor requests movement. The six-image gallery opens an accessible native dialog with previous/next controls and Escape dismissal. No booking form or map is added to the homepage. [Reference analysis](REFERENCE_REDESIGN.md) records the Panda Towing inspiration and the original implementation choices.

An original SVG tow-truck logo has hover/focus interactions, a two-colour wordmark, a matching favicon and a faint decorative hero watermark. The hero tagline highlights the documented 25-minute arrival estimate. The review cards use the owner's supplied Michael Thompson, Sarah Mitchell and Mathew quotations, profile review/photo counts and relative timing labels. Profile details are marked as of October 24, 2026 so the supplied relative labels do not claim automatically updated freshness. The 4.9 summary remains attributed to EasyTowing; no platform affiliation, individual star ratings, exact review timestamps or overall review count are invented.

Four supplied photos were rebranded with built-in ImageGen, and two additional vehicle concepts were generated. The six source WebP files are 153–235 KB each; static hosting also serves pre-sized responsive variants from 320 to 1440px. Originals stay unchanged in ignored `Images/`; only edited web assets are published. [Asset provenance and prompts](assets/README.md) distinguish these illustrative visuals from verified company fleet photographs.

The nine primary categories are car towing, heavy duty towing, motorcycle towing, boosting & jump start, winch out, flat tire, tire change, lockout and fuel delivery. Battery replacement and tire repair remain secondary services, preserving eleven scoped detail routes under `/services`. About, contact, rates/disclosures, privacy, terms and accessibility pages remain linked. `/request-help` directs customers to call; a form appears only on an approved server-backed callback deployment.

## GitHub Pages

Pushes to `main` run `.github/workflows/pages.yml`, verify the exported site and publish it to GitHub Pages.

```powershell
$env:GITHUB_PAGES_BASE_PATH = '/TowServiceWebsite'
npm.cmd run build:pages
npm.cmd run test:pages
```

The isolated static build writes `pages-out/` and preserves the normal local development build. GitHub Pages has no server callback endpoint. See [deployment details](GITHUB_DEPLOYMENT.md).

For a server-capable host, `npm.cmd run build:preview` and `npm.cmd run start` produce an optimized Next.js preview. The future callback API requires approved staffing, privacy arrangements and all five callback/webhook/Redis variables in `.env.example`; it remains disabled until configured. No precise location, payment or referral billing is implemented.

## SEO and operating status

`config/launch.json` is the shared source of truth. The owner supplied legal name EasyTowing, brand easytowing, verified phone 672-889-9764 and explicit phone-only support. No email address is invented. The owner confirmed 24/7 call answering and partner dispatch, citywide Winnipeg coverage for the advertised services, and a 25-minute estimate supported by dispatch records. The estimate is qualified by actual timing on the call, traffic, weather and operator availability.

The owner also confirmed the provider model, partner credentials, provincial requirements, rates/consent, privacy and legal-text approvals, and instructed production release. These are recorded owner attestations; software does not establish legal approval. The original Bridgwater pilot remains a historical configuration key; current public coverage is Winnipeg. See `PRELAUNCH_CHECKLIST.md` for release status.

Production Pages is available with `GITHUB_PAGES_PRODUCTION=1` after `npm.cmd run check:launch` passes. The workflow selects this mode with repository variable `PRODUCTION_SITE=true`. It enables approved indexable routes, deployment-aware canonical/social URLs, Organization/Service/BreadcrumbList schema and the approved sitemap. Default local/preview builds retain noindex. There are nineteen approved indexable URLs; the phone request utility and legacy pilot page remain noindex. No LocalBusiness, address, fleet ownership, certificate or aggregate review-rating schema is invented.

Optional analytics requires live mode, owner approval, configuration and explicit visitor consent. It is currently disabled. Qualified calls and completed jobs require a separate approved call/CRM integration; telephone taps are only micro-conversions.

See [SEO audit](SEO_AUDIT.md) and [QA results](QA_REPORT.md). The supplied market document is `Market_Selection_22_10_2026.md`; the separately referenced `MARKET_SELECTION_2026-10-22.md`, `MARKET_RESEARCH.md` and `KEYWORD_MATRIX.csv` were not supplied and have not been reconstructed.
