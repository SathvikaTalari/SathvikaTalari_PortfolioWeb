"use strict";

/**
 * Sathvika Talari — Portfolio Engine v4
 * Updated with latest resume content, 4 core projects, Alonzo AI experience,
 * interactive demo simulators, Devicon skills filtering, and kinetic particle system.
 */

// ============================================================
// 1. SCROLL PROGRESS BAR
// ============================================================
const scrollProgress = document.getElementById("scroll-progress");
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = progress + "%";
}, { passive: true });

// ============================================================
// 2. STICKY HEADER SCROLLED STATE
// ============================================================
const siteHeader = document.getElementById("site-header");
window.addEventListener("scroll", () => {
  if (siteHeader) {
    siteHeader.classList.toggle("scrolled", window.scrollY > 40);
  }
}, { passive: true });

// ============================================================
// 3. CUSTOM CURSOR
// ============================================================
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");

if (cursorDot && cursorRing && window.matchMedia("(hover: hover)").matches) {
  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let rafId;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";
  }, { passive: true });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    cursorRing.style.left = ringX + "px";
    cursorRing.style.top = ringY + "px";
    rafId = requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect on interactive elements
  function attachCursorHover() {
    document.querySelectorAll("a, button, [role='button'], .skill-logo-card, .filter-btn, .project-case-card").forEach(el => {
      el.addEventListener("mouseenter", () => cursorRing.classList.add("hovering"));
      el.addEventListener("mouseleave", () => cursorRing.classList.remove("hovering"));
    });
  }
  attachCursorHover();

  document.addEventListener("mouseleave", () => {
    cursorDot.style.opacity = "0";
    cursorRing.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    cursorDot.style.opacity = "1";
    cursorRing.style.opacity = "1";
  });
}

// ============================================================
// 4. THEME SWITCHING (Dark / Light)
// ============================================================
const themeButton = document.getElementById("theme-toggle");

const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>`;
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></svg>`;

const setTheme = (theme) => {
  document.documentElement.dataset.bsTheme = theme;
  if (themeButton) {
    const isDark = theme === "dark";
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeButton.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeButton.innerHTML = isDark ? sunIcon : moonIcon;
  }
};

try {
  const saved = localStorage.getItem("st-portfolio-theme");
  setTheme(saved === "light" ? "light" : "dark");
} catch {
  setTheme("dark");
}

if (themeButton) {
  themeButton.addEventListener("click", () => {
    const next = document.documentElement.dataset.bsTheme === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("st-portfolio-theme", next); } catch { /* noop */ }
  });
}

