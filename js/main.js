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
      cursor.textContent = 'VIEW →';
      cursor.classList.add('visible');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('visible');
    });
  });

  playTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.textContent = 'PLAY REEL';
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

  if (!modal) return;

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

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('inqName').value || 'Collaborator';
      const projectType = document.getElementById('inqType').value || 'Video Editing';
      const budget = document.getElementById('inqBudget').value || 'Flexible';
      const details = document.getElementById('inqDetails').value || '';

      const subject = encodeURIComponent(`Project Inquiry: ${projectType} — ${name}`);
      const body = encodeURIComponent(
        `Hi Arnav,\n\nName: ${name}\nProject Type: ${projectType}\nEstimated Budget: ${budget}\n\nProject Scope:\n${details}\n\nLooking forward to hearing from you!`
      );

      window.location.href = `mailto:workwitharnav.creative@gmail.com?subject=${subject}&body=${body}`;
      closeModal();
    });
  }
}

/* ==========================================================================
   9. HOVER VIDEO PREVIEWS ON SELECTED WORK
   ========================================================================== */
function initHoverVideoPreviews() {
  const cards = document.querySelectorAll('.project-item');
  if (!cards.length) return;

  function loadCardVideo(video) {
    if (!video || video.dataset.loaded === 'true') return;
    const dataSrc = video.getAttribute('data-src');
    if (dataSrc) {
      video.src = dataSrc;
      video.preload = 'metadata';
      video.dataset.loaded = 'true';
    }
  }

  // IntersectionObserver to lazy load video sources when within 250px of viewport
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target.querySelector('.project-video-preview');
          if (video) {
            loadCardVideo(video);
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '250px 0px',
      threshold: 0.01
    });

    cards.forEach(card => videoObserver.observe(card));
  } else {
    cards.forEach(card => {
      const video = card.querySelector('.project-video-preview');
      loadCardVideo(video);
    });
  }

  // Hover playback handling
  cards.forEach(card => {
    const video = card.querySelector('.project-video-preview');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      loadCardVideo(video);
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
