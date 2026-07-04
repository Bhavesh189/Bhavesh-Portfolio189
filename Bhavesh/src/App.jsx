import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import useReducedMotion from './hooks/useReducedMotion';
import useSmoothScroll from './hooks/useSmoothScroll';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Journey from './components/Journey';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import { ToastProvider } from './components/Toast';
import DevModsPanel from './components/DevModsPanel';
import ArcadeGame from './components/ArcadeGame';
import BhaveshAI from './components/BhaveshAI';
import LiquidCursor from './components/LiquidCursor';
import BookingSystem from './components/BookingSystem';

export default function App() {
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);


  useSmoothScroll(!loading && !reducedMotion);


  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);


  useEffect(() => {
    if (reducedMotion) setLoading(false);
  }, [reducedMotion]);

  return (
    <ToastProvider>
      <div className="atmosphere" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <AnimatePresence>
        {loading && !reducedMotion && (
          <Preloader key="preloader" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      <DevModsPanel />
      <ArcadeGame />
      <BhaveshAI />

      <LiquidCursor />
      <Cursor />
      <Navbar />

      <main>
        <Hero reducedMotion={reducedMotion} />
        <About />
        <Skills />
        <Journey />
        <Projects />
        <Certifications />
        <BookingSystem />
        <Contact />
      </main>
    </ToastProvider>
  );
}
