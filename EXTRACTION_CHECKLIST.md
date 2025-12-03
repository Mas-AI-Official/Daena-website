# PDF Extraction Checklist

## Status: Placeholder SVGs Generated ✅

### Completed
- ✅ Directory structure created
- ✅ ETL script (`pdf_to_svg.mjs`) created
- ✅ Placeholder generator script created
- ✅ 13 placeholder SVGs generated
- ✅ Manifest.json created with all figure metadata
- ✅ HTMX partials created
- ✅ Developer pages created
- ✅ Utilities CSS with mobile fixes

### Pending: Real PDF Extraction

The ETL script requires `pdf2svg` (poppler-utils) for proper extraction. Current status:

**Failed Pages:** All 13 pages (pdf2svg not installed)

**Reason:** pdf2svg not found in PATH. The fallback method (pdfjs-dist + canvas) requires native bindings that may not work on Windows without additional setup.

### Next Steps

1. **Install poppler-utils:**
   ```bash
   # Windows (using Chocolatey)
   choco install poppler
   
   # macOS (using Homebrew)
   brew install poppler
   
   # Linux (Ubuntu/Debian)
   sudo apt-get install poppler-utils
   ```

2. **Run extraction:**
   ```bash
   npm run extract:pdf
   ```

3. **Verify extraction:**
   - Check `public/fig/daena/` for SVG files
   - Verify `manifest.json` is updated
   - Test pages load correctly

4. **Optimize SVGs:**
   The script automatically runs svgo optimization, but you can manually optimize:
   ```bash
   npx svgo -f public/fig/daena/
   ```

### Alternative: Manual Extraction

If pdf2svg installation fails, you can manually extract pages:

```bash
# Extract single page
pdf2svg "docs/pdfs/Daena_The_Auditable_AI_Vice_President.pdf" "public/fig/daena/fig-01.svg" 1

# Extract all pages (bash script)
for i in {1..13}; do
  pdf2svg "docs/pdfs/Daena_The_Auditable_AI_Vice_President.pdf" "public/fig/daena/fig-$(printf '%02d' $i).svg" $i
done
```

### Figure Mapping

| Figure ID | Page | Title | Status |
|-----------|------|-------|--------|
| fig-01 | 1 | Daena Architecture Overview | ⚠️ Placeholder |
| fig-02 | 2 | Sunflower-Honeycomb Memory Architecture | ⚠️ Placeholder |
| fig-03 | 3 | NBMF L1/L2/L3 Architecture | ⚠️ Placeholder |
| fig-04 | 4 | Enterprise DNA (eDNA) Structure | ⚠️ Placeholder |
| fig-05 | 5 | Performance Benchmarks | ⚠️ Placeholder |
| fig-06 | 6 | Merkle Lineage & Audit Trail | ⚠️ Placeholder |
| fig-07 | 7 | Pilot ROI Metrics | ⚠️ Placeholder |
| fig-08 | 8 | Cost Analysis Dashboard | ⚠️ Placeholder |
| fig-09 | 9 | Security & Compliance Framework | ⚠️ Placeholder |
| fig-10 | 10 | Multi-Agent Communication Flow | ⚠️ Placeholder |
| fig-11 | 11 | Model Switching Architecture | ⚠️ Placeholder |
| fig-12 | 12 | ABAC Governance Model | ⚠️ Placeholder |
| fig-13 | 13 | Real-time Voice Pipeline | ⚠️ Placeholder |

### Notes

- Placeholder SVGs are functional and display correctly
- They include proper dimensions and metadata
- Replace with real extractions when pdf2svg is available
- All partials and pages are ready to use once real SVGs are extracted

