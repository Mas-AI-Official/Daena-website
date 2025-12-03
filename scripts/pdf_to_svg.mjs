#!/usr/bin/env node
/**
 * PDF to SVG Extraction Script
 * Extracts diagrams from Daena_The_Auditable_AI_Vice_President.pdf
 * and converts them to optimized SVG files
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const PDF_PATH = path.join(rootDir, 'docs', 'pdfs', 'Daena_The_Auditable_AI_Vice_President.pdf');
const OUTPUT_DIR = path.join(rootDir, 'public', 'fig', 'daena');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest.json');

// Ensure output directory exists
await fs.mkdir(OUTPUT_DIR, { recursive: true });

/**
 * Check if pdf2svg (poppler-utils) is available
 */
function hasPdf2Svg() {
    try {
        execSync('pdf2svg --version', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

/**
 * Extract SVG using pdf2svg (poppler-utils)
 */
async function extractWithPdf2Svg(pageNum, outputPath) {
    try {
        execSync(`pdf2svg "${PDF_PATH}" "${outputPath}" ${pageNum}`, {
            stdio: 'pipe',
            cwd: rootDir
        });
        return true;
    } catch (error) {
        console.error(`Error extracting page ${pageNum} with pdf2svg:`, error.message);
        return false;
    }
}

/**
 * Extract using pdfjs-dist (fallback)
 * Renders PDF page to canvas and converts to SVG
 */
async function extractWithPdfJs(pageNum, outputPath) {
    try {
        // Dynamic import for pdfjs-dist
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
        const { createCanvas } = await import('canvas');
        
        const data = await fs.readFile(PDF_PATH);
        // Convert Buffer to Uint8Array for pdfjs
        const uint8Array = data instanceof Uint8Array ? data : new Uint8Array(data);
        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
        const pdf = await loadingTask.promise;
        
        if (pageNum > pdf.numPages) {
            throw new Error(`Page ${pageNum} exceeds total pages (${pdf.numPages})`);
        }
        
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        
        const canvas = createCanvas(viewport.width, viewport.height);
        const context = canvas.getContext('2d');
        
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;
        
        // Convert canvas to SVG
        const svg = await canvasToSvg(canvas, viewport);
        await fs.writeFile(outputPath, svg, 'utf-8');
        return true;
    } catch (error) {
        console.error(`Error extracting page ${pageNum} with pdfjs:`, error.message);
        return false;
    }
}

/**
 * Convert canvas to SVG (simplified)
 */
async function canvasToSvg(canvas, viewport) {
    // For now, create a simple SVG wrapper with the image
    // In production, you'd want to trace the canvas or use a proper conversion
    const dataUrl = canvas.toDataURL('image/png');
    const base64 = dataUrl.split(',')[1];
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${viewport.width}" 
     height="${viewport.height}" 
     viewBox="0 0 ${viewport.width} ${viewport.height}">
  <image x="0" y="0" width="${viewport.width}" height="${viewport.height}" 
         xlink:href="data:image/png;base64,${base64}"/>
</svg>`;
}

/**
 * Optimize SVG using svgo
 */
async function optimizeSvg(svgPath) {
    try {
        const { optimize } = await import('svgo');
        const svgContent = await fs.readFile(svgPath, 'utf-8');
        const result = optimize(svgContent, {
            plugins: [
                'preset-default',
                {
                    name: 'removeViewBox',
                    active: false // Keep viewBox
                },
                {
                    name: 'convertShapeToPath',
                    active: false // Preserve shapes
                }
            ]
        });
        
        if (result.data) {
            await fs.writeFile(svgPath, result.data, 'utf-8');
            return true;
        }
        return false;
    } catch (error) {
        console.warn(`Warning: Could not optimize ${svgPath}:`, error.message);
        return false;
    }
}

/**
 * Get SVG dimensions
 */
async function getSvgDimensions(svgPath) {
    try {
        const content = await fs.readFile(svgPath, 'utf-8');
        const widthMatch = content.match(/width=["'](\d+(?:\.\d+)?)/);
        const heightMatch = content.match(/height=["'](\d+(?:\.\d+)?)/);
        const viewBoxMatch = content.match(/viewBox=["']0\s+0\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)/);
        
        let width, height;
        if (viewBoxMatch) {
            width = parseFloat(viewBoxMatch[1]);
            height = parseFloat(viewBoxMatch[2]);
        } else if (widthMatch && heightMatch) {
            width = parseFloat(widthMatch[1]);
            height = parseFloat(heightMatch[1]);
        } else {
            width = 1376; // Default from PDF
            height = 768;
        }
        
        return { width, height };
    } catch {
        return { width: 1376, height: 768 };
    }
}

/**
 * Generate figure metadata
 */
function generateFigureMetadata(figNum, pageNum, svgPath, dimensions) {
    const titles = {
        1: "Daena Architecture Overview",
        2: "Sunflower-Honeycomb Memory Architecture",
        3: "NBMF L1/L2/L3 Architecture",
        4: "Enterprise DNA (eDNA) Structure",
        5: "Performance Benchmarks",
        6: "Audit Trail & Merkle Lineage",
        7: "Pilot ROI Metrics",
        8: "Cost Analysis Dashboard",
        9: "Security & Compliance Framework",
        10: "Multi-Agent Communication Flow",
        11: "Model Switching Architecture",
        12: "ABAC Governance Model",
        13: "Real-time Voice Pipeline"
    };
    
    const captions = {
        1: "Complete Daena AI system architecture showing all components and data flows.",
        2: "Sunflower-Honeycomb memory architecture with ABAC tiers and reflexive memory hooks.",
        3: "NBMF (Neuro-Bio Matrix Fusion) architecture with L1, L2, and L3 layers.",
        4: "Enterprise DNA structure showing Genome, Epigenome, Lineage, and Immune system components.",
        5: "Performance benchmarks comparing Daena against baseline systems.",
        6: "Merkle tree-based audit trail ensuring complete lineage tracking.",
        7: "ROI metrics from pilot deployments showing cost savings and efficiency gains.",
        8: "Cost analysis dashboard with per-day and per-request breakdowns.",
        9: "Security and compliance framework with OAuth, RBAC, and audit logging.",
        10: "Multi-agent communication flow with hex-mesh topology.",
        11: "Model switching architecture supporting multiple LLM providers.",
        12: "ABAC (Attribute-Based Access Control) governance model implementation.",
        13: "Real-time voice pipeline with transcription and synthesis components."
    };
    
    return {
        id: `fig-${String(figNum).padStart(2, '0')}`,
        title: titles[figNum] || `Figure ${figNum}`,
        src: `/fig/daena/fig-${String(figNum).padStart(2, '0')}.svg`,
        page: pageNum,
        width: dimensions.width,
        height: dimensions.height,
        caption: captions[figNum] || `Figure ${figNum} from page ${pageNum} of Daena: The Auditable AI Vice President.`
    };
}

/**
 * Main extraction function
 */
async function extractAllFigures() {
    console.log('Starting PDF to SVG extraction...\n');
    
    // Check if PDF exists
    try {
        await fs.access(PDF_PATH);
    } catch {
        console.error(`Error: PDF not found at ${PDF_PATH}`);
        process.exit(1);
    }
    
    const usePdf2Svg = hasPdf2Svg();
    console.log(`Using extraction method: ${usePdf2Svg ? 'pdf2svg (poppler-utils)' : 'pdfjs-dist (fallback)'}\n`);
    
    if (!usePdf2Svg) {
        console.log('Note: pdf2svg not found. Install poppler-utils for better SVG quality:');
        console.log('  Windows: choco install poppler');
        console.log('  macOS: brew install poppler');
        console.log('  Linux: apt-get install poppler-utils\n');
    }
    
    const manifest = [];
    const failedPages = [];
    const totalPages = 13; // Based on PDF structure
    
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const figNum = pageNum;
        const outputPath = path.join(OUTPUT_DIR, `fig-${String(figNum).padStart(2, '0')}.svg`);
        
        console.log(`Extracting page ${pageNum}...`);
        
        let success = false;
        if (usePdf2Svg) {
            success = await extractWithPdf2Svg(pageNum, outputPath);
        } else {
            success = await extractWithPdfJs(pageNum, outputPath);
        }
        
        if (success) {
            // Optimize SVG
            console.log(`  Optimizing SVG...`);
            await optimizeSvg(outputPath);
            
            // Get dimensions
            const dimensions = await getSvgDimensions(outputPath);
            
            // Generate metadata
            const metadata = generateFigureMetadata(figNum, pageNum, outputPath, dimensions);
            manifest.push(metadata);
            
            console.log(`  ✓ Created ${metadata.id} (${Math.round(dimensions.width)}×${Math.round(dimensions.height)})\n`);
        } else {
            failedPages.push(pageNum);
            console.log(`  ✗ Failed to extract page ${pageNum}\n`);
        }
    }
    
    // Write manifest
    await fs.writeFile(
        MANIFEST_PATH,
        JSON.stringify(manifest, null, 2),
        'utf-8'
    );
    
    console.log(`\nExtraction complete!`);
    console.log(`  Total figures: ${manifest.length}`);
    console.log(`  Manifest: ${MANIFEST_PATH}`);
    
    if (failedPages.length > 0) {
        console.log(`\n⚠ Failed pages: ${failedPages.join(', ')}`);
        return failedPages;
    }
    
    return [];
}

// Run extraction
const failed = await extractAllFigures();
process.exit(failed.length > 0 ? 1 : 0);

