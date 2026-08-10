# Poojith S — Portfolio Website

> **Live Demo**: 🌐 **[https://poojithportfolio07.web.app](https://poojithportfolio07.web.app)**

[![Firebase Hosting](https://img.shields.io/badge/Hosted%20On-Firebase%20Hosting-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://poojithportfolio07.web.app)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://poojithportfolio07.web.app)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://poojithportfolio07.web.app)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://poojithportfolio07.web.app)

A modern, high-performance personal portfolio website built with vanilla HTML5, CSS3, and JavaScript, featuring interactive particle canvases, custom cursor effects, 3D tilt glassmorphism cards, and smooth page transitions.

---

## 🌐 Live Deployment

The portfolio is deployed live on **Firebase Hosting**:
- **Primary Domain**: [https://poojithportfolio07.web.app](https://poojithportfolio07.web.app)
- **Alternative Domain**: [https://poojithportfolio07.firebaseapp.com](https://poojithportfolio07.firebaseapp.com)

---

## 📁 Project Structure

```text
.
├── index.html                      # Main landing page & hero animation
├── about.html                      # Personal profile & background
├── skills.html                     # Technical skills & interactive stack
├── projects.html                   # Featured project showcase
├── experience.html                 # Work experience timeline
├── process.html                    # Engineering process & methodology
├── contact.html                    # Interactive contact form
├── app.js                          # Core JS animations, canvas & UI logic
├── style.css                       # Complete design system & custom styles
├── server.js                       # Node.js local development server
├── firebase.json                   # Firebase Hosting configuration
├── .firebaserc                     # Firebase project mapping
├── ezgif-4acc0a1375548735-jpg/     # Frame sequence for canvas scroll animation
├── lock.png                        # Smart Door Lock project image asset
├── healthy.png                     # Healthy Habit Tracker project image asset
└── poojith_bg.jpg                  # Background profile image asset
```

---

## 🚀 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/itzpoojiths07/Portfolio-website.git
   cd Portfolio-website
   ```

2. **Run the local server**:
   ```bash
   node server.js
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:8080` in your web browser.

---

## ☁️ Deployment

To deploy updates to **Firebase Hosting**:

```bash
npx -y firebase-tools@latest deploy --only hosting
```

---

## 🛠️ Built With

- **HTML5** — Semantic layout & accessibility
- **CSS3** — Custom design tokens, glassmorphism, responsive flex/grid & keyframe animations
- **JavaScript (ES6+)** — Interactive canvas rendering, custom dual cursor, tilt cards & smooth state control
- **Firebase Hosting** — Global SSL CDN deployment
