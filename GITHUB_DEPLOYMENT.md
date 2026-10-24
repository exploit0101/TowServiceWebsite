# GitHub repository and Pages deployment

The owner requested Git version control, GitHub source publication and hosting on GitHub Pages. The default artifact remains a **non-indexable preview** while required business details and approvals are incomplete. It uses the owner-provided 672-889-9764 number with native tel:+16728899764 links. Owner confirmation of availability does not complete the separate identity, service-zone, rates, privacy and compliance gates.

## What is automated

`.github/workflows/pages.yml` runs on pushes to `main` or manual dispatch. It checks out the repository, installs locked dependencies on Node.js 22, runs lint/typecheck/tests, creates the static Pages build, checks its exported routes/assets, uploads `pages-out`, then deploys using the official GitHub Pages actions. Action revisions are pinned; Dependabot checks npm and GitHub Actions updates weekly.

The workflow derives the repository base path from GitHub Pages configuration. Project sites normally use `https://OWNER.github.io/REPOSITORY/`. Do not assume that a root-domain build works under a repository path: links, JavaScript, icons and the hero image must all use the configured prefix.

## Static host limits

GitHub Pages serves static files, not a Node.js server. Every Pages build omits the server callback endpoint and disables callback delivery. Preview builds also omit all area routes; approved production builds export only the selected pilot area. The preview form continues to demonstrate its process locally and sends no requests. Tapping a call action opens the device's dialer with the owner-provided number. The visitor completes the call; tapping does not book or dispatch service.

The separate standard Next.js application retains its server routes for a future approved deployment on a server-capable host. Its production launch checker remains enforced. Pages publishing does not turn approval flags on, mark fictional phone numbers as real, or activate Google Ads, analytics or callback processing.

## Repository publication

Generated dependencies, environment secrets, Next.js caches, Pages output and staging files are ignored. Source files, lockfile, workflow, service content, original research/instructions and documented generated-image assets are versioned. The public-source audit found no credentials or private tokens in candidate files.

GitHub authentication must be completed by the account owner. Do not paste access tokens into the chat, source code or configuration files. The GitHub CLI device flow and normal credential storage are supported.

## Local Pages checks

```powershell
$env:GITHUB_PAGES_BASE_PATH = '/TowServiceWebsite'
npm.cmd run build:pages
npm.cmd run test:pages
```

The workflow uses the actual configured Pages base path; the example above matches the workspace name. `pages-out` contains the deployable static artifact. The normal local portal still runs with `npm.cmd run dev`.

Next.js 16 exports built on Windows can nest RSC payloads where the browser requests dotted filenames ([upstream issue #85374](https://github.com/vercel/next.js/issues/85374)). The Pages build adds matching flat aliases only for nested segment payloads inside exported page directories. It preserves originals and unrelated assets, leaves already-flat Linux output unchanged, and fails if an existing payload has different contents. This keeps link prefetching usable without a host rewrite or framework patch.

## Guarded production opt-in

`npm run build:pages` defaults to preview, independently of `SITE_DEPLOYMENT`. To request an indexed production artifact, set `GITHUB_PAGES_PRODUCTION=1` for both `build:pages` and `test:pages`. The build runs the same `launchErrors` validation as the normal production path before creating staging files. Missing identity, verified phone, contact, coverage, approved rates/legal/privacy details, final HTTPS canonical domain or required approval flags stops the build and preserves the previous artifact. The switch never changes or supplies approvals.

In GitHub, repository variable `PRODUCTION_SITE=true` opts the workflow into that guarded path. Leave it unset or false until verified business data is committed. Optional repository variable `CANONICAL_DOMAIN` overrides the configured final HTTPS origin; it does not approve the business. `GITHUB_PAGES_BASE_PATH` still comes from Pages configuration, and production canonicals, schema, images and sitemap must include that deployment path.

At compile time, Pages sets `SITE_BUILD_STATIC_HOST=github-pages` and records the validated preview/production mode. Static production can show approved service information and index approved routes, but callback delivery remains disabled because Pages supplies no server endpoint. The artifact verifier checks live canonicals, approved sitemap entries, organization data and the single selected area only in the validated production mode; previews must retain noindex and an empty sitemap.

## Before serving actual customers

Complete `PRELAUNCH_CHECKLIST.md`, verify monitoring and handling for the owner-provided phone, approve identity/coverage/rates/legal notices and pass the normal production checks. Any live callback form needs a server-capable backend and approved privacy/retention arrangements; GitHub Pages alone cannot supply that backend.

No public indexing, completed service performance or actual mobile dialer handoff is implied by a successful demo deployment. Validate the final real domain in Search Console when the business is ready for indexing.

References: [Next.js static export](https://nextjs.org/docs/app/guides/static-exports), [Next.js basePath](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath), [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Current release configuration - October 24, 2026

The owner supplied EasyTowing as legal name, selected phone-only support and confirmed the operating approvals. `check:launch` now passes. Production mode is enabled through repository variable `PRODUCTION_SITE=true`, with canonical origin `https://exploit0101.github.io`. This release has nineteen approved indexable URLs; canonicals, social/schema URLs and sitemap entries retain `/TowServiceWebsite/`. The phone request utility and legacy pilot page remain noindex. Default local/preview builds retain their noindex behavior. The current support number is real and owner-confirmed; no demo phone is used.

The website shows the owner-confirmed 25-minute estimate and Winnipeg-wide coverage. Customer feedback is the actual text supplied by the owner, with its company-supplied source label. No reviewer names, dates, total count, Google affiliation or aggregate-rating schema are invented.
