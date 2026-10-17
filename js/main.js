/**
 * MAIN INTERACTION SCRIPT — VIDEO EDITOR & MOTION DESIGNER PORTFOLIO
 * High-precision interactions, subtle motion, custom cursor, showreel modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initScrollReveals();
  initWorkFilters();
  initEmailCopy();
  initFooterTimecode();
  initMobileNav();
  initInquiryModal();
  initHoverVideoPreviews();
  initPortfolioVideoModal();
});

/* ==========================================================================
   1. SUBTLE EDITORIAL CURSOR (DESKTOP ONLY)
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  let isHovering = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    // Subtle lerp for fluid tracking
    cursorX += (mouseX - cursorX) * 0.22;
    cursorY += (mouseY - cursorY) * 0.22;

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover target detectors
  const viewTargets = document.querySelectorAll('[data-cursor="view"]');
  const playTargets = document.querySelectorAll('[data-cursor="play"]');

  viewTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.textContent = el.getAttribute('data-cursor-text') || 'VIEW →';
      cursor.classList.add('visible');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('visible');
    });
  });

  playTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.textContent = el.getAttribute('data-cursor-text') || 'PLAY ▶';
      cursor.classList.add('visible');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('visible');
    });
  });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('visible');
  });
}

/* ==========================================================================
   2. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
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
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. WORK CATEGORY FILTER
   ========================================================================== */
