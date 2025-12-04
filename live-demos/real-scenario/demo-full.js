class DaenaRealScenarioDemo {
            constructor() {
                this.isRunning = false;
                this.scenariosProcessed = 0;
                this.decisionAccuracy = 0;
                this.responseTime = 0;
                this.successRate = 0;
                this.voicePlayer = null;
                
                this.phases = [
                    {
                        title: "Scenario initialization",
                        duration: 2000,
                        action: this.initializeScenario.bind(this)
                    },
                    {
                        title: "Problem analysis phase",
                        duration: 4000,
                        action: this.analyzeProblem.bind(this)
                    },
                    {
                        title: "Solution design phase",
                        duration: 3500,
                        action: this.designSolution.bind(this)
                    },
                    {
                        title: "Implementation phase",
                        duration: 4000,
                        action: this.implementSolution.bind(this)
                    },
                    {
                        title: "Results evaluation",
                        duration: 2500,
                        action: this.evaluateResults.bind(this)
                    }
                ];

                this.init();
            }

            init() {
                this.startBtn = document.getElementById('startBackendDemo');
                this.stopBtn = document.getElementById('stopBackendDemo');
                this.resetBtn = document.getElementById('resetBackendDemo');

                this.startBtn.addEventListener('click', () => this.startDemo());
                this.stopBtn.addEventListener('click', () => this.stopDemo());
                this.resetBtn.addEventListener('click', () => this.resetDemo());

                this.updateStats();

                // Load voice player config
                this.loadVoiceConfig();
            }

            async loadVoiceConfig() {
                try {
                    const response = await fetch('/live-demos/real-scenario//live-demos/real-scenario/config.json');
                    const config = await response.json();
                    if (config.audio) {
                        this.voicePlayer = new DaenaVoicePlayer('daena-voice-player', config);
                    }
                } catch (error) {
                    console.log('Voice config not available, demo will run without voice-over');
                }
            }

            async startDemo() {
                this.isRunning = true;
                this.startBtn.style.display = 'none';
                this.stopBtn.style.display = 'inline-block';
                this.stopBtn.classList.add('executing');

                // Start voice-over if available
                if (this.voicePlayer && this.voicePlayer.audioPlayer) {
                    this.voicePlayer.play();
                }

                // Clear activity log
                document.getElementById('logEntries').innerHTML = '';

                for (const phase of this.phases) {
                    if (!this.isRunning) break;
                    
                    this.updatePhaseIndicator(phase.title, `Executing ${phase.title.toLowerCase()}`);
                    await phase.action();
                    await this.delay(1500);
                }

                if (this.isRunning) {
                    this.stopDemo();
                    this.addLogEntry(
                        'Scenario Processor',
                        'Real World Scenario processing completed',
                        'Complex business scenario successfully resolved with optimal outcomes',
                        97
                    );
                }
            }

            stopDemo() {
                this.isRunning = false;
                this.startBtn.style.display = 'inline-block';
                this.stopBtn.style.display = 'none';
                this.stopBtn.classList.remove('executing');
                
                // Stop voice-over if available
                if (this.voicePlayer && this.voicePlayer.audioPlayer) {
                    this.voicePlayer.pause();
                }
            }

            resetDemo() {
                this.stopDemo();
                
                // Reset stats
                this.scenariosProcessed = 0;
                this.decisionAccuracy = 0;
                this.responseTime = 0;
                this.successRate = 0;
                
                this.updateStats();

                // Reset all steps
                const steps = ['problemAnalysis', 'solutionDesign', 'implementation'];
                steps.forEach(stepId => {
                    const step = document.getElementById(stepId);
                    const progressBar = document.getElementById(stepId + 'Progress');
                    
                    step.classList.remove('active', 'processing');
                    step.querySelector('.step-status').textContent = 'Standby';
                    progressBar.style.width = '0%';
                });

                // Reset results
                document.getElementById('scenarioType').textContent = 'Pending Analysis';
                document.getElementById('complexityLevel').textContent = 'Pending Analysis';
                document.getElementById('recommendedAction').textContent = 'Pending Analysis';
                document.getElementById('expectedOutcome').textContent = 'Pending Analysis';

                // Clear activity log
                document.getElementById('logEntries').innerHTML = `
                    <div style="color: #B8BCC8; text-align: center; padding: 2rem; font-style: italic;">
                        Real World Scenario processing system initialized and ready.
                    </div>
                `;

                this.updatePhaseIndicator('Ready', 'System initialized. Ready to show Real World Scenario processing...');

                // Reset voice player if available
                if (this.voicePlayer && this.voicePlayer.audioPlayer) {
                    this.voicePlayer.audioPlayer.currentTime = 0;
                }
            }

            async initializeScenario() {
                this.addLogEntry(
                    'Scenario Engine',
                    'Real World Scenario processing system activated',
                    'Complex business scenario loaded: Market expansion strategy for Q2',
                    98
                );

                await this.delay(2000);
            }

            async analyzeProblem() {
                this.setStepActive('problemAnalysis', 'processing');
                
                const problemAnalysisTasks = [
                    'Market opportunity assessment',
                    'Competitive landscape analysis',
                    'Resource availability evaluation',
                    'Risk factor identification',
                    'Stakeholder impact analysis',
                    'Timeline constraint evaluation'
                ];

                for (let i = 0; i < problemAnalysisTasks.length; i++) {
                    if (!this.isRunning) break;
                    
                    this.addLogEntry(
                        'Problem Analysis Agent',
                        problemAnalysisTasks[i],
                        `Comprehensive analysis with 94% accuracy`,
                        94
                    );
                    
                    this.updateStepProgress('problemAnalysis', ((i + 1) / problemAnalysisTasks.length) * 100);
                    await this.delay(700);
                }

                this.setStepActive('problemAnalysis', 'active');
                this.scenariosProcessed++;
            }

            async designSolution() {
                this.setStepActive('solutionDesign', 'processing');
                
                const solutionDesignTasks = [
                    'Multi-strategy approach development',
                    'Resource allocation optimization',
                    'Timeline and milestone planning',
                    'Risk mitigation strategy design',
                    'Success metrics definition',
                    'Implementation roadmap creation'
                ];

                for (let i = 0; i < solutionDesignTasks.length; i++) {
                    if (!this.isRunning) break;
                    
                    this.addLogEntry(
                        'Solution Design Agent',
                        solutionDesignTasks[i],
                        `Strategic solution design with optimal resource utilization`,
                        92
                    );
                    
                    this.updateStepProgress('solutionDesign', ((i + 1) / solutionDesignTasks.length) * 100);
                    await this.delay(600);
                }

                this.setStepActive('solutionDesign', 'active');
                this.decisionAccuracy = 94;
            }

            async implementSolution() {
                this.setStepActive('implementation', 'processing');
                
                const implementationTasks = [
                    'Cross-department coordination',
                    'Resource deployment execution',
                    'Progress monitoring activation',
                    'Quality assurance protocols',
                    'Performance tracking implementation',
                    'Stakeholder communication management'
                ];

                for (let i = 0; i < implementationTasks.length; i++) {
                    if (!this.isRunning) break;
                    
                    this.addLogEntry(
                        'Implementation Agent',
                        implementationTasks[i],
                        `Real-time implementation with continuous optimization`,
                        96
                    );
                    
                    this.updateStepProgress('implementation', ((i + 1) / implementationTasks.length) * 100);
                    await this.delay(700);
                }

                this.setStepActive('implementation', 'active');
                this.responseTime = 12.3;
            }

            async evaluateResults() {
                this.addLogEntry(
                    'Results Evaluator',
                    'Scenario results evaluation completed',
                    'Comprehensive analysis shows 97% success probability',
                    97
                );

                // Update results
                document.getElementById('scenarioType').textContent = 'Market Expansion Strategy';
                document.getElementById('complexityLevel').textContent = 'High Complexity';
                document.getElementById('recommendedAction').textContent = 'Proceed with Phased Rollout';
                document.getElementById('expectedOutcome').textContent = '35% Market Share Increase';

                this.successRate = 97;
                this.updateStats();
            }

            setStepActive(stepId, status) {
                const step = document.getElementById(stepId);
                const statusElement = step.querySelector('.step-status');
                
                // Clear previous state classes
                step.classList.remove('active', 'processing');
                
                statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);

                if (status === 'processing') {
                    step.classList.add('processing');
                } else if (status === 'active') {
                    step.classList.add('active');
                }
            }

            updateStepProgress(stepId, percentage) {
                const progressBar = document.getElementById(stepId + 'Progress');
                progressBar.style.width = percentage + '%';
            }

            addLogEntry(from, message, details, confidence) {
                const logEntries = document.getElementById('logEntries');
                
                const time = new Date().toLocaleTimeString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit' 
                });

                const logEntry = document.createElement('div');
                logEntry.className = 'log-entry';
                logEntry.innerHTML = `
                    <div class="log-header">
                        <div style="color: #00bcd4; font-weight: 600;">${time} - ${from}</div>
                        <div class="log-confidence">${confidence}%</div>
                    </div>
                    <div class="log-content">${message}</div>
                    <div class="log-details">${details}</div>
                `;

                logEntries.appendChild(logEntry);
                logEntries.scrollTop = logEntries.scrollHeight;

                // Keep only 10 most recent entries
                while (logEntries.children.length > 10) {
                    logEntries.removeChild(logEntries.firstChild);
                }
            }

            updateStats() {
                document.getElementById('scenariosProcessed').textContent = this.scenariosProcessed;
                document.getElementById('decisionAccuracy').textContent = this.decisionAccuracy + '%';
                document.getElementById('responseTime').textContent = this.responseTime + 's';
                document.getElementById('successRate').textContent = this.successRate + '%';
            }

            updatePhaseIndicator(title, description) {
                document.getElementById('phaseDescription').textContent = description;
            }

            delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        }

        // Handle orientation changes
        function handleOrientationChange() {
            const header = document.querySelector('.header');
            setTimeout(() => {
                const isLandscape = window.innerWidth > window.innerHeight;
                if (header) {
                    header.style.minHeight = isLandscape ? '40px' : '50px';
                }
            }, 100);
        }
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleOrientationChange);
        handleOrientationChange();
        
        


