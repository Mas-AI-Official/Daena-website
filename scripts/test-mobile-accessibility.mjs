#!/usr/bin/env node
/**
 * Mobile Responsiveness & Accessibility Test Script
 * Checks for common mobile and accessibility issues
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const PAGES_TO_TEST = [
    'index.html',
    'overview.html',
    'for-developers.html',
    'technical.html',
    'pitch-deck-presentation.html'
];

const ISSUES = {
    mobile: [],
    accessibility: [],
    performance: []
};

async function readFile(filePath) {
    try {
        return await fs.readFile(filePath, 'utf-8');
    } catch (err) {
        return null;
    }
}

function checkViewportMeta(html, filePath) {
    if (!html.includes('viewport')) {
        ISSUES.mobile.push(`${filePath}: Missing viewport meta tag`);
    } else if (!html.includes('width=device-width')) {
        ISSUES.mobile.push(`${filePath}: Viewport meta tag missing width=device-width`);
    }
}

function checkMobileBreakpoints(html, filePath) {
    const hasMobileMedia = html.includes('@media') && (
        html.includes('max-width: 640px') ||
        html.includes('max-width: 768px') ||
        html.includes('max-width: 480px')
    );
    
    if (!hasMobileMedia && !filePath.includes('pitch-deck')) {
        ISSUES.mobile.push(`${filePath}: No mobile media queries found`);
    }
}

function checkAccessibility(html, filePath) {
    // Check for alt attributes on images
    const imgMatches = html.match(/<img[^>]*>/g) || [];
    imgMatches.forEach((img, index) => {
        if (!img.includes('alt=')) {
            ISSUES.accessibility.push(`${filePath}: Image ${index + 1} missing alt attribute`);
        }
    });

    // Check for ARIA labels
    const interactiveElements = html.match(/<button[^>]*>|<a[^>]*>|<input[^>]*>/g) || [];
    const hasAriaLabels = interactiveElements.some(el => 
        el.includes('aria-label') || el.includes('aria-labelledby')
    );
    
    // Check for semantic HTML
    const hasSemanticHTML = html.includes('<nav') || html.includes('<main') || html.includes('<section');
    if (!hasSemanticHTML && !filePath.includes('pitch-deck')) {
        ISSUES.accessibility.push(`${filePath}: Missing semantic HTML elements`);
    }

    // Check for focus styles
    if (!html.includes('focus') && !html.includes(':focus')) {
        ISSUES.accessibility.push(`${filePath}: No focus styles found`);
    }
}

function checkPerformance(html, filePath) {
    // Check for lazy loading on images
    const imgMatches = html.match(/<img[^>]*>/g) || [];
    const lazyLoaded = imgMatches.filter(img => img.includes('loading="lazy"')).length;
    const totalImages = imgMatches.length;
    
    if (totalImages > 3 && lazyLoaded < totalImages * 0.5) {
        ISSUES.performance.push(`${filePath}: Only ${lazyLoaded}/${totalImages} images use lazy loading`);
    }

    // Check for inline styles (can affect performance)
    const inlineStyleCount = (html.match(/style="/g) || []).length;
    if (inlineStyleCount > 20) {
        ISSUES.performance.push(`${filePath}: High number of inline styles (${inlineStyleCount})`);
    }
}

function checkTextOverflow(html, filePath) {
    // Check for text overflow prevention
    const hasTextSafe = html.includes('text-safe') || 
                       html.includes('word-wrap') || 
                       html.includes('overflow-wrap') ||
                       html.includes('break-word');
    
    if (!hasTextSafe && !filePath.includes('pitch-deck')) {
        ISSUES.mobile.push(`${filePath}: No text overflow prevention classes found`);
    }
}

function checkTouchTargets(html, filePath) {
    // Check for touch-friendly button sizes
    const buttonMatches = html.match(/<button[^>]*>/g) || [];
    const hasMinSize = html.includes('min-height: 44px') || 
                       html.includes('min-height:44px') ||
                       html.includes('min-width: 44px') ||
                       html.includes('min-width:44px');
    
    if (buttonMatches.length > 0 && !hasMinSize && !filePath.includes('pitch-deck')) {
        ISSUES.mobile.push(`${filePath}: Buttons may not meet 44px minimum touch target`);
    }
}

async function testPage(fileName) {
    const filePath = path.join(rootDir, fileName);
    const html = await readFile(filePath);
    
    if (!html) {
        console.log(`⚠️  Could not read ${fileName}`);
        return;
    }

    console.log(`\n📄 Testing ${fileName}...`);
    
    checkViewportMeta(html, fileName);
    checkMobileBreakpoints(html, fileName);
    checkAccessibility(html, fileName);
    checkPerformance(html, fileName);
    checkTextOverflow(html, fileName);
    checkTouchTargets(html, fileName);
}

async function runTests() {
    console.log('🧪 Starting Mobile Responsiveness & Accessibility Tests...\n');
    
    for (const page of PAGES_TO_TEST) {
        await testPage(page);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 Test Results Summary');
    console.log('='.repeat(60));
    
    if (ISSUES.mobile.length === 0 && ISSUES.accessibility.length === 0 && ISSUES.performance.length === 0) {
        console.log('✅ All tests passed! No issues found.');
    } else {
        if (ISSUES.mobile.length > 0) {
            console.log(`\n📱 Mobile Issues (${ISSUES.mobile.length}):`);
            ISSUES.mobile.forEach(issue => console.log(`  ⚠️  ${issue}`));
        }
        
        if (ISSUES.accessibility.length > 0) {
            console.log(`\n♿ Accessibility Issues (${ISSUES.accessibility.length}):`);
            ISSUES.accessibility.forEach(issue => console.log(`  ⚠️  ${issue}`));
        }
        
        if (ISSUES.performance.length > 0) {
            console.log(`\n⚡ Performance Issues (${ISSUES.performance.length}):`);
            ISSUES.performance.forEach(issue => console.log(`  ⚠️  ${issue}`));
        }
    }
    
    console.log('\n' + '='.repeat(60));
    
    const totalIssues = ISSUES.mobile.length + ISSUES.accessibility.length + ISSUES.performance.length;
    process.exit(totalIssues > 0 ? 1 : 0);
}

runTests().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});

