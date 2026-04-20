/* =============================================
   TANDOORI — CINEMATIC FIRE ANIMATION ENGINE
   ============================================= */

(function () {
  'use strict';

  /* ──────────────────────────────────────────
     CANVAS SETUP
  ────────────────────────────────────────── */
  const canvas = document.getElementById('fireCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ──────────────────────────────────────────
     PARTICLE POOL
  ────────────────────────────────────────── */
  const POOL_SIZE  = 320;
  const particles  = [];

  function rand(min, max) { return Math.random() * (max - min) + min; }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x     = rand(W * 0.2, W * 0.8);
      this.y     = initial ? rand(H * 0.3, H + 60) : H + rand(10, 60);
      this.vx    = rand(-0.6, 0.6);
      this.vy    = rand(-1.8, -0.6);
      this.life  = 0;
      this.maxLife = rand(90, 220);
      this.size  = rand(1.2, 5.5);
      this.type  = Math.random();   // < 0.25 = ember, < 0.55 = spark, else = smoke
      this.angle = rand(0, Math.PI * 2);
      this.spin  = rand(-0.04, 0.04);
      this.alpha = 0;
    }

    update() {
      this.life++;
      const t = this.life / this.maxLife;

      // Physics
      this.vx += rand(-0.08, 0.08);
      this.x  += this.vx;
      this.y  += this.vy;
      this.angle += this.spin;

      if (this.type < 0.55) {
        // Ember / spark — rise with slight turbulence
        this.vy  -= 0.012;
        this.size = Math.max(0.3, this.size - 0.018);
        this.alpha = t < 0.15
          ? t / 0.15
          : t > 0.75
            ? (1 - t) / 0.25
            : 1;
      } else {
        // Smoke — expand and fade
        this.size += 0.35;
        this.vy  += 0.005;
        this.alpha = t < 0.1
          ? t / 0.1 * 0.35
          : t > 0.55
            ? (1 - t) / 0.45 * 0.35
            : 0.35;
      }

      if (this.life >= this.maxLife || this.y < -80 || this.x < -80 || this.x > W + 80) {
        this.reset();
      }
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      if (this.type < 0.25) {
        // Ember — glowing dot with halo
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 3.5);
        g.addColorStop(0,   `rgba(255, 240, 180, ${this.alpha})`);
        g.addColorStop(0.3, `rgba(255, 160, 30,  ${this.alpha * 0.8})`);
        g.addColorStop(0.7, `rgba(220, 60, 5,    ${this.alpha * 0.3})`);
        g.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

      } else if (this.type < 0.55) {
        // Spark — thin elongated streak
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 2);
        ctx.lineTo(0, this.size * 2);
        ctx.strokeStyle = `rgba(255, 200, 80, ${this.alpha})`;
        ctx.lineWidth = Math.max(0.4, this.size * 0.4);
        ctx.lineCap = 'round';
        ctx.stroke();

      } else {
        // Smoke puff
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        g.addColorStop(0, `rgba(120, 60, 20, ${this.alpha * 0.9})`);
        g.addColorStop(0.6, `rgba(60, 25, 8,  ${this.alpha * 0.4})`);
        g.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Spawn pool
  for (let i = 0; i < POOL_SIZE; i++) {
    particles.push(new Particle());
  }

  /* ──────────────────────────────────────────
     FIRE BASE COLUMNS
  ────────────────────────────────────────── */
  const fireColumns = 6;
  const fireSeeds = Array.from({ length: fireColumns }, (_, i) => ({
    x:      W * (0.15 + i * 0.14),
    phase:  rand(0, Math.PI * 2),
    speed:  rand(1.2, 2.5),
    height: rand(140, 280),
  }));

  function drawFireBase(time) {
    fireSeeds.forEach(seed => {
      seed.x = W * (0.15 + fireSeeds.indexOf(seed) * 0.14); // reflow on resize
      const flicker = Math.sin(time * seed.speed + seed.phase) * 0.25 + 0.75;
      const bh = seed.height * flicker;

      for (let step = 0; step < 12; step++) {
        const frac = step / 12;
        const yPos = H - frac * bh;
        const r = seed.height * 0.12 * (1 - frac);
        const a = (1 - frac) * 0.12 * flicker;
        if (a < 0.01) continue;

        const g = ctx.createRadialGradient(seed.x, yPos, 0, seed.x, yPos, r * 2.5);
        g.addColorStop(0,   `rgba(255, 160, 30, ${a})`);
        g.addColorStop(0.4, `rgba(200,  60,  5, ${a * 0.6})`);
        g.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(seed.x, yPos, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
    });
  }

  /* ──────────────────────────────────────────
     AMBIENT EMBER GLOW (bottom)
  ────────────────────────────────────────── */
  function drawAmbientGlow(time) {
    const pulse = Math.sin(time * 0.8) * 0.12 + 0.88;
    const g = ctx.createRadialGradient(W * 0.5, H * 1.1, 0, W * 0.5, H * 1.1, H * 0.7);
    g.addColorStop(0,   `rgba(200, 50, 5, ${0.28 * pulse})`);
    g.addColorStop(0.35,`rgba(120, 25, 3, ${0.14 * pulse})`);
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  /* ──────────────────────────────────────────
     MAIN RENDER LOOP
  ────────────────────────────────────────── */
  let startTime = null;
  let running   = true;

  function loop(ts) {
    if (!running) return;
    requestAnimationFrame(loop);

    if (!startTime) startTime = ts;
    const time = (ts - startTime) / 1000;

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Fade-in particles after 0.5s
    const globalAlpha = Math.min(1, Math.max(0, (time - 0.5) / 2));
    ctx.globalAlpha = globalAlpha;

    drawAmbientGlow(time);
    drawFireBase(time);
    particles.forEach(p => { p.update(); p.draw(); });

    ctx.globalAlpha = 1;
  }

  requestAnimationFrame(loop);

  /* ──────────────────────────────────────────
     SEQUENCE ORCHESTRATION
  ────────────────────────────────────────── */
  const letters     = document.querySelectorAll('.letter');
  const taglineTop  = document.getElementById('tagline-top');
  const taglineBot  = document.getElementById('tagline-bottom');
  const divider     = document.getElementById('divider-line');
  const enterWrap   = document.getElementById('enter-btn-wrap');

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function runIntroSequence() {
    // Phase 1: Fire builds up silently — 1.2s
    await delay(1200);

    // Phase 2: Top tagline fades in
    taglineTop.classList.add('visible');
    await delay(600);

    // Phase 3: Letters appear one by one with stagger
    for (let i = 0; i < letters.length; i++) {
      await delay(i === 0 ? 0 : 75);
      letters[i].classList.add('visible');
    }
    await delay(300);

    // Phase 4: Divider expands
    divider.classList.add('visible');
    await delay(400);

    // Phase 5: Bottom tagline
    taglineBot.classList.add('visible');
    await delay(500);

    // Phase 6: Enter button
    enterWrap.classList.add('visible');
  }

  runIntroSequence();

  /* ──────────────────────────────────────────
     LETTER INTERACTION — Burst on hover
  ────────────────────────────────────────── */
  letters.forEach(letter => {
    letter.addEventListener('mouseenter', function () {
      const rect   = this.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      spawnBurst(cx, cy, 18);
    });
  });

  function spawnBurst(x, y, count) {
    let spawned = 0;
    for (const p of particles) {
      if (p.life > p.maxLife * 0.9 || p.life < 2) {
        p.x       = x + rand(-20, 20);
        p.y       = y + rand(-10, 10);
        p.vx      = rand(-2.5, 2.5);
        p.vy      = rand(-3.5, -1.0);
        p.life    = 0;
        p.maxLife = rand(40, 80);
        p.size    = rand(2, 5);
        p.type    = Math.random() * 0.5; // ember or spark only
        p.alpha   = 0;
        spawned++;
        if (spawned >= count) break;
      }
    }
  }

  /* ──────────────────────────────────────────
     ENTER BUTTON HANDLER
  ────────────────────────────────────────── */
  window.enterSite = function () {
    const intro = document.getElementById('intro');
    const main  = document.getElementById('main-site');

    intro.classList.add('fade-out');

    setTimeout(() => {
      intro.style.display = 'none';
      main.classList.add('visible');
      document.body.style.overflow = 'auto';
      running = false; // stop canvas loop (performance)
    }, 1300);
  };

  /* ──────────────────────────────────────────
     MOUSE PARALLAX ON INTRO
  ────────────────────────────────────────── */
  const logoCont = document.getElementById('logo-container');
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  (function parallaxLoop() {
    if (!running) return;
    requestAnimationFrame(parallaxLoop);
    logoCont.style.transform = `
      translateY(20px)
      rotateX(${-mouseY * 4}deg)
      rotateY(${mouseX * 5}deg)
      translateZ(0)
    `;
    logoCont.style.perspective = '800px';
  })();

})();
