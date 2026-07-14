import { useState, useEffect } from 'react';

const NAV_EVENT = 'app-navigate';

export function navigate(to) {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new CustomEvent(NAV_EVENT, { detail: { to } }));
}

export default function useRouting() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    const handleNavigate = (e) => {
      setCurrentPath(e.detail.to);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener(NAV_EVENT, handleNavigate);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener(NAV_EVENT, handleNavigate);
    };
  }, []);

  return currentPath;
}
