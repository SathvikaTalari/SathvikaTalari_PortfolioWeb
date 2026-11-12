"use strict";

/**
 * Sathvika Talari — Portfolio Engine v5.0
 * Comprehensive Interactive & Animated Experience
 * Includes: LADRIS, LearnSphere, VidyaQuest, Alonzo AI, WE HUB, 3D Tilt,
 * Live Sandboxes, Command Palette, Audio FX Synthesizer, and Particle Canvas.
 */

// ============================================================
// 1. WEB AUDIO API SYNTHESIZER (Micro Sound FX)
// ============================================================
let audioCtx = null;
let soundEnabled = false;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function playClickSound(freq = 900, type = "sine", duration = 0.04) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    /* audio fallback noop */
  }
}

const soundToggleBtn = document.getElementById("sound-toggle");
const soundMutedIcon = document.getElementById("sound-icon-muted");
const soundActiveIcon = document.getElementById("sound-icon-active");

if (soundToggleBtn) {
  soundToggleBtn.addEventListener("click", () => {
    initAudio();
    soundEnabled = !soundEnabled;
    soundToggleBtn.setAttribute("aria-pressed", String(soundEnabled));
    if (soundMutedIcon && soundActiveIcon) {
      soundMutedIcon.style.display = soundEnabled ? "none" : "inline-block";
      soundActiveIcon.style.display = soundEnabled ? "inline-block" : "none";
    }
    if (soundEnabled) playClickSound(1200, "triangle", 0.08);
  });
}

// Global button sound handler
document.addEventListener("click", (e) => {
  if (e.target.closest("button, .btn, .nav-link, .tag-item, .card-tab-btn")) {
    playClickSound(850, "sine", 0.03);
  }
});

// ============================================================
// 2. SCROLL PROGRESS BAR
// ============================================================
const scrollProgress = document.getElementById("scroll-progress");
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = progress + "%";
}, { passive: true });

// ============================================================
// 3. STICKY HEADER SCROLLED STATE
// ============================================================
const siteHeader = document.getElementById("site-header");
window.addEventListener("scroll", () => {
  if (siteHeader) {
    siteHeader.classList.toggle("scrolled", window.scrollY > 40);
  }
}, { passive: true });

// ============================================================
// 4. QUANTUM ORBITAL PHYSICS CURSOR & PARTICLE TRAIL ENGINE
// ============================================================
(function initQuantumCursor() {
  if (!window.matchMedia("(hover: hover)").matches || window.innerWidth < 992) return;

  const cursorContainer = document.getElementById("custom-cursor");
  const cursorLabel = document.getElementById("cursor-label");
  const trailCanvas = document.getElementById("cursor-trail-canvas");
  if (!cursorContainer || !trailCanvas) return;

  const ctx = trailCanvas.getContext("2d");
  if (!ctx) return;

  function resizeCanvas() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas, { passive: true });
  resizeCanvas();

  let mouseX = -100, mouseY = -100;
  let currX = -100, currY = -100;
  let prevMouseX = -100, prevMouseY = -100;
  let isMouseOut = true;

  // Particle systems for trail & click ripples
  const particles = [];
  const ripples = [];

  class Spark {
    constructor(x, y, vx, vy, color, size, decay) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
      this.size = size;
      this.alpha = 1;
      this.decay = decay || 0.035;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.94;
      this.vy *= 0.94;
      this.alpha -= this.decay;
    }
    draw(context) {
      if (this.alpha <= 0) return;
      context.save();
      context.globalAlpha = Math.max(0, this.alpha);
      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fillStyle = this.color;
      context.shadowColor = this.color;
      context.shadowBlur = 8;
      context.fill();
      context.restore();
    }
  }

  class Ripple {
    constructor(x, y, maxR, color) {
      this.x = x;
      this.y = y;
      this.radius = 2;
      this.maxR = maxR || 42;
      this.color = color || "#38bdf8";
      this.alpha = 1;
    }
    update() {
      this.radius += (this.maxR - this.radius) * 0.18 + 0.5;
      this.alpha -= 0.045;
    }
    draw(context) {
      if (this.alpha <= 0) return;
      context.save();
      context.globalAlpha = Math.max(0, this.alpha);
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.strokeStyle = this.color;
      context.lineWidth = 1.5;
      context.stroke();
      context.restore();
    }
  }

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (isMouseOut) {
      isMouseOut = false;
      currX = mouseX;
      currY = mouseY;
      cursorContainer.style.opacity = "1";
    }

    // Spawn trailing sparks on movement
    const dx = mouseX - prevMouseX;
    const dy = mouseY - prevMouseY;
    const speed = Math.hypot(dx, dy);

    if (speed > 4 && particles.length < 90) {
      const count = Math.min(Math.floor(speed / 12) + 1, 3);
      for (let i = 0; i < count; i++) {
        const angle = Math.atan2(dy, dx) + Math.PI + (Math.random() - 0.5) * 1.2;
        const sparkSpeed = Math.random() * 2 + 0.5;
        const color = Math.random() > 0.4 ? "#38bdf8" : (Math.random() > 0.5 ? "#818cf8" : "#f43f5e");
        particles.push(new Spark(
          mouseX + (Math.random() - 0.5) * 6,
          mouseY + (Math.random() - 0.5) * 6,
          Math.cos(angle) * sparkSpeed,
          Math.sin(angle) * sparkSpeed,
          color,
          Math.random() * 2.2 + 0.8,
          Math.random() * 0.03 + 0.03
        ));
      }
    }
    prevMouseX = mouseX;
    prevMouseY = mouseY;
  }, { passive: true });

  // Click shockwave & spark explosion
  document.addEventListener("mousedown", (e) => {
    cursorContainer.classList.add("clicking");
    ripples.push(new Ripple(e.clientX, e.clientY, 46, "#38bdf8"));
    ripples.push(new Ripple(e.clientX, e.clientY, 28, "#818cf8"));

    // Burst sparks
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.4;
      const spd = Math.random() * 3.5 + 1.5;
      const color = i % 2 === 0 ? "#38bdf8" : "#f43f5e";
      particles.push(new Spark(
        e.clientX,
        e.clientY,
        Math.cos(angle) * spd,
        Math.sin(angle) * spd,
        color,
        Math.random() * 2.5 + 1.2,
        Math.random() * 0.04 + 0.03
      ));
    }
  });

  document.addEventListener("mouseup", () => {
    cursorContainer.classList.remove("clicking");
  });

  document.addEventListener("mouseleave", () => {
    isMouseOut = true;
    cursorContainer.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    isMouseOut = false;
    cursorContainer.style.opacity = "1";
  });

  // Dynamic Contextual Hover Labels
  function updateHoverState(el) {
    if (!el) {
      cursorContainer.classList.remove("hovering");
      if (cursorLabel) cursorLabel.textContent = "";
      return;
    }

    cursorContainer.classList.add("hovering");

    let label = "EXPLORE";
    if (el.matches("#jumping-dog, .jumping-dog-container, .dog-character")) {
      label = "PET ME 🐾";
    } else if (el.matches(".copy-email-btn, #copy-email-btn")) {
      label = "COPY 📋";
    } else if (el.matches("[data-action='open-resume'], #header-resume-btn, #hero-resume-interactive-btn, .floating-resume-trigger")) {
      label = "RESUME 📄";
    } else if (el.matches(".interactive-demo-btn, [data-project-id]")) {
      label = "SANDBOX ⚡";
    } else if (el.matches(".project-live-btn, a[target='_blank']")) {
      label = "LAUNCH ↗";
    } else if (el.matches("#theme-toggle")) {
      label = "THEME 🌓";
    } else if (el.matches("#sound-toggle")) {
      label = "AUDIO 🔊";
    } else if (el.matches("#cmd-palette-toggle")) {
      label = "SEARCH ⌘K";
    } else if (el.matches(".filter-btn, [data-filter], [data-skill-filter]")) {
      label = "FILTER";
    } else if (el.matches(".skill-logo-card")) {
      label = "SKILL ⚡";
    } else if (el.matches(".card-tab-btn, #run-code-btn")) {
      label = "RUN ▶";
    } else if (el.matches("button[type='submit']")) {
      label = "SEND ✉️";
    } else if (el.matches(".nav-link")) {
      label = "JUMP ▾";
    } else if (el.matches("a, button, [role='button']")) {
      label = "VIEW";
    }

    if (cursorLabel) cursorLabel.textContent = label;
  }

  document.addEventListener("mouseover", (e) => {
    const target = e.target.closest("a, button, [role='button'], .skill-logo-card, .filter-btn, .project-case-card, .card-tab-btn, .interest-card, .tag-item");
    updateHoverState(target);
  });

  // RAF Render Loop
  function renderCursor() {
    currX += (mouseX - currX) * 0.22;
    currY += (mouseY - currY) * 0.22;
    cursorContainer.style.transform = `translate3d(${currX}px, ${currY}px, 0)`;

    ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].update();
      ripples[i].draw(ctx);
      if (ripples[i].alpha <= 0) ripples.splice(i, 1);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }

    requestAnimationFrame(renderCursor);
  }
  renderCursor();
})();

