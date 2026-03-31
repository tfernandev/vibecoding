/* =============================================
   AI Engineering for Devs — "Warm Intelligence"
   main.js — Interactions, Quiz & Effects
   ============================================= */

(function () {
  'use strict';

  /* ── THEME TOGGLE ── */
  const html = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) html.setAttribute('data-theme', savedTheme);
  updateToggleIcon();

  toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggleIcon();
  });

  function updateToggleIcon() {
    toggle.textContent = html.getAttribute('data-theme') === 'dark' ? '🌞' : '🌙';
  }

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-answer').hidden = true;
        o.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── SCROLL REVEAL ── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.children);
        entry.target.style.transitionDelay = `${siblings.indexOf(entry.target) * 80}ms`;
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.module-card, .audience-card, .bonus-item, .problem-card').forEach(el => {
    revealObs.observe(el);
  });

  /* ── SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── WARM PARTICLE CANVAS (hero) ── */
  initParticleCanvas('particles-canvas', 55, 140);

  /* ─────────────────────────────────────────────────
     QUIZ ENGINE — DIAGNÓSTICO COGNITIVO
  ───────────────────────────────────────────────── */

  const TOTAL_STEPS = 5;
  let currentStep = 1;
  let answers = {};   // { rol, equipo, dolor, uso, eval }

  const ringFill = document.getElementById('quiz-ring-fill');
  const stepLabel = document.getElementById('quiz-step-label');
  const quizResult = document.getElementById('quiz-result');
  const quizSteps = document.getElementById('quiz-steps');
  const feedbackEl = document.getElementById('quiz-feedback');

  // Circumference = 2π·r = 2π·18 ≈ 113.1
  const CIRC = 113.1;

  function setRing(step) {
    const pct = step / TOTAL_STEPS;
    ringFill.style.strokeDashoffset = CIRC * (1 - pct);
    stepLabel.textContent = `${step} / ${TOTAL_STEPS}`;
  }

  function showStep(n) {
    document.querySelectorAll('.quiz-step').forEach(el => {
      el.classList.remove('active');
    });
    const target = document.querySelector(`.quiz-step[data-step="${n}"]`);
    if (target) {
      target.classList.add('active');
    }
    setRing(n);
    currentStep = n;
  }

  function advanceQuiz() {
    if (currentStep < TOTAL_STEPS) {
      showStep(currentStep + 1);
    } else {
      renderResult();
    }
  }

  // Handle regular option clicks (steps 1-4)
  document.querySelectorAll('.quiz-options:not([data-key="eval"]) .quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.quiz-options');
      const key = group.dataset.key;
      const value = btn.dataset.value;

      // Visual select
      group.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      answers[key] = value;

      // Advance after short delay
      setTimeout(advanceQuiz, 420);
    });
  });

  // Handle step 5 (eval — prompt evaluation with feedback)
  document.querySelectorAll('.quiz-options[data-key="eval"] .quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.dataset.correct === 'true';
      answers.eval = btn.dataset.value;
      answers.evalCorrect = isCorrect;

      // Disable all options
      document.querySelectorAll('.quiz-options[data-key="eval"] .quiz-opt').forEach(b => {
        b.disabled = true;
        if (b.dataset.correct === 'true') b.classList.add('correct-answer');
        else if (b === btn && !isCorrect) b.classList.add('wrong-answer');
      });

      // Show feedback
      feedbackEl.hidden = false;
      if (isCorrect) {
        feedbackEl.className = 'quiz-feedback correct';
        feedbackEl.innerHTML = `<strong>✅ Correcto.</strong> Un prompt sin rol, contexto ni output esperado produce resultados genéricos e impredecibles. El contrato explícito es la base del prompt engineering real.`;
      } else {
        feedbackEl.className = 'quiz-feedback wrong';
        feedbackEl.innerHTML = `<strong>❌ No exactamente.</strong> La respuesta correcta es B. El problema no es la longitud ni el idioma — es que no hay <em>contrato cognitivo</em>: sin rol, contexto ni output definido, el modelo no puede producir resultados confiables.`;
      }

      setTimeout(renderResult, 1800);
    });
  });

  /* ── PROFILE CALCULATION ── */
  function calcProfile() {
    const { rol, equipo, dolor, uso, evalCorrect } = answers;

    // Score: higher = more "director"
    let score = 0;
    if (rol === 'techlead' || rol === 'arquitecto' || rol === 'founder') score += 2;
    if (rol === 'senior') score += 1;
    if (equipo === 'intensivo' || equipo === 'algunos') score += 1;
    if (dolor === 'criterio' || dolor === 'arquitectura' || dolor === 'deuda') score += 2;
    if (uso === 'arquitectura' || uso === 'brainstorm') score += 2;
    if (evalCorrect) score += 2;

    if (score >= 7) return 'director';
    if (score >= 4) return 'tactico';
    return 'riesgo';
  }

  const PROFILES = {
    director: {
      orb: 'director',
      emoji: '🟠',
      title: 'Director Técnico Potencial',
      desc: 'Tenés el criterio. Solo necesitás sistematizarlo. Este programa te da los frameworks para supervisar IA con autoridad y diseñar workflows que tu equipo pueda replicar.',
    },
    tactico: {
      orb: 'tactico',
      emoji: '🟡',
      title: 'Usuario Táctico de IA',
      desc: 'Usás IA pero de forma reactiva. Estás a pocos pasos de convertirte en quien dirige la IA, en lugar de quien la sigue. El módulo de supervisión y el Prompt Linter cambian todo.',
    },
    riesgo: {
      orb: 'riesgo',
      emoji: '🔴',
      title: 'Riesgo de Delegación Crítica',
      desc: 'Tu equipo delega sin criterio. Eso genera deuda técnica invisible y pérdida de ownership. Este programa es exactamente lo que necesitás para tomar el control.',
    },
  };

  const MODULE_RECS = {
    director: [
      { num: '01', name: 'Cómo funciona realmente la IA' },
      { num: '04', name: 'Supervisión de código generado por IA' },
      { num: '05', name: 'Diseño de workflows IA en equipo' },
      { num: '06', name: 'Orquestación avanzada y Multi-Tool Strategy' },
    ],
    tactico: [
      { num: '02', name: 'Prompt Architecture con contrato explícito' },
      { num: '03', name: 'Anti-patterns y control técnico' },
      { num: '04', name: 'Supervisión de código generado por IA' },
      { num: '05', name: 'Diseño de workflows IA en equipo' },
    ],
    riesgo: [
      { num: '01', name: 'Cómo funciona realmente la IA' },
      { num: '02', name: 'Prompt Architecture con contrato explícito' },
      { num: '03', name: 'Anti-patterns y control técnico' },
      { num: '04', name: 'Supervisión de código generado por IA' },
    ],
  };

  function renderResult() {
    const profile = calcProfile();
    const p = PROFILES[profile];
    const mods = MODULE_RECS[profile];

    // Hide steps, show result
    quizSteps.style.display = 'none';
    quizResult.hidden = false;

    // Ring → full
    ringFill.style.strokeDashoffset = 0;
    stepLabel.textContent = '✓';

    document.getElementById('result-orb').className = `result-orb ${p.orb}`;
    document.getElementById('result-title').textContent = `${p.emoji} ${p.title}`;
    document.getElementById('result-desc').textContent = p.desc;

    const list = document.getElementById('result-module-list');
    list.innerHTML = mods.map(m => `
      <div class="result-module-item">
        <span class="rmi-num">${m.num}</span>
        <span class="rmi-name">${m.name}</span>
      </div>`).join('');

    // Scroll into result
    setTimeout(() => {
      quizResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  }

  // Restart
  const restartBtn = document.getElementById('quiz-restart-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      answers = {};
      quizResult.hidden = true;
      quizSteps.style.display = '';
      feedbackEl.hidden = true;
      feedbackEl.className = 'quiz-feedback';
      // Reset all options
      document.querySelectorAll('.quiz-opt').forEach(b => {
        b.classList.remove('selected', 'correct-answer', 'wrong-answer');
        b.disabled = false;
      });
      showStep(1);
    });
  }

  // Initialize
  if (document.getElementById('quiz-steps')) {
    showStep(1);
    initParticleCanvas('quiz-canvas', 35, 100);
  }

  /* ─────────────────────────────────────────────────
     REUSABLE PARTICLE CANVAS
  ───────────────────────────────────────────────── */
  function initParticleCanvas(canvasId, count, maxDist) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    const warmColors = [
      'rgba(255,107,0,', 'rgba(255,183,3,',
      'rgba(255,209,102,', 'rgba(255,140,66,', 'rgba(255,201,60,',
    ];

    function resize() {
      w = canvas.width = canvas.offsetWidth || window.innerWidth;
      h = canvas.height = canvas.offsetHeight || window.innerHeight;
    }
    resize();
    new ResizeObserver(resize).observe(canvas.parentElement || document.body);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * (w || 800),
      y: Math.random() * (h || 600),
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2.2 + 0.8,
      colorBase: warmColors[Math.floor(Math.random() * warmColors.length)],
      alpha: Math.random() * 0.35 + 0.1,
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const isDark = html.getAttribute('data-theme') === 'dark';
      const lm = isDark ? 1.3 : 0.6;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(255,140,66,${(1 - dist / maxDist) * 0.1 * lm})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.colorBase + p.alpha + ')';
        ctx.fill();

        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

})();
