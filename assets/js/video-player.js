function initDaenaPlayer(root){
  const vid = root.querySelector('.daena-video');
  const overlay = root.querySelector('.daena-video-overlay');
  const playBtn = root.querySelector('.ctrl.play');
  const muteBtn = root.querySelector('.ctrl.mute');
  const seek = root.querySelector('.seek');
  const cur = root.querySelector('.time .current');
  const dur = root.querySelector('.time .duration');
  const rateBtn = root.querySelector('.ctrl.rate');
  const fsBtn = root.querySelector('.ctrl.fs');

  if (!vid || !overlay || !playBtn) return; // Safety check

  const fmt = s => {
    s = Math.max(0, Math.floor(s || 0));
    const m = Math.floor(s/60), ss = String(s%60).padStart(2,'0');
    return `${m}:${ss}`;
  };

  const setPlayIcon = () => {
    if (playBtn) playBtn.textContent = vid.paused ? '▶︎' : '⏸';
  };
  
  const setMuteIcon = () => {
    if (muteBtn) muteBtn.textContent = vid.muted ? '🔇' : '🔈';
  };

  function updateSeek(){
    if (!isFinite(vid.duration)) return;
    if (seek) seek.value = (vid.currentTime / vid.duration) * 100;
    if (cur) cur.textContent = fmt(vid.currentTime);
  }

  function updateDur(){
    if (isFinite(vid.duration) && dur) dur.textContent = fmt(vid.duration);
  }

  // Overlay click
  overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
    vid.play().catch(()=>{}); // iOS may require user gesture—overlay counts
  });

  // Buttons
  if (playBtn) {
    playBtn.addEventListener('click', () => vid.paused ? vid.play() : vid.pause());
  }
  
  if (muteBtn) {
    muteBtn.addEventListener('click', () => { 
      vid.muted = !vid.muted; 
      setMuteIcon(); 
    });
  }
  
  if (rateBtn) {
    rateBtn.addEventListener('click', () => {
      const rates = [1, 1.25, 1.5, 2];
      const i = rates.indexOf(vid.playbackRate);
      vid.playbackRate = rates[(i+1)%rates.length];
      rateBtn.textContent = `${vid.playbackRate}×`;
    });
  }
  
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      const c = root.querySelector('.daena-video-frame');
      if (!document.fullscreenElement) {
        if (c.requestFullscreen) c.requestFullscreen();
        else if (c.webkitRequestFullscreen) c.webkitRequestFullscreen();
        else if (c.mozRequestFullScreen) c.mozRequestFullScreen();
        else if (c.msRequestFullscreen) c.msRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
      }
    });
  }

  // Seek
  let dragging = false;
  if (seek) {
    seek.addEventListener('input', () => {
      dragging = true;
      if (isFinite(vid.duration)) vid.currentTime = (seek.value/100) * vid.duration;
      updateSeek();
    });
    seek.addEventListener('change', () => dragging = false);
  }

  // Video events
  vid.addEventListener('play', () => {
    setPlayIcon();
    if (overlay) overlay.style.display = 'none';
  });
  
  vid.addEventListener('pause', setPlayIcon);
  
  vid.addEventListener('timeupdate', () => { 
    if (!dragging) updateSeek(); 
  });
  
  vid.addEventListener('loadedmetadata', () => { 
    updateDur(); 
    updateSeek(); 
  });
  
  vid.addEventListener('ended', () => { 
    if (overlay) overlay.style.display = '';
    setPlayIcon(); 
  });

  // Keyboard shortcuts (when card is focused)
  root.tabIndex = 0;
  root.addEventListener('keydown', (e)=>{
    if (['Space','KeyK'].includes(e.code)){ 
      e.preventDefault(); 
      vid.paused ? vid.play() : vid.pause(); 
    }
    if (e.code==='ArrowRight'){ 
      vid.currentTime = Math.min(vid.currentTime + 5, vid.duration); 
    }
    if (e.code==='ArrowLeft'){ 
      vid.currentTime = Math.max(vid.currentTime - 5, 0); 
    }
    if (e.code==='KeyM'){ 
      vid.muted = !vid.muted; 
      setMuteIcon(); 
    }
  });

  // Start with poster visible and controls ready
  setPlayIcon(); 
  setMuteIcon(); 
  updateDur(); 
  updateSeek();
}

// Auto-init any players on the page
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.daena-video-card').forEach(initDaenaPlayer);
});

