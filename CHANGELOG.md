# Changelog - Mobile-First Fixes & Cross-Browser Compatibility

## 2025-01-15

### Fixed
- **Viewport Meta Tags**: Updated all pages to use `width=device-width, initial-scale=1, viewport-fit=cover` (removed `maximum-scale` and `user-scalable` for better mobile behavior)
- **Text Truncation**: Fixed text truncation on mobile by:
  - Adding `overflow-wrap: anywhere` and `word-break: break-word` globally
  - Preventing `writing-mode: vertical` for body copy
  - Ensuring all text containers use `white-space: normal`
  - Removing `text-overflow: ellipsis` that was clipping text
- **Date Formats**: Fixed all `.md` files to use ISO 8601 format with front-matter:
  - `docs/BENCHMARK_RESULTS.md`: Added front-matter with `date: 2025-01-15`
  - `docs/NBMF_ENTERPRISE_DNA_ADDENDUM.md`: Added front-matter
  - `METATRON_UPDATE.md`: Added front-matter
  - `FINAL_UPDATE_COMPLETE.md`: Added front-matter
  - `WEBSITE_UPDATES_COMPLETE.md`: Added front-matter
- **Mobile Layout**: 
  - Fixed grid layouts to stack to single column on mobile (`grid-template-columns: 1fr`)
  - Fixed flex containers to wrap properly
  - Fixed metric boxes to stack vertically on mobile
  - Removed fixed widths/heights, replaced with responsive containers
- **Navigation**: 
  - Added anchor IDs for sub-sections (`#what-it-is`, `#why-it-wins`)
  - Added smooth scroll behavior for anchor links
  - Added sticky "Back to Top" button
  - Fixed "Back to For Developers" links on deep-dive pages
- **Cross-Browser**: 
  - Added `-webkit-text-size-adjust`, `-moz-text-size-adjust`, `-ms-text-size-adjust`
  - Added fluid type scale using CSS `clamp()`
  - Fixed Safari flex/grid issues
- **Accessibility**: 
  - Added `aria-label` to charts and visualizations
  - Ensured proper heading hierarchy
  - Added responsive font sizes with `clamp()`
- **Images & Media**: 
  - Added `max-width: 100%; height: auto;` to all images and videos
  - Added `loading="lazy"` support

### Changed
- **Memory & Governance Section**: Already unified into single hero section with sub-sections
- **Agent Count**: Updated from "48 agents" to "48+ agents" to include council expert agents
- **Back Links**: Changed from "Back to Memory & Governance Engine" to "Back to For Developers"

### Removed
- Removed `maximum-scale=5.0` and `user-scalable=yes` from viewport (better mobile UX)
- Removed any `writing-mode: vertical` for body text
- Removed fixed pixel widths that caused horizontal scroll

### Added
- Fluid type scale CSS variables (`--step--1` through `--step-3`)
- Global mobile fixes for text wrapping
- Responsive breakpoints (sm: 360-480px, md: 768px, lg: 1024px, xl: 1280px+)
- Back-to-top button with smooth scroll
- Smooth scroll behavior for all anchor links

