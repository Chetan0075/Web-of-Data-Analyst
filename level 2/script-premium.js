// ============= PREMIUM PORTFOLIO JAVASCRIPT =============
// Level 1, 2, 3, 4 Improvements Included

// ============= THEME MANAGEMENT =============
const themeManager = {
  init() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
      this.setDarkMode(true);
    }
    document.getElementById('themeToggle').addEventListener('click', () => this.toggle());
  },

  toggle() {
    const isDark = document.documentElement.classList.contains('dark-mode');
    this.setDarkMode(!isDark);
  },

  setDarkMode(isDark) {
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
      document.getElementById('themeToggle').innerHTML = '<span class="toggle-icon">☀️</span>';
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.getElementById('themeToggle').innerHTML = '<span class="toggle-icon">🌙</span>';
    }
    localStorage.setItem('darkMode', isDark);
  }
};

// ============= PARTICLE BACKGROUND =============
const particleSystem = {
  canvas: null,
  ctx: null,
  particles: [],
  animationId: null,

  init() {
    const container = document.getElementById('particleContainer');
    
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '1';
    this.canvas.style.pointerEvents = 'none';
    
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Create particles
    for (let i = 0; i < 30; i++) {
      this.particles.push(this.createParticle());
    }
    
    this.animate();
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.3 + 0.1,
      color: ['rgba(0, 113, 227', 'rgba(52, 199, 89', 'rgba(255, 149, 0'][Math.floor(Math.random() * 3)]
    };
  },

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      
      // Bounce off walls
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
      
      // Draw particle
      this.ctx.fillStyle = `${p.color}, ${p.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
        if (dist < 150) {
          this.ctx.strokeStyle = `${p.color}, ${p.opacity * 0.3})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    });
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
};

// ============= PROGRESS BAR =============
const progressBar = {
  init() {
    window.addEventListener('scroll', () => this.update());
  },

  update() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';
  }
};

// ============= SOUND EFFECTS =============
const soundEffects = {
  audioContext: null,

  init() {
    // Use Web Audio API for simple sounds
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  playClick() {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.start(now);
    osc.stop(now + 0.1);
  },

  playSuccess() {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    const notes = [523, 659, 784]; // C5, E5, G5
    
    notes.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.3, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
      
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.2);
    });
  },

  playUnlock() {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.start(now);
    osc.stop(now + 0.3);
  }
};

// ============= STATE MANAGEMENT =============
const state = {
  dob: null,
  showGame: true,
  forceUnlock: false,
  displayedStats: { days: 0, hours: 0, minutes: 0, seconds: 0, years: 0, months: 0 },
  secondsElapsed: 0,
  baseLifeMetrics: { heartbeats: 0, breaths: 0, steps: 0, words: 0 },
  unlockedProjects: new Set(),
  unlockedAchievements: new Set(),
  lifeProgress: { currentYears: 0, averageLifespan: 75, percentageLived: 0, yearsRemaining: 0 }
};

let chartInstance1 = null;
let chartInstance2 = null;

// Projects data
const projects = [
  {
    id: 0,
    accentColor: '#0071e3',
    unlockAt: 5000,
    title: 'Sales Performance & Profitability',
    subtitle: 'Superstore Revenue Optimization',
    impact: '28%',
    keyMetric: 'Profit Margin Increase',
    problem: 'Retail businesses blindly discounting, destroying margins.',
    solution: 'Power BI dashboard analyzing 500K+ sales records.',
    github: 'https://github.com/Chetan0075/superstore-analysis',
  },
  {
    id: 1,
    accentColor: '#34c759',
    unlockAt: 7000,
    title: 'Workflow Delay Optimization',
    subtitle: 'IT Service Cost Reduction',
    impact: '20%',
    keyMetric: 'Cost Reduction',
    problem: 'IT projects overrun. 40% from unidentified bottlenecks.',
    solution: 'SQL + Python + ML pipeline for delay prediction.',
    github: 'https://github.com/Chetan0075/workflow-optimization',
  },
  {
    id: 2,
    accentColor: '#ff9500',
    unlockAt: 9000,
    title: 'Demand Volatility Index',
    subtitle: 'Retail Shock Detection',
    impact: '34%',
    keyMetric: 'Inventory Risk Reduction',
    problem: 'Retail demand unpredictable. Inventory planning reactive.',
    solution: 'Custom DVI metric + shock detection Power BI dashboard.',
    github: 'https://github.com/Chetan0075/demand-volatility-index',
  },
];

