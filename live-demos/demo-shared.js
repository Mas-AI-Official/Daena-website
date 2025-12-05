// Shared functionality for Daena Live Demos

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Metatron background if not present
    if (!document.querySelector('.metatron-bg')) {
        const bg = document.createElement('div');
        bg.className = 'metatron-bg';
        document.body.prepend(bg);
    }

    if (!document.querySelector('.metatron-pattern-bg')) {
        const pattern = document.createElement('div');
        pattern.className = 'metatron-pattern-bg';
        document.body.prepend(pattern);
    }

    // Add back button functionality
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // Return to the live demos tab on the main page
            window.location.href = '/#live-demos-section';
        });
    }

    // Audio Player Logic
    const audioPlayer = document.getElementById('demo-audio');
    const executeBtn = document.getElementById('execute-demo-btn');
    const progressBar = document.querySelector('.progress-bar-fill');
    const statusText = document.getElementById('demo-status-text');

    if (audioPlayer && executeBtn) {
        executeBtn.addEventListener('click', function () {
            if (audioPlayer.paused) {
                audioPlayer.play();
                executeBtn.innerHTML = '<span class="text-xl">⏸️</span> Pause Demo';
                if (statusText) statusText.textContent = 'Demo Running...';
            } else {
                audioPlayer.pause();
                executeBtn.innerHTML = '<span class="text-xl">▶️</span> Resume Demo';
                if (statusText) statusText.textContent = 'Demo Paused';
            }
        });

        audioPlayer.addEventListener('timeupdate', function () {
            if (progressBar) {
                const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                progressBar.style.width = percent + '%';
            }

            // Dispatch custom event for sync
            const event = new CustomEvent('demo-timeupdate', {
                detail: { currentTime: audioPlayer.currentTime }
            });
            document.dispatchEvent(event);
        });

        audioPlayer.addEventListener('ended', function () {
            executeBtn.innerHTML = '<span class="text-xl">🔄</span> Replay Demo';
            if (statusText) statusText.textContent = 'Demo Complete';
        });
    }
});
