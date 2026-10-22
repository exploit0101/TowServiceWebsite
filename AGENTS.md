# AGENTS.md — GTA Roadside Assistance & Towing Website (Codex Instructions)

**Research snapshot:** 2026-10-22  
**Owner model (confirmed by owner):** customer finds website/Google Search ad → independently managed call centre receives and coordinates the job → registered third-party towing/roadside drivers or mechanics in either the Ontario GTA or Winnipeg fulfill service. Owner says applicable partner registrations and the dispatch-only model have been reviewed; final site claims still require documentary verification.  
**Business status:** proposed. **Do not assume the operating model, referral fees, Ontario operator certifications, Google Business Profile eligibility, service prices, 24/7 coverage, or partner claims have been legally or operationally approved.**

## Mission
Build a highly usable, trustworthy, fast, local-search-oriented website that converts *eligible emergency roadside searches* into **qualified inbound calls**, with unambiguous disclosures about what business is providing/coordinating the service. Do not assume the initial location: **Bridgwater/Waverley West (Winnipeg)** is the provisional lead, **Transcona (Winnipeg)** the alternate, and **East/Central Brampton** the GTA fallback. Selection is a prebuild gate based on real partner ETAs, service economics and geo-specific Keyword Planner figures. Do not launch copy for all areas at once. Never prioritize rankings or calls over safety, accuracy, licensing, consumer consent, or privacy.

## Updated market selection (October 22, 2026)
Read `MARKET_SELECTION_2026-10-22.md` first. The original Brampton-only market decision has been superseded by owner confirmation of Winnipeg partners and new 2025/2026 Winnipeg competition/growth findings. Before writing locality-specific SEO pages, obtain an explicit `PILOT_MARKET` value: `winnipeg-bridgwater`, `winnipeg-transcona`, or `brampton-bramalea`. Never treat a research hypothesis as verified ad spend, CPC, or competitor count.

## Non-negotiable prelaunch gates
1. **Ontario towing legal review.** Ontario's Towing and Storage Safety and Enforcement Act, 2021 (TSSEA) has restrictions on towing-related inducements/referrals (ss. 29–31). The definition of towing services includes roadside assistance as of April 1, 2026. Ontario says a tow operator is a person or company that **offers** towing services, and a certificate is required for operators. **Counsel must confirm whether this entity requires a tow-operator certificate, whether independent-contractor fulfillment is allowed, and whether proposed payment flow is lawful.** Do not design around the law with an unreviewed 'per lead' fee.
2. **Restricted highway zone safety.** Certain 400-series highways and the QEW have restricted towing zones under O. Reg. 217/25. Never advertise that arbitrary partner trucks can attend these roads. Dispatch software must flag potentially restricted coordinates/highway calls for supervisor/authorized operator handling; provide appropriate 911/511 safety guidance for hazardous situations according to current official information.
3. **Provider truthfulness.** Google Ads disallows misleading business identity/affiliations and unsupported rapid-response times. Show actual legal/trading name, verified contact methods, and plain explanation of the actual role (coordinator vs certified towing operator), approved by counsel. Do not imply you own fleets, have depots, have staff in neighbourhoods, or are officially affiliated with CAA/police/insurers unless documented.
4. **Google Business Profile.** A pure lead-generation company is *not eligible*. Do not generate instructions to fabricate a GBP listing or virtual Brampton address. Only recommend one if the verified service-company operating model is eligible under Google's rules.
5. **Rate, certificate, consent.** If the business itself is a certified Ontario tow operator, the website/social profile must display operator details, certificate and maximum rates as required by current O. Reg. 167/23; tow consent and customer rights must be handled via the actual authorized operator in compliance with Ontario rules. Do not publish unapproved prices or fees. If a partner is the operator, accurately identify who issues consent, invoices, and rates.
6. **Privacy/calls.** Call recording requires clear notice, stated purposes, and meaningful consent under applicable PIPEDA requirements. If a call centre or vendor operates outside Canada, implement contractual data protections, notices where required, data-minimization, access controls, and limited retention, following privacy review.

## Product goals and KPIs
- Primary conversion: **completed qualified phone call that books an actual fulfilled service**. Not raw click count, unqualified calls, or telephone-link taps.
- Funnel: paid/organic source → landing page → phone tap or request → answered → in-area + valid service → price/consent → accepted by partner → dispatched → completed → invoiced → customer feedback.
- Measure: impressions, CTR, paid CPC, call connection rate, lead qualification %, quote acceptance %, booking %, cancellation %, mean pickup time, partner acceptance %, ETA accuracy, completed-job contribution, advertising cost per *completed* job, complaints, repeat callers.
- Never report an invented performance number. Store experimental assumptions separately from actual metrics.

