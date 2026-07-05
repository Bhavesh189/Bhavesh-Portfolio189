import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './Toast';
import './GameSystem.css';

const LEVELS = [
  { name: 'Script Kiddie ', minXp: 0, maxXp: 100 },
  { name: 'Tech Enthusiast ', minXp: 100, maxXp: 220 },
  { name: 'Stack Overflow Senior ', minXp: 220, maxXp: 360 },
  { name: 'MERN Apprentice ', minXp: 360, maxXp: 520 },
  { name: 'Matrix Architect ', minXp: 520, maxXp: 99999 },
];

export default function GameSystem() {
  const toast = useToast();
  const [xp, setXp] = useState(0);
  const [levelIdx, setLevelIdx] = useState(0);
  const [prevLevelIdx, setPrevLevelIdx] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);


  const triggered = useRef(new Set());


  useEffect(() => {
    try {
      const savedXp = parseInt(localStorage.getItem('hacker-xp') || '0', 10);
      setXp(savedXp);
      
      const savedTriggers = JSON.parse(localStorage.getItem('hacker-achievements') || '[]');
      savedTriggers.forEach(t => triggered.current.add(t));
      

      const idx = LEVELS.findIndex(lvl => savedXp >= lvl.minXp && savedXp < lvl.maxXp);
      setLevelIdx(idx !== -1 ? idx : 0);
      setPrevLevelIdx(idx !== -1 ? idx : 0);
    } catch (e) {

    }
  }, []);


  useEffect(() => {
    const nextIdx = LEVELS.findIndex(lvl => xp >= lvl.minXp && xp < lvl.maxXp);
    if (nextIdx !== -1 && nextIdx !== levelIdx) {
      setLevelIdx(nextIdx);
      if (nextIdx > levelIdx) {
        setShowLevelUp(true);
        toast(` Level Up! You are now a ${LEVELS[nextIdx].name}`, 'success');
        setTimeout(() => setShowLevelUp(false), 4500);
      }
    }
    try {
      localStorage.setItem('hacker-xp', xp.toString());
      localStorage.setItem('hacker-achievements', JSON.stringify(Array.from(triggered.current)));
    } catch (e) {

    }
  }, [xp, levelIdx, toast]);


  useEffect(() => {
    window.dispatchEvent(new CustomEvent('level-update', { detail: { level: levelIdx + 1, xp } }));
  }, [levelIdx, xp]);



  const awardXp = (amount, achievementId, achievementText) => {
    if (triggered.current.has(achievementId)) return;
    triggered.current.add(achievementId);
    setXp((prev) => prev + amount);
    if (achievementText) {
      toast(` Achievement: ${achievementText} (+${amount} XP)`, 'info');
    }
  };


  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = (window.scrollY / docHeight) * 100;

      if (pct >= 25) {
        awardXp(20, 'scroll-25', 'Explorer Apprentice (Scrolled 25%)');
      }
      if (pct >= 50) {
        awardXp(25, 'scroll-50', 'Stalker Level 1 (Scrolled 50%)');
      }
      if (pct >= 85) {
        awardXp(30, 'scroll-85', 'Stalker Level 2 (Scrolled 85%)');
      }
      if (pct >= 99) {
        awardXp(40, 'scroll-100', 'Website Inspector (Full Scroll Completed)');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toast]);


  useEffect(() => {
    const handleCustomXp = (e) => {
      const { amount, id, text } = e.detail;
      awardXp(amount, id, text);
    };

    window.addEventListener('portfolio-xp', handleCustomXp);
    return () => window.removeEventListener('portfolio-xp', handleCustomXp);
  }, [toast]);


  useEffect(() => {
    const handleClick = (e) => {

      const card = e.target.closest('.project-card, [data-project]');
      if (card) {
        const pName = card.dataset.project || card.querySelector('h3')?.innerText || 'Unknown';
        awardXp(15, `click-project-${pName.toLowerCase()}`, `Reviewed Project: ${pName}`);
      }
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [toast]);


  const currentLvl = LEVELS[levelIdx];
  const nextLvl = LEVELS[levelIdx + 1] || { minXp: currentLvl.minXp + 500, maxXp: currentLvl.maxXp + 500 };
  const lvlProgress = Math.min(
    100,
    Math.max(0, ((xp - currentLvl.minXp) / (nextLvl.minXp - currentLvl.minXp)) * 100)
  );

  return (
    <>
      {}
      <div className="xp-bar-container">
        <div className="xp-bar-meta">
          <span className="lvl-badge">LEVEL {levelIdx + 1}</span>
          <span className="lvl-title">{currentLvl.name}</span>
          <span className="xp-value">{xp} XP</span>
        </div>
        <div className="xp-bar-track">
          <motion.div
            className="xp-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${lvlProgress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="lvl-up-overlay"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="lvl-up-card">
              <span className="glitch-text" data-text="LEVEL UP">LEVEL UP</span>
              <div className="lvl-stars"></div>
              <h2>You have promoted to:</h2>
              <h3>{LEVELS[levelIdx].name}</h3>
              <p>Keep exploring to reveal hidden easter eggs!</p>
              <button className="lvl-up-close" onClick={() => setShowLevelUp(false)}>
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