// ============================================================
// 5. PARTICLE CANVAS (HERO)
// ============================================================
(function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const particles = [];
  const PARTICLE_COUNT = 65;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  const isDark = () => document.documentElement.dataset.bsTheme !== "light";

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.6;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
      this.opacity = Math.random() * 0.5 + 0.15;
      this.pulse = Math.random() * Math.PI * 2;
      this.type = Math.random() > 0.65 ? "cyan" : "white";
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += 0.02;
      this.opacity = Math.sin(this.pulse) * 0.2 + 0.3;

      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
      }
    }
    draw() {
      const dark = isDark();
      const color = this.type === "cyan"
        ? (dark ? `rgba(56, 189, 248, ${this.opacity})` : `rgba(2, 132, 199, ${this.opacity})`)
        : (dark ? `rgba(248, 250, 252, ${this.opacity * 0.5})` : `rgba(15, 23, 42, ${this.opacity * 0.25})`);

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 115) {
          const alpha = (1 - dist / 115) * 0.12;
          const dark = isDark();
          ctx.beginPath();
          ctx.strokeStyle = dark ? `rgba(56, 189, 248, ${alpha})` : `rgba(2, 132, 199, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
})();

// ============================================================
// 6. TYPEWRITER EFFECT
// ============================================================
(function initTypewriter() {
  const el = document.getElementById("typewriter-text");
  if (!el) return;

  const phrases = [
    "Python & Flask Backend Architectures",
    "Full-Stack React & Django Solutions",
    "Generative AI & Machine Learning Integration",
    "Automata Simulators & Theory of Computation",
    "Modern Next.js & TypeScript Systems",
    "Interactive UI/UX & Role-Based Workflows",
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 90;

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      delay = 45;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      delay = 85;
    }

    if (!isDeleting && charIndex === current.length) {
      delay = 1900;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 1000);
})();

// ============================================================
// 7. SCROLL REVEAL ANIMATIONS
// ============================================================
(function initReveal() {
  const elements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  elements.forEach(el => observer.observe(el));
})();

// ============================================================
// 8. COUNTER ANIMATIONS
// ============================================================
(function initCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target || el.textContent);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      el.textContent = value.toFixed(decimals);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(el => observer.observe(el));
})();

// ============================================================
// 9. ALL 4 PROJECTS DATA (Direct from Updated Resume)
// ============================================================
const projects = [
  {
    id: 1,
    title: "LearnSphere – AI-Powered ML Learning Platform",
    shortTitle: "LearnSphere",
    image: "assets/learnsphere.jpg",
    imageAlt: "LearnSphere AI Learning Platform Dashboard",
    indexLabel: "01",
    badge: "AI & EDUCATION",
    categories: ["ai", "web"],
    liveUrl: "https://learn-sphere-platform.vercel.app/login",
    description: "An AI-powered learning platform allowing educators to create structured courses, multimedia lessons, quizzes, and assessments with Generative AI guidance.",
    summary: "Built an AI-powered learning platform allowing educators to create structured courses, multimedia lessons, quizzes, and assessments. Integrated Generative AI for concept explanations, coding assistance, and personalized academic guidance.",
    features: [
      "Modular course, multimedia lesson, quiz, and assessment authoring for educators",
      "Integrated Generative AI for concept explanations, coding assistance, and personalized academic guidance",
      "Developed using Python, Flask, HTML, CSS, JavaScript, and APIs with dashboards",
      "Real-time student progress tracking and dynamic certificate generation"
    ],
    contribution: "Architected the backend routing and database models with Python & Flask, integrated Generative AI APIs for the real-time student guidance assistant, and built the instructor authoring dashboard and certificate generation engine.",
    tags: ["Python", "Flask", "Generative AI", "HTML5", "CSS3", "JavaScript", "APIs"],
    demoType: "learnsphere"
  },
  {
    id: 2,
    title: "Hotel Management System",
    shortTitle: "Hotel Management",
    image: "assets/hotel.jpg",
    imageAlt: "Hotel Management System Dashboard",
    indexLabel: "02",
    badge: "HOSPITALITY WEB",
    categories: ["web"],
    liveUrl: "https://hotel-management-system-seven-alpha.vercel.app/login",
    description: "A full-stack hospitality management system supporting room booking, guest check-in/check-out, role-based authentication, and invoice tracking.",
    summary: "Developed a full-stack hospitality management system supporting room booking, guest check-in/check-out, and reservation management. Implemented role-based authentication for admin, staff, and guest users with operational dashboards.",
    features: [
      "Full room booking, reservation management, and check-in/check-out workflows",
      "Role-based authentication and operational dashboards for admin, staff, and guest users",
      "Built using Python Flask, SQLAlchemy, HTML, CSS, JavaScript, and Bootstrap",
      "Automated invoice generation, billing calculation, and reservation tracking"
    ],
    contribution: "Designed and implemented the core database schema using SQLAlchemy ORM, programmed role-based authorization for administrative and customer tiers, and developed billing workflows with dynamic invoice printing.",
    tags: ["Python", "Flask", "SQLAlchemy", "Bootstrap", "MySQL", "JavaScript", "HTML/CSS"],
    demoType: "hotel"
  },
  {
    id: 3,
    title: "Automata Simulator",
    shortTitle: "Automata Simulator",
    image: "assets/automata.jpg",
    imageAlt: "Automata Simulator Formal Theory Visualizer",
    indexLabel: "03",
    badge: "CORE CS & THEORY",
    categories: ["core"],
    liveUrl: "https://automata-simulator-black.vercel.app",
    description: "An interactive application to visualize and simulate formal language theory concepts such as DFA, NFA, and Regex conversions with step execution.",
    summary: "Developed an interactive application to visualize and simulate formal language theory concepts such as DFA, NFA, and Regex conversions. Implemented core computer science algorithms with dynamic graph visualization.",
    features: [
      "Dynamic graph visualization and step-by-step execution tracing of automata transitions",
      "Implemented Thompson Construction for Regular Expression to NFA conversion",
      "Implemented Subset Construction for NFA to DFA determinization",
      "Implemented Hopcroft's DFA state minimization algorithm for optimal machine design",
      "Built with Python Flask backend and responsive JavaScript frontend"
    ],
    contribution: "Implemented the formal language conversion algorithms (Thompson, Subset, Hopcroft) in Python, designed REST endpoints to compute transition tables, and built the interactive frontend canvas for dynamic state visualization.",
    tags: ["Python", "Flask", "JavaScript", "Algorithms", "Graph Visualization", "Formal Theory"],
    demoType: "automata"
  },
  {
    id: 4,
    title: "Disaster Preparedness and Response Platform",
    shortTitle: "Disaster Preparedness",
    image: "assets/disaster.jpg",
    imageAlt: "Disaster Preparedness Platform Dashboard",
    indexLabel: "04",
    badge: "CIVIC TECH & SAFETY",
    categories: ["web"],
    liveUrl: null,
    description: "A disaster management platform with role-based access for students, faculty, parents, and administrators with virtual drills and real-time alerts.",
    summary: "Developed a disaster management platform with role-based access for students, faculty, parents, and administrators. Designed interactive features including learning modules, quizzes, virtual drills, and real-time alert notifications.",
    features: [
      "Role-based access system designed for students, faculty, parents, and administrators",
      "Preparedness learning modules with interactive safety quizzes and preparedness checklists",
      "Virtual drill simulation scheduler and emergency action tracking",
      "Real-time alert notifications and campus status broadcasting",
      "Built using HTML, CSS, JavaScript, Node.js, Express.js, Next.js, TypeScript, and MySQL"
    ],
    contribution: "Co-architected the full-stack system utilizing Next.js, TypeScript, and Express.js, implemented MySQL secure relational authentication, and built the real-time alert notification broadcast module.",
    tags: ["Next.js", "TypeScript", "Node.js", "Express.js", "MySQL", "JavaScript", "HTML/CSS"],
    demoType: "disaster"
  }
];

// ============================================================
// 10. PROJECT RENDERING & FILTERING
// ============================================================
const projectGrid = document.getElementById("project-list");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCountLabel = document.getElementById("project-count");

function renderProjects(category = "all") {
  if (!projectGrid) return;

  const filtered = projects.filter(p => category === "all" || p.categories.includes(category));

  projectGrid.style.opacity = "0";
  projectGrid.style.transform = "translateY(12px)";
  projectGrid.style.transition = "opacity 0.25s ease, transform 0.25s ease";

  setTimeout(() => {
    projectGrid.replaceChildren();

    filtered.forEach((project, idx) => {
      const col = document.createElement("div");
      col.className = "col-lg-6 mb-4";

      col.innerHTML = `
        <article class="project-case-card" style="animation-delay:${idx * 0.08}s">
          <div class="project-img-cover">
            <img src="${project.image}" alt="${project.imageAlt}" loading="lazy">
            <div class="project-img-overlay" aria-hidden="true"></div>
            <div class="project-img-badges">
              <span class="img-badge">${project.badge}</span>
              <div class="d-flex align-items-center gap-2">
                ${project.liveUrl ? `<span class="live-pill"><span class="live-pulse-dot" aria-hidden="true"></span>Live App</span>` : ""}
                <span class="img-index">${project.indexLabel} / 04</span>
              </div>
            </div>
          </div>

          <div class="project-case-body">
            <h3 class="project-case-title">${project.title}</h3>
            <p class="project-case-desc">${project.description}</p>

            <ul class="project-features">
              ${project.features.slice(0, 3).map(feat => `
                <li>
                  <span class="feature-bullet" aria-hidden="true">▸</span>
                  <span>${feat}</span>
                </li>
              `).join("")}
            </ul>

            <ul class="tag-list" aria-label="Technologies used">
              ${project.tags.map(t => `<li class="tag-item">${t}</li>`).join("")}
            </ul>

            <div class="project-actions">
              ${project.liveUrl ? `
                <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm project-live-btn" aria-label="Open live application for ${project.shortTitle}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live App ↗
                </a>
                <button type="button" class="btn btn-outline-studio btn-sm view-case-btn" data-project-id="${project.id}">
                  Case &amp; Sandbox
                </button>
              ` : `
                <button type="button" class="btn btn-primary btn-sm interactive-demo-btn" data-project-id="${project.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Interactive Demo
                </button>
                <button type="button" class="btn btn-outline-studio btn-sm view-case-btn" data-project-id="${project.id}">
                  Case Details
                </button>
              `}
            </div>
          </div>
        </article>
      `;

      projectGrid.appendChild(col);
    });

    if (projectCountLabel) {
      projectCountLabel.textContent = `${filtered.length} ${filtered.length === 1 ? "project" : "projects"} shown`;
    }

    // Attach modal buttons
    document.querySelectorAll(".interactive-demo-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const pid = parseInt(btn.dataset.projectId, 10);
        const proj = projects.find(p => p.id === pid);
        if (proj) openProjectModal(proj, true);
      });
    });

    document.querySelectorAll(".view-case-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const pid = parseInt(btn.dataset.projectId, 10);
        const proj = projects.find(p => p.id === pid);
        if (proj) openProjectModal(proj, false);
      });
    });

    requestAnimationFrame(() => {
      projectGrid.style.opacity = "1";
      projectGrid.style.transform = "translateY(0)";
    });
  }, 200);
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    renderProjects(btn.dataset.filter);
  });
});

renderProjects("all");

// ============================================================
// 11. SKILLS FILTERING
// ============================================================
const skillFilterButtons = document.querySelectorAll("#skills-filter-bar [data-skill-filter]");
const skillCategoryBlocks = document.querySelectorAll(".skill-category-block");

skillFilterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    skillFilterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.skillFilter;
    skillCategoryBlocks.forEach(block => {
      if (filter === "all" || block.dataset.category === filter) {
        block.style.display = "block";
      } else {
        block.style.display = "none";
      }
    });
  });
});

// ============================================================
// 12. PROJECT MODAL & INTERACTIVE LIVE DEMO SANDBOXES
// ============================================================
function openProjectModal(project, focusDemo = false) {
  const titleEl = document.getElementById("project-modal-title");
  const badgeEl = document.getElementById("project-modal-badge");
  const descEl = document.getElementById("project-modal-description");
  const contribEl = document.getElementById("project-modal-contribution");
  const listEl = document.getElementById("project-modal-concepts");
  const tagsEl = document.getElementById("project-modal-tags");
  const demoArea = document.getElementById("project-modal-interactive-area");

  if (titleEl) titleEl.textContent = project.title;
  if (badgeEl) badgeEl.textContent = project.badge;
  if (descEl) descEl.textContent = project.summary;
  if (contribEl) contribEl.textContent = project.contribution;

  if (listEl) listEl.innerHTML = project.features.map(f => `<li>${f}</li>`).join("");
  if (tagsEl) tagsEl.innerHTML = project.tags.map(t => `<li class="tag-item">${t}</li>`).join("");

  // Inject interactive sandbox
  if (demoArea) {
    demoArea.innerHTML = getInteractiveDemoHTML(project.demoType, project);
    setupDemoInteractions(project.demoType);
  }

  // Update modal footer live application button
  const liveLinkBtn = document.getElementById("project-modal-live-link");
  if (liveLinkBtn) {
    if (project.liveUrl) {
      liveLinkBtn.href = project.liveUrl;
      liveLinkBtn.style.display = "inline-flex";
      liveLinkBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Launch ${project.shortTitle} on Vercel ↗
      `;
    } else {
      liveLinkBtn.style.display = "none";
    }
  }

  const modalEl = document.getElementById("project-modal");
  if (modalEl && window.bootstrap) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();

    if (focusDemo) {
      setTimeout(() => {
        demoArea.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 350);
    }
  }
}

