# Website review — 2026-09-11

Reviewed the main pages at 1440, 1000, 390 and 320 CSS pixels, plus all 12 article/profile pages at desktop and mobile widths: 52 page/viewport checks across 19 pages.

Fixed:
- References footer overflow at tablet width by allowing the footer row to wrap and sizing its container within the viewport.
- Contact address cards disappearing on tablet/mobile: mount the same cards in every exported responsive variant, with unique IDs and language updates for all variants.
- Contact-hours updater repeatedly rewriting identical HTML and triggering its own observer.
- Heading reveal movement briefly overlapping nearby paragraphs: retain the fade, remove vertical displacement.
- Missing French translations for the current About mission paragraphs.
- Updated resource versions so browsers request the revised assets.

Validation:
- 30 JavaScript files passed Node syntax checks.
- 52 page/viewport checks passed: no detected text-box overlaps, page-wide horizontal overflow, broken visible images, unloaded stylesheets or runtime exceptions.
- 18 checks passed for French/English switching, responsive contact cards, 12 team portraits, and required-field form validation. No form was submitted.
- All 9 distinct visible local-link targets found in the main-page audit exist.
- Main-page DOM readiness on the local server with cache disabled: 188–818 ms in the final layout run. This is not a public-hosting benchmark or full image-load time.

Evidence: main-audit-results.json, detail-audit-results.json, interaction-audit.json, navigation-loading-results.json, and audit-*.png in this folder.

Limits: checked local Chrome, not live hosting or physical Safari/Firefox devices. The mobile navigation is horizontally scrollable by design. Automated overlap checks cover visible text boxes; they are supplemented by selected screenshots, not an exhaustive visual review of every animation frame.
