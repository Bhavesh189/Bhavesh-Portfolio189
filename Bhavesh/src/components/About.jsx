import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { about, stats, profile } from '../data/content';
import Reveal from './Reveal';
import './About.css';

function StatCounter({ value, suffix, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const [display, setDisplay] = useState(value.includes('.') ? '0.00' : '0');

  useEffect(() => {
    if (!inView) return undefined;
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
  }, [inView, value]);

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

export default function About() {
  const [lcData, setLcData] = useState({
    ranking: '387,014',
    totalSolved: 346,
    totalQuestions: 3985,
    easySolved: 137,
    totalEasy: 953,
    mediumSolved: 180,
    totalMedium: 2081,
    hardSolved: 29,
    totalHard: 951,
    streak: 222,
    rating: 1612,
    badge: '100 Days Badge 2026',
    solutions: 74,
    reputation: 408,
    views: '4.2K'
  });

  useEffect(() => {
    let active = true;
    const fetchLeetCode = async () => {
      try {
        const [profileRes, contestRes] = await Promise.all([
          fetch('https://leetcode-api-pied.vercel.app/user/bhavesh1899287'),
          fetch('https://leetcode-api-pied.vercel.app/user/bhavesh1899287/contests')
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (active && profileData && profileData.submitStats) {
            const ac = profileData.submitStats.acSubmissionNum || [];
            const easy = ac.find(x => x.difficulty === 'Easy')?.count || 137;
            const medium = ac.find(x => x.difficulty === 'Medium')?.count || 180;
            const hard = ac.find(x => x.difficulty === 'Hard')?.count || 29;
            const all = ac.find(x => x.difficulty === 'All')?.count || 346;

            setLcData(prev => ({
              ...prev,
              ranking: profileData.profile?.ranking?.toLocaleString() || prev.ranking,
              totalSolved: all,
              easySolved: easy,
              mediumSolved: medium,
              hardSolved: hard,
              reputation: profileData.profile?.reputation || prev.reputation,
              solutions: profileData.profile?.solutionCount || prev.solutions,
              views: profileData.profile?.postViewCount ? `${(profileData.profile.postViewCount / 1000).toFixed(1)}K` : prev.views,
            }));
          }
        }

        if (contestRes.ok) {
          const contestData = await contestRes.json();
          if (active && contestData && contestData.userContestRanking) {
            setLcData(prev => ({
              ...prev,
              rating: Math.round(contestData.userContestRanking.rating) || prev.rating,
            }));
          }
        }
      } catch (err) {
        // Fallback silently handles it
      }
    };
    fetchLeetCode();
    return () => { active = false; };
  }, []);

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
              {stats.map((s) => (
                <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
              ))}
            </div>

            <div className="about-leetcode">
              <div className="leetcode-title">
                <span>DSA Console (LeetCode)</span>
                <span className="leetcode-rating">Knight {lcData.rating}</span>
              </div>
              <div className="leetcode-bars">
                <div className="leetcode-bar-item">
                  <div className="leetcode-bar-info">
                    <span>Easy</span>
                    <span>{lcData.easySolved} / {lcData.totalEasy}</span>
                  </div>
                  <div className="leetcode-progress-track">
                    <div className="leetcode-progress-bar easy" style={{ width: `${(lcData.easySolved / lcData.totalEasy * 100).toFixed(1)}%` }}></div>
                  </div>
                </div>
                <div className="leetcode-bar-item">
                  <div className="leetcode-bar-info">
                    <span>Medium</span>
                    <span>{lcData.mediumSolved} / {lcData.totalMedium}</span>
                  </div>
                  <div className="leetcode-progress-track">
                    <div className="leetcode-progress-bar medium" style={{ width: `${(lcData.mediumSolved / lcData.totalMedium * 100).toFixed(1)}%` }}></div>
                  </div>
                </div>
                <div className="leetcode-bar-item">
                  <div className="leetcode-bar-info">
                    <span>Hard</span>
                    <span>{lcData.hardSolved} / {lcData.totalHard}</span>
                  </div>
                  <div className="leetcode-progress-track">
                    <div className="leetcode-progress-bar hard" style={{ width: `${(lcData.hardSolved / lcData.totalHard * 100).toFixed(1)}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="leetcode-meta-stats">
                <div className="leetcode-meta-chip">{lcData.streak} Days Streak</div>
                <div className="leetcode-meta-chip">Rank: #{lcData.ranking}</div>
                <div className="leetcode-meta-chip">Solutions: {lcData.solutions}</div>
                <div className="leetcode-meta-chip">Post Views: {lcData.views}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