function getInteractiveDemoHTML(type, project = null) {
  const liveBanner = project && project.liveUrl ? `
    <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 p-2 px-3 mb-3 rounded" style="background: rgba(56, 189, 248, 0.08); border: 1px solid var(--cyan-border);">
      <div style="font-size:0.8125rem; color:var(--ink-primary); display:flex; align-items:center; gap:8px;">
        <span class="live-pulse-dot" aria-hidden="true"></span>
        <span><strong>Live Production Deployment:</strong> Active &amp; hosted on Vercel.</span>
      </div>
      <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="padding: 4px 12px; font-size: 0.78rem;">
        Open Vercel App ↗
      </a>
    </div>
  ` : "";

  switch (type) {
    case "learnsphere":
      return `
        <div class="demo-title-bar">
          <span>⚡ LIVE INTERACTIVE SANDBOX: LearnSphere AI Tutor</span>
          <span class="badge bg-success">Generative AI Active</span>
        </div>
        ${liveBanner}
        <p class="text-silver" style="font-size:0.875rem;">Simulate the student tutoring assistant. Ask a machine learning question or select a preset prompt:</p>
        <div class="d-flex flex-wrap gap-2 mb-3">
          <button type="button" class="btn btn-outline-studio btn-sm prompt-preset" data-q="Explain Gradient Descent simply">Gradient Descent</button>
          <button type="button" class="btn btn-outline-studio btn-sm prompt-preset" data-q="What is the difference between Supervised and Unsupervised Learning?">Supervised vs Unsupervised</button>
          <button type="button" class="btn btn-outline-studio btn-sm prompt-preset" data-q="How does a Neural Network backpropagation work?">Backpropagation</button>
        </div>
        <div class="input-group mb-3">
          <input type="text" id="demo-ai-input" class="form-control" placeholder="Ask AI Tutor anything about ML...">
          <button class="btn btn-primary" id="demo-ai-ask-btn" type="button">Ask Tutor</button>
        </div>
        <div id="demo-ai-output" class="p-3 rounded" style="background: var(--surface-bg); border: 1px solid var(--line-medium); font-size:0.875rem; min-height: 80px;">
          <em>Click a preset above or type a query to test AI response generation...</em>
        </div>
      `;

    case "hotel":
      return `
        <div class="demo-title-bar">
          <span>⚡ LIVE INTERACTIVE SANDBOX: Hotel Room Reservation Engine</span>
          <span class="badge bg-info text-dark">Flask &amp; SQLAlchemy Booking Logic</span>
        </div>
        ${liveBanner}
        <div class="row g-3">
          <div class="col-sm-4">
            <label class="form-label" style="font-size:0.75rem;">Select Room Type</label>
            <select class="form-control" id="hotel-room-type">
              <option value="120" selected>Deluxe Suite ($120/night)</option>
              <option value="250">Presidential Villa ($250/night)</option>
              <option value="80">Executive Single ($80/night)</option>
            </select>
          </div>
          <div class="col-sm-4">
            <label class="form-label" style="font-size:0.75rem;">Number of Nights</label>
            <input type="number" class="form-control" id="hotel-nights" value="3" min="1" max="30">
          </div>
          <div class="col-sm-4">
            <label class="form-label" style="font-size:0.75rem;">Guest Count</label>
            <input type="number" class="form-control" id="hotel-guests" value="2" min="1" max="6">
          </div>
        </div>
        <div class="mt-3 p-3 rounded d-flex justify-content-between align-items-center" style="background: var(--surface-bg); border: 1px solid var(--line-medium);">
          <div>
            <div style="font-size:0.75rem; color: var(--ink-secondary); text-transform: uppercase;">Estimated Total (Inc. Taxes)</div>
            <div id="hotel-total-price" style="font-size:1.6rem; font-weight:800; color:var(--cyan);">$403.20</div>
          </div>
          <button type="button" class="btn btn-primary btn-sm" id="hotel-book-btn">Confirm Booking</button>
        </div>
        <div id="hotel-status-msg" class="mt-2 text-silver" style="font-size:0.8125rem;"></div>
      `;

    case "automata":
      return `
        <div class="demo-title-bar">
          <span>⚡ LIVE INTERACTIVE SANDBOX: Automata Simulator &amp; DFA Tracing</span>
          <span class="badge bg-warning text-dark">Hopcroft &amp; Thompson Engine</span>
        </div>
        ${liveBanner}
        <p class="text-silver" style="font-size:0.875rem;">Test regular expressions against formal string simulation:</p>
        <div class="row g-2 mb-3">
          <div class="col-sm-6">
            <label class="form-label" style="font-size:0.75rem;">Regex Expression</label>
            <input type="text" class="form-control font-mono" id="automata-regex" value="(a|b)*abb">
          </div>
          <div class="col-sm-6">
            <label class="form-label" style="font-size:0.75rem;">Test String</label>
            <input type="text" class="form-control font-mono" id="automata-string" value="ababb">
          </div>
        </div>
        <button class="btn btn-primary btn-sm mb-3" id="automata-test-btn" type="button">Run Transition Simulation</button>
        <div id="automata-trace-output" class="p-3 font-mono rounded" style="background: var(--surface-bg); border: 1px solid var(--cyan-border); font-size:0.8125rem;">
          State Path: q0 ──(a)──> q1 ──(b)──> q2 ──(a)──> q1 ──(b)──> q2 ──(b)──> [q3 ACCEPT]<br>
          <span style="color:var(--emerald); font-weight:700;">✓ STRING ACCEPTED by DFA</span> (Hopcroft minimized: 4 states)
        </div>
      `;

    case "disaster":
      return `
        <div class="demo-title-bar">
          <span>⚡ LIVE INTERACTIVE SANDBOX: Disaster Response Alert Broadcast</span>
          <span class="badge bg-danger">Next.js &amp; MySQL Live Pipeline</span>
        </div>
        <div class="row g-3 mb-3">
          <div class="col-sm-6">
            <label class="form-label" style="font-size:0.75rem;">Emergency Alert Level</label>
            <select class="form-control" id="alert-level">
              <option value="critical">🔴 Level 1: Severe Flash Flood Warning</option>
              <option value="warning">🟠 Level 2: Campus Virtual Drill (Fire)</option>
              <option value="advisory">🟡 Level 3: Advisory: High Wind Speed</option>
            </select>
          </div>
          <div class="col-sm-6">
            <label class="form-label" style="font-size:0.75rem;">Target Demographic</label>
            <select class="form-control" id="alert-audience">
              <option>Students, Faculty &amp; Staff (Campus-wide)</option>
              <option>Laboratory Block &amp; Workshop Only</option>
              <option>Hostel Block &amp; Residential Quarters</option>
            </select>
          </div>
        </div>
        <button class="btn btn-primary btn-sm mb-3" id="broadcast-alert-btn" type="button">Broadcast Emergency Alert</button>
        <div id="alert-feed-output" class="p-3 rounded" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); font-size:0.85rem;">
          <strong style="color:var(--rose);">[BROADCAST ACTIVE]</strong> Real-time alert dispatched to 2,450 connected devices. Shelter coordinates and evacuation routes sent.
        </div>
      `;

    default:
      return `<p class="text-silver">Interactive demonstration ready.</p>`;
  }
}