## Recommended stack (unless repository already imposes another)
- Next.js App Router + TypeScript + React, server-rendered/indexable routes, modern CSS or Tailwind CSS, Vercel or equivalent host.
- Shared typed `siteConfig` (brand, legalName, supportPhone E.164, displayPhone, serviceHours, disclaimerMode, physicalOfficeVerified, businessStatus, areas, offers, prices, certifications, operatorDetails). Require configured/verified values before production build. Do not silently fall back to fake business details.
- Content-driven pages using typed objects or MDX with unique local content; optimized images only when owner-provided or rights-cleared.
- First release may use a simple contact form plus a phone link; protect forms server-side with rate limits, validation, anti-spam, and minimal personal information.
- An authenticated dispatcher dashboard is **Phase 2**, separate from public SEO pages.

## Phase 1 page architecture
- `/` — fast call-first homepage focused on **the verified selected pilot area** with visible actual operating role and dispatch coverage.
- `/services` — real available services hub.
- `/services/battery-boost` — battery boost / jump start. H1 focused on Brampton only if true.
- `/services/flat-tire-help` — installing an existing spare / roadside tire help, with honest scope.
- `/services/local-towing` — straightforward breakdown tow (launch only if compliant and authorized operators available).
- `/areas/[selected-pilot]` — one unique, genuine coverage page for the market selected by the owner; do not mass-create city doorway pages.
- `/request-help` — minimalist service request; must **not** suggest that submitting means a truck has been dispatched. Clear urgent call CTA.
- `/about` — business identity; how independent partners are coordinated; service obligations; information verified by business owner.
- `/contact` — real phone and contact details; accurate hours and availability.
- `/rates-and-disclosures` — explain quoting and applicable mandatory operator maximum-rate information, approval-dependent.
- `/privacy`, `/terms`, `/accessibility` — complete owner/counsel reviewed texts, not misleading boilerplate.
- **Do not publish any pilot-location page** until owner confirms specific partner coverage, real business role and applicable provincial compliance. The Ontario/Manitoba content and terminology differ.

## Essential layout and content
- Mobile first, one obvious sticky click-to-call CTA **only when a real live monitored Canadian phone number is configured**. On desktop show the same number as a normal readable link. Distinct secondary CTA 'Request a callback' only if actual operational follow-up is staffed.
- Above-fold headline states service + **real** operating area, ideally problem-first ('Need a battery boost in [verified area]? Call to check dispatch availability'). Do not promise '10 minutes', 'lowest price', 'guaranteed 24/7', 'fully licensed', 'insurance approved', or 'all GTA' absent proof.
- First-screen trust sections: available services, dispatch process, independently operated service explanation where relevant, how pricing is confirmed, safety warning for active traffic lanes, response time depends on dispatch availability.
- Give customers choice of towing destination where required, genuine support contact, written quote process, consent process, refund/complaint contact, and explanation of possible taxes/fees.
- Provide unique problem-specific advice with safety emphasis (battery no-start, spare wheel presence, flat location, tow pickup/drop-off). Never tell motorists to stay in dangerous road conditions to interact with website.
- Naming any neighbourhood or city means confirmed partner coverage; do not publish GTA-wide or Winnipeg-wide boilerplate pages as a shortcut.
- Use genuine staff/partner photos with documented rights and consent. No stock photos described as the actual company fleet. No fake ratings, testimonial counts, certifications, ETA estimates, or office addresses.

## SEO implementation checklist (mandatory)
1. Server-rendered content, indexable HTML with correct HTTP status, no client-only main copy.
2. Every indexable page: unique concise `<title>`, one H1, relevant meta description, absolute canonical, logical heading hierarchy, internal links and breadcrumbs.
3. Generate `/robots.txt` and `/sitemap.xml` from **only approved indexable pages**; preview/staging environments `noindex`. Set canonical domain via env config.
4. Schema: accurate `Organization` with verified contact/identity; valid `Service` and `BreadcrumbList` where applicable. Add `LocalBusiness` only if an actual eligible company/location can be truthfully represented. Don't invent `aggregateRating`, street addresses, geo coordinates, or certification numbers. Validate through Google's structured-data testing tools.
5. Image alt text describes actual imagery, optimized formats/sizes, responsive `srcset` or Next image, predictable layout shifts, accessible tap targets, keyboard navigation.
6. Performance goals for real-device tests: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1 at p75 when sufficient data; avoid blocking scripts and oversized hero media. These are targets, not claimed test results.
7. Add trustworthy About, real business details, privacy/contact, customer rights, service limits, and visible provider-role disclosure.
8. Avoid keyword stuffing, duplicate city pages, auto-generated variations, purchased spam backlinks, and misleading FAQ structured data. SEO content must be helpful and locally specific.
9. Prepare Google Search Console verification, conversion event analytics, and consent-aware tags. No fabricated search volume or SEO rank guarantees.
10. Content should use Canadian English, CAD prices where approved, Ontario spelling/terms, and `America/Toronto` operational time display.

