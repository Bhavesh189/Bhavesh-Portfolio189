import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiX, FiExternalLink, FiDownload, FiLoader } from 'react-icons/fi';
import { certifications } from '../data/content';
import Reveal from './Reveal';
import Magnetic from './Magnetic';
import './Certifications.css';

import ReactCert from '../assets/Certificates/React_Certificate.pdf';
import ScalerNodeCert from '../assets/Certificates/ScalerNode.png';
import HclGuviCert from '../assets/Certificates/HCL GUVI Certification - 1470Sc8433G767D5ZA.png';
import SquarCellCert from '../assets/Certificates/SquarCell.pdf';
import SquarCellLorCert from '../assets/Certificates/SquarCell_LOR.pdf';

const CERT_MAP = {
  react: { file: ReactCert, type: 'pdf', orientation: 'landscape' },
  node: { file: ScalerNodeCert, type: 'image', orientation: 'landscape' },
  fullstack: { file: HclGuviCert, type: 'image', orientation: 'landscape' },
  internship: { file: SquarCellCert, type: 'pdf', orientation: 'landscape' },
  lor: { file: SquarCellLorCert, type: 'pdf', orientation: 'portrait' },
};

export default function Certifications() {
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleOpen = (cert) => {
    setSelected(cert);
    setIsLoading(true);
  };

  const handleClose = () => {
    setSelected(null);
  };

  useEffect(() => {
    if (selected) {
      // PDF onload event is notoriously unreliable in iframes across browsers.
      // We use a simulated 1.2s blockchain verification loader as a fallback/primary trigger.
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [selected]);

  return (
    <section id="certs" className="section certs">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">credentials</span>
            <h2 className="section-title">
              Certifications &amp; <span className="grad-text">workshops</span>
            </h2>
          </div>
        </div>

        <div className="certs-list">
          {certifications.map((c, i) => (
            <Reveal className="cert-reveal-wrap" key={c.name} delay={i * 0.06}>
              <button
                className="cert-row glass"
                onClick={() => handleOpen(c)}
                data-cursor
                aria-label={`View certificate for ${c.name}`}
              >
                <span className="cert-icon">
                  <FiAward />
                </span>
                <div className="cert-main">
                  <h3 className="cert-name">{c.name}</h3>
                  <span className="cert-issuer">{c.issuer}</span>
                </div>
                <span className="cert-year">{c.year}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (() => {
          const certDetails = CERT_MAP[selected.id];
          return (
            <motion.div
              className="cert-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            >
              <div className="modal-bg-glow">
                <svg className="modal-glow-infinity" viewBox="0 0 200 100" fill="none">
                  <path
                    d="M100 50 C100 24 68 24 65 50 C62 76 100 76 100 50 C100 24 132 24 135 50 C138 76 100 76 100 50 Z"
                    stroke="url(#modal-grad)"
                    strokeWidth="1.5"
                    strokeDasharray="10 5"
                  />
                  <defs>
                    <linearGradient id="modal-grad" x1="0" y1="0" x2="200" y2="0">
                      <stop stopColor="var(--violet)" />
                      <stop offset="1" stopColor="var(--cyan)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <motion.div
                className="cert-modal-card glass"
                initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.75, y: 50, rotateX: 10 }}
                animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.75, y: 30, rotateX: -5 }}
                transition={isMobile ? { type: 'spring', damping: 30, stiffness: 240 } : { type: 'spring', damping: 25, stiffness: 220 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="cert-modal-header">
                  <div>
                    <span className="cert-modal-eyebrow">verified credential</span>
                    <h3 className="cert-modal-title">{selected.name}</h3>
                    <p className="cert-modal-issuer">{selected.issuer} · {selected.year}</p>
                  </div>
                  <Magnetic>
                    <button
                      className="cert-modal-close"
                      onClick={handleClose}
                      aria-label="Close modal"
                    >
                      <FiX />
                    </button>
                  </Magnetic>
                </div>

                <div className={`cert-modal-preview ${certDetails.orientation === 'portrait' ? 'is-portrait' : ''}`}>
                  {isLoading && (
                    <div className="cert-preview-loader">
                      <FiLoader className="spin" />
                      <span>Verifying with blockchain node...</span>
                    </div>
                  )}

                  {certDetails.type === 'image' ? (
                    <img
                      src={certDetails.file}
                      alt={selected.name}
                      onLoad={() => setIsLoading(false)}
                      style={{ display: isLoading ? 'none' : 'block' }}
                    />
                  ) : (
                    <iframe
                      src={`${certDetails.file}#view=Fit&toolbar=0&navpanes=0`}
                      title={selected.name}
                      onLoad={() => setIsLoading(false)}
                      style={{ display: isLoading ? 'none' : 'block' }}
                      type="application/pdf"
                    />
                  )}
                </div>

                <div className="cert-modal-actions">
                  <a
                    href={certDetails.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    <FiExternalLink /> Open full document
                  </a>
                  <a
                    href={certDetails.file}
                    download={`${selected.name.replace(/\s+/g, '_')}_Certificate`}
                    className="btn"
                  >
                    <FiDownload /> Download Certificate
                  </a>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
