import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';
import { scrollToSection } from '../hooks/useSmoothScroll';
import './BackToTop.css';

export default function BackToTop() {
  const [show, setShow] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 720);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          className="backtotop"
          onClick={() => scrollToSection('top')}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg viewBox="0 0 60 60" className="backtotop-ring" aria-hidden="true">
            <circle cx="30" cy="30" r="26" className="backtotop-track" />
            <motion.circle
              cx="30"
              cy="30"
              r="26"
              className="backtotop-fill"
              style={{ pathLength: progress }}
            />
          </svg>
          <FiArrowUp />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
