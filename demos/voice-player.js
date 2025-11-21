'use strict';

/**
 * Lightweight voice-over controller used across Daena demos.
 * Handles audio playback, seeking, playback speed, and chapter navigation.
 */
class DaenaVoicePlayer {
    /**
     * @param {string|HTMLElement} containerOrId - Container element or its id.
     * @param {Object} config - Voice configuration (expects `audio` and optional `chapters`).
     */
    constructor(containerOrId, config = {}) {
        this.config = config;
        this.container = this.resolveContainer(containerOrId);

        if (!this.container) {
            console.warn('DaenaVoicePlayer: container not found', containerOrId);
            return;
        }

        this.audioConfig = this.normalizeAudioConfig(config.audio);
        this.chapters = this.normalizeChapters(config.chapters);
        this.playbackRates = [0.75, 1, 1.25, 1.5, 2];
        this.activeChapterIndex = 0;
        this.isPlaying = false;

        if (!this.audioConfig.src) {
            this.renderFallback('Voice-over audio source is missing.');
            return;
        }

        this.audioPlayer = new Audio(this.audioConfig.src);
        this.audioPlayer.preload = 'auto';
        this.audioPlayer.crossOrigin = 'anonymous';
        this.audioPlayer.playbackRate = 1;

        this.renderPlayer();
        this.bindEvents();
    }

    resolveContainer(ref) {
        if (ref instanceof HTMLElement) return ref;
        if (typeof ref === 'string') {
            return document.getElementById(ref);
        }
        return null;
    }

    normalizeAudioConfig(audio) {
        if (!audio) {
            return { src: null, title: this.config.title, description: this.config.description };
        }

        if (typeof audio === 'string') {
            return {
                src: audio,
                title: this.config.title || 'Daena Voice-over',
                description: this.config.description || ''
            };
        }

        return {
            src: audio.src || null,
            title: audio.title || this.config.title || 'Daena Voice-over',
            description: audio.description || this.config.description || ''
        };
    }

    normalizeChapters(chapters) {
        if (!Array.isArray(chapters)) return [];

        return chapters
            .map((chapter, index) => {
                const start =
                    typeof chapter.t === 'number' ? chapter.t :
                    typeof chapter.start === 'number' ? chapter.start :
                    0;

                return {
                    start: Math.max(0, start),
                    label: chapter.label || chapter.title || `Chapter ${index + 1}`,
                    id: chapter.id || chapter.section || '',
                };
            })
            .sort((a, b) => a.start - b.start);
    }

    renderFallback(message) {
        this.container.innerHTML = `
            <div class="daena-voice-player">
                <div class="player-header">
                    <p class="demo-title">Voice-over unavailable</p>
                </div>
                <div class="current-caption">
                    <p class="caption-text">${message}</p>
                </div>
            </div>
        `;
    }

    renderPlayer() {
        const wrapper = document.createElement('div');
        wrapper.className = 'daena-voice-player';

        const chapterMarkup = this.chapters.length
            ? `
                <div class="chapters-list">
                    <div class="chapters-header">Chapters</div>
                    <div class="chapters-container">
                        ${this.chapters
                            .map((chapter, index) => `
                                <div class="chapter-item" data-chapter-index="${index}">
                                    <button type="button" class="chapter-btn" data-start="${chapter.start}">
                                        <span class="chapter-time">${this.formatTime(chapter.start)}</span>
                                        <span class="chapter-label">${chapter.label}</span>
                                        ${chapter.id ? `<span class="chapter-id">${chapter.id}</span>` : ''}
                                    </button>
                                </div>
                            `)
                            .join('')}
                    </div>
                </div>
            `
            : '';

        wrapper.innerHTML = `
            <div class="player-header">
                <div>
                    <p class="demo-title">${this.audioConfig.title || 'Daena Voice-over'}</p>
                    ${this.audioConfig.description ? `<p style="color:#B8BCC8; font-size:0.9rem;">${this.audioConfig.description}</p>` : ''}
                </div>
                <div class="playback-info">
                    <span class="current-time">0:00</span>
                    <span>/</span>
                    <span class="total-time">0:00</span>
                    <span class="playback-rate">1x</span>
                </div>
            </div>
            <div class="player-controls">
                <button type="button" class="control-btn" data-action="play">▶ Play</button>
                <button type="button" class="control-btn" data-action="rewind">⏪ 10s</button>
                <button type="button" class="control-btn" data-action="forward">⏩ 10s</button>
                <div class="seek-container">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                        <div class="progress-handle"></div>
                    </div>
                </div>
                <select class="rate-select" aria-label="Playback speed">
                    ${this.playbackRates
                        .map(rate => `<option value="${rate}" ${rate === 1 ? 'selected' : ''}>${rate}x</option>`)
                        .join('')}
                </select>
            </div>
            <div class="current-caption">
                <p class="caption-text">${this.chapters[0]?.label || 'Ready to play narrated walkthrough.'}</p>
            </div>
            ${chapterMarkup}
        `;

        this.container.innerHTML = '';
        this.container.appendChild(wrapper);

        this.playButton = wrapper.querySelector('[data-action="play"]');
        this.rewindButton = wrapper.querySelector('[data-action="rewind"]');
        this.forwardButton = wrapper.querySelector('[data-action="forward"]');
        this.currentTimeEl = wrapper.querySelector('.current-time');
        this.totalTimeEl = wrapper.querySelector('.total-time');
        this.playbackRateBadge = wrapper.querySelector('.playback-rate');
        this.progressBar = wrapper.querySelector('.progress-bar');
        this.progressFill = wrapper.querySelector('.progress-fill');
        this.progressHandle = wrapper.querySelector('.progress-handle');
        this.captionText = wrapper.querySelector('.caption-text');
        this.rateSelect = wrapper.querySelector('.rate-select');
        this.chapterItems = Array.from(wrapper.querySelectorAll('.chapter-item'));
    }

