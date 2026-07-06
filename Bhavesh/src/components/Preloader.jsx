import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

const INFINITY_PATH =
  'M100 50 C100 24 68 24 65 50 C62 76 100 76 100 50 C100 24 132 24 135 50 C138 76 100 76 100 50 Z';

const WORDS = [
  'Welcome',
  'स्वागत',
  'ようこそ',
  'Привет',
  '欢迎',
  'Infinity'
];

const SCRAMBLE_CHARS = '01011001XX__$$##@@&&%%*+-//<>[]{}';

function ScrambledWord({ text }) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let frame = 0;
    const maxFrames = 6;
    const interval = setInterval(() => {
      if (frame >= maxFrames) {
        setDisplayText(text);
        clearInterval(interval);
      } else {
        const scrambled = text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (Math.random() > 0.45) {
              return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            }
            return text[index];
          })
          .join('');
        setDisplayText(scrambled);
        frame++;
      }
    }, 20);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
}

export default function Preloader({ onComplete }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    let raf;
    const duration = 2100;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => onComplete && onComplete(), 580);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => Math.min(WORDS.length - 1, prev + 1));
    }, 350);
    return () => clearInterval(wordInterval);
  }, []);

  return (
    <motion.div
      className="preloader"
      initial={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
      exit={{ 
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      <div className="preloader-bg-glow" />

      <div className="preloader-inner">
        <svg className="preloader-mark" viewBox="0 0 200 100" fill="none">
          <defs>
            <linearGradient id="pg" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--violet)" />
              <stop offset="1" stopColor="var(--cyan)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <motion.path
            d={INFINITY_PATH}
            stroke="url(#pg)"
            strokeWidth="7"
            strokeLinecap="round"
            filter="url(#glow)"
            opacity="0.45"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.1, ease: 'easeInOut' }}
          />
          <motion.path
            d={INFINITY_PATH}
            stroke="url(#pg)"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.1, ease: 'easeInOut' }}
          />
        </svg>

        <div className="preloader-welcome-wrap">
          <AnimatePresence mode="wait">
            <motion.span
              key={wordIndex}
              className="preloader-welcome-text"
              initial={{ y: 22, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -22, opacity: 0 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              <ScrambledWord text={WORDS[wordIndex]} />
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="preloader-row">
          <span className="preloader-label">system loading</span>
          <span className="preloader-count">{count}</span>
        </div>

        <div className="preloader-bar">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: count / 100 }}
            transition={{ ease: 'linear', duration: 0.08 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
