import { useEffect } from 'react';
import { scrollToSection } from './useSmoothScroll';
import { useToast } from '../components/Toast';

export default function useKeyboardShortcuts() {
  const toast = useToast();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in form inputs/textarea
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
        return;
      }

      const key = e.key.toLowerCase();

      const routes = {
        h: 'top',
        t: 'top',
        a: 'about',
        s: 'skills',
        j: 'journey',
        p: 'projects',
        c: 'contact',
      };

      if (key in routes) {
        e.preventDefault();
        scrollToSection(routes[key]);
        toast(`Navigating to ${routes[key].toUpperCase()} (Shortcut: ${key.toUpperCase()})`, 'success');
      }

      if (e.key === 'Escape') {
        // Trigger command palette close or AI chat close if needed
        window.dispatchEvent(new CustomEvent('close-all-panels'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toast]);
}
