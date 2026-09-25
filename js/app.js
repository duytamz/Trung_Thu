/**
 * Main Application Orchestrator (Dành riêng cho người yêu)
 */
import { SkyCanvas } from './skyCanvas.js';
import { Lantern } from './lantern.js';
import { DanmakuSystem } from './danmaku.js';
import { LoveLetter } from './loveLetter.js';
import { RomanticAudioPlayer } from './audioPlayer.js';
import { PhotoSphere } from './photoSphere.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Sky Canvas Background (Stars, Moon, Clouds, Fireflies, Hoa Đăng & Ripples)
  const skyCanvas = new SkyCanvas('sky-canvas');

  // 2. Initialize Danmaku Bullet Wishes
  const danmaku = new DanmakuSystem('danmaku-container');

  // 3. Initialize Love Letter & Memories Modal
  const loveLetter = new LoveLetter({
    skyCanvas,
    danmaku
  });

  // 4. Initialize Romantic Trending Audio Player
  const audioPlayer = new RomanticAudioPlayer('audio-player-pill');

  // 5. Initialize 3D Photo Sphere Component ("Quả Cầu Kỷ Niệm")
  const photoSphere = new PhotoSphere(skyCanvas);

  // 6. Parse Personalized Data from URL hash (if scanned from QR)
  parseURLPersonalization(loveLetter);

  // 7. Trigger Flower Entrance Animation ("Hoa nhảy ra")
  triggerFlowerEntrance();

  // 8. Initialize 3D Lantern & Bear Component
  const lantern = new Lantern('lantern-stage', () => {
    // When lantern is clicked, open love letter with sparkle burst!
    loveLetter.open();
  }, skyCanvas);

  // 9. Bind Action Buttons
  const openLetterBtn = document.getElementById('open-letter-btn');
  if (openLetterBtn) {
    openLetterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      loveLetter.open();
    });
  }

  // Open 3D Photo Sphere Button
  const openSphereBtn = document.getElementById('open-sphere-btn');
  if (openSphereBtn) {
    openSphereBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      photoSphere.open();
    });
  }

  // Inside Love Letter: Open 3D Photo Sphere
  const letterOpenSphereBtn = document.getElementById('letter-open-sphere-btn');
  if (letterOpenSphereBtn) {
    letterOpenSphereBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      loveLetter.close();
      photoSphere.open();
    });
  }

  // Lover's Dedicated Wish Modal
  const wishModal = document.getElementById('wish-dialog-modal');
  const openWishModalBtn = document.getElementById('open-wish-modal-btn');
  const closeWishModalBtn = document.getElementById('wish-dialog-close-btn');
  const submitWishBtn = document.getElementById('lover-submit-wish-btn');
  const wishTextarea = document.getElementById('lover-wish-textarea');

  if (openWishModalBtn && wishModal) {
    openWishModalBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      wishModal.classList.add('active');
    });
  }

  if (closeWishModalBtn && wishModal) {
    closeWishModalBtn.addEventListener('click', () => {
      wishModal.classList.remove('active');
    });
  }

  if (wishModal) {
    wishModal.addEventListener('click', (e) => {
      if (e.target === wishModal) wishModal.classList.remove('active');
    });
  }

  if (submitWishBtn && wishTextarea) {
    submitWishBtn.addEventListener('click', () => {
      const wish = wishTextarea.value.trim();
      if (wish) {
        if (typeof skyCanvas.releaseSkyLantern === 'function') {
          skyCanvas.releaseSkyLantern(`Bé ước: ${wish}`);
        } else {
          skyCanvas.releaseHoaDang(window.innerWidth * 0.5, window.innerHeight * 0.7, `Ước: ${wish}`);
        }
        danmaku.addCustomMessage(`🌟 Bé ước: ${wish}`);
        loveLetter.showToast('🏮 Điều ước của bé đã bay lên vầng trăng rằm cùng anh!');
        wishTextarea.value = '';
        wishModal.classList.remove('active');
      } else {
        alert('Bé ơi hãy nhập một điều ước nho nhỏ nha! ❤️');
      }
    });
  }

  // 9. TAP ANYWHERE ON SCREEN TO RELEASE HOA ĐĂNG (Bấm ở bất kỳ đâu đều thả hoa đăng)
  window.addEventListener('pointerdown', (e) => {
    // Ignore clicks on buttons, inputs, modal dialogs, or audio pill
    if (
      e.target.closest('.modal-card') ||
      e.target.closest('.btn-magic') ||
      e.target.closest('.audio-floating-pill') ||
      e.target.closest('.modal-close-btn') ||
      e.target.closest('#lantern-stage')
    ) {
      return;
    }

    // Release Hoa Đăng at exact click coordinates
    skyCanvas.releaseHoaDang(e.clientX, e.clientY);
  });

  console.log('✨ Mùa Trăng Yêu Thương - Web quà tặng Trung Thu đã sẵn sàng!');
});

