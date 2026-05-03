/* ═══════════════════════════════════════════════════════════
   RAJ ♥ JENCY — script.js
   Sections:
   1.  Ambient sparkle canvas  (envelope screen only)
   2.  Envelope interaction + audio start
   3.  Audio volume fade-in + mute toggle
   4.  Petal canvas (main invitation background)
   5.  Reveal on scroll (IntersectionObserver)
   6.  Progress dot navigation
   7.  Keyboard nav + iOS scroll fix
   ═══════════════════════════════════════════════════════════ */

   (function () {
    'use strict';
  
    /* ══════════════════════════════════════════════════════════
       1. AMBIENT SPARKLE CANVAS  (on envelope screen)
    ══════════════════════════════════════════════════════════ */
    const ambientCanvas = document.getElementById('ambientCanvas');
    const actx          = ambientCanvas.getContext('2d');
  
    function resizeAmbient() {
      ambientCanvas.width  = window.innerWidth;
      ambientCanvas.height = window.innerHeight;
    }
    resizeAmbient();
    window.addEventListener('resize', resizeAmbient);
  
    const SPARKLE_COUNT = 55;
    const sparkles = [];
  
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      sparkles.push({
        x:       Math.random() * window.innerWidth,
        y:       Math.random() * window.innerHeight,
        r:       Math.random() * 1.6 + 0.4,
        alpha:   Math.random(),
        dAlpha:  (Math.random() * 0.012 + 0.004) * (Math.random() < 0.5 ? 1 : -1),
        color:   Math.random() < 0.6 ? '#D4A843' : '#C0407A',
      });
    }
  
    let ambientRunning = true;
  
    function drawAmbient() {
      if (!ambientRunning) return;
      actx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
      sparkles.forEach(s => {
        s.alpha += s.dAlpha;
        if (s.alpha <= 0 || s.alpha >= 1) s.dAlpha *= -1;
        actx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
        actx.fillStyle = s.color;
        actx.beginPath();
        actx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        actx.fill();
      });
      requestAnimationFrame(drawAmbient);
    }
    drawAmbient();
  
  
    /* ══════════════════════════════════════════════════════════
       2. ENVELOPE INTERACTION
       Sequence:
         a) User taps envelope → flap opens (rotateX CSS class)
         b) Letter card emerges upward (CSS transition)
         c) After 1.6s → overlay begins fading out
         d) After fade (1.1s) → overlay removed from DOM
         e) Music starts (volume fades in via JS)
         f) Mute button appears
    ══════════════════════════════════════════════════════════ */
    const envelopeScreen = document.getElementById('envelopeScreen');
    const envelope       = document.getElementById('envelope');
    const tapHint        = document.getElementById('tapHint');
    const bgMusic        = document.getElementById('bgMusic');
    const muteBtn        = document.getElementById('muteBtn');
  
    // Tap anywhere on the envelope wrap to trigger
    envelope.addEventListener('click', openEnvelope);
    // Also allow tapping the tap hint text
    if (tapHint) tapHint.addEventListener('click', openEnvelope);
  
    let envelopeOpened = false;
  
    function openEnvelope() {
      if (envelopeOpened) return;
      envelopeOpened = true;
  
      // a) Open the flap (CSS class triggers rotateX on #envFlapTop)
      envelope.classList.add('open');
  
      // b) Hide tap hint immediately
      if (tapHint) {
        tapHint.style.opacity = '0';
        tapHint.style.pointerEvents = 'none';
      }
  
      // c) Start music — this works because we're inside a user-gesture handler
      startMusic();
  
      // d) Begin overlay fade after letter has risen (1.6s)
      setTimeout(() => {
        envelopeScreen.classList.add('closing');
        ambientRunning = false; // stop sparkle animation
  
        // e) Remove overlay from DOM after fade completes (1.1s CSS transition)
        setTimeout(() => {
          envelopeScreen.classList.add('gone');
          muteBtn.classList.add('visible'); // show mute button
        }, 1150);
      }, 1600);
    }
  
  
    /* ══════════════════════════════════════════════════════════
       3. AUDIO — VOLUME FADE-IN + MUTE TOGGLE
    ══════════════════════════════════════════════════════════ */
    let isMuted     = false;
    let fadeInterval = null;
    const TARGET_VOL = 0.55;  // comfortable background level
  
    function startMusic() {
      bgMusic.volume = 0;
      bgMusic.play().catch(() => {
        // Browser still blocked (very rare since we're in a click handler)
        // Silently fail — mute button won't appear (no music to control)
        console.warn('Audio play was blocked.');
      });
  
      // Fade volume in over ~3 seconds
      let vol = 0;
      clearInterval(fadeInterval);
      fadeInterval = setInterval(() => {
        vol = Math.min(vol + 0.02, TARGET_VOL);
        bgMusic.volume = vol;
        if (vol >= TARGET_VOL) clearInterval(fadeInterval);
      }, 60); // 60ms × ~28 steps ≈ ~1.7 seconds to full volume
    }
  
    // Mute toggle
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      if (isMuted) {
        bgMusic.volume = 0;
        muteBtn.textContent = '🔇';
      } else {
        bgMusic.volume = TARGET_VOL;
        muteBtn.textContent = '🔊';
      }
    });
  
    // Pause music when tab is hidden (battery friendly)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        bgMusic.pause();
      } else if (envelopeOpened && !isMuted) {
        bgMusic.play().catch(() => {});
      }
    });
  
  
    /* ══════════════════════════════════════════════════════════
       4. PETAL CANVAS  (main invitation background)
    ══════════════════════════════════════════════════════════ */
    const petalCanvas = document.getElementById('petalCanvas');
    const pctx        = petalCanvas.getContext('2d');
  
    function resizePetal() {
      petalCanvas.width  = window.innerWidth;
      petalCanvas.height = window.innerHeight;
    }
    resizePetal();
    window.addEventListener('resize', resizePetal);
  
    const PETAL_COLORS = [
      'rgba(255, 182, 193, 0.75)',
      'rgba(255, 143, 171, 0.65)',
      'rgba(240, 204, 122, 0.50)',
      'rgba(220, 180, 220, 0.60)',
      'rgba(255, 220, 220, 0.60)',
      'rgba(192,  64, 122, 0.45)',
    ];
  
    class Petal {
      constructor(scatter) {
        this.reset(scatter);
      }
      reset(scatter) {
        this.x      = Math.random() * petalCanvas.width;
        this.y      = scatter ? Math.random() * petalCanvas.height : -20;
        this.size   = Math.random() * 7 + 3;
        this.vy     = Math.random() * 0.7 + 0.25;
        this.vx     = (Math.random() - 0.5) * 0.4;
        this.rot    = Math.random() * Math.PI * 2;
        this.rotSpd = (Math.random() - 0.5) * 0.025;
        this.wob    = Math.random() * Math.PI * 2;
        this.wobSpd = 0.018 + Math.random() * 0.018;
        this.alpha  = Math.random() * 0.45 + 0.25;
        this.color  = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      }
      update() {
        this.y   += this.vy;
        this.wob += this.wobSpd;
        this.x   += this.vx + Math.sin(this.wob) * 0.45;
        this.rot += this.rotSpd;
        if (this.y > petalCanvas.height + 30) this.reset(false);
      }
      draw() {
        pctx.save();
        pctx.translate(this.x, this.y);
        pctx.rotate(this.rot);
        pctx.globalAlpha = this.alpha;
        pctx.fillStyle   = this.color;
        const s = this.size;
        pctx.beginPath();
        pctx.moveTo(0, 0);
        pctx.bezierCurveTo( s * 0.6, -s * 0.6,  s * 1.1, -s * 0.2,  s * 0.65,  s * 0.35);
        pctx.bezierCurveTo( s * 0.2,  s * 0.75, -s * 0.4,  s * 0.45, 0, 0);
        pctx.fill();
        pctx.restore();
      }
    }
  
    const PETAL_COUNT = 22;
    const petals = Array.from({ length: PETAL_COUNT }, () => new Petal(true));
    let petalRunning = true;
  
    function animatePetals() {
      if (!petalRunning) return;
      pctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
      petals.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animatePetals);
    }
    animatePetals();
  
    document.addEventListener('visibilitychange', () => {
      petalRunning = !document.hidden;
      if (petalRunning) animatePetals();
    });
  
  
    /* ══════════════════════════════════════════════════════════
       5. REVEAL ON SCROLL  (IntersectionObserver)
    ══════════════════════════════════════════════════════════ */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.25 }
    );
    revealEls.forEach(el => revealObs.observe(el));
  
  
    /* ══════════════════════════════════════════════════════════
       6. PROGRESS DOT NAVIGATION
    ══════════════════════════════════════════════════════════ */
    const container = document.getElementById('scrollContainer');
    const slides    = document.querySelectorAll('.slide');
    const dots      = document.querySelectorAll('.dot');
  
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.slide, 10);
        if (slides[idx]) slides[idx].scrollIntoView({ behavior: 'smooth' });
      });
    });
  
    const slideObs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = Array.from(slides).indexOf(e.target);
            dots.forEach(d => d.classList.remove('active'));
            if (dots[idx]) dots[idx].classList.add('active');
          }
        });
      },
      { root: container, threshold: 0.55 }
    );
    slides.forEach(s => slideObs.observe(s));
  
  
    /* ══════════════════════════════════════════════════════════
       7. KEYBOARD NAV + iOS SCROLL FIX
    ══════════════════════════════════════════════════════════ */
    document.addEventListener('keydown', e => {
      const active = document.querySelector('.dot.active');
      if (!active) return;
      let idx = parseInt(active.dataset.slide, 10);
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        slides[Math.min(idx + 1, slides.length - 1)].scrollIntoView({ behavior: 'smooth' });
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        slides[Math.max(idx - 1, 0)].scrollIntoView({ behavior: 'smooth' });
      }
    });
  
    if (container) {
      container.addEventListener('touchmove', e => e.stopPropagation(), { passive: true });
    }
  
    console.log('%c✝ Raj ♥ Jency — 18.05.2026 ✝', 'font-family:cursive;font-size:1.2rem;color:#D4A843;');
  
  })();