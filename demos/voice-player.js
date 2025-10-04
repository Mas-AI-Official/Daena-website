/**
 * Daena Voice-Over Player Component
<<<<<<< HEAD
 * Reusable lightweight voice-over player with timestamp synchronization
 */
class VoiceOverPlayer {
    constructor(containerId, config, options = {}) {
        this.containerId = containerId;
        this.config = config;
        this.options = {
            autoPlay: false,
            smoothScroll: true,
            showTranscript: true,
            showControls: true,
            ...options
        };
=======
 * Reusable audio player with transcript synchronization
 */
class DaenaVoicePlayer {
    constructor(containerId, config) {
        this.container = document.getElementById(containerId);
        this.config = config;
        this.audio = null;
        this.currentChapter = 0;
        this.isPlaying = false;
        this.isMuted = false;
        this.playbackRate = 1.0;
        this.userScrolledRecently = false;
        this.lastScrollTime = 0;
>>>>>>> 2b5950eba8e8a9391cafaaa9a54ace106df9bc7b
        
        this.init();
    }

    init() {
<<<<<<< HEAD
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`Container ${this.containerId} not found`);
            return;
        }

        this.currentChapter = 0;
        this.isPlaying = false;
        this.isMuted = false;
        this.playbackRate = 1.0;
        this.lastManualScroll = 0;
        
        this.createPlayer();
        this.bindEvents();
        this.loadConfig();
    }

