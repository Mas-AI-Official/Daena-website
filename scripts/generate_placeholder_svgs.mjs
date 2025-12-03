#!/usr/bin/env node
/**
 * Generate placeholder SVGs and manifest
 * Use this until pdf2svg is installed for proper extraction
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const OUTPUT_DIR = path.join(rootDir, 'public', 'fig', 'daena');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest.json');

// Ensure output directory exists
await fs.mkdir(OUTPUT_DIR, { recursive: true });

// Figure metadata
const figures = [
    { id: 'fig-01', page: 1, title: 'Daena Architecture Overview', width: 1376, height: 768 },
    { id: 'fig-02', page: 2, title: 'Sunflower-Honeycomb Memory Architecture', width: 1376, height: 768 },
    { id: 'fig-03', page: 3, title: 'NBMF L1/L2/L3 Architecture', width: 1376, height: 768 },
    { id: 'fig-04', page: 4, title: 'Enterprise DNA (eDNA) Structure', width: 1376, height: 768 },
    { id: 'fig-05', page: 5, title: 'Performance Benchmarks', width: 1376, height: 768 },
    { id: 'fig-06', page: 6, title: 'Merkle Lineage & Audit Trail', width: 1376, height: 768 },
    { id: 'fig-07', page: 7, title: 'Pilot ROI Metrics', width: 1376, height: 768 },
    { id: 'fig-08', page: 8, title: 'Cost Analysis Dashboard', width: 1376, height: 768 },
    { id: 'fig-09', page: 9, title: 'Security & Compliance Framework', width: 1376, height: 768 },
    { id: 'fig-10', page: 10, title: 'Multi-Agent Communication Flow', width: 1376, height: 768 },
    { id: 'fig-11', page: 11, title: 'Model Switching Architecture', width: 1376, height: 768 },
    { id: 'fig-12', page: 12, title: 'ABAC Governance Model', width: 1376, height: 768 },
    { id: 'fig-13', page: 13, title: 'Real-time Voice Pipeline', width: 1376, height: 768 }
];

const captions = {
    'fig-01': 'Complete Daena AI system architecture showing all components and data flows.',
    'fig-02': 'Sunflower-Honeycomb memory architecture with ABAC tiers and reflexive memory hooks.',
    'fig-03': 'NBMF (Neuro-Bio Matrix Fusion) architecture with L1, L2, and L3 layers.',
    'fig-04': 'Enterprise DNA structure showing Genome, Epigenome, Lineage, and Immune system components.',
    'fig-05': 'Performance benchmarks comparing Daena against baseline systems.',
    'fig-06': 'Merkle tree-based audit trail ensuring complete lineage tracking.',
    'fig-07': 'ROI metrics from pilot deployments showing cost savings and efficiency gains.',
    'fig-08': 'Cost analysis dashboard with per-day and per-request breakdowns.',
    'fig-09': 'Security and compliance framework with OAuth, RBAC, and audit logging.',
    'fig-10': 'Multi-agent communication flow with hex-mesh topology.',
    'fig-11': 'Model switching architecture supporting multiple LLM providers.',
    'fig-12': 'ABAC (Attribute-Based Access Control) governance model implementation.',
    'fig-13': 'Real-time voice pipeline with transcription and synthesis components.'
};

// Generate placeholder SVG
function generatePlaceholderSVG(fig) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     width="${fig.width}" 
     height="${fig.height}" 
     viewBox="0 0 ${fig.width} ${fig.height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <text x="50%" y="45%" 
        font-family="Arial, sans-serif" 
        font-size="32" 
        font-weight="bold" 
        fill="#22d3ee" 
        text-anchor="middle">
    ${fig.title}
  </text>
  <text x="50%" y="55%" 
        font-family="Arial, sans-serif" 
        font-size="18" 
        fill="#94a3b8" 
        text-anchor="middle">
    Placeholder - Extract from PDF using pdf2svg
  </text>
  <text x="50%" y="65%" 
        font-family="Arial, sans-serif" 
        font-size="14" 
        fill="#64748b" 
        text-anchor="middle">
    Page ${fig.page} | ${fig.width}×${fig.height}
  </text>
</svg>`;
}

// Generate manifest entries
function generateManifestEntry(fig) {
    return {
        id: fig.id,
        title: fig.title,
        src: `/fig/daena/${fig.id}.svg`,
        page: fig.page,
        width: fig.width,
        height: fig.height,
        caption: captions[fig.id] || `${fig.title} from page ${fig.page} of Daena: The Auditable AI Vice President.`
    };
}

// Generate all files
console.log('Generating placeholder SVGs and manifest...\n');

const manifest = [];

for (const fig of figures) {
    const svgPath = path.join(OUTPUT_DIR, `${fig.id}.svg`);
    const svgContent = generatePlaceholderSVG(fig);
    
    await fs.writeFile(svgPath, svgContent, 'utf-8');
    manifest.push(generateManifestEntry(fig));
    
    console.log(`✓ Created ${fig.id} (${fig.width}×${fig.height})`);
}

// Write manifest
await fs.writeFile(
    MANIFEST_PATH,
    JSON.stringify(manifest, null, 2),
    'utf-8'
);

console.log(`\n✓ Manifest created: ${MANIFEST_PATH}`);
console.log(`\nNote: These are placeholder SVGs. To extract real diagrams:`);
console.log(`  1. Install poppler-utils: choco install poppler (Windows)`);
console.log(`  2. Run: npm run extract:pdf`);

