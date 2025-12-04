/**
 * Daena Live Agent Communication Demo Engine
 * Simulates real-time agent collaboration with synchronized voice-over
 */

class DaenaLiveDemo {
    constructor() {
        this.isExecuting = false;
        this.messageCount = 0;
        this.crossDeptCount = 0;
        this.knowledgeTransfers = 0;
        this.totalConfidence = 0;
        this.agentStates = {};
        this.communicationLog = [];
        
        this.init();
    }

    init() {
        this.agents = {
            'research-agent': { 
                name: 'Research Agent', 
                status: 'idle',
                activity: document.getElementById('research-activity'),
                statusEl: document.getElementById('research-status'),
                card: document.getElementById('research-agent')
            },
            'marketing-agent': { 
                name: 'Marketing Agent', 
                status: 'idle',
                activity: document.getElementById('marketing-activity'),
                statusEl: document.getElementById('marketing-status'),
                card: document.getElementById('marketing-agent')
            },
            'finance-agent': { 
                name: 'Finance Agent', 
                status: 'idle',
                activity: document.getElementById('finance-activity'),
                statusEl: document.getElementById('finance-status'),
                card: document.getElementById('finance-agent')
            },
            'operations-agent': { 
                name: 'Operations Agent', 
                status: 'idle',
                activity: document.getElementById('operations-activity'),
                statusEl: document.getElementById('operations-status'),
                card: document.getElementById('operations-agent')
            },
            'sales-agent': { 
                name: 'sales Agent', 
                status: 'idle',
                activity: document.getElementById('sales-activity'),
                statusEl: document.getElementById('sales-status'),
                card: document.getElementById('sales-agent')
            },
            'executive-agent': { 
                name: 'Executive Agent', 
                status: 'idle',
                activity: document.getElementById('executive-activity'),
                statusEl: document.getElementById('executive-status'),
                card: document.getElementById('executive-agent')
            }
        };

        this.executeBtn = document.getElementById('executeBtn');
        this.communicationLog = document.getElementById('communication-log');
        this.stats = {
            totalMessages: document.getElementById('total-messages'),
            crossDept: document.getElementById('cross-dept'),
            knowledgeTransfers: document.getElementById('knowledge-transfers'),
            confidence: document.getElementById('confidence')
        };

        this.setupEventListeners();
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
    }

    resetDemo() {
        // Reset all agents to idle state
        Object.values(this.agents).forEach(agent => {
            this.setAgentStatus(agent.key || 'unknown', 'idle');
            agent.activity.innerHTML = '<p style="color: #999; font-style: italic;">Waiting for task assignment...</p>';
        });

        // Reset communication log
        this.communicationLog.innerHTML = '<p style="color: #999; font-style: italic; text-align: center; padding: 2rem;">Communication log will appear here when demo executes...</p>';

        // Reset stats
        this.messageCount = 0;
        this.crossDeptCount = 0;
        this.knowledgeTransfers = 0;
        this.totalConfidence = 0;
        this.updateStats();
    }

    async startDemo() {
        this.isExecuting = true;
        this.executeBtn.textContent = '⏸ STOP REAL TIME DEMO';
        this.executeBtn.classList.add('executing');

        // Clear previous log
        this.communicationLog.innerHTML = '';

        // Demo scenario: New product launch analysis
        await this.executeProductLaunchScenario();

        this.stopDemo();
    }

    stopDemo() {
        this.isExecuting = false;
        this.executeBtn.textContent = '🔄 RESET & START REAL TIME DEMO';
        this.executeBtn.classList.remove('executing');

        // Reset all agents after a delay
        setTimeout(() => {
            Object.keys(this.agents).forEach(agentKey => {
                this.setAgentStatus(agentKey, 'idle');
            });
        }, 1000);
    }

