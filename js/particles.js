// Particles Animation for Modern Portfolio
// =======================================

class ParticleSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        
        this.config = {
            particleCount: 80,
            particleSize: 2,
            connectionDistance: 150,
            particleSpeed: 0.5,
            connectionOpacity: 0.1,
            particleOpacity: 0.6,
            particleColor: '#64ffda',
            connectionColor: '#64ffda',
            interactive: true,
            mouseRadius: 200
        };
        
        this.mouse = {
            x: 0,
            y: 0,
            isActive: false
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    setupCanvas() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        
        this.container.appendChild(this.canvas);
        this.resize();
    }
    
    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Adjust particle count based on screen size
        const area = rect.width * rect.height;
        const baseArea = 1920 * 1080;
        const ratio = Math.min(area / baseArea, 1);
        this.config.particleCount = Math.floor(80 * ratio);
        
        // Recreate particles with new dimensions
        if (this.particles.length > 0) {
            this.createParticles();
        }
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed,
                vy: (Math.random() - 0.5) * this.config.particleSpeed,
                size: Math.random() * this.config.particleSize + 1,
                opacity: Math.random() * this.config.particleOpacity + 0.1,
                originalOpacity: Math.random() * this.config.particleOpacity + 0.1
            });
        }
    }
    
    bindEvents() {
        if (this.config.interactive) {
            this.container.addEventListener('mousemove', (e) => {
                const rect = this.container.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
                this.mouse.isActive = true;
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.mouse.isActive = false;
            });
        }
        
        window.addEventListener('resize', () => {
            this.resize();
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Mouse interaction
            if (this.config.interactive && this.mouse.isActive) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.mouseRadius) {
                    const force = (this.config.mouseRadius - distance) / this.config.mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    
                    particle.vx += Math.cos(angle) * force * 0.01;
                    particle.vy += Math.sin(angle) * force * 0.01;
                    
                    // Enhance opacity near mouse
                    particle.opacity = particle.originalOpacity + force * 0.5;
                } else {
                    // Return to original opacity
                    particle.opacity = particle.originalOpacity;
                }
            }
            
            // Apply velocity damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Maintain minimum velocity
            if (Math.abs(particle.vx) < 0.1) {
                particle.vx = (Math.random() - 0.5) * this.config.particleSpeed;
            }
            if (Math.abs(particle.vy) < 0.1) {
                particle.vy = (Math.random() - 0.5) * this.config.particleSpeed;
            }
        });
    }
    
    findConnections() {
        this.connections = [];
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    this.connections.push({
                        p1: this.particles[i],
                        p2: this.particles[j],
                        opacity: (1 - distance / this.config.connectionDistance) * this.config.connectionOpacity
                    });
                }
            }
        }
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = this.config.particleColor;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = this.config.particleColor;
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawConnections() {
        this.connections.forEach(connection => {
            this.ctx.save();
            this.ctx.globalAlpha = connection.opacity;
            this.ctx.strokeStyle = this.config.connectionColor;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(connection.p1.x, connection.p1.y);
            this.ctx.lineTo(connection.p2.x, connection.p2.y);
            this.ctx.stroke();
            this.ctx.restore();
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.findConnections();
        this.drawConnections();
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }
    
    // Public methods for control
    setParticleCount(count) {
        this.config.particleCount = count;
        this.createParticles();
    }
    
    setConnectionDistance(distance) {
        this.config.connectionDistance = distance;
    }
    
    setSpeed(speed) {
        this.config.particleSpeed = speed;
        this.particles.forEach(particle => {
            particle.vx = (Math.random() - 0.5) * speed;
            particle.vy = (Math.random() - 0.5) * speed;
        });
    }
    
    destroy() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Matrix Rain Effect for coding theme
class MatrixRain {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.config = {
            fontSize: 14,
            characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?',
            speed: 50,
            opacity: 0.05,
            color: '#64ffda',
            ...options
        };
        
        this.drops = [];
        this.lastTime = 0;
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.createDrops();
        this.animate();
    }
    
    setupCanvas() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        this.canvas.style.opacity = this.config.opacity;
        
        this.container.appendChild(this.canvas);
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        this.columns = Math.floor(rect.width / this.config.fontSize);
        this.createDrops();
    }
    
    createDrops() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = {
                y: Math.random() * -100,
                speed: Math.random() * 0.5 + 0.5
            };
        }
    }
    
    animate(currentTime = 0) {
        if (currentTime - this.lastTime > this.config.speed) {
            this.update();
            this.draw();
            this.lastTime = currentTime;
        }
        
        requestAnimationFrame((time) => this.animate(time));
    }
    
    update() {
        this.drops.forEach(drop => {
            drop.y += drop.speed;
            
            if (drop.y > this.canvas.height) {
                drop.y = Math.random() * -100;
                drop.speed = Math.random() * 0.5 + 0.5;
            }
        });
    }
    
    draw() {
        // Create trailing effect
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = this.config.color;
        this.ctx.font = `${this.config.fontSize}px monospace`;
        
        this.drops.forEach((drop, i) => {
            const char = this.config.characters.charAt(
                Math.floor(Math.random() * this.config.characters.length)
            );
            
            const x = i * this.config.fontSize;
            this.ctx.fillText(char, x, drop.y);
        });
    }
    
    destroy() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Geometric Shapes Animation