/**
 * Hiệu ứng "Hoa Nhảy Ra" khi người yêu vừa quét QR mở trang web
 */
function triggerFlowerEntrance() {
  const container = document.getElementById('flower-entrance-layer');
  if (!container) return;

  const flowerSVGs = [
    // Blooming Lotus / Peony
    `<svg width="55" height="55" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="fg1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff0f5"/>
          <stop offset="60%" stop-color="#ff6b81"/>
          <stop offset="100%" stop-color="#ee5253"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="25" r="22" fill="url(#fg1)" opacity="0.9"/>
      <circle cx="75" cy="50" r="22" fill="url(#fg1)" opacity="0.9"/>
      <circle cx="50" cy="75" r="22" fill="url(#fg1)" opacity="0.9"/>
      <circle cx="25" cy="50" r="22" fill="url(#fg1)" opacity="0.9"/>
      <circle cx="50" cy="50" r="16" fill="#ffd32a"/>
    </svg>`,
    // Golden Autumn Chrysanthemum
    `<svg width="50" height="50" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="fg2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fffbe6"/>
          <stop offset="60%" stop-color="#ffdd59"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </radialGradient>
      </defs>
      <g fill="url(#fg2)">
        <ellipse cx="50" cy="22" rx="12" ry="20"/>
        <ellipse cx="78" cy="50" rx="20" ry="12"/>
        <ellipse cx="50" cy="78" rx="12" ry="20"/>
        <ellipse cx="22" cy="50" rx="20" ry="12"/>
        <ellipse cx="70" cy="30" rx="18" ry="12" transform="rotate(45 70 30)"/>
        <ellipse cx="30" cy="30" rx="18" ry="12" transform="rotate(-45 30 30)"/>
        <ellipse cx="70" cy="70" rx="18" ry="12" transform="rotate(-45 70 70)"/>
        <ellipse cx="30" cy="70" rx="18" ry="12" transform="rotate(45 30 70)"/>
      </g>
      <circle cx="50" cy="50" r="14" fill="#ff7675"/>
    </svg>`,
    // Rose Pink Blossom
    `<svg width="45" height="45" viewBox="0 0 100 100">
      <circle cx="50" cy="30" r="18" fill="#ffa8ba" opacity="0.95"/>
      <circle cx="70" cy="45" r="18" fill="#ffa8ba" opacity="0.95"/>
      <circle cx="62" cy="70" r="18" fill="#ffa8ba" opacity="0.95"/>
      <circle cx="38" cy="70" r="18" fill="#ffa8ba" opacity="0.95"/>
      <circle cx="30" cy="45" r="18" fill="#ffa8ba" opacity="0.95"/>
      <circle cx="50" cy="50" r="14" fill="#fff" opacity="0.9"/>
    </svg>`
  ];

  const centerX = window.innerWidth * 0.5;
  const centerY = window.innerHeight * 0.48;

  // Create 16 jumping flowers in a ring
  const count = 16;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const distance = Math.min(window.innerWidth, window.innerHeight) * (0.28 + Math.random() * 0.22);
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    const el = document.createElement('div');
    el.className = 'jumping-flower';
    el.style.left = `${centerX}px`;
    el.style.top = `${centerY}px`;
    el.style.setProperty('--dx', `${dx}px`);
    el.style.setProperty('--dy', `${dy}px`);
    el.style.animationDelay = `${Math.random() * 0.4}s`;
    el.innerHTML = flowerSVGs[i % flowerSVGs.length];

    container.appendChild(el);
  }

  // Clean up container after animation finishes
  setTimeout(() => {
    container.innerHTML = '';
  }, 3500);
}

/**
 * Đọc dữ liệu cá nhân hóa từ URL Hash
 */
function parseURLPersonalization(loveLetter) {
  try {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const params = new URLSearchParams(hash);
      const lover = params.get('lover');
      const sender = params.get('sender');
      const date = params.get('date');
      const msg = params.get('msg');

      const config = {};
      if (lover) config.loverName = decodeURIComponent(lover);
      if (sender) config.senderName = decodeURIComponent(sender);
      if (date) config.startDate = decodeURIComponent(date);
      if (msg) config.letterContent = decodeURIComponent(msg);

      if (loveLetter) {
        loveLetter.setConfig(config);
      }

      const loverBadge = document.getElementById('lover-display-name');
      if (loverBadge && config.loverName) {
        loverBadge.textContent = config.loverName;
      }
    }
  } catch (e) {
    console.warn("URL parse error:", e);
  }
}
