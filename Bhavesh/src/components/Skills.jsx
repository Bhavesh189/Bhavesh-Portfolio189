import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { skills, techMarquee } from '../data/content';
import Reveal from './Reveal';
import Marquee from './Marquee';
import KineticHeader from './KineticHeader';
import GlitchText from './GlitchText';
import './Skills.css';


const glassVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const glassFragmentShader = `
  uniform float time;
  uniform vec2 mouse;
  uniform float shatterProgress;
  varying vec2 vUv;

  float noise(vec2 p) {
    return sin(p.x * 10.0 + time) * cos(p.y * 10.0 + time) * 0.5;
  }

  void main() {
    vec2 uv = vUv;
    

    float dist = distance(uv, mouse);
    float n = noise(uv * 3.0 + vec2(time * 0.2));
    

    float distortionStrength = 0.02 + shatterProgress * 0.08;
    uv += vec2(n * distortionStrength) * (1.0 - smoothstep(0.4, 0.0, dist));


    float glow = exp(-dist * 4.0) * (0.8 + shatterProgress * 0.4);
    
    vec3 bgColor = mix(vec3(0.01, 0.01, 0.04), vec3(0.04, 0.03, 0.08), uv.y);
    vec3 glowColor = mix(vec3(0.48, 0.36, 1.0), vec3(0.16, 0.82, 0.93), uv.x);
    vec3 highlight = glowColor * glow;


    float grid = step(0.99, fract(uv.x * 18.0)) + step(0.99, fract(uv.y * 18.0));
    vec3 gridColor = glowColor * grid * 0.04 * (glow + 0.1);

    vec3 finalColor = bgColor + highlight + gridColor;
    

    if (shatterProgress > 0.01) {
      finalColor = mix(finalColor, vec3(1.0), shatterProgress * 0.15);
    }

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;



export default function Skills() {
  const mountRef = useRef(null);
  const containerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(0);
  

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  

  const [isLowEnd, setIsLowEnd] = useState(false);


  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const prevMousePos = useRef({ x: 0.5, y: 0.5, time: Date.now() });
  const cursorVelocity = useRef(0);
  const shatterValue = useRef(0.0);

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

    const hasLowEndGPU = checkPerformance();
    setIsLowEnd(hasLowEndGPU);

    if (hasLowEndGPU) return;

    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight || 550;


    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);


    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      time: { value: 0 },
      mouse: { value: new THREE.Vector2(0.5, 0.5) },
      shatterProgress: { value: 0.0 },
    };
    
    const material = new THREE.ShaderMaterial({
      vertexShader: glassVertexShader,
      fragmentShader: glassFragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);


    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - ((e.clientY - rect.top) / rect.height);
      
      mousePos.current = { x, y };
      uniforms.mouse.value.set(x, y);


      const now = Date.now();
      const dt = (now - prevMousePos.current.time) / 1000.0;
      if (dt > 0.01) {
        const dx = x - prevMousePos.current.x;
        const dy = y - prevMousePos.current.y;
        const speed = Math.sqrt(dx * dx + dy * dy) / dt;
        cursorVelocity.current = speed;

        prevMousePos.current = { x, y, time: now };
      }


      const speedMultiplier = 1.0 + Math.min(2.5, cursorVelocity.current * 0.15);
      const tiltX = ((e.clientX - rect.left) / rect.width - 0.5) * 6 * speedMultiplier;
      const tiltY = ((e.clientY - rect.top) / rect.height - 0.5) * -6 * speedMultiplier;
      
      setTilt({ x: tiltX, y: tiltY });
    };

    const onPointerDown = () => {
      shatterValue.current = 1.0;
    };

    const onPointerLeave = () => {
      setTilt({ x: 0, y: 0 });
    };

    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerdown', onPointerDown);
    mount.addEventListener('pointerleave', onPointerLeave);

    const clock = new THREE.Clock();
    let raf;

    const loop = () => {
      uniforms.time.value = clock.getElapsedTime() * 0.45;


      shatterValue.current += (0.0 - shatterValue.current) * 0.12;
      uniforms.shatterProgress.value = shatterValue.current;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onResize = () => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight || 550;
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      if (mount) {
        mount.removeEventListener('pointermove', onPointerMove);
        mount.removeEventListener('pointerdown', onPointerDown);
        mount.removeEventListener('pointerleave', onPointerLeave);
      }
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [isLowEnd]);

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

        {}
        <motion.div
          ref={containerRef}
          className="matrix-layout glass"
          animate={{ rotateX: tilt.y, rotateY: tilt.x }}
          transition={{ type: 'spring', stiffness: 220, damping: 25 }}
          style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
        >
          {}
          {!isLowEnd && <div className="matrix-canvas-mount" ref={mountRef} />}

          {}
          <div className="matrix-grid-content" style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }}>
            
            {}
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
