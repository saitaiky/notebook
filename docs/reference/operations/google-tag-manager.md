# Google Tag Manager implementation runbook

This is the private operational contract for the notebook's analytics setup. The site emits structured events into
`window.dataLayer`; Google Tag Manager owns delivery to GA4. Do not add a second GA4 loader or a second page-view
trigger.

## Current production state

As of 21 August 2026, the production analytics configuration is:

| Setting                  | Value                                    |
| ------------------------ | ---------------------------------------- |
| Production site          | `https://sai-tai.com/`                   |
| GTM web container        | `GTM-57D8HMJV`                           |
| GTM numeric container ID | `261915184`                              |
| Published GTM version    | **2 — Consent-controlled GA4 analytics** |
| GA4 account              | **Sai Notes** (`96998055`)               |
| GA4 property             | **Sai's Notes - GA4** (`320173437`)      |
| GA4 web stream           | `3786262932`                             |
| GA4 measurement ID       | `G-B35TPRVQ3Q`                           |

GTM version 2 is live and contains three tags, two custom-event triggers and 19 user-defined variables. The Default
Workspace had no pending changes immediately after publication. The `0% consent rate` diagnostic is expected at launch:
analytics storage defaults to denied until readers opt in, while advertising consent intentionally remains denied. The
GTM recommendation to add another administrator is an account-recovery recommendation, not an analytics defect.

## Repository and deployment configuration

1. Use the **Web** container `GTM-57D8HMJV` for `sai-tai.com`.
2. The repository defaults to this container ID so normal production builds load GTM without extra deployment
   configuration. `GOOGLE_TAG_MANAGER_ID` remains available as an explicit build-time override.
3. Build the site. A valid GTM ID makes Docusaurus load GTM and omit the direct gtag plugin.
4. Confirm the consent-default script appears before `gtm.js` in generated HTML.

The existing GA4 measurement ID is `G-B35TPRVQ3Q`. The GTM container should send to that property so historical
reporting continues.

The private import artifact is `reference/operations/google-tag-manager-container.json`. Import it into the existing
**Default Workspace**, choose **Merge**, and overwrite conflicting tags, triggers and variables. Review the import diff
before confirming it. The artifact can be regenerated from a fresh GTM workspace export with:

```bash
node scripts/generate-gtm-import.mjs <workspace-export.json> reference/operations/google-tag-manager-container.json
```

## Container tags and triggers

Create a Google tag for `G-B35TPRVQ3Q` with `send_page_view` set to `false`. Fire it on **Initialization – All Pages**.
The repository sends every initial and client-side Docusaurus navigation as an explicit `virtual_page_view`, so an
automatic initial page view or GTM History Change trigger would double-count.

Create a Custom Event trigger named `virtual_page_view`. Use it for a GA4 event tag whose event name is `page_view`,
mapping these data-layer variables:

| Event parameter    | Data-layer variable |
| ------------------ | ------------------- |
| `page_path`        | `page_path`         |
| `page_title`       | `page_title`        |
| `content_group`    | `content_group`     |
| `content_language` | `content_language`  |
| `page_type`        | `page_type`         |

Create one allow-listed behavioural-event trigger matching:

```text
^(code_copy|engaged_read|feedback_submit|graph_expand|page_not_found|search_result_select|select_content|view_search_results)$
```

Use it for a GA4 event tag whose event name is the GTM built-in `{{Event}}` variable. Attach the common page parameters
above plus the applicable optional parameters:

```text
code_language
feedback_helpful
feedback_rating
graph_section
graph_subsection
item_id
minimum_active_seconds
minimum_scroll_percent
missing_path
result_state
search_term
search_term_redacted
source_component
target_section
```

Do not forward `analytics_consent_update` to GA4. It exists for consent-state orchestration and debugging only.

## Consent and privacy controls

The page sets Consent Mode defaults before loading GTM. Analytics storage starts as denied unless the reader previously
chose **Allow analytics**. Advertising storage, ad-user-data and ad-personalisation remain denied even when analytics is
accepted.

The application also suppresses behavioural events until analytics consent is granted. In GTM Preview, confirm that GA4
tags respect the built-in `analytics_storage` consent check. Do not add advertising tags without revising the banner and
privacy page.

The first-choice banner disappears after a reader selects **Decline** or **Allow analytics**; no persistent floating
button is displayed. Readers can review or change the stored choice through **Tools & Docs → Privacy & analytics**.

In GA4 Admin:

- set event-data retention to 14 months;
- define internal/developer traffic filters;
- disable browser-history page views under Enhanced Measurement, while keeping outbound clicks, downloads and the
  built-in 90% scroll event;
- link the matching Search Console property;
- ensure data redaction is enabled where available.

Search terms are trimmed, capped at 80 characters and replaced with `[redacted]` when they resemble an email address,
payment-card number, access token or JWT. Never send feedback text or copied code.

## GA4 definitions and reports

Register event-scoped custom dimensions for:

- `content_group`
- `content_language`
- `page_type`
- `source_component`
- `target_section`
- `result_state`
- `feedback_helpful`

Register `feedback_rating` as a custom metric. Page path and page title are already standard dimensions and should not
consume custom-dimension slots.

Build explorations for content health, landing-to-engaged-read journeys, cross-section navigation, search outcomes,
graph/related-content discovery and 404/negative-feedback investigation. Mark `engaged_read` as a key event only if
meaningful reading is the site's primary outcome.

## Production validation

1. Run a production build with `yarn build`. To test an alternate container, use
   `GOOGLE_TAG_MANAGER_ID=GTM-... yarn build`.
2. Use GTM Preview and Tag Assistant against a deployed preview.
3. Before consent, verify `analytics_storage=denied` and no behavioural event is emitted by the application.
4. Accept analytics and verify exactly one `page_view` for the current route.
5. Navigate between two pages and verify exactly one additional `page_view`.
6. Exercise a related link, graph node, search, code copy, rating and 404.
7. Inspect every payload for unexpected query strings, feedback text or copied content.
8. Publish a named GTM container version only after the DebugView event stream matches this contract.
