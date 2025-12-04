/**
 * Daena Skin - Unified Demo Page Wrapper
 * Applies homepage styling (navbar, Metatron bg, glass panels) to demo pages
 */

(function() {
    'use strict';
    
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Add skin class to body
        document.body.classList.add('daena-skin');
        
        // Inject Metatron background layers
        injectMetatronBackground();
        
        // Inject navbar
        injectNavbar();
        
        // Wrap demo content
        wrapDemoContent();
        
        // Load Metatron canvas script if available
        loadMetatronScript();
    }
    
    function injectMetatronBackground() {
        // Check if already exists
        if (document.querySelector('.metatron-bg')) return;
        
        const metatronBg = document.createElement('div');
        metatronBg.className = 'metatron-bg';
        document.body.insertBefore(metatronBg, document.body.firstChild);
        
        const metatronPattern = document.createElement('div');
        metatronPattern.className = 'metatron-pattern-bg';
        document.body.insertBefore(metatronPattern, document.body.firstChild);
        
        const metatronCanvas = document.createElement('canvas');
        metatronCanvas.id = 'metatron-hex-canvas';
        document.body.insertBefore(metatronCanvas, document.body.firstChild);
    }
    
    function injectNavbar() {
        // Check if navbar already exists
        if (document.querySelector('.daena-navbar')) return;
        
        const navbar = document.createElement('nav');
        navbar.className = 'daena-navbar';
        navbar.setAttribute('role', 'navigation');
        navbar.setAttribute('aria-label', 'Main navigation');
        
        navbar.innerHTML = `
            <div class="max-w-7xl mx-auto">
                <div class="glass-card flex items-center justify-between p-4">
                    <a href="/" class="logo">Daena</a>
                    <div class="hidden md:flex items-center gap-6">
                        <a href="/#demos">Demos</a>
                        <a href="/#pitch">Pitch Deck</a>
                        <a href="/docs.html#live">Live Demo</a>
                        <a href="/docs.html">Docs & Benchmarks</a>
                        <a href="/#contact">Contact</a>
                    </div>
                    <button class="md:hidden" aria-label="Menu" id="mobile-menu-btn">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
                <div class="hidden md:hidden p-4 border-t border-white/10" id="mobile-menu">
                    <div class="flex flex-col gap-4">
                        <a href="/#demos">Demos</a>
                        <a href="/#pitch">Pitch Deck</a>
                        <a href="/docs.html#live">Live Demo</a>
                        <a href="/docs.html">Docs & Benchmarks</a>
                        <a href="/#contact">Contact</a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertBefore(navbar, document.body.firstChild);
        
        // Mobile menu toggle
        const menuBtn = navbar.querySelector('#mobile-menu-btn');
        const mobileMenu = navbar.querySelector('#mobile-menu');
        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
    
    function wrapDemoContent() {
        // Find the main demo container
        let demoContainer = document.getElementById('app') || 
                           document.getElementById('root') || 
                           document.querySelector('main') ||
                           document.querySelector('#demo-container') ||
                           document.querySelector('.demo-container');
        
        // If no container found, use body's direct children (excluding our injected elements)
        if (!demoContainer) {
            const bodyChildren = Array.from(document.body.children);
            const injected = document.querySelectorAll('.metatron-bg, .metatron-pattern-bg, #metatron-hex-canvas, .daena-navbar');
            const injectedSet = new Set(injected);
            const contentChildren = bodyChildren.filter(el => !injectedSet.has(el));
            
            if (contentChildren.length > 0) {
                // Create wrapper for all content
                demoContainer = document.createElement('div');
                demoContainer.id = 'daena-content-wrapper';
                while (contentChildren.length > 0) {
                    demoContainer.appendChild(contentChildren[0]);
                }
                document.body.appendChild(demoContainer);
            } else {
                demoContainer = document.body;
            }
        }
        
        // Create main container
        const mainContainer = document.createElement('main');
        mainContainer.className = 'daena-container';
        
        // Create breadcrumb
        const breadcrumb = document.createElement('nav');
        breadcrumb.className = 'daena-breadcrumb';
        breadcrumb.innerHTML = '<a href="/#demos" class="pill">← Back to Demos</a>';
        mainContainer.appendChild(breadcrumb);
        
        // Create title if missing
        if (!document.querySelector('h1')) {
            const h1 = document.createElement('h1');
            h1.className = 'daena-title';
            h1.textContent = document.title || 'Interactive Demo';
            mainContainer.appendChild(h1);
            
            // Add subtitle from meta description
            const descMeta = document.querySelector('meta[name="description"]');
            if (descMeta && descMeta.content) {
                const sub = document.createElement('p');
                sub.className = 'daena-sub';
                sub.textContent = descMeta.content;
                h1.after(sub);
            }
        }
        
        // Create glass shell
        const shell = document.createElement('section');
        shell.className = 'daena-glass';
        shell.id = 'daena-demo-shell';
        
        // Move demo content into shell
        if (demoContainer && demoContainer !== document.body && demoContainer.id !== 'daena-content-wrapper') {
            // Move all children
            while (demoContainer.firstChild) {
                shell.appendChild(demoContainer.firstChild);
            }
            // Replace container with shell
            demoContainer.parentNode.replaceChild(shell, demoContainer);
        } else if (demoContainer && demoContainer.id === 'daena-content-wrapper') {
            // Move wrapper content to shell
            while (demoContainer.firstChild) {
                shell.appendChild(demoContainer.firstChild);
            }
            document.body.removeChild(demoContainer);
        } else {
            // Move body's direct children (excluding injected)
            const toMove = Array.from(document.body.children).filter(el => 
                !el.classList.contains('metatron-bg') && 
                !el.classList.contains('metatron-pattern-bg') && 
                el.id !== 'metatron-hex-canvas' &&
                !el.classList.contains('daena-navbar')
            );
            toMove.forEach(el => shell.appendChild(el));
        }
        
        mainContainer.appendChild(shell);
        
        // Insert main container after navbar
        const navbar = document.querySelector('.daena-navbar');
        if (navbar) {
            navbar.after(mainContainer);
        } else {
            document.body.appendChild(mainContainer);
        }
        
        // Normalize demo elements
        normalizeDemoElements(shell);
    }
    
    function normalizeDemoElements(container) {
        // Ensure canvases, iframes, videos are responsive
        const elements = container.querySelectorAll('canvas, iframe, video');
        elements.forEach(el => {
            if (!el.style.maxWidth) {
                el.style.maxWidth = '100%';
            }
            if (!el.style.display || el.style.display === 'inline') {
                el.style.display = 'block';
            }
            if (!el.style.margin) {
                el.style.margin = '12px auto';
            }
        });
        
        // Fix absolute positioned canvases
        const canvases = container.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            if (getComputedStyle(canvas).position === 'absolute') {
                canvas.style.position = 'relative';
            }
        });
    }
    
    function loadMetatronScript() {
        // Try to load the Metatron hex network script
        const script = document.createElement('script');
        script.src = '/js/metatron-hex-network.js';
        script.async = true;
        script.onerror = () => {
            // Script not found, that's okay
            console.log('Metatron script not found, skipping');
        };
        document.head.appendChild(script);
    }
})();