// ============================================================
// 5. THEME SWITCHING (Dark / Light)
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
// 6. DEEP SPACE GRAVITATIONAL NEBULA, METEORS & CONSTELLATION ENGINE
// ============================================================
(function initDeepSpaceCosmos() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const heroSection = document.getElementById("home");

  let width = 0, height = 0;
  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  const isDark = () => document.documentElement.dataset.bsTheme !== "light";

  // Mouse interaction state with gravitational lensing
  let mouse = { x: -1000, y: -1000, isOver: false, vx: 0, vy: 0 };
  let prevMouse = { x: -1000, y: -1000 };

  if (heroSection) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isOver = true;
      mouse.vx = mouse.x - prevMouse.x;
      mouse.vy = mouse.y - prevMouse.y;
      prevMouse.x = mouse.x;
      prevMouse.y = mouse.y;
    }, { passive: true });

    heroSection.addEventListener("mouseleave", () => {
      mouse.isOver = false;
      mouse.x = -1000;
      mouse.y = -1000;
    });
  }

  // Tier 1: Distant Stellar Dust Stars (Twinkling cosmic background)
  class DistantStar {
    constructor() {
      this.reset(true);
    }
    reset(init = false) {
      this.x = Math.random() * width;
      this.y = init ? Math.random() * height : -10;
      this.size = Math.random() * 1.3 + 0.3;
      this.baseAlpha = Math.random() * 0.55 + 0.15;
      this.alpha = this.baseAlpha;
      this.twinkleSpeed = Math.random() * 0.04 + 0.01;
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.colorType = Math.random();
    }
    update() {
      this.twinklePhase += this.twinkleSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.twinklePhase) * 0.22;
      this.y += 0.08; // slow celestial drift
      if (this.y > height + 10) this.reset(false);
    }
    draw(context) {
      const dark = isDark();
      let color;
      if (this.colorType > 0.7) {
        color = dark ? `rgba(56, 189, 248, ${Math.max(0, this.alpha)})` : `rgba(2, 132, 199, ${Math.max(0, this.alpha * 0.6)})`;
      } else if (this.colorType > 0.4) {
        color = dark ? `rgba(129, 140, 248, ${Math.max(0, this.alpha)})` : `rgba(79, 70, 229, ${Math.max(0, this.alpha * 0.5)})`;
      } else {
        color = dark ? `rgba(255, 255, 255, ${Math.max(0, this.alpha * 0.9)})` : `rgba(15, 23, 42, ${Math.max(0, this.alpha * 0.4)})`;
      }
      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fillStyle = color;
      context.fill();
    }
  }

  // Tier 2: Midground Constellation & Gravitational Nodes
  class ConstellationNode {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.originX = this.x;
      this.originY = this.y;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 1.8 + 0.8;
      this.color = Math.random() > 0.45 ? "cyan" : "violet";
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.pulse += 0.025;

      // Gravitational Lensing effect when mouse is near
      if (mouse.isOver) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        const maxDist = 180;

        if (dist < maxDist && dist > 10) {
          const force = (1 - dist / maxDist) * 0.45;
          // Orbital vortex velocity component
          const tangentX = -dy / dist;
          const tangentY = dx / dist;

          this.vx += (dx / dist) * force * 0.35 + tangentX * force * 0.25;
          this.vy += (dy / dist) * force * 0.35 + tangentY * force * 0.25;
        }
      }

      // Natural drag & damping to prevent infinite acceleration
      this.vx *= 0.97;
      this.vy *= 0.97;

      // Ensure slight wander speed
      if (Math.abs(this.vx) < 0.1) this.vx += (Math.random() - 0.5) * 0.05;
      if (Math.abs(this.vy) < 0.1) this.vy += (Math.random() - 0.5) * 0.05;

      this.x += this.vx;
      this.y += this.vy;

      // Wrap around bounds
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      if (this.y > height + 20) this.y = -20;
    }
    draw(context) {
      const dark = isDark();
      const alpha = Math.sin(this.pulse) * 0.25 + 0.65;
      const c = this.color === "cyan"
        ? (dark ? `rgba(56, 189, 248, ${alpha})` : `rgba(2, 132, 199, ${alpha})`)
        : (dark ? `rgba(129, 140, 248, ${alpha})` : `rgba(79, 70, 229, ${alpha})`);

      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fillStyle = c;
      if (dark && this.size > 1.4) {
        context.shadowColor = c;
        context.shadowBlur = 6;
      }
      context.fill();
      context.shadowBlur = 0;
    }
  }

  // Tier 3: Supersonic Meteors / Shooting Stars
  const meteors = [];

  class Meteor {
    constructor(startX, startY) {
      this.x = typeof startX === "number" ? startX : Math.random() * (width * 0.8) + (width * 0.1);
      this.y = typeof startY === "number" ? startY : Math.random() * (height * 0.4);
      this.length = Math.random() * 85 + 75;
      this.speed = Math.random() * 14 + 18;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2; // ~45 deg trajectory
      this.dx = Math.cos(this.angle) * this.speed;
      this.dy = Math.sin(this.angle) * this.speed;
      this.thickness = Math.random() * 2 + 1.2;
      this.alpha = 1;
      this.decay = Math.random() * 0.018 + 0.016;
      this.color = Math.random() > 0.4 ? "#38bdf8" : "#ffffff";
    }
    update() {
      this.x += this.dx;
      this.y += this.dy;
      this.alpha -= this.decay;
    }
    draw(context) {
      if (this.alpha <= 0) return;
      context.save();
      context.globalAlpha = Math.max(0, this.alpha);

      // Meteor Ion Tail
      const tailX = this.x - Math.cos(this.angle) * this.length;
      const tailY = this.y - Math.sin(this.angle) * this.length;

      const grad = context.createLinearGradient(tailX, tailY, this.x, this.y);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.7, this.color === "#ffffff" ? "rgba(129, 140, 248, 0.4)" : "rgba(56, 189, 248, 0.35)");
      grad.addColorStop(1, this.color);

      context.beginPath();
      context.moveTo(tailX, tailY);
      context.lineTo(this.x, this.y);
      context.strokeStyle = grad;
      context.lineWidth = this.thickness;
      context.lineCap = "round";
      context.stroke();

      // Glowing Meteor Head
      context.beginPath();
      context.arc(this.x, this.y, this.thickness * 1.4, 0, Math.PI * 2);
      context.fillStyle = "#ffffff";
      context.shadowColor = "#38bdf8";
      context.shadowBlur = 12;
      context.fill();

      context.restore();
    }
  }

  // Tier 4: Solar Flare / Supernova Shockwaves on Click
  const shockwaves = [];

  class SolarFlareWave {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 4;
      this.maxRadius = 160;
      this.alpha = 1;
    }
    update() {
      this.radius += (this.maxRadius - this.radius) * 0.16 + 2;
      this.alpha -= 0.035;
    }
    draw(context) {
      if (this.alpha <= 0) return;
      context.save();
      context.globalAlpha = Math.max(0, this.alpha);

      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.strokeStyle = "rgba(56, 189, 248, 0.8)";
      context.lineWidth = 2;
      context.stroke();

      // Outer secondary wave
      context.beginPath();
      context.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
      context.strokeStyle = "rgba(129, 140, 248, 0.5)";
      context.lineWidth = 1;
      context.stroke();

      context.restore();
    }
  }

  // Initialize Stellar Collections
  const distantStars = [];
  const DISTANT_STAR_COUNT = 85;
  for (let i = 0; i < DISTANT_STAR_COUNT; i++) distantStars.push(new DistantStar());

  const constellationNodes = [];
  const CONSTELLATION_COUNT = 55;
  for (let i = 0; i < CONSTELLATION_COUNT; i++) constellationNodes.push(new ConstellationNode());

  // Function to shoot a meteor
  function launchMeteor(x, y) {
    meteors.push(new Meteor(x, y));
  }

  // Periodic natural shooting star (every 8 to 14 seconds)
  function scheduleNaturalMeteor() {
    const delay = Math.random() * 6000 + 7000;
    setTimeout(() => {
      if (document.visibilityState === "visible") {
        launchMeteor();
      }
      scheduleNaturalMeteor();
    }, delay);
  }
  scheduleNaturalMeteor();

  // Trigger on click in hero
  if (heroSection) {
    heroSection.addEventListener("click", (e) => {
      // Don't override buttons or links
      if (e.target.closest("a, button, input, textarea, .btn")) return;
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      shockwaves.push(new SolarFlareWave(cx, cy));

      // Push nearby constellation nodes in a shockwave
      constellationNodes.forEach(node => {
        const dx = node.x - cx;
        const dy = node.y - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < 180 && dist > 1) {
          const pushForce = (1 - dist / 180) * 8;
          node.vx += (dx / dist) * pushForce;
          node.vy += (dy / dist) * pushForce;
        }
      });

      // Also launch a responsive meteor!
      launchMeteor(cx - 100, Math.max(20, cy - 120));
    });
  }

  // Bind dedicated "Launch Meteor" button
  const meteorBtn = document.getElementById("cosmic-meteor-btn");
  if (meteorBtn) {
    meteorBtn.addEventListener("click", () => {
      launchMeteor();
      setTimeout(() => launchMeteor(), 300);
    });
  }

  // Keyboard shortcut: Press 'M' to launch a meteor
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "m" || e.key === "M") {
      launchMeteor();
    }
  });

  // Draw Constellation Interconnections
  function drawConstellationLines() {
    const dark = isDark();
    for (let i = 0; i < constellationNodes.length; i++) {
      for (let j = i + 1; j < constellationNodes.length; j++) {
        const dx = constellationNodes[i].x - constellationNodes[j].x;
        const dy = constellationNodes[i].y - constellationNodes[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 115) {
          const alpha = (1 - dist / 115) * 0.16;
          ctx.beginPath();
          ctx.strokeStyle = dark ? `rgba(56, 189, 248, ${alpha})` : `rgba(2, 132, 199, ${alpha})`;
          ctx.lineWidth = 0.55;
          ctx.moveTo(constellationNodes[i].x, constellationNodes[i].y);
          ctx.lineTo(constellationNodes[j].x, constellationNodes[j].y);
          ctx.stroke();
        }
      }

      // Also draw subtle filaments to cursor if mouse is nearby
      if (mouse.isOver) {
        const dx = mouse.x - constellationNodes[i].x;
        const dy = mouse.y - constellationNodes[i].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.22;
          ctx.beginPath();
          ctx.strokeStyle = dark ? `rgba(129, 140, 248, ${alpha})` : `rgba(79, 70, 229, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.moveTo(constellationNodes[i].x, constellationNodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  // Main Cosmic Animation Loop
  function renderCosmos() {
    ctx.clearRect(0, 0, width, height);

    // 1. Distant twinkle stars
    distantStars.forEach(s => { s.update(); s.draw(ctx); });

    // 2. Midground constellation nodes & filaments
    constellationNodes.forEach(n => { n.update(); n.draw(ctx); });
    drawConstellationLines();

    // 3. Supernova / Solar Flare shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      shockwaves[i].update();
      shockwaves[i].draw(ctx);
      if (shockwaves[i].alpha <= 0) shockwaves.splice(i, 1);
    }

    // 4. Supersonic meteors
    for (let i = meteors.length - 1; i >= 0; i--) {
      meteors[i].update();
      meteors[i].draw(ctx);
      if (meteors[i].alpha <= 0 || meteors[i].x > width + 100 || meteors[i].y > height + 100) {
        meteors.splice(i, 1);
      }
    }

    requestAnimationFrame(renderCosmos);
  }
  renderCosmos();
})();

// ============================================================
// 7. TYPEWRITER EFFECT
// ============================================================
(function initTypewriter() {
  const el = document.getElementById("typewriter-text");
  if (!el) return;

  const phrases = [
    "Full-Stack Web (React.js, Node.js, Express, Django)",
    "Predictive AI & LightGBM Systems (LADRIS)",
    "Generative AI & Multimodal LLM Pipelines",
    "Offline-First STEM Learning PWAs (VidyaQuest)",
    "Explainable AI, SHAP & GIS Spatial Mapping",
    "Scalable Databases (PostgreSQL, Supabase, SQLite)",
    "Open Source Contributions (GSSoC & Hacktoberfest)"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 80;

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      delay = 40;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      delay = 75;
    }

    if (!isDeleting && charIndex === current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 800);
})();

// ============================================================
// 8. 3D TILT EFFECT ON HERO CARD
// ============================================================
(function init3DTilt() {
  const card = document.getElementById("hero-interactive-card");
  if (!card) return;

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateY(-4deg) rotateX(2deg)";
  });
})();

// ============================================================
// 9. HERO IDE TABS & CODE EXECUTION
// ============================================================
(function initHeroIDE() {
  const tabEng = document.getElementById("tab-engineer");
  const tabSkills = document.getElementById("tab-skills");
  const contentEng = document.getElementById("code-content-engineer");
  const contentSkills = document.getElementById("code-content-skills");
  const runBtn = document.getElementById("run-code-btn");
  const termText = document.getElementById("terminal-text");

  if (tabEng && tabSkills && contentEng && contentSkills) {
    tabEng.addEventListener("click", () => {
      tabEng.classList.add("active");
      tabSkills.classList.remove("active");
      contentEng.style.display = "block";
      contentSkills.style.display = "none";
    });

    tabSkills.addEventListener("click", () => {
      tabSkills.classList.add("active");
      tabEng.classList.remove("active");
      contentSkills.style.display = "block";
      contentEng.style.display = "none";
    });
  }

  if (runBtn && termText) {
    runBtn.addEventListener("click", () => {
      termText.innerHTML = "<span class='text-cyan'>Compiling TypeScript AST...</span>";
      setTimeout(() => {
        termText.innerHTML = `
          <span style="color:#10b981;">✓ [EXECUTION SUCCESS 200 OK]</span><br>
          &gt; Developer: Sathvika Talari (9.5 CGPA)<br>
          &gt; Ready to engineer cutting-edge AI &amp; Web products!
        `;
      }, 500);
    });
  }
})();

// ============================================================
// 10. SCROLL REVEAL & COUNTERS
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
      el.textContent = value.toFixed(decimals) + (el.dataset.target === "90" ? "%" : "");
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
// 11. PROJECTS DATA & REFERENCE SHOWCASE (5 Featured Projects)
// ============================================================
// ============================================================
// ============================================================
// 11. PROJECTS DATA DEFINITION (Pure Respective Descriptions Only)
// ============================================================
const projects = [
  {
    id: 1,
    title: "LADRIS – Land Acquisition Delay Risk Intelligence System",
    shortTitle: "LADRIS",
    subtitle: "Land Acquisition Delay Risk Intelligence System",
    image: "assets/ladris.jpg",
    imageAlt: "LADRIS Land Acquisition Delay Risk Intelligence System",
    indexLabel: "01",
    badge: "AI & GEOSPATIAL INTELLIGENCE",
    categories: ["ai", "web"],
    liveUrl: "https://ladris.vercel.app/landing",
    githubUrl: "https://github.com/SathvikaTalari/LADRIS",
    description: "An AI-powered predictive analytics platform designed to identify and assess potential delays in government land acquisition projects using machine learning and geospatial intelligence.",
    overview: "LADRIS is an AI-powered predictive analytics platform designed to identify and assess potential delays in government land acquisition projects. It helps authorities understand project risks, prioritize critical cases, and make informed decisions using machine learning and geospatial intelligence.",
    problemStatement: "Land acquisition for infrastructure projects often faces delays due to documentation issues, administrative dependencies, and other project-related factors. Identifying potential delays early and prioritizing high-risk cases can be challenging.",
    solution: "Developed a predictive analytics system that analyzes land acquisition-related data to identify anomalies, estimate risk levels, and generate priority scores. The platform presents actionable insights through an interactive dashboard.",
    keyFeatures: [
      "Machine learning-based risk prediction and anomaly detection.",
      "Risk scoring and priority ranking from 0–100.",
      "SHAP-based explainability to understand prediction factors.",
      "Geospatial visualization using PostGIS.",
      "Interactive dashboard for monitoring and analyzing project risks.",
      "REST API integration between the frontend and backend."
    ],
    technologiesText: "Python, FastAPI, React.js, TypeScript, PostgreSQL, PostGIS, Scikit-learn, SHAP, Tailwind CSS, Docker.",
    technologies: ["Python", "FastAPI", "React.js", "TypeScript", "PostgreSQL", "PostGIS", "Scikit-learn", "SHAP", "Tailwind CSS", "Docker"],
    tags: ["Python", "FastAPI", "React.js", "TypeScript", "PostgreSQL", "PostGIS", "Scikit-learn", "SHAP", "Docker"],
    myContribution: "Worked on developing the full-stack application, integrating machine learning capabilities, implementing backend APIs, and building an interactive dashboard for visualizing predictive insights.",
    projectContext: "Developed for the Smart India Hackathon problem statement on predictive analytics for early detection of land acquisition delays.",
    techIcons: [
      { name: "Python", class: "devicon-python-plain colored" },
      { name: "FastAPI", class: "devicon-fastapi-plain colored" },
      { name: "React.js", class: "devicon-react-original colored" },
      { name: "TypeScript", class: "devicon-typescript-plain colored" },
      { name: "PostgreSQL", class: "devicon-postgresql-plain colored" },
      { name: "PostGIS", text: "🗺️ PostGIS" },
      { name: "Machine Learning", text: "🧠 ML" },
      { name: "SHAP", text: "📊 SHAP" }
    ],
    status: "Completed"
  },
  {
    id: 2,
    title: "LearnSphere AI – AI-Powered Learning Platform",
    shortTitle: "LearnSphere AI",
    subtitle: "AI-Powered Learning Platform",
    image: "assets/learnsphere.jpg",
    imageAlt: "LearnSphere AI AI-Powered Learning Platform",
    indexLabel: "02",
    badge: "AI & EDTECH PLATFORM",
    categories: ["ai", "web"],
    liveUrl: "https://learn-sphere-platform.vercel.app/login",
    githubUrl: "https://github.com/SathvikaTalari/LearnSphere_Platform",
    description: "An intelligent learning platform designed to provide students with an interactive and personalized educational experience combining structured resources with AI assistance.",
    overview: "LearnSphere AI is an intelligent learning platform designed to provide students with an interactive and personalized educational experience. It combines structured learning resources with AI-powered assistance to help learners understand concepts, clarify doubts, and improve their knowledge.",
    problemStatement: "Traditional learning platforms often provide limited personalized assistance, making it difficult for students to clarify doubts and receive immediate guidance while learning.",
    solution: "Developed an AI-powered learning platform that brings together courses, lessons, quizzes, progress tracking, and AI-based learning assistance in one place.",
    keyFeatures: [
      "Course creation and management for educators.",
      "Structured lessons and interactive quizzes.",
      "AI-powered explanations for complex concepts.",
      "AI assistance for coding-related questions.",
      "Learning progress tracking.",
      "Assessment and performance monitoring.",
      "Certificate generation for completed learning activities."
    ],
    technologiesText: "Python, Flask, JavaScript, HTML, CSS, REST APIs, AI APIs.",
    technologies: ["Python", "Flask", "JavaScript", "HTML", "CSS", "REST APIs", "AI APIs"],
    tags: ["Python", "Flask", "JavaScript", "HTML", "CSS", "REST APIs", "AI APIs"],
    myContribution: "Developed the application using Flask and JavaScript, implemented core learning functionalities, integrated AI API capabilities, and worked on course management, assessments, and progress-tracking features.",
    projectContext: null,
    techIcons: [
      { name: "Python", class: "devicon-python-plain colored" },
      { name: "Flask", class: "devicon-flask-original colored" },
      { name: "JavaScript", class: "devicon-javascript-plain colored" },
      { name: "HTML5", class: "devicon-html5-plain colored" },
      { name: "CSS3", class: "devicon-css3-plain colored" },
      { name: "REST APIs", text: "🔌 REST" },
      { name: "AI APIs", text: "✨ AI APIs" }
    ],
    status: "Completed"
  },
  {
    id: 3,
    title: "VidyaQuest – Gamified STEM Learning Platform",
    shortTitle: "VidyaQuest",
    subtitle: "Gamified STEM Learning Platform",
    image: "assets/vidyaquest.jpg",
    imageAlt: "VidyaQuest Gamified STEM Learning Platform",
    indexLabel: "03",
    badge: "STEM GAMIFICATION & PWA",
    categories: ["web", "core"],
    liveUrl: "https://vidyaquest-stem.onrender.com/",
    githubUrl: "https://github.com/SathvikaTalari/VidyaQuest",
    description: "A gamified STEM learning platform designed to make quality education more accessible and engaging for students in Grades 6–12, particularly in rural and low-connectivity areas.",
    overview: "VidyaQuest is a gamified STEM learning platform designed to make quality education more accessible and engaging for students in Grades 6–12, particularly in rural and low-connectivity areas. It combines interactive educational activities, gamification, offline accessibility, and multilingual learning support.",
    problemStatement: "Students in rural and underserved communities often face challenges accessing quality educational resources due to limited internet connectivity, language barriers, and a lack of engaging digital learning experiences.",
    solution: "Developed an offline-first Progressive Web Application that makes STEM education interactive and accessible through gamified learning activities, multilingual support, and offline data synchronization.",
    keyFeatures: [
      "Interactive STEM lessons, quizzes, and learning activities.",
      "Gamification through XP points, levels, badges, gems, and learning streaks.",
      "Leaderboards to encourage participation and healthy competition.",
      "Offline-first functionality using Service Workers and IndexedDB.",
      "Support for eight Indian languages.",
      "Responsive Progressive Web Application experience.",
      "Student authentication and learning progress management.",
      "Data synchronization when internet connectivity becomes available."
    ],
    technologiesText: "HTML, CSS, JavaScript, Node.js, Express.js, SQLite, JWT, bcryptjs, Service Workers, IndexedDB, Progressive Web Apps.",
    technologies: ["HTML", "CSS", "JavaScript", "Node.js", "Express.js", "SQLite", "JWT", "bcryptjs", "Service Workers", "IndexedDB", "Progressive Web Apps"],
    tags: ["HTML", "CSS", "JavaScript", "Node.js", "Express.js", "SQLite", "JWT", "PWA"],
    myContribution: "Designed and developed the platform's frontend and backend functionality, implemented gamification features, integrated authentication, and worked on offline-first capabilities and multilingual accessibility.",
    projectContext: null,
    techIcons: [
      { name: "HTML5", class: "devicon-html5-plain colored" },
      { name: "CSS3", class: "devicon-css3-plain colored" },
      { name: "JavaScript", class: "devicon-javascript-plain colored" },
      { name: "Node.js", class: "devicon-nodejs-plain colored" },
      { name: "Express.js", class: "devicon-express-original" },
      { name: "SQLite", class: "devicon-sqlite-plain colored" },
      { name: "JWT", text: "🔒 JWT" },
      { name: "PWA", text: "📱 PWA" }
    ],
    status: "Completed"
  },
  {
    id: 4,
    title: "Automata Simulator – Interactive Automata Theory Learning Tool",
    shortTitle: "Automata Simulator",
    subtitle: "Interactive Automata Theory Learning Tool",
    image: "assets/automata.jpg",
    imageAlt: "Automata Simulator Interactive Automata Theory Learning Tool",
    indexLabel: "04",
    badge: "CORE CS & THEORY",
    categories: ["core"],
    liveUrl: null,
    githubUrl: "https://github.com/SathvikaTalari/Automata_Simulator",
    description: "An interactive web-based educational tool designed to simplify complex concepts of automata theory through practical simulations.",
    overview: "Automata Simulator is an interactive web-based educational tool designed to simplify complex concepts of automata theory. It allows students to explore finite automata, regular expressions, state transitions, and automata conversion algorithms through practical simulations.",
    problemStatement: "Understanding automata theory can be challenging for students because concepts such as state transitions, automata conversion, and minimization involve complex algorithmic processes that are difficult to visualize.",
    solution: "Developed an interactive simulator that demonstrates automata operations and conversion algorithms, helping students understand theoretical concepts through practical visualization and simulation.",
    keyFeatures: [
      "Deterministic Finite Automata (DFA) simulation.",
      "Non-Deterministic Finite Automata (NFA) simulation.",
      "Regular expression processing.",
      "Thompson's Construction for regular expression to NFA conversion.",
      "Subset Construction for NFA-to-DFA conversion.",
      "Hopcroft's algorithm for DFA minimization.",
      "Interactive exploration of automata operations and state transitions."
    ],
    technologiesText: "Python, Flask, JavaScript, HTML, CSS, Regular Expressions, Automata Theory.",
    technologies: ["Python", "Flask", "JavaScript", "HTML", "CSS", "Regular Expressions", "Automata Theory"],
    tags: ["Python", "Flask", "JavaScript", "HTML", "CSS", "DFA", "NFA", "Regex"],
    myContribution: "Developed the web application and implemented the core automata algorithms, simulation functionality, and interactive interface to make automata theory easier to understand and explore.",
    projectContext: null,
    techIcons: [
      { name: "Python", class: "devicon-python-plain colored" },
      { name: "Flask", class: "devicon-flask-original colored" },
      { name: "JavaScript", class: "devicon-javascript-plain colored" },
      { name: "HTML5", class: "devicon-html5-plain colored" },
      { name: "CSS3", class: "devicon-css3-plain colored" },
      { name: "DFA / NFA", text: "⚙️ DFA/NFA" },
      { name: "Regex", text: "🔤 Regex" }
    ],
    status: "Completed"
  },
  {
    id: 5,
    title: "Operational Fog – Communication Resilience & Decision-Making Training Platform",
    shortTitle: "Operational Fog",
    subtitle: "Communication Resilience & Decision-Making Training Platform",
    image: "assets/operational-fog.jpg",
    imageAlt: "Operational Fog Communication Resilience & Decision-Making Training Platform",
    indexLabel: "05",
    badge: "CRISIS SIMULATION & RESILIENCE",
    categories: ["web", "core"],
    liveUrl: null,
    githubUrl: "https://github.com/Yamzxx/OPERATIONAL-FOG",
    description: "A simulation-based training platform developed to evaluate decision-making, communication resilience, and team coordination under uncertain operational conditions.",
    overview: "Operational Fog is a simulation-based training platform developed to evaluate decision-making, communication resilience, and team coordination under uncertain operational conditions. It simulates communication disruptions such as delayed messages, signal blackouts, dropped dispatches, and conflicting field reports.",
    problemStatement: "During crisis management and tactical operations, communication disruptions can affect information accuracy, coordination, and decision-making. Training teams to respond effectively under such uncertain conditions is essential.",
    solution: "Developed a deterministic simulation framework that introduces controlled communication disruptions into training scenarios, allowing participants and instructors to evaluate decision-making, information verification, and operational resilience.",
    keyFeatures: [
      "Scenario-based communication disruption simulations.",
      "Configurable message delays, dropped dispatches, and communication blackouts.",
      "Simulation of conflicting and truncated field reports.",
      "Real-time multiplayer training through cross-tab synchronization.",
      "Team coordination and shared messaging.",
      "Decision console for recording decisions and rationales.",
      "Instructor controls and scenario management.",
      "Timeline replay for reviewing past simulation events.",
      "After-Action Review (AAR) with instructor notes and PDF report generation."
    ],
    technologiesText: "React 19, JavaScript, Vite, Node.js, Express.js, PostgreSQL, Docker, BroadcastChannel API, LocalStorage, Node.js Test Runner.",
    technologies: ["React 19", "JavaScript", "Vite", "Node.js", "Express.js", "PostgreSQL", "Docker", "BroadcastChannel API", "LocalStorage", "Node.js Test Runner"],
    tags: ["React 19", "JavaScript", "Vite", "Node.js", "Express.js", "PostgreSQL", "Docker"],
    myContribution: "Developed the simulation platform, implemented deterministic event handling, worked on multiplayer synchronization and data persistence, and built interactive training and review workflows.",
    projectContext: "Developed as an independent training prototype for the Smart India Hackathon (SIH) / Defence Training Simulation. All scenarios, dispatches, and telemetry are synthetic and intended for educational simulation purposes.",
    techIcons: [
      { name: "React", class: "devicon-react-original colored" },
      { name: "JavaScript", class: "devicon-javascript-plain colored" },
      { name: "Node.js", class: "devicon-nodejs-plain colored" },
      { name: "Express.js", class: "devicon-express-original" },
      { name: "PostgreSQL", class: "devicon-postgresql-plain colored" },
      { name: "Docker", class: "devicon-docker-plain colored" },
      { name: "Vite", text: "⚡ Vite" }
    ],
    status: "Completed"
  },
  {
    id: 6,
    title: "Hotel Management System – Flask-Based Web Application",
    shortTitle: "Hotel Management System",
    subtitle: "Flask-Based Web Application",
    image: "assets/hotel.jpg",
    imageAlt: "Hotel Management System Flask-Based Web Application",
    indexLabel: "06",
    badge: "BACKEND & WORKFLOW",
    categories: ["web"],
    liveUrl: "https://hotel-management-system-seven-alpha.vercel.app/login",
    githubUrl: "https://github.com/SathvikaTalari/Hotel_Management_System",
    description: "A web-based application developed to simplify hotel-related operations using Python and Flask, focusing on backend functionality, application workflows, and database interactions.",
    overview: "Hotel Management System is a web-based application developed to simplify hotel-related operations using Python and Flask. It focuses on backend functionality, application workflows, and database interactions to provide a functional hotel management solution.",
    problemStatement: "Managing hotel-related operations manually can make information handling and administrative workflows difficult. A centralized web application can help organize these processes.",
    solution: "Developed a Flask-based web application with backend functionality and database interactions to support hotel management workflows.",
    keyFeatures: [
      "Flask-based backend application.",
      "Application routing and request handling.",
      "Database interactions and data management.",
      "Hotel management workflow implementation.",
      "Web application functionality and interface integration."
    ],
    technologiesText: "Python, Flask, Web Development.",
    technologies: ["Python", "Flask", "Web Development"],
    tags: ["Python", "Flask", "Web Development"],
    myContribution: "Developed the Hotel Management System as part of my Python Development Internship at VaultofCodes. Worked on Python-based backend functionality, Flask application development, routing, and database-related operations.",
    projectContext: null,
    techIcons: [
      { name: "Python", class: "devicon-python-plain colored" },
      { name: "Flask", class: "devicon-flask-original colored" },
      { name: "Web Development", text: "🌐 Web Dev" }
    ],
    status: "Completed"
  }
];

// 12. PROJECT RENDERING & FILTERING (Exact Match to Reference Design)
// ============================================================
const projectGrid = document.getElementById("project-list");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCountLabel = document.getElementById("project-count");
const projectCategoryLabel = document.getElementById("projects-list-category");
const toggleProjectsBtn = document.getElementById("btn-toggle-projects");
const projectsToggleContainer = document.getElementById("projects-toggle-container");
const projectsToggleText = document.getElementById("projects-toggle-text");

let showAllProjects = false;
let currentProjectCategory = "all";

const categoryLabels = {
  all: "All Projects",
  ai: "AI & ML Projects",
  web: "Full-Stack Web Projects",
  core: "EdTech & Systems Projects"
};

function renderProjects(category = "all") {
  if (!projectGrid) return;
  currentProjectCategory = category;

  const filtered = projects.filter(p => category === "all" || p.categories.includes(category));
  const totalCount = filtered.length;
  const visibleProjects = showAllProjects ? filtered : filtered.slice(0, 2);

  projectGrid.style.opacity = "0";
  projectGrid.style.transform = "translateY(12px)";
  projectGrid.style.transition = "opacity 0.25s ease, transform 0.25s ease";

  setTimeout(() => {
    projectGrid.replaceChildren();

    visibleProjects.forEach((project, idx) => {
      const col = document.createElement("div");
      col.className = "col-lg-6 mb-4";

      const techIconsHtml = (project.techIcons || []).map(ti => {
        if (ti.class) {
          return `<span class="proj-tech-icon-item" title="${ti.name}"><i class="${ti.class}"></i></span>`;
        } else {
          return `<span class="proj-tech-pill-item" title="${ti.name}">${ti.text}</span>`;
        }
      }).join("");

      col.innerHTML = `
        <article class="proj-card-ref" style="animation-delay:${idx * 0.08}s">
          <!-- Top Preview Banner / Image -->
          <div class="proj-card-image-box">
            <img src="${project.image}" alt="${project.imageAlt}" loading="lazy" class="proj-card-cover-img">
          </div>

          <!-- Card Body -->
          <div class="proj-card-body">
            <!-- Title Row -->
            <div class="proj-card-title-row">
              <h3 class="proj-card-title">${project.title}</h3>
            </div>

            <!-- Description -->
            <p class="proj-card-desc">${project.description}</p>

            <!-- Technologies Block -->
            <div class="proj-card-tech-section">
              <span class="proj-card-tech-label">Technologies</span>
              <div class="proj-card-tech-icons">
                ${techIconsHtml}
              </div>
            </div>

            <!-- Footer -->
            <div class="proj-card-footer">
              <button type="button" class="proj-view-details-btn" data-project-id="${project.id}">
                View Details →
              </button>
            </div>
          </div>
        </article>
      `;

      projectGrid.appendChild(col);
    });

    if (projectCategoryLabel) {
      projectCategoryLabel.textContent = categoryLabels[category] || "Projects";
    }
    if (projectCountLabel) {
      if (!showAllProjects && totalCount > 2) {
        projectCountLabel.textContent = `(Showing 2 of ${totalCount} projects)`;
      } else {
        projectCountLabel.textContent = `(${totalCount} ${totalCount === 1 ? "project" : "projects"})`;
      }
    }

    // Toggle button state
    if (projectsToggleContainer && toggleProjectsBtn) {
      if (totalCount > 2) {
        projectsToggleContainer.style.display = "flex";
        if (showAllProjects) {
          toggleProjectsBtn.classList.add("expanded");
          toggleProjectsBtn.setAttribute("aria-expanded", "true");
          if (projectsToggleText) {
            projectsToggleText.textContent = "Show Less";
          }
          const icon = toggleProjectsBtn.querySelector(".btn-toggle-icon");
          if (icon) {
            icon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
          }
        } else {
          toggleProjectsBtn.classList.remove("expanded");
          toggleProjectsBtn.setAttribute("aria-expanded", "false");
          if (projectsToggleText) {
            projectsToggleText.textContent = `Show All Projects (${totalCount})`;
          }
          const icon = toggleProjectsBtn.querySelector(".btn-toggle-icon");
          if (icon) {
            icon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
          }
        }
      } else {
        projectsToggleContainer.style.display = "none";
      }
    }

    // Attach click listeners to "View Details →" buttons to open interactive modal
    document.querySelectorAll(".proj-view-details-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const pid = parseInt(btn.dataset.projectId, 10);
        const proj = projects.find(p => p.id === pid);
        if (proj) openProjectModal(proj);
      });
    });

    requestAnimationFrame(() => {
      projectGrid.style.opacity = "1";
      projectGrid.style.transform = "translateY(0)";
    });
  }, 180);
}

if (toggleProjectsBtn) {
  toggleProjectsBtn.addEventListener("click", () => {
    showAllProjects = !showAllProjects;
    renderProjects(currentProjectCategory);

    // Redirect / smooth scroll to #projects section
    location.hash = "#projects";
    const projSection = document.getElementById("projects");
    if (projSection) {
      projSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    showAllProjects = false; // Reset to top 2 for each category initially
    renderProjects(btn.dataset.filter);
  });
});

renderProjects("all");

// ============================================================
// 13. SKILLS FILTERING
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
// 14. PROJECT MODAL (Pure Respective Project Description Only)
// ============================================================
function openProjectModal(project) {
  const titleEl = document.getElementById("project-modal-title");
  const subtitleEl = document.getElementById("project-modal-subtitle");
  const bannerImgEl = document.getElementById("project-modal-banner-img");
  const bannerBoxEl = document.getElementById("project-modal-banner-box");
  const detailsContainer = document.getElementById("project-modal-details-content");
  const liveLinkBtn = document.getElementById("project-modal-live-link");
  const githubLinkBtn = document.getElementById("project-modal-github-link");

  if (titleEl) titleEl.textContent = project.shortTitle || project.title;
  if (subtitleEl) subtitleEl.textContent = project.subtitle || "";

  if (bannerImgEl && bannerBoxEl) {
    if (project.image) {
      bannerImgEl.src = project.image;
      bannerImgEl.alt = project.imageAlt || project.title;
      bannerBoxEl.style.display = "block";
    } else {
      bannerBoxEl.style.display = "none";
    }
  }

  if (githubLinkBtn) {
    if (project.githubUrl) {
      githubLinkBtn.href = project.githubUrl;
      githubLinkBtn.style.display = "inline-flex";
    } else {
      githubLinkBtn.style.display = "none";
    }
  }

  if (liveLinkBtn) {
    if (project.liveUrl) {
      liveLinkBtn.href = project.liveUrl;
      liveLinkBtn.style.display = "inline-flex";
      liveLinkBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Live Demo ↗
      `;
    } else {
      liveLinkBtn.style.display = "none";
    }
  }

  if (detailsContainer) {
    const keyFeaturesHtml = (project.keyFeatures || []).map(feat => `
      <li class="proj-modal-feature-item">${feat}</li>
    `).join("");

    const contextHtml = project.projectContext ? `
      <div class="proj-modal-section">
        <h4 class="proj-modal-section-title">Project Context</h4>
        <div class="proj-modal-context-box">
          <p class="proj-modal-text mb-0">${project.projectContext}</p>
        </div>
      </div>
    ` : "";

    const techHtml = project.technologiesText ? `
      <div class="proj-modal-section">
        <h4 class="proj-modal-section-title">Technologies Used</h4>
        <p class="proj-modal-text">${project.technologiesText}</p>
      </div>
    ` : "";

    detailsContainer.innerHTML = `
      <!-- Overview -->
      <div class="proj-modal-section">
        <h4 class="proj-modal-section-title">Overview</h4>
        <p class="proj-modal-text">${project.overview || project.description}</p>
      </div>

      <!-- Problem Statement -->
      <div class="proj-modal-section">
        <h4 class="proj-modal-section-title">Problem Statement</h4>
        <p class="proj-modal-text">${project.problemStatement || ""}</p>
      </div>

      <!-- Solution -->
      <div class="proj-modal-section">
        <h4 class="proj-modal-section-title">Solution</h4>
        <p class="proj-modal-text">${project.solution || ""}</p>
      </div>

      <!-- Key Features -->
      <div class="proj-modal-section">
        <h4 class="proj-modal-section-title">Key Features</h4>
        <ul class="proj-modal-feature-list">
          ${keyFeaturesHtml}
        </ul>
      </div>

      <!-- Technologies Used -->
      ${techHtml}

      <!-- My Contribution -->
      <div class="proj-modal-section">
        <h4 class="proj-modal-section-title">My Contribution</h4>
        <div class="proj-modal-contrib-box">
          <p class="proj-modal-text mb-0">${project.myContribution || ""}</p>
        </div>
      </div>

      <!-- Project Context (only when applicable) -->
      ${contextHtml}
    `;
  }

  const modalEl = document.getElementById("project-modal");
  if (modalEl && window.bootstrap) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
}