    bindEvents() {
        if (!this.playButton) {
            return;
        }

        this.playButton.addEventListener('click', () => this.togglePlay());
        this.rewindButton.addEventListener('click', () => this.seekBy(-10));
        this.forwardButton.addEventListener('click', () => this.seekBy(10));
        this.progressBar.addEventListener('click', (event) => this.seekTo(event));
        this.rateSelect.addEventListener('change', (event) => this.setPlaybackRate(parseFloat(event.target.value)));

        this.chapterItems.forEach((item) => {
            const button = item.querySelector('.chapter-btn');
            if (!button) return;

            button.addEventListener('click', () => {
                const start = Number(button.dataset.start) || 0;
                this.audioPlayer.currentTime = start;
                this.updateCaption(start);
                this.updateProgress();
                this.play();
            });
        });

        this.audioPlayer.addEventListener('timeupdate', () => {
            this.updateProgress();
            this.updateCaption();
        });

        this.audioPlayer.addEventListener('loadedmetadata', () => {
            this.totalTimeEl.textContent = this.formatTime(this.audioPlayer.duration);
        });

        this.audioPlayer.addEventListener('ended', () => {
            this.isPlaying = false;
            this.playButton.textContent = '▶ Play';
            this.playButton.classList.remove('active');
            this.audioPlayer.currentTime = 0;
            this.updateProgress();
            this.updateCaption(0);
        });

        this.audioPlayer.addEventListener('error', () => {
            console.warn('DaenaVoicePlayer: unable to load audio source', this.audioConfig.src);
            this.playButton.disabled = true;
            this.rewindButton.disabled = true;
            this.forwardButton.disabled = true;
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
        return this.audioPlayer.play()
            .then(() => {
                this.isPlaying = true;
                this.playButton.textContent = '⏸ Pause';
                this.playButton.classList.add('active');
            })
            .catch((error) => {
                console.warn('DaenaVoicePlayer: playback failed', error);
                this.playButton.textContent = '▶ Play';
                this.playButton.classList.remove('active');
                this.isPlaying = false;
            });
    }

    pause() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        this.playButton.textContent = '▶ Play';
        this.playButton.classList.remove('active');
    }

    seekBy(seconds) {
        const target = Math.min(
            Math.max(this.audioPlayer.currentTime + seconds, 0),
            this.audioPlayer.duration || Infinity
        );
        this.audioPlayer.currentTime = target;
        this.updateCaption(target);
    }

    seekTo(event) {
        if (!this.audioPlayer.duration) return;

        const rect = this.progressBar.getBoundingClientRect();
        const position = (event.clientX - rect.left) / rect.width;
        const newTime = position * this.audioPlayer.duration;

        this.audioPlayer.currentTime = newTime;
        this.updateCaption(newTime);
    }

    setPlaybackRate(rate) {
        if (!rate) return;
        this.audioPlayer.playbackRate = rate;
        this.playbackRateBadge.textContent = `${rate}x`;
    }

    updateProgress() {
        if (!this.audioPlayer.duration) {
            this.currentTimeEl.textContent = '0:00';
            this.totalTimeEl.textContent = '0:00';
            return;
        }

        const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.progressHandle.style.left = `${progress}%`;
        this.currentTimeEl.textContent = this.formatTime(this.audioPlayer.currentTime);
    }

    updateCaption(currentTime = this.audioPlayer.currentTime) {
        if (!this.chapters.length) return;

        let activeIndex = 0;
        for (let i = 0; i < this.chapters.length; i++) {
            if (currentTime >= this.chapters[i].start) {
                activeIndex = i;
            } else {
                break;
            }
        }

        if (this.activeChapterIndex !== activeIndex) {
            this.chapterItems.forEach((item) => item.classList.remove('active'));
            const activeItem = this.chapterItems[activeIndex];
            if (activeItem) {
                activeItem.classList.add('active');
            }
            this.activeChapterIndex = activeIndex;
        }

        this.captionText.textContent = this.chapters[activeIndex].label;
    }

    formatTime(seconds) {
        if (!isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Expose globally for inline scripts.
window.DaenaVoicePlayer = DaenaVoicePlayer;
