import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiExternalLink, FiRefreshCw, FiLoader } from 'react-icons/fi';
import { projects } from '../data/content';
import { navigate } from '../hooks/useRouting';
import './ProjectViewer.css';

export default function ProjectViewer({ projectId }) {
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef(null);

  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    setLoading(true);
  }, [projectId]);

  if (!project) {
    return (
      <div className="pv-container error-state">
        <div className="pv-error-card glass animate-fade-in">
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Project Not Found</h2>
          <p className="muted" style={{ marginBottom: '20px' }}>The project you are looking for does not exist or has been moved.</p>
          <button 
            className="pv-back-btn" 
            onClick={() => navigate('/')}
            style={{ width: 'fit-content', margin: '0 auto' }}
          >
            <FiArrowLeft /> Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    if (iframeRef.current) {
      setLoading(true);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className={`pv-container accent-${project.accent || 'violet'}`}>
      <header className="pv-header glass">
        <div className="pv-header-left">
          <button className="pv-back-btn" onClick={() => navigate('/')} data-cursor>
            <FiArrowLeft className="back-arrow" />
            <span>Back</span>
          </button>
          <div className="pv-divider" />
          <div className="pv-info">
            <h1 className="pv-title">
              {project.name}
              <span className="pv-year">{project.year}</span>
            </h1>
            <p className="pv-blurb muted">{project.blurb}</p>
          </div>
        </div>

        <div className="pv-header-right">
          <div className="pv-tags hide-mobile">
            {project.tags.map((t) => (
              <span className="chip" key={t}>
                {t}
              </span>
            ))}
          </div>
          <button className="pv-action-btn" onClick={handleRefresh} title="Reload Frame" data-cursor>
            <FiRefreshCw />
          </button>
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="pv-action-btn primary"
            title="Open Standalone Website"
            data-cursor
          >
            <span>Open Live</span>
            <FiExternalLink />
          </a>
        </div>
      </header>

      <div className="pv-iframe-wrapper">
        {loading && (
          <div className="pv-loader-overlay">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="pv-loader"
            >
              <FiLoader size={40} />
            </motion.div>
            <p className="muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>Loading Live Experience...</p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={project.live}
          title={project.name}
          className="pv-iframe"
          onLoad={() => setLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
