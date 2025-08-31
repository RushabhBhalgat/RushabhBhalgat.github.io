// Optimized Portfolio JavaScript - Performance First
// ================================================

// Minimal DOM cache for critical elements
const DOM = {
  navbar: null,
  navToggle: null,
  navMenu: null,
  navLinks: null,
  loadingScreen: null,
  typingText: null,
  init() {
    this.navbar = document.getElementById("navbar");
    this.navToggle = document.getElementById("nav-toggle");
    this.navMenu = document.getElementById("nav-menu");
    this.navLinks = document.querySelectorAll(".nav-link");
    this.loadingScreen = document.getElementById("loading-screen");
    this.typingText = document.getElementById("typing-text");
  }
};

// Performance-optimized utilities
const Utils = {
  throttle(func, limit) {
    let inThrottle;
    return function() {
      if (!inThrottle) {
        func.apply(this, arguments);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  debounce(func, wait) {
    let timeout;
    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
  },

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }
};

// Optimized App Controller
class PortfolioApp {
  constructor() {
    this.isLoaded = false;
    this.observers = new Map();
    this.animations = new Map();
    this.init();
  }

  init() {
    // Fast loading screen
    this.showLoading();
    
    // Critical path initialization
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    } else {
      this.onDOMReady();
    }
  }

  onDOMReady() {
    DOM.init();
    
    // Prioritize above-the-fold content
    this.initNavigation();
    this.initTyping();
    
    // Defer non-critical features
    requestIdleCallback(() => {
      this.initScrollEffects();
      this.initIntersectionObserver();
      this.hideLoading();
    });
  }

  showLoading() {
    if (DOM.loadingScreen) {
      DOM.loadingScreen.style.display = 'flex';
    }
  }

  hideLoading() {
    if (DOM.loadingScreen) {
      DOM.loadingScreen.style.opacity = '0';
      setTimeout(() => {
        DOM.loadingScreen.style.display = 'none';
        this.isLoaded = true;
        this.initDeferredFeatures();
      }, 300);
    }
  }

  initNavigation() {
    if (!DOM.navToggle || !DOM.navMenu) return;

    // Mobile menu toggle
    DOM.navToggle.addEventListener('click', this.toggleMobileMenu.bind(this));

    // Smooth scroll navigation
    DOM.navLinks.forEach(link => {
      link.addEventListener('click', this.handleNavClick.bind(this));
    });

    // Optimized scroll handler
    window.addEventListener('scroll', Utils.throttle(this.handleScroll.bind(this), 16));
  }

  toggleMobileMenu() {
    DOM.navMenu.classList.toggle('active');
    DOM.navToggle.classList.toggle('active');
    document.body.style.overflow = DOM.navMenu.classList.contains('active') ? 'hidden' : '';
  }

  handleNavClick(e) {
    const href = e.target.closest('.nav-link').getAttribute('href');
    
    if (href.includes('.html') || href.startsWith('http')) {
      if (DOM.navMenu.classList.contains('active')) {
        this.toggleMobileMenu();
      }
      return;
    }

    e.preventDefault();
    const targetId = href.substring(1);
    const target = document.getElementById(targetId);
    
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.setActiveNavLink(e.target.closest('.nav-link'));
      
      if (DOM.navMenu.classList.contains('active')) {
        this.toggleMobileMenu();
      }
    }
  }

  setActiveNavLink(activeLink) {
    DOM.navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
  }

  handleScroll() {
    const scrollY = window.scrollY;
    
    // Update navbar
    if (scrollY > 100) {
      DOM.navbar.classList.add('scrolled');
    } else {
      DOM.navbar.classList.remove('scrolled');
    }

    // Update active section (throttled)
    this.updateActiveSection();
  }

  updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;

    for (const section of sections) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.id;

      if (scrollPos >= top && scrollPos < top + height) {
        DOM.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
        break;
      }
    }
  }

  initTyping() {
    if (!DOM.typingText) return;

    const phrases = ['AI Developer', 'Software Engineer', 'ML Expert', 'Problem Solver'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        DOM.typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        DOM.typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentPhrase.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 500;
      }

      setTimeout(type, speed);
    };

    type();
  }

  initScrollEffects() {
    // Lazy load scroll animations
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => el.classList.add('fade-in'));
  }

  initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Animate counters
          if (entry.target.classList.contains('stat-card')) {
            this.animateCounter(entry.target);
          }
          
          // Animate skill bars
          if (entry.target.classList.contains('skill-item')) {
            this.animateSkillBar(entry.target);
          }
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Observe elements
    const targets = document.querySelectorAll('.fade-in, .stat-card, .skill-item, .project-card, .timeline-item');
    targets.forEach(target => observer.observe(target));
  }

  animateCounter(card) {
    if (card.dataset.animated) return;
    
    const numberEl = card.querySelector('.stat-number');
    const target = parseInt(card.dataset.target);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      numberEl.textContent = Math.floor(current);
    }, 16);

    card.dataset.animated = true;
  }

  animateSkillBar(skillItem) {
    if (skillItem.dataset.animated) return;
    
    const progressBar = skillItem.querySelector('.skill-progress');
    if (progressBar) {
      const progress = progressBar.dataset.progress;
      setTimeout(() => {
        progressBar.style.width = progress + '%';
      }, 300);
    }
    
    skillItem.dataset.animated = true;
  }

  initDeferredFeatures() {
    // Load non-critical features after main content
    this.initProjectFilters();
    this.initContactForm();
    this.initModal();
    this.initParticles();
  }

  initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        this.filterProjects(filter, projectCards);
      });
    });
  }

  filterProjects(filter, cards) {
    cards.forEach(card => {
      const category = card.dataset.category;
      const shouldShow = filter === 'all' || category.includes(filter);
      
      if (shouldShow) {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => card.style.display = 'none', 300);
      }
    });
  }

  initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', this.handleFormSubmit.bind(this));
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Show loading
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.showNotification('Message sent successfully!', 'success');
      e.target.reset();
    } catch (error) {
      this.showNotification('Failed to send message. Please try again.', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
      </div>
    `;
    
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: type === 'success' ? '#10b981' : '#ef4444',
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '8px',
      zIndex: '3000',
      transform: 'translateX(400px)',
      transition: 'transform 0.3s ease'
    });

    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 4000);
  }

  initModal() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal();
    });
  }

  closeModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  initParticles() {
    // Lightweight particle system
    if (window.createParticles && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      requestIdleCallback(() => {
        window.createParticles();
      });
    }
  }
}

// Global functions for backward compatibility
window.openProjectModal = function(projectId) {
  const projects = {
    wcareers: {
      title: "WCareers - AI-Powered Career Platform",
      description: "A comprehensive career development platform powered by AI, designed to help professionals enhance their skills and advance their careers.",
      features: [
        "AI-powered resume enhancements with smart suggestions",
        "Mock interviews with AI-driven feedback on tone and confidence",
        "Technical & personality assessments with adaptive testing",
        "AI-powered career roadmaps with personalized step-by-step guides",
        "Job & internship recommendations using machine learning",
        "Skill enhancement suggestions based on industry trends"
      ],
      technologies: ["Node.js", "Express.js", "React.js", "MongoDB", "Python", "FastAPI"],
      github: "https://github.com/RushabhBhalgat/WCareers"
    },
    hireme: {
      title: "HireMe - Smart Assessment Platform",
      description: "Innovative assessment platform developed for Smart India Hackathon, featuring AI-driven candidate evaluation through voice analysis and game-based assessments.",
      features: [
        "AI-driven voice analysis for evaluating soft skills and confidence",
        "Game-based assessments for cognitive abilities and critical thinking",
        "Personalized development plans based on assessment results",
        "Skill progress monitoring with detailed analytics",
        "ATS compatibility checker for resume optimization"
      ],
      technologies: ["Python", "Django", "React.js", "SQLite3", "AI/ML Libraries"],
      github: "https://github.com/RushabhBhalgat/HireMe-Smart-India-Hackathon"
    }
  };

  const project = projects[projectId];
  if (!project) return;

  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  
  modalBody.innerHTML = `
    <div class="project-modal-content">
      <div class="project-modal-header">
        <h2>${project.title}</h2>
        <p class="project-modal-description">${project.description}</p>
      </div>
      
      <div class="project-modal-section">
        <h3><i class="fas fa-star"></i> Key Features</h3>
        <ul class="feature-list">
          ${project.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      </div>
      
      <div class="project-modal-section">
        <h3><i class="fas fa-tools"></i> Technologies Used</h3>
        <div class="tech-tags">
          ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
      </div>
      
      <div class="project-modal-actions">
        <a href="${project.github}" target="_blank" class="btn-primary">
          <i class="fab fa-github"></i> View on GitHub
        </a>
      </div>
    </div>
  `;

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
};

// Initialize app
const app = new PortfolioApp();

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log(`Page loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
    }, 0);
  });
}