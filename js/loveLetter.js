/**
 * LoveLetter Component - Bức Thư Tình Mùa Trăng & Kỷ Niệm Yêu Thương
 */
export class LoveLetter {
  constructor(options = {}) {
    this.modal = document.getElementById('love-letter-modal');
    this.skyCanvas = options.skyCanvas;
    this.danmaku = options.danmaku;
    
    // Couple Profile Defaults
    this.config = {
      senderName: options.senderName || 'Anh',
      loverName: options.loverName || 'Em Bé Của Anh',
      startDate: options.startDate || '2023-09-29', // Default Mid-Autumn anniversary
      letterTitle: 'Bức Thư Mùa Trăng',
      letterContent: options.letterContent || `Gửi em - người con gái anh yêu nhất,\n\nTrung Thu này không chỉ có ánh trăng tròn và lồng đèn rực rỡ, mà còn có em - món quà tuyệt vời nhất mà cuộc đời đã mang đến cho anh.\n\nCảm ơn em vì đã luôn dịu dàng, luôn mang lại nụ cười và sự ấm áp cho anh mỗi ngày. Chúc cho em của anh một mùa Tết Trung Thu thật nhiều niềm vui, luôn rạng rỡ và an yên.\n\nMong rằng dù bao mùa trăng nữa đi qua, đôi bàn tay này vẫn sẽ được nắm chặt lấy tay em.\n\nYêu em thật nhiều! ❤️`,
      photos: options.photos || [
        { url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&auto=format&fit=crop&q=80', caption: 'Kỷ niệm ngọt ngào' },
        { url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&auto=format&fit=crop&q=80', caption: 'Cùng em ngắm trăng' },
        { url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&auto=format&fit=crop&q=80', caption: 'Mãi bên nhau nhé' }
      ]
    };

    this.timerInterval = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateContent();
  }

  bindEvents() {
    const closeBtn = document.getElementById('letter-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Close when clicking outside card
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    // Wish submit button
    const sendWishBtn = document.getElementById('send-wish-btn');
    const wishInput = document.getElementById('wish-input');
    if (sendWishBtn && wishInput) {
      sendWishBtn.addEventListener('click', () => {
        const wish = wishInput.value.trim();
        if (wish) {
          if (this.skyCanvas) {
            this.skyCanvas.releaseSkyLantern(`Ước: ${wish}`);
          }
          if (this.danmaku) {
            this.danmaku.addCustomMessage(`🌟 ${wish}`);
          }
          wishInput.value = '';
          this.showToast('🏮 Đèn trời mang điều ước của bạn đã bay lên cung trăng!');
          this.close();
        }
      });
      wishInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendWishBtn.click();
      });
    }
  }

  updateContent() {
    const loverNameEl = document.getElementById('letter-lover-name');
    if (loverNameEl) loverNameEl.textContent = `Gửi ${this.config.loverName} 💕`;

    const bodyEl = document.getElementById('letter-body-text');
    if (bodyEl) bodyEl.textContent = this.config.letterContent;

    this.renderPolaroids();
  }

  renderPolaroids() {
    const gallery = document.getElementById('polaroid-gallery');
    if (!gallery) return;

    gallery.innerHTML = this.config.photos.map((p, idx) => `
      <div class="polaroid-frame">
        <div class="polaroid-tape"></div>
        <img class="polaroid-img" src="${p.url}" alt="Memory ${idx + 1}" onerror="this.src='https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&auto=format&fit=crop&q=80'" />
        <div class="polaroid-caption">${p.caption}</div>
      </div>
    `).join('');
  }

  open() {
    if (!this.modal) return;
    this.modal.classList.add('active');
    if (this.skyCanvas) {
      this.skyCanvas.createSparkleBurst(window.innerWidth * 0.5, window.innerHeight * 0.5, 30);
    }
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
  }

  setConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.updateContent();
  }

  showToast(msg) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(255, 107, 139, 0.95)';
    toast.style.color = '#fff';
    toast.style.padding = '10px 22px';
    toast.style.borderRadius = '30px';
    toast.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
    toast.style.zIndex = '9999';
    toast.style.fontFamily = 'var(--font-body)';
    toast.style.fontSize = '0.92rem';
    toast.style.fontWeight = '600';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s ease';
      setTimeout(() => toast.remove(), 500);
    }, 2800);
  }
}
