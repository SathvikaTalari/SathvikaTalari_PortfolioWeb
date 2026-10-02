# SathvikaTalari_PortfolioWeb
# Sathvika Talari — Creative Developer Studio Portfolio

A bespoke, responsive personal portfolio website designed for **Sathvika Talari**, a Computer Science student in Hyderabad specializing in full-stack web development (Python & Flask) and software quality.

The project is designed with a contemporary **“creative developer studio”** aesthetic—featuring midnight-blue surfaces, luminous cyan accents, selective silver details, generous spacing, and expressive typography.

---

## 🎨 Design Direction

- **Palette**:
  - **Dark Mode (Default)**: Deep midnight-blue background (`#080e1a`), midnight navy surfaces (`#0f182b`), luminous cyan accents (`#00e5ff`), and selective silver hairline rules (`rgba(203, 213, 225, 0.12)`).
  - **Light Mode**: Crisp white surfaces (`#ffffff`, `#f8fafc`), deep-blue typography (`#0b152d`), and ocean cyan accents (`#0284c7`).
- **Typography**:
  - Major Headings: **Space Grotesk** (distinctive, confident, architectural display font).
  - Body Text: **Plus Jakarta Sans** (clean, readable sans-serif).
  - Metadata & Badges: **JetBrains Mono** (technical clarity).
- **Asymmetric Opening Screen**: Prominent name and professional focus balanced by a restrained "Studio Discipline" focus panel (Build / Test / Refine).
- **Typographic Case Study Covers**: Instead of fabricated screenshots, each project features an attractive typographic cover with custom studio initials (`LS`, `HM`, `ST`), silver grid rules, and category badges.

---

## 📂 Project Structure

```text
personal-portfolio/
├── index.html                   # Semantic HTML5 page structure
├── style.css                    # Custom CSS design system, themes & responsive media queries
├── script.js                    # Theme toggling, case study rendering, modal & form validation
├── sathvika-talari-portfolio.zip # Downloadable offline source code archive
├── README.md                    # Project documentation & assignment mapping
├── assets/
│   ├── portfolio-mark.svg       # Refined geometric ST monogram
│   └── SathvikaTalari_Resume.pdf# Official résumé available for download
└── vendor/
    ├── bootstrap.min.css        # Local Bootstrap 5 styles for offline use
    └── bootstrap.bundle.min.js  # Local Bootstrap 5 navigation & modal scripts
```

---

## 🚀 How to Run Locally

1. **Option A: Direct Browser Opening (No server needed)**
   - Double-click `index.html` to open directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari.
   - All Bootstrap styles and scripts are bundled locally inside `vendor/` so the site runs completely offline.

2. **Option B: Local HTTP Server (Optional)**
   - Open a terminal in the project directory and run:
     ```bash
     python -m http.server 8080
     ```
   - Navigate to `http://localhost:8080` in your web browser.

---

## 🛠️ Assignment Rubric & Concept Mapping

| Requirement | Implementation Details |
|---|---|
| **Semantic HTML5** | Meaningful structure using `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<figure>`, `<table>`, and `<form>`. |
| **Bootstrap 5 Integration** | Grid system (`row`, `col-*`), responsive navbar collapse, accessible modal dialog (`#project-modal`), and form control styles. |
| **Responsive CSS3** | Custom CSS variables (design tokens), Flexbox, CSS Grid, clamp() fluid typography, and media queries for mobile, tablet, and desktop viewports. |
| **Vanilla JavaScript (ES6+)** | `const`/`let`, arrow functions, array methods (`filter`, `forEach`, `map`), template literals, DOM manipulation, and event handling. |
| **Interactive Feature 1** | **Theme Switching**: Toggles between midnight-blue dark mode and crisp white light mode with `localStorage` persistence. |
| **Interactive Feature 2** | **Project Filtering**: Category filtering (`All work`, `AI & learning`, `Web applications`) with live screen-reader count announcements. |
| **Interactive Feature 3** | **Case Study Modal**: Dynamically populates project summaries, contributions, key features, and technology tags. |
| **Form Validation** | Validates name (2–80 chars), email format, and message length (10–1,000 chars) with live character counter and clear error/success feedback. |
| **Accessibility (a11y)** | Skip link, visible `:focus-visible` outlines, ARIA roles, labeled form controls, and `prefers-reduced-motion` support. |

---

## 📋 Content & Résumé Grounding

All information is faithful to **Sathvika Talari's** actual profile:
- **Education**: Stanley College of Engineering and Technology (2023–2027), B.E. Computer Science, **9.5 CGPA**.
- **Earlier Education**: CBSE Class 12th (2022–2023) and Class 10th (2021).
- **Internship**: **Alonzo AI** (May–June 2026), Web Development Intern — Medical Camp Management System (Full Stack & AI-ML).
- **Projects & Live Deployments**:
  1. **LearnSphere – AI-Powered ML Learning Platform**: Python, Flask, Generative AI APIs, HTML, CSS, JavaScript.
     - **Live Deployment**: [https://learn-sphere-platform.vercel.app/login](https://learn-sphere-platform.vercel.app/login)
  2. **Hotel Management System**: Python, Flask, SQLAlchemy, MySQL, Bootstrap.
     - **Live Deployment**: [https://hotel-management-system-seven-alpha.vercel.app/login](https://hotel-management-system-seven-alpha.vercel.app/login)
  3. **Automata Simulator**: Python Flask, JavaScript, Thompson & Hopcroft Algorithms, Graph Visualization.
     - **Live Deployment**: [https://automata-simulator-black.vercel.app](https://automata-simulator-black.vercel.app)
  4. **Disaster Preparedness and Response Platform**: Next.js, TypeScript, Node.js, Express.js, MySQL.
- **Skills**: Verified languages, frameworks, testing methodologies, databases, and developer tools.
- **Contributions**: Feature testing, bug reporting, UI clarity suggestions, and workflow validation.
- **Contact**: Email (`sathvika.talari04@gmail.com`), GitHub ([@SathvikaTalari](https://github.com/SathvikaTalari)), location (Hyderabad, India), and résumé download.

---

## 🔒 Form Validation Behavior

The contact form is configured to validate client-side inputs cleanly and safely. In accordance with assignment integrity:
- It **does not claim messages are sent** over a non-existent backend server.
- Upon successful validation, it clearly informs the user that their inputs are valid and encourages them to send directly via the provided email link.
