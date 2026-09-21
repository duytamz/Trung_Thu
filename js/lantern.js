/**
 * Lantern 3D Component - Lồng đèn hoa ngôi sao & Chú gấu bông tình yêu
 */
export class Lantern {
  constructor(containerId, onLanternClick, skyCanvas) {
    this.container = document.getElementById(containerId);
    this.onLanternClick = onLanternClick;
    this.skyCanvas = skyCanvas;
    
    this.pivot = null;
    this.targetRotateX = 0;
    this.targetRotateY = 0;
    this.targetRotateZ = 0;
    this.currentRotateX = 0;
    this.currentRotateY = 0;
    this.currentRotateZ = 0;
    
    this.isDragging = false;
    this.lastPointerX = 0;
    
    this.render();
    this.bindEvents();
    this.startPhysicsLoop();
  }

  render() {
    this.container.innerHTML = `
      <div class="lantern-pivot" id="lantern-pivot">
        <!-- Ambient Aura Glow -->
        <div class="lantern-aura"></div>

        <!-- 5-Point Star Body with Floral Layers -->
        <div class="star-body">
          <svg class="star-svg" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <!-- Star Glow Filter -->
              <filter id="star-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <!-- Petal Gradients -->
              <linearGradient id="gold-petal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fff8d6" />
                <stop offset="50%" stop-color="#ffdd59" />
                <stop offset="100%" stop-color="#f59e0b" />
              </linearGradient>
              <linearGradient id="rose-petal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffd2db" />
                <stop offset="50%" stop-color="#ff758c" />
                <stop offset="100%" stop-color="#e84118" />
              </linearGradient>
              <linearGradient id="orange-petal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffeaa7" />
                <stop offset="60%" stop-color="#ff9f43" />
                <stop offset="100%" stop-color="#ee5253" />
              </linearGradient>
              <linearGradient id="star-core" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fffbe6" />
                <stop offset="100%" stop-color="#fef08a" />
              </linearGradient>
            </defs>

            <!-- Base 5-Point Star Frame -->
            <polygon points="150,15 188,105 285,108 208,168 238,260 150,205 62,260 92,168 15,108 112,105"
              fill="url(#star-core)" stroke="#f7b731" stroke-width="5" stroke-linejoin="round"
              filter="url(#star-glow)" />

            <!-- Outer Flower Petals Clusters around Star Points -->
            <!-- Top Point Flowers -->
            <g transform="translate(150, 30)">
              <circle cx="-12" cy="0" r="14" fill="url(#rose-petal)" opacity="0.95" />
              <circle cx="12" cy="0" r="14" fill="url(#rose-petal)" opacity="0.95" />
              <circle cx="0" cy="-12" r="15" fill="url(#gold-petal)" />
              <circle cx="0" cy="10" r="12" fill="url(#orange-petal)" />
              <circle cx="0" cy="0" r="8" fill="#fff" />
            </g>

            <!-- Top Right Point Flowers -->
            <g transform="translate(260, 115)">
              <circle cx="-10" cy="-8" r="14" fill="url(#gold-petal)" />
              <circle cx="8" cy="-6" r="14" fill="url(#rose-petal)" />
              <circle cx="0" cy="8" r="15" fill="url(#orange-petal)" />
              <circle cx="0" cy="0" r="8" fill="#fffbe6" />
            </g>

            <!-- Bottom Right Point Flowers -->
            <g transform="translate(225, 235)">
              <circle cx="-8" cy="-10" r="14" fill="url(#rose-petal)" />
              <circle cx="10" cy="-4" r="14" fill="url(#gold-petal)" />
              <circle cx="-4" cy="8" r="15" fill="url(#orange-petal)" />
              <circle cx="0" cy="0" r="8" fill="#fff" />
            </g>

            <!-- Bottom Left Point Flowers -->
            <g transform="translate(75, 235)">
              <circle cx="8" cy="-10" r="14" fill="url(#orange-petal)" />
              <circle cx="-10" cy="-4" r="14" fill="url(#rose-petal)" />
              <circle cx="4" cy="8" r="15" fill="url(#gold-petal)" />
              <circle cx="0" cy="0" r="8" fill="#fff" />
            </g>

            <!-- Top Left Point Flowers -->
            <g transform="translate(40, 115)">
              <circle cx="10" cy="-8" r="14" fill="url(#gold-petal)" />
              <circle cx="-8" cy="-6" r="14" fill="url(#rose-petal)" />
              <circle cx="0" cy="8" r="15" fill="url(#orange-petal)" />
              <circle cx="0" cy="0" r="8" fill="#fffbe6" />
            </g>

            <!-- Mid-Edge Daisy / Baby's Breath Accents -->
            <g fill="#ffffff" opacity="0.9">
              <circle cx="115" cy="65" r="7" /><circle cx="185" cy="65" r="7" />
              <circle cx="240" cy="170" r="8" /><circle cx="60" cy="170" r="8" />
              <circle cx="150" cy="225" r="9" />
            </g>
          </svg>

          <!-- Fairy Lights Strings Dots -->
          <div class="fairy-lights-layer">
            <div class="fairy-bulb" style="top: 10px; left: 145px;"></div>
            <div class="fairy-bulb" style="top: 95px; left: 275px;"></div>
            <div class="fairy-bulb" style="top: 245px; left: 228px;"></div>
            <div class="fairy-bulb" style="top: 245px; left: 62px;"></div>
            <div class="fairy-bulb" style="top: 95px; left: 15px;"></div>
            <div class="fairy-bulb" style="top: 98px; left: 108px;"></div>
            <div class="fairy-bulb" style="top: 98px; left: 182px;"></div>
            <div class="fairy-bulb" style="top: 160px; left: 200px;"></div>
            <div class="fairy-bulb" style="top: 160px; left: 90px;"></div>
            <div class="fairy-bulb" style="top: 195px; left: 145px;"></div>
          </div>

          <!-- Adorable Plush Teddy Bear nestled in Center -->
          <div class="plush-bear-wrapper">
            <svg class="plush-bear-svg" viewBox="0 0 160 170" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="bear-fur" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stop-color="#dfa069" />
                  <stop offset="70%" stop-color="#b8743a" />
                  <stop offset="100%" stop-color="#8d4f20" />
                </radialGradient>
                <radialGradient id="bear-snout" cx="50%" cy="40%" r="50%">
                  <stop offset="0%" stop-color="#fff0df" />
                  <stop offset="100%" stop-color="#ecc69f" />
                </radialGradient>
                <linearGradient id="heart-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ff758c" />
                  <stop offset="100%" stop-color="#ff3366" />
                </linearGradient>
              </defs>

              <!-- Left Ear -->
              <circle cx="45" cy="40" r="22" fill="url(#bear-fur)" />
              <circle cx="45" cy="40" r="13" fill="#f8c89c" />

              <!-- Right Ear -->
              <circle cx="115" cy="40" r="22" fill="url(#bear-fur)" />
              <circle cx="115" cy="40" r="13" fill="#f8c89c" />

              <!-- Bear Head -->
              <circle cx="80" cy="72" r="44" fill="url(#bear-fur)" />

              <!-- Cute Eyes with Twinkle -->
              <ellipse cx="64" cy="65" rx="5" ry="6" fill="#2d1d14" />
              <circle cx="62" cy="63" r="2" fill="#ffffff" />

              <ellipse cx="96" cy="65" rx="5" ry="6" fill="#2d1d14" />
              <circle cx="94" cy="63" r="2" fill="#ffffff" />

              <!-- Blushing Cheeks -->
              <ellipse cx="54" cy="77" rx="9" ry="5" fill="#ff7675" opacity="0.6" />
              <ellipse cx="106" cy="77" rx="9" ry="5" fill="#ff7675" opacity="0.6" />

              <!-- Snout & Nose -->
              <ellipse cx="80" cy="80" rx="19" ry="14" fill="url(#bear-snout)" />
              <path d="M74,74 Q80,70 86,74 Q80,82 74,74" fill="#3e2312" />
              <path d="M80,78 L80,84 M76,84 Q80,88 84,84" stroke="#3e2312" stroke-width="2.5" stroke-linecap="round" fill="none" />

              <!-- Bear Body -->
              <ellipse cx="80" cy="122" rx="36" ry="32" fill="url(#bear-fur)" />

              <!-- Cute Bear Hands Holding Shining Heart -->
              <!-- Heart -->
              <path d="M80,112 C74,102 60,102 60,115 C60,128 80,138 80,138 C80,138 100,128 100,115 C100,102 86,102 80,112 Z"
                fill="url(#heart-glow)" filter="drop-shadow(0 0 8px #ff758c)" />

              <!-- Left Paw -->
              <ellipse cx="58" cy="116" rx="14" ry="11" fill="url(#bear-fur)" transform="rotate(20 58 116)" />
              <!-- Right Paw -->
              <ellipse cx="102" cy="116" rx="14" ry="11" fill="url(#bear-fur)" transform="rotate(-20 102 116)" />
            </svg>
          </div>
        </div>

        <!-- Wooden Handle Stick -->
        <div class="lantern-stick">
          <div class="stick-joint"></div>
          <!-- Hanging Red Silk Tassel -->
          <div class="hanging-tassel">
            <div class="tassel-ring"></div>
            <div class="tassel-knot"></div>
            <div class="tassel-threads"></div>
          </div>
        </div>

        <!-- Tap Hint underneath -->
        <div class="lantern-hint">✨ Chạm vào lồng đèn để mở quà ✨</div>
      </div>
    `;

    this.pivot = document.getElementById('lantern-pivot');
  }

