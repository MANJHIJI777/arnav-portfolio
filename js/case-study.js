/**
 * CASE STUDY INTERACTIVE SCRIPTS
 * - Draggable Before / After Log vs Graded split comparison
 * - Interactive multi-track sound design stems with waveform visualizers
 * - Full-width video player controls (timecode, scrub bar, letterbox toggle)
 */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSlider();
  initSoundDesignStems();
  initCaseVideoPlayer();
  initScrollReveals();
  initNextProjectVideo();
});

/* ==========================================================================
   1. INTERACTIVE BEFORE / AFTER SLIDER
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('beforeAfterSlider');
  if (!container) return;

  const beforeLayer = container.querySelector('.comparison-layer-before');
  const handle = container.querySelector('.comparison-handle');
  if (!beforeLayer || !handle) return;

  let isDragging = false;

  function updateSlider(xPos) {
    const rect = container.getBoundingClientRect();
    let ratio = (xPos - rect.left) / rect.width;
    ratio = Math.max(0, Math.min(1, ratio));

    const percentage = ratio * 100;
    beforeLayer.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  // Pointer events (handles both mouse and touch seamlessly)
  container.addEventListener('pointerdown', (e) => {
    isDragging = true;
    container.setPointerCapture(e.pointerId);
    updateSlider(e.clientX);
  });

  container.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  function stopDrag(e) {
    if (isDragging) {
      isDragging = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  }

  container.addEventListener('pointerup', stopDrag);
  container.addEventListener('pointercancel', stopDrag);

  // Keyboard navigation accessibility
  container.setAttribute('tabindex', '0');
  container.setAttribute('role', 'slider');
  container.setAttribute('aria-label', 'Before and After comparison slider');
  container.setAttribute('aria-valuemin', '0');
  container.setAttribute('aria-valuemax', '100');
  container.setAttribute('aria-valuenow', '50');

  let currentPercent = 50;
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      currentPercent = Math.max(0, currentPercent - 5);
      beforeLayer.style.width = `${currentPercent}%`;
      handle.style.left = `${currentPercent}%`;
      container.setAttribute('aria-valuenow', currentPercent);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      currentPercent = Math.min(100, currentPercent + 5);
      beforeLayer.style.width = `${currentPercent}%`;
      handle.style.left = `${currentPercent}%`;
      container.setAttribute('aria-valuenow', currentPercent);
    }
  });
}

/* ==========================================================================
   2. SOUND DESIGN STEMS RACK & WAVEFORM VISUALIZER
   ========================================================================== */
function initSoundDesignStems() {
  const tracks = document.querySelectorAll('.stem-track');
  if (!tracks.length) return;

  // Build animated waveforms for each stem
  tracks.forEach((track) => {
    const waveformContainer = track.querySelector('.stem-waveform-container');
    if (waveformContainer) {
      const barCount = 36;
      waveformContainer.innerHTML = '';
      for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'waveform-bar';
        const randomHeight = Math.floor(Math.random() * 24 + 6);
        bar.style.height = `${randomHeight}px`;
        waveformContainer.appendChild(bar);
      }
    }

    const muteBtn = track.querySelector('[data-action="mute"]');
    const soloBtn = track.querySelector('[data-action="solo"]');

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        track.classList.toggle('muted');
        const isMuted = track.classList.contains('muted');
        muteBtn.classList.toggle('active', isMuted);
        muteBtn.textContent = isMuted ? 'MUTED' : 'MUTE';
      });
    }

    if (soloBtn) {
      soloBtn.addEventListener('click', () => {
        const wasActive = soloBtn.classList.contains('active');
        if (wasActive) {
          soloBtn.classList.remove('active');
          tracks.forEach(t => t.classList.remove('muted'));
        } else {
          tracks.forEach(t => {
            const btn = t.querySelector('[data-action="solo"]');
            if (btn) btn.classList.remove('active');
            t.classList.add('muted');
          });
          soloBtn.classList.add('active');
          track.classList.remove('muted');
        }
      });
    }
  });

  // Waveform pulsing animation
  setInterval(() => {
    tracks.forEach(track => {
      if (track.classList.contains('muted')) return;
      const bars = track.querySelectorAll('.waveform-bar');
      bars.forEach(bar => {
        if (Math.random() > 0.4) {
          const newH = Math.floor(Math.random() * 28 + 4);
          bar.style.height = `${newH}px`;
        }
      });
    });
  }, 220);
}

