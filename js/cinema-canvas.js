/**
 * CINEMA CANVAS ENGINE
 * High-performance cinematic canvas simulation for video previews,
 * film grain generation, optical flares, timecode overlays, and audio bars.
 */

class CinemaCanvasEngine {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.posterSrc = options.posterSrc || null;
    this.title = options.title || 'CINEMATIC SEQUENCE';
    this.fps = options.fps || 24;
    this.aspectRatio = options.aspectRatio || (16 / 9);

    this.isPlaying = false;
    this.frame = 0;
    this.time = 0;
    this.duration = options.duration || 120; // 2 minutes

    this.posterImg = null;
    this.animFrameId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    if (this.posterSrc) {
      this.posterImg = new Image();
      this.posterImg.crossOrigin = 'anonymous';
      this.posterImg.onload = () => {
        this.renderStaticFrame();
      };
      this.posterImg.src = this.posterSrc;
    } else {
      this.renderStaticFrame();
    }
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);

    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }

    if (!this.isPlaying) {
      this.renderStaticFrame();
    }
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.animate();
  }

  pause() {
    this.isPlaying = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  seek(progressRatio) {
    this.time = Math.max(0, Math.min(1, progressRatio)) * this.duration;
    this.frame = Math.floor(this.time * this.fps);
    this.renderFrame();
  }

  animate() {
    if (!this.isPlaying) return;

    this.time += 1 / this.fps;
    if (this.time >= this.duration) {
      this.time = 0;
    }
    this.frame = Math.floor(this.time * this.fps);

    this.renderFrame();

    this.animFrameId = requestAnimationFrame(() => this.animate());
  }

  renderStaticFrame() {
    if (!this.ctx || !this.width || !this.height) return;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    if (this.posterImg && this.posterImg.complete) {
      // Draw cover
      this.drawCoverImage(ctx, this.posterImg, 1.0);
    } else {
      ctx.fillStyle = '#111111';
      ctx.fillRect(0, 0, this.width, this.height);
    }

    // Subtle vignette
    this.drawVignette(ctx);
  }

  renderFrame() {
    if (!this.ctx || !this.width || !this.height) return;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Subtle cinematic zoom / drift (Ken Burns effect)
    const driftScale = 1.0 + Math.sin(this.time * 0.4) * 0.02;
    const panX = Math.sin(this.time * 0.25) * 8;
    const panY = Math.cos(this.time * 0.2) * 5;

    if (this.posterImg && this.posterImg.complete) {
      ctx.save();
      ctx.translate(this.width / 2 + panX, this.height / 2 + panY);
      ctx.scale(driftScale, driftScale);
      ctx.translate(-this.width / 2, -this.height / 2);
      this.drawCoverImage(ctx, this.posterImg, 1.0);
      ctx.restore();
    } else {
      ctx.fillStyle = '#111111';
      ctx.fillRect(0, 0, this.width, this.height);
    }

    // Subtle anamorphic light sheen
    const flareX = (Math.sin(this.time * 0.6) * 0.5 + 0.5) * this.width;
    const grad = ctx.createLinearGradient(flareX - 120, 0, flareX + 120, this.height);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(0.5, 'rgba(180, 210, 255, 0.06)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // 35mm film grain simulation
    this.drawFilmGrain(ctx);

    // Vignette
    this.drawVignette(ctx);

    // Dispatch update event for UI controls (timecode, scrubber)
    const event = new CustomEvent('cinematimeupdate', {
      detail: {
        time: this.time,
        duration: this.duration,
        progress: this.time / this.duration,
        timecode: this.formatTimecode(this.time, this.fps)
      }
    });
    this.canvas.dispatchEvent(event);
  }

  drawCoverImage(ctx, img, scaleMultiplier) {
    const cw = this.width;
    const ch = this.height;
    const iw = img.naturalWidth || 1920;
    const ih = img.naturalHeight || 1080;

    const rCanvas = cw / ch;
    const rImg = iw / ih;

    let dw, dh, dx, dy;
    if (rCanvas > rImg) {
      dw = cw * scaleMultiplier;
      dh = (cw / rImg) * scaleMultiplier;
    } else {
      dh = ch * scaleMultiplier;
      dw = (ch * rImg) * scaleMultiplier;
    }

    dx = (cw - dw) / 2;
    dy = (ch - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
  }

  drawVignette(ctx) {
    const rx = this.width / 2;
    const ry = this.height / 2;
    const radius = Math.max(rx, ry) * 1.1;

    const vignette = ctx.createRadialGradient(rx, ry, radius * 0.45, rx, ry, radius);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.48)');

    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  drawFilmGrain(ctx) {
    const count = Math.floor((this.width * this.height) / 1200);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    for (let i = 0; i < count; i++) {
      const gx = Math.random() * this.width;
      const gy = Math.random() * this.height;
      const size = Math.random() * 1.5 + 0.5;
      ctx.fillRect(gx, gy, size, size);
    }
  }

  formatTimecode(seconds, fps = 24) {
    const totalFrames = Math.floor(seconds * fps);
    const ff = String(totalFrames % fps).padStart(2, '0');
    const totalSecs = Math.floor(seconds);
    const ss = String(totalSecs % 60).padStart(2, '0');
    const mm = String(Math.floor(totalSecs / 60) % 60).padStart(2, '0');
    const hh = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    return `${hh}:${mm}:${ss}:${ff}`;
  }
}

window.CinemaCanvasEngine = CinemaCanvasEngine;
