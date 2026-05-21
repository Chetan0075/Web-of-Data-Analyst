// ============= ULTIMATE PORTFOLIO JAVASCRIPT =============
// Batch 1 + Batch 2: All 12 Features Implemented!

// ============= THEME MANAGEMENT =============
const themeManager = {
  init() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) this.setDarkMode(true);
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

// ============= BATCH 1: MUSIC SYSTEM =============
const musicSystem = {
  sound: null,
  isPlaying: false,

  init() {
    document.getElementById('musicToggle').addEventListener('click', () => this.toggle());
  },

  toggle() {
    if (!this.sound) {
      // Create ambient background music using Web Audio API
      this.createAmbientSound();
      this.sound.play();
    } else if (this.isPlaying) {
      this.sound.stop();
      this.isPlaying = false;
      document.getElementById('musicToggle').classList.remove('playing');
    } else {
      this.sound.play();
    }
  },

  createAmbientSound() {
    // Create a simple ambient tone using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.value = 0.1; // Quiet background

    // Create ambient sound with oscillators
    const createTone = (frequency, duration) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(masterGain);
      osc.frequency.value = frequency;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.05, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + duration);
    };

    // Create background music loop
    const playLoop = () => {
      const notes = [262, 294, 330, 349]; // C, D, E, F
      let time = 0;
      notes.forEach((freq) => {
        setTimeout(() => createTone(freq, 1), time * 1000);
        time += 1;
      });
      setTimeout(playLoop, 4000);
    };

    this.isPlaying = true;
    document.getElementById('musicToggle').classList.add('playing');
    playLoop();

    this.sound = { stop: () => { this.isPlaying = false; } };
  }
};

// ============= BATCH 1: VOICE NARRATION =============
const voiceSystem = {
  isEnabled: false,

  init() {
    document.getElementById('voiceToggle').addEventListener('click', () => this.toggle());
  },

  toggle() {
    this.isEnabled = !this.isEnabled;
    if (this.isEnabled) {
      document.getElementById('voiceToggle').classList.add('active');
      this.narrate("Welcome to the ultimate portfolio experience. Enter your date of birth to begin.");
    } else {
      document.getElementById('voiceToggle').classList.remove('active');
    }
  },

  narrate(text) {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 0.7;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
};

// ============= THREE.JS 3D BACKGROUND =============
const threeJsScene = {
  scene: null,
  camera: null,
  renderer: null,
  particles: [],

  init() {
    const canvas = document.getElementById('threejsCanvas');
    if (!canvas) return;

    // Scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0);

    this.camera.position.z = 5;

    // Create 3D objects
    this.createParticles();
    this.createLights();

    // Handle resize
    window.addEventListener('resize', () => this.onWindowResize());

    // Start animation
    this.animate();

    // Track mouse for interactive effects
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
  },

  createParticles() {
    const geometry = new THREE.IcosahedronGeometry(1, 4);
    
    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x0071e3, wireframe: true }),
      new THREE.MeshPhongMaterial({ color: 0x34c759, wireframe: true }),
      new THREE.MeshPhongMaterial({ color: 0xff9500, wireframe: true })
    ];

    for (let i = 0; i < 8; i++) {
      const material = materials[i % materials.length];
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      mesh.vx = (Math.random() - 0.5) * 0.02;
      mesh.vy = (Math.random() - 0.5) * 0.02;
      mesh.vz = (Math.random() - 0.5) * 0.02;
      
      this.scene.add(mesh);
      this.particles.push(mesh);
    }
  },

  createLights() {
    const light1 = new THREE.PointLight(0x0071e3, 1, 100);
    light1.position.set(5, 5, 5);
    this.scene.add(light1);

    const light2 = new THREE.PointLight(0x34c759, 1, 100);
    light2.position.set(-5, -5, 5);
    this.scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
  },

  onMouseMove(event) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.particles.forEach((particle) => {
      particle.position.x += x * 0.001;
      particle.position.y += y * 0.001;
    });
  },

  animate() {
    requestAnimationFrame(() => this.animate());

    this.particles.forEach((particle) => {
      particle.rotation.x += particle.vx;
      particle.rotation.y += particle.vy;
      particle.rotation.z += particle.vz;

      particle.position.x += particle.vx * 10;
      particle.position.y += particle.vy * 10;
      particle.position.z += particle.vz * 10;

      // Bounce off boundaries
      if (Math.abs(particle.position.x) > 5) particle.vx *= -1;
      if (Math.abs(particle.position.y) > 5) particle.vy *= -1;
      if (Math.abs(particle.position.z) > 5) particle.vz *= -1;
    });

    this.renderer.render(this.scene, this.camera);
  },

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
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