// ============================================================
// CERTIFICATIONS COLLAPSIBLE TOGGLE (Initially Show 2, Expand All)
// ============================================================
const toggleCertsBtn = document.getElementById("btn-toggle-certs");
const certsList = document.getElementById("certifications-list");
const certsToggleText = document.getElementById("certs-toggle-text");

function setCertificationsExpanded(expanded, shouldScroll = true) {
  if (!certsList || !toggleCertsBtn) return;
  const allCards = certsList.querySelectorAll(".cert-item-card");
  const totalCerts = allCards.length;

  if (expanded) {
    certsList.classList.add("show-all");
    toggleCertsBtn.classList.add("expanded");
    toggleCertsBtn.setAttribute("aria-expanded", "true");
    if (certsToggleText) {
      certsToggleText.textContent = "Show Less";
    }
    const icon = toggleCertsBtn.querySelector(".btn-toggle-icon");
    if (icon) {
      icon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
    }
    if (shouldScroll) {
      location.hash = "#certifications";
      const certsSection = document.getElementById("certifications");
      if (certsSection) {
        certsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  } else {
    certsList.classList.remove("show-all");
    toggleCertsBtn.classList.remove("expanded");
    toggleCertsBtn.setAttribute("aria-expanded", "false");
    if (certsToggleText) {
      certsToggleText.textContent = `Show All Certifications (${totalCerts})`;
    }
    const icon = toggleCertsBtn.querySelector(".btn-toggle-icon");
    if (icon) {
      icon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
    }
    if (shouldScroll) {
      const certsSection = document.getElementById("certifications");
      if (certsSection) {
        certsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }
}

if (toggleCertsBtn) {
  toggleCertsBtn.addEventListener("click", () => {
    const isExpanded = certsList && certsList.classList.contains("show-all");
    setCertificationsExpanded(!isExpanded, true);
  });
}

// Certificate Lightbox Handler
document.querySelectorAll(".cert-view-modal-btn, .cert-thumb-trigger").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const imgUrl = btn.dataset.certImg;
    const title = btn.dataset.certTitle;
    const modalImg = document.getElementById("cert-lightbox-img");
    const modalTitle = document.getElementById("cert-lightbox-title");
    const downloadBtn = document.getElementById("cert-lightbox-download");
    if (modalImg) modalImg.src = imgUrl;
    if (modalTitle) modalTitle.textContent = title;
    if (downloadBtn) {
      downloadBtn.href = imgUrl;
      downloadBtn.download = (title || "Certificate").replace(/[^a-zA-Z0-9]/g, "-") + ".jpg";
    }
    const modalEl = document.getElementById("cert-lightbox-modal");
    if (modalEl && window.bootstrap) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    }
  });
});