    createPlayer() {
        this.container.innerHTML = `
            <div class="voice-player">
                <div class="voice-controls">
                    <button id="playPauseBtn" class="control-btn">▶ Play</button>
                    <button id="prevChapterBtn" class="control-btn">⏮ Previous</button>
                    <button id="nextChapterBtn" class="control-btn">Next ⏭</button>
                    <button id="muteBtn" class="control-btn">🔊</button>
                    <div class="speed-control">
                        <label for="speedSelect">Speed:</label>
                        <select id="speedSelect" class="speed-select">
                            <option value="0.75">0.75x</option>
                            <option value="0.9">0.9x</option>
                            <option value="1.0" selected>1.0x</option>
                            <option value="1.1">1.1x</option>
                            <option value="1.25">1.25x</option>
                        </select>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill"></div>
                        </div>
                        <div class="time-display" id="timeDisplay">0:00 / 0:00</div>
                    </div>
                </div>
                
                <div class="transcript-container" id="transcriptContainer">
                    <div class="transcript-content" id="transcriptContent"></div>
                </div>
                
                <div class="chapter-toc" id="chapterToc">
                    <h3>Chapters</h3>
                    <ul id="chapterList"></ul>
                </div>
                
                <audio id="audioPlayer" preload="metadata"></audio>
                
                <div class="audio-status" id="audioStatus">
                    Loading audio...
                </div>
            </div>
        `;

        // Add CSS styles
        this.addStyles();
        
        // Get references to elements
        this.audio = document.getElementById('audioPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevChapterBtn = document.getElementById('prevChapterBtn');
        this.nextChapterBtn = document.getElementById('nextChapterBtn');
        this.muteBtn = document.getElementById('muteBtn');
        this.speedSelect = document.getElementById('speedSelect');
        this.progressFill = document.getElementById('progressFill');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.transcriptContainer = document.getElementById('transcriptContainer');
        this.transcriptContent = document.getElementById('transcriptContent');
        this.chapterList = document.getElementById('chapterList');
        this.audioStatus = document.getElementById('audioStatus');
    }

    addStyles() {
        if (document.getElementById('voicePlayerStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'voicePlayerStyles';
        style.textContent = `
            .voice-player {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 20px;
                padding: 2rem;
                margin: 2rem 0;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .voice-controls {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 2rem;
                flex-wrap: wrap;
            }
            
            .control-btn {
                background: linear-gradient(45deg, #FFD700, #00bcd4);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            }
            
            .control-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
            }
            
            .control-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .speed-control {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background: rgba(255, 255, 255, 0.1);
                padding: 8px 15px;
                border-radius: 20px;
                border: 1px solid rgba(0, 188, 212, 0.3);
            }
            
            .speed-control label {
                color: #00bcd4;
                font-size: 0.9rem;
                font-weight: bold;
            }
            
            .speed-select {
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: 1px solid rgba(0, 188, 212, 0.5);
                border-radius: 15px;
                padding: 5px 10px;
                font-size: 0.9rem;
                cursor: pointer;
            }
            
            .progress-container {
                display: flex;
                align-items: center;
                gap: 1rem;
                flex: 1;
                max-width: 300px;
            }
            
            .progress-bar {
                flex: 1;
                height: 6px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                overflow: hidden;
                cursor: pointer;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #FFD700, #00bcd4);
                width: 0%;
                transition: width 0.1s ease;
            }
            
            .time-display {
                color: #00bcd4;
                font-weight: bold;
                font-size: 0.9rem;
                min-width: 80px;
            }
            
            .transcript-container {
                margin-bottom: 2rem;
            }
            
            .transcript-content {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                padding: 1.5rem;
                font-size: 1.1rem;
                line-height: 1.6;
                min-height: 80px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .chapter-toc {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
                padding: 1.5rem;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .chapter-toc h3 {
                color: #FFD700;
                margin-bottom: 1rem;
            }
            
            .chapter-toc ul {
                list-style: none;
                padding: 0;
            }
            
            .chapter-item {
                padding: 0.5rem 1rem;
                margin: 0.5rem 0;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid transparent;
            }
            
            .chapter-item:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(0, 188, 212, 0.3);
            }
            
            .chapter-item.active {
                background: rgba(0, 188, 212, 0.2);
                border-color: #00bcd4;
                color: #00bcd4;
            }
            
            .chapter-item .time {
                font-size: 0.8rem;
                color: #888;
                margin-left: 0.5rem;
            }
            
            .audio-status {
                text-align: center;
                color: #00bcd4;
                font-size: 0.9rem;
                margin-top: 1rem;
            }
            
            .highlight-section {
                background: rgba(255, 215, 0, 0.1) !important;
                border-color: rgba(255, 215, 0, 0.5) !important;
                transition: all 0.5s ease;
            }
            
            @media (max-width: 768px) {
                .voice-controls {
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .progress-container {
                    max-width: 100%;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    bindEvents() {
        // Audio controls
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevChapterBtn.addEventListener('click', () => this.previousChapter());
        this.nextChapterBtn.addEventListener('click', () => this.nextChapter());
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        
        // Speed control
        this.speedSelect.addEventListener('change', (e) => {
            this.playbackRate = parseFloat(e.target.value);
            this.audio.playbackRate = this.playbackRate;
        });
        
        // Progress bar
        const progressBar = this.progressFill.parentElement;
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const time = percent * this.audio.duration;
            this.audio.currentTime = time;
            this.updateSlider(time);
        });
        
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateTimeDisplay();
            this.audioStatus.textContent = 'Audio ready';
        });
        
        this.audio.addEventListener('timeupdate', () => {
            this.updateSlider();
            this.updateTimeDisplay();
            this.checkChapterChange();
=======
        this.createPlayerHTML();
        this.createAudioElement();
        this.setupEventListeners();
        this.loadConfig();
        this.updateUI();
    }

    createPlayerHTML() {
        this.container.innerHTML = `
            <div class="daena-voice-player">
                <div class="player-header">
                    <h3 class="demo-title">${this.config?.title || 'Daena Demo'}</h3>
                    <div class="playback-info">
                        <span class="current-time">0:00</span> / <span class="total-time">0:00</span>
                        <span class="playback-rate">1×</span>
                    </div>
                </div>
                
                <div class="player-controls">
                    <button class="control-btn play-pause-btn" title="Play/Pause (Space)">
                        <span class="icon">▶</span>
                    </button>
                    <button class="control-btn prev-chapter-btn" title="Previous Chapter (↑)">
                        ⏮
                    </button>
                    <button class="control-btn next-chapter-btn" title="Next Chapter (↓)">
                        ⏭
                    </button>
                    <button class="control-btn mute-btn" title="Mute (M)">
                        🔊
                    </button>
                    
                    <div class="seek-container">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                            <div class="progress-handle"></div>
                        </div>
                    </div>
                    
                    <select class="rate-select" title="Playback Speed">
                        <option value="0.75">0.75×</option>
                        <option value="0.9">0.9×</option>
                        <option value="1" selected>1×</option>
                        <option value="1.1">1.1×</option>
                        <option value="1.25">1.25×</option>
                    </select>
                </div>
                
                <div class="current-caption">
                    <span class="caption-text">Ready to play...</span>
                </div>
                
                <div class="chapters-list">
                    <div class="chapters-header">Chapters</div>
                    <div class="chapters-container"></div>
                </div>
            </div>
        `;
    }

    createAudioElement() {
        if (this.config?.audio) {
            this.audio = new Audio();
            this.audio.src = this.config.audio;
            this.audio.preload = 'metadata';
            this.setupAudioEvents();
        }
    }

    setupAudioEvents() {
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateTimeDisplay();
        });
        
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
            this.updateCurrentChapter();
            this.updateCaption();
            this.checkChapterSync();
>>>>>>> 2b5950eba8e8a9391cafaaa9a54ace106df9bc7b
        });
        
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
<<<<<<< HEAD
            this.playPauseBtn.textContent = '▶ Play';
            this.audioStatus.textContent = 'Audio finished';
        });
        
        this.audio.addEventListener('error', (e) => {
            this.audioStatus.textContent = 'Audio not available - you can still scroll the demo.';
            this.audioStatus.style.color = '#FF6B35';
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousChapter();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.nextChapter();
                    break;
                case 'm':
                case 'M':
                    e.preventDefault();
                    this.toggleMute();
                    break;
                case '.':
                    this.seekRelative(5);
                    break;
                case ',':
                    this.seekRelative(-5);
                    break;
            }
        });
        
        // Scroll detection for auto-scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            this.lastManualScroll = Date.now();
=======
            this.updatePlayButton();
        });
        
        this.audio.addEventListener('error', () => {
            this.showErrorMessage();
>>>>>>> 2b5950eba8e8a9391cafaaa9a54ace106df9bc7b
        });
    }

    loadConfig() {
<<<<<<< HEAD
        this.audio.src = this.config.audio;
        this.audio.load();
        
        // Build chapter list
        this.chapterList.innerHTML = '';
        this.config.chapters.forEach((chapter, index) => {
            const li = document.createElement('li');
            li.className = 'chapter-item';
            li.innerHTML = `
                ${chapter.label}
                <span class="time">${this.formatTime(chapter.t)}</span>
            `;
            li.addEventListener('click', () => this.goToChapter(index));
            this.chapterList.appendChild(li);
        });
        
        this.audioStatus.textContent = 'Loading audio...';
    }

    togglePlayPause() {
        if (this.audio.src) {
            if (this.isPlaying) {
                this.audio.pause();
                this.isPlaying = false;
                this.playPauseBtn.textContent = '▶ Play';
                this.audioStatus.textContent = 'Paused';
            } else {
                this.audio.play().then(() => {
                    this.isPlaying = true;
                    this.playPauseBtn.textContent = '⏸ Pause';
                    this.audioStatus.textContent = 'Playing';
                }).catch(e => {
                    console.log('Auto-play failed:', e);
                    this.audioStatus.textContent = 'Click play to start audio';
                });
            }
        } else {
            this.audioStatus.textContent = 'Voice-over not available; you can still scroll the demo.';
            this.audioStatus.style.color = '#FF6B35';
        }
=======
        if (this.config?.chapters) {
            this.renderChapters();
            this.setupScrollSync();
        }
    }

    renderChapters() {
        const container = this.container.querySelector('.chapters-container');
        container.innerHTML = '';
        
        this.config.chapters.forEach((chapter, index) => {
            const chapterEl = document.createElement('div');
            chapterEl.className = `chapter-item ${index === 0 ? 'active' : ''}`;
            chapterEl.innerHTML = `
                <button class="chapter-btn" data-chapter="${index}">
                    <span class="chapter-time">${this.formatTime(chapter.t)}</span>
                    <span class="chapter-label">${chapter.label}</span>
                    <span class="chapter-id">${chapter.id || ''}</span>
                </button>
            `;
            
            chapterEl.addEventListener('click', () => {
                this.seekToChapter(index);
            });
            
            container.appendChild(chapterEl);
        });
    }

    setupScrollSync() {
        // Smooth scroll to chapters when audio plays
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            this.userScrolledRecently = true;
            this.lastScrollTime = Date.now();
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (Date.now() - this.lastScrollTime > 2000) {
                    this.userScrolledRecently = false;
                }
            }, 2000);
        });
    }

    checkChapterSync() {
        if (!this.audio || !this.config.chapters || this.userScrolledRecently) return;
        
        const currentTime = this.audio.currentTime;
        const nextChapter = this.config.chapters[this.currentChapter + 1];
        
        if (nextChapter && currentTime >= nextChapter.t) {
            this.currentChapter++;
            this.updateActiveChapter();
            this.scrollToChapter();
        }
    }

    scrollToChapter() {
        if (!this.config.chapters) return;
        
        const chapter = this.config.chapters[this.currentChapter];
        if (chapter?.id) {
            const element = document.getElementById(chapter.id);
            if (element && !this.userScrolledRecently) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    updateActiveChapter() {
        const chapters = this.container.querySelectorAll('.chapter-item');
        chapters.forEach((chapter, index) => {
            chapter.classList.toggle('active', index === this.currentChapter);
        });
    }

    setupEventListeners() {
        // Play/Pause button
        this.container.querySelector('.play-pause-btn').addEventListener('click', () => {
            this.togglePlayPause();
        });
        
        // Previous/Next chapter buttons
        this.container.querySelector('.prev-chapter-btn').addEventListener('click', () => {
            this.previousChapter();
        });
        
        this.container.querySelector('.next-chapter-btn').addEventListener('click', () => {
            this.nextChapter();
        });
        
        // Mute button
        this.container.querySelector('.mute-btn').addEventListener('click', () => {
            this.toggleMute();
        });
        
        // Rate selector
        this.container.querySelector('.rate-select').addEventListener('change', (e) => {
            this.setPlaybackRate(parseFloat(e.target.value));
        });
        
        // Progress bar clicks
        this.container.querySelector('.progress-bar').addEventListener('click', (e) => {
            this.seekToPosition(e);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    handleKeyboard(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key) {
            case ' ':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.previousChapter();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.nextChapter();
                break;
            case 'm':
            case 'M':
                e.preventDefault();
                this.toggleMute();
                break;
            case '.':
                e.preventDefault();
                this.seekRelative(5);
                break;
            case ',':
                e.preventDefault();
                this.seekRelative(-5);
                break;
        }
    }

    togglePlayPause() {
        if (!this.audio) {
            this.showErrorMessage();
            return;
        }
        
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        } else {
            this.audio.play().catch(e => {
                console.error('Playback failed:', e);
                this.showErrorMessage();
            });
            this.isPlaying = true;
        }
        this.updatePlayButton();
>>>>>>> 2b5950eba8e8a9391cafaaa9a54ace106df9bc7b
    }

    previousChapter() {
        if (this.currentChapter > 0) {
<<<<<<< HEAD
            this.goToChapter(this.currentChapter - 1);
=======
            this.currentChapter--;
            this.seekToChapter(this.currentChapter);
>>>>>>> 2b5950eba8e8a9391cafaaa9a54ace106df9bc7b
        }
    }

    nextChapter() {
        if (this.currentChapter < this.config.chapters.length - 1) {
<<<<<<< HEAD
            this.goToChapter(this.currentChapter + 1);
        }
    }

    goToChapter(index) {
        if (index >= 0 && index < this.config.chapters.length) {
            this.currentChapter = index;
            const chapter = this.config.chapters[index];
            
            // Update audio
            this.audio.currentTime = chapter.t;
            
            // Update UI
            this.updateChapterUI();
            this.updateTranscript();
            
            // Scroll to section if not manually scrolled recently
            this.scrollToSection(chapter.id);
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section && (Date.now() - this.lastManualScroll > 2000)) {
            section.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Highlight section briefly
            section.classList.add('highlight-section');
            setTimeout(() => {
                section.classList.remove('highlight-section');
            }, 2000);
        }
    }

    checkChapterChange() {
        const currentTime = this.audio.currentTime;
        let newChapter = this.currentChapter;
        
        // Find current chapter based on time
        for (let i = this.config.chapters.length - 1; i >= 0; i--) {
            if (currentTime >= this.config.chapters[i].t) {
                newChapter = i;
                break;
            }
        }
        
        if (newChapter !== this.currentChapter) {
            this.currentChapter = newChapter;
            this.updateChapterUI();
            this.updateTranscript();
            this.scrollToSection(this.config.chapters[newChapter].id);
        }
    }

    updateChapterUI() {
        // Update chapter highlights
        document.querySelectorAll('.chapter-item').forEach((item, index) => {
            item.classList.toggle('active', index === this.currentChapter);
        });
    }

    updateTranscript() {
        if (this.options.showTranscript) {
            const chapter = this.config.chapters[this.currentChapter];
            this.transcriptContent.textContent = chapter.label;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.audio.muted = this.isMuted;
        this.muteBtn.textContent = this.isMuted ? '🔇' : '🔊';
    }

    seekRelative(seconds) {
        this.audio.currentTime += seconds;
    }

    updateSlider() {
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressFill.style.width = progress + '%';
        }
    }

    updateTimeDisplay() {
        if (this.audio.duration) {
            const current = Math.floor(this.audio.currentTime);
            const total = Math.floor(this.audio.duration);
            this.timeDisplay.textContent = `${this.formatTime(current)} / ${this.formatTime(total)}`;
        }
    }

=======
            this.currentChapter++;
            this.seekToChapter(this.currentChapter);
        }
    }

    seekToChapter(chapterIndex) {
        if (!this.config.chapters[chapterIndex]) return;
        
        const chapter = this.config.chapters[chapterIndex];
        this.currentChapter = chapterIndex;
        this.audio.currentTime = chapter.t;
        this.updateActiveChapter();
        this.scrollToChapter();
    }

    toggleMute() {
        if (!this.audio) return;
        
        this.isMuted = !this.isMuted;
        this.audio.muted = this.isMuted;
        
        const muteBtn = this.container.querySelector('.mute-btn');
        muteBtn.innerHTML = this.isMuted ? '🔇' : '🔊';
    }

    setPlaybackRate(rate) {
        if (!this.audio) return;
        
        this.playbackRate = rate;
        this.audio.playbackRate = rate;
        
        this.container.querySelector('.playback-rate').textContent = `${rate}×`;
    }

    seekToPosition(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        
        if (this.audio.duration) {
            this.audio.currentTime = percentage * this.audio.duration;
        }
    }

    seekRelative(seconds) {
        if (this.audio) {
            this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, this.audio.currentTime + seconds));
        }
    }

    updateProgress() {
        if (!this.audio.duration) return;
        
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        const progressFill = this.container.querySelector('.progress-fill');
        const progressHandle = this.container.querySelector('.progress-handle');
        
        progressFill.style.width = `${progress}%`;
        progressHandle.style.left = `${progress}%`;
    }

    updateTimeDisplay() {
        if (!this.audio) return;
        
        this.container.querySelector('.current-time').textContent = this.formatTime(this.audio.currentTime);
        this.container.querySelector('.total-time').textContent = this.formatTime(this.audio.duration);
    }

    updateCurrentChapter() {
        const currentTime = this.audio.currentTime;
        this.config.chapters.forEach((chapter, index) => {
            if (currentTime >= chapter.t && 
                (index === this.config.chapters.length - 1 || currentTime < this.config.chapters[index + 1].t)) {
                if (index !== this.currentChapter) {
                    this.currentChapter = index;
                    this.updateActiveChapter();
                }
            }
        });
    }

    updateCaption() {
        const chapter = this.config.chapters[this.currentChapter];
        if (chapter) {
            this.container.querySelector('.caption-text').textContent = chapter.label;
        }
    }

    updatePlayButton() {
        const btn = this.container.querySelector('.play-pause-btn .icon');
        btn.innerHTML = this.isPlaying ? '⏸' : '▶';
    }

    updateUI() {
        this.updatePlayButton();
        this.updateTimeDisplay();
    }

>>>>>>> 2b5950eba8e8a9391cafaaa9a54ace106df9bc7b
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

<<<<<<< HEAD
    destroy() {
        this.audio.pause();
        this.audio.src = '';
        document.removeEventListener('keydown', this.boundKeyHandler);
    }
}

// Export for use
window.VoiceOverPlayer = VoiceOverPlayer;
=======
    showErrorMessage() {
        const captionEl = this.container.querySelector('.caption-text');
        captionEl.textContent = 'Voice-over not available; you can still scroll the demo.';
        captionEl.style.color = '#ff6b6b';
    }
}

// Auto-initialize if config is loaded via script tag
document.addEventListener('DOMContentLoaded', () => {
    const script = document.querySelector('script[type="application/json"]');
    if (script) {
        try {
            const config = JSON.parse(script.textContent);
            const player = new DaenaVoicePlayer('daena-voice-player', config);
        } catch (e) {
            console.error('Failed to load voice player config:', e);
        }
    }
});
>>>>>>> 2b5950eba8e8a9391cafaaa9a54ace106df9bc7b
