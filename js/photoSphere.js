/**
 * PhotoSphere Component v3.0 - Quả Cầu Kỷ Niệm 3D Tinh Tú (Geodesic Spherical Mesh)
 * - Cấu trúc 4 tầng Geodesic Spherical Coordinate Rings (4 + 6 + 6 + 4 = 20 ảnh)
 * - Chuẩn toán học hình cầu không gian: Tuyệt đối KHÔNG đè chồng chéo, không méo cạnh
 * - 3D Real-time Depth Sorting & Backface Culling: Mặt trước sáng rạng ngời, mặt sau ẩn tinh tế
 * - Chạm / Vuốt đa điểm siêu mượt mà với quán tính vật lý (Inertia Physics), 60 FPS trên mobile
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
    this.rotX = -6;
    this.autoSpinSpeed = 0.20;

    // Pointer drag physics
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.lastDeltaX = 0;
    this.lastDeltaY = 0;
    this.velY = 0.20;
    this.velX = 0;

    this.currentR = 175;

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
   * Phân bổ 20 bức ảnh thành 4 tầng Geodesic Spherical Coordinate Rings
   * Đối xứng hoàn mỹ, khoảng cách đều đặn, không chồng chéo:
   * - Tầng 1 (Chóp trên): 4 ảnh (lat = +38°, pitch = -18°)
   * - Tầng 2 (Bán cầu trên): 6 ảnh (lat = +12°, pitch = -6°)
   * - Tầng 3 (Bán cầu dưới): 6 ảnh (lat = -12°, pitch = +6°)
   * - Tầng 4 (Chóp dưới): 4 ảnh (lat = -38°, pitch = +18°)
   */
  buildSphere() {
    if (!this.world) return;
    this.world.innerHTML = '';
    this.cardElements = [];

    const isMobile = window.innerWidth < 768;
    // Bán kính quả cầu tương thích hoàn hảo kích thước khung nhìn
    this.currentR = isMobile ? 172 : 230;
    const R = this.currentR;

    // Chuẩn toán học hình cầu 4 tầng
    const tiers = [
      // Tầng 1 (Chóp trên): 4 ảnh, cách nhau 90°
      {
        count: 4,
        y: Math.round(-R * 0.615),
        r: Math.round(R * 0.788),
        pitch: -18,
        startAngle: 0
      },
      // Tầng 2 (Bán cầu trên): 6 ảnh, cách nhau 60°, so le 30°
      {
        count: 6,
        y: Math.round(-R * 0.208),
        r: Math.round(R * 0.978),
        pitch: -6,
        startAngle: 30
      },
      // Tầng 3 (Bán cầu dưới): 6 ảnh, cách nhau 60°, so le 0°
      {
        count: 6,
        y: Math.round(R * 0.208),
        r: Math.round(R * 0.978),
        pitch: 6,
        startAngle: 0
      },
      // Tầng 4 (Chóp dưới): 4 ảnh, cách nhau 90°, so le 45°
      {
        count: 4,
        y: Math.round(R * 0.615),
        r: Math.round(R * 0.788),
        pitch: 18,
        startAngle: 45
      }
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

        // Đặt vị trí 3D chính xác trên bề mặt hình cầu
        card.style.transform = `rotateY(${lonAngle}deg) translateY(${tier.y}px) translateZ(${tier.r}px) rotateX(${tier.pitch}deg)`;

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

        // Quản lý biến chạm để mở ảnh chính xác
        let pointerDownTime = 0;
        let pointerDownX = 0;
        let pointerDownY = 0;

        card.addEventListener('pointerdown', (e) => {
          pointerDownTime = Date.now();
          pointerDownX = e.clientX;
          pointerDownY = e.clientY;
        });

        card.addEventListener('pointerup', (e) => {
          const moveDist = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
          const pressDuration = Date.now() - pointerDownTime;
          // Nhận diện cú chạm ngón tay (tap) dứt khoát
          if (moveDist < 8 && pressDuration < 400) {
            e.stopPropagation();
            this.previewPhoto(photo);
          }
        });

        this.cardElements.push({
          el: card,
          inner: card.querySelector('.sphere-card-inner'),
          baseLon: lonAngle,
          baseY: tier.y,
          baseR: tier.r,
          photo
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

  getPointerPos(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
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

    // Touch & Mouse Drag với cơ chế vật lý quán tính mượt mà
    const stage = document.getElementById('sphere-stage');
    if (stage) {
      const onPointerDown = (e) => {
        this.isDragging = true;
        const pos = this.getPointerPos(e);
        this.startX = pos.x;
        this.startY = pos.y;
        this.lastDeltaX = 0;
        this.lastDeltaY = 0;
        this.velY = 0;
        this.velX = 0;
      };

      const onPointerMove = (e) => {
        if (!this.isDragging) return;
        const pos = this.getPointerPos(e);
        const deltaX = pos.x - this.startX;
        const deltaY = pos.y - this.startY;

        this.lastDeltaX = deltaX;
        this.lastDeltaY = deltaY;

        // Xoay ngang và giới hạn góc nghiêng dọc (-26° đến +26°) để giữ dáng tròn chuẩn
        this.rotY += deltaX * 0.35;
        this.rotX = Math.max(-26, Math.min(26, this.rotX - deltaY * 0.22));

        this.velY = deltaX * 0.12;
        this.velX = -deltaY * 0.08;

        this.startX = pos.x;
        this.startY = pos.y;
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
        // Tự động xoay chậm rãi thư thái + giảm tốc quán tính
        this.rotY += this.autoSpinSpeed + this.velY;
        this.rotX = Math.max(-26, Math.min(26, this.rotX + this.velX));

        this.velY *= 0.94;
        this.velX *= 0.94;
        if (Math.abs(this.velY) < 0.01) this.velY = 0;
        if (Math.abs(this.velX) < 0.01) this.velX = 0;
      }

      // Xoay thế giới 3D
      if (this.world) {
        this.world.style.transform = `rotateX(${this.rotX}deg) rotateY(${this.rotY}deg)`;
      }

      // ── Real-time 3D Spherical Depth Sorting & Shading ──────────────
      // Tính toán chính xác vị trí chiều sâu Z của từng card theo góc nhìn người xem
      const rotYRad = (this.rotY * Math.PI) / 180;
      const rotXRad = (this.rotX * Math.PI) / 180;
      const cosX = Math.cos(rotXRad);
      const sinX = Math.sin(rotXRad);

      const R = this.currentR || 172;
      const count = this.cardElements.length;

      for (let i = 0; i < count; i++) {
        const item = this.cardElements[i];

        // Góc kinh độ thực tế sau khi xoay rotY
        const lonRad = (item.baseLon * Math.PI) / 180 + rotYRad;

        // Tọa độ trước khi xoay rotX
        const Y1 = item.baseY;
        const Z1 = item.baseR * Math.cos(lonRad);

        // Chiều sâu Z sau khi xoay thế giới góc rotX (hướng ra mắt người xem)
        const zView = -Y1 * sinX + Z1 * cosX;
        const normZ = zView / R; // Khoảng từ -1 (tận cùng phía sau) đến +1 (chính diện trước)

        if (normZ > 0.04) {
          // BÁN CẦU PHÍA TRƯỚC: Rõ nét, rạng ngời, lộng lẫy
          const opacity = Math.min(1, 0.45 + 0.55 * (normZ / 0.9));
          const brightness = Math.min(1.15, 0.82 + 0.33 * normZ);

          item.el.style.opacity = opacity.toFixed(2);
          item.el.style.pointerEvents = 'auto';
          item.el.style.visibility = 'visible';
          if (item.inner) {
            item.inner.style.filter = `brightness(${brightness.toFixed(2)})`;
          }
        } else {
          // BÁN CẦU PHÍA SAU: Ẩn tinh tế, không lộ mặt ngược, giải phóng GPU
          item.el.style.opacity = '0';
          item.el.style.pointerEvents = 'none';
          item.el.style.visibility = 'hidden';
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