// 15. COMMAND PALETTE (Ctrl + K)
// ============================================================
(function initCommandPalette() {
  const toggleBtn = document.getElementById("cmd-palette-toggle");
  const modalEl = document.getElementById("command-palette-modal");
  const searchInput = document.getElementById("cmd-palette-input");
  const resultsContainer = document.getElementById("cmd-palette-results");

  if (!modalEl) return;

  const commands = [
    { title: "LADRIS — Land Delay Risk AI Suite", category: "Project", action: () => { const p = projects.find(x => x.id === 1); openProjectModal(p); } },
    { title: "LearnSphere AI — AI Learning Platform", category: "Project", action: () => { const p = projects.find(x => x.id === 2); openProjectModal(p); } },
    { title: "VidyaQuest — Multilingual STEM PWA", category: "Project", action: () => { const p = projects.find(x => x.id === 3); openProjectModal(p); } },
    { title: "Automata Simulator — Automata Theory Visualizer", category: "Project", action: () => { const p = projects.find(x => x.id === 4); openProjectModal(p); } },
    { title: "Operational Fog — Tactical Resilience Simulation Platform", category: "Project", action: () => { const p = projects.find(x => x.id === 5); openProjectModal(p); } },
    { title: "Hotel Management System — Web-Based Platform", category: "Project", action: () => { const p = projects.find(x => x.id === 6); openProjectModal(p); } },
    { title: "Alonzo AI — Full Stack Developer Intern", category: "Experience", action: () => location.hash = "#experience" },
    { title: "GirlScript Summer of Code (GSSoC Contributor)", category: "Experience", action: () => location.hash = "#experience" },
    { title: "WE HUB — Entrepreneurship Training", category: "Experience", action: () => location.hash = "#experience" },
    { title: "Technical Skills Matrix", category: "Navigation", action: () => location.hash = "#skills" },
    { title: "Academic Credentials (9.5 CGPA & 90%)", category: "Education", action: () => location.hash = "#education" },
    { title: "Hackathons & SIH Qualifications", category: "Honors", action: () => location.hash = "#achievements" },
    { title: "Verifiable Certifications (HackerRank, LinkedIn, Udemy, Meraudi)", category: "Certifications", action: () => setCertificationsExpanded(true, true) },
    { title: "Udemy — The Complete Full-Stack Web Development Bootcamp", category: "Certifications", action: () => setCertificationsExpanded(true, true) },
    { title: "Meraudi Education Mart — SQL and Python Programming", category: "Certifications", action: () => setCertificationsExpanded(true, true) },
    { title: "Get in Touch (Contact Form & Email)", category: "Contact", action: () => location.hash = "#contact" },
    { title: "Copy Direct Email (sathvika.talari04@gmail.com)", category: "Action", action: () => copyEmailToClipboard() },
    { title: "Download Updated Resume (PDF)", category: "Action", action: () => {
      const rBtn = document.querySelector("[data-action='open-resume']");
      if (rBtn) rBtn.click();
    } },
    { title: "Toggle Dark / Light Mode", category: "Theme", action: () => themeButton && themeButton.click() }
  ];

  function renderCommands(query = "") {
    if (!resultsContainer) return;
    const q = query.toLowerCase().trim();
    const matches = commands.filter(c => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));

    resultsContainer.innerHTML = matches.map((c, i) => `
      <div class="cmd-item" data-index="${i}">
        <div>
          <span>${c.title}</span>
        </div>
        <span class="cmd-item-shortcut">${c.category}</span>
      </div>
    `).join("");

    resultsContainer.querySelectorAll(".cmd-item").forEach((item, idx) => {
      item.addEventListener("click", () => {
        if (window.bootstrap) {
          bootstrap.Modal.getInstance(modalEl).hide();
        }
        matches[idx].action();
      });
    });
  }

  function openPalette() {
    if (window.bootstrap) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
      setTimeout(() => {
        if (searchInput) {
          searchInput.value = "";
          searchInput.focus();
        }
        renderCommands("");
      }, 150);
    }
  }

  if (toggleBtn) toggleBtn.addEventListener("click", openPalette);

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openPalette();
    }
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderCommands(e.target.value);
    });
  }
})();

