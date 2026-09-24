/**
 * PhotoSphere Component v2.0 - Quả Cầu Kỷ Niệm 3D Cao Cấp
 * - 3 tầng ảnh phân bổ cân đối (Tiered Globe Ring), KHÔNG bị lật méo cạnh dẹt (knife-edge)
 * - Chiều sâu không gian 3D (Z-Depth Shading): Mặt trước sáng rõ rạng ngời, mặt sau mờ nhẹ huyền ảo
 * - Lõi ánh trăng (Lunar Core) & Vành đai tinh tú hoàng kim (Saturn Ring)
 * - Tối ưu 60 FPS trên điện thoại cấu hình yếu (Hardware Accelerated CSS 3D)
 */
export class PhotoSphere {
  constructor() {
    this.modal = document.getElementById('photo-sphere-modal');
    this.world = document.getElementById('sphere-3d-world');
    this.sparklesContainer = document.getElementById('sphere-sparkles');
    this.closeBtn = document.getElementById('sphere-close-btn');

    this.isOpen = false;
    this.animId = null;

    // Rotation angles
    this.rotY = 0;
    this.rotX = -8;
    this.autoSpinSpeed = 0.22;

    // Pointer drag physics
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.lastDeltaX = 0;
    this.lastDeltaY = 0;
    this.velY = 0.22;
    this.velX = 0;

    // Sweet captions for each photo
    const captions = [
      { text: 'Khoảnh khắc ngọt ngào ✨', tag: 'Ngọt ngào' },
      { text: 'Nụ cười tỏa nắng của em ❤️', tag: 'Nụ cười' },
      { text: 'Bên em mọi mùa trăng 🏮', tag: 'Mùa trăng' },
      { text: 'Ánh mắt dịu dàng 💕', tag: 'Dịu dàng' },
      { text: 'Mãi yêu em bé của anh 🌟', tag: 'Yêu thương' },
      { text: 'Tết Trung Thu đoàn viên 🥮', tag: 'Đoàn viên' },
      { text: 'Tay nắm chặt tay 🤝', tag: 'Bên nhau' },
      { text: 'Bình yên là khi có em 🌸', tag: 'Bình yên' },
      { text: 'Những ngày tháng hạnh phúc 💖', tag: 'Hạnh phúc' },
      { text: 'Chàng trai anh yêu nhất 💫', tag: 'Chàng trai' },
      { text: 'Kỷ niệm khó phai 🍃', tag: 'Kỷ niệm' },
      { text: 'Ấm áp mùa thu 🍂', tag: 'Ấm áp' },
      { text: 'Mãi không cách xa ❤️', tag: 'Mãi mãi' },
      { text: 'Trăng rằm soi bóng đôi ta 🌕', tag: 'Trăng rằm' },
      { text: 'Yêu thương đong đầy 💌', tag: 'Đong đầy' },
      { text: 'Nụ cười làm anh say đắm ✨', tag: 'Say đắm' },
      { text: 'Tình yêu mùa thu 🍁', tag: 'Mùa thu' },
      { text: 'Hạnh phúc giản đơn ☕', tag: 'Giản đơn' },
      { text: 'Chở che cho em 🛡️', tag: 'Chở che' },
      { text: 'Nguyện ước bên nhau trăm năm 💍', tag: 'Nguyện ước' }
    ];

    // Load 20 optimized album photos
    this.photos = [];
    for (let i = 1; i <= 20; i++) {
      this.photos.push({
        id: i,
        webp: `assets/images/album/thumb_${i}.webp`,
        jpg: `assets/images/album/thumb_${i}.jpg`,
        caption: captions[(i - 1) % captions.length].text,
        tag: captions[(i - 1) % captions.length].tag
      });
    }

    this.cardElements = [];
    this.init();
  }

  init() {
    this.buildSphere();
    this.buildSparkles();
    this.bindEvents();
  }