  bindEvents() {
    // Parallax mouse tilt
    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) return;
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      
      this.targetRotateY = normX * 14;
      this.targetRotateX = -normY * 10;
      this.targetRotateZ = normX * 6;
    });

    // Device orientation (Mobile tilt)
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          const tiltX = Math.max(-25, Math.min(25, e.gamma));
          const tiltY = Math.max(-25, Math.min(25, e.beta - 45));
          this.targetRotateY = (tiltX / 25) * 12;
          this.targetRotateX = (-tiltY / 25) * 8;
          this.targetRotateZ = (tiltX / 25) * 5;
        }
      });
    }

    // Touch swing gesture
    this.container.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.lastPointerX = e.clientX;
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.lastPointerX;
      this.targetRotateZ = Math.max(-25, Math.min(25, deltaX * 0.2));
      this.targetRotateY = Math.max(-20, Math.min(20, deltaX * 0.15));
    });

    window.addEventListener('pointerup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.targetRotateZ = 0;
        this.targetRotateY = 0;
      }
    });

    // Click / Tap on Lantern
    this.container.addEventListener('click', (e) => {
      const rect = this.container.getBoundingClientRect();
      const clickX = rect.left + rect.width * 0.5;
      const clickY = rect.top + rect.height * 0.45;

      // Burst sparkles
      if (this.skyCanvas) {
        this.skyCanvas.createSparkleBurst(clickX, clickY, 35);
      }

      // Bump scale animation
      this.pivot.style.transform = `scale(1.12) rotateX(${this.currentRotateX}deg) rotateY(${this.currentRotateY}deg) rotateZ(${this.currentRotateZ}deg)`;
      setTimeout(() => {
        this.pivot.style.transform = '';
      }, 300);

      if (this.onLanternClick) {
        this.onLanternClick();
      }
    });
  }

  startPhysicsLoop() {
    const update = () => {
      // Spring lerp towards target
      this.currentRotateX += (this.targetRotateX - this.currentRotateX) * 0.08;
      this.currentRotateY += (this.targetRotateY - this.currentRotateY) * 0.08;
      this.currentRotateZ += (this.targetRotateZ - this.currentRotateZ) * 0.08;

      if (this.pivot) {
        this.pivot.style.transform = `rotateX(${this.currentRotateX}deg) rotateY(${this.currentRotateY}deg) rotateZ(${this.currentRotateZ}deg)`;
      }

      requestAnimationFrame(update);
    };
    update();
  }
}
