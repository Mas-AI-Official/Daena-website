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
            seek: container.querySelector('[data-control="seek"]'),
            time: container.querySelector('[data-control="time"]'),
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
        
        // Seek
        if (this.controls.seek) {
            this.controls.seek.addEventListener('input', (e) => {
                const time = (e.target.value / 100) * this.video.duration;
                this.video.currentTime = time;
            });
            
            this.video.addEventListener('timeupdate', () => {
                const percent = (this.video.currentTime / this.video.duration) * 100;
                this.controls.seek.value = percent || 0;
                this.updateTime();
            });
        }
        
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
        
        // Update time display
        this.video.addEventListener('loadedmetadata', () => this.updateTime());
        this.video.addEventListener('timeupdate', () => this.updateTime());
        
        // Update play/pause button and playing indicator
        this.video.addEventListener('play', () => {
            if (this.controls.playPause) {
                this.controls.playPause.setAttribute('aria-pressed', 'true');
                this.controls.playPause.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>';
            }
            // Show playing indicator
            const indicator = this.container.querySelector('#video-playing-indicator');
            if (indicator) {
                indicator.style.opacity = '1';
            }
        });
        
        this.video.addEventListener('pause', () => {
            if (this.controls.playPause) {
                this.controls.playPause.setAttribute('aria-pressed', 'false');
                this.controls.playPause.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg>';
            }
            // Hide playing indicator
            const indicator = this.container.querySelector('#video-playing-indicator');
            if (indicator) {
                indicator.style.opacity = '0';
            }
        });
        
        this.video.addEventListener('ended', () => {
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
            // Muted icon (speaker with X)
            const mutedIcon = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd"/></svg>';
            // Unmuted icon (speaker)
            const unmutedIcon = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd"/></svg>';
            this.controls.mute.innerHTML = this.video.muted ? mutedIcon : unmutedIcon;
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
    
    updateTime() {
        if (this.controls.time) {
            const current = this.formatTime(this.video.currentTime);
            const total = this.formatTime(this.video.duration);
            // Use monospace font for proper alignment
            this.controls.time.textContent = `${current} / ${total}`;
            this.controls.time.style.fontVariantNumeric = 'tabular-nums';
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

