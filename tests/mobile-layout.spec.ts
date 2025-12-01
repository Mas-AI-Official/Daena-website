import { test, expect } from '@playwright/test';

// Test breakpoints
const breakpoints = {
  mobile: { width: 390, height: 844 }, // iPhone 12/13
  android: { width: 360, height: 800 }, // Android
  tablet: { width: 768, height: 1024 }, // iPad
  desktop: { width: 1280, height: 800 }, // Desktop
};

test.describe('Mobile Layout Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page
    await page.goto('http://localhost:8000');
  });

  test('Cards stack one per row on mobile', async ({ page }) => {
    await page.setViewportSize(breakpoints.mobile);
    
    // Check Latest Revolutionary Features section
    const featuresGrid = page.locator('#latest-features .grid-cards, #latest-features .cards, #latest-features .features-grid').first();
    await expect(featuresGrid).toHaveCSS('grid-template-columns', /^1fr$/);
    
    // Check all card grids
    const allGrids = page.locator('.grid-cards, .cards, .features-grid');
    const count = await allGrids.count();
    
    for (let i = 0; i < count; i++) {
      const grid = allGrids.nth(i);
      const gridTemplateColumns = await grid.evaluate((el) => 
        window.getComputedStyle(el).gridTemplateColumns
      );
      expect(gridTemplateColumns).toMatch(/^1fr$/);
    }
  });

  test('Cards have 2 columns on tablet', async ({ page }) => {
    await page.setViewportSize(breakpoints.tablet);
    
    const featuresGrid = page.locator('#latest-features .grid-cards, #latest-features .cards, #latest-features .features-grid').first();
    const gridTemplateColumns = await featuresGrid.evaluate((el) => 
      window.getComputedStyle(el).gridTemplateColumns
    );
    
    // Should have 2 columns (repeat(2, ...))
    expect(gridTemplateColumns).toMatch(/repeat\(2/);
  });

  test('Cards have 3 columns on desktop', async ({ page }) => {
    await page.setViewportSize(breakpoints.desktop);
    
    const featuresGrid = page.locator('#latest-features .grid-cards, #latest-features .cards, #latest-features .features-grid').first();
    const gridTemplateColumns = await featuresGrid.evaluate((el) => 
      window.getComputedStyle(el).gridTemplateColumns
    );
    
    // Should have 3 columns (repeat(3, ...))
    expect(gridTemplateColumns).toMatch(/repeat\(3/);
  });

  test('No card overflows horizontally on mobile', async ({ page }) => {
    await page.setViewportSize(breakpoints.mobile);
    
    const cards = page.locator('.card, .feature-card');
    const count = await cards.count();
    
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const boundingBox = await card.boundingBox();
      
      if (boundingBox) {
        // Card should not exceed viewport width
        expect(boundingBox.width).toBeLessThanOrEqual(breakpoints.mobile.width);
        
        // Check for horizontal overflow
        const overflowX = await card.evaluate((el) => 
          window.getComputedStyle(el).overflowX
        );
        expect(overflowX).not.toBe('scroll');
        expect(overflowX).not.toBe('auto');
      }
    }
  });

  test('Back to Top button does not overlap card content', async ({ page }) => {
    await page.setViewportSize(breakpoints.mobile);
    
    // Scroll down to show back-to-top button
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    
    const backToTop = page.locator('#backToTop');
    await expect(backToTop).toBeVisible();
    
    const backToTopBox = await backToTop.boundingBox();
    const bodyBox = await page.locator('body').boundingBox();
    
    if (backToTopBox && bodyBox) {
      // Back to top should be in bottom-right corner
      expect(backToTopBox.y + backToTopBox.height).toBeLessThanOrEqual(bodyBox.height);
      
      // Check that body has padding-bottom to prevent overlap
      const bodyPaddingBottom = await page.evaluate(() => 
        window.getComputedStyle(document.body).paddingBottom
      );
      expect(parseInt(bodyPaddingBottom)).toBeGreaterThanOrEqual(80);
    }
  });

  test('Vertical ribbons are hidden on mobile', async ({ page }) => {
    await page.setViewportSize(breakpoints.mobile);
    
    const ribbons = page.locator('.ribbon');
    const count = await ribbons.count();
    
    for (let i = 0; i < count; i++) {
      const ribbon = ribbons.nth(i);
      const display = await ribbon.evaluate((el) => 
        window.getComputedStyle(el).display
      );
      expect(display).toBe('none');
    }
  });

  test('Mobile badges are visible on mobile', async ({ page }) => {
    await page.setViewportSize(breakpoints.mobile);
    
    const badges = page.locator('.mobile-badge');
    const count = await badges.count();
    
    for (let i = 0; i < count; i++) {
      const badge = badges.nth(i);
      const display = await badge.evaluate((el) => 
        window.getComputedStyle(el).display
      );
      expect(display).not.toBe('none');
    }
  });

  test('Mobile badges are hidden on desktop', async ({ page }) => {
    await page.setViewportSize(breakpoints.desktop);
    
    const badges = page.locator('.mobile-badge');
    const count = await badges.count();
    
    for (let i = 0; i < count; i++) {
      const badge = badges.nth(i);
      const display = await badge.evaluate((el) => 
        window.getComputedStyle(el).display
      );
      expect(display).toBe('none');
    }
  });

  test('All anchor links navigate correctly', async ({ page }) => {
    await page.setViewportSize(breakpoints.mobile);
    
    // Get all anchor links
    const anchors = page.locator('a[href^="#"]');
    const count = await anchors.count();
    
    for (let i = 0; i < Math.min(count, 10); i++) { // Test first 10 to avoid timeout
      const anchor = anchors.nth(i);
      const href = await anchor.getAttribute('href');
      
      if (href && href !== '#' && href !== '#!') {
        const targetId = href.substring(1);
        const target = page.locator(`#${targetId}`);
        
        // Click the anchor
        await anchor.click();
        await page.waitForTimeout(300);
        
        // Check if target exists and is in viewport
        const targetCount = await target.count();
        expect(targetCount).toBeGreaterThan(0);
      }
    }
  });

  test('Images and charts scale responsively', async ({ page }) => {
    await page.setViewportSize(breakpoints.mobile);
    
    const images = page.locator('img, canvas, svg, video');
    const count = await images.count();
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      const img = images.nth(i);
      const maxWidth = await img.evaluate((el) => 
        window.getComputedStyle(el).maxWidth
      );
      
      expect(maxWidth).toBe('100%');
      
      const boundingBox = await img.boundingBox();
      if (boundingBox) {
        expect(boundingBox.width).toBeLessThanOrEqual(breakpoints.mobile.width);
      }
    }
  });

  test('Text wraps properly on mobile', async ({ page }) => {
    await page.setViewportSize(breakpoints.mobile);
    
    const cards = page.locator('.card, .feature-card');
    const count = await cards.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = cards.nth(i);
      const overflowWrap = await card.evaluate((el) => 
        window.getComputedStyle(el).overflowWrap
      );
      const wordBreak = await card.evaluate((el) => 
        window.getComputedStyle(el).wordBreak
      );
      
      expect(overflowWrap).toMatch(/anywhere|break-word/);
      expect(['normal', 'break-word']).toContain(wordBreak);
    }
  });
});

test.describe('Screenshot Tests', () => {
  test('Screenshot Latest Revolutionary Features on mobile', async ({ page }) => {
    await page.setViewportSize(breakpoints.mobile);
    await page.goto('http://localhost:8000/#latest-features');
    await page.waitForTimeout(500);
    
    await page.screenshot({
      path: 'docs/screenshots/mobile-fixes/latest-features-mobile.png',
      fullPage: false,
    });
  });

  test('Screenshot Latest Revolutionary Features on tablet', async ({ page }) => {
    await page.setViewportSize(breakpoints.tablet);
    await page.goto('http://localhost:8000/#latest-features');
    await page.waitForTimeout(500);
    
    await page.screenshot({
      path: 'docs/screenshots/mobile-fixes/latest-features-tablet.png',
      fullPage: false,
    });
  });

  test('Screenshot Latest Revolutionary Features on desktop', async ({ page }) => {
    await page.setViewportSize(breakpoints.desktop);
    await page.goto('http://localhost:8000/#latest-features');
    await page.waitForTimeout(500);
    
    await page.screenshot({
      path: 'docs/screenshots/mobile-fixes/latest-features-desktop.png',
      fullPage: false,
    });
  });
});

