class SunflowerHoneycombDemo {
            constructor() {
                this.isExecuting = false;
                this.departments = {};
                this.agents = {};
                this.messageCount = 0;
                this.crossDeptCount = 0;
                this.totalConfidence = 0;
                this.confidenceCount = 0;
                this.demoStart = null;
                this.progressTimer = null;
                this.stepsTotal = 0;
                this.stepsDone = 0;
                
                this.init();
            }

            init() {
                this.executeBtn = document.getElementById('executeBtn');
                this.resetBtn = document.getElementById('resetBtn');
                this.communicationLog = document.getElementById('communicationLog');
                this.narrationAudio = document.getElementById('narrationAudio');
                this.backgroundMusic = document.getElementById('backgroundMusic');
                this.volumeSlider = document.getElementById('volumeSlider');
                this.playNarrationBtn = document.getElementById('playNarrationBtn');
                this.playMusicBtn = document.getElementById('playMusicBtn');

                this.setupEventListeners();
                this.initializeDepartments();
                this.resetDemo();
            }

            setupEventListeners() {
                this.executeBtn.addEventListener('click', () => {
                    if (!this.isExecuting) {
                        this.startDemo();
                    } else {
                        this.stopDemo();
                    }
                });

                this.resetBtn.addEventListener('click', () => this.resetDemo());
                this.playNarrationBtn.addEventListener('click', () => this.toggleNarration());
                this.playMusicBtn.addEventListener('click', () => this.toggleBackgroundMusic());
                this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));

                // Timeline elements
                this.timelinePhase = document.getElementById('timelinePhase');
                this.progressFill = document.getElementById('progressFill');
                this.elapsedTimeEl = document.getElementById('elapsedTime');
                this.remainingTimeEl = document.getElementById('remainingTime');

                // Load narration audio - Using the correct voice-over for Sunflower Honeycomb
                this.narrationAudio.src = '/live-demos/audio/Demo 1 Agent Communication.mp3';
                this.narrationAudio.volume = 0.8;
                
                // Load background music - using a different audio file to avoid pitch deck voice-over
                this.backgroundMusic.src = '/live-demos/audio/slide-2.mp3'; // Using slide-2 instead of slide-1
                this.backgroundMusic.volume = 0.05; // Lower volume to avoid interference
            }

            initializeDepartments() {
                const departments = [
                    { name: 'ENGINEERING', color: '#FF6B35' },
                    { name: 'MARKETING', color: '#4ECDC4' },
                    { name: 'SALES', color: '#45B7D1' },
                    { name: 'OPERATIONS', color: '#96CEB4' },
                    { name: 'FINANCE', color: '#FFEAA7' },
                    { name: 'HUMAN RESOURCES', color: '#DDA0DD' },
                    { name: 'LEGAL', color: '#98D8C8' },
                    { name: 'PRODUCT', color: '#F7DC6F' }
                ];

                const agentTypes = ['Strategic', 'Growth', 'Research', 'Data', 'Border', 'Exec'];

                const departmentsGrid = document.getElementById('departmentsGrid');
                departmentsGrid.innerHTML = '';

                departments.forEach((dept, deptIndex) => {
                    const departmentCard = document.createElement('div');
                    departmentCard.className = 'department-card';
                    departmentCard.id = `dept-${deptIndex}`;
                    
                    departmentCard.innerHTML = `
                        <div class="department-title">${dept.name}</div>
                        <div class="agents-grid" id="agents-${deptIndex}">
                            ${agentTypes.map((type, agentIndex) => `
                                <div class="agent-mini" id="agent-${deptIndex}-${agentIndex}" data-dept="${deptIndex}" data-agent="${agentIndex}" data-type="${type}">
                                    ${type}
                                </div>
                            `).join('')}
                        </div>
                    `;
                    
                    departmentsGrid.appendChild(departmentCard);
                    
                    // Store department reference
                    this.departments[deptIndex] = {
                        name: dept.name,
                        element: departmentCard,
                        agents: {}
                    };
                    
                    // Store agent references
                    agentTypes.forEach((type, agentIndex) => {
                        const agentId = `agent-${deptIndex}-${agentIndex}`;
                        const agentElement = document.getElementById(agentId);
                        this.agents[agentId] = {
                            dept: deptIndex,
                            type: type,
                            element: agentElement,
                            status: 'idle'
                        };
                    });
                });
            }

            resetDemo() {
                // Reset all agents to idle state
                Object.keys(this.agents).forEach(agentId => {
                    this.setAgentStatus(agentId, 'idle');
                });

                // Reset departments
                Object.keys(this.departments).forEach(deptId => {
                    this.departments[deptId].element.classList.remove('active');
                });

                // Reset communication log
                this.communicationLog.innerHTML = '<p style="color: #999; font-style: italic; text-align: center; padding: 2rem;">Agent communications will appear here when demo executes...</p>';

                // Reset stats
                this.messageCount = 0;
                this.crossDeptCount = 0;
                this.totalConfidence = 0;
                this.confidenceCount = 0;
                this.updateStats();

                // Reset buttons
                this.executeBtn.textContent = '🚀 START DEMO';
                this.executeBtn.classList.remove('executing');
                this.isExecuting = false;
            }

            async startDemo() {
                this.isExecuting = true;
                this.executeBtn.textContent = '⏸ STOP DEMO';
                this.executeBtn.classList.add('executing');

                // Clear previous log
                this.communicationLog.innerHTML = '';

                // Start narration first (the correct voice-over)
                this.narrationAudio.play().catch(e => console.log('Narration failed:', e));
                this.playNarrationBtn.textContent = '⏸ Pause Narration';

                // Background music disabled by default to avoid interference with narration
                // this.backgroundMusic.play().catch(e => console.log('Background music failed:', e));

                // Start timeline
                this.demoStart = Date.now();
                this.startProgressTimer();

                // Demo scenario: Healthcare AI market entry
                await this.executeHealthcareScenario();

                // Demo completed - narration continues until finished
            }

            stopDemo() {
                this.isExecuting = false;
                this.executeBtn.textContent = '🚀 START DEMO';
                this.executeBtn.classList.remove('executing');

                // Stop background music
                this.backgroundMusic.pause();

                // Stop narration
                this.narrationAudio.pause();
                this.playNarrationBtn.textContent = '🎵 Play Narration';

                // Reset all agents after a delay
                setTimeout(() => {
                    Object.keys(this.agents).forEach(agentId => {
                        this.setAgentStatus(agentId, 'idle');
                    });
                    Object.keys(this.departments).forEach(deptId => {
                        this.departments[deptId].element.classList.remove('active');
                    });
                }, 2000);
            }

            async executeHealthcareScenario() {
                const scenario = [
                    {
                        phase: 'border-handshake',
                        description: 'All Border agents establish cross-department channels',
                        narration: "All Border agents are now activating secure channels to share prerequisites across departments.",
                        departments: [0,1,2,3,4,5,6,7],
                        actions: [
                            { agent: 'agent-0-4', action: 'Engineering border channel established', confidence: 0.95 },
                            { agent: 'agent-1-4', action: 'Marketing border channel established', confidence: 0.95 },
                            { agent: 'agent-2-4', action: 'Sales border channel established', confidence: 0.95 },
                            { agent: 'agent-3-4', action: 'Operations border channel established', confidence: 0.95 },
                            { agent: 'agent-4-4', action: 'Finance border channel established', confidence: 0.95 },
                            { agent: 'agent-5-4', action: 'HR border channel established', confidence: 0.95 },
                            { agent: 'agent-6-4', action: 'Legal border channel established', confidence: 0.95 },
                            { agent: 'agent-7-4', action: 'Product border channel established', confidence: 0.95 }
                        ],
                        messages: [
                            { from: 'Engineering Border', to: 'All Borders', message: 'Channels ready – share inputs before research begins', type: 'SYNCHRONIZATION', confidence: 0.95 }
                        ]
                    },
                    {
                        phase: 'initiation',
                        description: 'Executive Agent initiates product launch analysis',
                        narration: "Welcome to Daena's Agent Communication Demo. Watch as our 6 specialized agents work together on a comprehensive product launch analysis.",
                        departments: [0], // Engineering
                        actions: [
                            { agent: 'agent-0-5', action: 'Initiating product launch analysis', confidence: 0.95 }
                        ],
                        messages: [
                            { from: 'Engineering Exec', to: 'All Departments', message: 'Product launch analysis initiated - coordinating with all agents', type: 'INITIATION', confidence: 0.95 }
                        ]
                    },
                    {
                        phase: 'research',
                        description: 'Research agents gather market data',
                        narration: "The Research Agent gathers market data and competitor analysis, communicating findings to other departments.",
                        departments: [0, 1, 2, 3, 4, 5, 6, 7], // All departments
                        actions: [
                            { agent: 'agent-0-2', action: 'Analyzing market trends and competitor data', confidence: 0.92 },
                            { agent: 'agent-1-2', action: 'Researching target demographics and market segments', confidence: 0.88 },
                            { agent: 'agent-2-2', action: 'Studying competitor strategies and pricing', confidence: 0.90 },
                            { agent: 'agent-3-2', action: 'Evaluating operational requirements and capacity', confidence: 0.87 },
                            { agent: 'agent-4-2', action: 'Analyzing financial projections and ROI', confidence: 0.93 },
                            { agent: 'agent-5-2', action: 'Researching talent requirements and availability', confidence: 0.85 },
                            { agent: 'agent-6-2', action: 'Studying regulatory compliance requirements', confidence: 0.91 },
                            { agent: 'agent-7-2', action: 'Analyzing product requirements and specifications', confidence: 0.89 }
                        ],
                        messages: [
                            { from: 'Engineering Research', to: 'Marketing Research', message: 'Market trends analysis complete - 15% growth projected', type: 'DATA_SHARE', confidence: 0.92 },
                            { from: 'Marketing Research', to: 'Sales Research', message: 'Target demographics identified - 2.3M potential customers', type: 'COLLABORATION', confidence: 0.88 },
                            { from: 'Finance Research', to: 'Operations Research', message: 'Financial projections aligned with operational capacity', type: 'COORDINATION', confidence: 0.90 }
                        ]
                    },
                    {
                        phase: 'strategy',
                        description: 'Marketing Agent develops go-to-market strategy',
                        narration: "The Marketing Agent develops the go-to-market strategy based on research insights.",
                        departments: [1], // Marketing
                        actions: [
                            { agent: 'agent-1-0', action: 'Creating comprehensive marketing strategy', confidence: 0.91 },
                            { agent: 'agent-1-1', action: 'Developing growth strategies and expansion plans', confidence: 0.89 },
                            { agent: 'agent-1-4', action: 'Coordinating cross-department communication', confidence: 0.87 }
                        ],
                        messages: [
                            { from: 'Marketing Strategic', to: 'Marketing Growth', message: 'Go-to-market strategy synchronized with growth objectives', type: 'SYNCHRONIZATION', confidence: 0.90 },
                            { from: 'Marketing Border', to: 'Sales Border', message: 'Marketing strategy ready for sales coordination', type: 'COORDINATION', confidence: 0.87 }
                        ]
                    },
                    {
                        phase: 'execution',
                        description: 'Finance Agent calculates comprehensive budgets',
                        narration: "The Finance Agent calculates comprehensive budgets and ROI projections.",
                        departments: [4], // Finance
                        actions: [
                            { agent: 'agent-4-0', action: 'Developing comprehensive financial strategy', confidence: 0.93 },
                            { agent: 'agent-4-1', action: 'Calculating growth projections and expansion budgets', confidence: 0.91 },
                            { agent: 'agent-4-2', action: 'Researching market financial trends', confidence: 0.89 },
                            { agent: 'agent-4-3', action: 'Processing financial data and analytics', confidence: 0.94 },
                            { agent: 'agent-4-4', action: 'Coordinating financial communication across departments', confidence: 0.87 },
                            { agent: 'agent-4-5', action: 'Executing financial implementation and monitoring', confidence: 0.92 }
                        ],
                        messages: [
                            { from: 'Finance Strategic', to: 'Finance Growth', message: 'Budget allocation optimized for growth objectives', type: 'OPTIMIZATION', confidence: 0.93 },
                            { from: 'Finance Data', to: 'Finance Border', message: 'Financial analytics ready for cross-department sharing', type: 'DATA_SHARE', confidence: 0.94 },
                            { from: 'Finance Border', to: 'All Departments', message: 'Budget calculations complete - ROI projections available', type: 'COORDINATION', confidence: 0.87 }
                        ]
                    },
                    {
                        phase: 'operations',
                        description: 'Operations Agent creates implementation timelines',
                        narration: "The Operations Agent creates implementation timelines and resource allocation plans.",
                        departments: [3], // Operations
                        actions: [
                            { agent: 'agent-3-0', action: 'Planning comprehensive operational strategy', confidence: 0.87 },
                            { agent: 'agent-3-1', action: 'Developing growth operational plans', confidence: 0.85 },
                            { agent: 'agent-3-2', action: 'Researching operational best practices', confidence: 0.88 },
                            { agent: 'agent-3-3', action: 'Processing operational data and metrics', confidence: 0.90 },
                            { agent: 'agent-3-4', action: 'Coordinating operational communication', confidence: 0.86 },
                            { agent: 'agent-3-5', action: 'Executing operational implementation', confidence: 0.89 }
                        ],
                        messages: [
                            { from: 'Operations Strategic', to: 'Operations Growth', message: 'Implementation timeline synchronized with growth plans', type: 'SYNCHRONIZATION', confidence: 0.87 },
                            { from: 'Operations Data', to: 'Operations Border', message: 'Resource allocation data ready for sharing', type: 'DATA_SHARE', confidence: 0.90 },
                            { from: 'Operations Border', to: 'All Departments', message: 'Implementation timelines and resource plans complete', type: 'COORDINATION', confidence: 0.86 }
                        ]
                    },
                    {
                        phase: 'sales',
                        description: 'Sales Agent prepares launch strategies',
                        narration: "The Sales Agent prepares launch strategies and aligns with marketing campaigns.",
                        departments: [2], // Sales
                        actions: [
                            { agent: 'agent-2-0', action: 'Formulating comprehensive sales strategy', confidence: 0.89 },
                            { agent: 'agent-2-1', action: 'Developing sales growth strategies', confidence: 0.87 },
                            { agent: 'agent-2-2', action: 'Researching sales market opportunities', confidence: 0.91 },
                            { agent: 'agent-2-3', action: 'Processing sales data and analytics', confidence: 0.88 },
                            { agent: 'agent-2-4', action: 'Coordinating sales communication', confidence: 0.85 },
                            { agent: 'agent-2-5', action: 'Executing sales implementation', confidence: 0.92 }
                        ],
                        messages: [
                            { from: 'Sales Strategic', to: 'Sales Growth', message: 'Launch strategy aligned with growth objectives', type: 'ALIGNMENT', confidence: 0.89 },
                            { from: 'Sales Data', to: 'Sales Border', message: 'Sales analytics ready for cross-department coordination', type: 'DATA_SHARE', confidence: 0.88 },
                            { from: 'Sales Border', to: 'Marketing Border', message: 'Sales strategy synchronized with marketing campaigns', type: 'COORDINATION', confidence: 0.85 }
                        ]
                    },
                    {
                        phase: 'finalization',
                        description: 'Executive Agent synthesizes all inputs',
                        narration: "The Executive Agent synthesizes all inputs and makes the final launch recommendation.",
                        departments: [0], // Engineering (Executive)
                        actions: [
                            { agent: 'agent-0-5', action: 'Synthesizing all agent inputs and recommendations', confidence: 0.97 },
                            { agent: 'agent-0-4', action: 'Coordinating final cross-department communication', confidence: 0.95 },
                            { agent: 'agent-0-3', action: 'Processing final data synthesis', confidence: 0.96 }
                        ],
                        messages: [
                            { from: 'Engineering Exec', to: 'All Agents', message: 'Product launch analysis complete - comprehensive strategy synthesized', type: 'FINAL_REPORT', confidence: 0.97 },
                            { from: 'Engineering Border', to: 'All Departments', message: 'Final recommendations ready for implementation', type: 'MISSION_COMPLETE', confidence: 0.95 }
                        ]
                    }
                ];

                // Calculate progress steps
                this.stepsTotal = scenario.reduce((acc, p) => acc + (p.actions?.length || 0) + (p.messages?.length || 0), 0);
                this.stepsDone = 0;
                for (let i = 0; i < scenario.length; i++) {
                    if (!this.isExecuting) break;

                    const phase = scenario[i];
                    this.updateTimelinePhase(phase.phase);
                    
                    // Update narration
                    this.addCommunicationMessage('System', 'All Agents', phase.narration, 'NARRATION', 1.0);

                    // Activate departments
                    phase.departments.forEach(deptId => {
                        this.departments[deptId].element.classList.add('active');
                    });

                    // Update agent activities
                    for (const action of phase.actions) {
                        const agentId = action.agent;
                        this.addAgentActivity(agentId, action.action, action.confidence);
                        this.setAgentStatus(agentId, 'active');
                        
                        // Add communication delay
                        await this.delay(800 + Math.random() * 400);
                        
                        this.setAgentStatus(agentId, 'communicating');
                        await this.delay(1200 + Math.random() * 600);
                        this.stepsDone += 1;
                        this.updateProgress();
                    }

                    // Add communication messages
                    for (const msg of phase.messages) {
                        this.addCommunicationMessage(msg.from, msg.to, msg.message, msg.type, msg.confidence);
                        await this.delay(1000 + Math.random() * 800);
                        this.stepsDone += 1;
                        this.updateProgress();
                    }

                    // Pause between phases
                    await this.delay(2000);
                }

                // Final narration
                this.addCommunicationMessage('System', 'All Agents', "Demo complete! This showcases Daena's revolutionary Agent Communication system with 6 specialized agents working in perfect harmony across departments.", 'FINAL_SUMMARY', 1.0);
                this.stepsDone = this.stepsTotal;
                this.updateProgress(true);
                this.stopProgressTimer();
            }

            setAgentStatus(agentId, status) {
                const agent = this.agents[agentId];
                if (!agent || !agent.element) return;

                agent.status = status;
                agent.element.className = `agent-mini ${status}`;
                
                // Add visual feedback
                if (status === 'active') {
                    agent.element.style.animation = 'pulse 1s infinite';
                } else if (status === 'communicating') {
                    agent.element.style.animation = 'glow 1s infinite';
                } else {
                    agent.element.style.animation = 'none';
                }
            }

            addAgentActivity(agentId, action, confidence) {
                const agent = this.agents[agentId];
                if (!agent) return;

                // Update confidence tracking
                this.totalConfidence += confidence;
                this.confidenceCount++;
                this.updateStats();
            }

            addCommunicationMessage(from, to, message, type, confidence) {
                this.messageCount++;
                
                // Check if cross-department
                if (from !== to && from !== 'System') {
                    this.crossDeptCount++;
                }

                const logEntry = document.createElement('div');
                logEntry.className = 'log-entry';
                
                const typeColors = {
                    'INITIATION': '#FF6B35',
                    'DATA_SHARE': '#4ECDC4',
                    'COLLABORATION': '#45B7D1',
                    'COORDINATION': '#96CEB4',
                    'ALIGNMENT': '#FFEAA7',
                    'SYNCHRONIZATION': '#DDA0DD',
                    'OPTIMIZATION': '#98D8C8',
                    'PROGRESS_UPDATE': '#F7DC6F',
                    'STATUS_UPDATE': '#FFB6C1',
                    'FINAL_REPORT': '#87CEEB',
                    'MISSION_COMPLETE': '#FFD700',
                    'NARRATION': '#FFA500',
                    'FINAL_SUMMARY': '#FF69B4'
                };

                logEntry.innerHTML = `
                    <div class="log-message">
                        <strong style="color: ${typeColors[type] || '#FFD700'}">[${type}]</strong> 
                        <strong>${from}</strong> → <strong>${to}</strong>: ${message}
                    </div>
                    <div class="log-meta">
                        Confidence: ${Math.round(confidence * 100)}% | 
                        Time: ${new Date().toLocaleTimeString()}
                    </div>
                `;

                this.communicationLog.appendChild(logEntry);
                this.communicationLog.scrollTop = this.communicationLog.scrollHeight;

                this.updateStats();
            }

            updateStats() {
                document.getElementById('activeAgents').textContent = Object.values(this.agents).filter(agent => agent.status === 'active' || agent.status === 'communicating').length;
                document.getElementById('messagesSent').textContent = this.messageCount;
                document.getElementById('crossDept').textContent = this.crossDeptCount;
                
                const avgConfidence = this.confidenceCount > 0 ? Math.round((this.totalConfidence / this.confidenceCount) * 100) : 0;
                document.getElementById('avgConfidence').textContent = `${avgConfidence}%`;
            }

            toggleNarration() {
                if (this.narrationAudio.paused) {
                    this.narrationAudio.play().catch(e => console.log('Narration failed:', e));
                    this.playNarrationBtn.textContent = '⏸ Pause Narration';
                } else {
                    this.narrationAudio.pause();
                    this.playNarrationBtn.textContent = '🎵 Play Narration';
                }
            }

            toggleBackgroundMusic() {
                if (this.backgroundMusic.paused) {
                    this.backgroundMusic.play().catch(e => console.log('Background music failed:', e));
                    this.playMusicBtn.textContent = '⏸ Stop Music';
                } else {
                    this.backgroundMusic.pause();
                    this.playMusicBtn.textContent = '🎶 Background Music';
                }
            }

            setVolume(value) {
                const volume = value / 100;
                this.narrationAudio.volume = volume * 0.8;
                this.backgroundMusic.volume = volume * 0.1;
            }

            delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            // Timeline helpers
            startProgressTimer() {
                if (this.progressTimer) clearInterval(this.progressTimer);
                this.progressTimer = setInterval(() => {
                    const elapsed = Math.max(0, Date.now() - this.demoStart);
                    this.elapsedTimeEl.textContent = this.formatTime(elapsed);
                }, 250);
            }

            stopProgressTimer() {
                if (this.progressTimer) clearInterval(this.progressTimer);
                this.progressTimer = null;
            }

            updateProgress(end = false) {
                const pct = this.stepsTotal > 0 ? Math.min(100, Math.round((this.stepsDone / this.stepsTotal) * 100)) : 0;
                this.progressFill.style.width = pct + '%';
                if (end) {
                    this.timelinePhase.textContent = 'complete';
                    this.remainingTimeEl.textContent = '00:00';
                } else {
                    // naive remaining estimate based on progress
                    const elapsed = Math.max(0, Date.now() - (this.demoStart || Date.now()));
                    const remainingMs = pct > 0 ? Math.max(0, Math.round((elapsed * (100 - pct)) / pct)) : 0;
                    this.remainingTimeEl.textContent = this.formatTime(remainingMs);
                }
            }

            updateTimelinePhase(name) {
                if (this.timelinePhase) this.timelinePhase.textContent = name.replace(/-/g, ' ');
            }

            formatTime(ms) {
                const sec = Math.round(ms / 1000);
                const m = String(Math.floor(sec / 60)).padStart(2, '0');
                const s = String(sec % 60).padStart(2, '0');
                return m + ':' + s;
            }
        }

        