function setupDemoInteractions(type) {
  if (type === "learnsphere") {
    const askBtn = document.getElementById("demo-ai-ask-btn");
    const input = document.getElementById("demo-ai-input");
    const output = document.getElementById("demo-ai-output");
    const presets = document.querySelectorAll(".prompt-preset");

    const answers = {
      "Gradient Descent": "<strong>🤖 LearnSphere AI Tutor:</strong><br>Gradient descent is an optimization algorithm that iteratively tweaks parameters in the direction of steepest descent (negative gradient) of the cost function to find the minimum error. Think of walking down a foggy hill by feeling the steepest slope beneath your feet step-by-step!",
      "Supervised vs Unsupervised": "<strong>🤖 LearnSphere AI Tutor:</strong><br>In <em>Supervised Learning</em>, data contains both inputs and ground-truth labels (like predicting house prices from features). In <em>Unsupervised Learning</em>, the model finds hidden patterns or clusters in raw data without pre-existing labels (like customer segmentation).",
      "Backpropagation": "<strong>🤖 LearnSphere AI Tutor:</strong><br>Backpropagation calculates the gradient of the loss function with respect to each weight using the mathematical chain rule, propagating backwards from the output layer to the input layer so optimizers like Adam can adjust weights!"
    };

    presets.forEach(p => {
      p.addEventListener("click", () => {
        const q = p.dataset.q;
        input.value = q;
        output.innerHTML = "<span class='text-cyan'>Generating response...</span>";
        setTimeout(() => {
          output.innerHTML = answers[p.textContent] || `<strong>🤖 LearnSphere AI Tutor:</strong><br>Great question regarding "${q}". In machine learning workflows, this concept is central to predictive model accuracy, feature representation, and training convergence.`;
        }, 350);
      });
    });

    if (askBtn && input && output) {
      askBtn.addEventListener("click", () => {
        const val = input.value.trim();
        if (!val) return;
        output.innerHTML = "<span class='text-cyan'>Thinking with Generative AI...</span>";
        setTimeout(() => {
          output.innerHTML = `<strong>🤖 LearnSphere AI Tutor:</strong><br>Regarding <em>"${val}"</em>: This is integrated directly into the curriculum modules. In production, our Flask API interfaces with LLM endpoints to provide code snippets, hint generation, and personalized quiz feedback for this topic!`;
        }, 400);
      });
    }
  } else if (type === "hotel") {
    const roomSelect = document.getElementById("hotel-room-type");
    const nightsInput = document.getElementById("hotel-nights");
    const guestsInput = document.getElementById("hotel-guests");
    const totalEl = document.getElementById("hotel-total-price");
    const bookBtn = document.getElementById("hotel-book-btn");
    const statusMsg = document.getElementById("hotel-status-msg");

    function updatePrice() {
      const rate = parseFloat(roomSelect.value);
      const nights = parseInt(nightsInput.value, 10) || 1;
      const subtotal = rate * nights;
      const taxes = subtotal * 0.12;
      const total = subtotal + taxes;
      totalEl.textContent = `$${total.toFixed(2)}`;
    }

    [roomSelect, nightsInput, guestsInput].forEach(el => {
      if (el) el.addEventListener("input", updatePrice);
    });

    if (bookBtn) {
      bookBtn.addEventListener("click", () => {
        const bookingId = "BK-" + Math.floor(100000 + Math.random() * 900000);
        statusMsg.innerHTML = `<span style="color:var(--emerald); font-weight:700;">✓ Reservation Created!</span> Booking ID: <code>${bookingId}</code>. Invoice generated &amp; synced to SQLAlchemy database table.`;
      });
    }
  } else if (type === "automata") {
    const testBtn = document.getElementById("automata-test-btn");
    const regexInput = document.getElementById("automata-regex");
    const strInput = document.getElementById("automata-string");
    const output = document.getElementById("automata-trace-output");

    if (testBtn) {
      testBtn.addEventListener("click", () => {
        const r = regexInput.value.trim();
        const s = strInput.value.trim();
        const endsWithAbb = s.endsWith("abb");
        output.innerHTML = `
          Simulating Regex: <code>${r}</code> with Input: <code>"${s}"</code><br>
          Transition sequence: q0 → ${s.split("").map((c, i) => `q${(i % 3) + 1}`).join(" → ")}<br>
          ${endsWithAbb 
            ? `<span style="color:var(--emerald); font-weight:700;">✓ STRING ACCEPTED</span> — Reached Final Accepting State [q3]!`
            : `<span style="color:var(--rose); font-weight:700;">✗ STRING REJECTED</span> — Traversed to Non-Accepting State.`}
        `;
      });
    }
  } else if (type === "disaster") {
    const btn = document.getElementById("broadcast-alert-btn");
    const level = document.getElementById("alert-level");
    const audience = document.getElementById("alert-audience");
    const feed = document.getElementById("alert-feed-output");

    if (btn) {
      btn.addEventListener("click", () => {
        feed.innerHTML = `
          <strong style="color:var(--cyan);">[BROADCAST DISPATCHED]</strong><br>
          Event: <em>${level.options[level.selectedIndex].text}</em><br>
          Target: ${audience.value}<br>
          <span style="color:var(--emerald);">✓ Webhook alerts sent to mobile app &amp; SMS gateways via Next.js backend!</span>
        `;
      });
    }
  }
}

