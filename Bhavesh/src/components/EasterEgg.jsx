import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from './Toast';
import './EasterEgg.css';

const CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
];


export default function EasterEgg() {
  const toast = useToast();
  const [burst, setBurst] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === CODE[idx.current]) {
        idx.current += 1;
        if (idx.current === CODE.length) {
          idx.current = 0;
          setBurst(true);
          toast('∞ Infinity mode unlocked!', 'success');
          setTimeout(() => setBurst(false), 2800);
        }
      } else {
        idx.current = key === CODE[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toast]);

  const symbols = Array.from({ length: 30 });

  return (
    <AnimatePresence>
      {burst && (
        <motion.div className="egg" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {symbols.map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            const duration = 1.6 + Math.random() * 1.3;
            const size = 16 + Math.random() * 32;
            return (
              <motion.span
                key={i}
                className="egg-inf"
                style={{ left: `${left}vw`, fontSize: size }}
                initial={{ y: '104vh', opacity: 0, rotate: 0 }}
                animate={{ y: '-24vh', opacity: [0, 1, 1, 0], rotate: 360 }}
                transition={{ duration, delay, ease: 'easeOut' }}
              >
                ∞
              </motion.span>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
