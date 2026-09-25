/**
 * SkyCanvas Engine v3.0
 * - Hoa Đăng vuông truyền thống Á Đông (square paper lantern)
 * - Tối ưu hiệu năng mobile: adaptive counts, no ctx.filter, minimal shadowBlur
 * - Blossom Burst hiệu ứng tung hoa
 */
export class SkyCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d', { alpha: false });

    // ── Mobile detection & resolution ──────────────────────────────────────
    this.isMobile = window.innerWidth < 768 || navigator.maxTouchPoints > 0;
    // Setting pixelRatio to 1 on mobile saves 75% GPU fillrate and guarantees 60 FPS!
    this.pixelRatio = this.isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

    // ── Particle pools ────────────────────────────────────────────────────
    this.stars         = [];
    this.fireflies     = [];
    this.hoaDangs      = [];
    this.ripples       = [];
    this.fallingPetals = [];
    this.sparkles      = [];
    this.clouds        = [];
    this.blossomBursts = [];
    this.bokehParticles= [];

    this.pointer = { x: -1000, y: -1000, active: false };

    // ── Cached background gradient ────────────────────────────────────────
    this._bgGrad = null;

    // ── Performance pause state ──────────────────────────────────────────
    this.isPaused = false;
    this.rafId = null;

    this.init();
  }

  // =========================================================================
  // INIT
  // =========================================================================
  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('pointermove', (e) => {
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
      this.pointer.active = true;
    });
    window.addEventListener('pointerleave', () => { this.pointer.active = false; });

    this.createStars();
    this.createFireflies();
    this.createClouds();
    this.createFallingPetals();
    this.createBackgroundHoaDangs();

    this.animate();
  }

  resize() {
    this.width  = window.innerWidth;
    this.height = window.innerHeight;
    this.isMobile = this.width < 768 || navigator.maxTouchPoints > 0;
    this.pixelRatio = this.isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

    this.canvas.width  = this.width  * this.pixelRatio;
    this.canvas.height = this.height * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    // Invalidate cached gradient on resize
    this._bgGrad = null;
  }

  // =========================================================================
  // CREATION
  // =========================================================================
  createStars() {
    this.stars = [];
    const density   = this.isMobile ? 25000 : 5000;
    const starCount = Math.floor((this.width * this.height) / density);
    const colors    = ['#ffffff', '#fff5cc', '#ffeaa7', '#dff9fb', '#fd79a8'];

    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.88,
        radius: Math.random() * 1.4 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.025 + 0.008,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  createFireflies() {
    this.fireflies = [];
    const maxCount = this.isMobile ? 8 : 35;
    const count    = Math.min(Math.floor(this.width / 40), maxCount);

    for (let i = 0; i < count; i++) {
      this.fireflies.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        size: Math.random() * 2 + 1,
        pulseSpeed: Math.random() * 0.035 + 0.018,
        pulsePhase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.35 ? '#ffdd80' : '#8ee3ef'
      });
    }
  }

  createFallingPetals() {
    this.fallingPetals = [];
    const maxCount = this.isMobile ? 8 : 35;
    const count    = Math.min(Math.floor(this.width / 32), maxCount);
    const colors   = [
      '#ff758c', '#ffa8ba', '#ffd2db', '#ffdd59', '#fff0f3',
      '#ffb3c6', '#ff6b9d', '#ffc2d4', '#fffde7', '#ff9fb2'
    ];

    for (let i = 0; i < count; i++) {
      const isCherryType = !this.isMobile && Math.random() > 0.5;
      this.fallingPetals.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height - 50,
        size: isCherryType ? Math.random() * 5 + 4 : Math.random() * 9 + 5,
        vx: Math.random() * 1.2 - 0.6,
        vy: Math.random() * 0.8 + 0.5,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.045,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.02 + 0.008,
        driftAmount: Math.random() * 1.0 + 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.35,
        isCherryType
      });
    }
  }

  createClouds() {
    this.clouds = [
      { x: this.width * 0.7,  y: 80,  speed: 0.15, width: 220, height: 45, opacity: 0.18 },
      { x: this.width * 0.5,  y: 120, speed: 0.10, width: 280, height: 55, opacity: 0.14 },
      { x: this.width * 0.85, y: 160, speed: 0.18, width: 200, height: 40, opacity: 0.16 }
    ];
  }

  createBackgroundHoaDangs() {
    const count = this.isMobile ? 5 : 8;
    for (let i = 0; i < count; i++) {
      const z = Math.random();
      this.hoaDangs.push({
        x: Math.random() * this.width,
        y: this.height + Math.random() * 200,
        speed: 0.22 + z * 0.5,
        swaySpeed: Math.random() * 0.016 + 0.01,
        swayAngle: Math.random() * Math.PI * 2,
        swayAmount: 0.45 + z * 0.45,
        size: 10 + z * 20,
        opacity: 0.25 + z * 0.5,
        z,
        text: '',
        isBackground: true
      });
    }
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================
  releaseHoaDang(x, y, customWish = '') {
    this.ripples.push({ x, y, radius: 5, maxRadius: 65, opacity: 0.85, speed: 1.8 });
    this.createSparkleBurst(x, y, 16);

    this.hoaDangs.push({
      x, y,
      speed: Math.random() * 0.5 + 0.85,
      swaySpeed: 0.02,
      swayAngle: Math.random() * Math.PI,
      swayAmount: 0.85,
      size: 28,
      opacity: 1,
      z: 1,
      text: customWish,
      glow: true,
      isBackground: false
    });
  }

  releaseSkyLantern(customWish = '') {
    const x = this.width * (0.35 + Math.random() * 0.3);
    const y = this.height * 0.82;
    this.ripples.push({ x, y, radius: 8, maxRadius: 85, opacity: 0.9, speed: 2.2 });
    this.createSparkleBurst(x, y - 25, 26);
    this.triggerBlossomBurst(x, y - 75);

    this.hoaDangs.push({
      x, y,
      speed: Math.random() * 0.35 + 0.95,
      swaySpeed: 0.016,
      swayAngle: Math.random() * Math.PI,
      swayAmount: 0.95,
      size: 34,
      opacity: 1,
      z: 1.25,
      text: customWish,
      glow: true,
      isBackground: false
    });
  }

  createSparkleBurst(x, y, count = 18) {
    const colors = ['#fff2b2', '#ffdd80', '#ff6b8b', '#ffa8ba', '#ffffff'];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const speed = Math.random() * 3.5 + 1.2;
      this.sparkles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.5 + 1,
        alpha: 1,
        decay: Math.random() * 0.022 + 0.014,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.055
      });
    }
  }

  triggerBlossomBurst(originX, originY) {
    const cx = originX ?? this.width  * 0.5;
    const cy = originY ?? this.height * 0.45;

    const burstColors = [
      '#ffb3c6', '#ff758c', '#ffd2db', '#ff4d88',
      '#ffe0ec', '#ffaacc', '#ffffff', '#ffc2d4',
      '#ffe066', '#ffd700'
    ];

    // Fewer particles on mobile
    const petalCount = this.isMobile ? 26 : 52;
    const bokehCount = this.isMobile ? 12 : 24;

    for (let i = 0; i < petalCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6.5 + 2.5;
      const size  = Math.random() * 28 + 12;
      const isCherryBlossom = !this.isMobile && Math.random() > 0.4;

      this.blossomBursts.push({
        x: cx + (Math.random() - 0.5) * 50,
        y: cy + (Math.random() - 0.5) * 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 1.5,
        size,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.09,
        color: burstColors[Math.floor(Math.random() * burstColors.length)],
        alpha: 1,
        phase: 'burst',
        age: 0,
        burstDuration: 38 + Math.random() * 18,
        gravity: 0.07 + Math.random() * 0.04,
        isCherryBlossom,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.025 + 0.012,
        driftAmount: Math.random() * 1.5 + 0.6
      });
    }

    for (let i = 0; i < bokehCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      this.bokehParticles.push({
        x: cx + (Math.random() - 0.5) * 80,
        y: cy + (Math.random() - 0.5) * 80,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        size: Math.random() * 16 + 5,
        alpha: Math.random() * 0.55 + 0.2,
        decay: Math.random() * 0.007 + 0.003,
        color: Math.random() > 0.4 ? '#ffd700' : '#ffb3c6',
        gravity: 0.018
      });
    }

    this.createSparkleBurst(cx, cy, this.isMobile ? 22 : 40);
  }

  // =========================================================================
  // DRAW: BACKGROUND + MOON + CLOUDS + STARS
  // =========================================================================
  _drawBackground() {
    if (!this._bgGrad) {
      this._bgGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);
      this._bgGrad.addColorStop(0,    '#060814');
      this._bgGrad.addColorStop(0.35, '#0b102c');
      this._bgGrad.addColorStop(0.7,  '#13153c');
      this._bgGrad.addColorStop(1,    '#1c1944');
    }
    this.ctx.fillStyle = this._bgGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawMoon() {
    const moonX = this.width > 768 ? this.width * 0.82 : this.width * 0.85;
    const moonY = this.width > 768 ? 110 : 85;
    const moonR = this.width > 768 ? 44  : 32;

    // Outer glow (no shadowBlur — use gradient instead)
    const glow = this.ctx.createRadialGradient(moonX, moonY, moonR * 0.6, moonX, moonY, moonR * 3.2);
    glow.addColorStop(0,   'rgba(255, 238, 179, 0.42)');
    glow.addColorStop(0.3, 'rgba(255, 221, 128, 0.22)');
    glow.addColorStop(0.7, 'rgba(255, 184, 108, 0.07)');
    glow.addColorStop(1,   'rgba(0,0,0,0)');
    this.ctx.fillStyle = glow;
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, moonR * 3.2, 0, Math.PI * 2);
    this.ctx.fill();

    // Moon disc
    const mg = this.ctx.createRadialGradient(
      moonX - moonR * 0.25, moonY - moonR * 0.25, moonR * 0.1,
      moonX, moonY, moonR
    );
    mg.addColorStop(0,    '#ffffff');
    mg.addColorStop(0.4,  '#fff9e6');
    mg.addColorStop(0.85, '#ffeaa7');
    mg.addColorStop(1,    '#fad390');

    this.ctx.fillStyle = mg;
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    this.ctx.fill();

    // Skip craters on mobile
    if (!this.isMobile) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      this.ctx.clip();
      this.ctx.fillStyle = 'rgba(230, 190, 120, 0.18)';
      this.ctx.beginPath();
      this.ctx.arc(moonX + moonR * 0.2,  moonY - moonR * 0.15, moonR * 0.35, 0, Math.PI * 2);
      this.ctx.arc(moonX - moonR * 0.3,  moonY + moonR * 0.25, moonR * 0.28, 0, Math.PI * 2);
      this.ctx.arc(moonX + moonR * 0.1,  moonY + moonR * 0.35, moonR * 0.22, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  drawClouds() {
    if (this.isMobile) return; // skip clouds on mobile
    this.clouds.forEach(c => {
      c.x -= c.speed;
      if (c.x + c.width < 0) c.x = this.width + 50;
      this.ctx.save();
      this.ctx.fillStyle  = 'rgba(255, 245, 225, 0.08)';
      this.ctx.globalAlpha = c.opacity;
      this.ctx.beginPath();
      this.ctx.ellipse(c.x, c.y, c.width * 0.5, c.height * 0.5, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  drawStars() {
    const ctx = this.ctx;
    ctx.save();
    this.stars.forEach(s => {
      s.phase += s.twinkleSpeed;
      const a = s.alpha * (0.58 + 0.42 * Math.sin(s.phase));
      ctx.globalAlpha = Math.max(0.08, a);
      ctx.fillStyle   = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // =========================================================================
  // DRAW: FALLING PETALS
  // =========================================================================
  drawFallingPetals() {
    const ctx = this.ctx;
    this.fallingPetals.forEach(p => {
      p.driftPhase += p.driftSpeed;
      p.x += p.vx + Math.sin(p.driftPhase) * p.driftAmount;
      p.y += p.vy;
      p.angle += p.angularSpeed;

      if (p.y > this.height + 20) { p.y = -20; p.x = Math.random() * this.width; }
      if (p.x < -20) p.x = this.width + 20;
      if (p.x > this.width + 20) p.x = -20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;

      if (p.isCherryType) {
        this._drawCherryBlossom(p.color, p.size);
      } else {
        this._drawSinglePetal(p.color, p.size);
      }
      ctx.restore();
    });
    ctx.globalAlpha = 1;
  }

  _drawCherryBlossom(color, size) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      ctx.save();
      ctx.rotate(a);
      ctx.beginPath();
      ctx.ellipse(0, -size * 0.58, size * 0.3, size * 0.54, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = '#ffd32a';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  _drawSinglePetal(color, size) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.5);
    ctx.bezierCurveTo( size * 0.48,  size * 0.18,  size * 0.52, -size * 0.28, 0, -size * 0.5);
    ctx.bezierCurveTo(-size * 0.52, -size * 0.28, -size * 0.48,  size * 0.18, 0,  size * 0.5);
    ctx.fill();
  }

  drawRipples() {
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius  += r.speed;
      r.opacity -= 0.022;
      if (r.opacity <= 0 || r.radius >= r.maxRadius) { this.ripples.splice(i, 1); continue; }
      this.ctx.save();
      this.ctx.strokeStyle  = '#ffd770';
      this.ctx.lineWidth    = 1.6;
      this.ctx.globalAlpha  = r.opacity;
      this.ctx.beginPath();
      this.ctx.ellipse(r.x, r.y, r.radius * 1.5, r.radius * 0.55, 0, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  // =========================================================================
  // HOA ĐĂNG VUÔNG — Square Paper Lantern (đèn lồng vuông truyền thống)
  // =========================================================================
  drawHoaDangs() {
    // Painter's sort: far → near
    this.hoaDangs.sort((a, b) => (a.z ?? 0.5) - (b.z ?? 0.5));

    const now = performance.now() * 0.001;

    for (let i = this.hoaDangs.length - 1; i >= 0; i--) {
      const l = this.hoaDangs[i];
      l.y -= l.speed;
      l.swayAngle += l.swaySpeed;
      const cx = l.x + Math.sin(l.swayAngle) * l.swayAmount * 11;

      if (l.y < -130) {
        if (l.isBackground) {
          l.y = this.height + 60;
          l.x = Math.random() * this.width;
        } else {
          this.hoaDangs.splice(i, 1);
          continue;
        }
      }

      this.ctx.save();
      this.ctx.globalAlpha = l.opacity;
      this._drawSquareLantern(cx, l.y, l.size, now, l.x);

      if (l.text) {
        this.ctx.save();
        this.ctx.font = '600 12px Quicksand, sans-serif';
        const txt = l.text.length > 28 ? l.text.slice(0, 26) + '...' : l.text;
        const tw = this.ctx.measureText(txt).width;
        const ty = l.y - l.size * 1.8;

        // Wish ribbon pill background
        this.ctx.fillStyle = 'rgba(20, 10, 5, 0.7)';
        this.ctx.strokeStyle = 'rgba(255, 215, 120, 0.65)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.roundRect(cx - tw / 2 - 8, ty - 14, tw + 16, 20, 10);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#fff9db';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(txt, cx, ty);
        this.ctx.restore();
      }
      this.ctx.restore();
    }
  }

  /**
   * Vẽ đèn lồng vuông truyền thống (square paper lantern)
   * Nhìn từ góc hơi nghiêng — giấy mờ amber phát sáng, khung dây, tua rua
   */
  _drawSquareLantern(cx, cy, s, now, seedX) {
    const ctx     = this.ctx;
    const flicker = 0.88 + Math.sin(now * 7.1 + seedX * 0.01) * 0.12;
    const flick2  = 0.92 + Math.sin(now * 11.3 + seedX * 0.03) * 0.08;

    // ── Dimensions ────────────────────────────────────────────────────────
    const hw = s * 1.05;   // half-width  (horizontal)
    const ht = s * 1.45;   // half-height (vertical)
    const bx = cx - hw;
    const by = cy;
    const bw = hw * 2;
    const bh = ht * 2;

    // ── 1. OUTER GLOW AURA (gradient — no shadowBlur) ─────────────────────
    const aura = ctx.createRadialGradient(cx, cy + ht, s * 0.1, cx, cy + ht, s * 3.0);
    aura.addColorStop(0,   `rgba(255, 248, 180, ${0.5  * flicker})`);
    aura.addColorStop(0.25,`rgba(255, 200, 70,  ${0.32 * flicker})`);
    aura.addColorStop(0.6, `rgba(255, 130, 40,  0.12)`);
    aura.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, cy + ht, s * 3.0, 0, Math.PI * 2);
    ctx.fill();

    // ── 2. LANTERN BODY (slightly tapered rectangle for 3D feel) ──────────
    //   Top edge narrower, middle bulges, bottom tapers
    const topExtra  = s * 0.12;  // extra width at top rim vs mid
    const botExtra  = s * 0.08;  // extra width at bottom rim vs mid

    // Body gradient: warm amber paper
    const bodyGrad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
    bodyGrad.addColorStop(0,    `rgba(255, 255, 200, ${0.88 * flick2})`);
    bodyGrad.addColorStop(0.12, `rgba(255, 235, 140, ${0.86 * flicker})`);
    bodyGrad.addColorStop(0.38, `rgba(255, 185, 60,  ${0.82 * flicker})`);
    bodyGrad.addColorStop(0.65, `rgba(235, 140, 25,  0.78)`);
    bodyGrad.addColorStop(1,    `rgba(190, 95,  15,  0.65)`);

    ctx.beginPath();
    ctx.moveTo(cx - hw - topExtra, by);
    ctx.lineTo(cx + hw + topExtra, by);
    ctx.lineTo(cx + hw + botExtra, by + bh);
    ctx.lineTo(cx - hw - botExtra, by + bh);
    ctx.closePath();
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // ── 3. INNER CANDLE LIGHT (lighter blending) ──────────────────────────
    const innerGlow = ctx.createRadialGradient(cx, cy + ht, 0, cx, cy + ht, s * 1.2);
    innerGlow.addColorStop(0,   `rgba(255, 255, 180, ${0.68 * flicker})`);
    innerGlow.addColorStop(0.4, `rgba(255, 215, 80,  ${0.38 * flicker})`);
    innerGlow.addColorStop(0.8, `rgba(255, 160, 30,  0.12)`);
    innerGlow.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = innerGlow;
    ctx.beginPath();
    ctx.rect(bx - 4, by, bw + 8, bh);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // ── 4. PANEL DIVIDER LINES (vertical — 3 panels) ──────────────────────
    ctx.save();
    // clip to lantern body so lines don't bleed outside
    ctx.beginPath();
    ctx.moveTo(cx - hw - topExtra, by);
    ctx.lineTo(cx + hw + topExtra, by);
    ctx.lineTo(cx + hw + botExtra, by + bh);
    ctx.lineTo(cx - hw - botExtra, by + bh);
    ctx.closePath();
    ctx.clip();

    ctx.strokeStyle = `rgba(180, 110, 20, 0.30)`;
    ctx.lineWidth   = 1.0;
    // 3 equal-width panels → 2 dividers at 1/3 and 2/3
    const panelW = bw / 3;
    for (let p = 1; p <= 2; p++) {
      const px = bx + panelW * p;
      ctx.beginPath();
      ctx.moveTo(px, by);
      ctx.lineTo(px, by + bh);
      ctx.stroke();
    }

    // Horizontal mid-line (belt)
    ctx.strokeStyle = `rgba(200, 130, 30, 0.25)`;
    ctx.beginPath();
    ctx.moveTo(bx, cy + ht);
    ctx.lineTo(bx + bw, cy + ht);
    ctx.stroke();
    ctx.restore();

    // ── 5. DECORATIVE DIAMOND PATTERN on center panel (mobile skip) ───────
    if (!this.isMobile && s > 14) {
      ctx.save();
      ctx.globalAlpha *= 0.35;
      ctx.strokeStyle = 'rgba(255, 200, 80, 0.55)';
      ctx.lineWidth   = 0.8;
      const dmX = cx;
      const dmY = cy + ht;
      const dmR = s * 0.35;
      ctx.beginPath();
      ctx.moveTo(dmX, dmY - dmR);
      ctx.lineTo(dmX + dmR * 0.6, dmY);
      ctx.lineTo(dmX, dmY + dmR);
      ctx.lineTo(dmX - dmR * 0.6, dmY);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    // ── 6. TOP & BOTTOM RIMS (wire frame bars) ────────────────────────────
    const rimH     = s * 0.18;
    const rimColor = `rgba(160, 105, 25, 0.82)`;

    // Top rim
    ctx.fillStyle = rimColor;
    ctx.beginPath();
    ctx.rect(cx - hw - topExtra - 1, by, bw + topExtra * 2 + 2, rimH);
    ctx.fill();

    // Bottom rim
    ctx.fillStyle = rimColor;
    ctx.beginPath();
    ctx.rect(cx - hw - botExtra - 1, by + bh - rimH, bw + botExtra * 2 + 2, rimH);
    ctx.fill();

    // Rim highlight stripe
    ctx.fillStyle = `rgba(255, 230, 120, 0.38)`;
    ctx.beginPath();
    ctx.rect(cx - hw - topExtra, by + 1, bw + topExtra * 2, rimH * 0.35);
    ctx.fill();

    // ── 7. CORNER KNOBS ───────────────────────────────────────────────────
    const knobR = s * 0.1;
    const knobColor = 'rgba(210, 160, 50, 0.9)';
    [[cx - hw - topExtra, by + rimH * 0.5],
     [cx + hw + topExtra, by + rimH * 0.5],
     [cx - hw - botExtra, by + bh - rimH * 0.5],
     [cx + hw + botExtra, by + bh - rimH * 0.5]
    ].forEach(([kx, ky]) => {
      ctx.fillStyle = knobColor;
      ctx.beginPath();
      ctx.arc(kx, ky, knobR, 0, Math.PI * 2);
      ctx.fill();
    });

    // ── 8. CANDLE FLAME below bottom rim ─────────────────────────────────
    const fY      = by + bh + rimH + s * 0.15;
    const fFlick  = Math.sin(now * 13.0 + seedX) * 2.2;

    // Outer flame (orange-red)
    ctx.fillStyle = `rgba(255, 145, 20, ${0.88 * flicker})`;
    ctx.beginPath();
    ctx.moveTo(cx, fY + 7 + fFlick * 0.4);
    ctx.bezierCurveTo(cx + 5, fY + 2, cx + 5, fY - 4, cx,     fY - 9 - fFlick);
    ctx.bezierCurveTo(cx - 5, fY - 4, cx - 5, fY + 2, cx,     fY + 7 + fFlick * 0.4);
    ctx.fill();

    // Inner flame (white-yellow core)
    ctx.fillStyle = `rgba(255, 255, 200, ${0.95 * flick2})`;
    ctx.beginPath();
    ctx.ellipse(cx, fY - 2 - fFlick * 0.3, 2.5, 5 + fFlick * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── 9. RED TASSELS (tua rua đỏ, từ 4 góc và giữa) ────────────────────
    const tassels = [
      { dx: -(hw + botExtra - 2), len: s * 0.75 },
      { dx: 0,                    len: s * 0.95 },
      { dx:  (hw + botExtra - 2), len: s * 0.78 }
    ];
    const tasselY = by + bh - rimH * 0.5;
    tassels.forEach(t => {
      const tx = cx + t.dx;
      ctx.strokeStyle = `rgba(210, 35, 35, 0.72)`;
      ctx.lineWidth   = 1.4;
      ctx.beginPath();
      ctx.moveTo(tx, tasselY);
      ctx.lineTo(tx, tasselY + t.len);
      ctx.stroke();
      ctx.fillStyle = 'rgba(230, 50, 50, 0.68)';
      ctx.beginPath();
      ctx.ellipse(tx, tasselY + t.len + 3, 2.2, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // ── 10. SUSPENSION WIRE ───────────────────────────────────────────────
    ctx.strokeStyle = `rgba(170, 125, 35, 0.5)`;
    ctx.lineWidth   = 0.9;
    ctx.beginPath();
    ctx.moveTo(cx - hw * 0.5, by + rimH * 0.5);
    ctx.lineTo(cx, by - s * 0.55);
    ctx.moveTo(cx + hw * 0.5, by + rimH * 0.5);
    ctx.lineTo(cx, by - s * 0.55);
    ctx.stroke();

    // Top hook ring
    ctx.strokeStyle = `rgba(210, 165, 45, 0.75)`;
    ctx.lineWidth   = 1.2;
    ctx.beginPath();
    ctx.arc(cx, by - s * 0.55, s * 0.08, 0, Math.PI * 2);
    ctx.stroke();
  }

  // =========================================================================
  // DRAW: FIREFLIES (optimized)
  // =========================================================================
  drawFireflies() {
    const ctx = this.ctx;
    this.fireflies.forEach(f => {
      f.x += f.vx;
      f.y += f.vy;
      f.pulsePhase += f.pulseSpeed;

      // Pointer attract (desktop only)
      if (!this.isMobile && this.pointer.active) {
        const dx = this.pointer.x - f.x;
        const dy = this.pointer.y - f.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 170 && dist > 10) {
          f.x += (dx / dist) * 1.1;
          f.y += (dy / dist) * 1.1;
        }
      }

      if (f.x < -20) f.x = this.width  + 20;
      if (f.x > this.width  + 20) f.x = -20;
      if (f.y < -20) f.y = this.height + 20;
      if (f.y > this.height + 20) f.y = -20;

      const b = 0.5 + 0.5 * Math.sin(f.pulsePhase);
      if (b < 0.06) return;

      const glowR = f.size * 3.2;
      const grad  = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, glowR);
      grad.addColorStop(0, f.color);
      grad.addColorStop(0.35, f.color === '#ffdd80'
        ? 'rgba(255,221,128,0.38)' : 'rgba(142,227,239,0.38)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle   = grad;
      ctx.globalAlpha = b * 0.85;
      ctx.beginPath();
      ctx.arc(f.x, f.y, glowR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle   = '#ffffff';
      ctx.globalAlpha = b;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size * 0.45, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  // =========================================================================
  // DRAW: SPARKLES
  // =========================================================================
  drawSparkles() {
    const ctx = this.ctx;
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const sp = this.sparkles[i];
      sp.x    += sp.vx;
      sp.y    += sp.vy;
      sp.vy   += sp.gravity;
      sp.alpha -= sp.decay;
      if (sp.alpha <= 0) { this.sparkles.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = sp.alpha;
      ctx.fillStyle   = sp.color;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // =========================================================================
  // DRAW: BLOSSOM BURST
  // =========================================================================
  drawBlossomBursts() {
    const ctx = this.ctx;
    for (let i = this.blossomBursts.length - 1; i >= 0; i--) {
      const b = this.blossomBursts[i];
      b.age++;
      b.driftPhase += b.driftSpeed;

      if (b.phase === 'burst') {
        const ease = Math.max(0, 1 - b.age / b.burstDuration);
        b.x += b.vx * ease;
        b.y += b.vy * ease + b.gravity;
        b.angle += b.angularSpeed;
        if (b.age >= b.burstDuration) {
          b.phase       = 'drift';
          b.vx          = (Math.random() - 0.5) * 0.75;
          b.vy          = Math.random() * 0.45 + 0.25;
          b.age         = 0;
          b.burstDuration = 100 + Math.random() * 70;
        }
      } else {
        b.x    += b.vx + Math.sin(b.driftPhase) * b.driftAmount;
        b.y    += b.vy + b.gravity * b.age * 0.0015;
        b.angle += b.angularSpeed * 0.38;
        b.alpha = Math.max(0, 1 - b.age / b.burstDuration);
        if (b.alpha <= 0 || b.y > this.height + 50) { this.blossomBursts.splice(i, 1); continue; }
      }

      ctx.save();
      ctx.globalAlpha = b.alpha;
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle);
      if (b.isCherryBlossom) {
        this._drawCherryBlossom(b.color, b.size);
      } else {
        this._drawSinglePetal(b.color, b.size);
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  drawBokehParticles() {
    const ctx = this.ctx;
    for (let i = this.bokehParticles.length - 1; i >= 0; i--) {
      const bk = this.bokehParticles[i];
      bk.x  += bk.vx;
      bk.y  += bk.vy;
      bk.vy += bk.gravity;
      bk.alpha -= bk.decay;
      if (bk.alpha <= 0) { this.bokehParticles.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = bk.alpha;
      const grad = ctx.createRadialGradient(bk.x, bk.y, 0, bk.x, bk.y, bk.size);
      grad.addColorStop(0, bk.color === '#ffd700'
        ? 'rgba(255,215,0,0.88)' : 'rgba(255,179,198,0.82)');
      grad.addColorStop(0.5, bk.color === '#ffd700'
        ? 'rgba(255,200,0,0.30)' : 'rgba(255,150,180,0.25)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bk.x, bk.y, bk.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // =========================================================================
  // ANIMATE — Smooth 60 FPS RAF Loop with Mobile Pause/Resume
  // =========================================================================
  pause() {
    this.isPaused = true;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.animate();
    }
  }

  animate() {
    if (this.isPaused) return;

    this._drawBackground();
    this.drawStars();
    this.drawMoon();
    this.drawClouds();
    this.drawRipples();
    this.drawHoaDangs();
    this.drawFallingPetals();
    this.drawFireflies();
    this.drawBokehParticles();
    this.drawBlossomBursts();
    this.drawSparkles();

    this.rafId = requestAnimationFrame(() => this.animate());
  }
}
