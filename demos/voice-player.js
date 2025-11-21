class DaenaVoicePlayer {
    constructor(containerId, config) {
        this.container = document.getElementById(containerId);
        this.config = config;
        this.audioPlayer = new Audio();
        this.isPlaying = false;
        
        // Handle different audio config formats
        if (typeof config.audio === 'string') {
            this.audioPlayer.src = config.audio;
        } else if (config.audio && config.audio.src) {
            this.audioPlayer.src = config.audio.src;
        }
        
        this.renderPlayer();
        this.attachEventListeners();
    }

    renderPlayer() {
        let title = "Demo Audio";
        if (this.config.title) {
            title = this.config.title;
        } else if (this.config.audio && this.config.audio.title) {
            title = this.config.audio.title;
        }

        this.container.innerHTML = `
            <div class="daena-voice-player">
                <div class="player-header">
                    <h3 class="demo-title">${title}</h3>
                    <div class="playback-info">
                        <span class="current-time">0:00</span> / <span class="total-time">0:00</span>
                    </div>
                </div>
                
                <div class="player-controls">
                    <button class="control-btn" id="playPauseBtn">▶ Play</button>
                    <div class="seek-container">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                            <div class="progress-handle"></div>
                        </div>
                    </div>
                    <select class="rate-select">
                        <option value="0.5">0.5x</option>
                        <option value="1" selected>1x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2x</option>
                    </select>
                </div>
                
                <div class="current-caption">
                    <div class="caption-text">Ready to play...</div>
                </div>
                
                ${this.renderChapters()}
            </div>
        `;
        
        this.playPauseBtn = this.container.querySelector('#playPauseBtn');
        this.progressBar = this.container.querySelector('.progress-bar');
        this.progressFill = this.container.querySelector('.progress-fill');
        this.progressHandle = this.container.querySelector('.progress-handle');
        this.rateSelect = this.container.querySelector('.rate-select');
        this.currentTimeEl = this.container.querySelector('.current-time');
        this.totalTimeEl = this.container.querySelector('.total-time');
        this.captionText = this.container.querySelector('.caption-text');
    }

    renderChapters() {
        if (!this.config.chapters || this.config.chapters.length === 0) return '';
        
        const chaptersHtml = this.config.chapters.map((chapter, index) => {
            // Normalize chapter data
            const timeVal = chapter.time !== undefined ? chapter.time : chapter.start;
            const timeStr = typeof timeVal === 'number' ? this.formatTime(timeVal) : timeVal;
            const parsedTime = this.parseTime(timeVal);
            const label = chapter.label || chapter.title || `Chapter ${index + 1}`;
            
            return `
                <div class="chapter-item" data-time="${parsedTime}">
                    <button class="chapter-btn">
                        <span class="chapter-time">${timeStr}</span>
                        <span class="chapter-label">${label}</span>
                    </button>
                </div>
            `;
        }).join('');
        
        return `
            <div class="chapters-list">
                <div class="chapters-header">Chapters</div>
                <div class="chapters-container">
                    ${chaptersHtml}
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.audioPlayer.addEventListener('loadedmetadata', () => {
            this.totalTimeEl.textContent = this.formatTime(this.audioPlayer.duration);
        });
        this.audioPlayer.addEventListener('ended', () => {
            this.isPlaying = false;
            this.playPauseBtn.textContent = '▶ Play';
        });
        
        this.progressBar.addEventListener('click', (e) => this.seek(e));
        
        this.rateSelect.addEventListener('change', (e) => {
            this.audioPlayer.playbackRate = parseFloat(e.target.value);
        });

        // Chapter clicks
        const chapterBtns = this.container.querySelectorAll('.chapter-btn');
        chapterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const timeStr = btn.querySelector('.chapter-time').textContent;
                this.audioPlayer.currentTime = this.parseTime(timeStr);
                this.play();
            });
        });
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audioPlayer.play().catch(e => console.log("Playback failed", e));
        this.isPlaying = true;
        this.playPauseBtn.textContent = '⏸ Pause';
    }

    pause() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        this.playPauseBtn.textContent = '▶ Play';
    }

    seek(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.audioPlayer.currentTime = percent * this.audioPlayer.duration;
    }

    updateProgress() {
        if (!this.audioPlayer.duration) return;
        const percent = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
        this.progressFill.style.width = `${percent}%`;
        this.progressHandle.style.left = `${percent}%`;
        this.currentTimeEl.textContent = this.formatTime(this.audioPlayer.currentTime);
        
        this.updateCaption();
        this.highlightChapter();
    }

    updateCaption() {
        // Use captions if available, otherwise fall back to chapters
        const items = this.config.captions || this.config.chapters;
        if (!items) return;
        
        let activeItem = null;
        for (const item of items) {
            const startTime = item.time !== undefined ? this.parseTime(item.time) : item.start;
            if (this.audioPlayer.currentTime >= startTime) {
                activeItem = item;
            } else {
                // Assuming sorted
                break;
            }
        }
        
        if (activeItem) {
            const text = activeItem.text || activeItem.description || activeItem.label || activeItem.title;
            this.captionText.textContent = text;
        }
    }

    highlightChapter() {
        if (!this.config.chapters) return;
        
        const chapterItems = this.container.querySelectorAll('.chapter-item');
        chapterItems.forEach(item => item.classList.remove('active'));
        
        let activeIndex = -1;
        for (let i = 0; i < this.config.chapters.length; i++) {
            const chapter = this.config.chapters[i];
            const startTime = chapter.time !== undefined ? this.parseTime(chapter.time) : chapter.start;
            
            if (this.audioPlayer.currentTime >= startTime) {
                activeIndex = i;
            }
        }
        
        if (activeIndex >= 0) {
            chapterItems[activeIndex].classList.add('active');
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    parseTime(timeVal) {
        if (typeof timeVal === 'number') return timeVal;
        if (typeof timeVal === 'string') {
            if (timeVal.includes(':')) {
                const parts = timeVal.split(':');
                if (parts.length === 2) {
                    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
                }
            } else {
                return parseFloat(timeVal);
            }
        }
        return 0;
    }
}
