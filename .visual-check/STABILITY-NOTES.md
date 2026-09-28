Browser stability changes (2026-09-09)

Removed the remote Framer hydration runtime and its module preloads from the exported pages after Chrome reported React errors 405, 425 and 422. Removed exported global Date/Intl overrides and editor bootstrap. Existing PSE scripts and styles remain in use.

Converted template entrance animation elements to their visible final state. Removed the page-hiding guard and cross-document transition that retained previous-page pixels. Navigation isolation now runs before template handlers and preserves native anchor default actions, including modifier clicks, target and download behavior.

Legacy service-worker cleanup matches the exact site scope and script URL, runs once per document, and no longer claims browser clients. All local JavaScript and stylesheet references resolve.

The old contact form had no standalone submission endpoint. It now opens an email draft addressed to info@pse-consulting.com, clearly labeled in French and English. A configured email application and manual sending are required; no message was sent during testing.

Validation: Chrome loaded all 20 pages with no uncaught JavaScript exceptions, visible bodies and one shared navigation. Confirmed navigation to About, browser Back to Home, mobile menu opening, and uncanceled link default actions. Inspected Home and Contact screenshots. All custom JavaScript passed node --check. See stability.cjs and stability-results.json for the repeatable check and recorded results. Other browser engines and deployed hosting were not tested.
