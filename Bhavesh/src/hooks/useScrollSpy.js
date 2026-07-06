import { useEffect, useState } from 'react';

export default function useScrollSpy(ids) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return undefined;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      
      // Check if we are at the very bottom of the page (with 50px threshold)
      const isAtBottom = scrollPosition + windowHeight >= scrollHeight - 50;

      if (isAtBottom) {
        // At the bottom, find the section that is visible and closest to the header offset (80px)
        let bestId = '';
        let minDiff = Infinity;
        
        sections.forEach((s) => {
          const rect = s.getBoundingClientRect();
          const isVisible = rect.top < windowHeight && rect.bottom > 80;
          if (isVisible) {
            const diff = Math.abs(rect.top - 80);
            if (diff < minDiff) {
              minDiff = diff;
              bestId = s.id;
            }
          }
        });
        
        if (bestId) {
          setActive(bestId);
          return;
        }
      }

      // Normal scroll behavior: find the section that spans across the header line (85px)
      let activeSectionId = '';
      
      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top <= 85 && rect.bottom > 85) {
          activeSectionId = sections[i].id;
          break;
        }
      }
      
      if (activeSectionId) {
        setActive(activeSectionId);
      }
    };

    // Run once on mount and bind listeners
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [ids.join(',')]);

  return active;
}