// ============================================================
// 16. 1-CLICK EMAIL COPY
// ============================================================
function copyEmailToClipboard() {
  const email = "sathvika.talari04@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    const copyText = document.getElementById("copy-email-text");
    if (copyText) {
      const orig = copyText.textContent;
      copyText.textContent = "Copied! ✓";
      setTimeout(() => copyText.textContent = orig, 2000);
    }
  });
}

const copyBtn = document.getElementById("copy-email-btn");
if (copyBtn) copyBtn.addEventListener("click", copyEmailToClipboard);

// ============================================================
// 17. CONTACT FORM VALIDATION
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
  contactForm.addEventListener("submit", async e => {
    e.preventDefault();
    formSubmitted = true;
    const { isNameValid, isEmailValid, isMsgValid, allValid } = runAllValidations();

    if (!allValid) {
      formFeedback.className = "alert mt-3";
      formFeedback.style.cssText = "background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); border-radius: 10px; padding: 14px 16px; color: var(--ink-primary);";
      formFeedback.textContent = "Please correct the highlighted fields before submitting.";
      if (!isNameValid && nameInput) nameInput.focus();
      else if (!isEmailValid && emailInput) emailInput.focus();
      else if (!isMsgValid && messageInput) messageInput.focus();
      return;
    }

    const submitBtn = document.getElementById("form-submit-btn");
    const origBtnHTML = submitBtn ? submitBtn.innerHTML : "Send Message";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style="width: 1rem; height: 1rem; border-width: 0.15em;"></span>
        <span>Sending...</span>
      `;
    }

    formFeedback.className = "alert mt-3";
    formFeedback.style.cssText = "background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.3); border-radius: 10px; padding: 14px 16px; color: var(--ink-primary);";
    formFeedback.innerHTML = `<span style="color:var(--cyan); font-weight:600;">⏳ Sending your message directly to Sathvika...</span>`;

    const nameVal = nameInput ? nameInput.value.trim() : "";
    const emailVal = emailInput ? emailInput.value.trim() : "";
    const msgVal = messageInput ? messageInput.value.trim() : "";

    try {
      // Local disk file protocol fallback (FormSubmit requires http/https)
      if (window.location.protocol === "file:") {
        const mailtoUrl = `mailto:sathvika.talari04@gmail.com?subject=${encodeURIComponent("Portfolio Message from " + nameVal)}&body=${encodeURIComponent("Name: " + nameVal + "\nEmail: " + emailVal + "\n\nMessage:\n" + msgVal)}`;
        window.location.href = mailtoUrl;

        formFeedback.style.cssText = "background: rgba(16,185,129,0.14); border: 1px solid rgba(16,185,129,0.35); border-radius: 10px; padding: 14px 16px; color: var(--ink-primary);";
        formFeedback.innerHTML = `
          <strong style="color:#10b981;">✓ Email Draft Created!</strong><br>
          <span style="font-size:0.875rem; color: var(--ink-secondary);">Opened your email app to deliver your message directly to <strong>sathvika.talari04@gmail.com</strong>.</span>
        `;
        if (contactForm) contactForm.reset();
        if (charCountSpan) charCountSpan.textContent = "0 / 1,000";
        return;
      }

      // Live site: Send directly to Sathvika's email via FormSubmit AJAX API
      const response = await fetch("https://formsubmit.co/ajax/sathvika.talari04@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          message: msgVal,
          _subject: `New Portfolio Message from ${nameVal}`,
          _replyto: emailVal,
          _captcha: "false"
        })
      });

      const resData = await response.json();

      if (response.ok && (resData.success === "true" || resData.success === true || (resData.message && resData.message.includes("Activation")))) {
        formFeedback.style.cssText = "background: rgba(16,185,129,0.14); border: 1px solid rgba(16,185,129,0.35); border-radius: 10px; padding: 14px 16px; color: var(--ink-primary);";
        formFeedback.innerHTML = `
          <strong style="color:#10b981;">✓ Message Sent Successfully!</strong><br>
          <span style="font-size:0.875rem; color: var(--ink-secondary);">Thank you, <strong>${nameVal}</strong>! Your message has been sent directly to Sathvika's inbox. She will get back to you at <strong>${emailVal}</strong> soon.</span>
        `;
        if (contactForm) contactForm.reset();
        if (charCountSpan) charCountSpan.textContent = "0 / 1,000";
        formSubmitted = false;
        [nameInput, emailInput, messageInput].forEach(inp => {
          if (inp) {
            inp.classList.remove("is-valid", "is-invalid");
            inp.removeAttribute("aria-invalid");
          }
        });
      } else {
        throw new Error(resData.message || "Submission failed");
      }
    } catch (err) {
      console.warn("FormSubmit fetch error, offering direct mail fallback:", err);
      const mailtoUrl = `mailto:sathvika.talari04@gmail.com?subject=${encodeURIComponent("Portfolio Message from " + nameVal)}&body=${encodeURIComponent("Name: " + nameVal + "\nEmail: " + emailVal + "\n\nMessage:\n" + msgVal)}`;
      formFeedback.style.cssText = "background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.35); border-radius: 10px; padding: 14px 16px; color: var(--ink-primary);";
      formFeedback.innerHTML = `
        <strong style="color:#f59e0b;">Send Direct to Sathvika's Gmail:</strong><br>
        <span style="font-size:0.875rem; color: var(--ink-secondary); margin-bottom:8px; display:block;">Click below to deliver this message directly via your email app to <strong>sathvika.talari04@gmail.com</strong>:</span>
        <a href="${mailtoUrl}" class="btn btn-sm btn-primary mt-1" style="background:var(--grad-accent); border:none; font-weight:600; font-size:0.82rem; padding:6px 14px; border-radius:6px; color:#fff;">
          ✉ Open in Email App
        </a>
      `;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnHTML;
      }
    }
  });
}

// ============================================================
// 18. MOBILE NAV AUTO-COLLAPSE
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
// 19. ACTIVE NAV LINK ON SCROLL
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
          const href = link.getAttribute("href");
          if (href === `#${entry.target.id}` || (entry.target.id === "home" && href === "#about")) {
            link.classList.add("active");
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
})();

