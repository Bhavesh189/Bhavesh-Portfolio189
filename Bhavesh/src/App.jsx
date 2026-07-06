import { useEffect, useState, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import useReducedMotion from './hooks/useReducedMotion';
import useSmoothScroll from './hooks/useSmoothScroll';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { ToastProvider } from './components/Toast';
import LazySection from './components/LazySection';
import FloatingTools from './components/FloatingTools';

const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Journey = lazy(() => import('./components/Journey'));
const Projects = lazy(() => import('./components/Projects'));
const Certifications = lazy(() => import('./components/Certifications'));
const Resume = lazy(() => import('./components/Resume'));
const Contact = lazy(() => import('./components/Contact'));
const LiquidCursor = lazy(() => import('./components/LiquidCursor'));
const BookingSystem = lazy(() => import('./components/BookingSystem'));
const Cursor = lazy(() => import('./components/Cursor'));

export default function App() {
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const [interactiveVisuals, setInteractiveVisuals] = useState(false);

  useSmoothScroll(!loading && !reducedMotion && !isMobile);
  useKeyboardShortcuts();

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

  useEffect(() => {
    if (isMobile || reducedMotion || interactiveVisuals) return undefined;

    const enable = () => setInteractiveVisuals(true);
    const timeout = window.setTimeout(enable, 9000);

    window.addEventListener('pointermove', enable, { once: true, passive: true });
    window.addEventListener('scroll', enable, { once: true, passive: true });
    window.addEventListener('keydown', enable, { once: true });

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('pointermove', enable);
      window.removeEventListener('scroll', enable);
      window.removeEventListener('keydown', enable);
    };
  }, [interactiveVisuals, isMobile, reducedMotion]);

  return (
    <ToastProvider>
      <div className="atmosphere" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <AnimatePresence>
        {loading && !reducedMotion && (
          <Preloader key="preloader" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      <FloatingTools />

      {!isMobile && interactiveVisuals && (
        <>
          <Suspense fallback={null}>
            <LiquidCursor />
            <Cursor />
          </Suspense>
        </>
      )}
      <Navbar />

      <main>
        <Hero reducedMotion={reducedMotion} isMobile={isMobile} />
        <LazySection id="about">
          <About />
        </LazySection>
        <LazySection id="skills">
          <Skills isMobile={isMobile} />
        </LazySection>
        <LazySection id="journey">
          <Journey />
        </LazySection>
        <LazySection id="work">
          <Projects />
        </LazySection>
        <LazySection id="certs">
          <Certifications />
        </LazySection>
        <LazySection id="booking">
          <BookingSystem isMobile={isMobile} />
        </LazySection>
        <LazySection id="resume">
          <Resume />
        </LazySection>
        <LazySection id="contact">
          <Contact />
        </LazySection>
      </main>
    </ToastProvider>
  );
}
