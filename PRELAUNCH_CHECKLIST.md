# Production release status

Updated October 24, 2026 from the owner's confirmations and publication instruction.

- [x] Legal business name: **EasyTowing**; advertised brand: **easytowing**.
- [x] Real Canadian number: **672-889-9764**. Owner explicitly selected phone-only support; no email is fabricated.
- [x] Owner confirmed 24/7 call answering and partner dispatch.
- [x] Owner confirmed every advertised service throughout Winnipeg, including heavy duty towing, motorcycles and winch outs.
- [x] Owner confirmed the 25-minute estimate is supported by actual dispatch records. Copy explains that traffic, weather, safe access and available operators affect actual arrival.
- [x] Owner confirmed the independent-provider role, partner credentials, provincial requirements, rates/consent, privacy and legal text approvals.
- [x] Quoting copy uses CAD and explains taxes, possible additional fees and consent; no invented prices or certificate numbers.
- [x] Three actual customer quotes were supplied by the owner. Rating and feedback are visibly described as supplied by EasyTowing. No invented reviewer identity, dates, platform affiliation or total count.
- [x] Public project/draft wording and the How it works section removed. Essential role, safety, privacy and quotation information remains.
- [x] Production validator passes. GitHub Pages has a guarded production export, base-path-correct canonicals, approved schema and nineteen sitemap URLs.
- [x] Static request page uses phone calls. Callback processing and optional analytics stay disabled unless separately configured.

These checkmarks record owner attestations and implementation checks; the software does not provide a legal determination. Keep underlying operating/partner documents outside the public repository. The original `winnipeg-bridgwater` pilot key is historical; current advertised coverage is Winnipeg.

## Release checks

```powershell
npm.cmd run check:launch
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
$env:GITHUB_PAGES_BASE_PATH = '/TowServiceWebsite'
$env:GITHUB_PAGES_PRODUCTION = '1'
npm.cmd run build:pages
npm.cmd run test:pages
```

The GitHub workflow uses `PRODUCTION_SITE=true` and optionally `CANONICAL_DOMAIN` repository variables. The canonical origin is currently `https://exploit0101.github.io`; the configured repository path is applied consistently. Default local/preview builds remain noindex.

## Ongoing verification

- [ ] Submit the sitemap and inspect actual indexing in the owner's Google Search Console account. Do not claim that enabling indexing guarantees inclusion or rankings.
- [ ] Test carrier dialer/call-centre handling, real phones, screen readers and zoom.
- [ ] Measure field Core Web Vitals and continue tracking qualified calls and completed jobs, rather than counting taps as bookings.
- [ ] Update hours, coverage, arrival estimates, reviews, rates and partner information when the underlying facts change.
- [ ] If switching to Ontario, separately verify the applicable operating, certification, consent, rate and restricted-highway requirements before advertising there.