// ============================================================
// 20. FOOTER YEAR
// ============================================================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================================
// 21. TOAST NOTIFICATIONS & CLIPBOARD COPY ENGINE
// ============================================================
function showToast(message) {
  let toast = document.getElementById("st-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "st-toast";
    toast.className = "st-toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="color:var(--emerald); font-weight:700;">✓</span> ${message}`;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg || `Copied "${text}" to clipboard!`);
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    showToast(successMsg || `Copied "${text}" to clipboard!`);
  } catch (err) {
    prompt("Copy to clipboard: Ctrl+C, Enter", text);
  }
  document.body.removeChild(ta);
}

// Bind all copy email triggers
document.querySelectorAll(".copy-email-btn, #copy-email-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    copyToClipboard("sathvika.talari04@gmail.com", "Copied sathvika.talari04@gmail.com to clipboard!");
  });
});

// ============================================================
// 22. OFFICIAL RESUME VIEWER & ZOOM CONTROLS
// ============================================================
const resumeModalEl = document.getElementById("resume-modal");

function openResumeModal() {
  if (resumeModalEl && window.bootstrap) {
    const modal = bootstrap.Modal.getOrCreateInstance(resumeModalEl);
    modal.show();
  }
}

// Bind all open-resume trigger elements
document.querySelectorAll("[data-action='open-resume']").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    openResumeModal();
  });
});

