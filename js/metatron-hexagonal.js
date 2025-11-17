/**
 * Hexagonal Mesh Visualization for Daena Website
 * Each node connects to its 5 nearest neighbors with animated data flow
 */

(function() {
    'use strict';
    
    function initHexagonalMesh() {
        const container = document.querySelector('.metatron-container');
        if (!container) return;
        
        // Clear existing SVG
        const existingSVG = container.querySelector('svg');
        if (existingSVG) {
            existingSVG.remove();
        }
        
        const width = container.clientWidth || 800;
        const height = container.clientHeight || 600;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Create SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.filter = 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))';
        
        // Add defs for filters and gradients
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        
        // Glow filter
        const glowFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        glowFilter.setAttribute('id', 'nodeGlow');
        const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        blur.setAttribute('stdDeviation', '3');
        blur.setAttribute('result', 'coloredBlur');
        const merge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
        merge.appendChild(createElement('feMergeNode', {in: 'coloredBlur'}));
        merge.appendChild(createElement('feMergeNode', {in: 'SourceGraphic'}));
        glowFilter.appendChild(blur);
        glowFilter.appendChild(merge);
        defs.appendChild(glowFilter);
        
        // Line glow filter
        const lineGlow = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        lineGlow.setAttribute('id', 'lineGlow');
        const lineBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        lineBlur.setAttribute('stdDeviation', '4');
        lineBlur.setAttribute('result', 'coloredBlur');
        const lineMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
        lineMerge.appendChild(createElement('feMergeNode', {in: 'coloredBlur'}));
        lineMerge.appendChild(createElement('feMergeNode', {in: 'SourceGraphic'}));
        lineGlow.appendChild(lineBlur);
        lineGlow.appendChild(lineMerge);
        defs.appendChild(lineGlow);
        
        // Animated gradient for data flow
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'dataFlowGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '0%');
        gradient.appendChild(createStop('0%', '#ffd700', '0'));
        gradient.appendChild(createStop('50%', '#00ffff', '1'));
        gradient.appendChild(createStop('100%', '#ffd700', '0'));
        defs.appendChild(gradient);
        
        svg.appendChild(defs);
        
        // Create node positions (hexagonal grid)
        const nodes = [];
        const hexRadius = Math.min(width, height) * 0.12;
        const hexSpacing = hexRadius * 2.2;
        
        // Center node
        nodes.push({id: 'center', x: centerX, y: centerY, label: 'Center', isCenter: true});
        
        // First ring: 6 nodes
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6 - Math.PI / 2;
            nodes.push({
                id: `ring1_${i}`,
                x: centerX + hexSpacing * Math.cos(angle),
                y: centerY + hexSpacing * Math.sin(angle),
                label: ['A1', 'A2', 'S1', 'S2', 'Syn', 'Ex'][i]
            });
        }
        
        // Second ring: 12 nodes (2 per first ring node)
        let ring2Index = 0;
        for (let i = 0; i < 6; i++) {
            const angle1 = (i * Math.PI * 2) / 6 - Math.PI / 2;
            const angle2 = ((i + 1) * Math.PI * 2) / 6 - Math.PI / 2;
            const midAngle = (angle1 + angle2) / 2;
            
            for (let j = 0; j < 2; j++) {
                const offset = (j - 0.5) * 0.3;
                const angle = midAngle + offset;
                nodes.push({
                    id: `ring2_${ring2Index}`,
                    x: centerX + hexSpacing * 1.7 * Math.cos(angle),
                    y: centerY + hexSpacing * 1.7 * Math.sin(angle),
                    label: `O${ring2Index + 1}`
                });
                ring2Index++;
            }
        }
        
        // Create connections (each node to its 5 nearest neighbors)
        const connections = [];
        nodes.forEach((node, i) => {
            const distances = nodes.map((other, j) => {
                if (i === j) return {node: other, dist: Infinity};
                const dx = node.x - other.x;
                const dy = node.y - other.y;
                return {node: other, dist: Math.sqrt(dx * dx + dy * dy)};
            });
            
            distances.sort((a, b) => a.dist - b.dist);
            const neighbors = distances.slice(0, 5);
            
            neighbors.forEach(neighbor => {
                const connId = [node.id, neighbor.node.id].sort().join('_');
                if (!connections.find(c => c.id === connId)) {
                    connections.push({
                        id: connId,
                        from: node,
                        to: neighbor.node,
                        active: Math.random() > 0.3 // 70% active
                    });
                }
            });
        });
        
        // Draw connections
        const connectionsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        connectionsGroup.setAttribute('id', 'connections');
        connections.forEach((conn, index) => {
            const line = createElement('line', {
                x1: conn.from.x,
                y1: conn.from.y,
                x2: conn.to.x,
                y2: conn.to.y,
                stroke: conn.active ? 'url(#dataFlowGradient)' : '#ffd700',
                'stroke-width': conn.active ? '3' : '1.5',
                opacity: conn.active ? '0.8' : '0.3',
                filter: 'url(#lineGlow)',
                'data-connection-id': conn.id,
                'data-active': conn.active
            });
            
            if (conn.active) {
                line.style.animation = `dataFlowPulse ${1 + (index % 3)}s linear infinite`;
            }
            
            connectionsGroup.appendChild(line);
        });
        svg.appendChild(connectionsGroup);
        
        // Draw nodes
        const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        nodesGroup.setAttribute('id', 'nodes');
        nodes.forEach(node => {
            const nodeGroup = createElement('g', {
                transform: `translate(${node.x}, ${node.y})`,
                style: 'cursor: pointer;'
            });
            
            if (node.isCenter) {
                // Center node - larger hexagon
                const hex = createElement('polygon', {
                    points: '0,-35 30,-17 30,17 0,35 -30,17 -30,-17',
                    fill: 'none',
                    stroke: '#ffd700',
                    'stroke-width': '4',
                    filter: 'url(#nodeGlow)'
                });
                nodeGroup.appendChild(hex);
                
                const circle = createElement('circle', {
                    r: '15',
                    fill: '#ffd700',
                    opacity: '0.3'
                });
                nodeGroup.appendChild(circle);
                
                const text = createElement('text', {
                    x: '0',
                    y: '5',
                    'text-anchor': 'middle',
                    fill: '#ffd700',
                    'font-size': '14',
                    'font-weight': 'bold'
                });
                text.textContent = 'Center';
                nodeGroup.appendChild(text);
            } else {
                // Regular node - smaller hexagon
                const hex = createElement('polygon', {
                    points: '0,-25 22,-12 22,12 0,25 -22,12 -22,-12',
                    fill: 'none',
                    stroke: '#00ffff',
                    'stroke-width': '2',
                    filter: 'url(#nodeGlow)'
                });
                nodeGroup.appendChild(hex);
                
                const text = createElement('text', {
                    x: '0',
                    y: '5',
                    'text-anchor': 'middle',
                    fill: '#00ffff',
                    'font-size': '12',
                    'font-weight': 'bold'
                });
                text.textContent = node.label;
                nodeGroup.appendChild(text);
            }
            
            nodesGroup.appendChild(nodeGroup);
        });
        svg.appendChild(nodesGroup);
        
        container.appendChild(svg);
        
        // Helper functions
        function createElement(tag, attrs = {}) {
            const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
            Object.entries(attrs).forEach(([key, value]) => {
                el.setAttribute(key, value);
            });
            return el;
        }
        
        function createStop(offset, color, opacity) {
            return createElement('stop', {
                offset: offset,
                'stop-color': color,
                'stop-opacity': opacity
            });
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHexagonalMesh);
    } else {
        initHexagonalMesh();
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes dataFlowPulse {
            0%, 100% {
                opacity: 0.4;
                filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
            }
            50% {
                opacity: 1;
                filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 30px rgba(0, 255, 255, 0.6));
            }
        }
    `;
    document.head.appendChild(style);
})();