    async executeProductLaunchScenario() {
        const scenario = [
            {
                phase: 'task-initiation',
                description: 'Executive Agent initiates new product launch analysis',
                actions: [
                    { agent: 'executive-agent', action: 'Initiating comprehensive product launch analysis', confidence: 0.95 },
                    { agent: 'executive-agent', action: 'Requesting cross-departmental collaboration', confidence: 0.90 }
                ],
                messages: [
                    { from: 'Executive Agent', to: 'All Agents', message: 'New product launch analysis initiated', type: 'TASK_ASSIGNMENT', confidence: 0.95 }
                ]
            },
            {
                phase: 'research-engagement',
                description: 'Research Agent begins market analysis',
                actions: [
                    { agent: 'research-agent', action: 'Starting market research data collection', confidence: 0.88 },
                    { agent: 'research-agent', action: 'Analyzing competitor landscape', confidence: 0.92 }
                ],
                messages: [
                    { from: 'Research Agent', to: 'Marketing Agent', message: 'Market insights ready for campaign analysis', type: 'DATA_SHARE', confidence: 0.88 },
                    { from: 'Research Agent', to: 'Finance Agent', message: 'Market sizing data prepared for budget calculations', type: 'CROSS_DEPT', confidence: 0.90 }
                ]
            },
            {
                phase: 'marketing-coordination',
                description: 'Marketing Agent develops strategy',
                actions: [
                    { agent: 'marketing-agent', action: 'Developing go-to-market strategy', confidence: 0.85 },
                    { agent: 'marketing-agent', action: 'Analyzing customer segments', confidence: 0.87 }
                ],
                messages: [
                    { from: 'Marketing Agent', to: 'Sales Agent', message: 'Revised sales targets based on market analysis', type: 'KNOWLEDGE_TRANSFER', confidence: 0.85 },
                    { from: 'Marketing Agent', to: 'Operations Agent', message: 'Support required for launch logistics', type: 'COORDINATION', confidence: 0.82 }
                ]
            },
            {
                phase: 'financial-analysis',
                description: 'Finance Agent calculates budgets and ROI',
                actions: [
                    { agent: 'finance-agent', action: 'Calculating comprehensive budget projections', confidence: 0.93 },
                    { agent: 'finance-agent', action: 'Analyzing ROI scenarios', confidence: 0.89 }
                ],
                messages: [
                    { from: 'Finance Agent', to: 'Executive Agent', message: 'Budget analysis complete with risk assessments', type: 'REPORT', confidence: 0.93 },
                    { from: 'Finance Agent', to: 'Operations Agent', message: 'Resource allocation recommendations', type: 'RECOMMENDATION', confidence: 0.91 }
                ]
            },
            {
                phase: 'operations-planning',
                description: 'Operations Agent plans implementation',
                actions: [
                    { agent: 'operations-agent', action: 'Developing operational timeline', confidence: 0.86 },
                    { agent: 'operations-agent', action: 'Coordinating resource allocation', confidence: 0.88 }
                ],
                messages: [
                    { from: 'Operations Agent', to: 'All Agents', message: 'Implementation timeline synchronized across departments', type: 'COORDINATION', confidence: 0.86 },
                    { from: 'Operations Agent', to: 'Sales Agent', message: 'Distribution channel readiness confirmed', type: 'STATUS_UPDATE', confidence: 0.89 }
                ]
            },
            {
                phase: 'sales-preparation',
                description: 'Sales Agent prepares for launch',
                actions: [
                    { agent: 'sales-agent', action: 'Optimizing sales processes for new product', confidence: 0.87 },
                    { agent: 'sales-agent', action: 'Aligning with marketing campaigns', confidence: 0.84 }
                ],
                messages: [
                    { from: 'Sales Agent', to: 'Executive Agent', message: 'Sales readiness confirmed with final preparation', type: 'STATUS_UPDATE', confidence: 0.87 },
                    { from: 'Sales Agent', to: 'Marketing Agent', message: 'Campaign alignment verified', type: 'VERIFICATION', confidence: 0.84 }
                ]
            },
            {
                phase: 'final-coordination',
                description: 'Executive Agent synthesizes all inputs',
                actions: [
                    { agent: 'executive-agent', action: 'Synthesizing comprehensive analysis', confidence: 0.94 },
                    { agent: 'executive-agent', action: 'Preparing final launch recommendation', confidence: 0.96 }
                ],
                messages: [
                    { from: 'Executive Agent', to: 'All Agents', message: 'Product launch analysis complete - all systems coordinated', type: 'FINAL_SUMMARY', confidence: 0.94 },
                    { from: 'Executive Agent', to: 'All Agents', message: 'Recommendation: Proceed with launch as planned', type: 'DECISION', confidence: 0.96 }
                ]
            }
        ];

        for (const phase of scenario) {
            if (!this.isExecuting) break;

            // Update agent activities
            for (const action of phase.actions) {
                const agentKey = Object.keys(this.agents).find(key => key === action.agent);
                if (agentKey) {
                    this.addAgentActivity(agentKey, action.action, action.confidence);
                    this.setAgentStatus(agentKey, 'active');
                    
                    // Add communication delay
                    await this.delay(800 + Math.random() * 400);
                    
                    this.setAgentStatus(agentKey, 'communicating');
                    await this.delay(1200 + Math.random() * 600);
                }
            }

            // Add communication messages
            for (const msg of phase.messages) {
                this.addCommunicationMessage(msg.from, msg.to, msg.message, msg.type, msg.confidence);
                await this.delay(1000 + Math.random() * 800);
            }

            // Pause between phases
            await this.delay(1500);
        }
    }

