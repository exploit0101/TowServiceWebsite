# easytowing reference redesign — October 24, 2026

The owner requested a shorter, call-first site informed by [Panda Towing's public website](https://www.pandatowing.ca/). The public root HTML, `main.00040c11.js` bundle and its embedded styles were inspected. This is a review of visible structure and client code; it does not verify Panda's business claims or service outcomes.

## What the reference actually contains

The public app presents a sticky header and call-led hero, followed by six service categories: roadside assistance, winch-out, flat tire, flatbed towing, boost and lockout. Its service section uses horizontal scrolling with left/right buttons and a **View all services** control that switches to a grid. Next are four static fleet photographs, three static review cards, contact details with a prominent call card, a floating telephone link and a footer. No callback form, map or calculator was found in the inspected app components. The review cards are embedded data, not evidence of a live review integration. [Source: Panda Towing](https://www.pandatowing.ca/).

## How easytowing applies the brief

The easytowing design uses its own navy, amber and white palette, typography, photography, wording and spacing. The shortened flow is header/hero → service carousel → gallery → brief three-step process and provider role → contact call panel → essential footer links. The seven requested services retain their individual scope pages: towing, jump start, lockout, tire change, fuel delivery, battery replacement and tire repair.

Service arrows, touch scrolling and an all-services view make the longer catalogue manageable. All seven service cards remain in server-rendered HTML, with descriptive detail links. The six-image gallery includes four rebranded owner-supplied images and two generated concepts; an accessible image dialog is an easytowing enhancement. Captions distinguish these illustrative assets from verified company fleet photographs. See [asset provenance](assets/README.md).

The real owner-provided number is **672-889-9764**, dialled as `tel:+16728899764`. Native telephone links open the visitor's calling app; no website click proves connection, booking or dispatch. The `owner-provided` phone mode allows these links while preserving the production launch gates. It does not establish verified staffing or hours.

Competitor ratings, review text, addresses, hours, response promises and certification claims are not transferred. No invented testimonials replace the reference's reviews. Locality claims remain gated on verified partner coverage and compliance. The footer keeps rates/disclosures, privacy, terms, accessibility and proposed status available without lengthening the main page.

## Completion checks

Verify arrows and touch scrolling, the all-services toggle, all six image dialogs, previous/next navigation, Escape/close behaviour, focus return, the mobile menu and consistent telephone targets. Check small-screen horizontal overflow, readable type, sticky/floating call controls, reduced motion and safe-area spacing. Confirm page metadata, noindex, sitemap exclusions and both Next.js/GitHub Pages asset paths. Test results belong in [QA_REPORT.md](QA_REPORT.md); this reference review does not claim browser or real-device passes.

## Current reference comparison and first-screen revision - October 24, 2026

Fresh desktop/mobile inspection of Panda found the main opportunity in hierarchy and brevity: headline, short paragraph, call/rating pair and icon facts over faint brand artwork. Full-page inventory is approximately 415 visible words: hero, six services, four fleet pictures, three reviews, contact facts/emergency call and footer. Useful controls are phone links, anchor navigation, floating call and carousel/grid switching; no additional form, map, FAQ, gallery lightbox or theme control needs to be copied. Local reference captures are ignored .qa/panda-audit-hero.png and .qa/panda-audit-mobile.png.

EasyTowing now uses an original transparent flatbed/road/hook emblem, concise hero, company-supplied rating and four verified/scoped service facts. The separate arrival block, price-promise row, trust strip and foreground photograph were removed. The existing gallery, service routes, customer-source attribution, provider role and safety/contact information remain. Explicit light/dark appearance is an additional EasyTowing feature, with light as the default.

The reference's raw document is a small empty React shell with generic metadata and no canonical or JSON-LD. EasyTowing keeps its server-rendered content, individual titles/descriptions, correct H1, deployment-aware canonical/schema URLs and approved sitemap. No competitor artwork, unsupported pricing, business identity or claim is copied. Source inspected: https://www.pandatowing.ca/ . See QA_REPORT.md for actual checks and asset documentation for the original emblem prompt.
