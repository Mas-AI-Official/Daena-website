class DaenaEnhancedPatentDemo {
            constructor() {
                this.isRunning = false;
                this.patentsAnalyzed = 0;
                this.accuracy = 0;
                this.noveltyIndex = 0;
                this.processingTime = 0;
                this.voicePlayer = null;
                
                this.phases = [
                    {
                        title: "Advanced database integration",
                        duration: 2000,
                        action: this.connectToEnhancedDatabase.bind(this)
                    },
                    {
                        title: "AI-powered technology analysis",
                        duration: 3500,
                        action: this.analyzeWithAI.bind(this)
                    },
                    {
                        title: "Enhanced prior art search",
                        duration: 4500,
                        action: this.enhancedPriorArtSearch.bind(this)
                    },
                    {
                        title: "ML-powered novelty assessment",
                        duration: 4000,
                        action: this.mlNoveltyAssessment.bind(this)
                    },
                    {
                        title: "Strategic market analysis",
                        duration: 3500,
                        action: this.strategicMarketAnalysis.bind(this)
                    },
                    {
                        title: "Advanced reporting",
                        duration: 2500,
                        action: this.generateAdvancedReport.bind(this)
                    }
                ];

                this.init();
            }

            init() {
                this.startBtn = document.getElementById('startEnhancedDemo');
                this.stopBtn = document.getElementById('stopEnhancedDemo');
                this.resetBtn = document.getElementById('resetEnhancedDemo');

                this.startBtn.addEventListener('click', () => this.startDemo());
                this.stopBtn.addEventListener('click', () => this.stopDemo());
                this.resetBtn.addEventListener('click', () => this.resetDemo());

                this.updateStats();

                // Load voice player config
                this.loadVoiceConfig();
            }

            async loadVoiceConfig() {
                try {
                    // Try to load config from old demoes folder
                    const response = await fetch('/old demoes/patent-enhanced/config.json');
                    const config = await response.json();
                    if (config.audio) {
                        // Update audio path to point to live-demos/audio
                        config.audio = config.audio.replace('../voice-over-demos/', '/live-demos/audio/');
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
                document.getElementById('enhancedLogEntries').innerHTML = '';

                for (const phase of this.phases) {
                    if (!this.isRunning) break;
                    
                    this.updatePhaseIndicator(phase.title, `Executing ${phase.title.toLowerCase()}`);
                    await phase.action();
                    await this.delay(1500);
                }

                if (this.isRunning) {
                    this.stopDemo();
                    this.addLogEntry(
                        'Enhanced Patent Analysis System',
                        'Enhanced Patent Technology analysis completed',
                        'Advanced AI-powered analysis with 96% accuracy achieved',
                        96
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
                this.patentsAnalyzed = 0;
                this.accuracy = 0;
                this.noveltyIndex = 0;
                this.processingTime = 0;
                
                this.updateStats();

                // Reset all categories
                const categories = ['advancedTechnologyAnalysis', 'enhancedPriorArtSearch', 'mlNoveltyAssessment', 'strategicMarketAnalysis'];
                categories.forEach(categoryId => {
                    const category = document.getElementById(categoryId);
                    const progressBar = document.getElementById(categoryId.replace('Analysis', 'Progress').replace('Search', 'Progress').replace('Assessment', 'Progress'));
                    
                    category.classList.remove('active', 'processing');
                    category.querySelector('.category-status').textContent = 'Standby';
                    progressBar.style.width = '0%';
                });

                // Reset results
                document.getElementById('enhancedPatentClassification').textContent = 'Pending Analysis';
                document.getElementById('enhancedInnovationLevel').textContent = 'Pending Analysis';
                document.getElementById('enhancedMarketPotential').textContent = 'Pending Analysis';
                document.getElementById('enhancedCompetitiveAdvantage').textContent = 'Pending Analysis';

                // Clear activity log
                document.getElementById('enhancedLogEntries').innerHTML = `
                    <div style="color: #B8BCC8; text-align: center; padding: 2rem; font-style: italic;">
                        Enhanced Patent Technology analysis system initialized and ready.
                    </div>
                `;

                this.updatePhaseIndicator('Ready', 'System initialized. Ready to show Enhanced Patent Technology analysis...');

                // Reset voice player if available
                if (this.voicePlayer && this.voicePlayer.audioPlayer) {
                    this.voicePlayer.audioPlayer.currentTime = 0;
                }
            }

            async connectToEnhancedDatabase() {
                this.addLogEntry(
                    'Enhanced Patent Database',
                    'Connecting to advanced patent databases with real-time updates',
                    'Accessing USPTO, EPO, WIPO, JPO, and academic databases with cross-referencing',
                    98
                );

                await this.delay(2000);
            }

            async analyzeWithAI() {
                this.setCategoryActive('advancedTechnologyAnalysis', 'processing');
                
                const aiAnalysis = [
                    'AI algorithm analysis with 96% accuracy',
                    'Neural network architecture evaluation',
                    'Machine learning model assessment',
                    'Deep learning framework analysis',
                    'Natural language processing evaluation',
                    'Computer vision technology review'
                ];

                for (let i = 0; i < aiAnalysis.length; i++) {
                    if (!this.isRunning) break;
                    
                    this.addLogEntry(
                        'AI Technology Agent',
                        aiAnalysis[i],
                        `Advanced AI analysis with machine learning models`,
                        96
                    );
                    
                    this.updateCategoryProgress('advancedTechnologyAnalysis', ((i + 1) / aiAnalysis.length) * 100);
                    await this.delay(600);
                }

                this.setCategoryActive('advancedTechnologyAnalysis', 'active');
                this.patentsAnalyzed += 8;
                this.accuracy = 96;
            }

            async enhancedPriorArtSearch() {
                this.setCategoryActive('enhancedPriorArtSearch', 'processing');
                
                const enhancedSearches = [
                    'Smart search across USPTO database (2.3M patents)',
                    'AI-powered EPO database analysis (1.8M patents)',
                    'Intelligent WIPO database review (3.1M patents)',
                    'Enhanced JPO database examination (1.5M patents)',
                    'Cross-referencing academic publications',
                    'Patent family analysis and citation mapping'
                ];

                for (let i = 0; i < enhancedSearches.length; i++) {
                    if (!this.isRunning) break;
                    
                    this.addLogEntry(
                        'Enhanced Prior Art Agent',
                        enhancedSearches[i],
                        `Intelligent search with AI filtering across ${8.7 + i * 0.5}M documents`,
                        94
                    );
                    
                    this.updateCategoryProgress('enhancedPriorArtSearch', ((i + 1) / enhancedSearches.length) * 100);
                    await this.delay(750);
                }

                this.setCategoryActive('enhancedPriorArtSearch', 'active');
            }

            async mlNoveltyAssessment() {
                this.setCategoryActive('mlNoveltyAssessment', 'processing');
                
                const mlAssessments = [
                    'ML-powered novelty scoring algorithm',
                    'Predictive analytics for innovation level',
                    'Machine learning model evaluation',
                    'Advanced technical advancement scoring',
                    'AI-driven market differentiation analysis',
                    'Competitive positioning ML assessment'
                ];

                for (let i = 0; i < mlAssessments.length; i++) {
                    if (!this.isRunning) break;
                    
                    this.addLogEntry(
                        'ML Novelty Agent',
                        mlAssessments[i],
                        `Machine learning-powered assessment with 97% confidence`,
                        97
                    );
                    
                    this.updateCategoryProgress('mlNoveltyAssessment', ((i + 1) / mlAssessments.length) * 100);
                    await this.delay(700);
                }

                this.setCategoryActive('mlNoveltyAssessment', 'active');
                this.noveltyIndex = 9.2;
            }

            async strategicMarketAnalysis() {
                this.setCategoryActive('strategicMarketAnalysis', 'processing');
                
                const marketAnalysis = [
                    'Strategic market intelligence gathering',
                    'Competitive landscape analysis',
                    'Market trend forecasting',
                    'Commercial viability assessment',
                    'Investment opportunity evaluation',
                    'Strategic positioning analysis'
                ];

                for (let i = 0; i < marketAnalysis.length; i++) {
                    if (!this.isRunning) break;
                    
                    this.addLogEntry(
                        'Strategic Market Agent',
                        marketAnalysis[i],
                        `Advanced market intelligence with predictive analytics`,
                        95
                    );
                    
                    this.updateCategoryProgress('strategicMarketAnalysis', ((i + 1) / marketAnalysis.length) * 100);
                    await this.delay(600);
                }

                this.setCategoryActive('strategicMarketAnalysis', 'active');
            }

            async generateAdvancedReport() {
                this.addLogEntry(
                    'Advanced Reporting Engine',
                    'Generating comprehensive enhanced patent analysis report',
                    'Creating advanced visualizations and strategic recommendations',
                    98
                );

                // Update results
                document.getElementById('enhancedPatentClassification').textContent = 'AI/ML - Advanced Neural Networks';
                document.getElementById('enhancedInnovationLevel').textContent = 'Exceptional Innovation';
                document.getElementById('enhancedMarketPotential').textContent = '$3.2B Market';
                document.getElementById('enhancedCompetitiveAdvantage').textContent = 'Dominant Edge';

                this.processingTime = 18.5;
                this.updateStats();
            }

            setCategoryActive(categoryId, status) {
                const category = document.getElementById(categoryId);
                const statusElement = category.querySelector('.category-status');
                
                // Clear previous state classes
                category.classList.remove('active', 'processing');
                
                statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);

                if (status === 'processing') {
                    category.classList.add('processing');
                } else if (status === 'active') {
                    category.classList.add('active');
                }
            }

            updateCategoryProgress(categoryId, percentage) {
                const progressBar = document.getElementById(categoryId.replace('Analysis', 'Progress').replace('Search', 'Progress').replace('Assessment', 'Progress'));
                progressBar.style.width = percentage + '%';
            }

            addLogEntry(from, message, details, confidence) {
                const logEntries = document.getElementById('enhancedLogEntries');
                
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
                document.getElementById('enhancedPatentsAnalyzed').textContent = this.patentsAnalyzed;
                document.getElementById('enhancedAccuracy').textContent = this.accuracy + '%';
                document.getElementById('enhancedNoveltyIndex').textContent = this.noveltyIndex.toFixed(1);
                document.getElementById('enhancedProcessingTime').textContent = this.processingTime + 's';
            }

            updatePhaseIndicator(title, description) {
                document.getElementById('enhancedPhaseDescription').textContent = description;
            }

            delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        }

        


