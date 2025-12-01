# Changelog

## 2025-01-15 – Mobile fix pack shipped

### Fixed
- **Grid Layouts**: All multi-column grids now stack to single column on mobile (<640px)
  - Added `!important` override for all `repeat()` grid patterns on mobile
  - Applied responsive classes to Security & Compliance, Proof & Validation, and all feature sections
  - Cards now use `width: 100%; max-width: 100%` on mobile

- **Vertical Rails**: Completely hidden on mobile (<640px)
  - Rails hidden with `display: none !important` on mobile
  - Mobile badges shown instead above each card
  - Applied to Security & Compliance (AES-256, Audit Trails, etc.)

- **Chip Scroll**: Converted to vertical stack on mobile
  - Latest Revolutionary Features chips now stack vertically on mobile
  - Horizontal scroll/wrap on tablet+ (≥768px)
  - Chips don't push under content

- **Back to Top Button**: Fixed overlap issues
  - Changed to `position: sticky` with safe-area padding
  - Added `bottom: max(16px, env(safe-area-inset-bottom))`
  - Body padding: `max(96px, env(safe-area-inset-bottom))` on mobile
  - Button scales to 0.92 on mobile (<640px)
  - Added bottom spacer div for mobile

- **Text Overflow**: Fixed all text clipping
  - Applied `overflow-wrap: anywhere; word-break: normal; hyphens: auto` to all cards
  - Removed all fixed widths/heights from cards
  - Added `min-width: 0; height: auto` to prevent flex/grid overflow
  - Typography uses `clamp()` for fluid scaling

- **Typography**: Improved mobile readability
  - h2: `clamp(1.15rem, 2.5vw, 1.75rem)` with `text-wrap: balance`
  - p, li: `clamp(0.95rem, 2vw, 1.05rem)` with `line-height: 1.55`
  - All headings have proper word wrapping

- **Images & Charts**: Fully responsive
  - All images/charts use `max-width: 100%; width: 100%; object-fit: contain`
  - Chart containers have `overflow-x: auto` for horizontal scroll if needed

- **Security & Compliance Section**: Mobile-optimized
  - Applied responsive grid classes
  - Added mobile badges for all cards
  - Removed vertical rails on mobile
  - Cards stack one per row on mobile

- **Proof & Validation Section**: Mobile-optimized
  - All nested grids use responsive classes
  - Metric boxes stack properly on mobile
  - Removed fixed padding, uses responsive padding

### Changed
- **Breakpoint**: Changed mobile breakpoint from 768px to 640px for better iPhone support
- **Chip Scroll**: Changed from horizontal scroll to vertical stack on mobile
- **Back to Top**: Changed from `fixed` to `sticky` with safe-area support

### Added
- Mobile badges for Security & Compliance cards
- Bottom spacer div for mobile to prevent button overlap
- CSS overrides for all `repeat()` grid patterns on mobile
- `text-wrap: balance` for headings (where supported)

### Removed
- Fixed pixel widths from card containers
- Fixed heights from cards
- Vertical rails on mobile
