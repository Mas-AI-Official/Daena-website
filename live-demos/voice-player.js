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
                return `<option value="${numericRate}">${label}</option>`;
            }).join('');

            this.container.innerHTML = `
                <div class="daena-voice-player">
                    <div class="player-header">
                        <h4 class="demo-title">${this.escapeHtml(this.title)}</h4>
                        <div class="playback-info">
                            <span class="current-time">0:00</span>
                            <span>/</span>
                            <span class="total-time">0:00</span>
                            <span class="playback-rate">1x</span>
                        </div>
                    </div>
                    <div class="player-controls">
                        <button class="control-btn rewind" title="Rewind ${this.rewindSeconds}s">⏪</button>
                        <button class="control-btn play-pause" title="Play/Pause">▶</button>
                        <button class="control-btn forward" title="Forward ${this.forwardSeconds}s">⏩</button>
                        <select class="rate-select" title="Playback Speed">${rateOptions}</select>
                    </div>
                    <div class="progress-container">
                        <input type="range" class="progress-slider" min="0" max="100" value="0" step="0.1" title="Seek">
                        <div class="chapter-markers"></div>
                    </div>
                    <div class="status-message">${this.defaultCaption}</div>
                </div>
            `;
        }

        cacheDom() {
            this.playPauseBtn = this.container.querySelector('.play-pause');
            this.rewindBtn = this.container.querySelector('.rewind');
            this.forwardBtn = this.container.querySelector('.forward');
            this.rateSelect = this.container.querySelector('.rate-select');
            this.progressSlider = this.container.querySelector('.progress-slider');
            this.currentTimeEl = this.container.querySelector('.current-time');
            this.totalTimeEl = this.container.querySelector('.total-time');
            this.rateDisplay = this.container.querySelector('.playback-rate');
            this.statusMessage = this.container.querySelector('.status-message');
            this.chapterMarkers = this.container.querySelector('.chapter-markers');
        }

        initAudio() {
            this.audioPlayer = new Audio();
            this.audioPlayer.preload = 'metadata';
            this.audioPlayer.addEventListener('loadedmetadata', () => this.updateTotalTime());
            this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
            this.audioPlayer.addEventListener('ended', () => this.onEnded());
            this.audioPlayer.addEventListener('error', (e) => this.onError(e));
        }

        bindUiEvents() {
            this.playPauseBtn?.addEventListener('click', () => this.togglePlayPause());
            this.rewindBtn?.addEventListener('click', () => this.rewind());
            this.forwardBtn?.addEventListener('click', () => this.forward());
            this.rateSelect?.addEventListener('change', (e) => this.setPlaybackRate(Number(e.target.value)));
            this.progressSlider?.addEventListener('input', (e) => this.seek(Number(e.target.value)));
        }

        bindAudioEvents() {
            this.audioPlayer.addEventListener('play', () => {
                this.playPauseBtn.textContent = '⏸';
                this.playPauseBtn.title = 'Pause';
            });
            this.audioPlayer.addEventListener('pause', () => {
                this.playPauseBtn.textContent = '▶';
                this.playPauseBtn.title = 'Play';
            });
        }

        async loadAudio(src) {
            try {
                this.audioPlayer.src = src;
                await this.audioPlayer.load();
                this.setStatusMessage('Ready to play.');
            } catch (error) {
                console.error('Failed to load audio:', error);
                this.setStatusMessage('Failed to load audio file.');
                this.disableControls();
            }
        }

        togglePlayPause() {
            if (this.audioPlayer.paused) {
                this.audioPlayer.play().catch(err => {
                    console.error('Play failed:', err);
                    this.setStatusMessage('Playback failed. Please check your connection.');
                });
            } else {
                this.audioPlayer.pause();
            }
        }

        rewind() {
            this.audioPlayer.currentTime = Math.max(0, this.audioPlayer.currentTime - this.rewindSeconds);
        }

        forward() {
            this.audioPlayer.currentTime = Math.min(this.audioPlayer.duration || 0, this.audioPlayer.currentTime + this.forwardSeconds);
        }

        setPlaybackRate(rate) {
            this.audioPlayer.playbackRate = rate;
            this.rateDisplay.textContent = `${rate}x`;
        }

        seek(percentage) {
            if (this.audioPlayer.duration) {
                this.audioPlayer.currentTime = (percentage / 100) * this.audioPlayer.duration;
            }
        }

        updateProgress() {
            if (this.audioPlayer.duration) {
                const percentage = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
                this.progressSlider.value = percentage;
                this.updateCurrentTime();
                this.updateActiveChapter();
            }
        }

        updateCurrentTime() {
            const time = this.formatTime(this.audioPlayer.currentTime);
            this.currentTimeEl.textContent = time;
        }

        updateTotalTime() {
            const time = this.formatTime(this.audioPlayer.duration);
            this.totalTimeEl.textContent = time;
        }

        updateActiveChapter() {
            const currentTime = this.audioPlayer.currentTime;
            let newActiveIndex = -1;
            for (let i = 0; i < this.chapters.length; i++) {
                if (currentTime >= this.chapters[i].t) {
                    newActiveIndex = i;
                } else {
                    break;
                }
            }
            if (newActiveIndex !== this.activeChapterIndex) {
                this.activeChapterIndex = newActiveIndex;
                this.decorateChapters();
            }
        }

        decorateChapters() {
            if (!this.chapterMarkers || this.chapters.length === 0) return;
            const markers = this.chapters.map((ch, i) => {
                const percentage = this.audioPlayer.duration ? (ch.t / this.audioPlayer.duration) * 100 : 0;
                const isActive = i === this.activeChapterIndex;
                return `<div class="chapter-marker ${isActive ? 'active' : ''}" style="left: ${percentage}%" title="${this.escapeHtml(ch.label)}"></div>`;
            }).join('');
            this.chapterMarkers.innerHTML = markers;
        }

        onEnded() {
            this.playPauseBtn.textContent = '▶';
            this.setStatusMessage('Playback completed.');
        }

        onError(e) {
            console.error('Audio error:', e);
            this.setStatusMessage('Audio playback error occurred.');
            this.disableControls();
        }

        setStatusMessage(message) {
            if (this.statusMessage) {
                this.statusMessage.textContent = message;
            }
        }

        disableControls() {
            this.controlsDisabled = true;
            [this.playPauseBtn, this.rewindBtn, this.forwardBtn, this.rateSelect, this.progressSlider].forEach(el => {
                if (el) el.disabled = true;
            });
        }

        play() {
            return this.audioPlayer.play();
        }

        pause() {
            this.audioPlayer.pause();
        }

        formatTime(seconds) {
            if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        normalizeAudioConfig(audio) {
            if (!audio) return null;
            if (typeof audio === 'string') return { src: audio };
            if (typeof audio === 'object' && audio.src) return audio;
            return null;
        }

        normalizeChapters(chapters) {
            if (!Array.isArray(chapters)) return [];
            return chapters.map(ch => ({
                t: Number(ch.t) || 0,
                id: ch.id || '',
                label: ch.label || ''
            })).sort((a, b) => a.t - b.t);
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    }

    window.DaenaVoicePlayer = DaenaVoicePlayer;
})();

