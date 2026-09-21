/**
 * Main Application Orchestrator
 */
import { SkyCanvas } from './skyCanvas.js';
import { Lantern } from './lantern.js';
import { DanmakuSystem } from './danmaku.js';
import { LoveLetter } from './loveLetter.js';
import { RomanticAudioPlayer } from './audioPlayer.js';
import { QRGenerator } from './qrGenerator.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Sky Canvas Background (Stars, Moon, Clouds, Fireflies)
  const skyCanvas = new SkyCanvas('sky-canvas');

  // 2. Initialize Danmaku Bullet Comments
  const danmaku = new DanmakuSystem('danmaku-container');

  // 3. Initialize Love Letter & Memories Modal
  const loveLetter = new LoveLetter({
    skyCanvas,
    danmaku
  });

  // 4. Initialize Romantic Audio Player
  const audioPlayer = new RomanticAudioPlayer('audio-player-pill');

  // 5. Initialize QR Code Generator & Personalizer
  const qrGenerator = new QRGenerator({
    loveLetter
  });

  // 6. Initialize 3D Lantern & Bear Component
  const lantern = new Lantern('lantern-stage', () => {
    // When lantern is clicked, open love letter with sparkle burst!
    loveLetter.open();
  }, skyCanvas);

  // 7. Bind Action Buttons
  const openLetterBtn = document.getElementById('open-letter-btn');
  if (openLetterBtn) {
    openLetterBtn.addEventListener('click', () => {
      loveLetter.open();
    });
  }

  const openWishBtn = document.getElementById('open-wish-btn');
  if (openWishBtn) {
    openWishBtn.addEventListener('click', () => {
      // Directly release a sky lantern with a gentle wish
      skyCanvas.releaseSkyLantern('Trung Thu an lành bên em 💕');
      danmaku.addCustomMessage('🏮 Đèn trời nguyện ước đang bay lên cung trăng...');
      loveLetter.showToast('🏮 Đã thả đèn trời mang ngàn yêu thương!');
    });
  }

  const openQrBtn = document.getElementById('open-qr-btn');
  if (openQrBtn) {
    openQrBtn.addEventListener('click', () => {
      qrGenerator.open();
    });
  }

  // Welcome sparkle burst
  setTimeout(() => {
    skyCanvas.createSparkleBurst(window.innerWidth * 0.5, window.innerHeight * 0.45, 40);
  }, 1000);

  console.log('✨ Mùa Trăng Yêu Thương - Web quà tặng Trung Thu đã sẵn sàng!');
});
