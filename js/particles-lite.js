// Lightweight Particle System - Performance Optimized
// =================================================

class LiteParticleSystem {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    
    // Reduced particle count for better performance
    this.config = {
      particleCount: Math.min(30, Math.floor(window.innerWidth / 40)),
      particleSize: 1.5,
      connectionDistance: 120,
      particleSpeed: 0.3,
      connectionOpacity: 0.08,
      particleOpacity: 0.4,
      particleColor: '#64ffda',
      connectionColor: '#64ffda'
    };
    
    this.mouse = { x: 0, y: 0, isActive: false };
    this.init();
  }
  
  init() {
    this.setupCanvas();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }
  
  setupCanvas() {
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    `;
    
    this.container.appendChild(this.canvas);
    this.resize();
  }
  
  resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limit DPR for performance
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    
    this.ctx.scale(dpr, dpr);
    
    // Adjust particle count based on screen size
    const area = rect.width * rect.height;
    const baseArea = 1920 * 1080;
    const ratio = Math.min(area / baseArea, 1);
    this.config.particleCount = Math.floor(30 * ratio);
    
    if (this.particles.length > 0) {
      this.createParticles();
    }
  }
  
  createParticles() {
    this.particles = [];
    const rect = this.container.getBoundingClientRect();
    
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * this.config.particleSpeed,
        vy: (Math.random() - 0.5) * this.config.particleSpeed,
        size: Math.random() * this.config.particleSize + 0.5,
        opacity: Math.random() * this.config.particleOpacity + 0.1
      });
    }
  }
  
  bindEvents() {
    // Throttled mouse tracking
    let mouseTimeout;
    this.container.addEventListener('mousemove', (e) => {
      clearTimeout(mouseTimeout);
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.isActive = true;
      
      mouseTimeout = setTimeout(() => {
        this.mouse.isActive = false;
      }, 100);
    });
    
    this.container.addEventListener('mouseleave', () => {
      this.mouse.isActive = false;
    });
    
    // Debounced resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.resize(), 250);
    });
  }
  
  updateParticles() {
    const rect = this.container.getBoundingClientRect();
    
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = rect.width;
      if (particle.x > rect.width) particle.x = 0;
      if (particle.y < 0) particle.y = rect.height;
      if (particle.y > rect.height) particle.y = 0;
      
      // Mouse interaction (simplified)
      if (this.mouse.isActive) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx += (dx / distance) * force * 0.005;
          particle.vy += (dy / distance) * force * 0.005;
        }
      }
      
      // Velocity damping
      particle.vx *= 0.995;
      particle.vy *= 0.995;
      
      // Maintain minimum velocity
      if (Math.abs(particle.vx) < 0.05) {
        particle.vx = (Math.random() - 0.5) * this.config.particleSpeed;
      }
      if (Math.abs(particle.vy) < 0.05) {
        particle.vy = (Math.random() - 0.5) * this.config.particleSpeed;
      }
    });
  }
  
  drawParticles() {
    this.ctx.fillStyle = this.config.particleColor;
    
    this.particles.forEach(particle => {
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
  
  drawConnections() {
    this.ctx.strokeStyle = this.config.connectionColor;
    this.ctx.lineWidth = 0.5;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.connectionDistance) {
          const opacity = (1 - distance / this.config.connectionDistance) * this.config.connectionOpacity;
          this.ctx.globalAlpha = opacity;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.updateParticles();
    this.drawConnections();
    this.drawParticles();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Performance-aware particle creation
function createParticles() {
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  
  // Check device capabilities
  const isLowEndDevice = navigator.hardwareConcurrency < 4 || 
                        navigator.deviceMemory < 4 ||
                        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isLowEndDevice) {
    console.log('Skipping particles on low-end device for better performance');
    return;
  }
  
  // Create particle system
  const particles = new LiteParticleSystem('particles');
  
  // Store reference for cleanup
  window.portfolioAnimations = { particles };
  
  // Performance monitoring
  let frameCount = 0;
  let lastTime = performance.now();
  
  function monitorPerformance() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 2000) {
      const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
      
      // Reduce particles if performance is poor
      if (fps < 25 && particles.config.particleCount > 10) {
        particles.config.particleCount = Math.max(10, particles.config.particleCount - 5);
        particles.createParticles();
        console.log(`Reduced particles to ${particles.config.particleCount} for better performance`);
      }
      
      frameCount = 0;
      lastTime = currentTime;
    }
    
    if (particles.animationId) {
      requestAnimationFrame(monitorPerformance);
    }
  }
  
  // Start monitoring after initial load
  setTimeout(monitorPerformance, 3000);
}

// Export for global access
window.createParticles = createParticles;
window.LiteParticleSystem = LiteParticleSystem;