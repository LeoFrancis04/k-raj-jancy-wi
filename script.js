/* ═══════════════════════════════════════════════════════════
   RAJ ♥ JENCY  ·  script.js  ·  Grand Luxury Edition
   ─────────────────────────────────────────────────────────
   1.  Draw photorealistic wax seal on canvas
   2.  Ambient sparkle canvas (envelope bg)
   3.  Envelope open sequence + audio start
   4.  Audio fade-in + mute toggle
   5.  Petal canvas (invitation background)
   6.  Scroll reveal (IntersectionObserver)
   7.  Progress dot navigation
   8.  Keyboard nav + iOS scroll fix
   ═══════════════════════════════════════════════════════════ */

   (function () {
    'use strict';
  
    /* ════════════════════════════════════════════════════════
       1.  GRAND WAX SEAL  — drawn on <canvas id="sealCanvas">
           Creates a realistic melted-wax disc with:
           • Deep crimson base using radial gradient
           • Top-left gloss highlight (light reflection)
           • 3D rim shadow (bottom-right)
           • Embossed gold ring border
           • "R&J" in Great Vibes cursive font, embossed
           • Tiny crack/texture lines for realism
    ════════════════════════════════════════════════════════ */
  
    function drawWaxSeal() {
      const canvas = document.getElementById('sealCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const W = canvas.width;   // 110
      const H = canvas.height;  // 110
      const cx = W / 2;
      const cy = H / 2;
      const R  = W / 2 - 3;     // outer radius (slightly inset for drop shadow room)
  
      ctx.clearRect(0, 0, W, H);
  
      /* ── Step 1: Deep crimson wax base ──────────────── */
      const waxGrad = ctx.createRadialGradient(cx - R * 0.22, cy - R * 0.18, R * 0.05, cx, cy, R);
      waxGrad.addColorStop(0.00, '#E03050');   // bright highlight centre
      waxGrad.addColorStop(0.25, '#C01A38');   // mid crimson
      waxGrad.addColorStop(0.55, '#8B0020');   // deep red
      waxGrad.addColorStop(0.80, '#5A0010');   // dark shadow edge
      waxGrad.addColorStop(1.00, '#3A000A');   // very dark rim
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = waxGrad;
      ctx.fill();
  
      /* ── Step 2: Subtle wax texture (noise dots) ─────── */
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = 0.08;
      for (let i = 0; i < 180; i++) {
        const angle  = Math.random() * Math.PI * 2;
        const dist   = Math.random() * R * 0.92;
        const px     = cx + Math.cos(angle) * dist;
        const py     = cy + Math.sin(angle) * dist;
        const pr     = Math.random() * 1.8 + 0.3;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
        ctx.fill();
      }
      ctx.restore();
  
      /* ── Step 3: Glossy top-left highlight ──────────── */
      const glossGrad = ctx.createRadialGradient(
        cx - R * 0.35, cy - R * 0.35, R * 0.04,
        cx - R * 0.25, cy - R * 0.25, R * 0.62
      );
      glossGrad.addColorStop(0.00, 'rgba(255,255,255,0.40)');
      glossGrad.addColorStop(0.35, 'rgba(255,255,255,0.12)');
      glossGrad.addColorStop(1.00, 'rgba(255,255,255,0.00)');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = glossGrad;
      ctx.fill();
  
      /* ── Step 4: Bottom-right shadow for depth ──────── */
      const shadowGrad = ctx.createRadialGradient(
        cx + R * 0.30, cy + R * 0.30, R * 0.1,
        cx + R * 0.15, cy + R * 0.15, R * 0.85
      );
      shadowGrad.addColorStop(0.00, 'rgba(0,0,0,0.00)');
      shadowGrad.addColorStop(0.60, 'rgba(0,0,0,0.00)');
      shadowGrad.addColorStop(1.00, 'rgba(0,0,0,0.35)');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = shadowGrad;
      ctx.fill();
  
      /* ── Step 5: Gold outer ring (conic gradient simulation) */
      const RING_R  = R;
      const RING_IN = R - 5.5;
      for (let a = 0; a < 360; a += 3) {
        const rad = (a * Math.PI) / 180;
        // Cycle: bright → dark → bright to simulate conic gold
        const t   = (Math.sin(rad * 2) + 1) / 2;
        const r   = Math.round(140 + t * 70);   // 140–210
        const g   = Math.round(90  + t * 60);   // 90–150
        const b   = Math.round(20  + t * 20);   // 20–40
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(rad) * RING_IN, cy + Math.sin(rad) * RING_IN);
        ctx.arc(cx, cy, RING_R,  rad, rad + 0.065);
        ctx.arc(cx, cy, RING_IN, rad + 0.065, rad, true);
        ctx.closePath();
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fill();
      }
  
      /* ── Step 6: Thin inner gold ring ───────────────── */
      ctx.beginPath();
      ctx.arc(cx, cy, R - 9, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(212,168,67,0.55)';
      ctx.lineWidth   = 1;
      ctx.stroke();
  
      /* ── Step 7: "R&J" monogram text ────────────────── */
      // Use Great Vibes if loaded, fallback to Georgia
      ctx.save();
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
  
      // Shadow / emboss effect — dark layer slightly offset
      ctx.font      = 'bold 28px "Great Vibes", Georgia, serif';
      ctx.fillStyle = 'rgba(30,0,0,0.65)';
      ctx.fillText('R&J', cx + 1.2, cy + 1.8);
  
      // Main text — warm gold/ivory
      ctx.fillStyle = '#FFE0A0';
      ctx.shadowColor   = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur    = 3;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1.5;
      ctx.fillText('R&J', cx, cy);
  
      // Top-light sheen on text
      ctx.fillStyle     = 'rgba(255,255,255,0.22)';
      ctx.shadowBlur    = 0;
      ctx.fillText('R&J', cx - 0.5, cy - 0.8);
      ctx.restore();
  
      /* ── Step 8: Subtle irregular edge (wax drip effect) */
      ctx.save();
      ctx.globalCompositeOperation = 'source-atop';
      for (let i = 0; i < 14; i++) {
        const a  = (i / 14) * Math.PI * 2;
        const dr = (Math.random() - 0.5) * 4;   // ±2 px bump
        const ox = Math.cos(a) * (R + dr);
        const oy = Math.sin(a) * (R + dr);
        ctx.beginPath();
        ctx.arc(cx + ox * 0.12, cy + oy * 0.12, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(90,0,16,0.5)';
        ctx.fill();
      }
      ctx.restore();
    }
  
    // Wait for Great Vibes font to load before drawing, so "R&J" renders correctly
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(drawWaxSeal);
    } else {
      window.addEventListener('load', drawWaxSeal);
    }
  
  
    /* ════════════════════════════════════════════════════════
       2.  AMBIENT SPARKLE CANVAS  (envelope background)
    ════════════════════════════════════════════════════════ */
    const ambientCanvas = document.getElementById('ambientCanvas');
    const actx          = ambientCanvas.getContext('2d');
  
    function resizeAmbient() {
      ambientCanvas.width  = window.innerWidth;
      ambientCanvas.height = window.innerHeight;
    }
    resizeAmbient();
    window.addEventListener('resize', resizeAmbient);
  
    const sparkles = [];
    for (let i = 0; i < 60; i++) {
      sparkles.push({
        x:      Math.random() * window.innerWidth,
        y:      Math.random() * window.innerHeight,
        r:      Math.random() * 1.6 + 0.4,
        alpha:  Math.random(),
        dAlpha: (Math.random() * 0.012 + 0.004) * (Math.random() < 0.5 ? 1 : -1),
        color:  Math.random() < 0.6 ? '#D4A843' : '#C0407A',
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
        actx.fillStyle   = s.color;
        actx.beginPath();
        actx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        actx.fill();
      });
      requestAnimationFrame(drawAmbient);
    }
    drawAmbient();
  
  
    /* ════════════════════════════════════════════════════════
       3.  ENVELOPE OPEN SEQUENCE
           a) Tap → wax seal breaks animation (CSS class)
           b) Top flap rotates open (rotateX via CSS class)
           c) Couple photo card slides up
           d) 1.7s later: screen fades out
           e) Music starts (within the user-gesture handler)
           f) Mute button appears
    ════════════════════════════════════════════════════════ */
    const envelopeScreen = document.getElementById('envelopeScreen');
    const envelope       = document.getElementById('envelope');
    const tapHint        = document.getElementById('tapHint');
    const bgMusic        = document.getElementById('bgMusic');
    const muteBtn        = document.getElementById('muteBtn');
  
    // Tap the envelope OR the tap hint text to open
    envelope.addEventListener('click', openEnvelope);
    if (tapHint) tapHint.addEventListener('click', openEnvelope);
  
    let envelopeOpened = false;
  
    function openEnvelope() {
      if (envelopeOpened) return;
      envelopeOpened = true;
  
      // Hide tap hint
      if (tapHint) {
        tapHint.style.opacity      = '0';
        tapHint.style.pointerEvents = 'none';
      }
  
      // Add .open — triggers all CSS transitions (flap, letter, seal)
      envelope.classList.add('open');
  
      // Start music — MUST be inside the click handler (user gesture)
      startMusic();
  
      // After letter has risen: fade out the overlay (1.7s delay)
      setTimeout(function () {
        envelopeScreen.classList.add('closing');
        ambientRunning = false; // stop sparkle loop
  
        // Remove overlay from DOM after CSS transition completes (1.2s)
        setTimeout(function () {
          envelopeScreen.classList.add('gone');
          muteBtn.classList.add('visible');
        }, 1250);
      }, 1700);
    }
  
  
    /* ════════════════════════════════════════════════════════
       4.  AUDIO — FADE-IN + MUTE TOGGLE
    ════════════════════════════════════════════════════════ */
    var isMuted      = false;
    var fadeInterval = null;
    var TARGET_VOL   = 0.55;
  
    function startMusic() {
      bgMusic.volume = 0;
      bgMusic.play().catch(function () {
        /* Silently ignore if browser still blocks (very rare in click handler) */
      });
      // Fade volume from 0 → 0.55 over ~1.7 seconds
      var vol = 0;
      clearInterval(fadeInterval);
      fadeInterval = setInterval(function () {
        vol = Math.min(vol + 0.02, TARGET_VOL);
        bgMusic.volume = vol;
        if (vol >= TARGET_VOL) clearInterval(fadeInterval);
      }, 60);
    }
  
    muteBtn.addEventListener('click', function () {
      isMuted = !isMuted;
      if (isMuted) {
        bgMusic.volume = 0;
        muteBtn.textContent = '🔇';
      } else {
        bgMusic.volume = TARGET_VOL;
        muteBtn.textContent = '🔊';
      }
    });
  
    // Pause when tab is hidden (saves battery on mobile)
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        bgMusic.pause();
      } else if (envelopeOpened && !isMuted) {
        bgMusic.play().catch(function () {});
      }
    });
  
  
    /* ════════════════════════════════════════════════════════
       5.  PETAL CANVAS  (always running behind invitation slides)
    ════════════════════════════════════════════════════════ */
    const petalCanvas = document.getElementById('petalCanvas');
    const pctx        = petalCanvas.getContext('2d');
  
    function resizePetal() {
      petalCanvas.width  = window.innerWidth;
      petalCanvas.height = window.innerHeight;
    }
    resizePetal();
    window.addEventListener('resize', resizePetal);
  
    const PETAL_COLORS = [
      'rgba(255,182,193,0.75)',
      'rgba(255,143,171,0.65)',
      'rgba(240,204,122,0.50)',
      'rgba(220,180,220,0.60)',
      'rgba(255,220,220,0.60)',
      'rgba(192, 64,122,0.45)',
    ];
  
    function Petal(scatter) { this.reset(scatter); }
    Petal.prototype.reset = function (scatter) {
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
    };
    Petal.prototype.update = function () {
      this.y   += this.vy;
      this.wob += this.wobSpd;
      this.x   += this.vx + Math.sin(this.wob) * 0.45;
      this.rot += this.rotSpd;
      if (this.y > petalCanvas.height + 30) this.reset(false);
    };
    Petal.prototype.draw = function () {
      pctx.save();
      pctx.translate(this.x, this.y);
      pctx.rotate(this.rot);
      pctx.globalAlpha = this.alpha;
      pctx.fillStyle   = this.color;
      const s = this.size;
      pctx.beginPath();
      pctx.moveTo(0, 0);
      pctx.bezierCurveTo( s*0.6, -s*0.6,  s*1.1, -s*0.2,  s*0.65,  s*0.35);
      pctx.bezierCurveTo( s*0.2,  s*0.75, -s*0.4,  s*0.45, 0, 0);
      pctx.fill();
      pctx.restore();
    };
  
    const petals = [];
    for (let i = 0; i < 22; i++) petals.push(new Petal(true));
  
    let petalRunning = true;
  
    function animatePetals() {
      if (!petalRunning) return;
      pctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
      petals.forEach(function (p) { p.update(); p.draw(); });
      requestAnimationFrame(animatePetals);
    }
    animatePetals();
  
    document.addEventListener('visibilitychange', function () {
      petalRunning = !document.hidden;
      if (petalRunning) animatePetals();
    });
  
  
    /* ════════════════════════════════════════════════════════
       6.  SCROLL REVEAL  (IntersectionObserver)
    ════════════════════════════════════════════════════════ */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.25 }
    );
    revealEls.forEach(function (el) { revealObs.observe(el); });
  
  
    /* ════════════════════════════════════════════════════════
       7.  PROGRESS DOT NAVIGATION
    ════════════════════════════════════════════════════════ */
    const container = document.getElementById('scrollContainer');
    const slides    = document.querySelectorAll('.slide');
    const dots      = document.querySelectorAll('.dot');
  
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const idx = parseInt(dot.dataset.slide, 10);
        if (slides[idx]) slides[idx].scrollIntoView({ behavior: 'smooth' });
      });
    });
  
    const slideObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            const idx = Array.from(slides).indexOf(e.target);
            dots.forEach(function (d) { d.classList.remove('active'); });
            if (dots[idx]) dots[idx].classList.add('active');
          }
        });
      },
      { root: container, threshold: 0.55 }
    );
    slides.forEach(function (s) { slideObs.observe(s); });
  
  
    /* ════════════════════════════════════════════════════════
       8.  KEYBOARD NAV + iOS SCROLL FIX
    ════════════════════════════════════════════════════════ */
    document.addEventListener('keydown', function (e) {
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
      container.addEventListener('touchmove', function (e) {
        e.stopPropagation();
      }, { passive: true });
    }
  
    console.log(
      '%c✝  Raj ♥ Jency — 18.05.2026  ✝',
      'font-family:"Great Vibes",cursive;font-size:1.3rem;color:#D4A843;'
    );
  
  })();