const liveMetricsData = [
  { icon: '❤️', label: 'Heartbeats', increment: '1.2' },
  { icon: '💨', label: 'Breaths', increment: '0.27' },
  { icon: '👣', label: 'Steps', increment: '0.12' },
  { icon: '💬', label: 'Words', increment: '0.19' },
  { icon: '🎬', label: 'Movies', increment: '0.006' },
  { icon: '☕', label: 'Coffee', increment: '0.023' },
];

// ============= EVENT HANDLERS =============
function initializeApp() {
  themeManager.init();
  particleSystem.init();
  progressBar.init();
  soundEffects.init();

  const dobInput = document.getElementById('dobInput');
  const today = new Date().toISOString().split('T')[0];
  dobInput.setAttribute('max', today);

  document.getElementById('unlockBtn').addEventListener('click', unlockProjects);

  renderLiveMetricsGrid();
  setupScrollAnimations();
}

function startGame() {
  const dobInput = document.getElementById('dobInput');
  if (!dobInput.value) {
    alert('Please select your date of birth');
    soundEffects.playClick();
    return;
  }

  state.dob = dobInput.value;
  state.showGame = true;

  document.getElementById('hero-section').classList.add('hidden');
  document.getElementById('game-section').classList.remove('hidden');
  document.getElementById('portfolio-section').classList.add('hidden');

  soundEffects.playClick();
  startTimeCalculations();
  startSecondCounter();
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function viewPortfolio() {
  state.showGame = false;
  document.getElementById('game-section').classList.add('hidden');
  document.getElementById('portfolio-section').classList.remove('hidden');
  renderProjects();
  soundEffects.playClick();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToGame() {
  state.showGame = true;
  document.getElementById('game-section').classList.remove('hidden');
  document.getElementById('portfolio-section').classList.add('hidden');
  soundEffects.playClick();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function unlockProjects() {
  state.forceUnlock = true;
  document.getElementById('unlockBtn').classList.add('hidden');
  document.getElementById('unlockSuccess').classList.remove('hidden');
  updateProjectsUnlock();
  soundEffects.playUnlock();
  triggerConfetti();
}

// ============= TIME CALCULATIONS =============
function startTimeCalculations() {
  const calculateAndUpdate = () => {
    if (!state.dob) return;

    const now = new Date();
    const birth = new Date(state.dob);
    const diff = now - birth;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }

    state.displayedStats = { days, hours, minutes, seconds, years, months };

    if (state.baseLifeMetrics.heartbeats === 0 && days > 0) {
      state.baseLifeMetrics = {
        heartbeats: Math.floor(days * 86400 * 1.2),
        breaths: Math.floor(days * 86400 * 0.27),
        steps: Math.floor(days * 10000),
        words: Math.floor(days * 16000),
      };
    }

    const averageLifespan = 75;
    const percentageLived = Math.min((years / averageLifespan) * 100, 100);
    const yearsRemaining = Math.max(averageLifespan - years, 0);

    state.lifeProgress = {
      currentYears: years,
      averageLifespan,
      percentageLived,
      yearsRemaining,
    };

    state.unlockedProjects.clear();
    if (state.forceUnlock) {
      state.unlockedProjects.add(0);
      state.unlockedProjects.add(1);
      state.unlockedProjects.add(2);
    } else {
      if (days >= 5000) state.unlockedProjects.add(0);
      if (days >= 7000) state.unlockedProjects.add(1);
      if (days >= 9000) state.unlockedProjects.add(2);
    }

    updateDisplay();
    updateCharts();
    updateProjectsUnlock();
  };

  calculateAndUpdate();
  setInterval(calculateAndUpdate, 1000);
}

function startSecondCounter() {
  setInterval(() => {
    state.secondsElapsed++;
    updateLiveMetrics();
  }, 1000);
}

function updateDisplay() {
  document.getElementById('yearsDisplay').textContent = state.displayedStats.years;
  document.getElementById('monthsDisplay').textContent = state.displayedStats.months;
  document.getElementById('daysDisplay').textContent = state.displayedStats.days.toLocaleString();
  document.getElementById('hoursDisplay').textContent = state.displayedStats.hours;
  document.getElementById('minutesDisplay').textContent = state.displayedStats.minutes;
  document.getElementById('secondsDisplay').textContent = state.displayedStats.seconds;

  document.getElementById('currentYearsDisplay').textContent = state.lifeProgress.currentYears;
  document.getElementById('percentageLivedDisplay').textContent = state.lifeProgress.percentageLived.toFixed(1) + '%';
  document.getElementById('yearsRemainingDisplay').textContent = state.lifeProgress.yearsRemaining;

  const totalHours = (state.displayedStats.days * 24) + state.displayedStats.hours;
  const totalMinutes = (totalHours * 60) + state.displayedStats.minutes;
  const books = Math.floor(state.displayedStats.days / 7);

  document.getElementById('totalHoursDisplay').textContent = totalHours.toLocaleString();
  document.getElementById('totalMinutesDisplay').textContent = totalMinutes.toLocaleString();
  document.getElementById('booksDisplay').textContent = books.toLocaleString();
}

function updateLiveMetrics() {
  const liveMetrics = getLiveMetrics();
  const grid = document.getElementById('liveMetricsGrid');
  const cards = grid.querySelectorAll('.live-metric-card');
  
  cards.forEach((card, index) => {
    const value = getMetricValue(index, liveMetrics);
    card.querySelector('.live-metric-value').textContent = Math.floor(value).toLocaleString();
  });
}

function getLiveMetrics() {
  return {
    heartbeats: state.baseLifeMetrics.heartbeats + state.secondsElapsed * 1.2,
    breaths: state.baseLifeMetrics.breaths + state.secondsElapsed * 0.27,
    steps: state.baseLifeMetrics.steps + state.secondsElapsed * 0.12,
    words: state.baseLifeMetrics.words + state.secondsElapsed * 0.19,
  };
}

function getMetricValue(index, liveMetrics) {
  switch (index) {
    case 0: return liveMetrics.heartbeats;
    case 1: return liveMetrics.breaths;
    case 2: return liveMetrics.steps;
    case 3: return liveMetrics.words;
    case 4: return Math.floor(state.displayedStats.days / 4);
    case 5: return Math.floor(state.displayedStats.days * 2);
    default: return 0;
  }
}

// ============= LIVE METRICS GRID =============
function renderLiveMetricsGrid() {
  const grid = document.getElementById('liveMetricsGrid');
  grid.innerHTML = '';

  liveMetricsData.forEach((metric) => {
    const card = document.createElement('div');
    card.className = 'live-metric-card';
    card.innerHTML = `
      <div class="live-metric-icon">${metric.icon}</div>
      <div class="live-metric-value">0</div>
      <div class="live-metric-label">${metric.label}</div>
      <div class="live-metric-increment">⬆️ +${metric.increment}/s</div>
    `;
    grid.appendChild(card);
  });
}

// ============= CHARTS =============
function updateCharts() {
  if (!state.dob || state.lifeProgress.currentYears === 0) return;
  if (typeof Chart === 'undefined') {
    setTimeout(updateCharts, 100);
    return;
  }
  initializeCharts();
}

function initializeCharts() {
  const chartRef1 = document.getElementById('lifeProgressChart');
  if (chartRef1 && !chartInstance1) {
    const ctx1 = chartRef1.getContext('2d');
    chartInstance1 = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Your Age', 'Remaining'],
        datasets: [{
          label: 'Years',
          data: [state.lifeProgress.currentYears, state.lifeProgress.yearsRemaining],
          backgroundColor: ['#0071e3', '#e5e5ea'],
          borderRadius: 12,
          borderSkipped: false,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: { x: { max: state.lifeProgress.averageLifespan, stacked: true } },
      },
    });
  } else if (chartInstance1) {
    chartInstance1.data.datasets[0].data = [state.lifeProgress.currentYears, state.lifeProgress.yearsRemaining];
    chartInstance1.update();
  }

  const chartRef2 = document.getElementById('ageComparisonChart');
  if (chartRef2 && !chartInstance2) {
    const ctx2 = chartRef2.getContext('2d');
    chartInstance2 = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Life Lived', 'Life Remaining'],
        datasets: [{
          data: [state.lifeProgress.percentageLived, 100 - state.lifeProgress.percentageLived],
          backgroundColor: ['#0071e3', '#f5f5f7'],
          borderColor: ['#fff', '#fff'],
          borderWidth: 3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: true, position: 'bottom' } },
      },
    });
  } else if (chartInstance2) {
    chartInstance2.data.datasets[0].data = [state.lifeProgress.percentageLived, 100 - state.lifeProgress.percentageLived];
    chartInstance2.update();
  }
}

