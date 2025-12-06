/**
 * Lightweight voice-over player used across Daena demos.
 * Provides a consistent UI, chapter markers, and simple external controls.
 */
(function () {
    class DaenaVoicePlayer {
        constructor(containerId, config = {}) {
            this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
            if (!this.container) {
                console.warn('DaenaVoicePlayer: container not found', containerId);
                return;
            }

            this.config = config;
            this.title = config.title || 'Daena Voice Demonstration';
            this.audioConfig = this.normalizeAudioConfig(config.audio);
            this.audioSrc = this.audioConfig?.src || '';
            this.chapters = this.normalizeChapters(config.chapters);
            this.defaultCaption = config.caption || config.description || this.audioConfig?.description || 'Voice-over ready. Press play to begin.';

            if (this.audioConfig?.title && !config.title) {
                this.title = this.audioConfig.title;
            }
            this.playbackRates = Array.isArray(config.playbackRates) && config.playbackRates.length
                ? config.playbackRates
                : [0.75, 1, 1.25, 1.5];
            this.rewindSeconds = config.rewindSeconds || 10;
            this.forwardSeconds = config.forwardSeconds || 10;
            this.activeChapterIndex = -1;
            this.controlsDisabled = false;

            this.render();
            this.cacheDom();
            this.initAudio();
            this.bindUiEvents();
            this.bindAudioEvents();
            this.decorateChapters();

            if (this.audioSrc) {
                this.loadAudio(this.audioSrc);
            } else {
                this.setStatusMessage('Voice-over will be available soon.');
                this.disableControls();
            }
        }

        render() {
            const rateOptions = this.playbackRates.map(rate => {
                const numericRate = Number(rate);
                const label = Number.isInteger(numericRate) ? `${numericRate}x` : `${numericRate.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}x`;
                const selected = numericRate === 1 ? ' selected' : '';
                return `<option value="${numericRate}"${selected}>${label}</option>`;
            }).join('');

            const chaptersMarkup = this.chapters.length
                ? this.chapters.map((chapter, index) => `
                    <div class="chapter-item" data-chapter-index="${index}">
                        <button class="chapter-btn" type="button">
                            <span class="chapter-time">${this.formatTime(chapter.t)}</span>
                            <span class="chapter-label">${chapter.label}</span>
                            ${chapter.id ? `<span class="chapter-id">${chapter.id}</span>` : ''}
                        </button>
                    </div>
                `).join('')
                : `
                    <p class="caption-text" style="margin: 0;">
                        Chapter markers will appear here when they're available.
                    </p>
                `;

            this.container.innerHTML = `
                <div class="daena-voice-player">
                    <div class="player-header">
                        <p class="demo-title">${this.title}</p>
                        <div class="playback-info">
                            <span class="current-time">0:00</span>
                            <span>/</span>
                            <span class="total-time">0:00</span>
                            <span class="playback-rate">1x</span>
                        </div>
                    </div>
                    <div class="player-controls">
                        <button class="control-btn" data-action="rewind" type="button" title="Rewind ${this.rewindSeconds} seconds">⏪ ${this.rewindSeconds}s</button>
                        <button class="control-btn" data-action="play" type="button" title="Play or pause narration">▶ Play</button>
                        <div class="seek-container">
                            <div class="progress-bar">
                                <div class="progress-fill"></div>
                                <div class="progress-handle"></div>
                            </div>
                        </div>
                        <button class="control-btn" data-action="forward" type="button" title="Forward ${this.forwardSeconds} seconds">⏩ ${this.forwardSeconds}s</button>
                        <select class="rate-select" title="Playback speed">
                            ${rateOptions}
                        </select>
                    </div>
                    <div class="current-caption">
                        <div class="caption-text">${this.defaultCaption}</div>
                    </div>
                    <div class="chapters-list">
                        <div class="chapters-header">Chapters</div>
                        <div class="chapters-container">
                            ${chaptersMarkup}
                        </div>
                    </div>
                </div>
            `;
        }

        cacheDom() {
            this.playerRoot = this.container.querySelector('.daena-voice-player');
            this.playBtn = this.container.querySelector('[data-action="play"]');
            this.rewindBtn = this.container.querySelector('[data-action="rewind"]');
            this.forwardBtn = this.container.querySelector('[data-action="forward"]');
            this.rateSelect = this.container.querySelector('.rate-select');
            this.progressBar = this.container.querySelector('.progress-bar');
            this.progressFill = this.container.querySelector('.progress-fill');
            this.progressHandle = this.container.querySelector('.progress-handle');
            this.currentTimeEl = this.container.querySelector('.current-time');
            this.totalTimeEl = this.container.querySelector('.total-time');
            this.playbackRateEl = this.container.querySelector('.playback-rate');
            this.captionText = this.container.querySelector('.current-caption .caption-text');
            this.chaptersContainer = this.container.querySelector('.chapters-container');
        }

        initAudio() {
            this.audioPlayer = new Audio();
            this.audioPlayer.preload = 'auto';
            this.audioPlayer.crossOrigin = 'anonymous';
            this.audioPlayer.volume = typeof this.config.volume === 'number' ? this.config.volume : 0.9;
            this.audioPlayer.playbackRate = 1;
        }

        loadAudio(src) {
            if (!src) {
                return;
            }

            this.audioPlayer.src = src;
            this.audioPlayer.load();
        }

        bindUiEvents() {
            if (this.playBtn) {
                this.playBtn.addEventListener('click', () => this.togglePlayback());
            }
            if (this.rewindBtn) {
                this.rewindBtn.addEventListener('click', () => this.rewind());
            }
            if (this.forwardBtn) {
                this.forwardBtn.addEventListener('click', () => this.forward());
            }
            if (this.rateSelect) {
                this.rateSelect.addEventListener('change', (event) => {
                    const rate = parseFloat(event.target.value);
                    this.setPlaybackRate(rate);
                });
            }
            if (this.progressBar) {
                this.progressBar.addEventListener('click', (event) => this.seekFromEvent(event));
                this.progressBar.addEventListener('touchstart', (event) => this.seekFromEvent(event.touches[0]));
            }
            if (this.chaptersContainer) {
                this.chaptersContainer.addEventListener('click', (event) => {
                    const button = event.target.closest('.chapter-btn');
                    if (!button) return;
                    const targetTime = parseFloat(button.dataset.time || '0');
                    this.seekTo(targetTime);
                    if (this.audioPlayer.paused) {
                        this.setStatusMessage(button.dataset.label || 'Voice-over preview');
                    }
                });
            }
        }

        bindAudioEvents() {
            this.audioPlayer.addEventListener('loadedmetadata', () => {
                this.enableControls();
                this.totalTimeEl.textContent = this.formatTime(this.audioPlayer.duration);
                this.updateProgressUi();
            });

            this.audioPlayer.addEventListener('timeupdate', () => {
                this.updateProgressUi();
                this.highlightChapter();
            });

            this.audioPlayer.addEventListener('ended', () => {
                this.setPlayState(false);
                this.audioPlayer.currentTime = 0;
                this.updateProgressUi();
            });

            this.audioPlayer.addEventListener('pause', () => {
                if (this.audioPlayer.currentTime < this.audioPlayer.duration) {
                    this.setPlayState(false);
                }
            });

            this.audioPlayer.addEventListener('error', () => {
                console.warn('DaenaVoicePlayer: failed to load audio source', this.audioSrc);
                this.setStatusMessage('Unable to load voice-over audio.');
                this.disableControls();
            });
        }

        decorateChapters() {
            this.chapterButtons = Array.from(this.container.querySelectorAll('.chapter-btn'));
            this.chapterButtons.forEach((button, index) => {
                const chapter = this.chapters[index];
                if (!chapter) return;
                button.dataset.time = chapter.t;
                button.dataset.label = chapter.label;
            });
        }

        togglePlayback() {
            if (!this.audioSrc || this.controlsDisabled) {
                return;
            }
            if (this.audioPlayer.paused) {
                this.play().catch(() => {});
            } else {
                this.pause();
            }
        }

        play() {
            if (!this.audioSrc || this.controlsDisabled) {
                return Promise.resolve();
            }
            if (this.playBtn) {
                this.playBtn.textContent = '⏳ Loading...';
                this.playBtn.classList.add('loading');
            }
            return this.audioPlayer.play()
                .then(() => {
                    this.setPlayState(true);
                    return true;
                })
                .catch((error) => {
                    this.setPlayState(false);
                    console.warn('DaenaVoicePlayer: unable to start playback', error);
                    throw error;
                });
        }

        pause() {
            this.audioPlayer.pause();
            this.setPlayState(false);
        }

        rewind() {
            if (!this.audioPlayer.duration) return;
            this.audioPlayer.currentTime = Math.max(0, this.audioPlayer.currentTime - this.rewindSeconds);
            this.updateProgressUi();
        }

        forward() {
            if (!this.audioPlayer.duration) return;
            const newTime = Math.min(this.audioPlayer.duration, this.audioPlayer.currentTime + this.forwardSeconds);
            this.audioPlayer.currentTime = newTime;
            this.updateProgressUi();
        }

        seekFromEvent(event) {
            if (!this.audioPlayer.duration || !event) return;
            const rect = this.progressBar.getBoundingClientRect();
            const clientX = event.clientX;
            if (typeof clientX !== 'number') return;
            const position = Math.min(Math.max(clientX - rect.left, 0), rect.width);
            const percentage = position / rect.width;
            this.seekTo(percentage * this.audioPlayer.duration);
        }

        seekTo(time) {
            if (!this.audioPlayer.duration && time !== 0) return;
            const clamped = Math.max(0, Math.min(time, this.audioPlayer.duration || time));
            this.audioPlayer.currentTime = clamped;
            this.updateProgressUi();
            this.highlightChapter(clamped);
        }

        setPlaybackRate(rate) {
            if (!rate || Number.isNaN(rate)) return;
            this.audioPlayer.playbackRate = rate;
            if (this.playbackRateEl) {
                this.playbackRateEl.textContent = `${rate}x`;
            }
        }

        updateProgressUi() {
            const duration = this.audioPlayer.duration || 0;
            const current = this.audioPlayer.currentTime || 0;
            const percentage = duration ? (current / duration) * 100 : 0;

            if (this.progressFill) {
                this.progressFill.style.width = `${percentage}%`;
            }
            if (this.progressHandle) {
                this.progressHandle.style.left = `${percentage}%`;
            }
            if (this.currentTimeEl) {
                this.currentTimeEl.textContent = this.formatTime(current);
            }
            if (this.totalTimeEl && duration) {
                this.totalTimeEl.textContent = this.formatTime(duration);
            }
        }

        highlightChapter(forcedTime) {
            if (!this.chapters.length) return;
            const currentTime = typeof forcedTime === 'number' ? forcedTime : this.audioPlayer.currentTime;

            let newIndex = -1;
            for (let i = 0; i < this.chapters.length; i++) {
                if (currentTime >= this.chapters[i].t) {
                    newIndex = i;
                } else {
                    break;
                }
            }

            if (newIndex === this.activeChapterIndex) return;
            this.activeChapterIndex = newIndex;

            this.chapterButtons.forEach((button, index) => {
                const item = button.closest('.chapter-item');
                if (item) {
                    item.classList.toggle('active', index === newIndex);
                }
            });

            if (newIndex >= 0) {
                this.setStatusMessage(this.chapters[newIndex].label || `Chapter ${newIndex + 1}`);
            }
        }

        setStatusMessage(message) {
            if (this.captionText) {
                this.captionText.textContent = message || this.defaultCaption;
            }
        }

        setPlayState(isPlaying) {
            if (!this.playBtn) return;
            if (isPlaying) {
                this.playBtn.textContent = '⏸ Pause';
                this.playBtn.classList.add('active');
                this.playBtn.classList.remove('loading');
            } else {
                this.playBtn.textContent = '▶ Play';
                this.playBtn.classList.remove('active', 'loading');
            }
        }

        disableControls() {
            this.controlsDisabled = true;
            [this.playBtn, this.rewindBtn, this.forwardBtn].forEach(btn => {
                if (btn) btn.disabled = true;
            });
            if (this.rateSelect) this.rateSelect.disabled = true;
            if (this.progressBar) this.progressBar.style.pointerEvents = 'none';
        }

        enableControls() {
            if (!this.controlsDisabled) return;
            this.controlsDisabled = false;
            [this.playBtn, this.rewindBtn, this.forwardBtn].forEach(btn => {
                if (btn) btn.disabled = false;
            });
            if (this.rateSelect) this.rateSelect.disabled = false;
            if (this.progressBar) this.progressBar.style.pointerEvents = '';
        }

        formatTime(seconds) {
            if (!Number.isFinite(seconds) || seconds < 0) {
                return '0:00';
            }
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        normalizeAudioConfig(audio) {
            if (!audio) return null;
            if (typeof audio === 'string') {
                return { src: audio };
            }
            if (typeof audio === 'object') {
                const normalized = { ...audio };
                if (!normalized.src && normalized.url) {
                    normalized.src = normalized.url;
                }
                return normalized.src ? normalized : null;
            }
            return null;
        }

        normalizeChapters(chapters) {
            if (!Array.isArray(chapters)) return [];
            return chapters.map((chapter, index) => {
                const timeValue = chapter.t ?? chapter.time ?? chapter.start ?? 0;
                const numericTime = typeof timeValue === 'number' ? timeValue : parseFloat(timeValue) || 0;
                return {
                    t: Math.max(0, numericTime),
                    label: chapter.label || chapter.title || `Chapter ${index + 1}`,
                    id: chapter.id || chapter.slug || ''
                };
            }).sort((a, b) => a.t - b.t);
        }
    }

    window.DaenaVoicePlayer = DaenaVoicePlayer;
})();


