import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Preloader.css';

const INFINITY_PATH =
  'M100 50 C100 24 68 24 65 50 C62 76 100 76 100 50 C100 24 132 24 135 50 C138 76 100 76 100 50 Z';


export default function Preloader({ onComplete }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let raf;
    const duration = 1900;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => onComplete && onComplete(), 480);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.7, 0, 0.3, 1] } }}
    >
      <div className="preloader-inner">
        <svg className="preloader-mark" viewBox="0 0 200 100" fill="none">
          <defs>
            <linearGradient id="pg" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--violet)" />
              <stop offset="1" stopColor="var(--cyan)" />
            </linearGradient>
          </defs>
          <motion.path
            d={INFINITY_PATH}
            stroke="url(#pg)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0.15 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </svg>

        <div className="preloader-row">
          <span className="preloader-label">initialising</span>
          <span className="preloader-count">{count}</span>
        </div>

        <div className="preloader-bar">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: count / 100 }}
            transition={{ ease: 'linear', duration: 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
