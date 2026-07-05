import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import './FloatingTools.css';

const ArcadeGame = lazy(() => import('./ArcadeGame'));
const BhaveshAI = lazy(() => import('./BhaveshAI'));

export default function FloatingTools() {
  const [loaded, setLoaded] = useState({ ai: false, arcade: false });
  const [autoOpen, setAutoOpen] = useState({ ai: false, arcade: false });

  const loadTool = useCallback((tool, open = true) => {
    setLoaded((current) => ({ ...current, [tool]: true }));
    if (open) setAutoOpen((current) => ({ ...current, [tool]: true }));
  }, []);

  useEffect(() => {
    const openAI = () => loadTool('ai');
    window.addEventListener('open-bhavesh-ai', openAI);
    return () => {
      window.removeEventListener('open-bhavesh-ai', openAI);
    };
  }, [loadTool]);

  return (
    <>
      {!loaded.arcade && (
        <div className="floating-tool floating-tool-arcade">
          <button
            className="floating-tool-btn"
            type="button"
            onClick={() => loadTool('arcade')}
            aria-label="Play Bug Breaker game"
          >
            <span className="floating-tool-icon">GAME</span>
            <span className="floating-tool-badge">ARCADE</span>
          </button>
        </div>
      )}

      {!loaded.ai && (
        <div className="floating-tool floating-tool-ai">
          <button
            className="floating-tool-btn"
            type="button"
            onClick={() => loadTool('ai')}
            aria-label="Chat with Bhavesh AI"
          >
            <span className="floating-tool-icon">AI</span>
            <span className="floating-tool-pulse" />
          </button>
        </div>
      )}

      <Suspense fallback={null}>
        {loaded.arcade && <ArcadeGame autoOpen={autoOpen.arcade} />}
        {loaded.ai && <BhaveshAI autoOpen={autoOpen.ai} />}
      </Suspense>
    </>
  );
}