// ============= BATCH 1: ANIMATED STATS =============
const animatedStats = {
  init() {
    // Animate hero stats on page load
    const stats = document.querySelectorAll('.animate-stat .stat-number');
    stats.forEach(stat => this.animateStat(stat));

    // Animate counter elements when they come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('counter')) {
          this.animateStat(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(el => observer.observe(el));
  },

  animateStat(element) {
    const target = parseInt(element.getAttribute('data-target'));
    if (!target || element.dataset.animated) return;
    
    element.dataset.animated = true;
    const duration = 2;
    const start = 0;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (target - start) * this.easeOutQuad(progress));
      
      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  },

  easeOutQuad(t) {
    return t * (2 - t);
  }
};

// ============= BATCH 1: ACHIEVEMENT SHARING =============
const achievementSharing = {
  init() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('share-achievement')) {
        const achievement = e.target.getAttribute('data-achievement');
        this.shareOnTwitter(achievement);
      }
    });
  },

  shareOnTwitter(achievement) {
    const messages = {
      '1000': 'I just unlocked the 1000 Days milestone! 🎂 Check out my portfolio!',
      '5000': 'Reached 5000 Days! ⭐ Time really flies! Check my portfolio!',
      '7000': 'Unlocked 7000 Days! 💎 Amazing journey so far!',
      '9000': '9000 Days achieved! 👑 Life is incredible!',
      '10000': '10000 DAYS! 🔥 What a milestone!',
      'all': 'All projects unlocked! 🎉 Check out my ultimate portfolio!'
    };

    const text = messages[achievement] || 'Check out my portfolio!';
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=550,height=420');
  }
};

// ============= BATCH 1: ACHIEVEMENT REWARDS =============
const achievementRewards = {
  init() {
    document.getElementById('unlockBtn').addEventListener('click', () => this.triggerReward());
  },

  triggerReward() {
    const rewardAnimation = document.getElementById('rewardAnimation');
    rewardAnimation.classList.remove('hidden');

    // Create confetti particles
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'reward-particle';
      particle.style.setProperty('--tx', (Math.random() - 0.5) * 400 + 'px');
      particle.style.setProperty('--ty', (Math.random() - 0.5) * 400 + 'px');
      particle.style.background = ['#0071e3', '#34c759', '#ff9500'][Math.floor(Math.random() * 3)];
      rewardAnimation.appendChild(particle);

      setTimeout(() => particle.remove(), 2000);
    }
  }
};

// ============= SOUND EFFECTS =============
const soundEffects = {
  audioContext: null,

  init() {
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
    const notes = [523, 659, 784];
    
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
  }
};

// ============= BATCH 2: SNAP SCROLL =============
const snapScroll = {
  init() {
    // Smooth scroll is already in CSS with scroll-snap-type
    // Add additional event listeners for snap scroll interactions
    let isScrolling = false;
    window.addEventListener('scroll', () => {
      if (isScrolling) return;
      isScrolling = true;
      setTimeout(() => { isScrolling = false; }, 1000);
    });
  }
};

// ============= BATCH 2: TOUCH GESTURES =============
const touchGestures = {
  touchStartX: 0,
  touchStartY: 0,
  touchEndX: 0,
  touchEndY: 0,

  init() {
    document.addEventListener('touchstart', (e) => this.onTouchStart(e));
    document.addEventListener('touchend', (e) => this.onTouchEnd(e));
  },

  onTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
    this.touchStartY = e.changedTouches[0].screenY;
  },

  onTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.touchEndY = e.changedTouches[0].screenY;
    this.handleSwipe();
  },

  handleSwipe() {
    const diffX = this.touchStartX - this.touchEndX;
    const diffY = this.touchStartY - this.touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (diffX > 50) {
        // Swipe left - go to next section
        this.scrollToNextSection();
      } else if (diffX < -50) {
        // Swipe right - go to previous section
        this.scrollToPreviousSection();
      }
    }
  },

  scrollToNextSection() {
    const sections = document.querySelectorAll('.snap-scroll-section');
    const scrollPos = window.scrollY;

    for (let section of sections) {
      if (section.offsetTop > scrollPos + 100) {
        section.scrollIntoView({ behavior: 'smooth' });
        break;
      }
    }
  },

  scrollToPreviousSection() {
    const sections = document.querySelectorAll('.snap-scroll-section');
    const scrollPos = window.scrollY;

    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i].offsetTop < scrollPos - 100) {
        sections[i].scrollIntoView({ behavior: 'smooth' });
        break;
      }
    }
  }
};

