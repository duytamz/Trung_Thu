/**
 * QRGenerator Module - Tạo Bánh Trung Thu 3D Hoàng Kim với Mã QR ở giữa chuẩn Zalo 100%
 */
export class QRGenerator {
  constructor() {
    this.canvas = document.getElementById('qr-card-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.currentMode = 'mooncake'; // 'mooncake' | 'card'
    this.lastParams = {
      url: 'https://duytamz.github.io/Trung_Thu/',
      loverName: 'Em Bé Của Anh',
      senderName: 'Anh'
    };
    
    // Nạp sẵn ảnh bánh trung thu thực tế tối ưu tốc độ (<190KB)
    this.mooncakeImg = new Image();
    this.mooncakeImg.src = 'assets/images/mooncake_base_800.webp';
    this.mooncakeImg.onload = () => {
      if (this.currentMode === 'mooncake') {
        this.render();
      }
    };
  }

  setMode(mode) {
    this.currentMode = mode;
    this.render();
  }

  update(url, loverName, senderName) {
    this.lastParams = {
      url: url || this.lastParams.url,
      loverName: loverName || this.lastParams.loverName,
      senderName: senderName || this.lastParams.senderName
    };
    this.render();
  }

  render() {
    const { url, loverName, senderName } = this.lastParams;
    if (this.currentMode === 'mooncake') {
      this.drawMooncakeQR(url, loverName, senderName);
    } else {
      this.drawGiftCard(url, loverName, senderName);
    }
  }

  /**
   * Chế độ 1: Bánh Trung Thu Hoàng Kim Độc Bản (CHỈ CÓ BÁNH & MÃ QR ĐỒNG NHẤT MÀU NƯỚNG)
   * Tuyệt đối không có chữ, thiệp hay đồ vật ngoại cảnh
   */
  drawMooncakeQR(url, loverName = 'Em Bé Của Anh', senderName = 'Anh') {
    if (!this.canvas || !this.ctx) return;

    // Kích thước vuông 800x800 chuẩn in ấn sắc nét
    const size = 800;
    this.canvas.width = size;
    this.canvas.height = size;
    const ctx = this.ctx;

    // Xóa sạch canvas: Chỉ hiển thị duy nhất Bánh Trung Thu và Mã QR
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const qrSize = 182; // Tỉ lệ cân đối chính xác tại tâm bánh

    // Màu mã QR đồng nhất tuyệt đối với màu bánh trung thu nướng:
    // Nền: #fae1b4 (Màu vỏ bột bánh nướng vàng mật ong)
    // Module: #220b01 (Màu caramel cánh gián nướng kỹ, tương phản quang học 100% quét được)
    const mooncakeQRColors = {
      dark: '#220b01',
      light: '#fae1b4'
    };

    this.generateQRCanvas(
      url,
      qrSize,
      (qrCanvas) => {
        if (this.mooncakeImg && this.mooncakeImg.complete && this.mooncakeImg.naturalWidth > 0) {
          // 1. Vẽ chiếc Bánh Trung Thu độc bản
          ctx.drawImage(this.mooncakeImg, 0, 0, size, size);
          // 2. Vẽ mã QR đồng nhất màu nướng tại tâm bánh
          this.drawQRMedallion(ctx, cx, cy, qrCanvas, qrSize);
        } else {
          // Fallback: Vẽ bánh trung thu 3D procedural với màu sắc đồng nhất
          this.draw3DMooncake(ctx, cx, cy, 330, qrCanvas, qrSize, true);
        }
      },
      mooncakeQRColors
    );
  }

  /**
   * Vẽ khung và mã QR đồng nhất màu nướng tại tâm bánh
   */
  drawQRMedallion(ctx, cx, cy, qrCanvas, qrSize) {
    ctx.save();
    const frameSize = qrSize + 14;
    const halfFrame = frameSize / 2;
    const halfQR = qrSize / 2;

    // Khung viền nướng ấm ăn nhập hoàn hảo với vỏ bánh
    ctx.fillStyle = '#99510e';
    ctx.beginPath();
    ctx.roundRect(cx - halfFrame, cy - halfFrame, frameSize, frameSize, 10);
    ctx.fill();

    ctx.strokeStyle = '#f3c47a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Dán mã QR màu bột nướng mật ong & caramel
    if (qrCanvas) {
      ctx.drawImage(qrCanvas, cx - halfQR, cy - halfQR, qrSize, qrSize);
    }

    // Tâm mã QR: mini seal mật ong với trái tim ấm áp
    this.drawCenterEmblem(ctx, cx, cy, qrSize * 0.20, '#fae1b4');
    ctx.restore();
  }

  /**
   * Chế độ 2: Thẻ Quà Tặng Bánh Trung Thu (Mooncake Gift Card)
   */
  drawGiftCard(url, loverName = 'Em Bé Của Anh', senderName = 'Anh') {
    if (!this.canvas || !this.ctx) return;

    const w = 640;
    const h = 460;
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

    // 2. Red Washi Tapes on corners
    this.drawWashiTape(ctx, 35, 25, 80, 24, -25, '#ff4757');
    this.drawWashiTape(ctx, w - 85, 22, 75, 24, 28, '#ff4757');
    this.drawWashiTape(ctx, 40, h - 35, 75, 22, 15, '#ff4757');

    // 3. Card Title & Romantic Handwritten Notes
    ctx.fillStyle = '#2d3436';
    ctx.font = 'bold 25px Caveat, cursive';
    ctx.textAlign = 'center';
    ctx.fillText(`Quà Trung Thu Dành Cho ${loverName} ❤️`, w / 2, 45);

    // 4. Generate QR and draw central 3D Mooncake
    const cx = w / 2;
    const cy = 222;
    const mooncakeRadius = 142;
    const qrSize = 136;

    this.generateQRCanvas(url, qrSize, (qrCanvas) => {
      this.draw3DMooncake(ctx, cx, cy, mooncakeRadius, qrCanvas, qrSize);

      // Bottom guidance notes
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '600 13.5px Quicksand, sans-serif';
      ctx.fillStyle = '#57606f';
      ctx.fillText('Quét mã ở giữa Bánh Trung Thu trên Zalo / Camera để mở quà', w / 2, h - 55);

      ctx.font = 'italic 13.5px Quicksand, sans-serif';
      ctx.fillStyle = '#e84118';
      ctx.fillText(`Yêu thương từ: ${senderName} ✨`, w / 2, h - 30);
      ctx.restore();

      // Cute Stickers: Snoopy & floating hearts
      this.drawCuteSnoopy(ctx, w - 85, h - 90);
      this.drawTinyHeart(ctx, 95, 210, 15, '#ff3838');
      this.drawTinyHeart(ctx, w - 90, 215, 16, '#ff3838');
    });
  }

  /**
   * Tạo hình Bánh Trung Thu Nướng 3D (3D Golden Baked Mooncake)
   * Với viền múi hoa văn dập nổi chân thực và mã QR ở chính giữa
   */
  draw3DMooncake(ctx, cx, cy, radius, qrCanvas, qrSize) {
    ctx.save();

    const flutes = 16;
    const valleyR = radius * 0.88;
    const peakR = radius;
    const ctrlR = radius * 1.05;
    const da = (Math.PI * 2) / flutes;

    // A. 3D Drop Shadow underneath the Mooncake
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 15;
    ctx.fillStyle = '#4a1700';
    this.createFlutedPath(ctx, cx, cy, flutes, valleyR, ctrlR, da);
    ctx.fill();
    ctx.restore();

    // B. Base Baked Crust Gradient (Màu nướng mật ong vàng óng chân thực)
    const crustGrad = ctx.createRadialGradient(
      cx - radius * 0.22,
      cy - radius * 0.25,
      radius * 0.08,
      cx,
      cy,
      radius * 1.02
    );
    crustGrad.addColorStop(0.0, '#f9be52'); // Vàng mật ong óng ả
    crustGrad.addColorStop(0.25, '#e47d17'); // Nâu vàng nướng trứng
    crustGrad.addColorStop(0.65, '#ab4500'); // Nâu cánh gián truyền thống
    crustGrad.addColorStop(0.88, '#752900'); // Mép viền nướng kỹ
    crustGrad.addColorStop(1.0, '#421400');  // Chân khuôn gỗ cháy nhẹ

    this.createFlutedPath(ctx, cx, cy, flutes, valleyR, ctrlR, da);
    ctx.fillStyle = crustGrad;
    ctx.fill();

    ctx.strokeStyle = '#381000';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // C. 3D Flute Grooves & Highlight Ridges (Đường rãnh múi bánh nổi 3D)
    for (let i = 0; i < flutes; i++) {
      const a1 = i * da;
      const am = a1 + da / 2;

      // Deep groove shadow from inner ring to outer valley
      ctx.beginPath();
      ctx.moveTo(cx + radius * 0.64 * Math.cos(a1), cy + radius * 0.64 * Math.sin(a1));
      ctx.lineTo(cx + valleyR * 0.98 * Math.cos(a1), cy + valleyR * 0.98 * Math.sin(a1));
      ctx.strokeStyle = 'rgba(40, 10, 0, 0.55)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Highlight ridge adjacent to the groove
      const a1_hl = a1 + 0.04;
      ctx.beginPath();
      ctx.moveTo(cx + radius * 0.64 * Math.cos(a1_hl), cy + radius * 0.64 * Math.sin(a1_hl));
      ctx.lineTo(cx + valleyR * 0.97 * Math.cos(a1_hl), cy + valleyR * 0.97 * Math.sin(a1_hl));
      ctx.strokeStyle = 'rgba(255, 235, 175, 0.45)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Egg-wash glaze shine on each flute lobe crest
      const crestR = radius * 0.92;
      const crestX = cx + crestR * Math.cos(am);
      const crestY = cy + crestR * Math.sin(am);
      const hlGrad = ctx.createRadialGradient(crestX, crestY, 1, crestX, crestY, radius * 0.08);
      hlGrad.addColorStop(0, 'rgba(255, 245, 195, 0.45)');
      hlGrad.addColorStop(1, 'rgba(255, 245, 195, 0)');
      ctx.fillStyle = hlGrad;
      ctx.beginPath();
      ctx.arc(crestX, crestY, radius * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }

    // D. Outer Concentric Ring (Vành nổi ngoài)
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.77, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(60, 18, 0, 0.65)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.755, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 225, 130, 0.55)';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // E. 32 Beaded Pearl / Sesame Ring (Chuỗi hạt ngọc dập nổi truyền thống)
    const beadCount = 32;
    const beadR = radius * 0.70;
    const beadSize = radius * 0.022;
    for (let b = 0; b < beadCount; b++) {
      const ba = (b * Math.PI * 2) / beadCount;
      const bx = cx + beadR * Math.cos(ba);
      const by = cy + beadR * Math.sin(ba);

      const bGrad = ctx.createRadialGradient(
        bx - beadSize * 0.3,
        by - beadSize * 0.3,
        beadSize * 0.1,
        bx,
        by,
        beadSize
      );
      bGrad.addColorStop(0, '#fff4c2');
      bGrad.addColorStop(0.5, '#e08316');
      bGrad.addColorStop(1, '#662200');

      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.arc(bx, by, beadSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(40, 10, 0, 0.4)';
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }

    // F. Inner Concentric Ring (Vành nổi trong)
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.64, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(65, 20, 0, 0.65)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.628, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 220, 120, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // G. Traditional Lotus / Cloud Filigree in 4 Corners (Hoa văn sen / vân mây cổ truyền)
    this.drawCornerFiligree(ctx, cx, cy, radius);

    // H. Center QR Medallion (Khung đế đặt mã QR)
    const frameSize = qrSize + 14;
    const halfFrame = frameSize / 2;

    // Deep embossed wooden frame backing
    ctx.fillStyle = uniformColor ? '#99510e' : '#3a1200';
    ctx.beginPath();
    ctx.roundRect(cx - halfFrame, cy - halfFrame, frameSize, frameSize, 14);
    ctx.fill();

    // Golden frame border
    ctx.strokeStyle = uniformColor ? '#f3c47a' : 'rgba(255, 221, 128, 0.85)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // QR background đồng nhất màu nướng
    const halfQR = qrSize / 2;
    ctx.fillStyle = uniformColor ? '#fae1b4' : '#ffffff';
    ctx.beginPath();
    ctx.roundRect(cx - halfQR, cy - halfQR, qrSize, qrSize, 8);
    ctx.fill();

    // Draw the QR Code
    if (qrCanvas) {
      ctx.drawImage(qrCanvas, cx - halfQR, cy - halfQR, qrSize, qrSize);
    }

    // I. Center Heart / Mooncake Emblem (Icon trái tim hoàng kim ở tâm mã QR)
    this.drawCenterEmblem(ctx, cx, cy, qrSize * 0.21, uniformColor ? '#fae1b4' : '#ffffff');

    ctx.restore();
  }

  createFlutedPath(ctx, cx, cy, flutes, valleyR, ctrlR, da) {
    ctx.beginPath();
    const startX = cx + valleyR * Math.cos(0);
    const startY = cy + valleyR * Math.sin(0);
    ctx.moveTo(startX, startY);

    for (let i = 0; i < flutes; i++) {
      const a1 = i * da;
      const a2 = (i + 1) * da;
      const am = (a1 + a2) / 2;

      const ctrlX = cx + ctrlR * Math.cos(am);
      const ctrlY = cy + ctrlR * Math.sin(am);
      const endX = cx + valleyR * Math.cos(a2);
      const endY = cy + valleyR * Math.sin(a2);

      ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
    }
    ctx.closePath();
  }

  drawCornerFiligree(ctx, cx, cy, radius) {
    const angles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    angles.forEach((ang) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);

      const dist = radius * 0.52;
      ctx.translate(0, dist);

      // Lotus petal shape
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.bezierCurveTo(-8, -2, -6, 8, 0, 12);
      ctx.bezierCurveTo(6, 8, 8, -2, 0, -6);

      ctx.fillStyle = 'rgba(255, 220, 130, 0.35)';
      ctx.fill();

      ctx.strokeStyle = 'rgba(70, 20, 0, 0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    });
  }

  drawCenterEmblem(ctx, cx, cy, size, bgColor = '#fae1b4') {
    ctx.save();

    // Vành bảo vệ giữ nguyên độ nhận diện 100% của QR
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.82, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#99510e';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // 3D Red Ruby Heart Icon
    ctx.translate(cx, cy);
    ctx.fillStyle = '#c0392b';
    ctx.shadowColor = '#e74c3c';
    ctx.shadowBlur = 6;

    ctx.beginPath();
    const s = size * 0.55;
    ctx.moveTo(0, s * 0.5);
    ctx.bezierCurveTo(-s * 1.1, -s * 0.2, -s * 0.9, -s * 1.1, 0, -s * 0.4);
    ctx.bezierCurveTo(s * 0.9, -s * 1.1, s * 1.1, -s * 0.2, 0, s * 0.5);
    ctx.fill();

    // Gloss shine on heart
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.ellipse(-s * 0.38, -s * 0.38, s * 0.18, s * 0.09, -0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  generateQRCanvas(url, qrSize, callback, customColor = null) {
    if (!window.QRCodeBundle) {
      console.error('QRCodeBundle library not found!');
      return;
    }

    const tempCanvas = document.createElement('canvas');
    window.QRCodeBundle.toCanvas(
      tempCanvas,
      url,
      {
        errorCorrectionLevel: 'H', // Error correction level H allows center emblem without losing scanning capability
        margin: 1,
        color: customColor || {
          dark: '#000000', // Crisp 100% black modules for instant Zalo/Camera detection
          light: '#ffffff'
        },
        width: qrSize
      },
      (err) => {
        if (!err) {
          callback(tempCanvas);
        } else {
          console.error('QR generation error:', err);
        }
      }
    );
  }

  drawFestiveSparkles(ctx, w, h) {
    ctx.save();
    const sparkles = [
      { x: 50, y: 70, r: 2.2, a: 0.8 },
      { x: w - 60, y: 65, r: 2.5, a: 0.85 },
      { x: 75, y: 190, r: 1.8, a: 0.6 },
      { x: w - 80, y: 210, r: 2.0, a: 0.7 },
      { x: 45, y: 380, r: 1.9, a: 0.75 },
      { x: w - 50, y: 410, r: 2.1, a: 0.7 },
      { x: 90, y: 480, r: 1.5, a: 0.55 },
      { x: w - 95, y: 490, r: 1.6, a: 0.6 }
    ];

    sparkles.forEach((s) => {
      ctx.fillStyle = `rgba(255, 235, 170, ${s.a})`;
      ctx.shadowColor = '#ffeaa7';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      // Tiny cross star spike
      ctx.strokeStyle = `rgba(255, 235, 170, ${s.a * 0.7})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(s.x - s.r * 2.5, s.y);
      ctx.lineTo(s.x + s.r * 2.5, s.y);
      ctx.moveTo(s.x, s.y - s.r * 2.5);
      ctx.lineTo(s.x, s.y + s.r * 2.5);
      ctx.stroke();
    });
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

  downloadCardImage(customName = '') {
    if (!this.canvas) return;
    const lover = (this.lastParams.loverName || 'Be').replace(/\s+/g, '_');
    const prefix = this.currentMode === 'mooncake' ? 'Banh_Trung_Thu_Ma_QR' : 'Thiep_Trung_Thu_Banh_QR';
    const link = document.createElement('a');
    link.download = customName || `${prefix}_Tang_${lover}_${Date.now()}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}
