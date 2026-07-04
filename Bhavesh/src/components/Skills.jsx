import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skills, techMarquee } from '../data/content';
import Reveal from './Reveal';
import Marquee from './Marquee';
import KineticHeader from './KineticHeader';
import GlitchText from './GlitchText';
import './Skills.css';

const SkillsWebGLBg = lazy(() => import('./SkillsWebGLBg'));

export default function Skills({ isMobile = false }) {
  const containerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    const checkPerformance = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return true;

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
          if (/Mali|Adreno|Intel HD|HD Graphics|PowerVR/i.test(renderer)) {
            return true;
          }
        }
        return false;
      } catch (err) {
        return true;
      }
    };
    setIsLowEnd(checkPerformance());
  }, []);

  return (
    <section id="skills" className="section skills">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">skills</span>
            <h2 className="section-title" style={{ display: 'none' }}>
              Bhavesh Skill's
            </h2>
            <KineticHeader text="Bhavesh Skill's" />
          </div>
          <p className="section-lead muted">
            Engineered for high concurrency, fault tolerance, and distributed resilience. Explore the nodes of my technical ecosystem below.
          </p>
        </div>

        <motion.div
          ref={containerRef}
          className="matrix-layout glass"
          animate={{ rotateX: tilt.y, rotateY: tilt.x }}
          transition={{ type: 'spring', stiffness: 220, damping: 25 }}
          style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
        >
          {/* WebGL background simulation */}
          {!isLowEnd && !isMobile && (
            <Suspense fallback={null}>
              <SkillsWebGLBg onTiltChange={setTilt} containerRef={containerRef} />
            </Suspense>
          )}

          {/* Grid content */}
          <div className="matrix-grid-content" style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }}>
            
            <div className="matrix-categories">
              {skills.map((skill, index) => (
                <button
                  key={skill.group}
                  className={`matrix-cat-btn ${activeCategory === index ? 'is-active' : ''}`}
                  onMouseEnter={() => {
                    setActiveCategory(index);
                  }}
                  onClick={() => setActiveCategory(index)}
                >
                  <span className="matrix-cat-num">0{index + 1}</span>
                  <span className="matrix-cat-name">{skill.group}</span>
                  {activeCategory === index && (
                    <motion.div className="active-glow-bar" layoutId="glowBar" />
                  )}
                </button>
              ))}
            </div>

            {}
            <div className="matrix-details" style={{ transform: 'translateZ(30px)' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="matrix-exploded-view"
                >
                  <span className="matrix-detail-badge">RESILIENT SYSTEMS</span>
                  <h3 className="matrix-detail-title">
                    <GlitchText text={`${skills[activeCategory].group} Stack`} />
                  </h3>
                  
                  <div className="matrix-neural-nodes">
                    {skills[activeCategory].items.map((item, idx) => (
                      <motion.div
                        key={item}
                        className="matrix-node-chip glass"
                        initial={{ opacity: 0, scale: 0.8, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                        whileHover={{
                          scale: 1.08,
                          borderColor: 'rgba(41, 211, 238, 0.5)',
                          boxShadow: '0 0 15px rgba(41, 211, 238, 0.25)',
                          color: '#fff'
                        }}
                      >
                        <span className="chip-indicator" />
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </motion.div>
      </div>

      <div className="skills-marquee">
        <Marquee items={techMarquee} speed={36} />
      </div>
    </section>
  );
}
