/**
 * Enhanced Video Controls
 * Adds custom speed control and forward/backward buttons
 */

document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('video[id^="daena-video"]');
    
    videos.forEach(video => {
        // Add custom controls if native controls don't support all features
        if (video.controls) {
            // Speed control (native browser support)
            // Most browsers support right-click context menu for speed
            // We'll add keyboard shortcuts for better UX
            
            // Keyboard shortcuts
            video.addEventListener('keydown', function(e) {
                // Space: play/pause
                if (e.code === 'Space' && e.target === video) {
                    e.preventDefault();
                    if (video.paused) {
                        video.play();
                    } else {
                        video.pause();
                    }
                }
                
                // Arrow Right: forward 10 seconds
                if (e.code === 'ArrowRight' && e.target === video) {
                    e.preventDefault();
                    video.currentTime = Math.min(video.currentTime + 10, video.duration);
                }
                
                // Arrow Left: backward 10 seconds
                if (e.code === 'ArrowLeft' && e.target === video) {
                    e.preventDefault();
                    video.currentTime = Math.max(video.currentTime - 10, 0);
                }
                
                // Number keys: speed control
                if (e.code.startsWith('Digit')) {
                    const speedMap = {
                        'Digit1': 0.5,
                        'Digit2': 0.75,
                        'Digit3': 1.0,
                        'Digit4': 1.25,
                        'Digit5': 1.5,
                        'Digit6': 2.0
                    };
                    if (speedMap[e.code]) {
                        e.preventDefault();
                        video.playbackRate = speedMap[e.code];
                        // Show speed indicator
                        showSpeedIndicator(video, speedMap[e.code]);
                    }
                }
            });
            
            // Make video focusable for keyboard controls
            video.setAttribute('tabindex', '0');
            
            // Add title for accessibility
            video.setAttribute('title', 'Video controls: Space=Play/Pause, ←/→=Seek, 1-6=Speed');
        }
    });
});

function showSpeedIndicator(video, speed) {
    // Remove existing indicator
    const existing = video.parentElement.querySelector('.speed-indicator');
    if (existing) {
        existing.remove();
    }
    
    // Create speed indicator
    const indicator = document.createElement('div');
    indicator.className = 'speed-indicator';
    indicator.textContent = `${speed}×`;
    indicator.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: bold;
        font-size: 18px;
        z-index: 10;
        pointer-events: none;
        animation: fadeOut 2s forwards;
    `;
    
    // Add fade out animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; }
            70% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    if (!document.querySelector('#speed-indicator-style')) {
        style.id = 'speed-indicator-style';
        document.head.appendChild(style);
    }
    
    video.parentElement.style.position = 'relative';
    video.parentElement.appendChild(indicator);
    
    // Remove after animation
    setTimeout(() => {
        if (indicator.parentElement) {
            indicator.remove();
        }
    }, 2000);
}

