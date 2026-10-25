/**
 * Main Operating System Initialization & Background Particle Canvas
 */
document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initLiveClock();
  
  // Audio Mute Button
  const muteBtn = document.getElementById('muteToggleBtn');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      const isMuted = audioSynth.toggleMute();
      muteBtn.innerHTML = isMuted ? '🔇 Audio: OFF' : '🔊 Audio: ON';
    });
  }

  // Initial Data Load
  if (window.loadDashboardData) {
    window.loadDashboardData();
  }

  // Telemetry Polling Loop every 4 seconds
  setInterval(() => {
    if (window.loadDashboardData) {
      window.loadDashboardData();
    }
  }, 4000);
});

// Live Sci-Fi Clock
function initLiveClock() {
  const clockEl = document.getElementById('hudLiveClock');
  const dateEl = document.getElementById('hudLiveDate');
  const uptimeEl = document.getElementById('hudUptime');

  let startTime = Date.now();

  function update() {
    const now = new Date();
    if (clockEl) clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

    if (uptimeEl) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const m = Math.floor(elapsed / 60);
      const s = elapsed % 60;
      uptimeEl.textContent = `UPTIME: ${m}m ${s}s`;
    }
  }

  update();
  setInterval(update, 1000);
}

// Particle Canvas Effect
function initParticleCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.1
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw particle lines
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 243, 255, ${0.15 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 243, 255, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}