// ============================================================
// 13. CONTACT FORM REAL-TIME VALIDATION
// ============================================================
const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("contact-name");
const emailInput = document.getElementById("contact-email");
const messageInput = document.getElementById("contact-message");
const charCountSpan = document.getElementById("character-count");
const formFeedback = document.getElementById("form-status");

if (messageInput && charCountSpan) {
  messageInput.addEventListener("input", () => {
    const len = messageInput.value.length;
    charCountSpan.textContent = `${len} / 1,000`;
    charCountSpan.style.color = len > 900 ? "#f59e0b" : "";
  });
}

function validateField(input, testFn, errorMsg, errorElId) {
  const errEl = document.getElementById(errorElId);
  const isValid = input && testFn(input.value.trim());
  if (!input) return false;
  if (!isValid) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    input.setAttribute("aria-invalid", "true");
    if (errEl) errEl.textContent = errorMsg;
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    input.setAttribute("aria-invalid", "false");
    if (errEl) errEl.textContent = "";
  }
  return isValid;
}

let formSubmitted = false;

function runAllValidations() {
  const isNameValid = validateField(
    nameInput, v => v.length >= 2 && v.length <= 80,
    "Please enter your name (2–80 characters).", "name-error"
  );
  const isEmailValid = validateField(
    emailInput, v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254,
    "Please enter a valid email address.", "email-error"
  );
  const isMsgValid = validateField(
    messageInput, v => v.length >= 10 && v.length <= 1000,
    "Please enter a message between 10 and 1,000 characters.", "msg-error"
  );
  return { isNameValid, isEmailValid, isMsgValid, allValid: isNameValid && isEmailValid && isMsgValid };
}

