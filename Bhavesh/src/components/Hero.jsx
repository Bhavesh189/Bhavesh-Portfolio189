import { useEffect, useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowDownRight, FiGithub, FiLinkedin, FiCode, FiGlobe } from 'react-icons/fi';
import { profile, socials } from '../data/content';
import { scrollToSection } from '../hooks/useSmoothScroll';
import Magnetic from './Magnetic';
import './Hero.css';

const InfinityScene = lazy(() => import('./InfinityScene'));

const ICONS = { github: FiGithub, linkedin: FiLinkedin, code: FiCode, globe: FiGlobe };

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const line = {
  hidden: { opacity: 0, y: 42 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

function RotatingRole({ roles }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % roles.length), 2400);
    return () => clearInterval(id);
  }, [roles.length]);
  return (
    <span className="hero-role">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-110%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero({ reducedMotion = false, isMobile = false }) {
  const [showScene, setShowScene] = useState(false);
  const words = profile.heroLine.split(' ');
  const head = words.slice(0, -2).join(' ');
  const tail = words.slice(-2).join(' ');

  useEffect(() => {
    if (isMobile || reducedMotion || showScene) return undefined;

    const reveal = () => setShowScene(true);
    const timeout = window.setTimeout(reveal, 9000);

    window.addEventListener('pointermove', reveal, { once: true, passive: true });
    window.addEventListener('scroll', reveal, { once: true, passive: true });
    window.addEventListener('keydown', reveal, { once: true });

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('pointermove', reveal);
      window.removeEventListener('scroll', reveal);
      window.removeEventListener('keydown', reveal);
    };
  }, [isMobile, reducedMotion, showScene]);

  return (
    <section id="top" className="hero">
      {showScene && (
        <Suspense fallback={null}>
          <InfinityScene reducedMotion={reducedMotion} />
        </Suspense>
      )}
      <div className="hero-veil" />

      <div className="container hero-inner">
        <motion.div variants={container} initial="hidden" animate="show" className="hero-content">
          <motion.p variants={line} className="hero-eyebrow">
            <span className="hero-dot" />
            {profile.availability}
          </motion.p>

          <motion.h1 variants={line} className="hero-name">
            {profile.name}
          </motion.h1>

          <motion.h2 variants={line} className="hero-line">
            {head} <span className="grad-text">{tail}</span>
          </motion.h2>

          <motion.div variants={line} className="hero-rolewrap">
            <span className="hero-rolelabel">I specialize in</span>
            <RotatingRole roles={profile.roles} />
          </motion.div>

          <motion.p variants={line} className="hero-sub">
            {profile.heroSub}
          </motion.p>

          <motion.div variants={line} className="hero-actions">
            <Magnetic>
              <button className="btn" onClick={() => scrollToSection('work')}>
                View my work <FiArrowDownRight />
              </button>
            </Magnetic>
            <Magnetic>
              <button className="btn btn-ghost" onClick={() => scrollToSection('contact')}>
                Get in touch
              </button>
            </Magnetic>
          </motion.div>

          <motion.ul variants={line} className="hero-socials">
            {socials.map((s) => {
              const Icon = ICONS[s.icon] || FiGlobe;
              return (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" data-cursor>
                    <Icon />
                    <span>{s.label}</span>
                  </a>
                </li>
              );
            })}
          </motion.ul>
        </motion.div>
      </div>

      <button className="hero-scroll" onClick={() => scrollToSection('about')} aria-label="Scroll down">
        <span>scroll</span>
        <span className="hero-scroll-line" />
      </button>
    </section>
  );
}