class GeometricShapes {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.config = {
            shapeCount: 15,
            minSize: 30,
            maxSize: 100,
            speed: 0.3,
            rotationSpeed: 0.01,
            opacity: 0.1,
            color: '#64ffda',
            ...options
        };
        
        this.shapes = [];
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.createShapes();
        this.animate();
    }
    
    setupCanvas() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        
        this.container.appendChild(this.canvas);
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    createShapes() {
        this.shapes = [];
        const shapeTypes = ['triangle', 'square', 'pentagon', 'hexagon', 'circle'];
        
        for (let i = 0; i < this.config.shapeCount; i++) {
            this.shapes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * (this.config.maxSize - this.config.minSize) + this.config.minSize,
                type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * this.config.rotationSpeed,
                vx: (Math.random() - 0.5) * this.config.speed,
                vy: (Math.random() - 0.5) * this.config.speed,
                opacity: Math.random() * this.config.opacity
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.shapes.forEach(shape => {
            this.updateShape(shape);
            this.drawShape(shape);
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    updateShape(shape) {
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotation += shape.rotationSpeed;
        
        // Wrap around edges
        if (shape.x < -shape.size) shape.x = this.canvas.width + shape.size;
        if (shape.x > this.canvas.width + shape.size) shape.x = -shape.size;
        if (shape.y < -shape.size) shape.y = this.canvas.height + shape.size;
        if (shape.y > this.canvas.height + shape.size) shape.y = -shape.size;
    }
    
    drawShape(shape) {
        this.ctx.save();
        this.ctx.translate(shape.x, shape.y);
        this.ctx.rotate(shape.rotation);
        this.ctx.globalAlpha = shape.opacity;
        this.ctx.strokeStyle = this.config.color;
        this.ctx.lineWidth = 2;
        
        switch (shape.type) {
            case 'triangle':
                this.drawTriangle(shape.size);
                break;
            case 'square':
                this.drawSquare(shape.size);
                break;
            case 'pentagon':
                this.drawPolygon(shape.size, 5);
                break;
            case 'hexagon':
                this.drawPolygon(shape.size, 6);
                break;
            case 'circle':
                this.drawCircle(shape.size);
                break;
        }
        
        this.ctx.restore();
    }
    
    drawTriangle(size) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, -size / 2);
        this.ctx.lineTo(-size / 2, size / 2);
        this.ctx.lineTo(size / 2, size / 2);
        this.ctx.closePath();
        this.ctx.stroke();
    }
    
    drawSquare(size) {
        this.ctx.beginPath();
        this.ctx.rect(-size / 2, -size / 2, size, size);
        this.ctx.stroke();
    }
    
    drawPolygon(size, sides) {
        this.ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides;
            const x = Math.cos(angle) * size / 2;
            const y = Math.sin(angle) * size / 2;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }
    
    drawCircle(size) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    destroy() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize particles
function createParticles() {
    // Create main particle system for hero section
    const heroParticles = new ParticleSystem('particles');
    
    // Store reference for potential cleanup
    window.portfolioAnimations = {
        particles: heroParticles
    };
    
    // Add performance monitoring
    let frameCount = 0;
    let lastTime = performance.now();
    
    function monitorPerformance() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
            
            // Reduce particle count on low-end devices
            if (fps < 30 && heroParticles.config.particleCount > 20) {
                heroParticles.setParticleCount(Math.max(20, heroParticles.config.particleCount - 10));
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(monitorPerformance);
    }
    
    // Start monitoring after a delay
    setTimeout(monitorPerformance, 5000);
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticleSystem, MatrixRain, GeometricShapes, createParticles };
}

// Make available globally
window.ParticleSystem = ParticleSystem;
window.MatrixRain = MatrixRain;
window.GeometricShapes = GeometricShapes;
window.createParticles = createParticles;
