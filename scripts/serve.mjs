#!/usr/bin/env node
/**
 * Simple static file server for development
 * Serves HTMX partials and static assets
 */

import { createServer } from 'http';
import { readFileSync, statSync } from 'fs';
import { join, extname, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const PORT = 8000;
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.pdf': 'application/pdf'
};

const server = createServer((req, res) => {
    let filePath = join(rootDir, req.url === '/' ? 'index.html' : req.url);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(rootDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    try {
        const stats = statSync(filePath);
        if (stats.isFile()) {
            const ext = extname(filePath);
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            const content = readFileSync(filePath);
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
    } catch (err) {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Press Ctrl+C to stop`);
});