## Paid ads and call measurement readiness
- Provide fast, tightly themed landing-page variants with UTM persistence that respects privacy policy (e.g. source, medium, campaign, term, content, gclid when permitted).
- Initial **proposed test**: battery boost, flat tire, and local breakdown towing around the defined Brampton coverage polygon/radius. Configure Google Ads geographic **Presence: People in or regularly in the targeted locations**, not the default interest-inclusive option.
- Conversion events: `phone_link_click` (**micro-conversion only**); `call_connected`, `call_qualified`, `job_booked`, `job_completed` (**CRM/offline**). Only optimize to qualified/completed jobs when tracking supports it; avoid double counts across Google call forwarding and PBX.
- For keyword, CPC and volume decisions, obtain real **Google Keyword Planner location-filtered historical metrics**. Keywords in `KEYWORD_MATRIX.csv` are hypotheses only.
- No dark patterns, spoofed numbers, misleading 'call now' links, accidental dial actions, hidden data collection, or 'your call has been dispatched' confirmation before actual dispatch.
- Vehicle lockouts are a later-phase service: Canadian locksmith-ad verification may be relevant depending on how ads are categorized; check policies before advertising it.

## Example approved-tone homepage copy (subject to verification)
> Roadside Help in Brampton  
> Battery boosts, flat tire help and eligible local towing. Call our dispatch team to check availability and get a quote before service. On-site work is carried out by independent service partners where applicable. Arrival times depend on location, traffic, weather and available operators.

Replace all claims with verified facts before deployment. The displayed identity must match the chosen/legal business model.

## Workflow for Codex
1. Inspect existing repository. Read this AGENTS.md, README.md, MARKET_RESEARCH.md and KEYWORD_MATRIX.csv before coding.
2. Produce concise execution plan + identify any conflicts with existing stack. Do **not** claim legal approval.
3. Create a coherent reusable design system: navy/charcoal + safety accent, readable modern typography, responsive grids, clear CTA and a calm emergency-first design. Don't visually mimic competitors.
4. Implement routes, layout, reusable content components, internal linking, semantic metadata/structured data, local service-area configuration, and contact functionality.
5. Add tests (unit and component where useful, navigation/canonical/sitemap, form validation, keyboard flows, contact links, link integrity, responsive states). Add lint, typecheck, build commands.
6. Integrate Google Analytics/Ads only behind environment configuration and appropriate consent decisions. Document what remains needed for live call tracking.
7. Document any placeholder/unknowns under `PRELAUNCH_CHECKLIST.md`; ***block real launch*** on outstanding compliance and verified operator claims. Don't put unresolved false claims on public pages.
8. Summarize exact changed files, runnable commands, tests executed/results, SEO audit results, and outstanding legal/business data.

## Do not do
- Do not launch a fake eligible Google Business Profile or claim a physical Brampton depot without proof.
- Do not publish scraped testimonials, copied competitor text, unlicensed photos, invented service pricing, guaranteed ETAs, unverified 24/7 service, or customer-facing fabricated booking confirmations.
- Do not route restricted highway calls to arbitrary drivers or suggest illegal roadside operations.
- Do not implement referral commission billing until lawyer-reviewed.
- Do not collect exact customer location or call data without a justifiable need, access controls, proper notice, and retention procedures.

## Required owner inputs before production
`BRAND_NAME`, legal entity and accurate advertised provider role, actual Canadian call-centre number, province/city operating registration, legal counsel determination and required Ontario tow certification, partner certificate/insurance status and real dispatch hours, approved service list and micro service-zone, approved customer price/rate disclosures, operator/customer consent flow, privacy/controller details, payment entity, original images and any genuine reviews, final domain, support email.

## Source references verified 2026-10-22
- Ontario TSSEA: https://www.ontario.ca/laws/statute/21t26
- Ontario operator certification: https://www.ontario.ca/page/get-towing-vehicle-storage-certificate
- Ontario general regulation incl. website obligations: https://www.ontario.ca/laws/regulation/230167/v10
- Ontario restricted zones: https://www.ontario.ca/laws/regulation/250217
- Ontario consumer consent: https://www.ontario.ca/page/know-your-rights-when-getting-tow
- Google GBP ineligible lead-gen: https://support.google.com/business/answer/13762416
- Google Ads misrepresentation: https://support.google.com/adspolicy/answer/15936666
- Google local geo options: https://support.google.com/google-ads/answer/9376662
- Google structured data: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google search spam/doorway policy: https://developers.google.com/search/docs/essentials/spam-policies
- Office of Privacy Commissioner updated call recording guidance: https://www.priv.gc.ca/en/privacy-topics/surveillance/02_05_d_14/

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
