# Google measurement setup

Updated November 3, 2026. Integration is implemented; live Google destination IDs have not been supplied. Tracking stays off until real account values are configured. The Privacy page reads the same configuration as the integration.

## Account values

In the repository's **Settings → Secrets and variables → Actions → Variables**, configure these public identifiers:

| Repository variable | Value from your account |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_TAG_ID` | GA4 web stream Measurement ID, beginning `G-` |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Google Ads tag/conversion ID, beginning `AW-` |
| `NEXT_PUBLIC_GOOGLE_ADS_PHONE_LABEL` | Conversion label for website phone-link taps |
| `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL` | Conversion label for delivered service enquiries |
| `GOOGLE_SITE_VERIFICATION` | Optional Search Console HTML verification token |

These are public tag settings, not credentials. Never provide passwords, OAuth tokens or private API keys. Copy labels exactly, without the `AW-…/` prefix. GA4 and Ads can be configured independently; a missing label disables its Ads conversion event. Re-run the Pages workflow after changing variables: static builds compile these values at build time. Preview builds stay disabled regardless of IDs. Owner approval for the requested optional integration is recorded in `config/launch.json`.

## Events and account settings

| Action | GA4 after usage consent | Ads after ad-measurement consent |
| --- | --- | --- |
| Page or internal route opened | `page_view` | No conversion |
| Phone link tapped | `phone_link_click` | Phone-tap action if label configured |
| Formspree confirms delivery | `generate_lead` | Enquiry action if label configured |
| Failed/invalid form or security challenge | No lead event | No conversion |

Phone taps must be **secondary micro-conversions**, not answered calls or bookings. Treat raw form enquiries as secondary while establishing qualification. Set lead actions to count one per ad interaction where appropriate. Completed jobs and revenue require verified call-centre/CRM integration; this frontend does not infer outcomes or invent conversion values.

Use direct Ads events **or** equivalent GA4 imports for each action, to avoid double counting. Code does not change campaigns, bidding or account settings.

In the GA4 web stream, disable **Enhanced measurement**, including automatic history page views, outbound clicks and form interaction collection. This application sends explicit events; automatic collection can duplicate views and collect unreviewed form/link information. Keep Google Signals, enhanced conversions, user-provided data collection and personalised ads off. Review any other destinations/tags connected in the Google account before activation.

## Consent and data

Basic consent mode blocks Google scripts/requests until an opt-in. Analytics and ad measurement have separate unchecked controls. Calls and forms work after Decline. Privacy choices are available at the bottom of each page; preferences last for the current tab session. Blocked storage still permits a choice for the current document.

Application events exclude form values, URL queries and fragments. External referrers are reduced to their origin. After ad consent, Google's tag may use advertising identifiers and cookies for attribution. The application does not persist UTMs/click IDs, implement remarketing or send enhanced-conversion contact data. Withdrawal stops application events and updates Google's consent state; declining all attempts to remove accessible first-party measurement cookies. It cannot retract previously transmitted information.

## Verification

1. Add actual IDs/labels, check the account settings above and rebuild Pages.
2. In a fresh tab, verify no Google requests before a choice; decline and verify contact access.
3. Opt into Analytics only. Check page/contact events with no Ads destination configured by the application.
4. Opt into Ad measurement. Use Tag Assistant to inspect labelled conversions; keep phone taps secondary. Arrange any real enquiry test with dispatch.
5. Withdraw consent, check events stop, then test small phones, route changes and both themes.
6. Check GA4 DebugView/Realtime and Ads diagnostics in the owner accounts. Mock tests cannot prove account receipt, attribution, campaign performance or legal compliance.

Run `npm.cmd test` and, with a server running, `npm.cmd run test:tracking` (`TEST_ORIGIN` overrides localhost). Browser tests intercept Google and Formspree. Without IDs they verify inactive state and matching privacy copy. To test active paths, run a separate production-mode dev server with test-only valid-format IDs/labels and set `EXPECT_TRACKING=1` for the browser suite. Never deploy test IDs. Screenshots go into ignored `.qa/`.

Official references: [consent implementation](https://developers.google.com/tag-platform/security/guides/consent), [manual page views](https://developers.google.com/analytics/devguides/collection/ga4/views), [conversion events](https://developers.google.com/tag-platform/devguides/conversions), [lead events](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#generate_lead), [Tag Assistant](https://developers.google.com/tag-platform/security/guides/consent-debugging).
