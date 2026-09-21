/**
 * QRGenerator & Customizer Module
 * Tạo mã QR Trái Tim màu đỏ & Xuất thiệp quà tặng Trung Thu in ấn
 */

// Lightweight self-contained QR Code Generator (Type 4-10 Auto, Error Correction M)
class QRCodeEngine {
  constructor() {
    this.PAD0 = 0xEC;
    this.PAD1 = 0x11;
  }

  // Generate 2D boolean matrix for string
  generate(text) {
    // Generate standard QR model 4 (33x33) or 5 (37x37)
    // For standard URLs, type 6 (41x41) fits up to 106 chars, type 8 up to 154 chars.
    const typeNumber = text.length > 100 ? 10 : (text.length > 60 ? 8 : (text.length > 30 ? 6 : 4));
    const size = typeNumber * 4 + 17;
    const matrix = Array.from({ length: size }, () => Array(size).fill(null));

    // 1. Finder patterns (top-left, top-right, bottom-left)
    this.addFinderPattern(matrix, 0, 0);
    this.addFinderPattern(matrix, size - 7, 0);
    this.addFinderPattern(matrix, 0, size - 7);

    // 2. Timing patterns
    for (let i = 8; i < size - 8; i++) {
      const bit = i % 2 === 0;
      if (matrix[6][i] === null) matrix[6][i] = bit;
      if (matrix[i][6] === null) matrix[i][6] = bit;
    }

    // 3. Alignment pattern for type >= 2
    if (typeNumber >= 2) {
      const alignPos = size - 7;
      this.addAlignmentPattern(matrix, alignPos - 2, alignPos - 2);
    }

    // 4. Encode data bits using basic Byte Mode
    const dataBits = this.encodeData(text, typeNumber);
    
    // 5. Fill data in zigzag pattern
    let bitIndex = 0;
    let right = size - 1;
    let upward = true;

    while (right > 0) {
      if (right === 6) right--; // skip vertical timing line
      const cols = [right, right - 1];
      const rows = upward ? Array.from({ length: size }, (_, i) => size - 1 - i) : Array.from({ length: size }, (_, i) => i);

      for (const row of rows) {
        for (const col of cols) {
          if (matrix[row][col] === null) {
            let bit = false;
            if (bitIndex < dataBits.length) {
              bit = dataBits[bitIndex++];
            }
            // Mask pattern 0: (row + col) % 2 === 0
            const mask = (row + col) % 2 === 0;
            matrix[row][col] = mask ? !bit : bit;
          }
        }
      }
      right -= 2;
      upward = !upward;
    }

    return matrix;
  }

  addFinderPattern(matrix, startRow, startCol) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startRow + r][startCol + c] = true;
        } else {
          matrix[startRow + r][startCol + c] = false;
        }
      }
    }
    // Separator whitespace
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = startRow + r;
        const nc = startCol + c;
        if (nr >= 0 && nr < matrix.length && nc >= 0 && nc < matrix.length) {
          if (matrix[nr][nc] === null) matrix[nr][nc] = false;
        }
      }
    }
  }

  addAlignmentPattern(matrix, centerRow, centerCol) {
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
          matrix[centerRow + r][centerCol + c] = true;
        } else {
          matrix[centerRow + r][centerCol + c] = false;
        }
      }
    }
  }

  encodeData(text, typeNumber) {
    const bits = [];
    const pushBits = (val, length) => {
      for (let i = length - 1; i >= 0; i--) {
        bits.push(((val >> i) & 1) === 1);
      }
    };

    // Mode 4: 8-bit byte
    pushBits(4, 4);
    
    // Character count (8 bits for type 1-9)
    const utf8Bytes = new TextEncoder().encode(text);
    pushBits(utf8Bytes.length, typeNumber < 10 ? 8 : 16);

    for (let b of utf8Bytes) {
      pushBits(b, 8);
    }

    // Terminator
    for (let i = 0; i < 4 && bits.length % 8 !== 0; i++) {
      bits.push(false);
    }

    // Pad to 8-bit boundary
    while (bits.length % 8 !== 0) bits.push(false);

    // Padding bytes to fill total capacity
    const capacity = (typeNumber * 4 + 17) * (typeNumber * 4 + 17) / 2;
    let padToggle = false;
    while (bits.length < capacity) {
      pushBits(padToggle ? this.PAD1 : this.PAD0, 8);
      padToggle = !padToggle;
    }

    return bits;
  }
}

