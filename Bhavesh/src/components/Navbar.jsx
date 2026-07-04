import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { nav, profile } from '../data/content';
import { scrollToSection } from '../hooks/useSmoothScroll';
import useScrollSpy from '../hooks/useScrollSpy';
import resumeUrl from '../assets/Bhavesh.pdf';
import './Navbar.css';

const SPY_IDS = nav.map((n) => n.id);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(SPY_IDS);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    scrollToSection(id);
  };



  return (
    <>
      <motion.header
        className={`nav ${scrolled ? 'is-scrolled' : ''}`}
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="nav-inner container">
          <button className="nav-logo" onClick={() => go('top')} aria-label="Back to top">
            <span className="nav-logo-mark">∞</span>
            <span className="nav-logo-text">{profile.name}</span>
          </button>

          <nav className="nav-links" aria-label="Primary">
            {nav.map((item) => {
              if (item.id === 'resume') {
                return (
                  <a
                    key={item.id}
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link"
                    data-cursor
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <button
                  key={item.id}
                  className={`nav-link ${active === item.id ? 'is-active' : ''}`}
                  onClick={() => go(item.id)}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>



          <button
            className={`nav-burger ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span />
            <span />
          </button>
        </div>

        <motion.div className="nav-progress" style={{ scaleX: progress }} />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-mobile"
            initial={{ opacity: 0, clipPath: 'circle(0% at 92% 5%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 92% 5%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 92% 5%)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {nav.map((item, i) => {
              if (item.id === 'resume') {
                return (
                  <motion.a
                    key={item.id}
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-mobile-link"
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.06 }}
                  >
                    <span className="nav-mobile-idx">0{i + 1}</span>
                    {item.label}
                  </motion.a>
                );
              }
              return (
                <motion.button
                  key={item.id}
                  className="nav-mobile-link"
                  onClick={() => go(item.id)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.06 }}
                >
                  <span className="nav-mobile-idx">0{i + 1}</span>
                  {item.label}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
