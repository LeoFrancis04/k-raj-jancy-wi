/* ═══════════════════════════════════════════════════════════
   RAJ ♥ JENCY — script.js
   - Falling Petal Canvas Animation
   - IntersectionObserver reveal animations
   - Progress dot navigation
   ═══════════════════════════════════════════════════════════ */

   (function () {
    'use strict';
  
    /* ── 1. Petal Canvas ─────────────────────────────────── */
    const canvas = document.getElementById('petalCanvas');
    const ctx    = canvas.getContext('2d');
  
    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  
    const COLORS = [
      'rgba(255, 182, 193, 0.75)',  // pink
      'rgba(255, 143, 171, 0.65)',  // rose-pink
      'rgba(240, 204, 122, 0.5)',   // gold
      'rgba(220, 180, 220, 0.6)',   // lavender
      'rgba(255, 220, 220, 0.6)',   // pale pink
      'rgba(192,  64, 122, 0.45)',  // rose
    ];
  
    class Petal {
      constructor(randomY) {
        this.init(randomY);
      }
  
      init(randomY) {
        this.x       = Math.random() * canvas.width;
        this.y       = randomY !== undefined ? Math.random() * canvas.height : -20;
        this.size    = Math.random() * 7 + 3;          // 3–10px
        this.speedY  = Math.random() * 0.7 + 0.25;    // drift down slowly
        this.speedX  = (Math.random() - 0.5) * 0.4;
        this.rot     = Math.random() * Math.PI * 2;
        this.rotSpd  = (Math.random() - 0.5) * 0.025;
        this.wobble  = Math.random() * Math.PI * 2;
        this.wobSpd  = 0.018 + Math.random() * 0.018;
        this.opacity = Math.random() * 0.45 + 0.25;
        this.color   = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
  
      update() {
        this.y      += this.speedY;
        this.wobble += this.wobSpd;
        this.x      += this.speedX + Math.sin(this.wobble) * 0.45;
        this.rot    += this.rotSpd;
        if (this.y > canvas.height + 30) this.init();
      }
  
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle   = this.color;
        const s = this.size;
        // Leaf / petal bezier shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo( s * 0.6, -s * 0.6,  s * 1.1, -s * 0.2,  s * 0.65,  s * 0.35);
        ctx.bezierCurveTo( s * 0.2,  s * 0.75, -s * 0.4,  s * 0.45, 0, 0);
        ctx.fill();
        ctx.restore();
      }
    }
  
    // Initialise petals — spread randomly across screen at start
    const PETAL_COUNT = 22;
    const petals = Array.from({ length: PETAL_COUNT }, () => new Petal(true));
  
    let animRunning = true;
  
    function animatePetals() {
      if (!animRunning) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animatePetals);
    }
    animatePetals();
  
    // Pause when tab is hidden (battery / perf)
    document.addEventListener('visibilitychange', () => {
      animRunning = !document.hidden;
      if (animRunning) animatePetals();
    });
  
  
    /* ── 2. Reveal on Scroll (IntersectionObserver) ──────── */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.25 }
    );
    revealEls.forEach(el => revealObs.observe(el));
  
  
    /* ── 3. Progress Dots ────────────────────────────────── */
    const container = document.getElementById('scrollContainer');
    const slides    = document.querySelectorAll('.slide');
    const dots      = document.querySelectorAll('.dot');
  
    // Click dot → scroll to slide
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.slide, 10);
        if (slides[idx]) {
          slides[idx].scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  
    // Active dot tracks which slide is in view
    const slideObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = Array.from(slides).indexOf(entry.target);
            dots.forEach(d => d.classList.remove('active'));
            if (dots[idx]) dots[idx].classList.add('active');
          }
        });
      },
      { root: container, threshold: 0.55 }
    );
    slides.forEach(s => slideObs.observe(s));
  
  
    /* ── 4. Touch / keyboard nav ─────────────────────────── */
    // Arrow key support for desktop
    document.addEventListener('keydown', (e) => {
      const currentDot = document.querySelector('.dot.active');
      if (!currentDot) return;
      let idx = parseInt(currentDot.dataset.slide, 10);
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        idx = Math.min(idx + 1, slides.length - 1);
        slides[idx].scrollIntoView({ behavior: 'smooth' });
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        idx = Math.max(idx - 1, 0);
        slides[idx].scrollIntoView({ behavior: 'smooth' });
      }
    });
  
  
    /* ── 5. Prevent default scroll-chaining on iOS ───────── */
    // Ensures the snap container handles the scroll, not the window
    container.addEventListener('touchmove', (e) => {
      e.stopPropagation();
    }, { passive: true });
  
  
    console.log('%cRaj ♥ Jency — 18.05.2026 🎉', 'font-family: cursive; font-size: 1.2rem; color: #D4A843;');
  })();