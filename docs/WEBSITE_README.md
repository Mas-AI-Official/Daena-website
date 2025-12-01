# Daena Website - Development Guide

## Date: 2025-01-15

## Quick Start

### Local Development

1. **Serve the site locally:**
   ```bash
   # Using Python (if available)
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server . -p 8000
   
   # Using Vite (if configured)
   npm run serve
   ```

2. **Open in browser:**
   - Navigate to `http://localhost:8000`

### Testing

#### Lighthouse Testing

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run mobile audit
lighthouse http://localhost:8000 --preset=mobile --output=json --output-path=./reports/mobile.json

# Run desktop audit
lighthouse http://localhost:8000 --preset=desktop --output=json --output-path=./reports/desktop.json
```

#### Visual Regression Testing (Playwright)

```bash
# Install Playwright
npm install -D @playwright/test

# Run tests
npm run test:ui
```

#### Manual Testing Checklist

- [ ] Test on iOS Safari (375×812)
- [ ] Test on Android Chrome (412×915)
- [ ] Test on Desktop Chrome (responsive mode)
- [ ] Test on Firefox
- [ ] Test on Edge
- [ ] Verify no horizontal scroll
- [ ] Verify all images load
- [ ] Verify all links work
- [ ] Verify back-to-top button appears after scrolling
- [ ] Verify smooth scroll works (or disabled if prefers-reduced-motion)
- [ ] Verify no console errors

## Project Structure

```
daena-website/
├── css/
│   └── globals.css          # Global mobile-first CSS
├── docs/
│   ├── BENCHMARK_RESULTS.md
│   ├── CLAIMS.md            # Claims & metrics documentation
│   ├── WEBSITE_README.md    # This file
│   └── SITE_QA_REPORT.md    # QA report
├── index.html               # Main landing page
├── nbmf.html               # NBMF deep-dive
├── enterprise-dna.html     # Enterprise-DNA deep-dive
├── tech/
│   └── methods-and-reproducibility.html
└── security-and-compliance.html
```

## CSS Architecture

### Global CSS (`css/globals.css`)

- **Breakpoints**: `--bp-sm: 480px`, `--bp-md: 768px`, `--bp-lg: 1024px`
- **Fluid Type**: Uses `clamp()` for responsive typography
- **Utility Classes**: `.rail`, `.chip-scroll`, `.grid-cards`, `.card`, `.metric`
- **Safe Area**: Supports iOS Safari safe-area insets

### Key Features

1. **Mobile-First**: All styles start mobile, then enhance for larger screens
2. **No Hyphenation**: Disabled forced hyphenation on mobile
3. **Responsive Grids**: 1-col <768px, 2-col ≥768px, 3-col ≥1024px
4. **Accessibility**: Respects `prefers-reduced-motion`, proper focus styles
5. **Performance**: Lazy loading for images, optimized CSS

## Component Patterns

### Rail Component (Vertical Labels → Horizontal Chips)

```html
<!-- Desktop: Vertical rail -->
<!-- Mobile: Horizontal scrollable chips -->
<div class="rail chip-scroll no-hyphens">
    <span>NBMF Memory System</span>
    <span>Hex-Mesh Communication</span>
    <!-- ... -->
</div>
```

### Card Grids

```html
<div class="grid-cards">
    <div class="card">...</div>
    <div class="card">...</div>
</div>
```

### Back to Top Button

```html
<a href="#" id="backToTop" class="back-to-top" aria-label="Back to top">
    ↑ Back to Top
</a>
```

## Content Guidelines

### Claims & Metrics

- All numerical claims must have a `†` footnote
- Footnotes must link to `/tech/methods-and-reproducibility`
- Unverified claims should have `data-claim="needs-source"` attribute
- See `docs/CLAIMS.md` for full list of claims and sources

### Sensitive Information

- **Never commit**: API keys, tokens, credentials, private emails
- **Allowed**: Public contact email (masoud.masoori@mas-ai.co)
- **Scan before commit**: Run `grep -r "api.*key\|secret\|token\|bearer" . --exclude-dir=node_modules`

### Back Links

- Use `history.back()` when coming from same domain
- Use anchor links (`#section-id`) for cross-page navigation
- Always provide fallback anchor link

## Performance Targets

- **Lighthouse Mobile**: ≥ 90
- **Lighthouse Desktop**: ≥ 90
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FCP (First Contentful Paint)**: < 1.8s
- **LCP (Largest Contentful Paint)**: < 2.5s
- **No horizontal scrollbars**

## Browser Support

- iOS Safari 17+
- Android Chrome (latest)
- Desktop Chrome (latest)
- Desktop Firefox (latest)
- Desktop Edge (latest)
- Desktop Safari (latest)

## Accessibility

- **WCAG AA**: Minimum contrast ratio 4.5:1
- **Keyboard Navigation**: All interactive elements accessible
- **Screen Readers**: Proper ARIA labels for icon-only buttons
- **Reduced Motion**: Respects `prefers-reduced-motion`

## Deployment

1. **Build/Test Locally**: Run all tests and Lighthouse audits
2. **Commit Changes**: Use conventional commits (`feat:`, `fix:`, `chore:`)
3. **Push to GitHub**: Changes auto-deploy (if CI/CD configured)
4. **Verify Production**: Test on live site

## Troubleshooting

### Text Breaking on Mobile

- Check for `hyphens: auto` → change to `hyphens: none`
- Check for `word-break: break-word` → change to `word-break: normal`
- Add `overflow-wrap: anywhere` to container

### Horizontal Scroll

- Check for fixed widths: `width: 500px` → use `max-width: 100%`
- Check for negative margins
- Use `overflow-x: hidden` on body (last resort)

### Images Not Responsive

- Add `max-width: 100%; height: auto;` to images
- Use `loading="lazy"` for below-fold images
- Provide `srcset` for different resolutions

### Back-to-Top Button Overlapping

- Use `position: sticky` instead of `fixed`
- Add safe-area insets: `bottom: calc(16px + var(--safe-bottom))`
- Reduce z-index if needed

## Resources

- [MDN - CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [MDN - clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
- [Web.dev - Responsive Images](https://web.dev/fast/#optimize-your-images)
- [A11y Project](https://www.a11yproject.com/)

