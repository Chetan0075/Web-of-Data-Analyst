// ============= STATE MANAGEMENT =============
const state = {
  dob: null,
  showGame: true,
  forceUnlock: false,
  displayedStats: {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    years: 0,
    months: 0,
  },
  secondsElapsed: 0,
  baseLifeMetrics: {
    heartbeats: 0,
    breaths: 0,
    steps: 0,
    words: 0,
  },
  unlockedProjects: new Set(),
  unlockedAchievements: new Set(),
  lifeProgress: {
    currentYears: 0,
    averageLifespan: 75,
    percentageLived: 0,
    yearsRemaining: 0,
  },
};

// Chart instances
let chartInstance1 = null;
let chartInstance2 = null;

// Projects data
const projects = [
  {
    id: 0,
    accentColor: '#8b5cf6',
    unlockAt: 5000,
    title: 'Sales Performance & Profitability',
    subtitle: 'Superstore Revenue Optimization',
    impact: '28%',
    keyMetric: 'Profit Margin Increase',
    problem: 'Retail businesses blindly discounting, destroying margins.',
    solution: 'Power BI dashboard analyzing 500K+ sales records.',
    github: 'https://github.com/Chetan0075/sales-performance-analysis',
  },
  {
    id: 1,
    accentColor: '#06b6d4',
    unlockAt: 7000,
    title: 'Workflow Delay Optimization',
    subtitle: 'IT Service Cost Reduction',
    impact: '20%',
    keyMetric: 'Cost Reduction',
    problem: 'IT projects overrun. 40% from unidentified bottlenecks.',
    solution: 'SQL + Python + ML pipeline for delay prediction.',
    github: 'https://github.com/Chetan0075/Workflow-Optimization-Predictive-Analytics',
  },
  {
    id: 2,
    accentColor: '#3b82f6',
    unlockAt: 9000,
    title: 'Demand Volatility Index',
    subtitle: 'Retail Shock Detection',
    impact: '34%',
    keyMetric: 'Inventory Risk Reduction',
    problem: 'Retail demand unpredictable. Inventory planning reactive.',
    solution: 'Custom DVI metric + shock detection Power BI dashboard.',
    github: 'https://github.com/Chetan0075/demand-volatility-index-india',
  },
];

// Live metrics data
const liveMetricsData = [
  { icon: '❤️', label: 'Heartbeats', increment: '1.2', color: '#ec4899' },
  { icon: '💨', label: 'Breaths Taken', increment: '0.27', color: '#06b6d4' },
  { icon: '👣', label: 'Steps Walked', increment: '0.12', color: '#3b82f6' },
  { icon: '💬', label: 'Words Spoken', increment: '0.19', color: '#10b981' },
  { icon: '🎬', label: 'Movies Watched', increment: '0.006', color: '#8b5cf6' },
  { icon: '☕', label: 'Coffee Cups', increment: '0.023', color: '#92400e' },
];

// ============= DOM ELEMENTS =============
const dobInput = document.getElementById('dobInput');
const startBtn = document.getElementById('startBtn');
const heroSection = document.getElementById('hero-section');
const gameSection = document.getElementById('game-section');
const portfolioSection = document.getElementById('portfolio-section');
const viewPortfolioBtn = document.getElementById('viewPortfolioBtn');
const backToGameBtn = document.getElementById('backToGameBtn');
const unlockBtn = document.getElementById('unlockBtn');
const unlockSuccess = document.getElementById('unlockSuccess');

// ============= INITIALIZATION =============
function init() {
  // Set max date to today
  const today = new Date().toISOString().split('T')[0];
  dobInput.setAttribute('max', today);

  // Add event listeners
  startBtn.addEventListener('click', startGame);
  viewPortfolioBtn.addEventListener('click', viewPortfolio);
  backToGameBtn.addEventListener('click', backToGame);
  unlockBtn.addEventListener('click', unlockProjects);

  // Render live metrics grid
  renderLiveMetricsGrid();
}

// ============= EVENT HANDLERS =============
function startGame() {
  const selectedDob = dobInput.value;
  if (!selectedDob) {
    alert('Please select your date of birth');
    return;
  }

  state.dob = selectedDob;
  state.showGame = true;

  // Hide hero, show game
  heroSection.classList.add('hidden');
  gameSection.classList.remove('hidden');
  portfolioSection.classList.add('hidden');

  // Start time calculations
  startTimeCalculations();
  startSecondCounter();
}

function viewPortfolio() {
  state.showGame = false;
  gameSection.classList.add('hidden');
  portfolioSection.classList.remove('hidden');
  renderProjects();
}

