(function () {
  function formatTime(s) {
    s = Math.max(0, s | 0);
    const m = (s / 60) | 0;
    const r = (s % 60) | 0;
    return m + ":" + (r < 10 ? "0" + r : r);
  }

  function init(el) {
    const video = el.querySelector("video");
    const overlayPlay = el.querySelector(".overlay-play");
    const btnPlay = el.querySelector('[data-action="play"]');
    const btnMute = el.querySelector('[data-action="mute"]');
    const btnSpeed = el.querySelector('[data-action="speed"]');
    const btnFS = el.querySelector('[data-action="fs"]');
    const seek = el.querySelector(".seek");
    const vol = el.querySelector(".volume");
    const tNow = el.querySelector('[data-time="current"]');
    const tDur = el.querySelector('[data-time="duration"]');

    if (!video || !overlayPlay || !btnPlay) return; // Safety check

    // Attach source & poster
    video.src = el.dataset.video;
    video.setAttribute("poster", el.dataset.poster);

    // Restore volume and speed
    const savedVol = +localStorage.getItem("daena:vid:vol");
    if (!Number.isNaN(savedVol)) video.volume = Math.min(1, Math.max(0, savedVol));
    vol.value = video.volume;
    
    const savedSpeed = +localStorage.getItem("daena:vid:speed");
    const speeds = [1, 1.25, 1.5, 1.75, 2];
    let currentSpeedIndex = 0;
    if (!Number.isNaN(savedSpeed) && speeds.includes(savedSpeed)) {
      video.playbackRate = savedSpeed;
      currentSpeedIndex = speeds.indexOf(savedSpeed);
    } else {
      video.playbackRate = 1;
    }
    if (btnSpeed) {
      const speedText = btnSpeed.querySelector('.speed-text');
      if (speedText) speedText.textContent = video.playbackRate + 'x';
    }

    let seekDragging = false;

    function setState() {
      el.classList.toggle("playing", !video.paused);
      el.classList.toggle("paused", video.paused);
      el.classList.toggle("muted", video.muted || video.volume === 0);
    }

    function togglePlay() {
      if (video.paused) video.play();
      else video.pause();
    }

    overlayPlay.addEventListener("click", togglePlay);
    btnPlay.addEventListener("click", togglePlay);
    video.addEventListener("play", setState);
    video.addEventListener("pause", setState);
    setState();

    // Time + seek
    video.addEventListener("loadedmetadata", () => {
      if (tDur) tDur.textContent = formatTime(video.duration);
    });

    video.addEventListener("timeupdate", () => {
      if (tNow) tNow.textContent = formatTime(video.currentTime);
      if (!seekDragging && video.duration && seek) {
        seek.value = (video.currentTime / video.duration) * 1000;
      }
    });

    if (seek) {
      seek.addEventListener("input", () => {
        if (!video.duration) return;
        seekDragging = true;
        const p = +seek.value / 1000;
        video.currentTime = p * video.duration;
      });
      seek.addEventListener("change", () => {
        seekDragging = false;
      });
    }

    // Volume
    if (vol) {
      vol.addEventListener("input", () => {
        video.volume = +vol.value;
        video.muted = (video.volume === 0);
        localStorage.setItem("daena:vid:vol", video.volume.toFixed(2));
        setState();
      });
    }

    if (btnMute) {
      btnMute.addEventListener("click", () => {
        video.muted = !video.muted;
        if (!video.muted && video.volume === 0) {
          video.volume = 0.4;
          if (vol) vol.value = 0.4;
        }
        setState();
      });
    }

    // Speed control
    if (btnSpeed) {
      btnSpeed.addEventListener("click", () => {
        currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
        video.playbackRate = speeds[currentSpeedIndex];
        localStorage.setItem("daena:vid:speed", video.playbackRate.toString());
        const speedText = btnSpeed.querySelector('.speed-text');
        if (speedText) speedText.textContent = video.playbackRate + 'x';
        btnSpeed.setAttribute('title', `Speed: ${video.playbackRate}x`);
      });
    }

    // Fullscreen (make the container fullscreen so controls remain visible)
    if (btnFS) {
      btnFS.addEventListener("click", () => {
        const container = el;
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
          if (document.exitFullscreen) document.exitFullscreen();
          else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
          else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
          else if (document.msExitFullscreen) document.msExitFullscreen();
        } else {
          if (container.requestFullscreen) container.requestFullscreen();
          else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
          else if (container.mozRequestFullScreen) container.mozRequestFullScreen();
          else if (container.msRequestFullscreen) container.msRequestFullscreen();
        }
      });
    }

    // Keyboard controls when focused
    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => {
      switch (e.key.toLowerCase()) {
        case " ":
        case "enter":
          e.preventDefault(); 
          togglePlay(); 
          break;
        case "arrowleft":
          video.currentTime = Math.max(0, video.currentTime - 5); 
          break;
        case "arrowright":
          video.currentTime = Math.min(video.duration || 0, video.currentTime + 5); 
          break;
        case "arrowup":
          video.volume = Math.min(1, video.volume + 0.05); 
          if (vol) vol.value = video.volume; 
          setState(); 
          break;
        case "arrowdown":
          video.volume = Math.max(0, video.volume - 0.05); 
          if (vol) vol.value = video.volume; 
          setState(); 
          break;
        case "m":
          video.muted = !video.muted; 
          setState(); 
          break;
        case "f":
          if (btnFS) btnFS.click(); 
          break;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".daena-video").forEach(init);
  });
})();
