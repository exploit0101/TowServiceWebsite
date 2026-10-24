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

On desktop the service carousel moves automatically, pauses on hover or keyboard focus, and offers explicit Pause/Resume, arrows and an expanded grid. Phones up to 767px show every primary service card immediately in a static two-column grid, without carousel controls. A slim strip above the header scrolls all eleven service names, with hover/focus pause and a pause button. The strip and header stay together at the top while scrolling. The larger green availability dot gently pulses to highlight the owner-confirmed 24/7 hours. Reduced-motion preferences stop the strip and dot animations and keep the desktop carousel still unless the visitor requests movement. The six-image gallery opens an accessible native dialog with previous/next controls and Escape dismissal. The homepage includes a service enquiry form; submitting it does not confirm a booking or dispatch. No map is embedded. [Reference analysis](REFERENCE_REDESIGN.md) records the Panda Towing inspiration and the original implementation choices.

A new original illustrated towing emblem uses a flatbed/car, circular road and hook motif in navy, amber and silver. Optimized transparent WebP variants supply the header mark and large hero watermark; the native wordmark stays crisp and the favicon matches. The shorter first screen contains one summary, call/service actions, the sourced 4.9 rating and four icon facts: 24-hour opening, Winnipeg, licensed/insured service partners and the documented 25-minute arrival estimate. Repeated arrival copy, price microcopy, the separate trust strip and the large foreground photo were removed; vehicle photographs remain in the gallery. No competitor artwork was copied.

The appearance control defaults to light regardless of the operating-system preference. Explicit light/dark choices are remembered in local browser storage, survive reloads and navigation, and tolerate blocked storage. Both themes cover the full site with readable text and visible controls. The review cards retain the owner's supplied Michael Thompson, Sarah Mitchell and Mathew feedback, profile counts and relative timing labels, without decorative quotation marks. Profile details are marked as of October 24, 2026. The 4.9 summary remains attributed to EasyTowing; no platform affiliation, individual star ratings, exact review timestamps or overall review count are invented.

Four supplied photos were rebranded with built-in ImageGen, and two additional vehicle concepts were generated. The six source WebP files are 153–235 KB each; static hosting also serves pre-sized responsive variants from 320 to 1440px. Originals stay unchanged in ignored `Images/`; only edited web assets are published. [Asset provenance and prompts](assets/README.md) distinguish these illustrative visuals from verified company fleet photographs.

The nine primary categories are car towing, heavy duty towing, motorcycle towing, boosting & jump start, winch out, flat tire, tire change, lockout and fuel delivery. Battery replacement and tire repair remain secondary services, preserving eleven scoped detail routes under `/services`. About, contact, rates/disclosures, privacy, terms and accessibility pages remain linked. The homepage contact section and `/request-help` provide the owner-requested Formspree service enquiry form. Calls remain the urgent-help option.

## GitHub Pages

Pushes to `main` run `.github/workflows/pages.yml`, verify the exported site and publish it to GitHub Pages.

```powershell
$env:GITHUB_PAGES_BASE_PATH = '/TowServiceWebsite'
npm.cmd run build:pages
npm.cmd run test:pages
```

The isolated static build writes `pages-out/` and preserves the normal local development build. GitHub Pages has no server callback endpoint. See [deployment details](GITHUB_DEPLOYMENT.md).

For a server-capable host, `npm.cmd run build:preview` and `npm.cmd run start` produce an optimized Next.js preview. The future callback API requires approved staffing, privacy arrangements and all five callback/webhook/Redis variables in `.env.example`; it remains disabled until configured. The Formspree enquiry is independent of that API and works on GitHub Pages. The visitor may enter an address or nearest intersection; no device-location permission, payment or referral billing is implemented.

## SEO and operating status

`config/launch.json` is the shared source of truth. The owner supplied legal name EasyTowing, brand easytowing, verified phone 672-889-9764 and explicit phone-only support. No email address is invented. The owner confirmed 24/7 call answering and partner dispatch, citywide Winnipeg coverage for the advertised services, and a 25-minute estimate supported by dispatch records. The estimate is qualified by actual timing on the call, traffic, weather and operator availability.

The owner also confirmed the provider model, partner credentials, provincial requirements, rates/consent, privacy and legal-text approvals, and instructed production release. These are recorded owner attestations; software does not establish legal approval. The original Bridgwater pilot remains a historical configuration key; current public coverage is Winnipeg. See `PRELAUNCH_CHECKLIST.md` for release status.

### Formspree enquiries and WhatsApp

The owner supplied `https://formspree.io/f/xkjjownd`. The public destination and WhatsApp draft are in `src/lib/contact.ts`; the footer derives its chat number from `siteConfig.supportPhone`. No API key, backend or new environment variable is needed. Name, phone, location and service are required; email and message are optional. Initial enquiries can use an intersection or neighbourhood. Consent explains Formspree processing, including in the US, and links to the updated privacy notice.

The form uses asynchronous POST with explicit delivery feedback, prevents duplicate in-flight submissions, keeps entries on failure, includes Formspree’s `_gotcha` spam field, and offers hosted verification when Formspree requests a challenge. The native POST action also works without JavaScript. The website does not persist the entries, collect GPS coordinates, automatically retry ambiguous deliveries, or log form payloads. Formspree controls server-side spam filtering, account limits, notifications and submission retention. Confirm the destination inbox, domain restriction and retention settings in the owner’s Formspree dashboard; application tests mock delivery and cannot verify inbox receipt.

WhatsApp opens an editable draft: “Hi, I am looking for your towing or roadside assistance services in Winnipeg. Can you help?” The visitor must press Send. The configured number needs an active WhatsApp account. No chat widget or WhatsApp script loads on the site.

Run `npm.cmd run test:contact` for mobile/desktop form validation, success/error/challenge responses, keyboard order, native no-JavaScript submission and WhatsApp URL checks. All test submissions are intercepted locally; no real enquiry or message is sent. The production workflow runs these checks against the static export.

Implementation references: [Formspree JavaScript forms](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax), [honeypot filtering](https://help.formspree.io/articles/building-your-form/honeypot-spam-filtering), [Formspree privacy](https://formspree.io/legal/privacy-policy/), [WhatsApp click to chat](https://faq.whatsapp.com/5913398998672934).

Production Pages is available with `GITHUB_PAGES_PRODUCTION=1` after `npm.cmd run check:launch` passes. The workflow selects this mode with repository variable `PRODUCTION_SITE=true`. It enables approved indexable routes, deployment-aware canonical/social URLs, Organization/Service/BreadcrumbList schema and the approved sitemap. Default local/preview builds retain noindex. There are nineteen approved indexable URLs; the phone request utility and legacy pilot page remain noindex. No LocalBusiness, address, fleet ownership, certificate or aggregate review-rating schema is invented.

Optional analytics requires live mode, owner approval, configuration and explicit visitor consent. It is currently disabled. Qualified calls and completed jobs require a separate approved call/CRM integration; telephone taps are only micro-conversions.

See [SEO audit](SEO_AUDIT.md) and [QA results](QA_REPORT.md). The supplied market document is `Market_Selection_22_10_2026.md`; the separately referenced `MARKET_SELECTION_2026-10-22.md`, `MARKET_RESEARCH.md` and `KEYWORD_MATRIX.csv` were not supplied and have not been reconstructed.
