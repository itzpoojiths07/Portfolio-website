(function () {
  // --------------------------------------------------------------------------
  // 1. FRAME BACKGROUND CANVAS SCROLL ENGINE
  // --------------------------------------------------------------------------
  const TOTAL_FRAMES = 271;
  const FOLDER_PATH = './ezgif-4acc0a1375548735-jpg/';

  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const loader = document.getElementById('loader');
  const loaderText = document.getElementById('loader-text');
  const progressFill = document.getElementById('progress-fill');

  const images = [];
  let loadedCount = 0;
  let currentFrame = 0;
  let targetFrame = 0;
  let lastDrawnFrame = -1;

  function getFrameFilename(index) {
    const paddedNum = String(index + 1).padStart(3, '0');
    return `${FOLDER_PATH}ezgif-frame-${paddedNum}.jpg`;
  }

  function preloadImages() {
    if (!canvas || !ctx) return;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameFilename(i);

      img.onload = () => {
        loadedCount++;
        const percent = Math.floor((loadedCount / TOTAL_FRAMES) * 100);

        if (progressFill) progressFill.style.width = `${percent}%`;
        if (loaderText) loaderText.textContent = `Loading frames... ${percent}%`;

        if (i === 0 || Math.round(currentFrame) === i) {
          drawFrame(Math.round(currentFrame));
        }

        if (loadedCount === TOTAL_FRAMES && loader) {
          loader.classList.add('hidden');
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES && loader) {
          loader.classList.add('hidden');
        }
      };

      images.push(img);
    }
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    lastDrawnFrame = -1;
    drawFrame(Math.round(currentFrame));
  }

  function updateTargetFrame() {
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    const maxScroll = scrollHeight - window.innerHeight;

    if (maxScroll <= 0) {
      targetFrame = 0;
      return;
    }

    const scrollFraction = Math.min(1, Math.max(0, scrollTop / maxScroll));
    targetFrame = scrollFraction * (TOTAL_FRAMES - 1);
  }

  function getClosestLoadedImage(index) {
    if (images[index] && images[index].complete && images[index].naturalWidth !== 0) {
      return images[index];
    }
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = index - offset;
      if (prev >= 0 && images[prev] && images[prev].complete && images[prev].naturalWidth !== 0) {
        return images[prev];
      }
      const next = index + offset;
      if (next < TOTAL_FRAMES && images[next] && images[next].complete && images[next].naturalWidth !== 0) {
        return images[next];
      }
    }
    return null;
  }

  function drawFrame(frameIndex) {
    if (!canvas || !ctx || frameIndex === lastDrawnFrame) return;

    const img = getClosestLoadedImage(frameIndex);
    if (!img) return;

    const cssWidth = window.innerWidth;
    const cssHeight = window.innerHeight;

    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;

    if (!imgWidth || !imgHeight) return;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = cssWidth / cssHeight;

    let drawWidth, drawHeight;

    if (canvasRatio > imgRatio) {
      drawWidth = cssWidth;
      drawHeight = cssWidth / imgRatio;
    } else {
      drawWidth = cssHeight * imgRatio;
      drawHeight = cssHeight;
    }

    const offsetX = (cssWidth - drawWidth) / 2;
    const offsetY = (cssHeight - drawHeight) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    lastDrawnFrame = frameIndex;
  }

  function animationLoop() {
    updateTargetFrame();

    const delta = targetFrame - currentFrame;
    if (Math.abs(delta) > 0.001) {
      currentFrame += delta * 0.18;
    } else {
      currentFrame = targetFrame;
    }

    drawFrame(Math.round(currentFrame));

    // Update Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }

    requestAnimationFrame(animationLoop);
  }

  // --------------------------------------------------------------------------
  // 2. CUSTOM CURSOR & FOLLOWER CIRCLE REMOVED
  // --------------------------------------------------------------------------
  const dotCursor = document.querySelector('.custom-cursor');
  const followerCursor = document.querySelector('.cursor-follower');
  if (dotCursor) dotCursor.style.display = 'none';
  if (followerCursor) followerCursor.style.display = 'none';

  // --------------------------------------------------------------------------
  // 3. WORD POP & WAVE ENGINE
  // --------------------------------------------------------------------------
  function initWordNeonPop() {
    const containers = document.querySelectorAll('.word-pop-container');
    containers.forEach((container) => {
      if (container.dataset.wrapped) return;

      const nodes = Array.from(container.childNodes);
      container.innerHTML = '';

      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          const words = text.split(/(\s+)/);

          words.forEach((word) => {
            if (word.trim().length === 0) {
              container.appendChild(document.createTextNode(word));
            } else {
              const span = document.createElement('span');
              span.className = 'neon-word';
              span.textContent = word;
              container.appendChild(span);
            }
          });
        } else {
          container.appendChild(node.cloneNode(true));
        }
      });

      container.dataset.wrapped = 'true';
    });
  }

  // --------------------------------------------------------------------------
  // 4. MAGNETIC BUTTONS ENGINE (Cursor Leaning Removed)
  // --------------------------------------------------------------------------
  function initMagneticButtons() {
    // Cursor leaning animation disabled
  }

  // --------------------------------------------------------------------------
  // 5. 3D TILT CARDS ENGINE
  // --------------------------------------------------------------------------
  function init3DTiltCards() {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. INTERACTIVE PROJECT DETAIL MODAL SYSTEM
  // --------------------------------------------------------------------------
  const projectDetailsMap = {
    1: {
      title: 'Healthy Habit Tracker',
      image: './healthy.png',
      desc: 'A full-stack habit and health tracking platform designed to help users establish long-term wellness routines through goal analytics.',
      problem: 'Users struggle to stay consistent with health routines due to complex tracking interfaces and lack of motivation.',
      solution: 'Built a sleek dashboard with streak metrics, visual daily logs, customized reminders, and responsive performance.',
      process: 'Empathy mapping → Figma low-fi & hi-fi prototypes → Next.js component architecture → Tailwind styling & backend integration.',
      tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB'],
      features: ['Real-time habit streak calculation', 'Interactive completion charts', 'Dark mode glassmorphic interface', 'Responsive mobile app layout'],
      githubLink: 'https://github.com/itzpoojiths07/Habit-Tracker.git',
      demoLink: 'https://kleap.co/p/54348'
    },
    2: {
      title: 'Smart Door Lock System',
      image: './lock.png',
      desc: 'An IoT-integrated security application featuring real-time biometric/passcode authentication logs and remote keyless access control.',
      problem: 'Traditional key locks lack remote monitoring and access history tracking.',
      solution: 'Developed an end-to-end access management app connected with cloud authentication endpoints and instant security notifications.',
      process: 'Requirement analysis → Cloud architecture design → React dashboard frontend → Node/Express API development → Testing.',
      tech: ['React', 'Node.js', 'Express.js', 'IoT Protocols'],
      features: ['Live access event log feed', 'Remote lock state toggling', 'User permission role management', 'Encrypted payload authentication'],
      githubLink: 'https://github.com/itzpoojiths07/LOCK-SYSTEM.git',
      demoLink: 'https://arduinolock-owo8732.public.builtwithrocket.new'
    }
  };

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body-content');
  const modalClose = document.getElementById('modal-close');
  const projectCards = document.querySelectorAll('.project-card[data-project-id]');

  if (!modal || !modalBody) return;

  projectCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      const id = card.dataset.projectId;
      const details = projectDetailsMap[id];
      if (!details) return;

      modalBody.innerHTML = `
          <div class="project-badge">PROJECT ${id < 10 ? '0' + id : id} DETAIL</div>
          <h2 class="modal-title">${details.title}</h2>
          ${details.image ? `<div style="width: 100%; height: 240px; overflow: hidden; border-radius: 12px; margin: 16px 0 20px 0; border: 1px solid rgba(255,255,255,0.12); background: #0c0c12;"><img src="${details.image}" alt="${details.title} Screenshot" style="width: 100%; height: 100%; object-fit: cover;" /></div>` : ''}
          <p class="modal-desc">${details.desc}</p>
          
          <div class="modal-section-title">The Problem</div>
          <p class="modal-desc" style="margin-bottom: 16px;">${details.problem}</p>
          
          <div class="modal-section-title">The Solution</div>
          <p class="modal-desc" style="margin-bottom: 16px;">${details.solution}</p>
          
          <div class="modal-section-title">Design & Technical Process</div>
          <p class="modal-desc" style="margin-bottom: 16px;">${details.process}</p>

          <div class="modal-section-title">Technologies Used</div>
          <div class="tech-tags" style="margin-bottom: 20px;">
            ${details.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>

          <div class="modal-section-title">Key Features</div>
          <ul class="modal-list">
            ${details.features.map(f => `<li>✦ ${f}</li>`).join('')}
          </ul>

          <div class="modal-actions">
            <a href="${details.githubLink}" target="_blank" rel="noopener" class="btn-primary magnetic-btn">View GitHub Repository ↗</a>
            <a href="${details.demoLink}" target="_blank" rel="noopener" class="btn-secondary magnetic-btn">Live Demo ↗</a>
          </div>
        `;

      modal.classList.add('active');
      initMagneticButtons();
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => modal.classList.remove('active'));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