/* ==========================================================================
   3. CASE VIDEO PLAYER
   ========================================================================== */
function initCaseVideoPlayer() {
  const container = document.getElementById('casePlayerContainer');
  if (!container) return;

  const video = container.querySelector('.case-video-media');
  const centerBtn = container.querySelector('.case-video-center-btn');
  const playToggle = container.querySelector('#casePlayToggle');
  const progressBar = container.querySelector('#caseProgressBar');
  const progressFill = container.querySelector('#caseProgressFill');
  const timecode = container.querySelector('#caseTimecode');
  const anamorphicToggle = container.querySelector('#caseAnamorphicToggle');
  const fullscreenToggle = container.querySelector('#caseFullscreenToggle');

  let canvasEngine = null;
  const canvas = container.querySelector('#caseCanvas');
  if (canvas && window.CinemaCanvasEngine) {
    const poster = canvas.getAttribute('data-poster') || 'assets/showreel_poster.jpg';
    canvasEngine = new window.CinemaCanvasEngine(canvas, {
      posterSrc: poster,
      duration: 98,
      fps: 24
    });

    canvas.addEventListener('cinematimeupdate', (e) => {
      const { timecode: tc, progress } = e.detail;
      if (timecode) timecode.textContent = tc;
      if (progressFill) progressFill.style.width = `${progress * 100}%`;
    });
  }

  function togglePlay() {
    if (video && video.getAttribute('src')) {
      if (video.paused) {
        video.play();
        container.classList.remove('paused');
        if (playToggle) playToggle.textContent = 'PAUSE';
      } else {
        video.pause();
        container.classList.add('paused');
        if (playToggle) playToggle.textContent = 'PLAY';
      }
    } else if (canvasEngine) {
      const isPlaying = canvasEngine.toggle();
      container.classList.toggle('paused', !isPlaying);
      if (playToggle) playToggle.textContent = isPlaying ? 'PAUSE' : 'PLAY';
      if (centerBtn) centerBtn.style.opacity = isPlaying ? '0' : '1';
    }
  }

  if (centerBtn) centerBtn.addEventListener('click', togglePlay);
  if (playToggle) playToggle.addEventListener('click', togglePlay);

  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      if (canvasEngine) {
        canvasEngine.seek(ratio);
      }
      if (progressFill) {
        progressFill.style.width = `${ratio * 100}%`;
      }
    });
  }

  if (anamorphicToggle) {
    anamorphicToggle.addEventListener('click', () => {
      container.classList.toggle('anamorphic-crop');
      const isCrop = container.classList.contains('anamorphic-crop');
      container.style.aspectRatio = isCrop ? '2.39 / 1' : '16 / 9';
      anamorphicToggle.textContent = isCrop ? '16:9' : '2.39:1 CROP';
      if (canvasEngine) canvasEngine.resize();
    });
  }

  if (fullscreenToggle) {
    fullscreenToggle.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }
}

function initScrollReveals() {
  const fadeElements = document.querySelectorAll('.fade-up');
  if (!('IntersectionObserver' in window)) {
    fadeElements.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  fadeElements.forEach(el => observer.observe(el));
}

function initNextProjectVideo() {
  const nextVideo = document.querySelector('.next-project-video');
  if (!nextVideo) return;

  function loadNextVideo() {
    if (nextVideo.dataset.loaded === 'true') return;
    const dataSrc = nextVideo.getAttribute('data-src');
    if (dataSrc) {
      nextVideo.src = dataSrc;
      nextVideo.preload = 'metadata';
      nextVideo.dataset.loaded = 'true';
    }
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadNextVideo();
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '300px 0px',
      threshold: 0.01
    });
    observer.observe(nextVideo);
  } else {
    loadNextVideo();
  }

  const container = nextVideo.closest('.next-project-link') || nextVideo;
  container.addEventListener('mouseenter', () => {
    loadNextVideo();
    const playPromise = nextVideo.play();
    if (playPromise !== undefined) playPromise.catch(() => {});
  });
  container.addEventListener('mouseleave', () => {
    nextVideo.pause();
    try { nextVideo.currentTime = 0; } catch (e) {}
  });
}
