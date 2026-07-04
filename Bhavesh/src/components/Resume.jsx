import { FiDownload, FiExternalLink, FiFileText, FiCheckCircle } from 'react-icons/fi';
import resumeUrl from '../assets/Bhavesh.pdf';
import resumePreview from '../assets/resume-preview.png';
import { useToast } from './Toast';
import Reveal from './Reveal';
import Magnetic from './Magnetic';
import './Resume.css';

const updated = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' });

const facts = [
  'ATS-friendly, single page',
  'Selectable text & live links',
  'Looks sharp on every device',
];

export default function Resume() {
  const toast = useToast();

  return (
    <section id="resume" className="section resume">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">resume</span>
            <h2 className="section-title">
              Grab my <span className="grad-text">résumé</span>
            </h2>
          </div>
          <p className="section-lead muted">
            One page, always current. Preview it inline or take the PDF with you.
          </p>
        </div>

        <div className="resume-grid">
          <Reveal className="resume-preview-wrap">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="resume-preview-link"
              data-cursor
            >
              <img
                src={resumePreview}
                alt="Preview of Bhavesh Sharma's résumé"
                loading="lazy"
                width="820"
                height="1159"
              />
              <span className="resume-preview-badge">
                <FiExternalLink /> Open full PDF
              </span>
            </a>
          </Reveal>

          <Reveal className="resume-card glass" delay={0.1}>
            <span className="resume-icon">
              <FiFileText />
            </span>
            <h3 className="resume-card-title">Bhavesh Sharma — Résumé</h3>
            <p className="resume-card-meta">PDF · 1 page · updated {updated}</p>

            <ul className="resume-facts">
              {facts.map((f) => (
                <li key={f}>
                  <FiCheckCircle /> {f}
                </li>
              ))}
            </ul>

            <div className="resume-buttons">
              <Magnetic>
                <a
                  className="btn"
                  href={resumeUrl}
                  download="Bhavesh-Sharma-Resume.pdf"
                  onClick={() => toast('Downloading résumé… ∞', 'success')}
                >
                  <FiDownload /> Download CV
                </a>
              </Magnetic>
              <a className="btn btn-ghost" href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <FiExternalLink /> Open in new tab
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
