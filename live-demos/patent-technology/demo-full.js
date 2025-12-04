class DaenaPatentTechnologyDemo {
            constructor() {
                this.isRunning = false;
                this.patentsAnalyzed = 0;
                this.similarityScore = 0;
                this.noveltyIndex = 0;
                this.processingTime = 0;
                this.voicePlayer = null;
                
                this.phases = [
                    {
                        title: "Patent database connection",
                        duration: 2000,
                        action: this.connectToDatabase.bind(this)
                    },
                    {
                        title: "Technology analysis",
                        duration: 3000,
                        action: this.analyzeTechnology.bind(this)
                    },
                    {
                        title: "Prior art search",
                        duration: 4000,
                        action: this.searchPriorArt.bind(this)
                    },
                    {
                        title: "Novelty assessment",
                        duration: 3000,
                        action: this.assessNovelty.bind(this)
                    },
                    {
                        title: "Results compilation",
                        duration: 2000,
                        action: this.compileResults.bind(this)
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
                    // Try to load config from old demoes folder
                    const response = await fetch('/old demoes/patent-technology/config.json');
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
                        'Patent Analysis System',
                        'Patent Technology analysis completed',
                        'Comprehensive analysis with 96% accuracy achieved',
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
                this.similarityScore = 0;
                this.noveltyIndex = 0;
                this.processingTime = 0;
                
                this.updateStats();

                // Reset all categories
                const categories = ['technologyAnalysis', 'priorArtSearch', 'noveltyAssessment'];
                categories.forEach(categoryId => {
                    const category = document.getElementById(categoryId);
                    const progressBar = document.getElementById(categoryId.replace('Analysis', 'Progress').replace('Search', 'Progress').replace('Assessment', 'Progress'));
                    
                    category.classList.remove('active', 'processing');
                    category.querySelector('.category-status').textContent = 'Standby';
                    progressBar.style.width = '0%';
                });

                // Reset results
                document.getElementById('patentClassification').textContent = 'Pending Analysis';
                document.getElementById('innovationLevel').textContent = 'Pending Analysis';
                document.getElementById('marketPotential').textContent = 'Pending Analysis';
                document.getElementById('competitiveAdvantage').textContent = 'Pending Analysis';

                // Clear activity log
                document.getElementById('logEntries').innerHTML = `
                    <div style="color: #B8BCC8; text-align: center; padding: 2rem; font-style: italic;">
                        Patent Technology analysis system initialized and ready.
                    </div>
                `;

                this.updatePhaseIndicator('Ready', 'System initialized. Ready to show Patent Technology analysis...');

                // Reset voice player if available
                if (this.voicePlayer && this.voicePlayer.audioPlayer) {
                    this.voicePlayer.audioPlayer.currentTime = 0;
                }
            }

            async connectToDatabase() {
                this.addLogEntry(
                    'Patent Database',
                    'Connecting to global patent databases',
                    'Accessing USPTO, EPO, WIPO, and JPO databases',
                    98
                );

                await this.delay(2000);
            }

            async analyzeTechnology() {
                this.setCategoryActive('technologyAnalysis', 'processing');
                
                const techAnalysis = [
                    'AI/ML algorithm analysis',
                    'Neural network architecture review',
                    'Machine learning model evaluation',
                    'Deep learning framework assessment',
                    'Natural language processing analysis'
                ];

                for (let i = 0; i < techAnalysis.length; i++) {
                    if (!this.isRunning) break;
                    
                    this.addLogEntry(
                        'Technology Agent',
                        techAnalysis[i],
                        `Advanced AI analysis of patent technology components`,
                        92
                    );
                    
                    this.updateCategoryProgress('technologyAnalysis', ((i + 1) / techAnalysis.length) * 100);
                    await this.delay(600);
                }

                this.setCategoryActive('technologyAnalysis', 'active');
                this.patentsAnalyzed += 5;
            }

            async searchPriorArt() {
                this.setCategoryActive('priorArtSearch', 'processing');
                
                const priorArtSearches = [
                    'Searching USPTO database (2.3M patents)',
                    'Analyzing EPO database (1.8M patents)',
                    'Reviewing WIPO database (3.1M patents)',
                    'Examining JPO database (1.5M patents)',
                    'Cross-referencing academic publications'
                ];

                for (let i = 0; i < priorArtSearches.length; i++) {
                    if (!this.isRunning) break;
                    
                    this.addLogEntry(
                        'Prior Art Agent',
                        priorArtSearches[i],
                        `Comprehensive search across ${8.7 + i * 0.3}M patent documents`,
                        89
                    );
                    
                    this.updateCategoryProgress('priorArtSearch', ((i + 1) / priorArtSearches.length) * 100);
                    await this.delay(800);
                }

                this.setCategoryActive('priorArtSearch', 'active');
                this.similarityScore = 23;
            }

            async assessNovelty() {
                this.setCategoryActive('noveltyAssessment', 'processing');
                
                const noveltyAssessments = [
                    'Novelty scoring algorithm execution',
                    'Innovation level calculation',
                    'Technical advancement evaluation',
                    'Market differentiation analysis',
                    'Competitive positioning assessment'
                ];

                for (let i = 0; i < noveltyAssessments.length; i++) {
                    if (!this.isRunning) break;
                    
                    this.addLogEntry(
                        'Novelty Agent',
                        noveltyAssessments[i],
                        `AI-powered novelty assessment with 94% confidence`,
                        94
                    );
                    
                    this.updateCategoryProgress('noveltyAssessment', ((i + 1) / noveltyAssessments.length) * 100);
                    await this.delay(600);
                }

                this.setCategoryActive('noveltyAssessment', 'active');
                this.noveltyIndex = 8.7;
            }

            async compileResults() {
                this.addLogEntry(
                    'Analysis Engine',
                    'Compiling comprehensive patent analysis results',
                    'Generating detailed report with recommendations',
                    96
                );

                // Update results
                document.getElementById('patentClassification').textContent = 'AI/ML - Neural Networks';
                document.getElementById('innovationLevel').textContent = 'High Innovation';
                document.getElementById('marketPotential').textContent = '$2.4B Market';
                document.getElementById('competitiveAdvantage').textContent = 'Significant Edge';

                this.processingTime = 14.2;
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
                document.getElementById('patentsAnalyzed').textContent = this.patentsAnalyzed;
                document.getElementById('similarityScore').textContent = this.similarityScore + '%';
                document.getElementById('noveltyIndex').textContent = this.noveltyIndex.toFixed(1);
                document.getElementById('processingTime').textContent = this.processingTime + 's';
            }

            updatePhaseIndicator(title, description) {
                document.getElementById('phaseDescription').textContent = description;
            }

            delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        }

        


