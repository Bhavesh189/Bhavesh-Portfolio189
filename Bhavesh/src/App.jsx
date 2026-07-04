import { useEffect, useState, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import useReducedMotion from './hooks/useReducedMotion';
import useSmoothScroll from './hooks/useSmoothScroll';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Journey from './components/Journey';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import { ToastProvider } from './components/Toast';
import Cursor from './components/Cursor';

// Lazy load non-critical and heavy components
const DevModsPanel = lazy(() => import('./components/DevModsPanel'));
const ArcadeGame = lazy(() => import('./components/ArcadeGame'));
const BhaveshAI = lazy(() => import('./components/BhaveshAI'));
const LiquidCursor = lazy(() => import('./components/LiquidCursor'));
const BookingSystem = lazy(() => import('./components/BookingSystem'));

export default function App() {
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(true); // Default to true on initial render for fast paint

  useSmoothScroll(!loading && !reducedMotion);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
        (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) ||
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0)
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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

      <Suspense fallback={null}>
        <DevModsPanel />
        <ArcadeGame />
        <BhaveshAI />
      </Suspense>

      {!isMobile && (
        <>
          <Suspense fallback={null}>
            <LiquidCursor />
          </Suspense>
          <Cursor />
        </>
      )}
      <Navbar />

      <main>
        <Hero reducedMotion={reducedMotion} isMobile={isMobile} />
        <About />
        <Skills isMobile={isMobile} />
        <Journey />
        <Projects />
        <Certifications />
        <Suspense fallback={null}>
          <BookingSystem isMobile={isMobile} />
        </Suspense>
        <Contact />
      </main>
    </ToastProvider>
  );
}
