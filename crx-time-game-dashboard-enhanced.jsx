import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, ArrowRight, Lock, Unlock, Zap, TrendingUp, Rocket } from 'lucide-react';

const TimeGameDashboard = () => {
  const [dob, setDob] = useState(null);
  const [showGame, setShowGame] = useState(true);
  const [forceUnlock, setForceUnlock] = useState(false);
  const [displayedStats, setDisplayedStats] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    years: 0,
    months: 0,
  });
  const [timeStats, setTimeStats] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    years: 0,
    months: 0,
  });
  const [unlockedProjects, setUnlockedProjects] = useState(new Set());
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!dob) return;

    const updateTime = () => {
      const now = new Date();
      const birth = new Date(dob);
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

      setTimeStats({ days, hours, minutes, seconds, years, months });

      // Update displayed stats with smooth counting
      setDisplayedStats((prev) => ({
        years: years,
        months: months,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      }));

      // Unlock projects based on time lived OR force unlock
      const newUnlocked = new Set();
      if (forceUnlock) {
        newUnlocked.add(0);
        newUnlocked.add(1);
        newUnlocked.add(2);
      } else {
        if (days >= 5000) newUnlocked.add(0);
        if (days >= 7000) newUnlocked.add(1);
        if (days >= 9000) newUnlocked.add(2);
      }
      setUnlockedProjects(newUnlocked);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [dob, forceUnlock]);

  // Initialize chart when stats are ready
  useEffect(() => {
    if (dob && typeof window !== 'undefined' && displayedStats.days > 0 && !chartInstanceRef.current) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
      script.onload = () => {
        if (chartRef.current && window.Chart) {
          const ctx = chartRef.current.getContext('2d');
          chartInstanceRef.current = new window.Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Years', 'Months', 'Days', 'Hours'],
              datasets: [{
                data: [
                  displayedStats.years * 365,
                  displayedStats.months * 30,
                  displayedStats.days,
                  displayedStats.hours
                ],
                backgroundColor: ['#8b5cf6', '#06b6d4', '#3b82f6', '#ec4899'],
                borderColor: ['#fff', '#fff', '#fff', '#fff'],
                borderWidth: 3,
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
            },
          });
        }
      };
      document.head.appendChild(script);
    }
  }, [dob, displayedStats]);

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
      github: 'https://github.com/Chetan0075/superstore-analysis',
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
      github: 'https://github.com/Chetan0075/workflow-optimization',
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
      github: 'https://github.com/Chetan0075/demand-volatility-index',
    },
  ];

  const AnimatedCounter = ({ value, label, icon }) => {
    return (
      <div className="text-center p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group">
        <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">{icon}</div>
        <div className="text-4xl font-bold text-gray-900 mb-1 font-mono tracking-tight">
          {value.toLocaleString()}
        </div>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    );
  };

  const ProjectCard = ({ project }) => {
    const isUnlocked = unlockedProjects.has(project.id);
    const progressPercent = (displayedStats.days / project.unlockAt) * 100;

    return (
      <div
        className="relative group transition-all duration-500 mb-8"
        style={{
          opacity: isUnlocked ? 1 : 0.6,
          transform: isUnlocked ? 'scale(1)' : 'scale(0.95)',
        }}
      >
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500">
          <div
            className="h-2"
            style={{
              background: isUnlocked
                ? `linear-gradient(90deg, ${project.accentColor}, ${project.accentColor}60)`
                : '#e5e7eb',
            }}
          />

          <div className="p-8 relative">
            <div className="absolute top-8 right-8">
              {isUnlocked ? (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                  <Unlock size={14} />
                  Unlocked
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                  <Lock size={14} />
                  Locked
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-gray-500 text-base">{project.subtitle}</p>
            </div>

            {isUnlocked && (
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div
                  className="inline-block text-4xl font-bold"
                  style={{ color: project.accentColor }}
                >
                  {project.impact}
                </div>
                <p className="text-gray-500 text-sm mt-1">{project.keyMetric}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-100">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Problem
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">{project.problem}</p>
              </div>
              {isUnlocked && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                    Solution
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">{project.solution}</p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Unlock Progress
                </p>
                <p className="text-xs font-semibold" style={{ color: project.accentColor }}>
                  {Math.round(progressPercent)}%
                </p>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${Math.min(progressPercent, 100)}%`,
                    backgroundColor: project.accentColor,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Unlock at {project.unlockAt.toLocaleString()} days
                {displayedStats.days < project.unlockAt && ` (${project.unlockAt - displayedStats.days} days remaining)`}
              </p>
            </div>

            {isUnlocked && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all"
                style={{ backgroundColor: project.accentColor }}
              >
                <Github size={18} />
                View Code
                <ArrowRight size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-in {
          animation: slideUp 0.6s ease-out;
        }

        input[type="date"] {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
        }
      `}</style>

      {/* TIME GAME SECTION */}
      {showGame && (
        <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-white via-purple-50 to-white">
          <div className="max-w-3xl w-full">
            <div className="text-center mb-12 animate-in">
              <h1 className="text-6xl md:text-7xl font-black mb-4">⏰</h1>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                How Long Have You
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                  Actually Lived?
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                Enter your date of birth and unlock a portfolio like no other.
              </p>

              {!dob ? (
                <div className="bg-white rounded-3xl border-2 border-purple-200 p-8 shadow-lg mb-8">
                  <input
                    type="date"
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-6 py-4 text-2xl text-center font-semibold border-none outline-none bg-gray-50 rounded-xl"
                    style={{ color: '#1f2937' }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setDob(null);
                    setUnlockedProjects(new Set());
                    setForceUnlock(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors mb-8 text-sm font-semibold"
                >
                  Change Date
                </button>
              )}
            </div>

            {dob && (
              <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                {/* ANALYTICS KPI SECTION */}
                <div className="mb-12 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <TrendingUp size={24} className="text-purple-600" />
                    Your Life Analytics Dashboard
                  </h3>

                  {/* Main Counter Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <AnimatedCounter
                      value={displayedStats.years}
                      label="Years Lived"
                      icon="🎂"
                    />
                    <AnimatedCounter
                      value={displayedStats.months}
                      label="Months"
                      icon="📆"
                    />
                    <AnimatedCounter
                      value={displayedStats.days}
                      label="Days"
                      icon="📅"
                    />
                    <AnimatedCounter
                      value={displayedStats.hours}
                      label="Hours"
                      icon="⏱️"
                    />
                    <AnimatedCounter
                      value={displayedStats.minutes}
                      label="Minutes"
                      icon="⏲️"
                    />
                    <AnimatedCounter
                      value={displayedStats.seconds}
                      label="Seconds (Live)"
                      icon="⚡"
                    />
                  </div>

                  {/* Chart & Stats */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h4 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
                        <TrendingUp size={16} />
                        Time Distribution
                      </h4>
                      <div style={{ position: 'relative', height: '250px' }}>
                        <canvas ref={chartRef}></canvas>
                      </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200 hover:shadow-md transition-all">
                        <p className="text-sm text-gray-600 mb-1">Total Hours Lived</p>
                        <p className="text-4xl font-bold text-purple-700">
                          {((displayedStats.days * 24) + displayedStats.hours).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200 hover:shadow-md transition-all">
                        <p className="text-sm text-gray-600 mb-1">Total Minutes Lived</p>
                        <p className="text-4xl font-bold text-blue-700">
                          {(((displayedStats.days * 24) + displayedStats.hours) * 60 + displayedStats.minutes).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-4 border border-pink-200 hover:shadow-md transition-all">
                        <p className="text-sm text-gray-600 mb-1">Books You Could Read</p>
                        <p className="text-4xl font-bold text-pink-700">
                          {Math.floor(displayedStats.days / 7).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perspective Metrics */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold mb-6 text-center">Your Time in Perspective</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { label: 'Movies', value: Math.floor(displayedStats.days / 4), icon: '🎬', color: '#8b5cf6' },
                      { label: 'Coffee Cups', value: Math.floor(displayedStats.days * 2), icon: '☕', color: '#92400e' },
                      { label: 'Heartbeats', value: Math.floor(displayedStats.days * 86400 * 1.2), icon: '❤️', color: '#ec4899' },
                      { label: 'Breaths', value: Math.floor(displayedStats.days * 86400 * 16), icon: '💨', color: '#06b6d4' },
                      { label: 'Steps', value: Math.floor(displayedStats.days * 10000), icon: '👣', color: '#3b82f6' },
                      { label: 'Words Spoken', value: Math.floor(displayedStats.days * 16000), icon: '💬', color: '#10b981' },
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-white rounded-xl border border-gray-100 text-center hover:shadow-md transition-all">
                        <div className="text-3xl mb-1">{item.icon}</div>
                        <div className="font-bold text-lg" style={{ color: item.color }}>
                          {item.value.toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unlock Button */}
                <div className="text-center mb-12">
                  {!forceUnlock && unlockedProjects.size < 3 && (
                    <button
                      onClick={() => setForceUnlock(true)}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 mb-4"
                    >
                      <Unlock size={20} />
                      🔓 Unlock Full Portfolio
                      <Rocket size={20} />
                    </button>
                  )}
                  {forceUnlock && (
                    <div className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold mb-4">
                      <Unlock size={20} />
                      ✓ All Projects Unlocked!
                    </div>
                  )}
                </div>

                {/* Main CTA */}
                <div className="text-center">
                  <button
                    onClick={() => setShowGame(false)}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-lg transition-all duration-300 text-lg"
                  >
                    View My Portfolio
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* PROJECTS SECTION */}
      {!showGame && dob && (
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-in">
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                Game-Changing Work
              </h2>
              <p className="text-xl text-gray-600">
                {unlockedProjects.size} of 3 projects unlocked
              </p>
            </div>

            <div>
              {projects.map((project, i) => (
                <div key={project.id} style={{ animationDelay: `${i * 0.15}s` }} className="animate-in">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-20 bg-gray-900 rounded-3xl p-12 text-center text-white animate-in">
              <h3 className="text-3xl font-bold mb-6">Let's Build Something Epic</h3>
              <p className="text-gray-400 mb-8 text-lg">
                Have an idea? Let's talk about your next data revolution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:chetanyt303@gmail.com"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all"
                >
                  <Mail size={20} />
                  Email
                </a>
                <a
                  href="https://github.com/Chetan0075"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white text-white font-bold hover:bg-white hover:text-gray-900 transition-all"
                >
                  <Github size={20} />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/chetan-suraswal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white text-white font-bold hover:bg-white hover:text-gray-900 transition-all"
                >
                  <Linkedin size={20} />
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center mt-12">
              <button
                onClick={() => setShowGame(true)}
                className="text-gray-500 hover:text-gray-700 transition-colors font-semibold"
              >
                ← Back to Time Game
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8 text-sm">
        © 2024 CRX.ANALYTICS • Yavatmal, Maharashtra • A Time Game Portfolio Experience
      </footer>
    </div>
  );
};

export default TimeGameDashboard;
