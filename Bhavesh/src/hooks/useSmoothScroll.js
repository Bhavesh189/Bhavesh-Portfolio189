import { useEffect } from 'react';

let lenisInstance = null;

export function scrollToSection(id) {
  if (id === 'top' || id === '#top') {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { duration: 1.25 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }
  const selector = id.startsWith('#') ? id : `#${id}`;
  const el = document.querySelector(selector);
  if (!el) return;
  if (lenisInstance) {
    const isMobile = window.innerWidth <= 860;
    const offsetValue = isMobile ? -12 : 45;
    lenisInstance.scrollTo(el, { offset: offsetValue, duration: 1.25 });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}



export default function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;

    let cancelled = false;
    let cleanup = null;
    let started = false;

    const removeStarters = () => {
      window.removeEventListener('wheel', start);
      window.removeEventListener('keydown', start);
      window.removeEventListener('touchmove', start);
    };

    async function start() {
      if (started) return;
      started = true;
      removeStarters();

      const [{ default: Lenis }, gsapModule, triggerModule] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (cancelled) return;

      const gsap = gsapModule.gsap;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      });
      lenisInstance = lenis;

      lenis.on('scroll', ScrollTrigger.update);

      const onTick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(onTick);
        lenis.destroy();
        lenisInstance = null;
      };
    }

    window.addEventListener('wheel', start, { once: true, passive: true });
    window.addEventListener('touchmove', start, { once: true, passive: true });
    window.addEventListener('keydown', start, { once: true });

    return () => {
      cancelled = true;
      removeStarters();
      if (cleanup) cleanup();
    };
  }, [enabled]);
}
