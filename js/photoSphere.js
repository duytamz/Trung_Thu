/**
 * PhotoSphere Component v5.0 - Quả Cầu Kỷ Niệm Mùa Trăng 3D (Royal Spherical Globe)
 * - Mô phỏng chuẩn mực quà tặng Trung Thu 3D trên TikTok: Lồng Đèn Quả Cầu Trăng Rằm 3D
 * - 20 ảnh phân bổ 3 tầng hình cầu đối xứng hoàng gia: 5 (chóp trên) + 10 (xích đạo) + 5 (chóp dưới)
 * - Tọa độ 3D chuyển động theo quỹ đạo cầu hoàn hảo, các thẻ ảnh luôn thẳng thớm ngay ngắn (tuyệt đối không méo mó, không lộn xộn)
 * - Lõi Ánh Trăng Pha Lê trong trẻo ở tâm (z-index 100), phân tầng trước sau sống động
 * - Tương tác vuốt 360° mượt mà, quán tính tự nhiên, tối ưu 60 FPS trên điện thoại
 */
export class PhotoSphere {
  constructor() {
    this.modal = document.getElementById('photo-sphere-modal');
    this.world = document.getElementById('sphere-3d-world');
    this.sparklesContainer = document.getElementById('sphere-sparkles');
    this.closeBtn = document.getElementById('sphere-close-btn');

    this.isOpen = false;
    this.animId = null;

    // Góc xoay (tính bằng radian)
    this.rotY = 0;
    this.rotX = -0.08;
    this.autoSpinSpeed = 0.0055;

    // Vật lý kéo vuốt (Pointer drag physics)
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.lastDeltaX = 0;
    this.lastDeltaY = 0;
    this.velY = 0;
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
    this.maxR = 175;
    this.init();
  }

  init() {
    this.buildSphere();
    this.buildSparkles();
    this.bindEvents();
  }