// --------------------------------------------------------------------------
// 7. PROJECTS PAGE CATEGORY FILTERS
// --------------------------------------------------------------------------
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.style.background = 'var(--card-bg)';
        b.style.borderColor = 'var(--card-border)';
        b.style.color = 'var(--text-muted)';
      });

      btn.classList.add('active');
      btn.style.background = 'var(--accent-red)';
      btn.style.borderColor = 'var(--accent-red)';
      btn.style.color = '#ffffff';

      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// --------------------------------------------------------------------------
// 8. ANIMATED STAT COUNTERS
// --------------------------------------------------------------------------
function initStatCounters() {
  const statNums = document.querySelectorAll('.stat-card-num[data-target]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          let count = 0;
          const duration = 1200;
          const stepTime = Math.max(20, Math.floor(duration / target));

          const timer = setInterval(() => {
            count++;
            el.textContent = `${count < 10 ? '0' + count : count}+`;
            if (count >= target) {
              clearInterval(timer);
              el.textContent = `${target < 10 ? '0' + target : target}+`;
            }
          }, stepTime);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(num => observer.observe(num));
  }
}

// --------------------------------------------------------------------------
// 9. INTERACTIVE CONTACT FORM HANDLER
// --------------------------------------------------------------------------
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successOverlay = document.getElementById('form-success');

  if (!form || !successOverlay) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      successOverlay.classList.add('active');
      form.reset();
      if (submitBtn) {
        submitBtn.textContent = 'Send Message →';
        submitBtn.disabled = false;
      }
    }, 1000);
  });
}

