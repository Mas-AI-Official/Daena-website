#!/usr/bin/env node
/**
 * PDF to SVG Extraction Script
 * Extracts vector diagrams from PDF and converts to optimized SVG
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument } from 'pdf-lib';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const PDF_PATH = path.join(rootDir, 'docs', 'pdfs', 'Daena_The_Auditable_AI_Vice_President.pdf');
const OUTPUT_DIR = path.join(rootDir, 'public', 'fig', 'daena');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest.json');

// Ensure output directory exists
async function ensureDir(dir) {
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
}

// Check if pdf2svg or inkscape is available
function checkConverter() {
    try {
        execSync('which pdf2svg', { stdio: 'ignore' });
        return 'pdf2svg';
    } catch {
        try {
            execSync('which inkscape', { stdio: 'ignore' });
            return 'inkscape';
        } catch {
            console.warn('⚠️  pdf2svg or inkscape not found. Using fallback method.');
            return 'fallback';
        }
    }
}

// Extract page as SVG using pdf2svg
async function extractPageWithPdf2Svg(pdfPath, pageNum, outputPath) {
    try {
        execSync(`pdf2svg "${pdfPath}" "${outputPath}" ${pageNum}`, { stdio: 'inherit' });
        return true;
    } catch (err) {
        console.error(`Failed to extract page ${pageNum} with pdf2svg:`, err.message);
        return false;
    }
}

// Extract page as SVG using Inkscape
async function extractPageWithInkscape(pdfPath, pageNum, outputPath) {
    try {
        const pageId = pageNum - 1; // Inkscape uses 0-based indexing
        execSync(`inkscape --pdf-page=${pageNum} --export-filename="${outputPath}" "${pdfPath}"`, { stdio: 'inherit' });
        return true;
    } catch (err) {
        console.error(`Failed to extract page ${pageNum} with inkscape:`, err.message);
        return false;
    }
}

// Fallback: Extract page as PNG and convert (requires imagemagick)
async function extractPageFallback(pdfPath, pageNum, outputPath) {
    try {
        const pngPath = outputPath.replace('.svg', '.png');
        execSync(`magick -density 300 "${pdfPath}[${pageNum - 1}]" "${pngPath}"`, { stdio: 'inherit' });
        // Convert PNG to SVG (simple approach - creates SVG wrapper)
        const pngData = await fs.readFile(pngPath);
        const base64 = pngData.toString('base64');
        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1376 768">
  <image x="0" y="0" width="1376" height="768" xlink:href="data:image/png;base64,${base64}"/>
</svg>`;
        await fs.writeFile(outputPath, svg);
        await fs.unlink(pngPath);
        return true;
    } catch (err) {
        console.error(`Failed to extract page ${pageNum} with fallback:`, err.message);
        return false;
    }
}

// Optimize SVG with svgo (if available)
async function optimizeSvg(svgPath) {
    try {
        execSync(`npx svgo "${svgPath}" --multipass --pretty`, { stdio: 'ignore' });
        return true;
    } catch {
        // svgo not available, skip optimization
        return false;
    }
}

// Get PDF page count
async function getPageCount(pdfPath) {
    try {
        const pdfBytes = await fs.readFile(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        return pdfDoc.getPageCount();
    } catch (err) {
        console.error('Failed to read PDF:', err.message);
        throw err;
    }
}

// Generate manifest entry
function generateManifestEntry(id, pageNum, width = 1376, height = 768) {
    const titles = {
        1: 'Daena Architecture Overview',
        2: 'Sunflower-Honeycomb Memory Architecture',
        3: 'NBMF L1/L2/L3 Architecture',
        4: 'Enterprise DNA (eDNA) Structure',
        5: 'Performance Benchmarks',
        6: 'Merkle Lineage & Audit Trail',
        7: 'Pilot ROI Metrics',
        8: 'Cost Analysis Dashboard',
        9: 'Security & Compliance Framework',
        10: 'Multi-Agent Communication Flow',
        11: 'Model Switching Architecture',
        12: 'ABAC Governance Model',
        13: 'Real-time Voice Pipeline'
    };
    
    const captions = {
        1: 'Complete Daena AI system architecture showing all components and data flows.',
        2: 'Sunflower-Honeycomb memory architecture with ABAC tiers and reflexive memory hooks.',
        3: 'NBMF (Neuro-Bio Matrix Fusion) architecture with L1, L2, and L3 layers.',
        4: 'Enterprise DNA structure showing Genome, Epigenome, Lineage, and Immune system components.',
        5: 'Performance benchmarks comparing Daena against baseline systems.',
        6: 'Merkle tree-based audit trail ensuring complete lineage tracking.',
        7: 'ROI metrics from pilot deployments showing cost savings and efficiency gains.',
        8: 'Cost analysis dashboard with per-day and per-request breakdowns.',
        9: 'Security and compliance framework with OAuth, RBAC, and audit logging.',
        10: 'Multi-agent communication flow with hex-mesh topology.',
        11: 'Model switching architecture supporting multiple LLM providers.',
        12: 'ABAC (Attribute-Based Access Control) governance model implementation.',
        13: 'Real-time voice pipeline with transcription and synthesis components.'
    };
    
    return {
        id,
        title: titles[pageNum] || `Figure ${pageNum}`,
        src: `/fig/daena/${id}.svg`,
        page: pageNum,
        width,
        height,
        caption: captions[pageNum] || `Figure ${pageNum} from page ${pageNum} of the Daena documentation.`
    };
}

// Main extraction function
async function extractAllFigures() {
    console.log('📄 Starting PDF to SVG extraction...\n');
    
    // Check if PDF exists
    try {
        await fs.access(PDF_PATH);
    } catch {
        console.error(`❌ PDF not found at: ${PDF_PATH}`);
        console.log('💡 Please ensure the PDF is located at docs/pdfs/Daena_The_Auditable_AI_Vice_President.pdf');
        process.exit(1);
    }
    
    // Ensure output directory
    await ensureDir(OUTPUT_DIR);
    
    // Get page count
    const pageCount = await getPageCount(PDF_PATH);
    console.log(`📊 PDF has ${pageCount} pages\n`);
    
    // Check converter
    const converter = checkConverter();
    console.log(`🔧 Using converter: ${converter}\n`);
    
    const manifest = [];
    const failedPages = [];
    
    // Extract each page
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
        const id = `fig-${String(pageNum).padStart(2, '0')}`;
        const outputPath = path.join(OUTPUT_DIR, `${id}.svg`);
        
        console.log(`📄 Extracting page ${pageNum}/${pageCount}...`);
        
        let success = false;
        switch (converter) {
            case 'pdf2svg':
                success = await extractPageWithPdf2Svg(PDF_PATH, pageNum, outputPath);
                break;
            case 'inkscape':
                success = await extractPageWithInkscape(PDF_PATH, pageNum, outputPath);
                break;
            default:
                success = await extractPageFallback(PDF_PATH, pageNum, outputPath);
        }
        
        if (success) {
            // Optimize SVG
            await optimizeSvg(outputPath);
            
            // Add to manifest
            manifest.push(generateManifestEntry(id, pageNum));
            console.log(`✅ Extracted ${id}.svg\n`);
        } else {
            failedPages.push(pageNum);
            console.log(`❌ Failed to extract page ${pageNum}\n`);
        }
    }
    
    // Write manifest
    await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`📝 Manifest written to ${MANIFEST_PATH}\n`);
    
    // Summary
    console.log('='.repeat(50));
    console.log('📊 Extraction Summary:');
    console.log(`✅ Successfully extracted: ${manifest.length} figures`);
    if (failedPages.length > 0) {
        console.log(`❌ Failed pages: ${failedPages.join(', ')}`);
    }
    console.log('='.repeat(50));
    
    return { manifest, failedPages };
}

// Run extraction
extractAllFigures().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});

