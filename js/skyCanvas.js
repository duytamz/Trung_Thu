/**
 * SkyCanvas Engine - Bầu trời trăng sao 3D, đom đóm tương tác, mưa cánh hoa và thả Hoa Đăng
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
    this.hoaDangs = []; // Floating Lotus Lanterns (Hoa Đăng)
    this.ripples = [];  // Water ripples at tap position
    this.fallingPetals = []; // Falling flower petals
    this.sparkles = [];
    this.clouds = [];
    
    this.pointer = { x: -1000, y: -1000, active: false };
    
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

  createFallingPetals() {
    this.fallingPetals = [];
    const count = Math.min(Math.floor(this.width / 40), 30);
    const petalColors = ['#ff758c', '#ffa8ba', '#ffd2db', '#ffdd59', '#fff0f3'];

    for (let i = 0; i < count; i++) {
      this.fallingPetals.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height - 50,
        size: Math.random() * 8 + 6,
        vx: Math.random() * 1.2 - 0.6,
        vy: Math.random() * 1.0 + 0.8,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.04,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        opacity: Math.random() * 0.5 + 0.4
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

  createBackgroundHoaDangs() {
    for (let i = 0; i < 6; i++) {
      this.hoaDangs.push({
        x: Math.random() * this.width,
        y: this.height + Math.random() * 150,
        speed: Math.random() * 0.4 + 0.3,
        swaySpeed: Math.random() * 0.02 + 0.015,
        swayAngle: Math.random() * Math.PI * 2,
        swayAmount: Math.random() * 0.6 + 0.4,
        size: Math.random() * 10 + 18,
        opacity: Math.random() * 0.35 + 0.4,
        text: '',
        isLotus: true
      });
    }
  }

  // Release a new Lotus Flower Lantern (Hoa Đăng) at tap position
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

    // Create the floating Lotus Flower Lantern
    this.hoaDangs.push({
      x,
      y,
      speed: Math.random() * 0.5 + 0.8,
      swaySpeed: 0.025,
      swayAngle: Math.random() * Math.PI,
      swayAmount: 0.8,
      size: 26,
      opacity: 0.95,
      text: customWish,
      glow: true,
      isLotus: true
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

  drawFallingPetals() {
    this.fallingPetals.forEach(p => {
      p.x += p.vx + Math.sin(p.angle) * 0.5;
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
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.opacity;

      // Petal shape
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
    this.ctx.globalAlpha = 1;
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

  // Draw Gorgeous Floating Lotus Flower Lantern (Hoa Đăng)
  drawHoaDangs() {
    for (let i = this.hoaDangs.length - 1; i >= 0; i--) {
      const l = this.hoaDangs[i];
      l.y -= l.speed;
      l.swayAngle += l.swaySpeed;
      const curX = l.x + Math.sin(l.swayAngle) * l.swayAmount * 14;

      if (l.y < -100) {
        if (!l.text) {
          l.y = this.height + 40;
          l.x = Math.random() * this.width;
        } else {
          this.hoaDangs.splice(i, 1);
          continue;
        }
      }

      this.ctx.save();
      this.ctx.globalAlpha = l.opacity;

      // 1. Warm Candle Glow Aura
      const auraGrad = this.ctx.createRadialGradient(curX, l.y, l.size * 0.2, curX, l.y, l.size * 2.2);
      auraGrad.addColorStop(0, 'rgba(255, 183, 3, 0.55)');
      auraGrad.addColorStop(0.5, 'rgba(255, 107, 139, 0.25)');
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = auraGrad;
      this.ctx.beginPath();
      this.ctx.arc(curX, l.y, l.size * 2.2, 0, Math.PI * 2);
      this.ctx.fill();

      // 2. Lotus Base & Petals
      const s = l.size;
      
      // Bottom green leaf pad
      this.ctx.fillStyle = '#2ed573';
      this.ctx.beginPath();
      this.ctx.ellipse(curX, l.y + s * 0.45, s * 0.9, s * 0.3, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Outer Pink Petals
      this.ctx.fillStyle = '#ff758c';
      this.drawPetal(curX - s * 0.6, l.y + s * 0.2, s * 0.4, s * 0.7, -0.4);
      this.drawPetal(curX + s * 0.6, l.y + s * 0.2, s * 0.4, s * 0.7, 0.4);

      // Inner Golden Lotus Petals
      this.ctx.fillStyle = '#ffd32a';
      this.drawPetal(curX - s * 0.3, l.y + s * 0.25, s * 0.35, s * 0.65, -0.2);
      this.drawPetal(curX + s * 0.3, l.y + s * 0.25, s * 0.35, s * 0.65, 0.2);
      this.drawPetal(curX, l.y + s * 0.3, s * 0.4, s * 0.7, 0);

      // 3. Glowing Candle in Center
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.roundRect(curX - 2.5, l.y - s * 0.15, 5, s * 0.4, 2);
      this.ctx.fill();

      // Candle Flame (Flickering)
      const flicker = (Math.sin(Date.now() * 0.01 + l.x) * 1.5);
      this.ctx.fillStyle = '#ff9f1a';
      this.ctx.shadowColor = '#ffeaa7';
      this.ctx.shadowBlur = 12;
      this.ctx.beginPath();
      this.ctx.ellipse(curX, l.y - s * 0.3 + flicker * 0.5, 4, 7 + flicker, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Bright white flame core
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.ellipse(curX, l.y - s * 0.25, 2, 3.5, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // 4. Custom Wish Text if present
      if (l.text) {
        this.ctx.font = 'bold 13px Quicksand, sans-serif';
        this.ctx.fillStyle = '#fff7d1';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = '#ff6b8b';
        this.ctx.shadowBlur = 10;
        this.ctx.fillText(l.text, curX, l.y - s * 0.7);
      }

      this.ctx.restore();
    }
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

  animate() {
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
    this.drawSparkles();

    requestAnimationFrame(() => this.animate());
  }
}