// --------------------------------------------------------------------------
// 10. DEVELOPER EASTER EGG TERMINAL (Ctrl + Shift + K or Logo Trigger)
// --------------------------------------------------------------------------
function initDeveloperTerminal() {
  const terminal = document.getElementById('terminal-modal');
  const terminalClose = document.getElementById('terminal-close');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const logoTrigger = document.getElementById('logo-trigger');

  if (!terminal || !terminalInput || !terminalOutput) return;

  function toggleTerminal() {
    terminal.classList.toggle('active');
    if (terminal.classList.contains('active')) {
      terminalInput.focus();
    }
  }

  // Key Combo Ctrl+Shift+K
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggleTerminal();
    }
  });

  if (logoTrigger) {
    logoTrigger.addEventListener('dblclick', toggleTerminal);
  }

  if (terminalClose) {
    terminalClose.addEventListener('click', toggleTerminal);
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.value.trim().toLowerCase();
      terminalInput.value = '';

      const line = document.createElement('div');
      line.innerHTML = `<span style="color: var(--accent-red);">$ ${cmd}</span>`;
      terminalOutput.appendChild(line);

      let response = '';
      if (cmd === 'help') {
        response = 'Available commands: help, bio, skills, projects, contact, clear, matrix';
      } else if (cmd === 'bio') {
        response = 'POOJITH S — Web Developer & UI/UX Developer graduating from APS College of Engineering.';
      } else if (cmd === 'skills') {
        response = 'React, Next.js, JavaScript, TypeScript, HTML, CSS, Tailwind CSS, Node.js, Express.js, MongoDB, Git, Figma';
      } else if (cmd === 'projects') {
        response = '1. Healthy Habit Tracker | 2. Smart Door Lock System | 3. FinDash Analytics';
      } else if (cmd === 'contact') {
        response = 'Email: poojiths@example.com | Location: Bangalore, India';
      } else if (cmd === 'clear') {
        terminalOutput.innerHTML = '';
        return;
      } else if (cmd === 'matrix') {
        response = 'System initialized. You are now inside Poojith\'s digital universe.';
      } else {
        response = `Command not recognized: '${cmd}'. Type 'help' for command list.`;
      }

      const respLine = document.createElement('div');
      respLine.style.color = '#a1a1aa';
      respLine.textContent = response;
      terminalOutput.appendChild(respLine);

      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  });
}