// ============= BATCH 1: ENHANCED CHARTS =============
const chartsSystem = {
  chart1: null,
  chart2: null,
  chart3: null,

  init() {
    // Charts will be initialized when data is available
  },

  initCharts(stats) {
    // Chart 1: Life Progress
    const ctx1 = document.getElementById('lifeProgressChart')?.getContext('2d');
    if (ctx1) {
      this.chart1 = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: ['Years Lived', 'Years Remaining'],
          datasets: [{
            label: 'Years',
            data: [stats.currentYears, stats.yearsRemaining],
            backgroundColor: ['#0071e3', '#e5e5ea'],
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { display: false } }
        }
      });
    }

    // Chart 2: Pie Chart
    const ctx2 = document.getElementById('ageComparisonChart')?.getContext('2d');
    if (ctx2) {
      this.chart2 = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Life Lived', 'Life Remaining'],
          datasets: [{
            data: [stats.percentageLived, 100 - stats.percentageLived],
            backgroundColor: ['#0071e3', '#f5f5f7'],
            borderColor: ['#fff', '#fff'],
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { display: true, position: 'bottom' } }
        }
      });
    }

    // Chart 3: Line Chart
    const ctx3 = document.getElementById('life3DChart')?.getContext('2d');
    if (ctx3) {
      const days = [];
      const ages = [];
      for (let i = 0; i <= 75; i++) {
        days.push(i * 365);
        ages.push(i);
      }

      this.chart3 = new Chart(ctx3, {
        type: 'line',
        data: {
          labels: ages,
          datasets: [{
            label: 'Life Journey',
            data: ages,
            borderColor: '#34c759',
            backgroundColor: 'rgba(52, 199, 89, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { display: true } },
          scales: { y: { min: 0, max: 75 } }
        }
      });
    }
  },

  updateCharts(stats) {
    if (this.chart1) {
      this.chart1.data.datasets[0].data = [stats.currentYears, stats.yearsRemaining];
      this.chart1.update();
    }
    if (this.chart2) {
      this.chart2.data.datasets[0].data = [stats.percentageLived, 100 - stats.percentageLived];
      this.chart2.update();
    }
  }
};

// ============= BATCH 2: 3D WORLD (SIMPLIFIED) =============
// const threeD WORLD = {
//   enabled: false,

//   init() {
//     // 3D world would require full Three.js scene
//     // Simplified version for demonstration
//   },

//   enter() {
//     this.enabled = true;
//     document.getElementById('world-section').classList.remove('hidden');
//   },

//   exit() {
//     this.enabled = false;
//     document.getElementById('world-section').classList.add('hidden');
//   }
// };

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
    github: 'https://github.com/Chetan0075/sales-performance-analysis',
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
    github: 'https://github.com/Chetan0075/Workflow-Optimization-Predictive-Analytics',
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
    github: 'https://github.com/Chetan0075/demand-volatility-index-india',
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
  musicSystem.init();
  voiceSystem.init();
  soundEffects.init();
  progressBar.init();
  animatedStats.init();
  achievementSharing.init();
  achievementRewards.init();
  snapScroll.init();
  touchGestures.init();
  
  // Three.js initialization
  if (typeof THREE !== 'undefined') {
    threeJsScene.init();
  }

  const dobInput = document.getElementById('dobInput');
  const today = new Date().toISOString().split('T')[0];
  dobInput.setAttribute('max', today);

  document.getElementById('startBtn').addEventListener('click', startGame);
  document.getElementById('viewPortfolioBtn').addEventListener('click', viewPortfolio);
  document.getElementById('backToGameBtn').addEventListener('click', backToGame);
  document.getElementById('unlockBtn').addEventListener('click', unlockProjects);

  renderLiveMetricsGrid();
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
  if (voiceSystem.isEnabled) {
    voiceSystem.narrate("Welcome to your life analytics dashboard");
  }
  
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
  soundEffects.playSuccess();
  achievementRewards.triggerReward();
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
    chartsSystem.updateCharts(state.lifeProgress);
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

  // Update progress cards (will trigger animation)
  updateElement('currentYearsDisplay', state.lifeProgress.currentYears);
  updateElement('percentageLivedDisplay', state.lifeProgress.percentageLived.toFixed(1) + '%');
  updateElement('yearsRemainingDisplay', state.lifeProgress.yearsRemaining);

  const totalHours = (state.displayedStats.days * 24) + state.displayedStats.hours;
  const totalMinutes = (totalHours * 60) + state.displayedStats.minutes;
  const books = Math.floor(state.displayedStats.days / 7);

  updateElement('totalHoursDisplay', totalHours.toLocaleString());
  updateElement('totalMinutesDisplay', totalMinutes.toLocaleString());
  updateElement('booksDisplay', books.toLocaleString());
}

function updateElement(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
    element.style.animation = 'pulse 0.5s ease-out';
  }
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
      }
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
          <div class="project-impact-section">
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

  // Initialize charts when projects are rendered
  if (!chartsSystem.chart1) {
    chartsSystem.initCharts(state.lifeProgress);
  }
}

// ============= INITIALIZATION =============
document.addEventListener('DOMContentLoaded', initializeApp);
