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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