  /**
   * Phân bổ 20 bức ảnh thành 3 tầng hình cầu cân đối tuyệt mỹ
   * Tầng trên: 6 ảnh (Y = -72px, nghiêng nhẹ -12° về mắt người xem)
   * Tầng giữa: 8 ảnh (Y = 0px, thẳng đứng 0°)
   * Tầng dưới: 6 ảnh (Y = +72px, nghiêng nhẹ +12° về mắt người xem)
   */
  buildSphere() {
    if (!this.world) return;
    this.world.innerHTML = '';
    this.cardElements = [];

    const isMobile = window.innerWidth < 768;
    const radius = isMobile ? 150 : 225;
    const tierOffset = isMobile ? 54 : 76;

    // Define 3 tiers
    const tiers = [
      // Top Tier: 6 photos
      { count: 6, y: -tierOffset, pitch: -12, startAngle: 0 },
      // Middle Tier (Equator): 8 photos
      { count: 8, y: 0, pitch: 0, startAngle: 22.5 },
      // Bottom Tier: 6 photos
      { count: 6, y: tierOffset, pitch: 12, startAngle: 30 }
    ];

    let photoIndex = 0;

    tiers.forEach((tier) => {
      const angleStep = 360 / tier.count;

      for (let i = 0; i < tier.count; i++) {
        if (photoIndex >= this.photos.length) break;
        const photo = this.photos[photoIndex];
        const lonAngle = tier.startAngle + i * angleStep;

        const card = document.createElement('div');
        card.className = 'sphere-photo-card';

        // Set 3D spatial position on the sphere surface
        card.style.transform = `rotateY(${lonAngle}deg) translateY(${tier.y}px) translateZ(${radius}px) rotateX(${tier.pitch}deg)`;

        card.innerHTML = `
          <div class="sphere-card-inner">
            <picture>
              <source srcset="${photo.webp}" type="image/webp">
              <img class="sphere-card-img" 
                   src="${photo.jpg}" 
                   alt="${photo.caption}" 
                   loading="lazy" 
                   decoding="async"
                   onerror="this.src='assets/images/memory${(photoIndex % 3) + 1}.webp'" />
            </picture>
            <div class="sphere-card-badge">
              <span>❤️</span> ${photo.tag}
            </div>
            <div class="sphere-card-sparkle">✨</div>
          </div>
        `;

        // Store reference for real-time Z-depth calculations
        this.cardElements.push({
          el: card,
          inner: card.querySelector('.sphere-card-inner'),
          baseLon: lonAngle,
          photo
        });

        // Tap to view full picture
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          if (Math.abs(this.lastDeltaX) < 4 && Math.abs(this.lastDeltaY) < 4) {
            this.previewPhoto(photo);
          }
        });

        this.world.appendChild(card);
        photoIndex++;
      }
    });
  }

  buildSparkles() {
    if (!this.sparklesContainer) return;
    this.sparklesContainer.innerHTML = '';

    const sparkleCount = window.innerWidth < 768 ? 20 : 36;
    for (let i = 0; i < sparkleCount; i++) {
      const sp = document.createElement('div');
      sp.className = 'sphere-sparkle-dot';

      const size = Math.random() * 3.5 + 2;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 3.5;
      const duration = Math.random() * 2.2 + 1.8;

      sp.style.width = `${size}px`;
      sp.style.height = `${size}px`;
      sp.style.left = `${left}%`;
      sp.style.top = `${top}%`;
      sp.style.animationDelay = `${delay}s`;
      sp.style.animationDuration = `${duration}s`;

      this.sparklesContainer.appendChild(sp);
    }
  }

  bindEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    // Touch & Mouse Drag with Inertia Physics
    const stage = document.getElementById('sphere-stage');
    if (stage) {
      const onPointerDown = (e) => {
        this.isDragging = true;
        this.startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        this.startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        this.lastDeltaX = 0;
        this.lastDeltaY = 0;
        this.velY = 0;
        this.velX = 0;
      };

      const onPointerMove = (e) => {
        if (!this.isDragging) return;
        const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const y = e.clientY || (e.touches && e.touches[0].clientY) || 0;

        const deltaX = x - this.startX;
        const deltaY = y - this.startY;

        this.lastDeltaX = deltaX;
        this.lastDeltaY = deltaY;

        this.rotY += deltaX * 0.40;
        this.rotX = Math.max(-48, Math.min(48, this.rotX - deltaY * 0.28));

        this.velY = deltaX * 0.15;
        this.velX = -deltaY * 0.12;

        this.startX = x;
        this.startY = y;
      };

      const onPointerUp = () => {
        this.isDragging = false;
      };

      stage.addEventListener('mousedown', onPointerDown);
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);

      stage.addEventListener('touchstart', onPointerDown, { passive: true });
      window.addEventListener('touchmove', onPointerMove, { passive: true });
      window.addEventListener('touchend', onPointerUp);
    }

    window.addEventListener('resize', () => {
      if (this.isOpen) this.buildSphere();
    });
  }

  open() {
    if (!this.modal) return;
    this.isOpen = true;
    this.modal.classList.add('active');
    this.startLoop();
  }

  close() {
    if (!this.modal) return;
    this.isOpen = false;
    this.modal.classList.remove('active');
    this.stopLoop();

    const preview = document.getElementById('sphere-preview-lightbox');
    if (preview) preview.remove();
  }

  startLoop() {
    this.stopLoop();

    const render = () => {
      if (!this.isOpen) return;

      if (!this.isDragging) {
        // Natural gentle spin + inertia damping
        this.rotY += this.autoSpinSpeed + this.velY;
        this.rotX = Math.max(-48, Math.min(48, this.rotX + this.velX));

        this.velY *= 0.95;
        this.velX *= 0.95;
        if (Math.abs(this.velY) < 0.01) this.velY = 0;
        if (Math.abs(this.velX) < 0.01) this.velX = 0;
      }

      // Rotate entire 3D world
      if (this.world) {
        this.world.style.transform = `rotateX(${this.rotX}deg) rotateY(${this.rotY}deg)`;
      }

      // ── Real-time Z-depth shading for Depth of Field (DoF) ──────────────
      // Updates opacity, brightness & z-index so front cards shine and back cards soften
      const currentRotYRad = (this.rotY * Math.PI) / 180;
      const count = this.cardElements.length;

      for (let i = 0; i < count; i++) {
        const item = this.cardElements[i];
        const cardAngleRad = (item.baseLon * Math.PI) / 180 + currentRotYRad;
        const normZ = Math.cos(cardAngleRad); // +1 (front) to -1 (back)

        // Front cards pop with 100% opacity, back cards fade softly
        const opacity = 0.42 + 0.58 * Math.max(0, (normZ + 0.25) / 1.25);
        const brightness = 0.65 + 0.40 * Math.max(0, (normZ + 0.4) / 1.4);
        const zIndex = Math.round((normZ + 1.2) * 50);

        item.el.style.opacity = opacity.toFixed(2);
        item.el.style.zIndex = zIndex;
        if (item.inner) {
          item.inner.style.filter = `brightness(${brightness.toFixed(2)})`;
        }
      }

      this.animId = requestAnimationFrame(render);
    };

    this.animId = requestAnimationFrame(render);
  }

  stopLoop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  previewPhoto(photo) {
    const existing = document.getElementById('sphere-preview-lightbox');
    if (existing) existing.remove();

    const lightbox = document.createElement('div');
    lightbox.id = 'sphere-preview-lightbox';
    lightbox.className = 'sphere-lightbox-overlay';

    lightbox.innerHTML = `
      <div class="sphere-lightbox-card">
        <button class="sphere-lightbox-close">✕</button>
        <picture>
          <source srcset="${photo.webp}" type="image/webp">
          <img class="sphere-lightbox-img" src="${photo.jpg}" alt="${photo.caption}" />
        </picture>
        <div class="sphere-lightbox-caption">${photo.caption}</div>
        <div style="font-size: 0.85rem; color: #ffbb55; margin-top: 6px;">✨ Kỷ Niệm Tình Yêu Mùa Trăng ✨</div>
      </div>
    `;

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('sphere-lightbox-close')) {
        lightbox.classList.add('fade-out');
        setTimeout(() => lightbox.remove(), 250);
      }
    });

    document.body.appendChild(lightbox);
    requestAnimationFrame(() => lightbox.classList.add('active'));
  }
}
