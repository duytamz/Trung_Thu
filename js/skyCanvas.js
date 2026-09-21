/**
 * SkyCanvas Engine - Bầu trời trăng sao 3D, đom đóm tương tác, mây trôi và thả đèn trời
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
    this.skyLanterns = [];
    this.sparkles = [];
    this.clouds = [];
    
    this.pointer = { x: -1000, y: -1000, active: false };
    
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Pointer listeners
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
    this.createBackgroundLanterns();
    
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
        y: Math.random() * this.height * 0.85,
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

  createClouds() {
    this.clouds = [
      { x: this.width * 0.7, y: 80, speed: 0.15, width: 220, height: 45, opacity: 0.18 },
      { x: this.width * 0.5, y: 120, speed: 0.1, width: 280, height: 55, opacity: 0.14 },
      { x: this.width * 0.85, y: 160, speed: 0.18, width: 200, height: 40, opacity: 0.16 }
    ];
  }

  createBackgroundLanterns() {
    for (let i = 0; i < 7; i++) {
      this.skyLanterns.push({
        x: Math.random() * this.width,
        y: this.height + Math.random() * 200,
        speed: Math.random() * 0.4 + 0.2,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayAngle: Math.random() * Math.PI * 2,
        swayAmount: Math.random() * 0.6 + 0.3,
        size: Math.random() * 12 + 10,
        opacity: Math.random() * 0.4 + 0.3,
        text: ''
      });
    }
  }

  releaseSkyLantern(customWish = '') {
    const startX = this.width * 0.5 + (Math.random() - 0.5) * 160;
    this.skyLanterns.push({
      x: startX,
      y: this.height + 40,
      speed: Math.random() * 0.6 + 0.7,
      swaySpeed: 0.025,
      swayAngle: 0,
      swayAmount: 0.8,
      size: 26,
      opacity: 0.95,
      text: customWish || 'Yêu em ❤️',
      glow: true
    });
    
    // Sparkle burst around the release
    this.createSparkleBurst(startX, this.height - 50, 25);
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

    // Subtle Maria / Craters on Moon
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
    this.ctx.fillStyle = 'rgba(255, 245, 225, 0.08)';
    this.clouds.forEach(c => {
      c.x -= c.speed;
      if (c.x + c.width < 0) c.x = this.width + 50;
      
      this.ctx.save();
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

  drawFireflies() {
    this.fireflies.forEach(f => {
      // Natural wandering
      f.x += f.vx;
      f.y += f.vy;
      f.pulsePhase += f.pulseSpeed;

      // Pointer interactive attraction
      if (this.pointer.active) {
        const dx = this.pointer.x - f.x;
        const dy = this.pointer.y - f.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180 && dist > 10) {
          f.x += (dx / dist) * 1.2;
          f.y += (dy / dist) * 1.2;
        }
      }

      // Screen wrap
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

      // Bright Core
      this.ctx.fillStyle = '#ffffff';
      this.ctx.globalAlpha = brightness;
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.size * 0.5, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1;
  }

  drawSkyLanterns() {
    for (let i = this.skyLanterns.length - 1; i >= 0; i--) {
      const l = this.skyLanterns[i];
      l.y -= l.speed;
      l.swayAngle += l.swaySpeed;
      const curX = l.x + Math.sin(l.swayAngle) * l.swayAmount * 15;

      if (l.y < -100) {
        if (!l.text) {
          l.y = this.height + 50;
          l.x = Math.random() * this.width;
        } else {
          this.skyLanterns.splice(i, 1);
          continue;
        }
      }

      this.ctx.save();
      this.ctx.globalAlpha = l.opacity;

      // Glow halo
      const glowGrad = this.ctx.createRadialGradient(curX, l.y, l.size * 0.2, curX, l.y, l.size * 2);
      glowGrad.addColorStop(0, 'rgba(255, 170, 50, 0.5)');
      glowGrad.addColorStop(0.6, 'rgba(255, 107, 139, 0.2)');
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      this.ctx.fillStyle = glowGrad;
      this.ctx.beginPath();
      this.ctx.arc(curX, l.y, l.size * 2, 0, Math.PI * 2);
      this.ctx.fill();

      // Lantern Body
      const bodyGrad = this.ctx.createLinearGradient(curX, l.y - l.size * 0.6, curX, l.y + l.size * 0.6);
      bodyGrad.addColorStop(0, '#ff9f43');
      bodyGrad.addColorStop(0.5, '#ffdd59');
      bodyGrad.addColorStop(1, '#ee5253');

      this.ctx.fillStyle = bodyGrad;
      this.ctx.beginPath();
      this.ctx.roundRect(curX - l.size * 0.5, l.y - l.size * 0.6, l.size, l.size * 1.2, 4);
      this.ctx.fill();

      // Light flame core
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(curX, l.y + l.size * 0.3, l.size * 0.2, 0, Math.PI * 2);
      this.ctx.fill();

      // Optional Custom Wish Text
      if (l.text) {
        this.ctx.font = '12px Quicksand, sans-serif';
        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = '#ff6b8b';
        this.ctx.shadowBlur = 8;
        this.ctx.fillText(l.text, curX, l.y - l.size * 0.8);
      }

      this.ctx.restore();
    }
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
    // Midnight background gradient
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
    this.drawSkyLanterns();
    this.drawFireflies();
    this.drawSparkles();

    requestAnimationFrame(() => this.animate());
  }
}
