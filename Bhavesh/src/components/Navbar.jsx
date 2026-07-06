import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { FiHome, FiUser, FiFolder, FiAward, FiMessageSquare, FiCpu, FiMessageCircle } from 'react-icons/fi';
import { nav, profile } from '../data/content';
import { scrollToSection } from '../hooks/useSmoothScroll';
import useScrollSpy from '../hooks/useScrollSpy';
import Magnetic from './Magnetic';
import './Navbar.css';

const MOBILE_NAV = [
  { id: 'top', label: 'Home', icon: <FiHome /> },
  { id: 'about', label: 'About', icon: <FiUser /> },
  { id: 'work', label: 'Work', icon: <FiFolder /> },
  { id: 'certs', label: 'Certs', icon: <FiAward /> },
  { id: 'contact', label: 'Contact', icon: <FiMessageSquare /> },
];

const SPY_IDS = nav.map((n) => n.id);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const active = useScrollSpy(SPY_IDS);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 860);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const getActiveTab = () => {
    if (active === 'skills' || active === 'journey') {
      return 'about';
    }
    return active;
  };
  const activeTab = getActiveTab();

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

          {isMobile && (
            <div className="nav-mobile-tools">
              <button
                className="nav-mobile-tool-btn"
                onClick={() => window.dispatchEvent(new CustomEvent('open-bhavesh-arcade'))}
                aria-label="Play Arcade Game"
              >
                <FiCpu />
              </button>
              <button
                className="nav-mobile-tool-btn"
                onClick={() => window.dispatchEvent(new CustomEvent('open-bhavesh-ai'))}
                aria-label="Talk to AI Chatbot"
              >
                <FiMessageCircle />
                <span className="nav-tool-pulse" />
              </button>
            </div>
          )}

          <nav className="nav-links" aria-label="Primary">
            {nav.map((item) => (
              <Magnetic key={item.id} strength={0.2}>
                <button
                  className={`nav-link ${active === item.id ? 'is-active' : ''}`}
                  onClick={() => go(item.id)}
                >
                  {item.label}
                </button>
              </Magnetic>
            ))}
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
            {nav.map((item, i) => (
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
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Mobile Bottom Tab Bar */}
      {isMobile && (
        <div className="mobile-bottom-nav">
          <div className="mobile-bottom-nav-inner glass">
            {MOBILE_NAV.map((item) => (
              <button
                key={item.id}
                className={`mobile-bottom-tab ${activeTab === item.id ? 'is-active' : ''}`}
                onClick={() => go(item.id)}
                aria-label={`Go to ${item.label}`}
              >
                <span className="mobile-tab-icon">{item.icon}</span>
                <span className="mobile-tab-label">{item.label}</span>
                {activeTab === item.id && (
                  <motion.span
                    layoutId="activeTabBubble"
                    className="active-tab-bubble"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
