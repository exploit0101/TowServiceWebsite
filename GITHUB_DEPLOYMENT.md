# GitHub repository and Pages deployment

The owner requested Git version control, GitHub source publication and hosting on GitHub Pages. The deployed artifact is a **public demo**, not a verified operating roadside service. It retains the temporary-number disclosure and noindex metadata.

## What is automated

`.github/workflows/pages.yml` runs on pushes to `main` or manual dispatch. It checks out the repository, installs locked dependencies on Node.js 22, runs lint/typecheck/tests, creates the static Pages build, checks its exported routes/assets, uploads `pages-out`, then deploys using the official GitHub Pages actions. Action revisions are pinned; Dependabot checks npm and GitHub Actions updates weekly.

The workflow derives the repository base path from GitHub Pages configuration. Project sites normally use `https://OWNER.github.io/REPOSITORY/`. Do not assume that a root-domain build works under a repository path: links, JavaScript, icons and the hero image must all use the configured prefix.

## Static host limits

GitHub Pages serves static files, not a Node.js server. This build omits the server callback endpoint and unapproved area routes. The preview form continues to demonstrate its process locally and sends no requests. Tapping a labelled demo call action opens the device's dialer with the reserved demonstration number; it does not book or dispatch service.

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

## Before serving actual customers

Complete `PRELAUNCH_CHECKLIST.md`, replace the demo phone with the verified monitored number, approve identity/coverage/rates/legal notices and pass the normal production checks. Any live callback form needs a server-capable backend and approved privacy/retention arrangements; GitHub Pages alone cannot supply that backend.

No public indexing, completed service performance or actual mobile dialer handoff is implied by a successful demo deployment. Validate the final real domain in Search Console when the business is ready for indexing.

References: [Next.js static export](https://nextjs.org/docs/app/guides/static-exports), [Next.js basePath](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath), [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
