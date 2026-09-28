# Loading improvements — 2026-09-11

- Converted four photographic PNG hero assets to WebP at the original dimensions (quality 90). Originals retained. Combined asset size: 5,841,103 bytes to 349,250 bytes, a 94% reduction.
- Extracted large inline template styles into 11 reusable CSS files, retaining stylesheet order and resolving relative asset paths. Across 18 HTML files, combined HTML size fell from 6,652,430 to 3,959,380 bytes (40%). Styles still download on the first visit, then can be reused from the browser cache.
- Background canvas animation now pauses when its section is outside the viewport, as well as when the browser tab is hidden.
- Updated CSS and script version references to request revised files.

Validation: all 30 JavaScript files pass syntax checks; stylesheet paths verified across 20 HTML files; desktop/mobile navigation checks passed. See site-audit.json for the final responsive/browser audit, html-optimization.json for page sizes, and image-optimization.json for asset sizes.

Local timing results do not guarantee the same performance on public hosting. Original PNG assets remain available if a higher-quality export is needed.
