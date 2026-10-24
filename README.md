# easytowing

Short, call-first towing and roadside website built with Next.js 16, React, TypeScript and Lucide icons. The owner-provided number is **672-889-9764** (`tel:+16728899764`).

Public preview: https://exploit0101.github.io/TowServiceWebsite/

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

The homepage follows a concise flow: photo hero → seven-service carousel → fleet gallery → three steps → contact. Header, service cards, contact panel and floating call action use the same readable number and native telephone link. The user completes the call in their device's calling app.

The service carousel supports arrows, keyboard scrolling and an expanded grid. The six-image gallery opens an accessible native dialog with previous/next controls and Escape dismissal. No booking form, map, review score or testimonial is added to the homepage. [Reference analysis](REFERENCE_REDESIGN.md) records the Panda Towing inspiration and the original implementation choices.

Four supplied photos were rebranded with built-in ImageGen, and two additional vehicle concepts were generated. The six WebP files are 153–235 KB each. Originals stay unchanged in ignored `Images/`; only edited web assets are published. [Asset provenance and prompts](assets/README.md) distinguish these illustrative visuals from verified company fleet photographs.

The seven scoped service pages remain available under `/services`: towing, jump start, lockout, tire change, fuel delivery, battery replacement and tire repair. About, contact, rates/disclosures, privacy, terms and accessibility pages remain linked. `/request-help` is a local-only form preview and sends nothing.

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

`config/launch.json` is the shared source of truth. Brand and phone are owner supplied; `phoneMode: "owner-provided"` enables telephone links without claiming that monitoring, hours or dispatch are verified. `phoneMode: "verified"` and the existing approval gates are required for an operating production release. Software flags do not establish legal approval.

The owner selected `winnipeg-bridgwater` (Bridgwater / Waverley West, Winnipeg). Partner coverage, hours, legal identity, advertised role, rates/consent, support email, final domain and privacy/legal approvals remain outstanding. No locality page or unverified location claim is published. The Manitoba pilot uses `America/Winnipeg`; Ontario requirements apply only if that market is selected.

Technical SEO includes server-rendered content, unique titles/descriptions, one H1 per page, descriptive image alt text, internal links and a live-mode canonical/schema/sitemap policy. The public preview deliberately retains **noindex**, an empty sitemap and no unverified Organization/LocalBusiness claims. Complete [PRELAUNCH_CHECKLIST.md](PRELAUNCH_CHECKLIST.md) before changing `businessStatus` to `operating` or enabling indexing. `npm.cmd run check:launch` and `npm.cmd run build` reject incomplete operating data.

Optional analytics requires live mode, owner approval, configuration and explicit visitor consent. It does not load in this preview. Qualified calls and completed jobs require a separate approved call/CRM integration; telephone taps are only micro-conversions.

See [SEO audit](SEO_AUDIT.md) and [QA results](QA_REPORT.md). The supplied market document is `Market_Selection_22_10_2026.md`; the separately referenced `MARKET_SELECTION_2026-10-22.md`, `MARKET_RESEARCH.md` and `KEYWORD_MATRIX.csv` were not supplied and have not been reconstructed.
