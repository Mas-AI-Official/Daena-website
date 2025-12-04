/**
 * Custom HTML5 Video Player
 * Supports multiple players on the same page via data attributes
 */

class CustomVideoPlayer {
    constructor(container) {
        this.container = container;
        this.video = container.querySelector('video[data-player]');
        if (!this.video) return;
        
        this.controls = {
            playPause: container.querySelector('[data-control="play-pause"]'),
            bigPlay: container.querySelector('[data-control="big-play"]'),
            seek: container.querySelector('[data-control="seek"]'),
            timeCurrent: container.querySelector('[data-control="time-current"]'),
            timeTotal: container.querySelector('[data-control="time-total"]'),
            volume: container.querySelector('[data-control="volume"]'),
            mute: container.querySelector('[data-control="mute"]'),
            speed: container.querySelector('[data-control="speed"]'),
            pip: container.querySelector('[data-control="pip"]'),
            fullscreen: container.querySelector('[data-control="fullscreen"]')
        };
        
        this.speeds = [0.75, 1, 1.25, 1.5, 1.75, 2];
        this.currentSpeedIndex = 1;
        
        this.init();
    }
    
    init() {
        // Play/Pause
        if (this.controls.playPause) {
            this.controls.playPause.addEventListener('click', () => this.togglePlay());
        }
        
        // Big play button
        if (this.controls.bigPlay) {
            this.controls.bigPlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.video.play().catch(err => {
                    console.warn('Play failed:', err);
                });
                this.hideBigPlayButton();
            });
        }
        
        // Video click to play/pause (but not when clicking the big play button)
        this.video.addEventListener('click', (e) => {
            // Don't trigger if clicking the big play button
            if (e.target.closest('#big-play-button')) return;
            
            if (this.video.paused) {
                this.video.play().catch(err => {
                    console.warn('Play failed:', err);
                });
                this.hideBigPlayButton();
            } else {
                this.video.pause();
                this.showBigPlayButton();
            }
        });
        
        // Seek is handled in loadedmetadata section below
        
        // Volume
        if (this.controls.volume) {
            this.controls.volume.addEventListener('input', (e) => {
                const newVolume = e.target.value / 100;
                this.video.volume = newVolume;
                // Unmute if volume is increased
                if (newVolume > 0 && this.video.muted) {
                    this.video.muted = false;
                    this.updateMuteButton();
                }
                // Update mute button state
                if (this.controls.mute && newVolume === 0) {
                    this.video.muted = true;
                    this.updateMuteButton();
                }
            });
        }
        
        // Mute
        if (this.controls.mute) {
            this.controls.mute.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMute();
            });
            // Update mute button state when volume changes
            this.video.addEventListener('volumechange', () => {
                if (this.controls.mute) {
                    this.controls.mute.setAttribute('aria-pressed', this.video.muted ? 'true' : 'false');
                    this.updateMuteButton();
                }
            });
        }
        
        // Speed
        if (this.controls.speed) {
            this.controls.speed.addEventListener('click', () => this.changeSpeed());
        }
        
        // PiP
        if (this.controls.pip && document.pictureInPictureEnabled) {
            this.controls.pip.addEventListener('click', () => this.togglePiP());
        } else if (this.controls.pip) {
            this.controls.pip.style.display = 'none';
        }
        
        // Fullscreen
        if (this.controls.fullscreen) {
            this.controls.fullscreen.addEventListener('click', () => this.toggleFullscreen());
        }
        
        // Fullscreen change listeners for cross-browser compatibility
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
        
        // Ensure controls work in fullscreen - reattach event listeners
        this.video.addEventListener('click', (e) => {
            // Allow video click to toggle play/pause in fullscreen
            if (this.isFullscreen()) {
                e.preventDefault();
                this.togglePlay();
            }
        });
        
        // Keyboard shortcuts
        this.video.addEventListener('keydown', (e) => this.handleKeyboard(e));
        this.video.setAttribute('tabindex', '0');
        
        // Also listen for keyboard events on document when in fullscreen
        document.addEventListener('keydown', (e) => {
            if (this.isFullscreen() && this.container.contains(document.activeElement)) {
                this.handleKeyboard(e);
            }
        });
        
        // Update time display and handle seek bar
        this.video.addEventListener('loadedmetadata', () => {
            this.updateTime();
            // Set seek max to duration (use seconds, not percentage)
            if (this.controls.seek) {
                this.controls.seek.max = this.video.duration || 100;
                this.controls.seek.step = 0.1;
            }
        });
        
        // Handle seek bar (use duration in seconds, not percentage)
        if (this.controls.seek) {
            this.controls.seek.addEventListener('input', (e) => {
                const time = Number(e.target.value);
                if (!isNaN(time) && isFinite(time)) {
                    this.video.currentTime = time;
                }
            });
            
            this.video.addEventListener('timeupdate', () => {
                if (!this.controls.seek.matches(':active')) {
                    this.controls.seek.value = this.video.currentTime || 0;
                }
                this.updateTime();
            });
        }
        
        // Auto-generate poster if missing
        this.video.addEventListener('loadeddata', () => {
            if (!this.video.getAttribute('poster') && this.video.videoWidth > 0) {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = this.video.videoWidth;
                    canvas.height = this.video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
                    this.video.setAttribute('poster', canvas.toDataURL('image/jpeg', 0.8));
                    this.video.currentTime = 0;
                } catch(e) {
                    console.warn('Could not generate poster:', e);
                }
            }
        }, { once: true });
        
        // Update play/pause button and playing indicator
        this.video.addEventListener('play', () => {
            this.updatePlayPauseButton(true);
            this.hideBigPlayButton();
            // Show playing indicator
            const indicator = this.container.querySelector('#video-playing-indicator');
            if (indicator) {
                indicator.style.opacity = '1';
            }
        });
        
        this.video.addEventListener('pause', () => {
            this.updatePlayPauseButton(false);
            this.showBigPlayButton();
            // Hide playing indicator
            const indicator = this.container.querySelector('#video-playing-indicator');
            if (indicator) {
                indicator.style.opacity = '0';
            }
        });
        
        this.video.addEventListener('ended', () => {
            this.updatePlayPauseButton(false);
            this.showBigPlayButton();
            const indicator = this.container.querySelector('#video-playing-indicator');
            if (indicator) {
                indicator.style.opacity = '0';
            }
        });
    }
    
    togglePlay() {
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }
    
    toggleMute() {
        this.video.muted = !this.video.muted;
        this.updateMuteButton();
        // Also update volume slider to reflect mute state
        if (this.controls.volume) {
            if (this.video.muted) {
                this.controls.volume.dataset.preMuteVolume = this.video.volume;
                this.controls.volume.value = 0;
            } else {
                const preMuteVolume = parseFloat(this.controls.volume.dataset.preMuteVolume || '1');
                this.video.volume = preMuteVolume;
                this.controls.volume.value = preMuteVolume * 100;
            }
        }
    }
    
    updateMuteButton() {
        if (this.controls.mute) {
            this.controls.mute.setAttribute('aria-pressed', this.video.muted ? 'true' : 'false');
            const unmutedIcon = this.controls.mute.querySelector('.unmuted-icon');
            const mutedIcon = this.controls.mute.querySelector('.muted-icon');
            if (unmutedIcon && mutedIcon) {
                unmutedIcon.style.display = this.video.muted ? 'none' : 'block';
                mutedIcon.style.display = this.video.muted ? 'block' : 'none';
            }
            // Visual feedback
            this.controls.mute.style.background = this.video.muted 
                ? 'rgba(255, 0, 0, 0.2)' 
                : '';
            setTimeout(() => {
                if (this.controls.mute) {
                    this.controls.mute.style.background = '';
                }
            }, 300);
        }
    }
    
    changeSpeed() {
        this.currentSpeedIndex = (this.currentSpeedIndex + 1) % this.speeds.length;
        this.video.playbackRate = this.speeds[this.currentSpeedIndex];
        if (this.controls.speed) {
            this.controls.speed.textContent = `${this.speeds[this.currentSpeedIndex]}×`;
            // Visual feedback
            this.controls.speed.style.background = this.speeds[this.currentSpeedIndex] > 1 
                ? 'rgba(255, 215, 0, 0.2)' 
                : 'rgba(255, 255, 255, 0.1)';
            setTimeout(() => {
                if (this.controls.speed) {
                    this.controls.speed.style.background = '';
                }
            }, 300);
        }
    }
    
    async togglePiP() {
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                await this.video.requestPictureInPicture();
            }
        } catch (err) {
            console.error('PiP error:', err);
        }
    }
    
    toggleFullscreen() {
        // Handle different fullscreen APIs for cross-browser compatibility
        const doc = document;
        const docEl = doc.documentElement;
        
        const requestFullscreen = docEl.requestFullscreen || 
                                  docEl.webkitRequestFullscreen || 
                                  docEl.mozRequestFullScreen || 
                                  docEl.msRequestFullscreen;
        
        const exitFullscreen = doc.exitFullscreen || 
                               doc.webkitExitFullscreen || 
                               doc.mozCancelFullScreen || 
                               doc.msExitFullscreen;
        
        const isFullscreen = doc.fullscreenElement || 
                            doc.webkitFullscreenElement || 
                            doc.mozFullScreenElement || 
                            doc.msFullscreenElement;
        
        if (!isFullscreen) {
            // Request fullscreen on the container (not just video) so controls stay visible
            const container = this.container;
            if (requestFullscreen) {
                requestFullscreen.call(container).catch(err => {
                    console.error('Fullscreen error:', err);
                });
            }
        } else {
            // Exit fullscreen quickly
            if (exitFullscreen) {
                exitFullscreen.call(doc);
            }
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    updatePlayPauseButton(playing) {
        if (this.controls.playPause) {
            this.controls.playPause.setAttribute('aria-pressed', playing ? 'true' : 'false');
            const playIcon = this.controls.playPause.querySelector('.play-icon');
            const pauseIcon = this.controls.playPause.querySelector('.pause-icon');
            if (playIcon && pauseIcon) {
                playIcon.style.display = playing ? 'none' : 'block';
                pauseIcon.style.display = playing ? 'block' : 'none';
            }
        }
    }
    
    showBigPlayButton() {
        if (this.controls.bigPlay && this.video.paused) {
            this.controls.bigPlay.style.display = 'flex';
        }
    }
    
    hideBigPlayButton() {
        if (this.controls.bigPlay) {
            this.controls.bigPlay.style.display = 'none';
        }
    }
    
    updateTime() {
        if (this.controls.timeCurrent) {
            this.controls.timeCurrent.textContent = this.formatTime(this.video.currentTime);
        }
        if (this.controls.timeTotal) {
            this.controls.timeTotal.textContent = this.formatTime(this.video.duration);
        }
    }
    
    isFullscreen() {
        const doc = document;
        return !!(doc.fullscreenElement || 
                 doc.webkitFullscreenElement || 
                 doc.mozFullScreenElement || 
                 doc.msFullscreenElement);
    }
    
    handleFullscreenChange() {
        const isFullscreen = this.isFullscreen();
        const container = this.container;
        
        if (isFullscreen) {
            // Ensure controls are visible and positioned correctly in fullscreen
            container.classList.add('fullscreen-active');
            // Make sure controls are accessible
            if (this.controls.playPause) {
                this.controls.playPause.focus();
            }
        } else {
            container.classList.remove('fullscreen-active');
        }
    }
    
    handleKeyboard(e) {
        // Allow keyboard shortcuts in fullscreen mode
        const isFullscreen = this.isFullscreen();
        const isInContainer = this.container.contains(e.target) || 
                             this.container.contains(document.activeElement) ||
                             isFullscreen;
        
        if (!isInContainer && !isFullscreen) return;
        
        switch(e.key) {
            case ' ':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'm':
            case 'M':
                e.preventDefault();
                this.toggleMute();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.video.currentTime = Math.max(0, this.video.currentTime - 10);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 10);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.video.volume = Math.min(1, this.video.volume + 0.1);
                if (this.controls.volume) {
                    this.controls.volume.value = this.video.volume * 100;
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.video.volume = Math.max(0, this.video.volume - 0.1);
                if (this.controls.volume) {
                    this.controls.volume.value = this.video.volume * 100;
                }
                break;
        }
    }
}

// Initialize all players on page load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-player-container]').forEach(container => {
        new CustomVideoPlayer(container);
    });
});