// --------------------------------------------------------------------------
// 11. PAGE TRANSITION ROUTER ENGINE & SMOOTH SCROLL ANCHORS
// --------------------------------------------------------------------------
function initPageTransitions() {
  const overlay = document.querySelector('.page-transition-overlay');
  const links = document.querySelectorAll('a');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;

      // Handle explicit hash anchors (#about, #skills, etc.)
      if (href.startsWith('#')) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      // Check for .html page links
      if (href.endsWith('.html') || href === 'index.html') {
        const pathParts = window.location.pathname.split('/');
        const currentPage = pathParts[pathParts.length - 1] || 'index.html';
        const targetPageName = href.replace('.html', '');

        // If currently on index.html, check if matching section ID exists on index.html for smooth scroll
        if ((currentPage === '' || currentPage === 'index.html') && targetPageName !== 'index') {
          const sectionEl = document.getElementById(targetPageName) || document.getElementById(targetPageName + '-section');
          if (sectionEl) {
            e.preventDefault();
            sectionEl.scrollIntoView({ behavior: 'smooth' });
            return;
          }
        }

        // If clicking link to current active page, scroll to top
        if (href === currentPage) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        // Otherwise perform page transition navigation
        e.preventDefault();
        if (overlay) overlay.classList.add('animating');

        setTimeout(() => {
          window.location.href = href;
        }, 380);
      }
    });
  });
}

// --------------------------------------------------------------------------
// 12. CURSOR PARTICLE TRAIL CANVAS (Disabled)
// --------------------------------------------------------------------------
function initParticleCanvas() {
  // Cursor particle animation disabled
}

// --------------------------------------------------------------------------
// 13. SKILL PROFICIENCY PROGRESS BARS
// --------------------------------------------------------------------------
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-progress-fill[data-level]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.width = el.dataset.level;
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    fills.forEach(fill => observer.observe(fill));
  }
}

