// Modern Portfolio JavaScript
// =========================

// DOM Elements
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const loadingScreen = document.getElementById("loading-screen");
const typingText = document.getElementById("typing-text");
const statCards = document.querySelectorAll(".stat-card");
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const skillProgressBars = document.querySelectorAll(".skill-progress");
const contactForm = document.getElementById("contact-form");
const modal = document.getElementById("project-modal");
const modalClose = document.querySelector(".modal-close");

// Global Variables
let currentSection = "home";
let isLoading = true;

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

// Application Initialization
function initializeApp() {
  showLoadingScreen();
  setTimeout(() => {
    hideLoadingScreen();
    initializeComponents();
    startAnimations();
  }, 2000);
}

// Loading Screen
function showLoadingScreen() {
  loadingScreen.style.display = "flex";
}

function hideLoadingScreen() {
  loadingScreen.style.opacity = "0";
  setTimeout(() => {
    loadingScreen.style.display = "none";
    isLoading = false;
  }, 500);
}

// Initialize Components
function initializeComponents() {
  initializeNavigation();
  initializeTypingEffect();
  initializeScrollEffects();
  initializeProjectFilters();
  initializeArticleFilters();
  initializeContactForm();
  initializeModal();
  initializeParticles();

  // Add intersection observer for animations
  observeElements();
}

// Navigation
function initializeNavigation() {
  // Mobile menu toggle
  navToggle.addEventListener("click", toggleMobileMenu);

  // Smooth scroll for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // Check if it's an external link (contains .html or starts with http)
      if (href.includes(".html") || href.startsWith("http")) {
        // Close mobile menu if open for external links
        if (navMenu.classList.contains("active")) {
          toggleMobileMenu();
        }
        // Let the default behavior handle external links
        return;
      }

      e.preventDefault();
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        scrollToSection(targetSection);
        setActiveNavLink(link);

        // Close mobile menu if open
        if (navMenu.classList.contains("active")) {
          toggleMobileMenu();
        }
      }
    });
  });

  // Scroll spy
  window.addEventListener("scroll", handleScroll);
}

function toggleMobileMenu() {
  navMenu.classList.toggle("active");
  navToggle.classList.toggle("active");

  // Animate hamburger bars
  const bars = navToggle.querySelectorAll(".bar");
  bars.forEach((bar, index) => {
    if (navToggle.classList.contains("active")) {
      if (index === 0)
        bar.style.transform = "rotate(45deg) translate(5px, 5px)";
      if (index === 1) bar.style.opacity = "0";
      if (index === 2)
        bar.style.transform = "rotate(-45deg) translate(7px, -6px)";
    } else {
      bar.style.transform = "";
      bar.style.opacity = "";
    }
  });
}

function scrollToSection(section) {
  section.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function setActiveNavLink(activeLink) {
  navLinks.forEach((link) => link.classList.remove("active"));
  activeLink.classList.add("active");
}

function handleScroll() {
  const scrollPosition = window.scrollY;

  // Update navbar style
  if (scrollPosition > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Update active navigation link
  updateActiveSection();
}

function updateActiveSection() {
  const sections = document.querySelectorAll("section[id]");
  const scrollPosition = window.scrollY + 200;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      currentSection = sectionId;

      // Update active nav link
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

// Typing Effect
function initializeTypingEffect() {
  const phrases = [
    "AI Developer",
    "Software Engineer",
    "Founder of Prosumely",
    "Machine Learning Expert",
    "Full Stack Developer",
    "Problem Solver",
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingText.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingText.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500; // Pause before typing
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();
}

// Scroll Effects and Animations
function initializeScrollEffects() {
  const animatedElements = document.querySelectorAll(
    ".fade-in, .slide-in-left, .slide-in-right"
  );

  animatedElements.forEach((element) => {
    element.classList.add("fade-in");
  });
}

function observeElements() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Animate stats counter
        if (entry.target.classList.contains("stat-card")) {
          animateCounter(entry.target);
        }

        // Animate skill bars
        if (entry.target.classList.contains("skill-item")) {
          animateSkillBar(entry.target);
        }
      }
    });
  }, observerOptions);

  // Observe elements
  const observeTargets = document.querySelectorAll(
    ".fade-in, .stat-card, .skill-item, .project-card, .timeline-item"
  );
  observeTargets.forEach((target) => observer.observe(target));
}

// Counter Animation
function animateCounter(card) {
  if (card.dataset.animated) return;

  const numberElement = card.querySelector(".stat-number");
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
    numberElement.textContent = Math.floor(current);
  }, 16);

  card.dataset.animated = true;
}