// Resume Modal Interactive Zoom Engine
(function initResumeZoom() {
  const container = document.getElementById("resume-container-box");
  const display = document.getElementById("resume-zoom-display");
  const btnIn = document.getElementById("resume-zoom-in");
  const btnOut = document.getElementById("resume-zoom-out");
  const btnFit = document.getElementById("resume-zoom-fit");
  if (!container || !display) return;

  const zoomLevels = [85, 100, 125, 150, 175, 200];
  let currentZoomIdx = 1; // Default 100%

  function applyZoom() {
    const val = zoomLevels[currentZoomIdx];
    display.textContent = `${val}%`;
    container.style.transform = `scale(${val / 100})`;
    // Adjust height spacing when scaled up so user can scroll completely
    if (val > 100) {
      const extraHeight = ((val / 100) - 1) * container.offsetHeight;
      container.style.marginBottom = `${extraHeight + 40}px`;
    } else {
      container.style.marginBottom = "0px";
    }
  }

  if (btnIn) {
    btnIn.addEventListener("click", () => {
      if (currentZoomIdx < zoomLevels.length - 1) {
        currentZoomIdx++;
        applyZoom();
      }
    });
  }

  if (btnOut) {
    btnOut.addEventListener("click", () => {
      if (currentZoomIdx > 0) {
        currentZoomIdx--;
        applyZoom();
      }
    });
  }

  if (btnFit) {
    btnFit.addEventListener("click", () => {
      currentZoomIdx = (currentZoomIdx === 2) ? 1 : 2; // Toggle between 100% and 125%
      applyZoom();
    });
  }
})();