function backToGame() {
  state.showGame = true;
  gameSection.classList.remove('hidden');
  portfolioSection.classList.add('hidden');
}

function unlockProjects() {
  state.forceUnlock = true;
  unlockBtn.classList.add('hidden');
  unlockSuccess.classList.remove('hidden');
  updateProjectsUnlock();
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

    // Initialize base metrics once
    if (state.baseLifeMetrics.heartbeats === 0 && days > 0) {
      state.baseLifeMetrics = {
        heartbeats: Math.floor(days * 86400 * 1.2),
        breaths: Math.floor(days * 86400 * 0.27),
        steps: Math.floor(days * 10000),
        words: Math.floor(days * 16000),
      };
    }

    // Calculate life progress
    const averageLifespan = 75;
    const percentageLived = Math.min((years / averageLifespan) * 100, 100);
    const yearsRemaining = Math.max(averageLifespan - years, 0);

    state.lifeProgress = {
      currentYears: years,
      averageLifespan,
      percentageLived,
      yearsRemaining,
    };

    // Unlock projects
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

// ============= UPDATE DISPLAY =============
function updateDisplay() {
  // Update time stats
  document.getElementById('yearsDisplay').textContent = state.displayedStats.years;
  document.getElementById('monthsDisplay').textContent = state.displayedStats.months;
  document.getElementById('daysDisplay').textContent = state.displayedStats.days.toLocaleString();
  document.getElementById('hoursDisplay').textContent = state.displayedStats.hours;
  document.getElementById('minutesDisplay').textContent = state.displayedStats.minutes;
  document.getElementById('secondsDisplay').textContent = state.displayedStats.seconds;

  // Update progress stats
  document.getElementById('currentYearsDisplay').textContent = state.lifeProgress.currentYears;
  document.getElementById('percentageLivedDisplay').textContent = state.lifeProgress.percentageLived.toFixed(1) + '%';
  document.getElementById('yearsRemainingDisplay').textContent = state.lifeProgress.yearsRemaining;

  // Update key metrics
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

  // Update each metric card
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
    case 0:
      return liveMetrics.heartbeats;
    case 1:
      return liveMetrics.breaths;
    case 2:
      return liveMetrics.steps;
    case 3:
      return liveMetrics.words;
    case 4:
      return Math.floor(state.displayedStats.days / 4);
    case 5:
      return Math.floor(state.displayedStats.days * 2);
    default:
      return 0;
  }
}

// ============= LIVE METRICS GRID =============
function renderLiveMetricsGrid() {
  const grid = document.getElementById('liveMetricsGrid');
  grid.innerHTML = '';

  liveMetricsData.forEach((metric) => {
    const card = document.createElement('div');
    card.className = 'live-metric-card';
    card.style.borderColor = metric.color;

    card.innerHTML = `
      <div class="live-metric-icon">${metric.icon}</div>
      <div class="live-metric-value" style="color: ${metric.color}">0</div>
      <div class="live-metric-label">${metric.label}</div>
      <div class="live-metric-increment" style="color: ${metric.color}">⬆️ +${metric.increment}/sec</div>
    `;

    grid.appendChild(card);
  });
}

// ============= CHARTS =============
function updateCharts() {
  if (!state.dob || state.lifeProgress.currentYears === 0) return;

  // Initialize Chart.js if not already loaded
  if (typeof Chart === 'undefined') {
    setTimeout(updateCharts, 100);
    return;
  }

  initializeCharts();
}

function initializeCharts() {
  // Chart 1: Life Progress Bar
  const chartRef1 = document.getElementById('lifeProgressChart');
  if (chartRef1 && !chartInstance1) {
    const ctx1 = chartRef1.getContext('2d');
    chartInstance1 = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Your Age', 'Remaining'],
        datasets: [
          {
            label: 'Years',
            data: [state.lifeProgress.currentYears, state.lifeProgress.yearsRemaining],
            backgroundColor: ['#8b5cf6', '#e5e7eb'],
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            max: state.lifeProgress.averageLifespan,
            stacked: true,
          },
        },
      },
    });
  } else if (chartInstance1) {
    chartInstance1.data.datasets[0].data = [
      state.lifeProgress.currentYears,
      state.lifeProgress.yearsRemaining,
    ];
    chartInstance1.update();
  }

  // Chart 2: Age Comparison
  const chartRef2 = document.getElementById('ageComparisonChart');
  if (chartRef2 && !chartInstance2) {
    const ctx2 = chartRef2.getContext('2d');
    chartInstance2 = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Life Lived', 'Life Remaining'],
        datasets: [
          {
            data: [state.lifeProgress.percentageLived, 100 - state.lifeProgress.percentageLived],
            backgroundColor: ['#8b5cf6', '#f3f4f6'],
            borderColor: ['#fff', '#fff'],
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: true, position: 'bottom' } },
      },
    });
  } else if (chartInstance2) {
    chartInstance2.data.datasets[0].data = [
      state.lifeProgress.percentageLived,
      100 - state.lifeProgress.percentageLived,
    ];
    chartInstance2.update();
  }
}

