# Prelaunch checklist — launch blocked

Selected by owner: **winnipeg-bridgwater — Bridgwater / Waverley West, Winnipeg, Manitoba**. Selection is recorded in `config/launch.json`; no coverage claim follows from it. Business status remains `proposed`.

## Business and operations

- [ ] Approve legal entity and exact advertised role; confirm easytowing as the approved trading identity.
- [ ] Resolve the source documents’ difference about owner-managed versus separately managed call-centre operations. Explain contractual responsibilities truthfully.
- [ ] Verify provincial/local business requirements and the entity’s actual coordinating/operating model with appropriate advice. Do not treat partner registrations as approval of the coordinating entity.
- [ ] Verify each partner’s registration, operator permissions, insurance and accepted services. Retain documentary evidence outside public source.
- [ ] Confirm actual per-service, per-shift coverage, backup capacity and exact micro service zone. Do not extrapolate neighbourhood coverage into all of Winnipeg.
- [ ] Configure a real monitored Canadian phone number, display number and support email; test answer handling and escalation.
  The owner supplied easytowing and 672-889-9764 on October 24. Native `tel:+16728899764` links use `phoneMode: "owner-provided"`. Answer handling and monitoring have not been independently verified. Confirm them, set `phoneMode: "verified"`, and complete the live approval gates. Production builds reject demo mode and reserved fiction numbers. The readable number and call action sit outside the mobile menu.
- [x] Record owner confirmation of 24/7 call answering and partner dispatch in `config/launch.json` (October 24).
- [ ] Validate partner shift coverage, backup capacity and escalation for the selected America/Winnipeg service zone; a 24/7 badge does not guarantee job acceptance or an ETA.
- [ ] Individually verify the seven categories explicitly requested by the owner on October 22, 2026: towing, jump start, lockout, tire change, fuel delivery, battery replacement and tire repair. The preview includes all seven; production `offers` and coverage remain unapproved. Collision recovery, winching and restricted-road work are not included by implication.
- [ ] Confirm lockout authority checks and partner suitability; compatible fuel handling; battery stock/fitment, warranty and disposal terms; and tire-repair equipment, inspection and repair criteria. Follow applicable manufacturer guidance. [USTMA tire repair basics](https://www.ustires.org/tire-care-safety/tire-repair-basics) explains why proper inspection is needed before repair. Do not advertise that every puncture can be repaired at the roadside.
- [ ] Confirm real call-answering capacity and per-service dispatch availability before making response promises. The owner's preference for service on call does not supply a verified arrival-time guarantee; current copy asks callers to confirm availability and an arrival estimate.
- [ ] Document safe handling of hazardous/restricted locations. For Winnipeg insurance-related towing, verify current MPI pathways before offering it; the current site makes no MPI affiliation or coverage claim.

## Price, identity and consent

- [ ] Approve price/quote text, CAD/taxes, extra charges, payment entity, written quote and customer consent processes.
- [ ] Clearly identify who accepts the job, obtains consent, dispatches, invoices, handles cancellation/refunds and resolves complaints. Set `operatorDetails` accordingly.
- [ ] Complete public cancellation/refund and complaint terms, and any mandatory operator/rate/certification information; publish only genuine approved information.
- [ ] Obtain owner/counsel approval of final terms, privacy and accessibility support information. Draft pages currently remain explicitly drafts.
- [ ] If the pilot changes to Ontario, separately complete the TSSEA/entity/certification/payment/referral review, required rate/certificate/rights disclosures and restricted-highway workflow. Do not apply Ontario copy to Manitoba by default.

## Privacy and callbacks

- [ ] Identify the controller/privacy contact, call centre and callback/hosting/Redis/analytics processors, processing countries and any cross-border safeguards.
- [ ] Specify real retention/deletion periods for callback records, logs, call recordings and customer records; implement contractual and technical controls. Reflect these details in the public privacy page.
- [ ] If recording calls, implement explicit notice, purpose and meaningful consent before recording starts. The website supplies no recording consent.
- [ ] Confirm callback staffing; deploy/test approved HTTPS webhook and Redis infrastructure. Secrets belong only in server environment variables.
- [ ] Verify rate limiting, spam protection, failed/uncertain delivery reconciliation, access controls and deletion with actual providers. Consider additional edge rate limiting for distributed abuse.
- [ ] End-to-end test real monitored callbacks without suggesting a dispatch. Never submit actual emergencies as tests.
- [ ] Approve analytics separately, validate the notice and consent behaviour, and verify that query strings/caller data cannot enter measurement.

## SEO and marketing

- [ ] Configure final HTTPS canonical origin and explicitly approve individual routes for indexing.
- [ ] Write genuine unique local content from verified service-zone and partner-access facts. The area template is not a substitute for verified locality information.
- [ ] Validate live Organization, Service and BreadcrumbList structured data with Google’s tools. No LocalBusiness or ratings/address/geo claims are generated.
- [ ] Check canonical URLs, HTTP status, unique titles/descriptions, headings, navigation, approved sitemap and live robots behaviour on final deployment. Previews must remain noindex.
- [ ] Set up Search Console using the real owner account. Confirm publication rights for supplied photos. The current gallery uses four rebranded supplied photos and two generated vehicle concepts, explicitly disclosed as illustrative. Originals remain local.
- [ ] Obtain matched location-filtered Google Keyword Planner data. The selected market is not proof of lower CPC or profitability.
- [ ] Configure Ads presence targeting, approved hours and the actual service footprint; avoid unreviewed insurer/CAA affiliation, rates, rapid ETAs and lockout advertising.
- [ ] Integrate authoritative call/CRM events with deduplication and privacy safeguards before optimizing toward qualified/completed jobs. UTM/gclid persistence remains off pending approval.
- [ ] Determine GBP eligibility from the actual verified business model; never fabricate a local address or lead-generation listing.

## Technical release

- [ ] Run lint, typecheck, unit/component tests, preview build and HTTP smoke checks.
- [ ] Complete actual desktop/mobile visual QA, keyboard navigation, screen-reader and 200%/400% zoom checks. Headless Chrome checks now cover six responsive widths and the primary interactions; real devices, screen readers and zoom still need testing.
- [ ] Test final real contact links, callback infrastructure, live-only metadata and chosen service-area route after configuration.
- [ ] Measure performance on real devices and field data when available. LCP/INP/CLS are targets, not current performance claims.
- [ ] Remove draft qualifiers only after approved replacement content is complete. Fill `config/launch.json`; set true only for documented approvals.
- [ ] `npm.cmd run check:launch` and `npm.cmd run build` must pass. Configure `SITE_DEPLOYMENT=production` at build and runtime, then deploy through the chosen host.

A public non-indexable design preview is hosted on GitHub Pages; an operating/indexable production launch has not been performed. The Sites skill’s default publishing workflow was limited to local work because AGENTS.md explicitly requires: “block real launch on outstanding compliance and verified operator claims.”

The expanded catalogue now includes the nine owner-requested primary categories: car towing, heavy duty towing, motorcycle towing, boosting & jump start, winch out, flat tire, tire change, lockout and fuel delivery. Validate suitable equipment, capacity and safe access for each before operating/indexable launch. The Reviews section requires genuine customer feedback and a sourced rating; no invented score or testimonials are published.
