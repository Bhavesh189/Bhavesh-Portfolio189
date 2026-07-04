import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { projects } from '../data/content';
import Reveal from './Reveal';
import GlitchText from './GlitchText';
import './Projects.css';

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 150, damping: 15 });
  const glowX = useTransform(mx, [0, 1], ['0%', '100%']);
  const glowY = useTransform(my, [0, 1], ['0%', '100%']);


  const shineBg = useTransform(
    [mx, my],
    ([xVal, yVal]) => `radial-gradient(circle at ${xVal * 100}% ${yVal * 100}%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 50%),
                       linear-gradient(${135 + xVal * 20}deg, rgba(255, 0, 128, 0.12) 0%, rgba(0, 255, 230, 0.12) 40%, rgba(255, 230, 0, 0.12) 80%)`
  );

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <Reveal className="proj-reveal" delay={index * 0.06}>
      <motion.a
        ref={ref}
        className={`proj-card glass accent-${project.accent}`}
        href={project.live}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        data-cursor
      >
        <motion.span
          className="proj-glow"
          style={{ left: glowX, top: glowY }}
          aria-hidden="true"
        />
        <motion.span
          className="proj-sheen"
          style={{ background: shineBg }}
          aria-hidden="true"
        />
        <div className="proj-top">
          <span className="proj-year">{project.year}</span>
          <span className="proj-arrow">
            <FiArrowUpRight />
          </span>
        </div>
        <h3 className="proj-name">
          <GlitchText text={project.name} />
        </h3>
        <p className="proj-blurb">{project.blurb}</p>
        <p className="proj-detail">{project.detail}</p>
        <div className="proj-tags">
          {project.tags.map((t) => (
            <span className="chip" key={t}>
              {t}
            </span>
          ))}
        </div>
      </motion.a>
    </Reveal>
  );
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');


  const FILTERS = ['All', 'React', 'Node.js', 'REST APIs', 'Docker', 'JavaScript'];

  const filteredProjects = projects.filter((project) => {
    const matchesFilter =
      activeFilter === 'All' || project.tags.includes(activeFilter);
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.blurb.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="work" className="section projects">
      <div className="container">
        
        <div className="section-head-split">
          <div className="section-head">
            <div>
              <span className="eyebrow">work</span>
              <h2 className="section-title">
                Selected <span className="grad-text">projects</span>
              </h2>
            </div>
            <p className="section-lead muted">Things I&rsquo;ve shipped — each with a measurable dent.</p>
          </div>

          <div className="proj-search-bar-wrapper">
            <input
              type="text"
              placeholder="Search tech or projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="proj-search-input glass"
              aria-label="Search projects by technology or name"
            />
          </div>
        </div>

        {}
        <div className="proj-filters-bar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`proj-filter-btn glass ${activeFilter === f ? 'is-active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>

        {}
        <div className="proj-grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                key={project.name}
                style={{ display: 'flex' }}
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="proj-empty text-center muted"
          >
            No matching projects found. Try resetting the filters.
          </motion.div>
        )}

      </div>
    </section>
  );
}
