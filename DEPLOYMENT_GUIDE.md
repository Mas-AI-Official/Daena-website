# Daena Website Deployment Guide

## 🚀 Quick Deployment

### Prerequisites
- Git installed
- Node.js and npm installed (for scripts)
- GitHub account with repository access

### Deployment Steps

1. **Clone the repository** (if not already cloned):
   ```bash
   git clone https://github.com/Mas-AI-Official/Daena-website.git
   cd Daena-website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Test the site locally**:
   - Open `index.html` in a browser
   - Or use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (if http-server is installed)
     npx http-server -p 8000
     ```

4. **Run tests**:
   ```bash
   npm run test:mobile
   ```

5. **Deploy to GitHub Pages**:
   - Push changes to `main` branch
   - GitHub Pages will automatically deploy
   - Site will be available at: `https://mas-ai-official.github.io/Daena-website/`

## 📁 File Structure

```
daena-website/
├── index.html                    # Main homepage
├── overview.html                 # Technology overview
├── for-developers.html           # Developer resources
├── technical.html                # Benchmarks & technical specs
├── pitch-deck-presentation.html  # Interactive pitch deck
├── assets/
│   └── css/
│       └── utilities.css         # Mobile utilities
├── css/
│   └── globals.css               # Global styles
├── templates/
│   └── partials/
│       └── daena/                # HTMX partials
├── public/
│   ├── fig/
│   │   └── daena/                # SVG figures
│   └── notes/
│       └── metrics.json          # Footnote data
├── scripts/
│   ├── pdf_to_svg.mjs            # PDF extraction script
│   └── test-mobile-accessibility.mjs  # Test script
└── package.json                  # NPM scripts
```

## 🔧 Available Scripts

### Extract SVGs from PDF
```bash
npm run extract:pdf
```
**Note**: Requires pdf2svg, inkscape, or imagemagick installed.

### Test Mobile & Accessibility
```bash
npm run test:mobile
```

## 📱 Mobile Testing

### Test on Real Devices
1. Use browser DevTools device emulation
2. Test on actual mobile devices
3. Test in different orientations (portrait/landscape)

### Key Test Points
- ✅ Viewport meta tag present
- ✅ Text doesn't overflow
- ✅ Touch targets are 44px minimum
- ✅ Images load with lazy loading
- ✅ Videos work on mobile
- ✅ Navigation is accessible

## ♿ Accessibility Testing

### Manual Checks
1. **Keyboard Navigation**: Tab through all interactive elements
2. **Screen Reader**: Test with NVDA/JAWS/VoiceOver
3. **Color Contrast**: Use browser DevTools accessibility panel
4. **Focus Indicators**: Ensure all focusable elements have visible focus styles

### Automated Testing
```bash
npm run test:mobile
```

## 🎨 Design System

### Color Palette
- Primary Gold: `#FFD700`
- Secondary Cyan: `#00bcd4`
- Dark Background: `#0f0f23`
- Text Light: `#ffffff`
- Text Muted: `#b0b0b0`

### Typography
- Font Family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Responsive sizing with `clamp()`

### Breakpoints
- Mobile: `≤640px`
- Tablet: `641px - 1024px`
- Desktop: `>1024px`

## 📊 Performance Optimization

### Image Optimization
- All images use `loading="lazy"`
- SVGs are optimized with svgo
- Images are properly sized

### CSS Optimization
- Critical CSS inlined
- Non-critical CSS loaded asynchronously
- Minimal inline styles

### JavaScript
- Minimal JavaScript usage
- No heavy frameworks
- Progressive enhancement

## 🔍 SEO Considerations

### Meta Tags
- Title tags on all pages
- Meta descriptions
- Open Graph tags
- Twitter Card tags

### Structured Data
- JSON-LD schema on homepage
- Organization schema
- SoftwareApplication schema

## 🐛 Troubleshooting

### Images Not Loading
- Check file paths (case-sensitive)
- Verify images exist in correct directories
- Check browser console for errors

### Videos Not Playing
- Verify video files exist
- Check video codec compatibility
- Ensure `playsinline` attribute is present

### Styles Not Applying
- Clear browser cache
- Check CSS file paths
- Verify CSS files are loaded

### Mobile Issues
- Test viewport meta tag
- Check media queries
- Verify touch target sizes

## 📝 Maintenance

### Adding New Pages
1. Create HTML file in root
2. Include global CSS
3. Match design system
4. Test mobile responsiveness
5. Run accessibility tests

### Updating Content
1. Edit HTML files directly
2. Update partials if using HTMX
3. Test changes locally
4. Commit and push

### Updating Figures
1. Run `npm run extract:pdf` (if tools installed)
2. Or manually add SVGs to `public/fig/daena/`
3. Update `manifest.json` if needed

## 🔐 Security

### Best Practices
- No sensitive data in client-side code
- Use HTTPS for deployment
- Validate all user inputs (if forms added)
- Keep dependencies updated

## 📚 Additional Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

## ✅ Pre-Deployment Checklist

- [ ] All pages tested locally
- [ ] Mobile responsiveness verified
- [ ] Accessibility tests passed
- [ ] Images optimized and loading
- [ ] Videos working correctly
- [ ] Links tested
- [ ] Meta tags present
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Cross-browser tested

## 🎉 Ready to Deploy!

Once all checks pass, push to GitHub and your site will be live!
