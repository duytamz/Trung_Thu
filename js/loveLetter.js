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
      letterContent: options.letterContent || `Gửi em - chàng trai anh yêu thương nhất,\n\nTrung Thu này không chỉ có ánh trăng tròn và lồng đèn rực rỡ, mà còn có em - món quà tuyệt vời nhất mà cuộc đời đã mang đến cho anh.\n\nCảm ơn em vì đã luôn dịu dàng, luôn mang lại nụ cười và sự ấm áp cho anh mỗi ngày. Chúc cho em bé của anh một mùa Tết Trung Thu thật nhiều niềm vui, luôn rạng rỡ và an yên.\n\nMong rằng dù bao mùa trăng nữa đi qua, đôi bàn tay này vẫn sẽ luôn nắm chặt lấy tay em và chở che cho em.\n\nYêu em thật nhiều! ❤️`,
      photos: options.photos || [
        {
          webp: 'assets/images/memory1.webp',
          jpg: 'assets/images/memory1.jpg',
          url: 'assets/images/memory1.webp',
          caption: 'Kỷ niệm ngọt ngào'
        },
        {
          webp: 'assets/images/memory2.webp',
          jpg: 'assets/images/memory2.jpg',
          url: 'assets/images/memory2.webp',
          caption: 'Cùng em ngắm trăng'
        },
        {
          webp: 'assets/images/memory3.webp',
          jpg: 'assets/images/memory3.jpg',
          url: 'assets/images/memory3.webp',
          caption: 'Mãi bên nhau nhé'
        }
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
      const handleSendWish = () => {
        let wish = wishInput.value.trim();
        if (!wish) {
          wish = 'Mong đôi mình luôn bình an, rạng rỡ và hạnh phúc bên nhau! ❤️';
        }

        // Release lantern in sky canvas
        if (this.skyCanvas) {
          if (typeof this.skyCanvas.releaseSkyLantern === 'function') {
            this.skyCanvas.releaseSkyLantern(wish);
          } else if (typeof this.skyCanvas.releaseHoaDang === 'function') {
            this.skyCanvas.releaseHoaDang(window.innerWidth * 0.5, window.innerHeight * 0.85, wish);
          }
        }

        // Send to floating danmaku messages
        if (this.danmaku) {
          this.danmaku.addCustomMessage(`🏮 ${wish}`);
        }

        // Button visual feedback
        const oldText = sendWishBtn.innerHTML;
        sendWishBtn.disabled = true;
        sendWishBtn.innerHTML = '<span>🏮</span> Đã Thả Đèn ✨';

        // Show romantic floating toast
        this.showToast('🏮 Đèn trời mang điều ước của bạn đã bay lên cung trăng rằm!');

        // Clear input
        wishInput.value = '';

        // Smoothly close modal after a brief moment so user can watch the lantern rise
        setTimeout(() => {
          this.close();
          sendWishBtn.disabled = false;
          sendWishBtn.innerHTML = oldText;
        }, 500);
      };

      sendWishBtn.addEventListener('click', handleSendWish);
      wishInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendWish();
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
      <div class="polaroid-frame" data-idx="${idx}">
        <div class="polaroid-tape"></div>
        <picture>
          <source srcset="${p.webp || p.url}" type="image/webp">
          <img class="polaroid-img" 
               src="${p.jpg || p.url}" 
               alt="Kỷ niệm ${idx + 1}" 
               loading="lazy" 
               decoding="async"
               onerror="this.src='assets/images/memory${idx + 1}.jpg'" />
        </picture>
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
