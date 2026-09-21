/**
 * AudioPlayer - Phát nhạc hot trend TikTok Trung Thu lãng mạn
 */
export class RomanticAudioPlayer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.audioEl = document.getElementById('bg-audio');
    this.isPlaying = false;
    
    this.init();
  }

  init() {
    if (!this.container) return;

    this.container.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Smart autoplay on first tap anywhere on the screen
    const handleFirstInteraction = () => {
      if (!this.isPlaying) {
        this.play();
      }
      window.removeEventListener('pointerdown', handleFirstInteraction);
    };
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
  }

  play() {
    if (this.audioEl) {
      this.audioEl.play().then(() => {
        this.isPlaying = true;
        this.container.classList.add('audio-playing');
        const label = this.container.querySelector('.audio-label');
        if (label) label.textContent = 'Nhạc: Bật';
      }).catch((e) => {
        console.warn("Autoplay blocked or audio error:", e);
      });
    }
  }

  pause() {
    if (this.audioEl) {
      this.audioEl.pause();
    }
    this.isPlaying = false;
    this.container.classList.remove('audio-playing');
    const label = this.container.querySelector('.audio-label');
    if (label) label.textContent = 'Nhạc: Tắt';
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}