function initWorkFilters() {
  const pills = document.querySelectorAll('.filter-pill');
  const projects = document.querySelectorAll('.project-item');
  if (!pills.length || !projects.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      projects.forEach(project => {
        const cat = project.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          project.style.display = 'flex';
          setTimeout(() => {
            project.style.opacity = '1';
            project.style.transform = 'translateY(0)';
          }, 40);
        } else {
          project.style.opacity = '0';
          project.style.transform = 'translateY(12px)';
          setTimeout(() => {
            project.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}


/* ==========================================================================
   5. EMAIL COPY TO CLIPBOARD
   ========================================================================== */
function initEmailCopy() {
  const copyBars = document.querySelectorAll('.js-copy-email');

  copyBars.forEach(bar => {
    bar.addEventListener('click', async () => {
      const email = bar.getAttribute('data-email') || 'workwitharnav.creative@gmail.com';
      const toast = bar.querySelector('.copy-feedback-toast');

      try {
        await navigator.clipboard.writeText(email);
        if (toast) {
          toast.textContent = 'COPIED TO CLIPBOARD';
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
          }, 2400);
        }
      } catch (err) {
        // Fallback
        window.location.href = `mailto:${email}`;
      }
    });
  });
}

/* ==========================================================================
   6. LIVE LOCAL TIMECODE
   ========================================================================== */
function initFooterTimecode() {
  const timecodeEl = document.getElementById('liveTimecode');
  if (!timecodeEl) return;

  function update() {
    const now = new Date();
    // Format to Indian Standard Time (IST / UTC+5:30) or local
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    try {
      const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
      timecodeEl.textContent = `NEW DELHI / IST (UTC+05:30) — ${timeStr}`;
    } catch (e) {
      timecodeEl.textContent = now.toTimeString().split(' ')[0];
    }
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   7. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-link');

  if (!toggle || !drawer) return;

  function toggleMenu() {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('open');
      toggle.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  toggle.addEventListener('click', toggleMenu);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   8. PROJECT INQUIRY MODAL
   ========================================================================== */
function initInquiryModal() {
  const openButtons = document.querySelectorAll('.js-open-inquiry');
  const modal = document.getElementById('inquiryModal');
  const closeBtn = document.getElementById('closeInquiryModal');
  const form = document.getElementById('inquiryForm');
  const typeSelect = document.getElementById('inqType');
  const budgetInput = document.getElementById('inqBudget');

  if (!modal) return;

  const PRICE_MAP = {
    'Short Form / Reel': '$30 – $80',
    'Long Form / YouTube': '$60 – $150'
  };

  function updatePriceRange() {
    if (!typeSelect || !budgetInput) return;
    const selectedCategory = typeSelect.value;
    const priceRange = PRICE_MAP[selectedCategory] || '';
    budgetInput.value = priceRange;
  }

  if (typeSelect) {
    typeSelect.addEventListener('change', updatePriceRange);
    updatePriceRange();
  }

  // Ensure price range field cannot be manually changed, typed into, or pasted into
  if (budgetInput) {
    budgetInput.addEventListener('keydown', (e) => e.preventDefault());
    budgetInput.addEventListener('paste', (e) => e.preventDefault());
    budgetInput.addEventListener('drop', (e) => e.preventDefault());
  }

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('inqName').value.trim() || 'Collaborator';
      const selectedCategory = typeSelect ? typeSelect.value : '';

      // Validate category selection
      if (!selectedCategory || !PRICE_MAP[selectedCategory]) {
        alert('Please select a project category (Short Form / Reel or Long Form / YouTube).');
        if (typeSelect) typeSelect.focus();
        return;
      }

      // Calculate/validate price range directly from selected category
      const priceRange = PRICE_MAP[selectedCategory];
      if (budgetInput) {
        budgetInput.value = priceRange;
      }

      const details = document.getElementById('inqDetails').value.trim() || 'No additional scope provided.';

      const subject = encodeURIComponent(`Project Inquiry: ${selectedCategory} (${priceRange}) — ${name}`);
      const body = encodeURIComponent(
        `Hi Arnav,\n\nName: ${name}\nProject Category: ${selectedCategory}\nPrice Range: ${priceRange}\n\nProject Scope & Target Deadline:\n${details}\n\nLooking forward to hearing from you!`
      );

      window.location.href = `mailto:workwitharnav.creative@gmail.com?subject=${subject}&body=${body}`;
      closeModal();
    });
  }
}

/* ==========================================================================
   9. HOVER VIDEO PREVIEWS ON SELECTED WORK (DESKTOP ONLY, ON-DEMAND)
   ========================================================================== */
function initHoverVideoPreviews() {
  const cards = document.querySelectorAll('.project-item');
  if (!cards.length) return;

  // Touch & mobile devices: skip background video previews entirely to eliminate
  // wasted bandwidth and preserve lightweight poster thumbnails.
  if (window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  function loadPreview(video) {
    if (!video) return;
    if (!video.src && video.getAttribute('data-src')) {
      video.src = video.getAttribute('data-src');
      video.preload = 'metadata';
    }
  }

  cards.forEach(card => {
    const video = card.querySelector('.project-video-preview');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      // Pause any other preview video currently running
      cards.forEach(otherCard => {
        if (otherCard !== card) {
          const otherVideo = otherCard.querySelector('.project-video-preview');
          if (otherVideo && !otherVideo.paused) {
            otherVideo.pause();
          }
        }
      });

      loadPreview(video);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      try {
        video.currentTime = 0;
      } catch (e) {}
    });
  });
}

/* ==========================================================================
   10. IN-PAGE PORTFOLIO VIDEO LIGHTBOX MODAL
   ========================================================================== */
function initPortfolioVideoModal() {
  const modal = document.getElementById('portfolioVideoModal');
  if (!modal) return;

  const container = document.getElementById('portfolioModalContainer');
  const video = document.getElementById('portfolioModalVideo');
  const closeBtn = document.getElementById('closePortfolioModal');
  const titleEl = document.getElementById('modalVideoTitle');
  const badgeEl = document.getElementById('modalVideoBadge');
  const caseLink = document.getElementById('modalCaseStudyLink');
  const spinner = document.getElementById('modalVideoSpinner');
  const errorBox = document.getElementById('modalVideoError');
  const retryBtn = document.getElementById('modalVideoRetryBtn');

  let currentVideoData = null;

  function showSpinner() {
    if (spinner) spinner.classList.add('visible');
  }

  function hideSpinner() {
    if (spinner) spinner.classList.remove('visible');
  }

  function showError() {
    hideSpinner();
    if (errorBox) errorBox.style.display = 'flex';
  }

  function hideError() {
    if (errorBox) errorBox.style.display = 'none';
  }

  function openModal(data) {
    currentVideoData = data;
    hideError();
    showSpinner();

    // Pause all background hover preview videos immediately
    document.querySelectorAll('.project-video-preview').forEach(v => {
      try {
        v.pause();
      } catch (e) {}
    });

    // Adapt aspect ratio container class
    if (data.aspect === '9:16') {
      container.classList.remove('is-horizontal');
      container.classList.add('is-vertical');
    } else {
      container.classList.remove('is-vertical');
      container.classList.add('is-horizontal');
    }

    if (titleEl) titleEl.textContent = data.title || 'PORTFOLIO VIDEO';
    if (badgeEl) badgeEl.textContent = data.badge || (data.aspect === '9:16' ? '9:16 VERTICAL' : '16:9 HORIZONTAL');

    if (caseLink) {
      if (data.caseStudy) {
        caseLink.href = data.caseStudy;
        caseLink.style.display = 'inline-flex';
      } else {
        caseLink.style.display = 'none';
      }
    }

    // Set poster first, then src
    if (data.poster) {
      video.poster = data.poster;
    }
    video.src = data.src;
    video.preload = 'auto';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Attempt autoplay
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          hideSpinner();
        })
        .catch(() => {
          // If browser policy prevents autoplay with sound, hide spinner so user can use native controls
          hideSpinner();
        });
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';

    // Immediately stop playback and release network buffers & memory
    try {
      video.pause();
      video.removeAttribute('src');
      video.load();
    } catch (e) {}

    currentVideoData = null;
    hideSpinner();
    hideError();
  }

  // Buffering indicator state handlers
  video.addEventListener('waiting', showSpinner);
  video.addEventListener('seeking', showSpinner);
  video.addEventListener('canplay', hideSpinner);
  video.addEventListener('playing', hideSpinner);
  video.addEventListener('error', () => {
    // Only display error if a src was actively loaded (ignore src resets on close)
    if (video.getAttribute('src')) {
      showError();
    }
  });

  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      if (currentVideoData && currentVideoData.src) {
        hideError();
        showSpinner();
        video.src = currentVideoData.src;
        video.load();
        video.play().catch(() => hideSpinner());
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Attach click listener to all portfolio triggers
  const triggers = document.querySelectorAll('.js-play-portfolio-video');
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      // Respect user modifier keys (Cmd/Ctrl/Shift to open case study in new tab)
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();

      const data = {
        src: trigger.dataset.videoSrc || trigger.getAttribute('data-video-src'),
        poster: trigger.dataset.videoPoster || trigger.getAttribute('data-video-poster'),
        title: trigger.dataset.videoTitle || trigger.getAttribute('data-video-title'),
        aspect: trigger.dataset.videoAspect || trigger.getAttribute('data-video-aspect'),
        badge: trigger.dataset.videoBadge || trigger.getAttribute('data-video-badge'),
        caseStudy: trigger.dataset.caseStudy || trigger.getAttribute('data-case-study')
      };

      if (data.src) {
        openModal(data);
      }
    });
  });
}
