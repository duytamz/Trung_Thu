/**
 * Danmaku System - Dải Ngân Hà Lời Yêu (Mưa lời chúc bay lơ lửng)
 */
export class DanmakuSystem {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.lanes = [15, 50, 85]; // Y offsets for 3 lanes
    this.currentLane = 0;
    this.isRunning = true;
    
    this.defaultWishes = [
      { text: "Trung Thu này có em là điều ngọt ngào nhất ❤️", icon: "🏮" },
      { text: "Ánh trăng sáng vì trời cao, còn anh hạnh phúc vì có em 🌙", icon: "✨" },
      { text: "Trung Thu nào cũng muốn được nắm chặt tay em đi dạo 🧸", icon: "💑" },
      { text: "Chúc em bé của anh một mùa trăng rằm ngập tràn niềm vui 💕", icon: "🧸" },
      { text: "Mùa trăng rằm này, anh chỉ ước có em bên cạnh mãi mãi 🍂", icon: "🌕" },
      { text: "Cảm ơn em vì đã đến và làm cuộc đời anh rực rỡ như đêm rằm ✨", icon: "🌸" },
      { text: "Trăng dưới nước là trăng trên trời, người trước mặt là người trong tim 💖", icon: "🏮" },
      { text: "Gửi đến em ngàn cái ôm ấm áp và trọn vẹn yêu thương 💌", icon: "🧸" }
    ];
    
    this.init();
  }

  init() {
    // Start interval loop to spawn messages
    this.spawnNext();
    this.timer = setInterval(() => {
      if (this.isRunning) {
        this.spawnNext();
      }
    }, 2800);
  }

  spawnNext() {
    const item = this.defaultWishes[Math.floor(Math.random() * this.defaultWishes.length)];
    this.createDanmaku(item.text, item.icon);
  }

  createDanmaku(text, icon = "🏮") {
    if (!this.container) return;
    
    const el = document.createElement('div');
    el.className = 'danmaku-item';
    
    // Choose next lane
    const topY = this.lanes[this.currentLane];
    this.currentLane = (this.currentLane + 1) % this.lanes.length;
    
    el.style.top = `${topY}px`;
    
    // Randomize duration between 12s and 18s for gentle drifting
    const duration = 12 + Math.random() * 6;
    el.style.animationDuration = `${duration}s`;
    
    el.innerHTML = `
      <div class="danmaku-avatar">${icon}</div>
      <div class="danmaku-text">${this.escapeHTML(text)}</div>
    `;
    
    this.container.appendChild(el);
    
    // Clean up element after animation ends
    setTimeout(() => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, duration * 1000 + 500);
  }

  addCustomMessage(text, icon = "💌") {
    this.createDanmaku(text, icon);
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  destroy() {
    this.isRunning = false;
    clearInterval(this.timer);
  }
}
