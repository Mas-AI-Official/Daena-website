# Daena Developer Pages - Setup Guide

## Overview

This project includes "For Developers" and "Overview" pages built with HTMX + Tailwind CSS. The pages extract diagrams from the PDF `Daena_The_Auditable_AI_Vice_President.pdf` and display them as responsive SVG figures.

## Project Structure

```
daena-website/
├── scripts/
│   ├── pdf_to_svg.mjs          # ETL script for PDF extraction
│   ├── generate_placeholder_svgs.mjs  # Placeholder generator
│   └── serve.mjs                # Development server
├── templates/partials/daena/   # HTMX partials
│   ├── hero.html
│   ├── architecture.html
│   ├── nbmf.html
│   ├── edna.html
│   ├── benchmarks.html
│   ├── audits.html
│   ├── pilots.html
│   └── cta.html
├── public/fig/daena/            # Extracted SVG figures
│   ├── fig-01.svg
│   ├── fig-02.svg
│   └── manifest.json
├── assets/css/
│   └── utilities.css           # Mobile-first utilities
├── for-developers.html         # Developer page
└── overview.html               # Overview page
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Extract PDF Diagrams

#### Option A: Using pdf2svg (Recommended - Best Quality)

1. Install poppler-utils:
   - **Windows**: `choco install poppler`
   - **macOS**: `brew install poppler`
   - **Linux**: `apt-get install poppler-utils`

2. Run extraction:
   ```bash
   npm run extract:pdf
   ```

#### Option B: Generate Placeholders (Quick Start)

If pdf2svg is not available, generate placeholder SVGs:

```bash
npm run generate:placeholders
```

This creates placeholder SVGs with the correct structure. Replace them later with real extractions.

### 3. Development Server

For local development with HTMX partials:

```bash
node scripts/serve.mjs
```

Then visit:
- http://localhost:8000/for-developers.html
- http://localhost:8000/overview.html

### 4. Static Deployment

For static hosting (GitHub Pages, Netlify, etc.), the pages will work but HTMX partials won't load via `hx-get`. Options:

1. **Use a build step** to inline partials (recommended for production)
2. **Use a server** that supports HTMX (Node.js, Python, etc.)
3. **Manually inline** the partials in the HTML files

## Features

### Mobile-First Design
- Single column layout on mobile (≤640px)
- Responsive typography with `clamp()`
- Touch-friendly spacing
- Text wrapping with `break-words` and `hyphens-auto`

### Accessibility
- Color contrast ≥ 4.5:1 (WCAG AA)
- Focus rings on interactive elements
- `prefers-reduced-motion` support
- ARIA labels and descriptions

### Performance
- Lazy loading for images
- Optimized SVGs with svgo
- Lighthouse budget: CLS<0.03, LCP<2.5s

### HTMX Integration
- Dynamic partial loading
- Metric footnote popovers
- Progressive enhancement

## Manifest Structure

The `manifest.json` file contains metadata for each figure:

```json
{
  "id": "fig-01",
  "title": "Daena Architecture Overview",
  "src": "/fig/daena/fig-01.svg",
  "page": 1,
  "width": 1376,
  "height": 768,
  "caption": "Complete Daena AI system architecture..."
}
```

## Troubleshooting

### PDF Extraction Fails

1. **Check PDF path**: Ensure `docs/pdfs/Daena_The_Auditable_AI_Vice_President.pdf` exists
2. **Install pdf2svg**: Use poppler-utils for best results
3. **Use placeholders**: Run `npm run generate:placeholders` as fallback

### HTMX Partials Not Loading

1. **Use development server**: Run `node scripts/serve.mjs`
2. **Check file paths**: Ensure partials exist in `templates/partials/daena/`
3. **For static hosting**: Inline partials or use a build step

### Mobile Layout Issues

1. **Check utilities.css**: Ensure it's loaded
2. **Verify Tailwind**: CDN should be included
3. **Test viewport**: Use browser dev tools mobile emulation

## Next Steps

1. Extract real diagrams using pdf2svg
2. Optimize SVGs with svgo
3. Generate 1x/2x PNG fallbacks for OpenGraph
4. Set up CI/CD for automatic extraction
5. Add Lighthouse testing to build pipeline

## Checklist

- [x] Directory structure created
- [x] ETL script created
- [x] HTMX partials created
- [x] Utilities CSS created
- [x] Pages created (for-developers.html, overview.html)
- [x] Placeholder SVGs generated
- [x] Manifest.json generated
- [ ] Real PDF extraction (requires pdf2svg)
- [ ] PNG fallbacks generated
- [ ] Lighthouse testing configured