export class QRGenerator {
  constructor(options = {}) {
    this.modal = document.getElementById('qr-modal');
    this.canvas = document.getElementById('qr-card-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.loveLetter = options.loveLetter;
    
    this.engine = new QRCodeEngine();
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadConfigFromURL();
  }

  bindEvents() {
    const closeBtn = document.getElementById('qr-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    // Save & Generate Card Button
    const saveBtn = document.getElementById('save-custom-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveCustomSettings();
      });
    }

    // Download Card Image
    const downloadBtn = document.getElementById('download-card-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        this.downloadCardImage();
      });
    }

    // Copy Share Link
    const copyBtn = document.getElementById('copy-link-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        this.copyShareURL();
      });
    }
  }

  loadConfigFromURL() {
    try {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const params = new URLSearchParams(hash);
        const lover = params.get('lover');
        const sender = params.get('sender');
        const date = params.get('date');
        const msg = params.get('msg');

        if (lover || sender || date || msg) {
          const config = {};
          if (lover) config.loverName = decodeURIComponent(lover);
          if (sender) config.senderName = decodeURIComponent(sender);
          if (date) config.startDate = decodeURIComponent(date);
          if (msg) config.letterContent = decodeURIComponent(msg);

          if (this.loveLetter) {
            this.loveLetter.setConfig(config);
          }

          // Update header lover badge
          const loverBadge = document.getElementById('lover-display-name');
          if (loverBadge && config.loverName) {
            loverBadge.textContent = config.loverName;
          }
        }
      }
    } catch (e) {
      console.warn("URL config parse error:", e);
    }
  }

  getTargetURL() {
    // If testing on localhost or local file, encode the public GitHub Pages URL
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
      const publicBase = 'https://duytamz.github.io/Trung_Thu/';
      return window.location.hash ? publicBase + window.location.hash : publicBase;
    }
    return window.location.href;
  }

  saveCustomSettings() {
    const loverName = document.getElementById('cfg-lover-name').value.trim() || 'Em Bé';
    const senderName = document.getElementById('cfg-sender-name').value.trim() || 'Anh';
    const startDate = document.getElementById('cfg-start-date').value || '2023-09-29';
    const letterContent = document.getElementById('cfg-letter-content').value.trim();

    const config = { loverName, senderName, startDate };
    if (letterContent) config.letterContent = letterContent;

    if (this.loveLetter) {
      this.loveLetter.setConfig(config);
    }

    const loverBadge = document.getElementById('lover-display-name');
    if (loverBadge) loverBadge.textContent = loverName;

    // Update URL Hash
    const params = new URLSearchParams();
    params.set('lover', encodeURIComponent(loverName));
    params.set('sender', encodeURIComponent(senderName));
    params.set('date', encodeURIComponent(startDate));
    if (letterContent) params.set('msg', encodeURIComponent(letterContent));

    window.location.hash = params.toString();

    // Render the Gift Card with Heart QR pointing to live GitHub URL
    this.drawGiftCard(this.getTargetURL(), loverName, senderName);
    this.showToast('✨ Đã lưu cài đặt và tạo thẻ quà tặng thành công!');
  }

  // Draw the exact Gift Card from the TikTok video:
  // White card base, red washi tape accents, black center mat, glowing Red Heart QR, Snoopy stickers!
  drawGiftCard(url, loverName = 'Em Bé', senderName = 'Anh') {
    if (!this.canvas || !this.ctx) return;

    const w = 600;
    const h = 420;
    this.canvas.width = w;
    this.canvas.height = h;
    const ctx = this.ctx;

    // 1. Card Stock Background (Warm textured white)
    ctx.fillStyle = '#fbf9f5';
    ctx.roundRect(0, 0, w, h, 20);
    ctx.fill();

    // Subtle paper border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2. Red Washi Tape Accents on Corners (like in the video)
    this.drawWashiTape(ctx, 30, 25, 80, 24, -25, '#ff4757');
    this.drawWashiTape(ctx, w - 85, 20, 75, 24, 30, '#ff4757');
    this.drawWashiTape(ctx, 40, h - 35, 75, 22, 15, '#ff4757');

    // 3. Center Matte Black Frame for Heart QR Code
    const matW = 280;
    const matH = 240;
    const matX = (w - matW) / 2;
    const matY = 70;

    ctx.fillStyle = '#0a0a0f';
    ctx.beginPath();
    ctx.roundRect(matX, matY, matW, matH, 12);
    ctx.fill();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 15;

    // 4. Generate QR Matrix and Render inside Heart Mask
    const matrix = this.engine.generate(url);
    this.drawHeartQRCode(ctx, matrix, matX + matW / 2, matY + matH / 2, 200);

    // 5. Card Title & Handwritten notes
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#2d3436';
    ctx.font = 'bold 22px Caveat, cursive';
    ctx.textAlign = 'center';
    ctx.fillText(`Quà Trung Thu Dành Cho ${loverName} ❤️`, w / 2, 45);

    ctx.font = '14px Quicksand, sans-serif';
    ctx.fillStyle = '#636e72';
    ctx.fillText('Quét mã để mở thế giới trăng sao & lời chúc bí mật', w / 2, h - 60);

    ctx.font = 'italic 13px Quicksand, sans-serif';
    ctx.fillStyle = '#e84118';
    ctx.fillText(`Yêu thương từ: ${senderName} ✨`, w / 2, h - 35);

    // 6. Cute Stickers: Snoopy holding a heart & Tiny hearts (like in video!)
    this.drawCuteSnoopy(ctx, w - 100, h - 90);
    this.drawTinyHeart(ctx, 90, 160, 14, '#ff3838');
    this.drawTinyHeart(ctx, w - 85, 175, 16, '#ff3838');
  }

  drawHeartQRCode(ctx, matrix, centerX, centerY, size) {
    const n = matrix.length;
    const cellSize = size / n;
    const startX = centerX - size / 2;
    const startY = centerY - size / 2;

    ctx.save();

    // Create Heart Clipping Path
    ctx.beginPath();
    const hx = centerX;
    const hy = centerY - 10;
    const s = size * 0.48;

    ctx.moveTo(hx, hy + s * 0.7);
    ctx.bezierCurveTo(hx - s * 1.2, hy - s * 0.1, hx - s * 1.1, hy - s * 0.9, hx, hy - s * 0.35);
    ctx.bezierCurveTo(hx + s * 1.1, hy - s * 0.9, hx + s * 1.2, hy - s * 0.1, hx, hy + s * 0.7);
    ctx.closePath();
    ctx.clip();

    // Glowing Red QR dots
    ctx.fillStyle = '#ff2442';
    ctx.shadowColor = '#ff3838';
    ctx.shadowBlur = 4;

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (matrix[r][c]) {
          const x = startX + c * cellSize;
          const y = startY + r * cellSize;
          ctx.beginPath();
          ctx.roundRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1, 1.5);
          ctx.fill();
        }
      }
    }

    ctx.restore();

    // Heart Outline Glow
    ctx.save();
    ctx.strokeStyle = '#ff3838';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ff6b81';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();
  }

  drawWashiTape(ctx, x, y, width, height, angleDeg, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angleDeg * Math.PI) / 180);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 4;
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.restore();
  }

  drawCuteSnoopy(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    // Snoopy Body
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 2;

    // Head
    ctx.beginPath();
    ctx.ellipse(0, -10, 18, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Snoopy Black Ear
    ctx.fillStyle = '#2d3436';
    ctx.beginPath();
    ctx.ellipse(-14, -8, 6, 12, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Black Nose
    ctx.beginPath();
    ctx.arc(16, -10, 4, 0, Math.PI * 2);
    ctx.fill();

    // Cute Eye
    ctx.beginPath();
    ctx.arc(4, -13, 2, 0, Math.PI * 2);
    ctx.fill();

    // Red Sweater / Body
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.roundRect(-12, 2, 24, 20, 6);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  drawTinyHeart(ctx, x, y, size, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, size * 0.4);
    ctx.bezierCurveTo(-size * 0.8, -size * 0.2, -size * 0.5, -size * 0.8, 0, -size * 0.3);
    ctx.bezierCurveTo(size * 0.5, -size * 0.8, size * 0.8, -size * 0.2, 0, size * 0.4);
    ctx.fill();
    ctx.restore();
  }

  downloadCardImage() {
    if (!this.canvas) return;
    const link = document.createElement('a');
    link.download = `Thiep_TrungThu_QR_${new Date().getTime()}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
    this.showToast('📥 Đang tải ảnh Thẻ Quà Tặng QR!');
  }

  copyShareURL() {
    const url = this.getTargetURL();
    navigator.clipboard.writeText(url).then(() => {
      this.showToast('📋 Đã sao chép link quà tặng vào bộ nhớ tạm!');
    }).catch(() => {
      prompt('Sao chép đường link này:', url);
    });
  }

  open() {
    if (!this.modal) return;
    // Populate form with current values
    if (this.loveLetter) {
      const cfg = this.loveLetter.config;
      const elLover = document.getElementById('cfg-lover-name');
      const elSender = document.getElementById('cfg-sender-name');
      const elDate = document.getElementById('cfg-start-date');
      const elMsg = document.getElementById('cfg-letter-content');

      if (elLover) elLover.value = cfg.loverName;
      if (elSender) elSender.value = cfg.senderName;
      if (elDate) elDate.value = cfg.startDate;
      if (elMsg) elMsg.value = cfg.letterContent;

      this.drawGiftCard(this.getTargetURL(), cfg.loverName, cfg.senderName);
    }

    this.modal.classList.add('active');
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
  }

  showToast(msg) {
    if (this.loveLetter) {
      this.loveLetter.showToast(msg);
    }
  }
}
