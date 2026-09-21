/**
 * QRGenerator Module - Tạo thẻ quà tặng mã QR Trái Tim chuẩn Zalo 100%
 */
export class QRGenerator {
  constructor() {
    this.canvas = document.getElementById('qr-card-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
  }

  drawGiftCard(url, loverName = 'Em Bé Của Anh', senderName = 'Anh') {
    if (!this.canvas || !this.ctx) return;

    const w = 620;
    const h = 440;
    this.canvas.width = w;
    this.canvas.height = h;
    const ctx = this.ctx;

    // 1. Outer Card Stock (Warm luxury textured off-white)
    ctx.fillStyle = '#fcfbf7';
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 22);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2. Red Washi Tapes on 3 corners (from TikTok video)
    this.drawWashiTape(ctx, 35, 25, 80, 24, -25, '#ff4757');
    this.drawWashiTape(ctx, w - 85, 22, 75, 24, 28, '#ff4757');
    this.drawWashiTape(ctx, 40, h - 35, 75, 22, 15, '#ff4757');

    // 3. Central Matte Black Frame for Heart QR Code
    const matW = 280;
    const matH = 260;
    const matX = (w - matW) / 2;
    const matY = 70;

    ctx.fillStyle = '#0d0f18';
    ctx.beginPath();
    ctx.roundRect(matX, matY, matW, matH, 16);
    ctx.fill();

    // Subtle golden border around the matting
    ctx.strokeStyle = 'rgba(255, 215, 112, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 4. Generate Standard Scannable QR Code using QRCodeBundle library
    this.generateAndDrawQR(ctx, url, matX + (matW - 210) / 2, matY + (matH - 210) / 2, 210);

    // 5. Card Title & Romantic Handwritten Notes
    ctx.fillStyle = '#2d3436';
    ctx.font = 'bold 24px Caveat, cursive';
    ctx.textAlign = 'center';
    ctx.fillText(`Quà Trung Thu Dành Cho ${loverName} ❤️`, w / 2, 45);

    ctx.font = '500 13.5px Quicksand, sans-serif';
    ctx.fillStyle = '#636e72';
    ctx.fillText('Quét mã trên Zalo / Camera để mở thế giới quà tặng', w / 2, h - 62);

    ctx.font = 'italic 13px Quicksand, sans-serif';
    ctx.fillStyle = '#e84118';
    ctx.fillText(`Yêu thương từ: ${senderName} ✨`, w / 2, h - 38);

    // 6. Cute Stickers: Snoopy holding a heart & floating hearts (matching TikTok video)
    this.drawCuteSnoopy(ctx, w - 100, h - 95);
    this.drawTinyHeart(ctx, 95, 175, 14, '#ff3838');
    this.drawTinyHeart(ctx, w - 90, 190, 16, '#ff3838');
  }

  generateAndDrawQR(ctx, url, qrX, qrY, qrSize) {
    if (window.QRCodeBundle) {
      const tempCanvas = document.createElement('canvas');
      window.QRCodeBundle.toCanvas(tempCanvas, url, {
        errorCorrectionLevel: 'H', // Level H allows central emblem without compromising scanning
        margin: 1,
        color: {
          dark: '#ffffff',
          light: '#0d0f18'
        },
        width: qrSize
      }, (err) => {
        if (!err) {
          this.renderStyledQRWithHeart(ctx, tempCanvas, qrX, qrY, qrSize);
        } else {
          console.error("QR render error:", err);
        }
      });
    }
  }

  renderStyledQRWithHeart(ctx, qrCanvas, x, y, size) {
    ctx.save();
    // Draw QR canvas image
    ctx.drawImage(qrCanvas, x, y, size, size);

    // Overlay glowing red heart icon in the center (supported by Error Correction Level H)
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const heartSize = size * 0.22;

    // Small black rounded backing for heart to keep QR modules clean
    ctx.fillStyle = '#0d0f18';
    ctx.beginPath();
    ctx.arc(centerX, centerY, heartSize * 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Red Heart Emblem
    this.drawRedHeartEmblem(ctx, centerX, centerY, heartSize);
    ctx.restore();
  }

  drawRedHeartEmblem(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#ff1744';
    ctx.shadowColor = '#ff5252';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    const s = size * 0.55;
    ctx.moveTo(0, s * 0.5);
    ctx.bezierCurveTo(-s * 1.1, -s * 0.2, -s * 0.9, -s * 1.1, 0, -s * 0.4);
    ctx.bezierCurveTo(s * 0.9, -s * 1.1, s * 1.1, -s * 0.2, 0, s * 0.5);
    ctx.fill();

    // Tiny shine on heart
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.ellipse(-s * 0.4, -s * 0.4, s * 0.18, s * 0.1, -0.6, 0, Math.PI * 2);
    ctx.fill();

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
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 2;

    // Snoopy Head
    ctx.beginPath();
    ctx.ellipse(0, -10, 18, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Black Ear
    ctx.fillStyle = '#2d3436';
    ctx.beginPath();
    ctx.ellipse(-14, -8, 6, 12, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Black Nose
    ctx.beginPath();
    ctx.arc(16, -10, 4, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.beginPath();
    ctx.arc(4, -13, 2, 0, Math.PI * 2);
    ctx.fill();

    // Red Sweater
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
    link.download = `Thiep_TrungThu_Tang_Be_${new Date().getTime()}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}
