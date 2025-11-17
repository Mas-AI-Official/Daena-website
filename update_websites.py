#!/usr/bin/env python3
"""
Update both daena-website and mas-ai websites with latest features and Metatron's Cube visualization.
"""

import re
from pathlib import Path

def read_file(filepath):
    """Read file content."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    """Write file content."""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def insert_after_pattern(content, pattern, insert_text):
    """Insert text after a pattern match."""
    match = re.search(pattern, content, re.DOTALL)
    if match:
        insert_pos = match.end()
        return content[:insert_pos] + '\n' + insert_text + '\n' + content[insert_pos:]
    return content

# Metatron's Cube visualization HTML
METATRON_VIZ_HTML = '''
    <!-- Metatron's Cube Visualization Section -->
    <section class="metatron-section" id="agent-communication-viz" style="padding: 6rem 2rem; background: radial-gradient(circle at center, rgba(255, 215, 0, 0.05) 0%, transparent 70%);">
        <div style="max-width: 1200px; margin: 0 auto;">
            <h2 class="section-title">🌐 Agent Communication Visualization</h2>
            <p style="text-align: center; color: var(--text-muted); font-size: 1.2rem; margin-bottom: 3rem; max-width: 800px; margin-left: auto; margin-right: auto;">
                Experience Daena's revolutionary Metatron's Cube communication pattern - showing how 6 agents within each department communicate with live data flow
            </p>
            
            <div class="metatron-container" style="position: relative; width: 100%; max-width: 800px; height: 600px; margin: 2rem auto; background: radial-gradient(circle at center, rgba(255, 215, 0, 0.05) 0%, transparent 70%); border-radius: 20px; overflow: hidden;">
                <svg class="metatron-svg" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3));">
                    <!-- Center circle -->
                    <circle class="metatron-circle-center" cx="400" cy="300" r="40" style="fill: rgba(255, 215, 0, 0.2); stroke: #FFD700; stroke-width: 3; filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)); animation: pulse-center 2s ease-in-out infinite;"/>
                    <circle class="metatron-node-center" cx="400" cy="300" r="8" style="fill: #FFD700; stroke: #00bcd4; stroke-width: 3; filter: drop-shadow(0 0 20px rgba(255, 215, 0, 1)); animation: pulse-center-node 1.5s ease-in-out infinite;"/>
                    <text x="400" y="305" style="fill: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; font-weight: bold; text-anchor: middle; pointer-events: none; filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.8));">Center</text>

                    <!-- Inner hexagon (6 circles) -->
                    <circle cx="400" cy="200" r="30" style="fill: none; stroke: #FFD700; stroke-width: 2; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)); animation: pulse-circle 3s ease-in-out infinite;"/>
                    <circle cx="400" cy="200" r="6" style="fill: #FFD700; stroke: #00bcd4; stroke-width: 2; filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)); animation: pulse-node 2s ease-in-out infinite; cursor: pointer;"/>
                    <text x="400" y="205" style="fill: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; font-weight: bold; text-anchor: middle; pointer-events: none; filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.8));">A1</text>

                    <circle cx="500" cy="250" r="30" style="fill: none; stroke: #FFD700; stroke-width: 2; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)); animation: pulse-circle 3s ease-in-out infinite;"/>
                    <circle cx="500" cy="250" r="6" style="fill: #FFD700; stroke: #00bcd4; stroke-width: 2; filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)); animation: pulse-node 2s ease-in-out infinite; cursor: pointer;"/>
                    <text x="500" y="255" style="fill: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; font-weight: bold; text-anchor: middle; pointer-events: none; filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.8));">A2</text>

                    <circle cx="500" cy="350" r="30" style="fill: none; stroke: #FFD700; stroke-width: 2; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)); animation: pulse-circle 3s ease-in-out infinite;"/>
                    <circle cx="500" cy="350" r="6" style="fill: #FFD700; stroke: #00bcd4; stroke-width: 2; filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)); animation: pulse-node 2s ease-in-out infinite; cursor: pointer;"/>
                    <text x="500" y="355" style="fill: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; font-weight: bold; text-anchor: middle; pointer-events: none; filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.8));">S1</text>

                    <circle cx="400" cy="400" r="30" style="fill: none; stroke: #FFD700; stroke-width: 2; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)); animation: pulse-circle 3s ease-in-out infinite;"/>
                    <circle cx="400" cy="400" r="6" style="fill: #FFD700; stroke: #00bcd4; stroke-width: 2; filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)); animation: pulse-node 2s ease-in-out infinite; cursor: pointer;"/>
                    <text x="400" y="405" style="fill: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; font-weight: bold; text-anchor: middle; pointer-events: none; filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.8));">S2</text>

                    <circle cx="300" cy="350" r="30" style="fill: none; stroke: #FFD700; stroke-width: 2; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)); animation: pulse-circle 3s ease-in-out infinite;"/>
                    <circle cx="300" cy="350" r="6" style="fill: #FFD700; stroke: #00bcd4; stroke-width: 2; filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)); animation: pulse-node 2s ease-in-out infinite; cursor: pointer;"/>
                    <text x="300" y="355" style="fill: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; font-weight: bold; text-anchor: middle; pointer-events: none; filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.8));">Syn</text>

                    <circle cx="300" cy="250" r="30" style="fill: none; stroke: #FFD700; stroke-width: 2; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)); animation: pulse-circle 3s ease-in-out infinite;"/>
                    <circle cx="300" cy="250" r="6" style="fill: #FFD700; stroke: #00bcd4; stroke-width: 2; filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)); animation: pulse-node 2s ease-in-out infinite; cursor: pointer;"/>
                    <text x="300" y="255" style="fill: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; font-weight: bold; text-anchor: middle; pointer-events: none; filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.8));">Ex</text>

                    <!-- Outer hexagon (6 circles) -->
                    <circle cx="400" cy="120" r="25" style="fill: none; stroke: #FFD700; stroke-width: 2; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)); animation: pulse-circle 3s ease-in-out infinite;"/>
                    <circle cx="400" cy="120" r="5" style="fill: #FFD700; stroke: #00bcd4; stroke-width: 2; filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)); animation: pulse-node 2s ease-in-out infinite; cursor: pointer;"/>
                    <text x="400" y="125" style="fill: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; font-weight: bold; text-anchor: middle; pointer-events: none; filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.8));">O1</text>

                    <circle cx="560" cy="200" r="25" style="fill: none; stroke: #FFD700; stroke-width: 2; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)); animation: pulse-circle 3s ease-in-out infinite;"/>
                    <circle cx="560" cy="200" r="5" style="fill: #FFD700; stroke: #00bcd4; stroke-width: 2; filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)); animation: pulse-node 2s ease-in-out infinite; cursor: pointer;"/>
                    <text x="560" y="205" style="fill: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; font-weight: bold; text-anchor: middle; pointer-events: none; filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.8));">O2</text>

                    <circle cx="560" cy="400" r="25" style="fill: none; stroke: #FFD700; stroke-width: 2; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)); animation: pulse-circle 3s ease-in-out infinite;"/>
                    <circle cx="560" cy="400" r="5" style="fill: #FFD700; stroke: #00bcd4; stroke-width: 2; filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)); animation: pulse-node 2s ease-in-out infinite; cursor: pointer;"/>
                    <text x="560" y="405" style="fill: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; font-weight: bold; text-anchor: middle; pointer-events: none; filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.8));">O3</text>

                    <circle cx="400" cy="480" r="25" style="fill: none; stroke: #FFD700; stroke-width: 2; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)); animation: pulse-circle 3s ease-in-out infinite;"/>
                    <circle cx="400" cy="480" r="5" style="fill: #FFD700; stroke: #00bcd4; stroke-width: 2; filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)); animation: pulse-node 2s ease-in-out infinite; cursor: pointer;"/>
                    <text x="400" y="485" style="fill: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; font-weight: bold; text-anchor: middle; pointer-events: none; filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.8));">O4</text>

                    <circle cx="240" cy="400" r="25" style="fill: none; stroke: #FFD700; stroke-width: 2; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)); animation: pulse-circle 3s ease-in-out infinite;"/>
                    <circle cx="240" cy="400" r="5" style="fill: #FFD700; stroke: #00bcd4; stroke-width: 2; filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)); animation: pulse-node 2s ease-in-out infinite; cursor: pointer;"/>
                    <text x="240" y="405" style="fill: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; font-weight: bold; text-anchor: middle; pointer-events: none; filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.8));">O5</text>

                    <circle cx="240" cy="200" r="25" style="fill: none; stroke: #FFD700; stroke-width: 2; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)); animation: pulse-circle 3s ease-in-out infinite;"/>
                    <circle cx="240" cy="200" r="5" style="fill: #FFD700; stroke: #00bcd4; stroke-width: 2; filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)); animation: pulse-node 2s ease-in-out infinite; cursor: pointer;"/>
                    <text x="240" y="205" style="fill: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; font-weight: bold; text-anchor: middle; pointer-events: none; filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.8));">O6</text>

                    <!-- Lines connecting all nodes (Metatron's Cube pattern) -->
                    <!-- Center to inner hexagon -->
                    <line x1="400" y1="300" x2="400" y2="200" style="stroke: #FFD700; stroke-width: 2; opacity: 0.8; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)); stroke-dasharray: 10 5; animation: flow-data 2s linear infinite;"/>
                    <line x1="400" y1="300" x2="500" y2="250" style="stroke: #FFD700; stroke-width: 2; opacity: 0.8; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)); stroke-dasharray: 10 5; animation: flow-data 2s linear infinite;"/>
                    <line x1="400" y1="300" x2="500" y2="350" style="stroke: #FFD700; stroke-width: 2; opacity: 0.8; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)); stroke-dasharray: 10 5; animation: flow-data 2s linear infinite;"/>
                    <line x1="400" y1="300" x2="400" y2="400" style="stroke: #FFD700; stroke-width: 2; opacity: 0.8; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)); stroke-dasharray: 10 5; animation: flow-data 2s linear infinite;"/>
                    <line x1="400" y1="300" x2="300" y2="350" style="stroke: #FFD700; stroke-width: 2; opacity: 0.8; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)); stroke-dasharray: 10 5; animation: flow-data 2s linear infinite;"/>
                    <line x1="400" y1="300" x2="300" y2="250" style="stroke: #FFD700; stroke-width: 2; opacity: 0.8; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)); stroke-dasharray: 10 5; animation: flow-data 2s linear infinite;"/>

                    <!-- Inner hexagon connections -->
                    <line x1="400" y1="200" x2="500" y2="250" style="stroke: #00bcd4; stroke-width: 1.5; opacity: 0.6; filter: drop-shadow(0 0 4px rgba(0, 188, 212, 0.5));"/>
                    <line x1="500" y1="250" x2="500" y2="350" style="stroke: #00bcd4; stroke-width: 1.5; opacity: 0.6; filter: drop-shadow(0 0 4px rgba(0, 188, 212, 0.5));"/>
                    <line x1="500" y1="350" x2="400" y2="400" style="stroke: #00bcd4; stroke-width: 1.5; opacity: 0.6; filter: drop-shadow(0 0 4px rgba(0, 188, 212, 0.5));"/>
                    <line x1="400" y1="400" x2="300" y2="350" style="stroke: #00bcd4; stroke-width: 1.5; opacity: 0.6; filter: drop-shadow(0 0 4px rgba(0, 188, 212, 0.5));"/>
                    <line x1="300" y1="350" x2="300" y2="250" style="stroke: #00bcd4; stroke-width: 1.5; opacity: 0.6; filter: drop-shadow(0 0 4px rgba(0, 188, 212, 0.5));"/>
                    <line x1="300" y1="250" x2="400" y2="200" style="stroke: #00bcd4; stroke-width: 1.5; opacity: 0.6; filter: drop-shadow(0 0 4px rgba(0, 188, 212, 0.5));"/>

                    <!-- Inner to outer hexagon -->
                    <line x1="400" y1="200" x2="400" y2="120" style="stroke: #FFD700; stroke-width: 2; opacity: 0.8; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)); stroke-dasharray: 10 5; animation: flow-data 2s linear infinite;"/>
                    <line x1="500" y1="250" x2="560" y2="200" style="stroke: #FFD700; stroke-width: 2; opacity: 0.8; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)); stroke-dasharray: 10 5; animation: flow-data 2s linear infinite;"/>
                    <line x1="500" y1="350" x2="560" y2="400" style="stroke: #FFD700; stroke-width: 2; opacity: 0.8; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)); stroke-dasharray: 10 5; animation: flow-data 2s linear infinite;"/>
                    <line x1="400" y1="400" x2="400" y2="480" style="stroke: #FFD700; stroke-width: 2; opacity: 0.8; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)); stroke-dasharray: 10 5; animation: flow-data 2s linear infinite;"/>
                    <line x1="300" y1="350" x2="240" y2="400" style="stroke: #FFD700; stroke-width: 2; opacity: 0.8; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)); stroke-dasharray: 10 5; animation: flow-data 2s linear infinite;"/>
                    <line x1="300" y1="250" x2="240" y2="200" style="stroke: #FFD700; stroke-width: 2; opacity: 0.8; filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)); stroke-dasharray: 10 5; animation: flow-data 2s linear infinite;"/>

                    <!-- Outer hexagon connections -->
                    <line x1="400" y1="120" x2="560" y2="200" style="stroke: #00bcd4; stroke-width: 1.5; opacity: 0.6; filter: drop-shadow(0 0 4px rgba(0, 188, 212, 0.5));"/>
                    <line x1="560" y1="200" x2="560" y2="400" style="stroke: #00bcd4; stroke-width: 1.5; opacity: 0.6; filter: drop-shadow(0 0 4px rgba(0, 188, 212, 0.5));"/>
                    <line x1="560" y1="400" x2="400" y2="480" style="stroke: #00bcd4; stroke-width: 1.5; opacity: 0.6; filter: drop-shadow(0 0 4px rgba(0, 188, 212, 0.5));"/>
                    <line x1="400" y1="480" x2="240" y2="400" style="stroke: #00bcd4; stroke-width: 1.5; opacity: 0.6; filter: drop-shadow(0 0 4px rgba(0, 188, 212, 0.5));"/>
                    <line x1="240" y1="400" x2="240" y2="200" style="stroke: #00bcd4; stroke-width: 1.5; opacity: 0.6; filter: drop-shadow(0 0 4px rgba(0, 188, 212, 0.5));"/>
                    <line x1="240" y1="200" x2="400" y2="120" style="stroke: #00bcd4; stroke-width: 1.5; opacity: 0.6; filter: drop-shadow(0 0 4px rgba(0, 188, 212, 0.5));"/>
                </svg>
                <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(15, 15, 35, 0.9); backdrop-filter: blur(10px); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 10px; padding: 1rem; color: #ffffff; font-size: 0.9rem; text-align: center; max-width: 90%;">
                    <strong style="color: #FFD700;">Metatron's Cube Communication Pattern</strong><br>
                    Golden lines represent <strong>live data flow</strong> between agents. Each node represents an agent role within a department.
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 3rem;">
                <div class="feature-card" style="text-align: center;">
                    <div class="feature-icon">⚡</div>
                    <h3>Live Data Flow</h3>
                    <p>Golden animated lines represent real-time data flowing between agents</p>
                </div>
                <div class="feature-card" style="text-align: center;">
                    <div class="feature-icon">🔗</div>
                    <h3>13 Interconnected Nodes</h3>
                    <p>Center + 6 inner + 6 outer agents forming Metatron's Cube pattern</p>
                </div>
                <div class="feature-card" style="text-align: center;">
                    <div class="feature-icon">🎯</div>
                    <h3>6 Agent Roles</h3>
                    <p>Advisor A/B, Scout Internal/External, Synthesizer, Executor</p>
                </div>
            </div>
        </div>
    </section>
    
    <style>
        @keyframes pulse-circle {
            0%, 100% { opacity: 0.6; stroke-width: 2; }
            50% { opacity: 1; stroke-width: 3; }
        }
        @keyframes pulse-center {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes pulse-node {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes pulse-center-node {
            0%, 100% { opacity: 0.9; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes flow-data {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 15; }
        }
    </style>
'''

# Latest Features Section HTML
LATEST_FEATURES_HTML = '''
    <!-- Latest Features Section -->
    <section class="features" id="latest-features" style="padding: 6rem 2rem; background: rgba(0, 0, 0, 0.2);">
        <h2 class="section-title">🚀 Latest Revolutionary Features</h2>
        <p style="text-align: center; color: var(--text-muted); font-size: 1.2rem; margin-bottom: 3rem; max-width: 800px; margin-left: auto; margin-right: auto;">
            Daena continues to evolve with cutting-edge technology that sets new industry standards
        </p>
        
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">🧠</div>
                <h3>NBMF Memory System</h3>
                <p><strong>3-Tier Architecture:</strong> L1 Hot (vector embeddings), L2 Warm (NBMF compressed), L3 Cold (summarized archives)</p>
                <ul style="text-align: left; margin-top: 1rem; color: var(--text-muted); list-style: none; padding-left: 0;">
                    <li>✅ CAS + SimHash: 60%+ cost savings</li>
                    <li>✅ Progressive compression & aging</li>
                    <li>✅ AES-256 encryption at rest</li>
                    <li>✅ Complete audit trail</li>
                </ul>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🌐</div>
                <h3>Hex-Mesh Communication</h3>
                <p><strong>Phase-Locked Council Rounds:</strong> Scout → Debate → Commit phases for structured decision-making</p>
                <ul style="text-align: left; margin-top: 1rem; color: var(--text-muted); list-style: none; padding-left: 0;">
                    <li>✅ Topic-based pub/sub (cell/ring/radial/global)</li>
                    <li>✅ Quorum consensus (4/6 neighbors)</li>
                    <li>✅ Token-based backpressure</li>
                    <li>✅ Adaptive fanout routing</li>
                </ul>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🛡️</div>
                <h3>Trust & Governance Pipeline</h3>
                <p><strong>Enterprise-Grade Security:</strong> Quarantine store, trust scoring, and automatic promotion</p>
                <ul style="text-align: left; margin-top: 1rem; color: var(--text-muted); list-style: none; padding-left: 0;">
                    <li>✅ Quarantine validation before promotion</li>
                    <li>✅ Ledger with Merkle roots</li>
                    <li>✅ ABAC policy enforcement</li>
                    <li>✅ Weekly automated compliance drills</li>
                </ul>
            </div>

            <div class="feature-card">
                <div class="feature-icon">📡</div>
                <h3>Presence Beacons</h3>
                <p><strong>Real-Time State Tracking:</strong> Monitor agent health and optimize routing dynamically</p>
                <ul style="text-align: left; margin-top: 1rem; color: var(--text-muted); list-style: none; padding-left: 0;">
                    <li>✅ ONLINE, BUSY, OVERLOADED, OFFLINE states</li>
                    <li>✅ Heartbeat monitoring</li>
                    <li>✅ Adaptive fanout calculation</li>
                    <li>✅ Load-aware routing</li>
                </ul>
            </div>

            <div class="feature-card">
                <div class="feature-icon">💾</div>
                <h3>Abstract + Lossless Pattern</h3>
                <p><strong>Hybrid Storage:</strong> Abstract NBMF with OCR fallback for maximum efficiency</p>
                <ul style="text-align: left; margin-top: 1rem; color: var(--text-muted); list-style: none; padding-left: 0;">
                    <li>✅ Abstract NBMF (80%+ queries)</li>
                    <li>✅ OCR fallback (layout-critical)</li>
                    <li>✅ Provenance chain tracking</li>
                    <li>✅ Confidence-based routing</li>
                </ul>
            </div>

            <div class="feature-card">
                <div class="feature-icon">✅</div>
                <h3>Compliance Automation</h3>
                <p><strong>Automated Governance:</strong> Weekly drills, manifest verification, and complete audit reports</p>
                <ul style="text-align: left; margin-top: 1rem; color: var(--text-muted); list-style: none; padding-left: 0;">
                    <li>✅ Weekly automated drill bundle</li>
                    <li>✅ Signed rotation manifests</li>
                    <li>✅ Governance artifact generation</li>
                    <li>✅ CI/CD integration</li>
                </ul>
            </div>
        </div>
    </section>
'''

def update_daena_website():
    """Update daena-website/index.html"""
    daena_path = Path(__file__).parent / "index.html"
    if not daena_path.exists():
        print(f"Error: {daena_path} not found")
        return False
    
    content = read_file(daena_path)
    
    # Insert latest features after existing features section
    content = insert_after_pattern(
        content,
        r'</section>\s*<!-- Competitive Analysis Section -->',
        LATEST_FEATURES_HTML + METATRON_VIZ_HTML
    )
    
    write_file(daena_path, content)
    print(f"OK: Updated {daena_path}")
    return True

def update_mas_ai_website():
    """Update mas-ai/index.html"""
    mas_ai_path = Path(__file__).parent.parent / "mas-ai" / "index.html"
    if not mas_ai_path.exists():
        print(f"Error: {mas_ai_path} not found")
        return False
    
    content = read_file(mas_ai_path)
    
    # Insert latest features after Daena spotlight section
    content = insert_after_pattern(
        content,
        r'</section>\s*<!-- Contact / Request Demo -->',
        LATEST_FEATURES_HTML + METATRON_VIZ_HTML
    )
    
    write_file(mas_ai_path, content)
    print(f"OK: Updated {mas_ai_path}")
    return True

if __name__ == "__main__":
    print("Updating websites with latest features...")
    update_daena_website()
    update_mas_ai_website()
    print("OK: Website updates complete!")