// Skill Bar Animation
function animateSkillBar(skillItem) {
  if (skillItem.dataset.animated) return;

  const progressBar = skillItem.querySelector(".skill-progress");
  if (progressBar) {
    const progress = progressBar.dataset.progress;
    setTimeout(() => {
      progressBar.style.width = progress + "%";
    }, 500);
  }

  skillItem.dataset.animated = true;
}

// Project Filters
function initializeProjectFilters() {
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active filter
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      filterProjects(filter);
    });
  });
}

function filterProjects(filter) {
  projectCards.forEach((card) => {
    const category = card.dataset.category;

    if (filter === "all" || category.includes(filter)) {
      card.style.display = "block";
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
      }, 100);
    } else {
      card.style.opacity = "0";
      card.style.transform = "scale(0.8)";
      setTimeout(() => {
        card.style.display = "none";
      }, 300);
    }
  });
}

// Contact Form
function initializeContactForm() {
  if (!contactForm) return;

  contactForm.addEventListener("submit", handleFormSubmit);
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);

  // Show loading state
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  try {
    // Simulate form submission (replace with actual endpoint)
    await simulateFormSubmission(data);

    // Success
    showNotification("Message sent successfully!", "success");
    contactForm.reset();
  } catch (error) {
    // Error
    showNotification("Failed to send message. Please try again.", "error");
  } finally {
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

function simulateFormSubmission(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate success/failure
      Math.random() > 0.1 ? resolve() : reject();
    }, 2000);
  });
}

function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${
              type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
            }"></i>
            <span>${message}</span>
        </div>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#10b981" : "#ef4444"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;

  document.body.appendChild(notification);

  // Slide in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}

// Modal
function initializeModal() {
  if (!modal) return;

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") {
      closeModal();
    }
  });
}

function openProjectModal(projectId) {
  const projects = {
    wcareers: {
      title: "WCareers - AI-Powered Career Platform",
      description:
        "A comprehensive career development platform powered by AI, designed to help professionals enhance their skills and advance their careers.",
      features: [
        "AI-powered resume enhancements with smart suggestions",
        "Mock interviews with AI-driven feedback on tone and confidence",
        "Technical & personality assessments with adaptive testing",
        "AI-powered career roadmaps with personalized step-by-step guides",
        "Job & internship recommendations using machine learning",
        "Skill enhancement suggestions based on industry trends",
        "Community & peer learning with AI-powered discussion forums",
      ],
      technologies: [
        "Node.js",
        "Express.js",
        "React.js",
        "MongoDB",
        "Python",
        "FastAPI",
        "Machine Learning APIs",
      ],
      github: "https://github.com/RushabhBhalgat/WCareers",
      images: ["assets/wcareers-1.jpg", "assets/wcareers-2.jpg"],
    },
    hireme: {
      title: "HireMe - Smart Assessment Platform",
      description:
        "Innovative assessment platform developed for Smart India Hackathon, featuring AI-driven candidate evaluation through voice analysis and game-based assessments.",
      features: [
        "AI-driven voice analysis for evaluating soft skills and confidence",
        "Game-based assessments for cognitive abilities and critical thinking",
        "Personalized development plans based on assessment results",
        "Skill progress monitoring with detailed analytics",
        "ATS compatibility checker for resume optimization",
        "Blockchain-based certification system for skill verification",
        "Vernacular language support for diverse user base",
        "Animated 3D avatar courses for interactive learning",
      ],
      technologies: [
        "Python",
        "Django",
        "React.js",
        "SQLite3",
        "AI/ML Libraries",
        "Blockchain",
        "Voice Processing APIs",
      ],
      github: "https://github.com/RushabhBhalgat/HireMe-Smart-India-Hackathon",
      images: ["assets/hireme-1.jpg", "assets/hireme-2.jpg"],
    },
  };

  const project = projects[projectId];
  if (!project) return;

  const modalBody = document.getElementById("modal-body");
  modalBody.innerHTML = `
        <div class="project-modal-content">
            <div class="project-modal-header">
                <h2>${project.title}</h2>
                <p class="project-modal-description">${project.description}</p>
            </div>
            
            <div class="project-modal-section">
                <h3><i class="fas fa-star"></i> Key Features</h3>
                <ul class="feature-list">
                    ${project.features
                      .map((feature) => `<li>${feature}</li>`)
                      .join("")}
                </ul>
            </div>
            
            <div class="project-modal-section">
                <h3><i class="fas fa-tools"></i> Technologies Used</h3>
                <div class="tech-tags">
                    ${project.technologies
                      .map((tech) => `<span class="tech-tag">${tech}</span>`)
                      .join("")}
                </div>
            </div>
            
            <div class="project-modal-actions">
                <a href="${project.github}" target="_blank" class="btn-primary">
                    <i class="fab fa-github"></i> View on GitHub
                </a>
            </div>
        </div>
    `;

  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

// Particles
function initializeParticles() {
  createParticles();
}

// Start Animations
function startAnimations() {
  // Add initial animation classes
  setTimeout(() => {
    const heroElements = document.querySelectorAll(".hero-text > *");
    heroElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("fade-in", "visible");
      }, index * 200);
    });
  }, 500);
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Performance Optimizations
window.addEventListener("scroll", throttle(handleScroll, 16));
window.addEventListener(
  "resize",
  debounce(() => {
    // Handle resize events
    updateLayout();
  }, 250)
);

