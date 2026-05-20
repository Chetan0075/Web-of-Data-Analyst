import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, ArrowRight, Lock, Unlock, Zap, TrendingUp, Rocket, Activity } from 'lucide-react';

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
  // Store elapsed seconds since DOB was entered - this drives the metrics
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [baseLifeMetrics, setBaseLifeMetrics] = useState({
    heartbeats: 0,
    breaths: 0,
    steps: 0,
    words: 0,
  });
  const [unlockedProjects, setUnlockedProjects] = useState(new Set());
  const [lifeProgress, setLifeProgress] = useState({
    currentYears: 0,
    averageLifespan: 75,
    percentageLived: 0,
    yearsRemaining: 0,
  });
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartInstanceRef1 = useRef(null);
  const chartInstanceRef2 = useRef(null);

  // Main time calculation - updates every second
  useEffect(() => {
    if (!dob) return;

    const calculateAndUpdate = () => {
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

      setDisplayedStats({ days, hours, minutes, seconds, years, months });

      // Initialize base metrics once
      if (baseLifeMetrics.heartbeats === 0 && days > 0) {
        setBaseLifeMetrics({
          heartbeats: Math.floor(days * 86400 * 1.2),
          breaths: Math.floor(days * 86400 * 0.27),
          steps: Math.floor(days * 10000),
          words: Math.floor(days * 16000),
        });
      }

      // Calculate life progress
      const averageLifespan = 75;
      const percentageLived = Math.min((years / averageLifespan) * 100, 100);
      const yearsRemaining = Math.max(averageLifespan - years, 0);

      setLifeProgress({
        currentYears: years,
        averageLifespan,
        percentageLived,
        yearsRemaining,
      });

      // Unlock projects
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

    calculateAndUpdate();
    const interval = setInterval(calculateAndUpdate, 1000);
    return () => clearInterval(interval);
  }, [dob, forceUnlock]);

  // Separate interval to increment the counter every second
  useEffect(() => {
    if (!dob) return;

    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [dob]);

  // Calculate live metrics based on base + elapsed seconds
  const getLiveMetrics = () => {
    return {
      heartbeats: baseLifeMetrics.heartbeats + secondsElapsed * 1.2,
      breaths: baseLifeMetrics.breaths + secondsElapsed * 0.27,
      steps: baseLifeMetrics.steps + secondsElapsed * 0.12,
      words: baseLifeMetrics.words + secondsElapsed * 0.19,
    };
  };

  const liveMetrics = getLiveMetrics();

  // Initialize charts
  useEffect(() => {
    if (!dob || lifeProgress.currentYears === 0) return;

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
    script.onload = () => {
      if (window.Chart) {
        // Chart 1: Life Progress Bar
        if (chartRef1.current && !chartInstanceRef1.current) {
          const ctx1 = chartRef1.current.getContext('2d');
          chartInstanceRef1.current = new window.Chart(ctx1, {
            type: 'bar',
            data: {
              labels: ['Your Age', 'Remaining'],
              datasets: [
                {
                  label: 'Years',
                  data: [lifeProgress.currentYears, lifeProgress.yearsRemaining],
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
                  max: lifeProgress.averageLifespan,
                  stacked: true,
                },
              },
            },
          });
        }

        // Chart 2: Age Comparison
        if (chartRef2.current && !chartInstanceRef2.current) {
          const ctx2 = chartRef2.current.getContext('2d');
          chartInstanceRef2.current = new window.Chart(ctx2, {
            type: 'doughnut',
            data: {
              labels: ['Life Lived', 'Life Remaining'],
              datasets: [
                {
                  data: [
                    lifeProgress.percentageLived,
                    100 - lifeProgress.percentageLived,
                  ],
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
        }
      }
    };
    document.head.appendChild(script);
  }, [dob, lifeProgress]);

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
          {Math.floor(value).toLocaleString()}
        </div>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    );
  };

  const LiveMetricCard = ({ value, label, icon, color, increment }) => {
    return (
      <div
        className="p-4 bg-white rounded-xl border border-gray-100 text-center hover:shadow-md transition-all group cursor-pointer hover:scale-105"
      >
        <div className="text-3xl mb-1 group-hover:scale-125 transition-transform">{icon}</div>
        <div className="font-bold text-lg font-mono" style={{ color }}>
          {Math.floor(value).toLocaleString()}
        </div>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
        <div className="text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>
          ⬆️ +{increment}/sec
        </div>
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

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-in {
          animation: slideUp 0.6s ease-out;
        }

        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }

        input[type="date"] {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
        }
      `}</style>

      {/* TIME GAME SECTION */}
      {showGame && (
        <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-white via-purple-50 to-white">
          <div className="max-w-4xl w-full">
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
                {/* MAIN ANALYTICS DASHBOARD */}
                <div className="mb-12 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <TrendingUp size={24} className="text-purple-600" />
                    Your Life Analytics Dashboard
                  </h3>

                  {/* Main Counter Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 pb-12 border-b border-gray-100">
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

                  {/* Life Span Comparison Charts */}
                  <div className="mb-12">
                    <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Activity size={20} className="text-purple-600" />
                      Your Life Span vs Average Human Lifespan
                    </h4>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Life Progress Bar Chart */}
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <h5 className="text-sm font-bold text-gray-600 mb-4">Years Lived vs Remaining</h5>
                        <div style={{ position: 'relative', height: '200px' }}>
                          <canvas ref={chartRef1}></canvas>
                        </div>
                        <div className="mt-4 text-center text-sm text-gray-600">
                          <p>
                            <span className="font-bold text-purple-600">{lifeProgress.currentYears}</span> out of{' '}
                            <span className="font-bold">{lifeProgress.averageLifespan}</span> years
                          </p>
                        </div>
                      </div>

                      {/* Life Percentage Doughnut Chart */}
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <h5 className="text-sm font-bold text-gray-600 mb-4">Life Progress</h5>
                        <div style={{ position: 'relative', height: '200px' }}>
                          <canvas ref={chartRef2}></canvas>
                        </div>
                        <div className="mt-4 text-center text-sm text-gray-600">
                          <p>
                            <span className="font-bold text-purple-600">{Math.round(lifeProgress.percentageLived)}%</span> of average lifespan completed
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(lifeProgress.yearsRemaining)} years remaining (if average lifespan)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* KPI Cards */}
                  <div className="mb-12 pb-12 border-b border-gray-100">
                    <h4 className="text-lg font-bold mb-4">Key Life Metrics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200 hover:shadow-md transition-all">
                        <p className="text-sm text-gray-600 mb-1">Total Hours Lived</p>
                        <p className="text-3xl font-bold text-purple-700">
                          {((displayedStats.days * 24) + displayedStats.hours).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200 hover:shadow-md transition-all">
                        <p className="text-sm text-gray-600 mb-1">Total Minutes Lived</p>
                        <p className="text-3xl font-bold text-blue-700">
                          {(((displayedStats.days * 24) + displayedStats.hours) * 60 + displayedStats.minutes).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-4 border border-pink-200 hover:shadow-md transition-all">
                        <p className="text-sm text-gray-600 mb-1">Books You Could Read</p>
                        <p className="text-3xl font-bold text-pink-700">
                          {Math.floor(displayedStats.days / 7).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* YOUR TIME IN PERSPECTIVE - REAL-TIME INCREMENTING */}
                <div className="mb-12 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <Zap size={24} className="text-orange-600" />
                    Your Time in Perspective (Real-Time Updates ⚡)
                  </h3>

                  <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-sm text-green-900">
                      ✅ <span className="font-semibold">Watch the numbers INCREASE in real-time!</span> Each metric counts up continuously as you live. Your heartbeats, breaths, steps, and words are updating RIGHT NOW!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    <LiveMetricCard
                      value={liveMetrics.heartbeats}
                      label="Heartbeats"
                      icon="❤️"
                      color="#ec4899"
                      increment="1.2"
                    />
                    <LiveMetricCard
                      value={liveMetrics.breaths}
                      label="Breaths Taken"
                      icon="💨"
                      color="#06b6d4"
                      increment="0.27"
                    />
                    <LiveMetricCard
                      value={liveMetrics.steps}
                      label="Steps Walked"
                      icon="👣"
                      color="#3b82f6"
                      increment="0.12"
                    />
                    <LiveMetricCard
                      value={liveMetrics.words}
                      label="Words Spoken"
                      icon="💬"
                      color="#10b981"
                      increment="0.19"
                    />
                    <LiveMetricCard
                      value={Math.floor(displayedStats.days / 4)}
                      label="Movies Watched"
                      icon="🎬"
                      color="#8b5cf6"
                      increment="0.006"
                    />
                    <LiveMetricCard
                      value={Math.floor(displayedStats.days * 2)}
                      label="Coffee Cups"
                      icon="☕"
                      color="#92400e"
                      increment="0.023"
                    />
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-900">
                      💡 <span className="font-semibold">Real-time calculation:</span> The metrics increment every second based on realistic daily averages. Heartbeats (~72/min), Breaths (~16/min), Steps (~10,000/day), Words (~16,000/day)
                    </p>
                  </div>
                </div>

                {/* Unlock Button */}
                <div className="text-center mb-12">
                  {!forceUnlock && unlockedProjects.size < 3 && (
                    <button
                      onClick={() => setForceUnlock(true)}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 mb-4 pulse-animation"
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
