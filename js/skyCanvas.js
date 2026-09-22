/**
 * SkyCanvas Engine - Bầu trời trăng sao 3D, đom đóm tương tác, mưa cánh hoa và thả Hoa Đăng
 * v2.0 — Nâng cấp hoa đăng đèn trời Á Đông + hiệu ứng Tung Hoa Blossom Burst
 */
export class SkyCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    
    this.stars = [];
    this.fireflies = [];
    this.hoaDangs = []; // Floating Sky Lanterns (Hoa Đăng / Đèn Trời)
    this.ripples = [];  // Water ripples at tap position
    this.fallingPetals = []; // Falling flower petals
    this.sparkles = [];
    this.clouds = [];
    this.blossomBursts = []; // Full-screen blossom burst particles
    this.bokehParticles = []; // Golden bokeh for blossom burst
    
    this.pointer = { x: -1000, y: -1000, active: false };
    this._time = 0;
    
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Pointer tracking
    window.addEventListener('pointermove', (e) => {
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
      this.pointer.active = true;
    });
    
    window.addEventListener('pointerleave', () => {
      this.pointer.active = false;
    });
    
    this.createStars();
    this.createFireflies();
    this.createClouds();
    this.createFallingPetals();
    this.createBackgroundHoaDangs();
    
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.pixelRatio;
    this.canvas.height = this.height * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }

  createStars() {
    this.stars = [];
    const starCount = Math.floor((this.width * this.height) / 5000);
    const colors = ['#ffffff', '#fff5cc', '#ffeaa7', '#dff9fb', '#fd79a8'];
    
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.88,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  createFireflies() {
    this.fireflies = [];
    const count = Math.min(Math.floor(this.width / 35), 45);
    
    for (let i = 0; i < count; i++) {
      this.fireflies.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2.2 + 1.2,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.3 ? '#ffdd80' : '#8ee3ef'
      });
    }
  }

  // =========================================================================
  // FALLING PETALS — Nâng cấp: 50 petals, thêm dạng cherry blossom 5 cánh
  // =========================================================================
  createFallingPetals() {
    this.fallingPetals = [];
    const count = Math.min(Math.floor(this.width / 28), 50);
    const petalColors = [
      '#ff758c', '#ffa8ba', '#ffd2db', '#ffdd59', '#fff0f3',
      '#ffb3c6', '#ff6b9d', '#ffc2d4', '#fffde7', '#ff9fb2'
    ];

    for (let i = 0; i < count; i++) {
      const isCherryType = Math.random() > 0.5; // cherry blossom (5 petals) vs single petal
      this.fallingPetals.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height - 50,
        size: isCherryType ? Math.random() * 6 + 5 : Math.random() * 10 + 6,
        vx: Math.random() * 1.4 - 0.7,
        vy: Math.random() * 0.9 + 0.55,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.05,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.025 + 0.01,
        driftAmount: Math.random() * 1.2 + 0.5,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        opacity: Math.random() * 0.55 + 0.4,
        isCherryType
      });
    }
  }

  createClouds() {
    this.clouds = [
      { x: this.width * 0.7, y: 80, speed: 0.15, width: 220, height: 45, opacity: 0.18 },
      { x: this.width * 0.5, y: 120, speed: 0.1, width: 280, height: 55, opacity: 0.14 },
      { x: this.width * 0.85, y: 160, speed: 0.18, width: 200, height: 40, opacity: 0.16 }
    ];
  }

  // =========================================================================
  // HOA ĐĂNG — Background ambient lanterns với depth-of-field
  // =========================================================================
  createBackgroundHoaDangs() {
    for (let i = 0; i < 8; i++) {
      const z = Math.random(); // 0 = xa, 1 = gần
      this.hoaDangs.push({
        x: Math.random() * this.width,
        y: this.height + Math.random() * 200,
        speed: 0.25 + z * 0.55,
        swaySpeed: Math.random() * 0.018 + 0.012,
        swayAngle: Math.random() * Math.PI * 2,
        swayAmount: 0.5 + z * 0.5,
        size: 12 + z * 22,        // xa → nhỏ, gần → lớn
        opacity: 0.28 + z * 0.52, // xa → mờ, gần → rõ
        blur: (1 - z) * 3,        // xa → blur, gần → sắc
        z,
        text: '',
        isBackground: true
      });
    }
  }

  // Release a new Sky Lantern (Hoa Đăng) at position — tương tác người dùng
  releaseHoaDang(x, y, customWish = '') {
    // Water ripple at click position
    this.ripples.push({
      x, y,
      radius: 5,
      maxRadius: 65,
      opacity: 0.85,
      speed: 1.8
    });

    // Sparkle burst
    this.createSparkleBurst(x, y, 20);

    // Create the floating Sky Lantern
    this.hoaDangs.push({
      x,
      y,
      speed: Math.random() * 0.5 + 0.9,
      swaySpeed: 0.022,
      swayAngle: Math.random() * Math.PI,
      swayAmount: 0.9,
      size: 30,
      opacity: 1,
      blur: 0,
      z: 1,
      text: customWish,
      glow: true,
      isBackground: false,
      birthTime: Date.now()
    });
  }

  createSparkleBurst(x, y, count = 20) {
    const colors = ['#fff2b2', '#ffdd80', '#ff6b8b', '#ffa8ba', '#ffffff'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      this.sparkles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1.5,
        alpha: 1,
        decay: Math.random() * 0.025 + 0.015,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.06
      });
    }
  }

  // =========================================================================
  // BLOSSOM BURST — Hiệu ứng tung hoa full-screen (triggered khi click lồng đèn)
  // =========================================================================
  triggerBlossomBurst(originX, originY) {
    const cx = originX ?? this.width * 0.5;
    const cy = originY ?? this.height * 0.45;
    const burstColors = [
      '#ffb3c6', '#ff758c', '#ffd2db', '#ff4d88',
      '#ffe0ec', '#ffaacc', '#ffffff', '#fff5f7',
      '#ffc2d4', '#ffa0be', '#ffe066', '#ffd700'
    ];

    // --- 1. Blossom zoom-out burst particles ---
    const count = window.innerWidth < 600 ? 38 : 58;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 3;
      const size = Math.random() * 32 + 14;
      const color = burstColors[Math.floor(Math.random() * burstColors.length)];
      const isCherryBlossom = Math.random() > 0.45;

      this.blossomBursts.push({
        x: cx + (Math.random() - 0.5) * 60,
        y: cy + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 2,
        size,
        maxSize: size,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.1,
        color,
        alpha: 1,
        phase: 'burst',       // burst → drift → fade
        age: 0,
        burstDuration: 40 + Math.random() * 20,
        gravity: 0.08 + Math.random() * 0.05,
        isCherryBlossom,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.03 + 0.015,
        driftAmount: Math.random() * 1.8 + 0.8
      });
    }

    // --- 2. Golden bokeh circles ---
    const bokehCount = window.innerWidth < 600 ? 18 : 30;
    for (let i = 0; i < bokehCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1.5;
      this.bokehParticles.push({
        x: cx + (Math.random() - 0.5) * 100,
        y: cy + (Math.random() - 0.5) * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: Math.random() * 18 + 6,
        alpha: Math.random() * 0.6 + 0.25,
        decay: Math.random() * 0.008 + 0.004,
        color: Math.random() > 0.4 ? '#ffd700' : '#ffb3c6',
        gravity: 0.02
      });
    }

    // --- 3. Extra sparkle burst ---
    this.createSparkleBurst(cx, cy, 45);
  }

  // =========================================================================
  // DRAW MOON
  // =========================================================================
  drawMoon() {
    const moonX = this.width > 768 ? this.width * 0.82 : this.width * 0.85;
    const moonY = this.width > 768 ? 110 : 85;
    const moonR = this.width > 768 ? 44 : 32;

    // Multilayer Outer Glow
    const glow = this.ctx.createRadialGradient(moonX, moonY, moonR * 0.6, moonX, moonY, moonR * 3.5);
    glow.addColorStop(0, 'rgba(255, 238, 179, 0.45)');
    glow.addColorStop(0.3, 'rgba(255, 221, 128, 0.25)');
    glow.addColorStop(0.7, 'rgba(255, 184, 108, 0.08)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    this.ctx.fillStyle = glow;
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, moonR * 3.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Moon Disc
    const moonGrad = this.ctx.createRadialGradient(moonX - moonR * 0.25, moonY - moonR * 0.25, moonR * 0.1, moonX, moonY, moonR);
    moonGrad.addColorStop(0, '#ffffff');
    moonGrad.addColorStop(0.4, '#fff9e6');
    moonGrad.addColorStop(0.85, '#ffeaa7');
    moonGrad.addColorStop(1, '#fad390');

    this.ctx.fillStyle = moonGrad;
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    this.ctx.fill();

    // Subtle Maria / Craters
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    this.ctx.clip();
    
    this.ctx.fillStyle = 'rgba(230, 190, 120, 0.18)';
    this.ctx.beginPath();
    this.ctx.arc(moonX + moonR * 0.2, moonY - moonR * 0.15, moonR * 0.35, 0, Math.PI * 2);
    this.ctx.arc(moonX - moonR * 0.3, moonY + moonR * 0.25, moonR * 0.28, 0, Math.PI * 2);
    this.ctx.arc(moonX + moonR * 0.1, moonY + moonR * 0.35, moonR * 0.22, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawClouds() {
    this.clouds.forEach(c => {
      c.x -= c.speed;
      if (c.x + c.width < 0) c.x = this.width + 50;
      
      this.ctx.save();
      this.ctx.fillStyle = 'rgba(255, 245, 225, 0.08)';
      this.ctx.globalAlpha = c.opacity;
      this.ctx.beginPath();
      this.ctx.ellipse(c.x, c.y, c.width * 0.5, c.height * 0.5, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  drawStars() {
    this.stars.forEach(s => {
      s.phase += s.twinkleSpeed;
      const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.phase));
      
      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = Math.max(0.1, currentAlpha);
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1;
  }

  // =========================================================================
  // FALLING PETALS — Nâng cấp với cherry blossom 5-cánh + sin drift
  // =========================================================================
  drawFallingPetals() {
    this.fallingPetals.forEach(p => {
      p.driftPhase += p.driftSpeed;
      p.x += p.vx + Math.sin(p.driftPhase) * p.driftAmount;
      p.y += p.vy;
      p.angle += p.angularSpeed;

      if (p.y > this.height + 20) {
        p.y = -20;
        p.x = Math.random() * this.width;
      }
      if (p.x < -20) p.x = this.width + 20;
      if (p.x > this.width + 20) p.x = -20;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angle);
      this.ctx.globalAlpha = p.opacity;

      if (p.isCherryType) {
        // Cherry blossom: 5 petals around center
        this._drawCherryBlossom(p.color, p.size);
      } else {
        // Single elongated petal with slight heart shape
        this._drawSinglePetal(p.color, p.size);
      }

      this.ctx.restore();
    });
    this.ctx.globalAlpha = 1;
  }

  _drawCherryBlossom(color, size) {
    const ctx = this.ctx;
    const petalCount = 5;
    ctx.fillStyle = color;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -size * 0.6, size * 0.32, size * 0.58, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // Center dot
    ctx.fillStyle = '#ffd32a';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }

  _drawSinglePetal(color, size) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.beginPath();
    // Heart-like petal using two bezier arcs
    ctx.moveTo(0, size * 0.5);
    ctx.bezierCurveTo(size * 0.5, size * 0.2, size * 0.55, -size * 0.3, 0, -size * 0.5);
    ctx.bezierCurveTo(-size * 0.55, -size * 0.3, -size * 0.5, size * 0.2, 0, size * 0.5);
    ctx.fill();
  }

  drawRipples() {
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += r.speed;
      r.opacity -= 0.02;

      if (r.opacity <= 0 || r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.strokeStyle = '#ffd770';
      this.ctx.lineWidth = 1.8;
      this.ctx.globalAlpha = r.opacity;
      this.ctx.shadowColor = '#ff758c';
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      this.ctx.ellipse(r.x, r.y, r.radius * 1.6, r.radius * 0.6, 0, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  // =========================================================================
  // HOA ĐĂNG — Redesign: đèn trời Á Đông dạng túi giấy + depth-of-field
  // =========================================================================
  drawHoaDangs() {
    // Sort by z so farther lanterns drawn first (painter's algorithm)
    this.hoaDangs.sort((a, b) => (a.z ?? 0.5) - (b.z ?? 0.5));

    for (let i = this.hoaDangs.length - 1; i >= 0; i--) {
      const l = this.hoaDangs[i];
      l.y -= l.speed;
      l.swayAngle += l.swaySpeed;
      const curX = l.x + Math.sin(l.swayAngle) * l.swayAmount * 12;

      if (l.y < -120) {
        if (l.isBackground) {
          l.y = this.height + 60;
          l.x = Math.random() * this.width;
        } else {
          this.hoaDangs.splice(i, 1);
          continue;
        }
      }

      this.ctx.save();

      // Depth-of-field blur for background lanterns
      if (l.blur > 0.5) {
        this.ctx.filter = `blur(${l.blur.toFixed(1)}px)`;
      }

      this.ctx.globalAlpha = l.opacity;

      this._drawSkyLantern(curX, l.y, l.size, l);

      // Custom wish text
      if (l.text) {
        this.ctx.filter = 'none';
        this.ctx.font = 'bold 13px Quicksand, sans-serif';
        this.ctx.fillStyle = '#fff7d1';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = '#ff6b8b';
        this.ctx.shadowBlur = 10;
        this.ctx.fillText(l.text, curX, l.y - l.size * 1.8);
      }

      this.ctx.restore();
    }
  }

  /**
   * Vẽ đèn trời Á Đông (Sky Lantern / Hoa Đăng) — dạng túi giấy amber phát sáng
   * @param {number} cx - center x
   * @param {number} cy - center y (top rim của đèn)
   * @param {number} s  - size
   * @param {object} l  - lantern data
   */
  _drawSkyLantern(cx, cy, s, l) {
    const ctx = this.ctx;
    const now = Date.now() * 0.001;
    const flicker = Math.sin(now * 7.3 + l.x * 0.01) * 0.12 + 0.88;
    const flicker2 = Math.sin(now * 11.7 + l.x * 0.03) * 0.08 + 0.92;

    // --- 1. OUTER GLOW AURA (4-layer warm halo) ---
    const aura = ctx.createRadialGradient(cx, cy + s * 0.5, s * 0.1, cx, cy + s * 0.5, s * 3.2);
    aura.addColorStop(0,   `rgba(255, 255, 200, ${0.55 * flicker})`);
    aura.addColorStop(0.2, `rgba(255, 200, 80,  ${0.38 * flicker})`);
    aura.addColorStop(0.5, `rgba(255, 140, 40,  ${0.18 * flicker})`);
    aura.addColorStop(0.8, `rgba(255, 100, 80,  0.07)`);
    aura.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, cy + s * 0.5, s * 3.2, 0, Math.PI * 2);
    ctx.fill();

    // --- 2. LANTERN BODY (túi giấy mờ hình trapezoid) ---
    // Top opening (nhỏ hơn), bottom bulge (rộng hơn), kéo dài xuống
    const topW  = s * 0.55;
    const midW  = s * 1.0;
    const botW  = s * 0.72;
    const h     = s * 2.0;

    // Paper glow fill: gradient warm amber
    const bodyGrad = ctx.createLinearGradient(cx - midW, cy, cx + midW, cy + h);
    bodyGrad.addColorStop(0,    `rgba(255, 255, 210, ${0.85 * flicker2})`);
    bodyGrad.addColorStop(0.15, `rgba(255, 230, 140, ${0.82 * flicker})`);
    bodyGrad.addColorStop(0.45, `rgba(255, 185, 60,  ${0.78 * flicker})`);
    bodyGrad.addColorStop(0.75, `rgba(240, 140, 30,  0.72)`);
    bodyGrad.addColorStop(1,    `rgba(200, 100, 20,  0.60)`);

    ctx.beginPath();
    // Top rim curve
    ctx.moveTo(cx - topW, cy + s * 0.08);
    ctx.bezierCurveTo(cx - topW * 0.5, cy - s * 0.06, cx + topW * 0.5, cy - s * 0.06, cx + topW, cy + s * 0.08);
    // Right side — bulge out at mid
    ctx.bezierCurveTo(cx + midW * 1.08, cy + h * 0.3, cx + midW * 1.04, cy + h * 0.55, cx + botW, cy + h);
    // Bottom curve
    ctx.bezierCurveTo(cx + botW * 0.4, cy + h + s * 0.12, cx - botW * 0.4, cy + h + s * 0.12, cx - botW, cy + h);
    // Left side
    ctx.bezierCurveTo(cx - midW * 1.04, cy + h * 0.55, cx - midW * 1.08, cy + h * 0.3, cx - topW, cy + s * 0.08);
    ctx.closePath();

    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // Paper texture lines (horizontal ribs)
    ctx.save();
    ctx.clip(); // clip to body shape (re-draw path for clip)
    ctx.beginPath();
    ctx.moveTo(cx - topW, cy + s * 0.08);
    ctx.bezierCurveTo(cx - topW * 0.5, cy - s * 0.06, cx + topW * 0.5, cy - s * 0.06, cx + topW, cy + s * 0.08);
    ctx.bezierCurveTo(cx + midW * 1.08, cy + h * 0.3, cx + midW * 1.04, cy + h * 0.55, cx + botW, cy + h);
    ctx.bezierCurveTo(cx + botW * 0.4, cy + h + s * 0.12, cx - botW * 0.4, cy + h + s * 0.12, cx - botW, cy + h);
    ctx.bezierCurveTo(cx - midW * 1.04, cy + h * 0.55, cx - midW * 1.08, cy + h * 0.3, cx - topW, cy + s * 0.08);
    ctx.closePath();
    ctx.clip();

    ctx.strokeStyle = 'rgba(255, 160, 40, 0.22)';
    ctx.lineWidth = 0.7;
    const ribCount = 5;
    for (let r = 1; r <= ribCount; r++) {
      const t = r / (ribCount + 1);
      const ribY = cy + h * t;
      const ribW = topW + (midW - topW) * Math.sin(t * Math.PI) * 1.1;
      ctx.beginPath();
      ctx.moveTo(cx - ribW, ribY);
      ctx.quadraticCurveTo(cx, ribY + s * 0.05, cx + ribW, ribY);
      ctx.stroke();
    }
    ctx.restore();

    // --- 3. TOP RIM (wire ring) ---
    ctx.strokeStyle = `rgba(180, 130, 40, 0.85)`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy + s * 0.08, topW, s * 0.1, 0, 0, Math.PI * 2);
    ctx.stroke();

    // --- 4. INNER CANDLE GLOW (warm light inside paper) ---
    const innerGlow = ctx.createRadialGradient(cx, cy + h * 0.55, 0, cx, cy + h * 0.45, s * 1.3);
    innerGlow.addColorStop(0,   `rgba(255, 255, 180, ${0.7 * flicker})`);
    innerGlow.addColorStop(0.35,`rgba(255, 220, 80,  ${0.4 * flicker})`);
    innerGlow.addColorStop(0.7, `rgba(255, 160, 30,  0.15)`);
    innerGlow.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = innerGlow;
    ctx.beginPath();
    ctx.ellipse(cx, cy + h * 0.5, s * 0.9, s * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // --- 5. BOTTOM OPENING + CANDLE FLAME ---
    // Bottom band
    ctx.fillStyle = `rgba(160, 90, 20, 0.55)`;
    ctx.beginPath();
    ctx.ellipse(cx, cy + h, botW, s * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flame below the bottom opening
    const fY = cy + h + s * 0.25;
    const fFlicker = Math.sin(now * 13.1 + l.x) * 2.5;
    ctx.shadowColor = '#ffeaa7';
    ctx.shadowBlur = 14;

    // Outer flame (orange)
    ctx.fillStyle = `rgba(255, 150, 20, ${0.9 * flicker})`;
    ctx.beginPath();
    ctx.moveTo(cx, fY + 8 + fFlicker * 0.5);
    ctx.bezierCurveTo(cx + 5, fY + 4, cx + 6, fY - 4, cx, fY - 10 - fFlicker);
    ctx.bezierCurveTo(cx - 6, fY - 4, cx - 5, fY + 4, cx, fY + 8 + fFlicker * 0.5);
    ctx.fill();

    // Inner flame (white-yellow)
    ctx.fillStyle = `rgba(255, 255, 200, ${0.95 * flicker2})`;
    ctx.beginPath();
    ctx.ellipse(cx, fY - 3 - fFlicker * 0.4, 3, 6 + fFlicker * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // --- 6. RED TASSELS (tua rua đỏ) ---
    const tassels = [
      { dx: -s * 0.35, len: s * 0.7 },
      { dx: 0,         len: s * 0.85 },
      { dx:  s * 0.35, len: s * 0.72 }
    ];
    tassels.forEach(t => {
      const tx = cx + t.dx;
      const ty = cy + h + s * 0.18;
      // Tassel cord
      ctx.strokeStyle = `rgba(220, 40, 40, 0.75)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx, ty + t.len);
      ctx.stroke();
      // Tassel tip knob
      ctx.fillStyle = 'rgba(240, 60, 60, 0.7)';
      ctx.beginPath();
      ctx.ellipse(tx, ty + t.len + 3, 2.5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // --- 7. SUSPENSION STRING (dây treo) ---
    ctx.strokeStyle = `rgba(180, 130, 40, 0.55)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy + s * 0.08);
    ctx.lineTo(cx, cy - s * 0.6);
    ctx.stroke();
  }

  drawPetal(x, y, w, h, angle) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(angle);
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawFireflies() {
    this.fireflies.forEach(f => {
      f.x += f.vx;
      f.y += f.vy;
      f.pulsePhase += f.pulseSpeed;

      if (this.pointer.active) {
        const dx = this.pointer.x - f.x;
        const dy = this.pointer.y - f.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180 && dist > 10) {
          f.x += (dx / dist) * 1.2;
          f.y += (dy / dist) * 1.2;
        }
      }

      if (f.x < -20) f.x = this.width + 20;
      if (f.x > this.width + 20) f.x = -20;
      if (f.y < -20) f.y = this.height + 20;
      if (f.y > this.height + 20) f.y = -20;

      const brightness = 0.5 + 0.5 * Math.sin(f.pulsePhase);
      if (brightness < 0.05) return;

      const glowR = f.size * 3.5;
      const grad = this.ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, glowR);
      grad.addColorStop(0, f.color);
      grad.addColorStop(0.3, f.color === '#ffdd80' ? 'rgba(255, 221, 128, 0.4)' : 'rgba(142, 227, 239, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.ctx.fillStyle = grad;
      this.ctx.globalAlpha = brightness * 0.9;
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, glowR, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.globalAlpha = brightness;
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.size * 0.5, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1;
  }

  drawSparkles() {
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const sp = this.sparkles[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vy += sp.gravity;
      sp.alpha -= sp.decay;

      if (sp.alpha <= 0) {
        this.sparkles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = sp.alpha;
      this.ctx.fillStyle = sp.color;
      this.ctx.shadowColor = sp.color;
      this.ctx.shadowBlur = 6;
      this.ctx.beginPath();
      this.ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  // =========================================================================
  // BLOSSOM BURST DRAW — Hiệu ứng cánh hoa tung ra full screen
  // =========================================================================
  drawBlossomBursts() {
    for (let i = this.blossomBursts.length - 1; i >= 0; i--) {
      const b = this.blossomBursts[i];
      b.age++;
      b.driftPhase += b.driftSpeed;

      if (b.phase === 'burst') {
        // Easing deceleration
        const ease = 1 - b.age / b.burstDuration;
        b.x += b.vx * ease;
        b.y += b.vy * ease + b.gravity;
        b.angle += b.angularSpeed;

        if (b.age >= b.burstDuration) {
          b.phase = 'drift';
          b.vx = (Math.random() - 0.5) * 0.8;
          b.vy = Math.random() * 0.5 + 0.3;
          b.age = 0;
          b.burstDuration = 120 + Math.random() * 80;
        }
      } else {
        // Drift + gentle fall
        b.x += b.vx + Math.sin(b.driftPhase) * b.driftAmount;
        b.y += b.vy + b.gravity * b.age * 0.002;
        b.angle += b.angularSpeed * 0.4;
        const fadeProgress = b.age / b.burstDuration;
        b.alpha = Math.max(0, 1 - fadeProgress);

        if (b.alpha <= 0 || b.y > this.height + 50) {
          this.blossomBursts.splice(i, 1);
          continue;
        }
      }

      this.ctx.save();
      this.ctx.globalAlpha = b.alpha;
      this.ctx.translate(b.x, b.y);
      this.ctx.rotate(b.angle);

      if (b.isCherryBlossom) {
        this._drawCherryBlossom(b.color, b.size);
      } else {
        this._drawSinglePetal(b.color, b.size);
      }

      this.ctx.restore();
    }
    this.ctx.globalAlpha = 1;
  }

  drawBokehParticles() {
    for (let i = this.bokehParticles.length - 1; i >= 0; i--) {
      const bk = this.bokehParticles[i];
      bk.x += bk.vx;
      bk.y += bk.vy;
      bk.vy += bk.gravity;
      bk.alpha -= bk.decay;

      if (bk.alpha <= 0) {
        this.bokehParticles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = bk.alpha;

      const grad = this.ctx.createRadialGradient(bk.x, bk.y, 0, bk.x, bk.y, bk.size);
      grad.addColorStop(0, bk.color === '#ffd700'
        ? 'rgba(255,215,0,0.9)'
        : 'rgba(255,179,198,0.85)');
      grad.addColorStop(0.5, bk.color === '#ffd700'
        ? 'rgba(255,200,0,0.35)'
        : 'rgba(255,150,180,0.3)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(bk.x, bk.y, bk.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  animate() {
    this._time++;

    const bgGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#060814');
    bgGrad.addColorStop(0.35, '#0b102c');
    bgGrad.addColorStop(0.7, '#13153c');
    bgGrad.addColorStop(1, '#1c1944');

    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

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

    requestAnimationFrame(() => this.animate());
  }
}