  /**
   * Phân bổ 20 bức ảnh thành 3 tầng hình cầu đối xứng hoàng gia
   * Tạo nên khối cầu tròn đầy, trật tự tuyệt đối, không trùng lặp, không lộn xộn:
   * - Tầng trên: 5 ảnh (Y = -76px, r = 118px)
   * - Tầng xích đạo: 10 ảnh (Y = 0px, r = 176px - nở rộng tạo dáng quả cầu)
   * - Tầng dưới: 5 ảnh (Y = +76px, r = 118px)
   */
  buildSphere() {
    if (!this.world) return;
    this.world.innerHTML = '';
    this.cardElements = [];

    const isMobile = window.innerWidth < 768;
    const scaleFactor = isMobile ? 1.0 : 1.38;

    this.maxR = Math.round(176 * scaleFactor);

    // Định nghĩa 3 tầng đối xứng hình cầu hoàn mỹ
    const tiers = [
      // Tầng trên (Chóp Vòm): 5 ảnh, bán kính nhỏ 118px
      {
        count: 5,
        y: Math.round(-76 * scaleFactor),
        r: Math.round(118 * scaleFactor),
        startAngle: 0
      },
      // Tầng xích đạo: 10 ảnh, bán kính nở rộng 176px tạo dáng quả cầu tròn xoe
      {
        count: 10,
        y: 0,
        r: Math.round(176 * scaleFactor),
        startAngle: 18 // so le hoàn hảo với tầng trên và tầng dưới
      },
      // Tầng dưới (Đáy Vòm): 5 ảnh, bán kính nhỏ 118px
      {
        count: 5,
        y: Math.round(76 * scaleFactor),
        r: Math.round(118 * scaleFactor),
        startAngle: 36
      }
    ];

    let photoIndex = 0;

    tiers.forEach((tier) => {
      const angleStep = 360 / tier.count;

      for (let i = 0; i < tier.count; i++) {
        if (photoIndex >= this.photos.length) break;
        const photo = this.photos[photoIndex];
        const lonAngleDeg = tier.startAngle + i * angleStep;
        const lonAngleRad = (lonAngleDeg * Math.PI) / 180;

        const card = document.createElement('div');
        card.className = 'sphere-photo-card';

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

        // Cảm ứng chạm mở ảnh phóng to
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
          if (moveDist < 8 && pressDuration < 400) {
            e.stopPropagation();
            this.previewPhoto(photo);
          }
        });

        this.cardElements.push({
          el: card,
          inner: card.querySelector('.sphere-card-inner'),
          baseAngleRad: lonAngleRad,
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

        // Xoay 360 độ mượt mà quanh trục Y và nghiêng nhẹ trục X
        this.rotY += deltaX * 0.007;
        this.rotX = Math.max(-0.28, Math.min(0.28, this.rotX - deltaY * 0.004));

        this.velY = deltaX * 0.003;
        this.velX = -deltaY * 0.0015;

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
        this.rotX = Math.max(-0.28, Math.min(0.28, this.rotX + this.velX));

        this.velY *= 0.94;
        this.velX *= 0.94;
        if (Math.abs(this.velY) < 0.0001) this.velY = 0;
        if (Math.abs(this.velX) < 0.0001) this.velX = 0;
      }

      // ── Real-time 3D Spherical Coordinate Rotation & Depth Sorting ──
      const cosY = Math.cos(this.rotY);
      const sinY = Math.sin(this.rotY);
      const cosX = Math.cos(this.rotX);
      const sinX = Math.sin(this.rotX);

      const maxR = this.maxR || 176;
      const count = this.cardElements.length;

      for (let i = 0; i < count; i++) {
        const item = this.cardElements[i];

        // Tọa độ ban đầu trên mặt phẳng ngang của tầng đó
        const x0 = item.baseR * Math.sin(item.baseAngleRad);
        const y0 = item.baseY;
        const z0 = item.baseR * Math.cos(item.baseAngleRad);

        // 1. Phép quay 3D quanh trục đứng Y (góc rotY)
        const x1 = x0 * cosY + z0 * sinY;
        const y1 = y0;
        const z1 = -x0 * sinY + z0 * cosY;

        // 2. Phép nghiêng 3D quanh trục ngang X (góc rotX)
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        // 3. Chuẩn hóa chiều sâu Z (-1 ở xa nhất sau lưng, +1 ở gần nhất trước mặt)
        const zNorm = z2 / maxR;

        // Tọa độ màn hình (center 0,0 của sphere-3d-world)
        const screenX = x2;
        const screenY = y2;

        // Hệ số phóng to/thu nhỏ theo chiều sâu (Mặt trước to 1.15x rõ nét, mặt sau 0.75x tạo chiều sâu)
        const scale = 0.75 + 0.40 * ((zNorm + 1) / 2);

        // Opacity: Mặt trước sáng 100%, mặt sau mờ nhẹ 0.45 để nhìn xuyên thấu như đèn hoa đăng
        const opacity = 0.45 + 0.55 * Math.max(0, (zNorm + 0.8) / 1.8);

        // Độ sáng: Mặt trước sáng bừng rực rỡ, mặt sau dịu dàng
        const brightness = 0.82 + 0.30 * Math.max(0, (zNorm + 0.5) / 1.5);

        // Thứ tự lớp zIndex: Mặt sau (<100) nằm sau Mặt Trăng, Mặt trước (>100) nằm trước Mặt Trăng
        const zIndex = Math.round(100 + zNorm * 90);

        // Áp dụng biến đổi GPU hardware-accelerated: thẻ luôn thẳng đứng vuông vắn, không méo mó!
        item.el.style.transform = `translate3d(${screenX.toFixed(1)}px, ${screenY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        item.el.style.zIndex = zIndex;
        item.el.style.opacity = opacity.toFixed(2);
        if (item.inner) {
          item.inner.style.filter = `brightness(${brightness.toFixed(2)}) contrast(1.04)`;
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