// ============= PROJECTS =============
function updateProjectsUnlock() {
  document.getElementById('unlockedCount').textContent = state.unlockedProjects.size;

  const achievements = [
    { id: '1000', days: 1000 },
    { id: '5000', days: 5000 },
    { id: '7000', days: 7000 },
    { id: '9000', days: 9000 },
    { id: '10000', days: 10000 },
    { id: 'all-unlocked', days: state.unlockedProjects.size === 3 ? 0 : Infinity },
  ];

  achievements.forEach((achievement) => {
    const element = document.getElementById(`achievement-${achievement.id}`);
    if (element && state.displayedStats.days >= achievement.days) {
      if (!state.unlockedAchievements.has(achievement.id)) {
        state.unlockedAchievements.add(achievement.id);
        element.classList.add('unlocked');
        soundEffects.playSuccess();
        triggerConfetti();
      }
    } else if (element) {
      element.classList.remove('unlocked');
    }
  });
}

function renderProjects() {
  const container = document.getElementById('projectsContainer');
  container.innerHTML = '';

  projects.forEach((project, index) => {
    const isUnlocked = state.unlockedProjects.has(project.id);
    const progressPercent = (state.displayedStats.days / project.unlockAt) * 100;

    const projectCard = document.createElement('div');
    projectCard.className = `project-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    projectCard.style.animationDelay = `${index * 0.1}s`;

    projectCard.innerHTML = `
      <div class="project-accent-bar"></div>
      <div class="project-content">
        <div class="project-lock-badge ${isUnlocked ? 'unlocked' : 'locked'}">
          ${isUnlocked ? '✓ Unlocked' : '🔒 Locked'}
        </div>
        <div class="project-header">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-subtitle">${project.subtitle}</p>
        </div>
        ${isUnlocked ? `
          <div class="project-impact-section" style="border-bottom-color: var(--border-light);">
            <div class="project-impact" style="color: ${project.accentColor}">${project.impact}</div>
            <p class="project-key-metric">${project.keyMetric}</p>
          </div>
        ` : ''}
        <div class="project-details">
          <div>
            <p class="detail-label">Problem</p>
            <p class="detail-text">${project.problem}</p>
          </div>
          ${isUnlocked ? `<div>
            <p class="detail-label">Solution</p>
            <p class="detail-text">${project.solution}</p>
          </div>` : ''}
        </div>
        <div class="project-progress">
          <div class="progress-header">
            <p class="progress-label">Unlock Progress</p>
            <p class="progress-percent" style="color: ${project.accentColor}">${Math.round(progressPercent)}%</p>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${Math.min(progressPercent, 100)}%; background-color: ${project.accentColor}"></div>
          </div>
        </div>
        ${isUnlocked ? `
          <div class="project-action-buttons">
            <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-action-btn primary">
              📊 GitHub
            </a>
            <a href="https://chetan0075.github.io/Web-of-dashboards/" target="_blank" rel="noopener noreferrer" class="project-action-btn">
              📈 Dashboard
            </a>
          </div>
        ` : ''}
      </div>
    `;

    container.appendChild(projectCard);
  });
}

// ============= SCROLL ANIMATIONS =============
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    observer.observe(section);
  });
}

// ============= CONFETTI EFFECT =============
function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '10000';
  document.body.appendChild(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  const confetti = [];

  for (let i = 0; i < 60; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: -20,
      w: Math.random() * 12 + 8,
      h: Math.random() * 12 + 8,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * 5 + 3,
      rotation: Math.random() * 360,
      color: ['#0071e3', '#34c759', '#ff9500', '#5856d6'][Math.floor(Math.random() * 4)],
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach((c, index) => {
      c.y += c.vy;
      c.x += c.vx;
      c.rotation += 5;
      c.vy += 0.15;

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();

      if (c.y > canvas.height) {
        confetti.splice(index, 1);
      }
    });

    if (confetti.length > 0) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  };

  animate();
}

// ============= INITIALIZATION =============
// (listener registered in enhancedInit block below)

// ============= CUSTOM CURSOR =============
const cursorFX = {
  dot: null,
  ring: null,
  mouseX: 0, mouseY: 0,
  ringX: 0, ringY: 0,
  trails: [],
  sparkTimeout: null,

  init() {
    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    this.dot = document.createElement('div');
    this.dot.className = 'custom-cursor';
    this.ring = document.createElement('div');
    this.ring.className = 'custom-cursor-ring';
    document.body.appendChild(this.dot);
    document.body.appendChild(this.ring);

    document.addEventListener('mousemove', (e) => this.onMove(e));
    document.addEventListener('mousedown', () => this.dot.classList.add('clicking'));
    document.addEventListener('mouseup', () => this.dot.classList.remove('clicking'));

    // Hover detection for interactive elements
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, input, [role="button"], .tech-item, .achievement-badge, .live-metric-card')) {
        this.dot.classList.add('hovering');
        this.ring.classList.add('hovering');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, input, [role="button"], .tech-item, .achievement-badge, .live-metric-card')) {
        this.dot.classList.remove('hovering');
        this.ring.classList.remove('hovering');
      }
    });

    this.animateRing();
  },

  onMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.dot.style.left = e.clientX + 'px';
    this.dot.style.top = e.clientY + 'px';

    // Spawn spark occasionally
    if (Math.random() < 0.15) this.spawnSpark(e.clientX, e.clientY);
  },

  animateRing() {
    this.ringX += (this.mouseX - this.ringX) * 0.12;
    this.ringY += (this.mouseY - this.ringY) * 0.12;
    this.ring.style.left = this.ringX + 'px';
    this.ring.style.top = this.ringY + 'px';
    requestAnimationFrame(() => this.animateRing());
  },

  spawnSpark(x, y) {
    const spark = document.createElement('div');
    spark.className = 'cursor-spark';
    const size = Math.random() * 4 + 2;
    const colors = ['#0071e3', '#34c759', '#ff9500', '#5856d6'];
    spark.style.cssText = `
      left: ${x + (Math.random() - 0.5) * 16}px;
      top:  ${y + (Math.random() - 0.5) * 16}px;
      width: ${size}px; height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
    `;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 600);
  }
};

// ============= GLITCH TEXT =============
const glitchFX = {
  elements: [],

  init() {
    const heroTitle = document.querySelector('.hero-title .gradient-text');
    if (heroTitle) {
      heroTitle.classList.add('glitch-text');
      heroTitle.dataset.text = heroTitle.textContent;
      this.elements.push(heroTitle);
    }
    this.startInterval();
  },

  trigger(el) {
    el.classList.add('glitching');
    setTimeout(() => el.classList.remove('glitching'), 350);
  },

  startInterval() {
    setInterval(() => {
      this.elements.forEach(el => {
        if (Math.random() < 0.3) this.trigger(el);
      });
    }, 4000);
  }
};

// ============= MAGNETIC BUTTONS =============
const magneticFX = {
  init() {
    if (window.matchMedia('(hover: none)').matches) return;
    const btns = document.querySelectorAll('.premium-button, .nav-button, .contact-button');
    btns.forEach(btn => {
      btn.classList.add('magnetic-btn');
      btn.addEventListener('mousemove', (e) => this.onMove(e, btn));
      btn.addEventListener('mouseleave', (e) => this.onLeave(btn));
    });
  },

  onMove(e, el) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    el.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
  },

  onLeave(el) {
    el.style.transform = '';
  }
};

// ============= SCROLL REVEAL =============
const scrollReveal = {
  observer: null,

  init() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // Observe cards and key sections when DOM is ready
    this.attachToElements();
  },

  attachToElements() {
    const selectors = [
      '.time-stat', '.progress-card-premium', '.metric-card-premium',
      '.live-metric-card', '.achievement-badge', '.tech-item',
      '.chart-wrapper', '.time-display-card', '.live-metrics-showcase',
      '.achievements-showcase', '.project-card', '.contact-showcase',
      '.tech-expertise-section', '.metrics-showcase'
    ];

    selectors.forEach((sel, sIdx) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        if (el.classList.contains('reveal')) return; // already added
        el.classList.add('reveal-scale');
        const delay = Math.min(i * 0.08, 0.5);
        el.style.transitionDelay = delay + 's';
        this.observer.observe(el);
      });
    });
  },

  // Call after dynamic content added (e.g. projects rendered)
  refresh() {
    this.attachToElements();
  }
};

// ============= SECTION CURTAIN TRANSITION =============
const curtainFX = {
  curtain: null,

  init() {
    this.curtain = document.createElement('div');
    this.curtain.className = 'section-curtain';
    document.body.appendChild(this.curtain);
  },

  async transition(callback) {
    this.curtain.classList.remove('wipe-in', 'wipe-out');
    void this.curtain.offsetWidth; // force reflow
    this.curtain.classList.add('wipe-in');

    await new Promise(r => setTimeout(r, 380));
    callback();

    this.curtain.classList.remove('wipe-in');
    void this.curtain.offsetWidth;
    this.curtain.classList.add('wipe-out');
    await new Promise(r => setTimeout(r, 420));
    this.curtain.classList.remove('wipe-out');

    // Refresh scroll reveal for newly-visible elements
    setTimeout(() => scrollReveal.refresh(), 100);
  }
};

// ============= MATRIX RAIN EASTER EGG =============
const matrixEgg = {
  canvas: null,
  ctx: null,
  animId: null,
  exitBtn: null,
  drops: [],
  chars: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEF@#$%',
  active: false,

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'matrixCanvas';
    document.body.appendChild(this.canvas);

    this.exitBtn = document.createElement('button');
    this.exitBtn.className = 'matrix-exit-btn';
    this.exitBtn.textContent = '[ ESC ] EXIT MATRIX';
    this.exitBtn.addEventListener('click', () => this.stop());
    document.body.appendChild(this.exitBtn);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.active) this.stop();
    });
  },

  start() {
    if (this.active) return;
    this.active = true;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    const cols = Math.floor(this.canvas.width / 16);
    this.drops = Array(cols).fill(1);
    this.canvas.classList.add('active');
    this.exitBtn.classList.add('visible');
    this.draw();
    easterToast('🟩 Matrix Mode', 'You found the Easter Egg! Type "hack" anytime.');
    soundEffects.playUnlock();
  },

  stop() {
    this.active = false;
    cancelAnimationFrame(this.animId);
    this.canvas.classList.remove('active');
    this.exitBtn.classList.remove('visible');
  },

  draw() {
    if (!this.active) return;
    this.ctx.fillStyle = 'rgba(0,0,0,0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#00ff46';
    this.ctx.font = '14px Courier New';
    this.drops.forEach((y, i) => {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      this.ctx.fillText(char, i * 16, y * 16);
      if (y * 16 > this.canvas.height && Math.random() > 0.975) this.drops[i] = 0;
      this.drops[i]++;
    });
    this.animId = requestAnimationFrame(() => this.draw());
  }
};

// ============= KONAMI CODE EASTER EGG =============
const konamiEgg = {
  sequence: ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'],
  current: [],

  init() {
    document.addEventListener('keydown', e => {
      this.current.push(e.key);
      if (this.current.length > this.sequence.length) this.current.shift();
      if (JSON.stringify(this.current) === JSON.stringify(this.sequence)) {
        this.activate();
      }
    });
  },

  activate() {
    neonMode.toggle();
    easterToast('🎮 KONAMI CODE!', 'Secret Neon Mode activated! ↑↑↓↓←→←→BA');
    triggerConfetti();
    soundEffects.playUnlock();
  }
};

// ============= HACK KEYWORD EASTER EGG =============
const hackEgg = {
  buffer: '',
  timeout: null,

  init() {
    document.addEventListener('keypress', e => {
      clearTimeout(this.timeout);
      this.buffer += e.key.toLowerCase();
      if (this.buffer.includes('hack')) {
        this.buffer = '';
        matrixEgg.start();
      }
      this.timeout = setTimeout(() => { this.buffer = ''; }, 1500);
    });
  }
};

// ============= NEON SECRET MODE =============
const neonMode = {
  active: false,
  badge: null,

  init() {
    this.badge = document.createElement('div');
    this.badge.className = 'neon-badge';
    this.badge.textContent = '⚡ NEON MODE';
    this.badge.title = 'Press Konami code again to exit';
    this.badge.addEventListener('click', () => this.toggle());
    document.body.appendChild(this.badge);
  },

  toggle() {
    this.active = !this.active;
    document.documentElement.classList.toggle('neon-mode', this.active);
    // Also turn off dark mode conflicts
    if (this.active) {
      document.documentElement.classList.add('dark-mode');
      document.getElementById('themeToggle').innerHTML = '<span class="toggle-icon">🟣</span>';
    }
  }
};

// ============= EASTER EGG TOAST =============
function easterToast(title, body) {
  let toast = document.getElementById('easter-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'easter-toast';
    toast.className = 'easter-toast';
    toast.innerHTML = '<div class="easter-toast-title"></div><div class="easter-toast-body"></div>';
    document.body.appendChild(toast);
  }
  toast.querySelector('.easter-toast-title').textContent = title;
  toast.querySelector('.easter-toast-body').textContent = body;
  toast.classList.add('visible');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('visible'), 4000);
}

// ============= ENHANCED INIT =============
document.addEventListener('DOMContentLoaded', () => {
  // Run original init
  initializeApp();

  // Boot new features
  cursorFX.init();
  glitchFX.init();
  curtainFX.init();
  scrollReveal.init();
  matrixEgg.init();
  konamiEgg.init();
  hackEgg.init();
  neonMode.init();

  // Patch navigation to use curtain transitions
  document.getElementById('startBtn').addEventListener('click', () => {
    const dobInput = document.getElementById('dobInput');
    if (!dobInput.value) {
      alert('Please select your date of birth');
      soundEffects.playClick();
      return;
    }
    state.dob = dobInput.value;
    soundEffects.playClick();
    curtainFX.transition(() => {
      document.getElementById('hero-section').classList.add('hidden');
      document.getElementById('game-section').classList.remove('hidden');
      document.getElementById('portfolio-section').classList.add('hidden');
      window.scrollTo({ top: 0 });
      startTimeCalculations();
      startSecondCounter();
    });
  });

  document.getElementById('viewPortfolioBtn').addEventListener('click', () => {
    soundEffects.playClick();
    curtainFX.transition(() => {
      document.getElementById('game-section').classList.add('hidden');
      document.getElementById('portfolio-section').classList.remove('hidden');
      window.scrollTo({ top: 0 });
      renderProjects();
      setTimeout(() => { scrollReveal.refresh(); magneticFX.init(); }, 150);
    });
  });

  document.getElementById('backToGameBtn').addEventListener('click', () => {
    soundEffects.playClick();
    curtainFX.transition(() => {
      document.getElementById('game-section').classList.remove('hidden');
      document.getElementById('portfolio-section').classList.add('hidden');
      window.scrollTo({ top: 0 });
    });
  });

  // Init magnetic on visible buttons
  magneticFX.init();

  // Hint toast after 8s on hero
  setTimeout(() => {
    if (document.getElementById('hero-section') && !document.getElementById('hero-section').classList.contains('hidden')) {
      easterToast('💡 Easter Eggs!', 'Try the Konami code ↑↑↓↓←→←→BA or type "hack"');
    }
  }, 8000);
});