// ============= PROJECTS =============
function updateProjectsUnlock() {
  const unlockCount = document.getElementById('unlockedCount');
  unlockCount.textContent = state.unlockedProjects.size;

  // Update achievements
  const days = state.displayedStats.days;
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
    if (element && days >= achievement.days) {
      if (!state.unlockedAchievements.has(achievement.id)) {
        state.unlockedAchievements.add(achievement.id);
        element.classList.add('unlocked');
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
    projectCard.style.animationDelay = `${index * 0.15}s`;

    const topBar = document.createElement('div');
    topBar.className = `project-top-bar ${isUnlocked ? 'unlocked' : ''}`;
    topBar.style.backgroundColor = isUnlocked
      ? `linear-gradient(90deg, ${project.accentColor}, ${project.accentColor}60)`
      : '#e5e7eb';

    const content = document.createElement('div');
    content.className = 'project-content';

    const lockBadge = document.createElement('div');
    lockBadge.className = `project-lock-badge ${isUnlocked ? 'unlocked' : 'locked'}`;
    lockBadge.innerHTML = isUnlocked
      ? '🔓 Unlocked'
      : '🔒 Locked';

    const header = document.createElement('div');
    header.className = 'project-header';
    header.innerHTML = `
      <h3 class="project-title">${project.title}</h3>
      <p class="project-subtitle">${project.subtitle}</p>
    `;

    let impactHTML = '';
    if (isUnlocked) {
      impactHTML = `
        <div style="color: ${project.accentColor}; margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid #e5e7eb;">
          <div class="project-impact" style="color: ${project.accentColor}">${project.impact}</div>
          <p class="project-key-metric">${project.keyMetric}</p>
        </div>
      `;
    }

    const details = document.createElement('div');
    details.className = `project-details ${isUnlocked ? 'unlocked' : 'locked'}`;
    details.innerHTML = `
      <div>
        <p class="detail-label">Problem</p>
        <p class="detail-text">${project.problem}</p>
      </div>
      ${isUnlocked
        ? `<div>
          <p class="detail-label">Solution</p>
          <p class="detail-text">${project.solution}</p>
        </div>`
        : ''}
    `;

    const progressSection = document.createElement('div');
    progressSection.className = 'project-progress';
    progressSection.innerHTML = `
      <div class="progress-header">
        <p class="progress-label">Unlock Progress</p>
        <p class="progress-percent" style="color: ${project.accentColor}">${Math.round(progressPercent)}%</p>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${Math.min(progressPercent, 100)}%; background-color: ${project.accentColor}"></div>
      </div>
    `;

    const githubSection = document.createElement('div');
    if (isUnlocked) {
      githubSection.innerHTML = `
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-github-btn">
            📊 View on GitHub
          </a>
          <a href="https://chetan0075.github.io/Web-of-dashboards/" target="_blank" rel="noopener noreferrer" class="project-dashboard-btn" style="background: linear-gradient(135deg, #06b6d4, #0891b2); border: none;">
            📈 View Dashboard
          </a>
        </div>
      `;
    }

    content.appendChild(lockBadge);
    content.appendChild(header);
    content.innerHTML += impactHTML;
    content.appendChild(details);
    content.appendChild(progressSection);
    content.appendChild(githubSection);

    projectCard.appendChild(topBar);
    projectCard.appendChild(content);

    container.appendChild(projectCard);
  });
}

// ============= VISUAL EFFECTS =============
function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  const confetti = [];

  // Create confetti pieces
  for (let i = 0; i < 50; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 10 + 5,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 4 + 4,
      rotation: Math.random() * 360,
      color: ['#8b5cf6', '#06b6d4', '#3b82f6', '#fbbf24', '#f97316'][Math.floor(Math.random() * 5)],
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach((c, index) => {
      c.y += c.vy;
      c.x += c.vx;
      c.rotation += 5;
      c.vy += 0.1; // gravity

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
document.addEventListener('DOMContentLoaded', init);
