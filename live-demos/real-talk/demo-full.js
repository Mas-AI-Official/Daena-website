
        class DaenaRealTalkDemo {
            constructor() {
                this.isRunning = false;
                this.messagesProcessed = 0;
                this.understandingAccuracy = 0;
                this.responseTime = 0;
                this.conversationQuality = 0;
                this.voicePlayer = null;
                
                this.conversationFlow = [
                    {
                        user: "Hi Daena, I need help with our Q2 marketing strategy.",
                        daena: "Hello! I'd be happy to help with your Q2 marketing strategy. I can see you're looking to optimize your marketing approach. Let me analyze your current situation and provide strategic recommendations.",
                        processing: "voiceProcessing"
                    },
                    {
                        user: "We're struggling with customer acquisition costs.",
                        daena: "I understand the challenge with customer acquisition costs. This is a common issue that requires a multi-faceted approach. Let me break down some strategies that could help reduce your CAC while improving conversion rates.",
                        processing: "textUnderstanding"
                    },
                    {
                        user: "What specific tactics would you recommend?",
                        daena: "Based on my analysis, I recommend focusing on three key areas: 1) Content marketing optimization, 2) Referral program implementation, and 3) Customer lifetime value enhancement. Each of these can significantly impact your acquisition costs.",
                        processing: "voiceProcessing"
                    },
                    {
                        user: "How do we measure success?",
                        daena: "Excellent question! Success metrics should include CAC reduction percentage, conversion rate improvement, customer lifetime value increase, and overall ROI. I can help you set up comprehensive tracking and reporting systems.",
                        processing: "textUnderstanding"
                    },
                    {
                        user: "That sounds great! When can we start?",
                        daena: "Perfect! I can begin implementing these strategies immediately. My 48-agent system will coordinate across marketing, sales, and analytics departments to ensure seamless execution. Would you like me to create a detailed implementation timeline?",
                        processing: "voiceProcessing"
                    }
                ];
                
                this.phases = [
                    {
                        title: "Conversation system initialization",
                        duration: 2000,
                        action: this.initializeConversation.bind(this)
                    },
                    {
                        title: "Natural language processing",
                        duration: 5000,
                        action: this.processConversation.bind(this)
                    },
                    {
                        title: "Response generation",
                        duration: 3000,
                        action: this.generateResponses.bind(this)
                    },
                    {
                        title: "Conversation analysis",
                        duration: 2000,
                        action: this.analyzeConversation.bind(this)
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
                    const response = await fetch('/live-demos/real-talk//live-demos/real-talk/config.json');
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

                // Clear chat messages
                document.getElementById('chatMessages').innerHTML = '';

                for (const phase of this.phases) {
                    if (!this.isRunning) break;
                    
                    this.updatePhaseIndicator(phase.title, `Executing ${phase.title.toLowerCase()}`);
                    await phase.action();
                    await this.delay(1500);
                }

                if (this.isRunning) {
                    this.stopDemo();
                    this.addChatMessage(
                        'System',
                        'Real Talk conversation demonstration completed',
                        'Natural language understanding with 98% accuracy achieved',
                        'daena'
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
                this.messagesProcessed = 0;
                this.understandingAccuracy = 0;
                this.responseTime = 0;
                this.conversationQuality = 0;
                
                this.updateStats();

                // Reset all modes
                const modes = ['voiceProcessing', 'textUnderstanding'];
                modes.forEach(modeId => {
                    const mode = document.getElementById(modeId);
                    const progressBar = document.getElementById(modeId + 'Progress');
                    
                    mode.classList.remove('active', 'processing');
                    mode.querySelector('.mode-status').textContent = 'Standby';
                    progressBar.style.width = '0%';
                });

                // Clear chat messages
                document.getElementById('chatMessages').innerHTML = `
                    <div style="color: #B8BCC8; text-align: center; padding: 2rem; font-style: italic;">
                        Real Talk conversation system initialized and ready.
                    </div>
                `;

                this.updatePhaseIndicator('Ready', 'System initialized. Ready to show Real Talk conversation...');

                // Reset voice player if available
                if (this.voicePlayer && this.voicePlayer.audioPlayer) {
                    this.voicePlayer.audioPlayer.currentTime = 0;
                }
            }

            async initializeConversation() {
                this.addChatMessage(
                    'System',
                    'Real Talk conversation system activated',
                    'Natural language processing and understanding modules initialized',
                    'daena'
                );

                await this.delay(2000);
            }

            async processConversation() {
                for (let i = 0; i < this.conversationFlow.length; i++) {
                    if (!this.isRunning) break;
                    
                    const conversation = this.conversationFlow[i];
                    
                    // Add user message
                    this.addChatMessage(
                        'User',
                        conversation.user,
                        'Natural language input received',
                        'user'
                    );
                    
                    await this.delay(1000);
                    
                    // Process the message
                    this.setModeActive(conversation.processing, 'processing');
                    this.updateModeProgress(conversation.processing, 50);
                    
                    await this.delay(1500);
                    
                    // Add Daena response
                    this.addChatMessage(
                        'Daena',
                        conversation.daena,
                        'AI-generated response with contextual understanding',
                        'daena'
                    );
                    
                    this.updateModeProgress(conversation.processing, 100);
                    this.setModeActive(conversation.processing, 'active');
                    
                    this.messagesProcessed += 2;
                    await this.delay(2000);
                }
            }

            async generateResponses() {
                this.addChatMessage(
                    'Response Generator',
                    'Advanced response generation completed',
                    'Contextual understanding with 96% accuracy',
                    'daena'
                );

                this.understandingAccuracy = 96;
                this.responseTime = 1.2;
            }

            async analyzeConversation() {
                this.addChatMessage(
                    'Conversation Analyzer',
                    'Conversation analysis completed',
                    'Quality assessment: Excellent conversation flow and understanding',
                    'daena'
                );

                this.conversationQuality = 9.4;
                this.updateStats();
            }

            setModeActive(modeId, status) {
                const mode = document.getElementById(modeId);
                const statusElement = mode.querySelector('.mode-status');
                
                // Clear previous state classes
                mode.classList.remove('active', 'processing');
                
                statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);

                if (status === 'processing') {
                    mode.classList.add('processing');
                } else if (status === 'active') {
                    mode.classList.add('active');
                }
            }

            updateModeProgress(modeId, percentage) {
                const progressBar = document.getElementById(modeId + 'Progress');
                progressBar.style.width = percentage + '%';
            }

            addChatMessage(sender, message, details, type) {
                const chatMessages = document.getElementById('chatMessages');
                
                const time = new Date().toLocaleTimeString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit' 
                });

                const messageDiv = document.createElement('div');
                messageDiv.className = `chat-message ${type}`;
                messageDiv.innerHTML = `
                    <div class="message-header">
                        <div class="message-sender ${type}">${sender}</div>
                        <div class="message-time">${time}</div>
                    </div>
                    <div class="message-content">${message}</div>
                    <div class="message-details">${details}</div>
                `;

                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Keep only 15 most recent messages
                while (chatMessages.children.length > 15) {
                    chatMessages.removeChild(chatMessages.firstChild);
                }
            }

            updateStats() {
                document.getElementById('messagesProcessed').textContent = this.messagesProcessed;
                document.getElementById('understandingAccuracy').textContent = this.understandingAccuracy + '%';
                document.getElementById('responseTime').textContent = this.responseTime + 's';
                document.getElementById('conversationQuality').textContent = this.conversationQuality.toFixed(1);
            }

            updatePhaseIndicator(title, description) {
                document.getElementById('phaseDescription').textContent = description;
            }

            delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        }

        

