/**
 * PhotoSphere Component - Quả Cầu Kỷ Niệm 3D Xoay 360 Độ
 * - Tối ưu 60 FPS trên điện thoại yếu: CSS 3D Transforms, WebP siêu nhẹ, zero CPU khi đóng
 * - Hiệu ứng ánh trăng lấp lánh (Sparkling Aura & Orbiting Stardust)
 * - Tương tác chạm/kéo xoay 3D mượt mà
 */
export class PhotoSphere {
  constructor(options = {}) {
    this.modal = document.getElementById('photo-sphere-modal');
    this.world = document.getElementById('sphere-3d-world');
    this.sparklesContainer = document.getElementById('sphere-sparkles');
    this.closeBtn = document.getElementById('sphere-close-btn');

    this.isOpen = false;
    this.animId = null;

    // Rotation angles
    this.rotY = 0;
    this.rotX = -10;
    this.targetRotY = 0;
    this.targetRotX = -10;
    this.autoSpinSpeed = 0.22;

    // Pointer drag physics
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.lastDeltaX = 0;
    this.lastDeltaY = 0;

    // Captions list
    const captions = [
      'Khoảnh khắc ngọt ngào ✨', 'Nụ cười của em ❤️', 'Bên nhau mùa trăng 🏮',
      'Ánh mắt dịu dàng 💕', 'Mãi yêu em bé ✨', 'Mùa trăng đoàn viên 🥮',
      'Tay trong tay 🤝', 'Bình yên bên em 🌸', 'Những ngày hạnh phúc 💖',
      'Chàng trai của anh 🌟', 'Kỷ niệm khó phai 💫', 'Ấm áp mùa thu 🍂',
      'Mãi không cách xa ❤️', 'Trăng rằm soi bóng 🌕', 'Yêu thương đong đầy 💌',
      'Hạnh phúc giản đơn 🍃', 'Bên em mọi mùa trăng 🏮', 'Nụ cười tỏa nắng ☀️',
      'Nguyện ước trăm năm 💍', 'Chở che cho em 🛡️'
    ];

    // Load 20 optimized album photos
    this.photos = [];
    for (let i = 1; i <= 20; i++) {
      this.photos.push({
        id: i,
        webp: `assets/images/album/thumb_${i}.webp`,
        jpg: `assets/images/album/thumb_${i}.jpg`,
        caption: captions[(i - 1) % captions.length]
      });
    }

    this.init();
  }

  init() {
    this.buildSphere();
    this.buildSparkles();
    this.bindEvents();
  }

  buildSphere() {
    if (!this.world) return;
    this.world.innerHTML = '';

    const isMobile = window.innerWidth < 768;
    const radius = isMobile ? 155 : 230;
    const N = this.photos.length;

    // Fibonacci sphere distribution for uniform 3D placement
    this.photos.forEach((photo, idx) => {
      const phi = Math.acos(-1 + (2 * idx) / (N - 1)); // Latitude: 0 to PI
      const theta = Math.sqrt(N * Math.PI) * phi;       // Longitude

      // 3D Cartesian coordinates on sphere surface
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      // Tangent rotation angles to face outward from sphere center
      const rotY = (Math.atan2(x, z) * 180) / Math.PI;
      const rotX = (-Math.asin(y / radius) * 180) / Math.PI;

      const card = document.createElement('div');
      card.className = 'sphere-photo-card';
      card.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(${radius}px)`;

      card.innerHTML = `
        <div class="sphere-card-inner">
          <picture>
            <source srcset="${photo.webp}" type="image/webp">
            <img class="sphere-card-img" 
                 src="${photo.jpg}" 
                 alt="${photo.caption}" 
                 loading="lazy" 
                 decoding="async"
                 onerror="this.src='assets/images/memory${(idx % 3) + 1}.webp'" />
          </picture>
          <div class="sphere-card-glow"></div>
        </div>
      `;

      // Tap on card to focus / preview
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        if (Math.abs(this.lastDeltaX) < 3 && Math.abs(this.lastDeltaY) < 3) {
          this.previewPhoto(photo);
        }
      });

      this.world.appendChild(card);
    });
  }

  buildSparkles() {
    if (!this.sparklesContainer) return;
    this.sparklesContainer.innerHTML = '';

    const sparkleCount = window.innerWidth < 768 ? 16 : 28;
    for (let i = 0; i < sparkleCount; i++) {
      const sp = document.createElement('div');
      sp.className = 'sphere-sparkle-dot';
      
      const size = Math.random() * 3.5 + 2;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 3;
      const duration = Math.random() * 2 + 1.8;

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

    // Touch & Mouse Drag to Rotate 3D Sphere
    const stage = document.getElementById('sphere-stage');
    if (stage) {
      const onPointerDown = (e) => {
        this.isDragging = true;
        this.startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        this.startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        this.lastDeltaX = 0;
        this.lastDeltaY = 0;
      };

      const onPointerMove = (e) => {
        if (!this.isDragging) return;
        const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const y = e.clientY || (e.touches && e.touches[0].clientY) || 0;

        const deltaX = x - this.startX;
        const deltaY = y - this.startY;

        this.lastDeltaX = deltaX;
        this.lastDeltaY = deltaY;

        this.rotY += deltaX * 0.42;
        this.rotX = Math.max(-55, Math.min(55, this.rotX - deltaY * 0.32));

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

    // Resize recalculation
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

    // Close preview if open
    const preview = document.getElementById('sphere-preview-lightbox');
    if (preview) preview.remove();
  }

  startLoop() {
    this.stopLoop();
    const render = () => {
      if (!this.isOpen) return;

      if (!this.isDragging) {
        this.rotY += this.autoSpinSpeed;
      }

      if (this.world) {
        this.world.style.transform = `rotateX(${this.rotX}deg) rotateY(${this.rotY}deg)`;
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