// Global Keyboard Shortcuts (Press 'R' for Resume)
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  if (e.key === "r" || e.key === "R") {
    openResumeModal();
  }
});

// ============================================================
// 19. PLAYFUL JUMPING DOG COMPANION ENGINE (Petite & Proper)
// ============================================================
(function initJumpingDog() {
  const dog = document.getElementById("jumping-dog");
  const speechBubble = document.getElementById("dog-speech-bubble");
  if (!dog || !speechBubble) return;
  if (window.getComputedStyle(dog).display === "none") return; // Pauses loop when dog is hidden

  // Sound effects via Web Audio API (gentle, synthesized puppy chirp)
  let audioCtx = null;
  function playPuppyBark() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtx) audioCtx = new AudioContext();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.14);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (_) {}
  }

  // Cute, concise quotes for the micro speech bubble
  const barkQuotes = [
    "Woof! 🐾 Welcome!",
    "Arf! 9.5 CGPA! 🌟",
    "Zero bugs found! ✨",
    "Hire Sathvika! 💼",
    "Alonzo AI intern! ⚡",
    "Press 'R' for Resume! 📄",
    "LADRIS is so cool! 🚀",
    "Double-click to nap 💤",
    "Good puppy! 💖"
  ];

  let quoteIdx = 0;
  let bubbleTimeout = null;
  let isSleeping = false;

  function barkAndFlip() {
    if (dog.classList.contains("backflipping")) return;

    dog.classList.add("backflipping");
    playPuppyBark();

    speechBubble.textContent = barkQuotes[quoteIdx % barkQuotes.length];
    quoteIdx++;
    speechBubble.classList.add("show");

    if (bubbleTimeout) clearTimeout(bubbleTimeout);
    bubbleTimeout = setTimeout(() => {
      speechBubble.classList.remove("show");
    }, 2400);

    setTimeout(() => {
      dog.classList.remove("backflipping");
    }, 720);
  }

  // Event Listeners for dog interaction
  dog.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isSleeping) {
      isSleeping = false;
      dog.classList.remove("sleeping");
    }
    barkAndFlip();
  });

  dog.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    isSleeping = !isSleeping;
    if (isSleeping) {
      dog.classList.add("sleeping");
      dog.classList.remove("in-air", "touchdown", "backflipping");
      speechBubble.textContent = "Zzz... 💤";
      speechBubble.classList.add("show");
      if (bubbleTimeout) clearTimeout(bubbleTimeout);
      bubbleTimeout = setTimeout(() => speechBubble.classList.remove("show"), 2000);
    } else {
      dog.classList.remove("sleeping");
      barkAndFlip();
    }
  });

  dog.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isSleeping) {
        isSleeping = false;
        dog.classList.remove("sleeping");
      }
      barkAndFlip();
    }
  });

  // Resting state on mouse hover
  let isHovered = false;
  dog.addEventListener("mouseenter", () => {
    if (isSleeping) return;
    isHovered = true;
    dog.classList.add("resting");
    dog.classList.remove("in-air", "touchdown");
  });

  dog.addEventListener("mouseleave", () => {
    isHovered = false;
    dog.classList.remove("resting");
  });

  // Physics and Animation State (Smooth, Petite, Photo-Matched)
  const body = document.getElementById("dog-body-wrapper");
  const shadow = document.getElementById("dog-shadow-oval");

  let x = 24;
  let direction = 1; // 1 = right, -1 = left
  let hopPhase = 0;  // 0 to Math.PI
  const hopDuration = 0.50; // seconds per hop
  const hopHeight = 16;     // gentle, organic hop height in pixels
  const horizontalSpeed = 62; // lively trotting speed
  let isPausedAtEdge = false;
  let pauseTimer = 0;
  let lastTimestamp = performance.now();

  // Check prefers-reduced-motion
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    dog.style.transform = `translate3d(${x}px, 0px, 0)`;
    return;
  }

  function animationLoop(timestamp) {
    const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
    lastTimestamp = timestamp;

    const dogWidth = 60;
    const maxRight = Math.max(window.innerWidth - dogWidth - 24, 30);
    const minLeft = 14;

    if (!isHovered && !isSleeping && !dog.classList.contains("backflipping")) {
      if (isPausedAtEdge) {
        pauseTimer -= dt;
        if (body) {
          body.style.transform = `translate3d(0, 0px, 0) scaleX(${direction}) scale(1.02, 0.96)`;
        }
        if (shadow) {
          shadow.style.transform = `translateX(-50%) scale(1.05)`;
          shadow.style.opacity = "0.5";
        }

        if (pauseTimer <= 0) {
          isPausedAtEdge = false;
          direction = -direction;
          hopPhase = 0;
        }
      } else {
        hopPhase += (Math.PI / hopDuration) * dt;

        if (hopPhase >= Math.PI) {
          hopPhase = 0;
        }

        const sinVal = Math.sin(hopPhase);
        const jumpY = sinVal * hopHeight;

        // Move horizontally
        x += direction * horizontalSpeed * dt;

        // Check screen boundaries
        if (direction === 1 && x >= maxRight) {
          x = maxRight;
          isPausedAtEdge = true;
          pauseTimer = 0.55;
        } else if (direction === -1 && x <= minLeft) {
          x = minLeft;
          isPausedAtEdge = true;
          pauseTimer = 0.55;
        }

        // Apply organic jump kinematics to body
        const tilt = direction === 1 ? -sinVal * 6 : sinVal * 6;
        const squashY = sinVal > 0.85 ? 1.05 : (sinVal < 0.18 ? 0.90 : 1.0);
        const squashX = sinVal > 0.85 ? 0.96 : (sinVal < 0.18 ? 1.08 : 1.0);

        if (body) {
          body.style.transform = `translate3d(0, ${-Math.round(jumpY)}px, 0) scaleX(${direction}) rotate(${tilt.toFixed(1)}deg) scale(${squashX}, ${squashY})`;
        }

        // Shadow expands on contact, contracts & fades in air
        if (shadow) {
          const shadowScale = (1 - (sinVal * 0.42)).toFixed(2);
          const shadowAlpha = (0.48 - (sinVal * 0.32)).toFixed(2);
          shadow.style.transform = `translateX(-50%) scale(${shadowScale})`;
          shadow.style.opacity = shadowAlpha;
        }
      }
    } else if (isHovered) {
      if (body) body.style.transform = `translate3d(0, 0px, 0) scaleX(${direction}) scale(1.04)`;
      if (shadow) {
        shadow.style.transform = `translateX(-50%) scale(1.0)`;
        shadow.style.opacity = "0.5";
      }
    } else if (isSleeping) {
      if (body) body.style.transform = `translate3d(0, 2px, 0) scaleX(${direction}) scale(0.92)`;
      if (shadow) {
        shadow.style.transform = `translateX(-50%) scale(0.9)`;
        shadow.style.opacity = "0.4";
      }
    }

    // Container stays anchored on the floor, translating horizontally
    dog.style.transform = `translate3d(${Math.round(x)}px, 0px, 0)`;

    requestAnimationFrame(animationLoop);
  }

  // Handle window resizing cleanly
  window.addEventListener("resize", () => {
    const dogWidth = 58;
    const maxRight = Math.max(window.innerWidth - dogWidth - 20, 30);
    if (x > maxRight) x = maxRight;
  }, { passive: true });

  // Start jumping animation loop
  requestAnimationFrame(animationLoop);
})();
