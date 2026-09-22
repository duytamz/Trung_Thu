/**
 * Lantern 3D Component - Lồng đèn hoa ngôi sao chân thực & Chú gấu bông tình yêu
 * Redesigned with realistic Bézier-curve petals, multi-layered flowers, fluffy bear, wood-grain handle
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

        <!-- 5-Point Star Body with Realistic Floral Layers -->
        <div class="star-body">
          <svg class="star-svg" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <!-- Star Inner Warm Glow Filter -->
              <filter id="star-inner-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
              <filter id="petal-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)" />
              </filter>
              <filter id="candle-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="12" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <!-- Petal Gradients - Realistic multi-stop -->
              <linearGradient id="peony-pink" x1="0%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stop-color="#ffe0e8" />
                <stop offset="25%" stop-color="#ffb3c6" />
                <stop offset="55%" stop-color="#ff758c" />
                <stop offset="80%" stop-color="#e84393" />
                <stop offset="100%" stop-color="#c0392b" />
              </linearGradient>
              <linearGradient id="peony-deep" x1="0%" y1="0%" x2="100%" y2="80%">
                <stop offset="0%" stop-color="#ffd2db" />
                <stop offset="40%" stop-color="#ff6b8b" />
                <stop offset="75%" stop-color="#d63384" />
                <stop offset="100%" stop-color="#a8174e" />
              </linearGradient>
              <linearGradient id="chrysanth-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fffdf0" />
                <stop offset="30%" stop-color="#ffe066" />
                <stop offset="60%" stop-color="#f7b731" />
                <stop offset="100%" stop-color="#d68910" />
              </linearGradient>
              <linearGradient id="chrysanth-deep" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stop-color="#fff8d6" />
                <stop offset="50%" stop-color="#ffcc33" />
                <stop offset="100%" stop-color="#b87d2b" />
              </linearGradient>
              <linearGradient id="leaf-green" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#b8e994" />
                <stop offset="50%" stop-color="#6ab04c" />
                <stop offset="100%" stop-color="#27632a" />
              </linearGradient>
              <linearGradient id="leaf-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#78e08f" />
                <stop offset="60%" stop-color="#38855b" />
                <stop offset="100%" stop-color="#1e5631" />
              </linearGradient>

              <!-- Star frame gradient -->
              <linearGradient id="star-frame" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fffbe6" />
                <stop offset="35%" stop-color="#ffe599" />
                <stop offset="65%" stop-color="#ffd700" />
                <stop offset="100%" stop-color="#e6a817" />
              </linearGradient>
              <linearGradient id="star-fill" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stop-color="#fff9e3" />
                <stop offset="50%" stop-color="#ffeaa7" />
                <stop offset="100%" stop-color="#fad390" />
              </linearGradient>

              <!-- Inner glow radial (candle light) -->
              <radialGradient id="inner-candle" cx="50%" cy="50%" r="45%">
                <stop offset="0%" stop-color="rgba(255,240,180,0.6)" />
                <stop offset="40%" stop-color="rgba(255,215,112,0.25)" />
                <stop offset="100%" stop-color="rgba(255,200,80,0)" />
              </radialGradient>

              <!-- Bear fur gradients -->
              <radialGradient id="bear-fur-main" cx="50%" cy="35%" r="65%">
                <stop offset="0%" stop-color="#e8b878" />
                <stop offset="40%" stop-color="#d4955a" />
                <stop offset="75%" stop-color="#b5753c" />
                <stop offset="100%" stop-color="#8d5524" />
              </radialGradient>
              <radialGradient id="bear-fur-light" cx="40%" cy="30%" r="50%">
                <stop offset="0%" stop-color="#f0cc8a" />
                <stop offset="60%" stop-color="#d4a05a" />
                <stop offset="100%" stop-color="#a06b30" />
              </radialGradient>
              <radialGradient id="bear-belly" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stop-color="#ffe8c8" />
                <stop offset="60%" stop-color="#f5d5a0" />
                <stop offset="100%" stop-color="#dbb87a" />
              </radialGradient>
              <radialGradient id="bear-snout-grad" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stop-color="#fff5e6" />
                <stop offset="50%" stop-color="#f5dfc0" />
                <stop offset="100%" stop-color="#e8c89a" />
              </radialGradient>
              <linearGradient id="heart-shine" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stop-color="#ff9eb5" />
                <stop offset="40%" stop-color="#ff4477" />
                <stop offset="100%" stop-color="#cc1144" />
              </linearGradient>

              <!-- Wood grain pattern -->
              <pattern id="wood-grain" x="0" y="0" width="14" height="200" patternUnits="userSpaceOnUse">
                <rect width="14" height="200" fill="#b87333" />
                <line x1="2" y1="0" x2="3" y2="200" stroke="#a0622a" stroke-width="0.8" opacity="0.5" />
                <line x1="5" y1="0" x2="6" y2="200" stroke="#c98545" stroke-width="0.5" opacity="0.4" />
                <line x1="8" y1="0" x2="7.5" y2="200" stroke="#9a5c22" stroke-width="0.6" opacity="0.35" />
                <line x1="11" y1="0" x2="12" y2="200" stroke="#d4955a" stroke-width="0.4" opacity="0.3" />
              </pattern>
            </defs>

            <!-- ====== BASE 5-POINT STAR FRAME ====== -->
            <polygon points="170,22 206,118 308,121 226,182 256,278 170,222 84,278 114,182 32,121 134,118"
              fill="url(#star-fill)" stroke="url(#star-frame)" stroke-width="5" stroke-linejoin="round"
              filter="url(#star-inner-glow)" />

            <!-- Inner candle glow overlay -->
            <polygon points="170,22 206,118 308,121 226,182 256,278 170,222 84,278 114,182 32,121 134,118"
              fill="url(#inner-candle)" class="candle-glow-layer" />

            <!-- ====== REALISTIC FLOWERS AT EACH STAR POINT ====== -->

            <!-- ★ TOP POINT — Large Pink Peony -->
            <g transform="translate(170, 28)" filter="url(#petal-shadow)">
              <!-- Outer peony petals (Bézier curves) -->
              <path d="M0,-22 C8,-20 16,-10 14,0 C12,8 4,14 0,10 C-4,14 -12,8 -14,0 C-16,-10 -8,-20 0,-22Z" fill="url(#peony-deep)" opacity="0.85" />
              <path d="M-16,-8 C-14,-16 -6,-22 0,-18 C-2,-12 -8,-6 -16,-8Z" fill="url(#peony-pink)" opacity="0.9" />
              <path d="M16,-8 C14,-16 6,-22 0,-18 C2,-12 8,-6 16,-8Z" fill="url(#peony-pink)" opacity="0.9" />
              <path d="M-12,6 C-16,0 -18,-8 -12,-14 C-8,-8 -6,0 -12,6Z" fill="url(#peony-deep)" opacity="0.8" />
              <path d="M12,6 C16,0 18,-8 12,-14 C8,-8 6,0 12,6Z" fill="url(#peony-deep)" opacity="0.8" />
              <!-- Inner petals (lighter, smaller) -->
              <path d="M0,-14 C5,-12 9,-6 7,0 C5,4 2,7 0,5 C-2,7 -5,4 -7,0 C-9,-6 -5,-12 0,-14Z" fill="#ffd2db" opacity="0.95" />
              <path d="M0,-8 C3,-7 5,-3 4,1 C2,3 0,4 0,3 C0,4 -2,3 -4,1 C-5,-3 -3,-7 0,-8Z" fill="#fff0f3" opacity="0.9" />
              <!-- Pistil center -->
              <circle cx="0" cy="-2" r="4" fill="#ffd32a" />
              <circle cx="-1.5" cy="-3" r="1.2" fill="#ff9f1a" />
              <circle cx="1.5" cy="-1" r="1" fill="#ff9f1a" />
              <circle cx="0" cy="-4" r="0.8" fill="#fff" opacity="0.7" />
            </g>

            <!-- ★ TOP-RIGHT POINT — Golden Chrysanthemum -->
            <g transform="translate(286, 126)" filter="url(#petal-shadow)">
              <!-- Chrysanthemum with many thin petals radiating outward -->
              ${this._generateChrysanthemum(0, 0, 18, 'url(#chrysanth-gold)', 'url(#chrysanth-deep)')}
              <circle cx="0" cy="0" r="5" fill="#e17055" />
              <circle cx="0" cy="-1" r="2" fill="#fff" opacity="0.5" />
            </g>

            <!-- ★ BOTTOM-RIGHT POINT — Pink Peony Cluster -->
            <g transform="translate(244, 258)" filter="url(#petal-shadow)">
              <!-- Main peony -->
              <path d="M0,-18 C6,-16 12,-8 10,0 C8,6 3,10 0,8 C-3,10 -8,6 -10,0 C-12,-8 -6,-16 0,-18Z" fill="url(#peony-pink)" opacity="0.9" />
              <path d="M-12,-4 C-10,-12 -4,-16 0,-12 C-2,-6 -6,-2 -12,-4Z" fill="url(#peony-deep)" opacity="0.85" />
              <path d="M12,-4 C10,-12 4,-16 0,-12 C2,-6 6,-2 12,-4Z" fill="url(#peony-deep)" opacity="0.85" />
              <path d="M0,-10 C4,-9 7,-4 5,1 C3,4 0,5 0,4 C0,5 -3,4 -5,1 C-7,-4 -4,-9 0,-10Z" fill="#ffd2db" opacity="0.9" />
              <circle cx="0" cy="-2" r="3.5" fill="#ffd32a" />
              <circle cx="0" cy="-3" r="1.2" fill="#fff" opacity="0.6" />
              <!-- Small side bud -->
              <g transform="translate(14, -6) scale(0.55)">
                <path d="M0,-12 C4,-10 8,-5 6,1 C4,4 0,6 0,4 C0,6 -4,4 -6,1 C-8,-5 -4,-10 0,-12Z" fill="url(#peony-pink)" />
                <circle cx="0" cy="-2" r="2.5" fill="#ffd32a" />
              </g>
            </g>

            <!-- ★ BOTTOM-LEFT POINT — Golden Chrysanthemum -->
            <g transform="translate(96, 258)" filter="url(#petal-shadow)">
              ${this._generateChrysanthemum(0, 0, 16, 'url(#chrysanth-deep)', 'url(#chrysanth-gold)')}
              <circle cx="0" cy="0" r="4.5" fill="#e17055" />
              <circle cx="0" cy="-1" r="1.8" fill="#fff" opacity="0.5" />
              <!-- Small bud -->
              <g transform="translate(-12, -5) scale(0.5)">
                ${this._generateChrysanthemum(0, 0, 10, 'url(#chrysanth-gold)', 'url(#chrysanth-deep)')}
                <circle cx="0" cy="0" r="3" fill="#e17055" />
              </g>
            </g>

            <!-- ★ TOP-LEFT POINT — Pink Peony -->
            <g transform="translate(54, 126)" filter="url(#petal-shadow)">
              <path d="M0,-20 C7,-18 14,-9 12,0 C10,7 4,12 0,9 C-4,12 -10,7 -12,0 C-14,-9 -7,-18 0,-20Z" fill="url(#peony-deep)" opacity="0.88" />
              <path d="M-14,-5 C-12,-14 -5,-18 0,-14 C-2,-8 -7,-3 -14,-5Z" fill="url(#peony-pink)" opacity="0.9" />
              <path d="M14,-5 C12,-14 5,-18 0,-14 C2,-8 7,-3 14,-5Z" fill="url(#peony-pink)" opacity="0.9" />
              <path d="M0,-12 C5,-10 8,-5 6,1 C4,5 1,7 0,5 C-1,7 -4,5 -6,1 C-8,-5 -5,-10 0,-12Z" fill="#ffe0e8" opacity="0.9" />
              <circle cx="0" cy="-2" r="4" fill="#ffd32a" />
              <circle cx="-1" cy="-3" r="1" fill="#ff9f1a" />
              <circle cx="1" cy="-1" r="1" fill="#ff9f1a" />
            </g>

            <!-- ====== SMALL ACCENT FLOWERS & LEAVES ALONG STAR EDGES ====== -->

            <!-- Leaves between star points -->
            <g filter="url(#petal-shadow)">
              <!-- Top-left edge leaf pair -->
              <path d="M120,72 C115,62 108,56 100,58 C105,65 110,72 120,72Z" fill="url(#leaf-green)" opacity="0.85" />
              <path d="M125,68 C128,58 135,52 140,55 C136,62 130,68 125,68Z" fill="url(#leaf-dark)" opacity="0.8" />

              <!-- Top-right edge leaf pair -->
              <path d="M218,72 C222,62 228,56 236,58 C231,65 226,72 218,72Z" fill="url(#leaf-green)" opacity="0.85" />
              <path d="M212,68 C210,58 204,52 198,55 C202,62 208,68 212,68Z" fill="url(#leaf-dark)" opacity="0.8" />

              <!-- Right edge leaves -->
              <path d="M268,172 C274,166 280,162 284,166 C278,172 272,176 268,172Z" fill="url(#leaf-green)" opacity="0.8" />

              <!-- Left edge leaves -->
              <path d="M72,172 C66,166 60,162 56,166 C62,172 68,176 72,172Z" fill="url(#leaf-green)" opacity="0.8" />

              <!-- Bottom leaves -->
              <path d="M140,248 C136,240 130,236 126,238 C130,244 136,250 140,248Z" fill="url(#leaf-dark)" opacity="0.8" />
              <path d="M200,248 C204,240 210,236 214,238 C210,244 204,250 200,248Z" fill="url(#leaf-dark)" opacity="0.8" />
            </g>

            <!-- Small daisy accent flowers on edges -->
            <g opacity="0.88">
              <!-- Top-left edge daisy -->
              <g transform="translate(108, 70)">
                ${this._generateDaisy(0, 0, 7, '#fff', '#ffe066')}
              </g>
              <!-- Top-right edge daisy -->
              <g transform="translate(232, 70)">
                ${this._generateDaisy(0, 0, 7, '#fff', '#ffe066')}
              </g>
              <!-- Right side daisy -->
              <g transform="translate(272, 168)">
                ${this._generateDaisy(0, 0, 6, '#ffd2db', '#ff758c')}
              </g>
              <!-- Left side daisy -->
              <g transform="translate(68, 168)">
                ${this._generateDaisy(0, 0, 6, '#ffd2db', '#ff758c')}
              </g>
              <!-- Bottom center daisy -->
              <g transform="translate(170, 250)">
                ${this._generateDaisy(0, 0, 8, '#fff', '#ffd32a')}
              </g>
            </g>

            <!-- Baby's breath clusters (small white dots) -->
            <g fill="#ffffff" opacity="0.75">
              <circle cx="95" cy="82" r="2.5" /><circle cx="100" cy="78" r="1.8" />
              <circle cx="240" cy="82" r="2.5" /><circle cx="236" cy="78" r="1.8" />
              <circle cx="280" cy="155" r="2" /><circle cx="276" cy="160" r="1.5" />
              <circle cx="60" cy="155" r="2" /><circle cx="64" cy="160" r="1.5" />
              <circle cx="152" cy="256" r="2.2" /><circle cx="188" cy="256" r="2.2" />
            </g>
          </svg>

          <!-- Fairy Lights Strings Dots (enhanced positions around star) -->
          <div class="fairy-lights-layer">
            <div class="fairy-bulb" style="top: 8px; left: 48%;"></div>
            <div class="fairy-bulb fairy-bulb-pink" style="top: 98px; left: 84%;"></div>
            <div class="fairy-bulb" style="top: 250px; left: 74%;"></div>
            <div class="fairy-bulb fairy-bulb-pink" style="top: 250px; left: 24%;"></div>
            <div class="fairy-bulb" style="top: 98px; left: 12%;"></div>
            <div class="fairy-bulb fairy-bulb-pink" style="top: 100px; left: 36%;"></div>
            <div class="fairy-bulb" style="top: 100px; left: 60%;"></div>
            <div class="fairy-bulb fairy-bulb-pink" style="top: 164px; left: 68%;"></div>
            <div class="fairy-bulb" style="top: 164px; left: 30%;"></div>
            <div class="fairy-bulb fairy-bulb-pink" style="top: 204px; left: 48%;"></div>
            <div class="fairy-bulb" style="top: 55px; left: 30%;"></div>
            <div class="fairy-bulb fairy-bulb-pink" style="top: 55px; left: 66%;"></div>
          </div>

          <!-- Adorable Plush Teddy Bear nestled in Center (redesigned) -->
          <div class="plush-bear-wrapper">
            <svg class="plush-bear-svg" viewBox="0 0 180 190" xmlns="http://www.w3.org/2000/svg">
              <!-- Left Ear -->
              <ellipse cx="48" cy="38" rx="24" ry="22" fill="url(#bear-fur-main)" />
              <ellipse cx="48" cy="38" rx="14" ry="13" fill="#f5d5a0" />
              <ellipse cx="48" cy="38" rx="8" ry="7" fill="#f0bb88" opacity="0.6" />

              <!-- Right Ear -->
              <ellipse cx="132" cy="38" rx="24" ry="22" fill="url(#bear-fur-main)" />
              <ellipse cx="132" cy="38" rx="14" ry="13" fill="#f5d5a0" />
              <ellipse cx="132" cy="38" rx="8" ry="7" fill="#f0bb88" opacity="0.6" />

              <!-- Bear Head (fluffy with fur texture) -->
              <circle cx="90" cy="74" r="48" fill="url(#bear-fur-main)" />
              <!-- Head highlight -->
              <ellipse cx="78" cy="56" rx="22" ry="16" fill="url(#bear-fur-light)" opacity="0.45" />

              <!-- Fluffy cheek fur tufts -->
              <ellipse cx="52" cy="78" rx="10" ry="7" fill="#d4a05a" opacity="0.4" transform="rotate(-15 52 78)" />
              <ellipse cx="128" cy="78" rx="10" ry="7" fill="#d4a05a" opacity="0.4" transform="rotate(15 128 78)" />

              <!-- Big Sparkly Eyes -->
              <g>
                <!-- Left eye -->
                <ellipse cx="72" cy="68" rx="7" ry="8" fill="#1a1005" />
                <ellipse cx="72" cy="67" rx="5.5" ry="6.5" fill="#2d1d14" />
                <!-- Eye sparkle highlights -->
                <circle cx="69" cy="64" r="3" fill="#ffffff" opacity="0.95" />
                <circle cx="75" cy="70" r="1.5" fill="#ffffff" opacity="0.7" />

                <!-- Right eye -->
                <ellipse cx="108" cy="68" rx="7" ry="8" fill="#1a1005" />
                <ellipse cx="108" cy="67" rx="5.5" ry="6.5" fill="#2d1d14" />
                <!-- Eye sparkle highlights -->
                <circle cx="105" cy="64" r="3" fill="#ffffff" opacity="0.95" />
                <circle cx="111" cy="70" r="1.5" fill="#ffffff" opacity="0.7" />
              </g>

              <!-- Cute eyebrows -->
              <path d="M62,57 Q67,53 74,56" stroke="#8d5524" stroke-width="1.8" fill="none" stroke-linecap="round" />
              <path d="M106,56 Q113,53 118,57" stroke="#8d5524" stroke-width="1.8" fill="none" stroke-linecap="round" />

              <!-- Rosy Blushing Cheeks -->
              <ellipse cx="58" cy="82" rx="11" ry="6" fill="#ff7675" opacity="0.5" />
              <ellipse cx="122" cy="82" rx="11" ry="6" fill="#ff7675" opacity="0.5" />

              <!-- Snout -->
              <ellipse cx="90" cy="84" rx="22" ry="16" fill="url(#bear-snout-grad)" />
              <!-- Nose -->
              <path d="M83,77 Q90,72 97,77 Q90,86 83,77Z" fill="#3e2312" />
              <!-- Nose highlight -->
              <ellipse cx="88" cy="75" rx="3" ry="1.5" fill="#5a3a20" opacity="0.6" />
              <!-- Cute smile -->
              <path d="M90,82 L90,90" stroke="#3e2312" stroke-width="2.5" stroke-linecap="round" />
              <path d="M82,90 Q86,96 90,90 Q94,96 98,90" stroke="#3e2312" stroke-width="2.2" stroke-linecap="round" fill="none" />
              <!-- Tongue peek -->
              <ellipse cx="90" cy="93" rx="4" ry="2.5" fill="#ff6b81" opacity="0.7" />

              <!-- Bear Body -->
              <ellipse cx="90" cy="132" rx="40" ry="36" fill="url(#bear-fur-main)" />
              <!-- Belly lighter patch -->
              <ellipse cx="90" cy="130" rx="26" ry="24" fill="url(#bear-belly)" opacity="0.6" />

              <!-- Arms (paws reaching forward to hold heart) -->
              <!-- Left paw -->
              <ellipse cx="60" cy="122" rx="16" ry="12" fill="url(#bear-fur-light)" transform="rotate(25 60 122)" />
              <ellipse cx="54" cy="126" rx="5" ry="4" fill="#f5d5a0" opacity="0.7" />
              <!-- Right paw -->
              <ellipse cx="120" cy="122" rx="16" ry="12" fill="url(#bear-fur-light)" transform="rotate(-25 120 122)" />
              <ellipse cx="126" cy="126" rx="5" ry="4" fill="#f5d5a0" opacity="0.7" />

              <!-- Glowing Heart held by bear -->
              <g class="bear-heart-glow">
                <!-- Heart glow aura -->
                <path d="M90,118 C83,106 66,106 66,120 C66,136 90,148 90,148 C90,148 114,136 114,120 C114,106 97,106 90,118Z"
                  fill="#ff4477" opacity="0.2" filter="url(#candle-glow)" />
                <!-- Main heart -->
                <path d="M90,118 C83,106 66,106 66,120 C66,136 90,148 90,148 C90,148 114,136 114,120 C114,106 97,106 90,118Z"
                  fill="url(#heart-shine)" />
                <!-- Heart highlight -->
                <ellipse cx="78" cy="116" rx="6" ry="4" fill="#ffb3c6" opacity="0.6" transform="rotate(-20 78 116)" />
                <circle cx="82" cy="113" r="2.5" fill="#fff" opacity="0.45" />
              </g>

              <!-- Feet -->
              <ellipse cx="70" cy="162" rx="16" ry="10" fill="url(#bear-fur-main)" />
              <ellipse cx="70" cy="163" rx="10" ry="6" fill="#f5d5a0" opacity="0.5" />
              <ellipse cx="110" cy="162" rx="16" ry="10" fill="url(#bear-fur-main)" />
              <ellipse cx="110" cy="163" rx="10" ry="6" fill="#f5d5a0" opacity="0.5" />
            </svg>
          </div>
        </div>

        <!-- Wooden Handle Stick with wood grain texture -->
        <div class="lantern-stick">
          <div class="stick-joint"></div>
          <!-- Hanging Red Silk Tassel (multi-thread) -->
          <div class="hanging-tassel">
            <div class="tassel-ring"></div>
            <div class="tassel-knot"></div>
            <div class="tassel-thread-group">
              <div class="tassel-thread t1"></div>
              <div class="tassel-thread t2"></div>
              <div class="tassel-thread t3"></div>
              <div class="tassel-thread t4"></div>
              <div class="tassel-thread t5"></div>
              <div class="tassel-thread t6"></div>
              <div class="tassel-thread t7"></div>
            </div>
          </div>
        </div>

        <!-- Tap Hint underneath -->
        <div class="lantern-hint">✨ Chạm vào lồng đèn để mở quà ✨</div>
      </div>
    `;

    this.pivot = document.getElementById('lantern-pivot');
  }

  /** Generate a chrysanthemum flower with many thin radiating petals */
  _generateChrysanthemum(cx, cy, size, fillOuter, fillInner) {
    let petals = '';
    const petalCount = 14;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const tipX = Math.cos(angle) * size;
      const tipY = Math.sin(angle) * size;
      const ctrlDist = size * 0.35;
      const perpAngle = angle + Math.PI / 2;
      const c1x = Math.cos(angle) * ctrlDist + Math.cos(perpAngle) * size * 0.18;
      const c1y = Math.sin(angle) * ctrlDist + Math.sin(perpAngle) * size * 0.18;
      const c2x = Math.cos(angle) * ctrlDist - Math.cos(perpAngle) * size * 0.18;
      const c2y = Math.sin(angle) * ctrlDist - Math.sin(perpAngle) * size * 0.18;

      const fill = i % 2 === 0 ? fillOuter : fillInner;
      petals += `<path d="M${cx},${cy} C${cx + c1x},${cy + c1y} ${cx + tipX * 0.7 + c1x * 0.3},${cy + tipY * 0.7 + c1y * 0.3} ${cx + tipX},${cy + tipY} C${cx + tipX * 0.7 + c2x * 0.3},${cy + tipY * 0.7 + c2y * 0.3} ${cx + c2x},${cy + c2y} ${cx},${cy}Z" fill="${fill}" opacity="0.9" />`;
    }
    // Second inner layer of shorter petals
    const innerCount = 10;
    const innerSize = size * 0.6;
    for (let i = 0; i < innerCount; i++) {
      const angle = (i / innerCount) * Math.PI * 2 + Math.PI / innerCount;
      const tipX = Math.cos(angle) * innerSize;
      const tipY = Math.sin(angle) * innerSize;
      const ctrlDist = innerSize * 0.3;
      const perpAngle = angle + Math.PI / 2;
      const c1x = Math.cos(angle) * ctrlDist + Math.cos(perpAngle) * innerSize * 0.15;
      const c1y = Math.sin(angle) * ctrlDist + Math.sin(perpAngle) * innerSize * 0.15;
      const c2x = Math.cos(angle) * ctrlDist - Math.cos(perpAngle) * innerSize * 0.15;
      const c2y = Math.sin(angle) * ctrlDist - Math.sin(perpAngle) * innerSize * 0.15;

      petals += `<path d="M${cx},${cy} C${cx + c1x},${cy + c1y} ${cx + tipX * 0.7 + c1x * 0.3},${cy + tipY * 0.7 + c1y * 0.3} ${cx + tipX},${cy + tipY} C${cx + tipX * 0.7 + c2x * 0.3},${cy + tipY * 0.7 + c2y * 0.3} ${cx + c2x},${cy + c2y} ${cx},${cy}Z" fill="#fff8d6" opacity="0.75" />`;
    }
    return petals;
  }

  /** Generate a small daisy flower */
  _generateDaisy(cx, cy, size, petalColor, centerColor) {
    let petals = '';
    const count = 6;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const px = Math.cos(angle) * size;
      const py = Math.sin(angle) * size;
      petals += `<ellipse cx="${cx + px * 0.55}" cy="${cy + py * 0.55}" rx="${size * 0.35}" ry="${size * 0.6}" fill="${petalColor}" transform="rotate(${(angle * 180 / Math.PI)} ${cx + px * 0.55} ${cy + py * 0.55})" opacity="0.9" />`;
    }
    petals += `<circle cx="${cx}" cy="${cy}" r="${size * 0.32}" fill="${centerColor}" />`;
    return petals;
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

      // Sparkle burst
      if (this.skyCanvas) {
        this.skyCanvas.createSparkleBurst(clickX, clickY, 35);
        // 🌸 Tung Hoa Blossom Burst effect — full-screen flower explosion
        this.skyCanvas.triggerBlossomBurst(clickX, clickY);
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