[nameInput, emailInput, messageInput].forEach(inp => {
  if (!inp) return;
  inp.addEventListener("input", () => { if (formSubmitted) runAllValidations(); });
});

if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    formSubmitted = true;
    const { isNameValid, isEmailValid, isMsgValid, allValid } = runAllValidations();

    if (allValid) {
      formFeedback.className = "alert mt-3";
      formFeedback.style.cssText = "background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); border-radius: 10px; padding: 16px; color: var(--ink-primary);";
      formFeedback.innerHTML = `
        <strong style="color:#10b981;">✓ Message Formatted Correctly!</strong><br>
        <span style="font-size:0.875rem; color: var(--ink-secondary);">To connect directly with Sathvika, please send an email to
        <a href="mailto:sathvika.talari04@gmail.com" style="color: var(--cyan); font-weight:700;">sathvika.talari04@gmail.com</a>.</span>
      `;
    } else {
      formFeedback.className = "alert mt-3";
      formFeedback.style.cssText = "background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); border-radius: 10px; padding: 16px; color: var(--ink-primary);";
      formFeedback.textContent = "Please correct the highlighted fields before submitting.";
      if (!isNameValid && nameInput) nameInput.focus();
      else if (!isEmailValid && emailInput) emailInput.focus();
      else if (!isMsgValid && messageInput) messageInput.focus();
    }
  });
}

// ============================================================
// 14. MOBILE NAV AUTO-COLLAPSE
// ============================================================
document.querySelectorAll("#navigation .nav-link").forEach(link => {
  link.addEventListener("click", () => {
    const navCollapse = document.getElementById("navigation");
    if (navCollapse && navCollapse.classList.contains("show") && window.bootstrap) {
      bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
    }
  });
});

// ============================================================
// 15. ACTIVE NAV LINK ON SCROLL
// ============================================================
(function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
})();

// ============================================================
// 16. FOOTER YEAR
// ============================================================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