function updateLayout() {
  // Update layout on resize if needed
}

// Add CSS for modal content
const modalCSS = `
<style>
.project-modal-content {
    max-width: 100%;
}

.project-modal-header {
    margin-bottom: 2rem;
}

.project-modal-header h2 {
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-size: 1.8rem;
}

.project-modal-description {
    color: var(--text-secondary);
    font-size: 1.1rem;
    line-height: 1.6;
}

.project-modal-section {
    margin-bottom: 2rem;
}

.project-modal-section h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.feature-list {
    list-style: none;
    padding: 0;
}

.feature-list li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
    color: var(--text-secondary);
    line-height: 1.6;
}

.feature-list li::before {
    content: '▹';
    position: absolute;
    left: 0;
    color: var(--primary-color);
    font-weight: bold;
}

.tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.project-modal-actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
}

@media (max-width: 768px) {
    .modal-content {
        margin: 1rem;
        max-height: 90vh;
    }
    
    .project-modal-header h2 {
        font-size: 1.5rem;
    }
}
</style>
`;

document.head.insertAdjacentHTML("beforeend", modalCSS);

// Articles Functionality
// ======================

// Article filter functionality
function initializeArticleFilters() {
  const articleFilterBtns = document.querySelectorAll(
    ".articles-filter .filter-btn"
  );
  const articleCards = document.querySelectorAll(".article-card");

  if (articleFilterBtns.length === 0) return;

  articleFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Update active button
      articleFilterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter articles
      articleCards.forEach((card) => {
        const categories = card.dataset.category.split(" ");

        if (filter === "all" || categories.includes(filter)) {
          card.style.display = "block";
          card.style.animation = "fadeInUp 0.6s ease forwards";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// Article modal functionality
function openArticle(articleId) {
  // Create article content based on ID
  let content = "";

  switch (articleId) {
    case "computer-vision-opencv":
      content = `
                <div class="article-modal-content">
                    <img src="assets/wcareers.jpg" alt="Computer Vision with OpenCV" class="article-modal-image">
                    <div class="article-modal-header">
                        <h2>Building Real-time Face Recognition with OpenCV and Python</h2>
                        <div class="article-modal-meta">
                            <span><i class="fas fa-calendar"></i> March 15, 2024</span>
                            <span><i class="fas fa-clock"></i> 8 min read</span>
                            <span><i class="fas fa-eye"></i> 1.2k views</span>
                        </div>
                    </div>
                    <div class="article-modal-body">
                        <p>Face recognition technology has become increasingly important in modern applications, from security systems to attendance management. In this comprehensive guide, we'll explore how to build a production-ready face recognition system using OpenCV and Python.</p>
                        
                        <h3>What You'll Learn</h3>
                        <ul>
                            <li>Setting up OpenCV for face detection</li>
                            <li>Implementing Haar Cascade classifiers</li>
                            <li>Using LBPH (Local Binary Pattern Histograms) for face recognition</li>
                            <li>Building a complete attendance management system</li>
                            <li>Optimizing for real-time performance</li>
                        </ul>

                        <h3>Prerequisites</h3>
                        <p>Before we dive in, make sure you have:</p>
                        <ul>
                            <li>Python 3.7 or higher</li>
                            <li>Basic understanding of computer vision concepts</li>
                            <li>A webcam or camera module</li>
                        </ul>

                        <p><strong>Note:</strong> This is a preview. The complete article with code examples and detailed implementation will be available soon!</p>
                    </div>
                    <div class="article-modal-footer">
                        <div class="article-tags">
                            <span class="tag">OpenCV</span>
                            <span class="tag">Python</span>
                            <span class="tag">Computer Vision</span>
                            <span class="tag">Machine Learning</span>
                        </div>
                    </div>
                </div>
            `;
      break;

    case "nextjs-payload-cms":
      content = `
                <div class="article-modal-content">
                    <img src="assets/prosumely.jpg" alt="Next.js with Payload CMS" class="article-modal-image">
                    <div class="article-modal-header">
                        <h2>Scaling a Global Platform: Next.js + Payload CMS on Vercel</h2>
                        <div class="article-modal-meta">
                            <span><i class="fas fa-calendar"></i> February 28, 2024</span>
                            <span><i class="fas fa-clock"></i> 12 min read</span>
                            <span><i class="fas fa-eye"></i> 892 views</span>
                        </div>
                    </div>
                    <div class="article-modal-body">
                        <p>Building Prosumely from a local service to a global platform serving 500+ clients across 20+ countries taught me valuable lessons about scalability, performance, and user experience.</p>
                        
                        <h3>Why This Tech Stack?</h3>
                        <ul>
                            <li><strong>Next.js:</strong> Server-side rendering for better SEO</li>
                            <li><strong>Payload CMS:</strong> Flexible, developer-friendly content management</li>
                            <li><strong>Vercel:</strong> Seamless deployment and global CDN</li>
                        </ul>

                        <h3>Key Performance Optimizations</h3>
                        <p>Here are the techniques that helped us scale:</p>
                        <ul>
                            <li>Image optimization with Next.js Image component</li>
                            <li>Dynamic imports for code splitting</li>
                            <li>Programmatic SEO for keyword-rich pages</li>
                            <li>Edge functions for global performance</li>
                        </ul>

                        <p><strong>Coming Soon:</strong> Full technical breakdown with code examples and deployment strategies!</p>
                    </div>
                    <div class="article-modal-footer">
                        <div class="article-tags">
                            <span class="tag">Next.js</span>
                            <span class="tag">Payload CMS</span>
                            <span class="tag">Vercel</span>
                            <span class="tag">SEO</span>
                        </div>
                    </div>
                </div>
            `;
      break;

    case "gpt-5-revolutionary-ai-breakthrough":
      content = `
                <div class="article-modal-content">
                    <img src="assets/articles/sam-altman-launches-openai-gpt-5-model-rushabh-bhalgat.png" alt="GPT-5 OpenAI Revolutionary AI Breakthrough" class="article-modal-image">
                    <div class="article-modal-header">
                        <h2>GPT-5: OpenAI's Revolutionary AI Breakthrough - Complete Analysis 2025</h2>
                        <div class="article-modal-meta">
                            <span><i class="fas fa-calendar"></i> August 7, 2025</span>
                            <span><i class="fas fa-clock"></i> 8 min read</span>
                            <span><i class="fas fa-eye"></i> 2.4k views</span>
                        </div>
                    </div>
                    <div class="article-modal-body">
                        <p><strong>Breaking News:</strong> OpenAI has officially launched GPT-5, claiming it's their "smartest, fastest, most useful model yet." But is this truly the next-level breakthrough in artificial intelligence, or sophisticated marketing around evolutionary improvements?</p>
                        
                        <h3>🚀 The Technical Revolution: What Makes GPT-5 Different</h3>
                        <p>GPT-5 represents a fundamental architectural shift from OpenAI's previous approach. Unlike GPT-4's fragmented ecosystem, <strong>GPT-5 introduces a unified architecture</strong> that automatically selects the optimal cognitive approach for any task.</p>
                        
                        <h4>Core Technical Specifications:</h4>
                        <ul>
                            <li><strong>GPT-5 (Flagship):</strong> 1.7 trillion parameters optimized for complex reasoning</li>
                            <li><strong>GPT-5-mini:</strong> 400 billion parameters for cost-sensitive applications</li>
                            <li><strong>GPT-5-nano:</strong> 50 billion parameters for ultra-low latency responses</li>
                            <li><strong>GPT-5-chat:</strong> Enterprise-optimized for multimodal conversations</li>
                        </ul>

                        <h3>📊 Benchmark Performance: The Numbers</h3>
                        <ul>
                            <li><strong>GPQA Diamond:</strong> 88.4% (vs 70-80% previous best)</li>
                            <li><strong>AIME 2025 Math:</strong> 100% (vs 83.7% GPT-4)</li>
                            <li><strong>SWE-Bench Verified:</strong> 74.9% (vs ~60% baseline)</li>
                            <li><strong>Hallucination Reduction:</strong> 26% lower than GPT-4o</li>
                        </ul>

                        <h3>🏢 Enterprise Adoption</h3>
                        <p>Major organizations including <strong>BNY Mellon, California State University, Figma, Intercom, and T-Mobile</strong> have already integrated GPT-5 into their workflows, reporting fundamental improvements in productivity and capability.</p>

                        <h3>🤖 The AGI Question</h3>
                        <p>GPT-5 shows remarkable capabilities in:</p>
                        <ul>
                            <li>Unified intelligence across reasoning, conversation, and coding</li>
                            <li>Agent-like autonomy for complex workflows</li>
                            <li>Domain expert-level performance in specialized fields</li>
                            <li>Enhanced safety with "safe completions" approach</li>
                        </ul>

                        <h3>🎯 The Verdict</h3>
                        <p><strong>GPT-5 represents a genuine "next level" advancement in AI capabilities.</strong> While it falls short of true AGI, it's architecturally different in ways that enable new categories of applications and workflows. For organizations and developers, GPT-5 offers immediate, practical value that justifies early adoption.</p>

                        <p><strong>Bottom Line:</strong> GPT-5 is undeniably "next level" by today's standards, setting a new bar for what AI can accomplish in the real world while providing a compelling glimpse of the AGI future.</p>
                    </div>
                    <div class="article-modal-footer">
                        <div class="article-tags">
                            <span class="tag">GPT-5</span>
                            <span class="tag">OpenAI</span>
                            <span class="tag">AI Analysis</span>
                            <span class="tag">AGI</span>
                            <span class="tag">Machine Learning</span>
                            <span class="tag">Artificial Intelligence</span>
                        </div>
                    </div>
                </div>
            `;
      break;

    default:
      content = `
                <div class="article-modal-content">
                    <div class="article-modal-header">
                        <h2>Article Coming Soon!</h2>
                    </div>
                    <div class="article-modal-body">
                        <p>This article is currently being written. Check back soon for the complete content!</p>
                        <p>Want to be notified when it's published? Subscribe to my newsletter below.</p>
                    </div>
                </div>
            `;
  }

  // Show modal with content
  const modalBody = document.getElementById("modal-body");
  modalBody.innerHTML = content;
  modal.style.display = "block";
  document.body.style.overflow = "hidden";

  // Add modal styles for articles
  if (!document.getElementById("article-modal-styles")) {
    const articleModalCSS = `
            <style id="article-modal-styles">
                .article-modal-content {
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .article-modal-image {
                    width: 100%;
                    height: 300px;
                    object-fit: cover;
                    border-radius: 10px;
                    margin-bottom: 2rem;
                }
                
                .article-modal-header h2 {
                    font-size: 2rem;
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                    line-height: 1.3;
                }
                
                .article-modal-meta {
                    display: flex;
                    gap: 2rem;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--border-color);
                    color: var(--text-muted);
                    font-family: var(--font-mono);
                    font-size: 0.9rem;
                }
                
                .article-modal-body {
                    line-height: 1.8;
                    color: var(--text-secondary);
                }
                
                .article-modal-body h3 {
                    color: var(--text-primary);
                    margin: 2rem 0 1rem 0;
                    font-size: 1.3rem;
                }
                
                .article-modal-body ul {
                    margin: 1rem 0;
                    padding-left: 2rem;
                }
                
                .article-modal-body li {
                    margin-bottom: 0.5rem;
                }
                
                .article-modal-footer {
                    margin-top: 3rem;
                    padding-top: 2rem;
                    border-top: 1px solid var(--border-color);
                }
                
                @media (max-width: 768px) {
                    .article-modal-image {
                        height: 200px;
                    }
                    
                    .article-modal-header h2 {
                        font-size: 1.5rem;
                    }
                    
                    .article-modal-meta {
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                }
            </style>
        `;
    document.head.insertAdjacentHTML("beforeend", articleModalCSS);
  }
}

// Newsletter subscription
function subscribeNewsletter() {
  // For now, show an alert. In production, integrate with email service
  alert(
    "Newsletter subscription coming soon! Follow me on LinkedIn for updates: https://linkedin.com/in/rushabh-bhalgat"
  );
}

// Topic suggestion
function suggestTopic() {
  const topic = prompt(
    "What technical topic would you like me to write about?"
  );
  if (topic) {
    alert(
      `Thanks for the suggestion: "${topic}". I'll consider it for future articles!`
    );
    // In production, send this to a backend service
    console.log("Article topic suggestion:", topic);
  }
}

// Export functions for global access
window.openProjectModal = openProjectModal;
window.openArticle = openArticle;
window.subscribeNewsletter = subscribeNewsletter;
window.suggestTopic = suggestTopic;

// Console welcome message
console.log(
  "%c🚀 Rushabh Bhalgat's Portfolio",
  "color: #64ffda; font-size: 16px; font-weight: bold;"
);
console.log(
  "%cWelcome to my portfolio! Check out the code at: https://github.com/RushabhBhalgat",
  "color: #d1d5db; font-size: 12px;"
);
