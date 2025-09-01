// Portfolio Configuration
// ======================
// Customize your portfolio by modifying the values below

window.portfolioConfig = {
  // Personal Information
  personal: {
    name: "Rushabh Bhalgat",
    title: "AI Developer & Builder",
    email: "rushabhbhalgat123@gmail.com",
    location: "Pune, India",
    birthday: "08 February 2005",
    bio: "Passionate about building intelligent solutions that bridge the gap between cutting-edge AI technology and real-world applications. Currently founding Prosumely while pursuing advanced studies in computer science.",
  },

  // Hero Section
  hero: {
    title: {
      greeting: "Hello, I'm",
      name: "Rushabh Bhalgat",
      role: "AI Developer & Builder",
    },
    typingTexts: [
      "AI Developer",
      "Software Engineer",
      "Machine Learning Expert",
      "Full Stack Developer",
      "Problem Solver",
    ],
    buttons: [
      {
        text: "View My Work",
        icon: "fas fa-rocket",
        href: "#projects",
        type: "primary",
      },
      {
        text: "Let's Connect",
        icon: "fas fa-paper-plane",
        href: "#contact",
        type: "secondary",
      },
    ],
  },

  // Statistics
  stats: [
    { value: 500, label: "Happy Clients" },
    { value: 20, label: "Countries Served" },
    { value: 15, label: "Projects Completed" },
    { value: 3, label: "Years Experience" },
  ],

  // Interests
  interests: [
    { icon: "fas fa-code", title: "Software Development" },
    { icon: "fas fa-brain", title: "Machine Learning" },
    { icon: "fas fa-eye", title: "Computer Vision" },
    { icon: "fas fa-robot", title: "AI Solutions" },
    { icon: "fas fa-chart-line", title: "Data Analytics" },
    { icon: "fas fa-image", title: "Image Processing" },
  ],

  // Experience
  experience: [
    {
      title: "Builder",
      company: "Prosumely",
      period: "Aug 2023 – Present",
      icon: "fas fa-crown",
      description: [
        "Built and deployed the official Prosumely website using WordPress with Elementor on an Apache server",
        "Optimized SEO and developing programmatic SEO strategies to auto-generate keyword-rich pages",
        "Scaled platform to serve 500+ clients across 20+ countries, enhancing global accessibility",
        "Implemented fast deployment pipelines and reliable performance monitoring systems",
      ],
      technologies: ["WordPress", "Apache", "SEO", "Analytics"],
    },
    {
      title: "Computer Science Student",
      company: "Academic Pursuit",
      period: "2023 – Present",
      icon: "fas fa-graduation-cap",
      description: [
        "Advanced Database Management Systems",
        "Data Structures and Algorithms",
        "Machine Learning and AI",
        "Software Engineering Principles",
      ],
      technologies: [],
    },
  ],

  // Projects
  projects: [
    {
      id: "wcareers",
      title: "WCareers",
      category: "AI Platform",
      categories: ["ai", "platform"],
      description:
        "AI-powered career development platform with smart resume enhancements, mock interviews, and personalized career roadmaps. Built with modern technologies for optimal performance.",
      technologies: ["Node.js", "React", "MongoDB", "Python", "FastAPI"],
      image: "assets/wcareers.jpg",
      github: "https://github.com/RushabhBhalgat/WCareers",
      live: null,
    },
    {
      id: "hireme",
      title: "HireMe",
      category: "AI Assessment",
      categories: ["ai", "web"],
      description:
        "Smart India Hackathon project featuring AI-driven voice analysis, game-based assessments, and personalized development plans for comprehensive candidate evaluation.",
      technologies: ["Python", "Django", "React", "SQLite", "AI/ML"],
      image: "assets/hireme.png",
      github: "https://github.com/RushabhBhalgat/HireMe-Smart-India-Hackathon",
      live: null,
    },
    {
      id: "prosumely",
      title: "Prosumely",
      category: "Business Platform",
      categories: ["platform", "web"],
      description:
        "Global platform serving 500+ clients across 20+ countries. Built with WordPress and optimized for performance, SEO, and international scalability.",
      technologies: ["WordPress", "Apache", "PHP", "MySQL", "SEO"],
      image: "assets/prosumely.jpg",
      github: null,
      live: "https://prosumely.com",
    },
  ],

  // Skills
  skills: {
    "Programming Languages": [
      { name: "Python", icon: "fab fa-python", progress: 95 },
      { name: "JavaScript", icon: "fab fa-js-square", progress: 90 },
      { name: "Java", icon: "fab fa-java", progress: 85 },
      { name: "SQL", icon: "fas fa-database", progress: 80 },
    ],
    "Web Technologies": [
      { name: "React", icon: "fab fa-react", progress: 90 },
      { name: "Node.js", icon: "fab fa-node-js", progress: 85 },
      { name: "FastAPI", icon: "fas fa-server", progress: 88 },
      { name: "Django", icon: "fab fa-django", progress: 82 },
    ],
    "AI & Machine Learning": [
      { name: "TensorFlow", icon: "fas fa-robot", progress: 85 },
      { name: "Scikit-learn", icon: "fas fa-chart-line", progress: 80 },
      { name: "Computer Vision", icon: "fas fa-eye", progress: 78 },
      { name: "NLP", icon: "fas fa-language", progress: 75 },
    ],
  },

  // Tools
  tools: [
    { name: "Git", icon: "fab fa-git-alt" },
    { name: "Docker", icon: "fab fa-docker" },
    { name: "AWS", icon: "fab fa-aws" },
    { name: "MongoDB", icon: "fas fa-database" },
    { name: "Apache", icon: "fas fa-server" },
    { name: "WordPress", icon: "fab fa-wordpress" },
    { name: "Analytics", icon: "fas fa-chart-bar" },
    { name: "SEO", icon: "fas fa-search" },
  ],

  // Social Links
  social: [
    {
      name: "LinkedIn",
      icon: "fab fa-linkedin-in",
      url: "https://www.linkedin.com/in/rushabh-bhalgat/",
    },
    {
      name: "GitHub",
      icon: "fab fa-github",
      url: "https://github.com/RushabhBhalgat",
    },
    {
      name: "Twitter",
      icon: "fab fa-twitter",
      url: "https://twitter.com/rushabhbhalgat",
    },
  ],

  // Theme Configuration
  theme: {
    colors: {
      primary: "#64ffda",
      secondary: "#1e3a8a",
      accent: "#f59e0b",
    },
    animation: {
      typingSpeed: 100,
      particleCount: 80,
      enableParticles: true,
      enableTyping: true,
      enableCounters: true,
    },
  },

  // SEO Configuration
  seo: {
    title: "Rushabh Bhalgat - AI & Software Developer",
    description:
      "Portfolio showcasing AI projects, software development expertise, and innovative solutions",
    keywords:
      "AI Developer, Software Engineer, Machine Learning, Full Stack Developer, Portfolio",
    author: "Rushabh Bhalgat",
    url: "https://rushabhbhalgat.github.io",
  },
};
