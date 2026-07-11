import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { about, stats, profile } from '../data/content';
import Reveal from './Reveal';
import './About.css';

function StatCounter({ value, suffix, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const [display, setDisplay] = useState(label.toLowerCase().includes('cgpa') ? value : (value.includes('.') ? '0.00' : '0'));

  useEffect(() => {
    if (!inView) return undefined;
    if (label.toLowerCase().includes('cgpa')) {
      setDisplay(value);
      return undefined;
    }
    const numeric = parseFloat(value);
    const isFloat = value.includes('.');
    let raf;
    const start = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = numeric * eased;
      setDisplay(isFloat ? current.toFixed(2) : String(Math.round(current)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, label]);

  return (
    <div className="stat" ref={ref}>
      <div className="stat-value">
        {display}
        <span className="stat-suffix">{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// Fallback used only when the backend API is unreachable / errors.
// (Values supplied as the offline snapshot.)
const LC_FALLBACK = {
  totalSolved: 356,
  easySolved: 139,
  mediumSolved: 188,
  hardSolved: 29,
  ranking: '369,725',
  contributionPoint: 1459,
  reputation: 419,
  // Not provided by the API - kept as static display values:
  totalQuestions: 3985,
  totalEasy: 953,
  totalMedium: 2081,
  totalHard: 951,
  streak: 222,
  rating: 1612,
  badge: '100 Days Badge 2026',
  solutions: 74,
  views: '4.2K',
};

const LC_API = 'https://portfolio-backend-22i2.onrender.com/';

export default function About() {
  const [lcData, setLcData] = useState(LC_FALLBACK);
  const [isLive, setIsLive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchLeetCode = async () => {
      try {
        const res = await fetch(LC_API);
        if (!res.ok) throw new Error(`API responded ${res.status}`);
        const data = await res.json();
        if (!active || !data) return;
        setIsLive(true);

        // Real data from the API - only override fields the API actually sends,
        // keeping the static fallbacks for everything it doesn't.
        setLcData(prev => ({
          ...prev,
          totalSolved: data.totalSolved ?? prev.totalSolved,
          easySolved: data.easySolved ?? prev.easySolved,
          mediumSolved: data.mediumSolved ?? prev.mediumSolved,
          hardSolved: data.hardSolved ?? prev.hardSolved,
          ranking: data.ranking != null ? data.ranking.toLocaleString() : prev.ranking,
          contributionPoint: data.contributionPoint ?? prev.contributionPoint,
          reputation: data.reputation ?? prev.reputation,
        }));
      } catch (err) {
        // API errored - keep the fallback snapshot already in state.
      }
    };
    fetchLeetCode();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Feed the live total into the "DSA problems solved" stat counter too.
  const liveStats = stats.map(s =>
    s.label.toLowerCase().includes('dsa')
      ? { ...s, value: String(lcData.totalSolved) }
      : s
  );

  // Donut ring: proportion of each difficulty within total solved.
  const solved = lcData.easySolved + lcData.mediumSolved + lcData.hardSolved || 1;
  const easyPct = (lcData.easySolved / solved) * 100;
  const medPct = (lcData.mediumSolved / solved) * 100;
  const ringGradient = `conic-gradient(#10b981 0 ${easyPct}%, #f59e0b ${easyPct}% ${easyPct + medPct}%, #ef4444 ${easyPct + medPct}% 100%)`;

  const bars = [
    { key: 'easy', label: 'Easy', solved: lcData.easySolved, total: lcData.totalEasy },
    { key: 'medium', label: 'Medium', solved: lcData.mediumSolved, total: lcData.totalMedium },
    { key: 'hard', label: 'Hard', solved: lcData.hardSolved, total: lcData.totalHard },
  ];

  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">about</span>
            <h2 className="section-title">
              Engineer at heart, <span className="grad-text">builder</span> by habit
            </h2>
          </div>
        </div>

        <div className="about-grid">
          <div className="about-copy">
            {about.paragraphs.map((p, i) => (
              <Reveal as="p" key={i} delay={i * 0.08} className="about-p">
                {p}
              </Reveal>
            ))}
          </div>

          <Reveal className="about-card glass" delay={0.1}>
            <div className="about-card-head">
              <span className="about-card-mark">∞</span>
              <div>
                <div className="about-card-name">{profile.name}</div>
                <div className="about-card-loc">{profile.location}</div>
              </div>
            </div>
            <div className="about-stats">
              {liveStats.map((s) => (
                <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
              ))}
            </div>

            <div className="about-leetcode">
              <div className="leetcode-title">
                <span>DSA Console (LeetCode)</span>
                <span
                  className={`leetcode-status ${isLive ? 'is-live' : 'is-cached'}`}
                  title={isLive ? 'Live from API' : 'Cached snapshot (API unreachable)'}
                >
                  <span className="leetcode-status-dot" />
                  {isLive ? 'LIVE' : 'CACHED'}
                </span>
              </div>

              <div className="leetcode-overview">
                <div
                  className="leetcode-ring"
                  style={{ background: ringGradient }}
                  role="img"
                  aria-label={`${lcData.totalSolved} problems solved: ${lcData.easySolved} easy, ${lcData.mediumSolved} medium, ${lcData.hardSolved} hard`}
                >
                  <div className="leetcode-ring-core">
                    <span className="leetcode-ring-num">{lcData.totalSolved}</span>
                    <span className="leetcode-ring-cap">solved</span>
                  </div>
                </div>
                <div className="leetcode-bars">
                  {bars.map((b, i) => {
                    const pct = Math.min(100, (b.solved / b.total) * 100);
                    return (
                      <div className="leetcode-bar-item" key={b.key}>
                        <div className="leetcode-bar-info">
                          <span><i className={`leetcode-dot ${b.key}`} />{b.label}</span>
                          <span>{b.solved} <em>/ {b.total}</em></span>
                        </div>
                        <div className="leetcode-progress-track">
                          <div
                            className={`leetcode-progress-bar ${b.key}`}
                            style={{ width: mounted ? `${pct.toFixed(1)}%` : '0%', transitionDelay: `${0.15 + i * 0.12}s` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="leetcode-meta-stats">
                <div className="leetcode-meta-chip"><b>#{lcData.ranking}</b> Global Rank</div>
                <div className="leetcode-meta-chip"><b>{lcData.contributionPoint}</b> Contribution</div>
                <div className="leetcode-meta-chip"><b>{lcData.reputation}</b> Reputation</div>
                <div className="leetcode-meta-chip"><b>{lcData.streak}</b> Day Streak</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
