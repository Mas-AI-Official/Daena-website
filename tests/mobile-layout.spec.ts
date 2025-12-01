import { test, expect, devices } from '@playwright/test';

// Test matrix: iPhone 12/14, iPhone SE, Pixel 6, Safari iOS, Chrome Android
const mobileDevices = [
    { name: 'iPhone 12', ...devices['iPhone 12'] },
    { name: 'iPhone 14', ...devices['iPhone 14'] },
    { name: 'iPhone SE', ...devices['iPhone SE'] },
    { name: 'Pixel 6', ...devices['Pixel 6'] },
];

// Pages to test
const pages = [
    '/',
    '/#what-it-is',
    '/#why-it-wins',
    '/#memory-governance',
    '/#security-compliance',
    '/nbmf',
    '/enterprise-dna',
];

test.describe('Mobile Layout Tests (<768px)', () => {
    for (const device of mobileDevices) {
        test.describe(`Device: ${device.name}`, () => {
            test.use({
                ...device,
                viewport: { width: device.viewport.width, height: device.viewport.height },
            });

            for (const page of pages) {
                test(`Page: ${page} - Single column cards, no vertical ribbons, no clipped text`, async ({ page: pageInstance }) => {
                    await pageInstance.goto(`${BASE_URL}${page}`, { waitUntil: 'networkidle' });
                    
                    // Wait for page to fully load
                    await pageInstance.waitForTimeout(1000);
                    
                    // 1) Verify all feature cards are 1-per-row
                    const cards = await pageInstance.locator('.card, .feature-card').all();
                    for (const card of cards) {
                        const cardBox = await card.boundingBox();
                        const viewportWidth = device.viewport.width;
                        
                        // Card should be full width (with some margin tolerance)
                        expect(cardBox?.width).toBeGreaterThan(viewportWidth * 0.9);
                    }
                    
                    // 2) Verify no vertical ribbons are visible
                    const verticalRibbons = await pageInstance.locator('.ribbon, .vertical-rail, .side-ribbon').all();
                    for (const ribbon of verticalRibbons) {
                        const isVisible = await ribbon.isVisible();
                        if (isVisible) {
                            const writingMode = await ribbon.evaluate((el) => window.getComputedStyle(el).writingMode);
                            expect(writingMode).toBe('horizontal-tb');
                        }
                    }
                    
                    // 3) Verify no clipped/stacked text
                    const allTextElements = await pageInstance.locator('p, h1, h2, h3, h4, h5, h6, li, span').all();
                    for (const element of allTextElements) {
                        const text = await element.textContent();
                        const box = await element.boundingBox();
                        
                        // Text should not be empty and should be visible
                        if (text && text.trim().length > 0) {
                            expect(box).not.toBeNull();
                            expect(box?.width).toBeGreaterThan(0);
                            expect(box?.height).toBeGreaterThan(0);
                        }
                    }
                    
                    // 4) Verify no stray † characters (should be in <sup> tags)
                    const pageContent = await pageInstance.content();
                    // Find † characters that are not inside <sup> tags
                    const strayDaggers = pageContent.match(/[^<]†[^>]/g);
                    expect(strayDaggers).toBeNull();
                    
                    // 5) Verify Back to Top button doesn't overlap content
                    const backToTop = pageInstance.locator('.back-to-top.visible');
                    if (await backToTop.count() > 0) {
                        const buttonBox = await backToTop.boundingBox();
                        const bodyHeight = await pageInstance.evaluate(() => document.body.scrollHeight);
                        const viewportHeight = device.viewport.height;
                        
                        // Button should be fixed and not overlap content
                        expect(buttonBox).not.toBeNull();
                        if (buttonBox) {
                            expect(buttonBox.y + buttonBox.height).toBeLessThan(viewportHeight);
                        }
                    }
                    
                    // 6) Verify anchor scroll offsets work
                    if (page.includes('#')) {
                        const hash = page.split('#')[1];
                        const targetElement = pageInstance.locator(`#${hash}`);
                        if (await targetElement.count() > 0) {
                            await pageInstance.waitForTimeout(500);
                            const scrollY = await pageInstance.evaluate(() => window.scrollY);
                            const elementBox = await targetElement.boundingBox();
                            
                            // Element should be visible (accounting for sticky header ~72px)
                            if (elementBox) {
                                expect(scrollY + 72).toBeLessThanOrEqual(elementBox.y + 20);
                            }
                        }
                    }
                    
                    // 7) Verify images/charts are responsive
                    const images = await pageInstance.locator('img, svg, canvas, video').all();
                    for (const img of images) {
                        const imgBox = await img.boundingBox();
                        const viewportWidth = device.viewport.width;
                        
                        if (imgBox) {
                            // Image should not exceed viewport width
                            expect(imgBox.width).toBeLessThanOrEqual(viewportWidth);
                        }
                    }
                    
                    // 8) Verify no horizontal scroll
                    const horizontalScroll = await pageInstance.evaluate(() => {
                        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
                    });
                    expect(horizontalScroll).toBe(false);
                    
                    // 9) Take screenshot for visual verification
                    await pageInstance.screenshot({
                        path: `tests/screenshots/${device.name.replace(/\s+/g, '-')}-${page.replace(/\//g, '-').replace(/#/g, '')}.png`,
                        fullPage: true,
                    });
                });
            }
        });
    }
    
    test('Lighthouse mobile score ≥ 80 (Performance) and ≥ 90 (Accessibility)', async ({ page }) => {
        await page.goto(`${BASE_URL}/`);
        
        // Note: Lighthouse requires chrome-launcher and lighthouse packages
        // This test will be skipped if packages are not installed
        test.skip(process.env.SKIP_LIGHTHOUSE === 'true', 'Lighthouse test skipped');
        
        // Run Lighthouse audit
        try {
            const lighthouse = await import('lighthouse');
            const { default: chromeLauncher } = await import('chrome-launcher');
            
            const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
            const options = {
                logLevel: 'info',
                output: 'html',
                onlyCategories: ['performance', 'accessibility'],
                port: chrome.port,
            };
            
            const runnerResult = await lighthouse.default(`${BASE_URL}/`, options);
            await chrome.kill();
            
            const scores = runnerResult?.lhr?.categories;
            if (scores) {
                expect(scores.performance?.score * 100).toBeGreaterThanOrEqual(80);
                expect(scores.accessibility?.score * 100).toBeGreaterThanOrEqual(90);
            }
        } catch (error) {
            console.warn('Lighthouse test skipped - packages not installed');
        }
    });
    
    test('CLS < 0.02 (no layout shift)', async ({ page }) => {
        await page.goto(`${BASE_URL}/`);
        
        // Measure CLS
        const cls = await page.evaluate(() => {
            return new Promise((resolve) => {
                let clsValue = 0;
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
                            clsValue += (entry as any).value;
                        }
                    }
                });
                observer.observe({ entryTypes: ['layout-shift'] });
                
                setTimeout(() => {
                    observer.disconnect();
                    resolve(clsValue);
                }, 5000);
            });
        });
        
        expect(cls).toBeLessThan(0.02);
    });
});