    setAgentStatus(agentKey, status) {
        const agent = this.agents[agentKey];
        if (!agent) return;

        agent.status = status;
        
        // Update status element
        agent.statusEl.textContent = status.toUpperCase();
        agent.statusEl.className = `agent-status status-${status}`;
        
        // Update card styling
        agent.card.classList.remove('active', 'communicating');
        if (status === 'active') {
            agent.card.classList.add('active');
        } else if (status === 'communicating') {
            agent.card.classList.add('communicating');
        }
    }

    addAgentActivity(agentKey, activity, confidence) {
        const agent = this.agents[agentKey];
        if (!agent) return;

        const time = new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });

        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-time">${time}</div>
            <span class="activity-icon">${this.getActivityIcon()}</span>
            <div class="activity-text">${activity}</div>
            <div class="log-type">(${(confidence * 100).toFixed(0)}%)</div>
        `;

        // Remove placeholder if exists
        const placeholder = agent.activity.querySelector('p[style*="italic"]');
        if (placeholder) {
            placeholder.remove();
        }

        agent.activity.appendChild(activityItem);
        agent.activity.scrollTop = agent.activity.scrollHeight;

        // Update confidence in stats
        this.totalConfidence += confidence;
    }

    addCommunicationMessage(from, to, message, type, confidence) {
        const time = new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit',


            minute: '2-digit', 
            second: '2-digit' 
        });

        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `
            <div class="log-time">${time}</div>
            <div class="log-agent">${from}</div>
            <div class="log-message">${message}</div>
            <div class="log-type">${type}</div>
        `;

        this.communicationLog.appendChild(logEntry);
        this.communicationLog.scrollTop = this.communicationLog.scrollHeight;

        // Update stats
        this.messageCount++;
        if (type === 'CROSS_DEPT' || type === 'DATA_SHARE') this.crossDeptCount++;
        if (type === 'KNOWLEDGE_TRANSFER') this.knowledgeTransfers++;
        this.totalConfidence += confidence;
        this.updateStats();
    }

    updateStats() {
        this.stats.totalMessages.textContent = `${this.messageCount} Total Messages`;
        this.stats.crossDept.textContent = `${this.crossDeptCount} Cross-Department`;
        this.stats.knowledgeTransfers.textContent = `${this.knowledgeTransfers} Knowledge Transfers`;
        
        const avgConfidence = this.messageCount > 0 ? (this.totalConfidence / this.messageCount) : 0;
        this.stats.confidence.textContent = `${avgConfidence.toFixed(2)} Avg Confidence`;
    }

    getActivityIcon() {
        const icons = ['⚡', '🔄', '📊', '🎯', '💡', '🚀', '⭐', '🔍'];
        return icons[Math.floor(Math.random() * icons.length)];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Reset demo manually
    reset() {
        this.resetDemo();
        this.stopDemo();
    }
}

// Initialize demo when page loads
function initializeLiveDemo() {
    window.liveDemo = new DaenaLiveDemo();
}

// Global function to restart demo
function restartDemo() {
    if (window.liveDemo) {
        window.liveDemo.reset();
    }
}