// --------------------------------------------------------------------------
// 14. INTERACTIVE ARCADE MINI-GAME ENGINE ("CODE BUG SMASHER")
// --------------------------------------------------------------------------
function initDevArcadeGame() {
  const gCanvas = document.getElementById('dev-game-canvas');
  if (!gCanvas) return;

  const gCtx = gCanvas.getContext('2d');
  const startBtn = document.getElementById('btn-start-game');
  const overlayStartBtn = document.getElementById('btn-overlay-start');
  const overlay = document.getElementById('game-overlay');
  const scoreDisplay = document.getElementById('game-score-display');
  const livesDisplay = document.getElementById('game-lives-display');

  let gWidth = gCanvas.width = gCanvas.parentElement ? gCanvas.parentElement.clientWidth : 700;
  let gHeight = gCanvas.height = 320;

  window.addEventListener('resize', () => {
    if (gCanvas.parentElement) {
      gWidth = gCanvas.width = gCanvas.parentElement.clientWidth;
    }
  });

  let gameState = 'STOPPED';
  let score = 0;
  let lives = 3;
  let gameLoopId = null;

  const paddle = {
    x: gWidth / 2 - 50,
    y: gHeight - 25,
    width: 100,
    height: 12,
    speed: 8,
    dx: 0
  };

  const items = [];
  const itemTypes = [
    { text: 'React ⚛️', isGood: true, color: '#60a5fa' },
    { text: 'JS 🟨', isGood: true, color: '#f59e0b' },
    { text: 'Next N', isGood: true, color: '#ffffff' },
    { text: 'Clean Code ⚡', isGood: true, color: '#3b82f6' },
    { text: '404 Error 🚫', isGood: false, color: '#ef4444' },
    { text: 'Bug 👾', isGood: false, color: '#818cf8' },
    { text: 'Null Pointer ⚠️', isGood: false, color: '#f87171' }
  ];

  let lastSpawnTime = 0;

  function spawnItem() {
    const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    items.push({
      x: Math.random() * (gWidth - 100) + 10,
      y: -20,
      speed: 2 + Math.random() * 2,
      ...type
    });
  }

  function updateGame() {
    if (gameState !== 'PLAYING') return;

    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > gWidth) paddle.x = gWidth - paddle.width;

    const now = Date.now();
    if (now - lastSpawnTime > 900) {
      spawnItem();
      lastSpawnTime = now;
    }

    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      item.y += item.speed;

      if (
        item.y + 15 >= paddle.y &&
        item.y <= paddle.y + paddle.height &&
        item.x + 60 >= paddle.x &&
        item.x <= paddle.x + paddle.width
      ) {
        if (item.isGood) {
          score += 10;
        } else {
          score = Math.max(0, score - 15);
          lives -= 1;
        }
        items.splice(i, 1);
        updateDisplays();

        if (lives <= 0) {
          endGame();
        }
        continue;
      }

      if (item.y > gHeight + 20) {
        items.splice(i, 1);
      }
    }
  }

  function renderGame() {
    gCtx.clearRect(0, 0, gWidth, gHeight);

    gCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    gCtx.lineWidth = 1;
    for (let x = 0; x < gWidth; x += 40) {
      gCtx.beginPath();
      gCtx.moveTo(x, 0);
      gCtx.lineTo(x, gHeight);
      gCtx.stroke();
    }

    gCtx.fillStyle = '#3b82f6';
    gCtx.shadowColor = 'rgba(59, 130, 246, 0.4)';
    gCtx.shadowBlur = 8;
    gCtx.beginPath();
    gCtx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 6);
    gCtx.fill();
    gCtx.shadowBlur = 0;

    gCtx.font = 'bold 12px monospace';
    items.forEach((item) => {
      gCtx.fillStyle = item.color;
      gCtx.shadowColor = item.color;
      gCtx.shadowBlur = 8;
      gCtx.fillText(item.text, item.x, item.y);
      gCtx.shadowBlur = 0;
    });

    if (gameState === 'PLAYING') {
      updateGame();
      gameLoopId = requestAnimationFrame(renderGame);
    }
  }

  function updateDisplays() {
    if (scoreDisplay) scoreDisplay.textContent = `Score: ${score}`;
    if (livesDisplay) {
      let hearts = '';
      for (let i = 0; i < lives; i++) hearts += '❤️';
      if (lives === 0) hearts = '💀 GAMEOVER';
      livesDisplay.textContent = `Lives: ${hearts}`;
    }
  }

  function startGame() {
    score = 0;
    lives = 3;
    items.length = 0;
    gameState = 'PLAYING';
    paddle.x = gWidth / 2 - 50;
    if (overlay) overlay.classList.add('hidden');
    updateDisplays();
    cancelAnimationFrame(gameLoopId);
    gameLoopId = requestAnimationFrame(renderGame);
  }

  function endGame() {
    gameState = 'GAMEOVER';
    cancelAnimationFrame(gameLoopId);
    if (overlay) {
      overlay.classList.remove('hidden');
      const heading = overlay.querySelector('h3');
      if (heading) heading.textContent = `Game Over! Final Score: ${score} 🏆`;
    }
  }

  if (startBtn) startBtn.addEventListener('click', startGame);
  if (overlayStartBtn) overlayStartBtn.addEventListener('click', startGame);

  gCanvas.addEventListener('mousemove', (e) => {
    const rect = gCanvas.getBoundingClientRect();
    paddle.x = e.clientX - rect.left - paddle.width / 2;
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') paddle.dx = -paddle.speed;
    if (e.key === 'ArrowRight') paddle.dx = paddle.speed;
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') paddle.dx = 0;
  });
}

// --------------------------------------------------------------------------
// INITIALIZATION ON DOM READY
// --------------------------------------------------------------------------
window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', updateTargetFrame, { passive: true });

resizeCanvas();
preloadImages();
requestAnimationFrame(animationLoop);

document.addEventListener('DOMContentLoaded', () => {
  initWordNeonPop();
  initMagneticButtons();
  init3DTiltCards();
  initProjectModal();
  initProjectFilters();
  initStatCounters();
  initContactForm();
  initDeveloperTerminal();
  initPageTransitions();
  initParticleCanvas();
  initSkillBars();
  initDevArcadeGame();
});
})();
