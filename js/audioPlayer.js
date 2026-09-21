/**
 * AudioPlayer - Trình phát nhạc Trung Thu lãng mạn kèm Web Audio Synthesizer
 */
export class RomanticAudioPlayer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.isPlaying = false;
    this.audioCtx = null;
    this.synthTimer = null;
    this.melodyIndex = 0;
    
    // Pentatonic romantic notes for gentle music box / acoustic ambiance
    // Eb Major / C Minor romantic scale (warm, nostalgic, dreamy Mid-Autumn feel)
    this.notes = [
      311.13, // Eb4
      349.23, // F4
      392.00, // G4
      466.16, // Bb4
      523.25, // C5
      622.25, // Eb5
      698.46, // F5
      783.99  // G5
    ];

    // Dreamy melody sequence
    this.melody = [
      0, 2, 4, 3, 2, 0, 1, 2,
      4, 5, 4, 3, 2, 4, 3, 1,
      0, 3, 4, 5, 7, 5, 4, 2,
      0, 2, 4, 3, 2, 1, 0
    ];

    this.init();
  }

  init() {
    if (!this.container) return;

    this.container.addEventListener('click', () => {
      this.toggle();
    });

    // Auto unlock audio on first page click / tap anywhere
    const unlock = () => {
      if (!this.isPlaying) {
        this.play();
      }
      window.removeEventListener('pointerdown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playNote(freq, duration = 1.4, timeOffset = 0) {
    const ctx = this.getAudioContext();
    const now = ctx.currentTime + timeOffset;

    // Dual oscillator for rich, warm music box / chime timbre
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 2.002, now); // soft harmonic shimmer

    // ADSR Envelope: gentle pluck & long sweet decay
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  startMelody() {
    const step = () => {
      if (!this.isPlaying) return;
      const noteIdx = this.melody[this.melodyIndex % this.melody.length];
      const freq = this.notes[noteIdx];
      
      this.playNote(freq, 2.2);

      // Add gentle bass chord accompaniment every 4 beats
      if (this.melodyIndex % 4 === 0) {
        this.playNote(this.notes[0] * 0.5, 3.5);
      } else if (this.melodyIndex % 4 === 2) {
        this.playNote(this.notes[3] * 0.5, 3.0);
      }

      this.melodyIndex++;
      this.synthTimer = setTimeout(step, 450);
    };

    step();
  }

  play() {
    this.isPlaying = true;
    this.getAudioContext();
    this.startMelody();
    this.container.classList.add('audio-playing');
    const label = this.container.querySelector('.audio-label');
    if (label) label.textContent = 'Nhạc: Bật';
  }

  pause() {
    this.isPlaying = false;
    if (this.synthTimer) clearTimeout(this.synthTimer);
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
