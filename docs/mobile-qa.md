# Mobile QA Checklist - Daena Website

## Date: 2025-01-15
## Branch: fix/mobile-1

## Test Devices
- iPhone 12/13/14/15 (Safari and Chrome)
- Android Pixel 7/8 (Chrome)
- Screen widths: 320px - 414px

## Regression Checks (Must Pass)

### ✅ 1. Grid Layout - Single Column on Mobile
**Test:** All multi-card sections stack vertically on mobile (<768px)

**Sections to verify:**
- [ ] Latest Revolutionary Features
- [ ] Security & Compliance
- [ ] Proof & Validation
- [ ] Market Growth Projection stats
- [ ] Compliance & Trust & Governance
- [ ] Measured Performance cards

**Expected:**
- All cards are full width (no side-by-side cards)
- No horizontal scroll
- Cards have proper spacing (1rem gap)

**Before/After Screenshots:**
- [ ] Before: Cards in 2-3 columns causing overflow
- [ ] After: All cards stacked vertically

---

### ✅ 2. Vertical Ribbons - Hidden on Mobile
**Test:** No vertical text labels visible on mobile

**Sections to verify:**
- [ ] Latest Revolutionary Features (no "Abstract + Lossless Pattern" vertical text)
- [ ] Security & Compliance (no left spine text)
- [ ] Trust & Governance Pipeline (no vertical labels)

**Expected:**
- Vertical ribbons completely hidden (`display: none !important`)
- Mobile badges shown above cards instead
- No text outside card borders

**Before/After Screenshots:**
- [ ] Before: Vertical text breaking awkwardly
- [ ] After: Clean horizontal badges at top of cards

---

### ✅ 3. Text Wrapping & No Clipping
**Test:** All text is readable, no clipped content

**Sections to verify:**
- [ ] All card titles (no "N B M F" vertical shards)
- [ ] All paragraphs wrap correctly
- [ ] Lists align properly with bullets

**Expected:**
- Headings use `word-break: keep-all`
- Text uses `overflow-wrap: anywhere`
- No fixed heights cutting off text
- Line height: 1.35 for readability

**Before/After Screenshots:**
- [ ] Before: Text broken into single letters
- [ ] After: Text wraps naturally

---

### ✅ 4. Stray † Markers - Removed/Converted
**Test:** No stray dagger characters visible

**Sections to verify:**
- [ ] Performance/Accuracy cards
- [ ] All sections with footnotes

**Expected:**
- All † characters are inside `<sup><a>` tags linking to methods page
- No raw † characters in text
- Footnotes properly styled

**Before/After Screenshots:**
- [ ] Before: Stray † characters visible
- [ ] After: Clean footnote links

---

### ✅ 5. Pill Tabs - Horizontal Scroll
**Test:** "Latest Revolutionary Features" pill row scrolls smoothly

**Section:** Latest Revolutionary Features (chip-scroll)

**Expected:**
- Horizontal scroll enabled
- No clipping
- Smooth scrolling with `-webkit-overflow-scrolling: touch`
- Scrollbar hidden

**Before/After Screenshots:**
- [ ] Before: Pills cut off or wrapping awkwardly
- [ ] After: Smooth horizontal scroll

---

### ✅ 6. Back to Top Button - No Overlap
**Test:** Button doesn't cover content

**Expected:**
- Fixed position: `right: 16px; bottom: calc(16px + env(safe-area-inset-bottom))`
- `z-index: 50`
- Content has `padding-bottom: 96px` on mobile
- Button never covers text or charts

**Before/After Screenshots:**
- [ ] Before: Button overlapping content
- [ ] After: Button floats above, content has padding

---

### ✅ 7. Market Growth Chart - Numbers Visible
**Test:** Chart numbers are clearly visible on mobile

**Section:** AI Market Growth Section

**Expected:**
- Bar values ($25B, $45B, etc.) are large and readable
- Gold color with dark background for contrast
- Years (2020, 2021, etc.) are visible
- Chart scrolls horizontally if needed
- Bar width: `clamp(45px, 12vw, 60px)`

**Before/After Screenshots:**
- [ ] Before: Numbers too small or cut off
- [ ] After: Large, readable numbers with good contrast

---

### ✅ 8. Images & Charts - Responsive
**Test:** All images and charts fit within viewport

**Sections to verify:**
- [ ] Market Growth Chart
- [ ] All feature icons
- [ ] Any diagrams or visualizations

**Expected:**
- `max-width: 100%`
- `height: auto`
- `object-fit: contain`
- No horizontal scroll

**Before/After Screenshots:**
- [ ] Before: Images overflowing viewport
- [ ] After: All images fit properly

---

### ✅ 9. Headings & Fonts - Fluid Sizing
**Test:** All headings scale properly

**Expected:**
- `h2, .section-title`: `clamp(20px, 5vw, 28px)`
- `h3`: `clamp(18px, 4.5vw, 24px)`
- `p, li`: `clamp(14px, 4.2vw, 17px)`

**Before/After Screenshots:**
- [ ] Before: Fixed sizes causing overflow
- [ ] After: Fluid sizing adapts to screen

---

### ✅ 10. No Horizontal Scroll
**Test:** Entire page fits within viewport width

**Expected:**
- No horizontal scrollbar on any page
- All content within 320px - 414px width
- Cards don't overflow

**Before/After Screenshots:**
- [ ] Before: Horizontal scroll present
- [ ] After: No horizontal scroll

---

## Performance Checks

### Lighthouse Mobile Score
- [ ] Performance: ≥ 80
- [ ] Accessibility: ≥ 90
- [ ] Best Practices: ≥ 90
- [ ] SEO: ≥ 90

### CLS (Cumulative Layout Shift)
- [ ] CLS < 0.02 (no layout shift)

---

## Notes

### Known Issues (if any)
- None

### Additional Improvements Made
- Added `prefers-reduced-motion` support
- Improved safe-area-inset handling for notched devices
- Enhanced chart number visibility with better contrast
- Fixed anchor scroll offsets for sticky header

---

## Sign-off

**Tester:** _________________  
**Date:** _________________  
**Status:** ☐ Pass ☐ Fail  
**Notes:** _________________





