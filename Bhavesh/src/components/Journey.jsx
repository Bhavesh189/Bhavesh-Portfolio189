import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { journey } from '../data/content';
import Reveal from './Reveal';
import './Journey.css';

gsap.registerPlugin(ScrollTrigger);

export default function Journey() {
  const wrapRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const fill = fillRef.current;
    if (!wrap || !fill) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top 68%',
            end: 'bottom 82%',
            scrub: true,
          },
        }
      );
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section id="journey" className="section journey">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">journey</span>
            <h2 className="section-title">
              Experience &amp; <span className="grad-text">education</span>
            </h2>
          </div>
        </div>

        <div className="timeline" ref={wrapRef}>
          <span className="timeline-line">
            <span className="timeline-fill" ref={fillRef} />
          </span>

          {journey.map((item, i) => (
            <Reveal className="tl-item" key={i} delay={0.05}>
              <div className="tl-node">
                <span />
              </div>
              <div className="tl-card glass">
                <span className={`tl-kind tl-kind-${item.kind}`}>
                  {item.kind === 'work' ? 'Work' : 'Education'}
                </span>
                <h3 className="tl-role">{item.role}</h3>
                <div className="tl-org">{item.org}</div>
                <div className="tl-meta">{item.meta}</div>
                <ul className="tl-points">
                  {item.points.map((p, j) => (
                    <li key={j}>{p}</li>
                  ))}
                </ul>
                <div className="tl-tags">
                  {item.tags.map((t) => (
                    <span className="chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
