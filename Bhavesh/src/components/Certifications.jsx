import { FiAward } from 'react-icons/fi';
import { certifications } from '../data/content';
import Reveal from './Reveal';
import './Certifications.css';

export default function Certifications() {
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
            <Reveal className="cert-row glass" key={c.name} delay={i * 0.06}>
              <span className="cert-icon">
                <FiAward />
              </span>
              <div className="cert-main">
                <h3 className="cert-name">{c.name}</h3>
                <span className="cert-issuer">{c.issuer}</span>
              </div>
              <span className="cert-year">{c.year}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
