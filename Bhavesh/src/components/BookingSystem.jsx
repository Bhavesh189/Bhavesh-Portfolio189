import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { FiCalendar, FiCheck, FiArrowLeft, FiCode, FiMessageSquare, FiCopy, FiUserPlus } from 'react-icons/fi';
import * as THREE from 'three';
import resumeUrl from '../assets/Bhavesh.pdf';
import { telegram } from '../config';
import { useToast } from './Toast';
import './BookingSystem.css';


const BASELINE_SLOTS = [
  { id: 'slot-1', day: 'Monday', time: '10:00 AM' },
  { id: 'slot-2', day: 'Tuesday', time: '02:30 PM' },
  { id: 'slot-3', day: 'Wednesday', time: '11:00 AM' },
  { id: 'slot-4', day: 'Thursday', time: '04:00 PM' },
  { id: 'slot-5', day: 'Friday', time: '01:00 PM' },
];

const glassVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const glassFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    

    vec2 center1 = vec2(0.5 + sin(time * 0.4) * 0.25, 0.5 + cos(time * 0.25) * 0.25);
    vec2 center2 = vec2(0.5 - cos(time * 0.3) * 0.25, 0.5 - sin(time * 0.4) * 0.25);
    vec2 center3 = vec2(0.3 + sin(time * 0.25) * 0.2, 0.7 + cos(time * 0.3) * 0.2);

    float dist1 = distance(uv, center1);
    float dist2 = distance(uv, center2);
    float dist3 = distance(uv, center3);

    float glow1 = smoothstep(0.45, 0.0, dist1) * 0.35;
    float glow2 = smoothstep(0.38, 0.0, dist2) * 0.35;
    float glow3 = smoothstep(0.40, 0.0, dist3) * 0.30;

    vec3 col1 = vec3(0.48, 0.36, 1.0);
    vec3 col2 = vec3(0.16, 0.82, 0.93);
    vec3 col3 = vec3(1.0, 0.36, 0.61);

    vec3 finalColor = vec3(0.02, 0.02, 0.06) + col1 * glow1 + col2 * glow2 + col3 * glow3;
    gl_FragColor = vec4(finalColor, 0.55);
  }
`;

export default function BookingSystem() {
  const mountRef = useRef(null);
  const containerRef = useRef(null);
  const toast = useToast();
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [bookingStatus, setBookingStatus] = useState('idle');
  const [timezone, setTimezone] = useState('');
  const [showTemplate, setShowTemplate] = useState(false);


  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 220, damping: 25 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 220, damping: 25 });

  useEffect(() => {

    try {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
    } catch (e) {
      setTimezone('UTC');
    }


    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = { time: { value: 0 } };
    const material = new THREE.ShaderMaterial({
      vertexShader: glassVertexShader,
      fragmentShader: glassFragmentShader,
      uniforms,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let raf;
    const clock = new THREE.Clock();
    const loop = () => {
      uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onResize = () => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight || 520;
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handlePointerMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    px.set(normX);
    py.set(normY);
  };

  const handlePointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name || !selectedSlot) return;

    setBookingStatus('booking');

    const lines = [
      '📅 New Interview Scheduled!',
      '',
      `👤 Name: ${name}`,
      `✉️ Email: ${email}`,
      `🏢 Company: ${company || 'N/A'}`,
      `⏰ Selected Slot: ${selectedSlot.day} at ${selectedSlot.time}`,
      '',
      `🕓 ${new Date().toLocaleString()}`,
    ];

    try {
      const res = await fetch(`https://api.telegram.org/bot${telegram.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegram.chatId,
          text: lines.join('\n'),
          disable_web_page_preview: true,
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error('telegram-error');

      setBookingStatus('success');
      toast('Interview scheduled successfully! ∞', 'success');
    } catch (err) {
      setBookingStatus('idle');
      toast('Could not schedule. Please try again.', 'error');
    }
  };

  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:Sharma;Bhavesh;;;
FN:Bhavesh Sharma
ORG:Bikaner Technical University
TITLE:MERN Stack & Software Developer
TEL;TYPE=CELL:+916376411796
EMAIL;TYPE=PREF,INTERNET:bhaveshyt.infinity@gmail.com
URL:https://bhavesh-portfolio189.vercel.app/
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Bhavesh_Sharma.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Contact details downloaded! ∞', 'success');
  };

  const handleCopyTemplate = async () => {
    const templateText = `Hi Team,

I just scheduled a discussion with Bhavesh Sharma. He's a Computer Science student (CGPA 9.20) specializing in the MERN stack with 350+ LeetCode DSA solves.

Here is a link to his credentials:
• Portfolio: https://bhavesh-portfolio189.vercel.app/
• Email: bhaveshyt.infinity@gmail.com

He seems like a highly qualified candidate for our software engineering / full-stack opening.`;
    
    try {
      await navigator.clipboard.writeText(templateText);
      toast('Recruiter template copied! Ready to forward. ∞', 'success');
    } catch (err) {
      toast('Failed to copy template.', 'error');
    }
  };

  return (
    <section id="booking" className="section booking">
      <div className="container">
        
        <div className="section-head text-center">
          <span className="eyebrow">Connect</span>
          <h2 className="section-title">Let&rsquo;s Connect.</h2>
          <p className="section-lead muted">
            Your local time: {timezone || 'Detecting...'}
          </p>
        </div>

        {}
        <div
          ref={containerRef}
          className="liquid-glass-container glass"
        >
          {}
          <div className="liquid-glass-bg" ref={mountRef} />

          <div className="liquid-glass-inner">
            <AnimatePresence mode="wait">
              
              {}
              {!selectedSlot && (
                <motion.div
                  key="slots-grid"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-slots-grid"
                >
                  {BASELINE_SLOTS.map((slot) => (
                    <motion.button
                      key={slot.id}
                      layoutId={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className="glass-slot-card glass"
                      whileHover={{ scale: 1.05, y: -3 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    >
                      <FiCalendar className="slot-icon" />
                      <div className="slot-meta">
                        <span className="slot-day">{slot.day}</span>
                        <span className="slot-time">{slot.time}</span>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {}
              {selectedSlot && bookingStatus !== 'success' && (
                <motion.div
                  key="morphing-form"
                  layoutId={selectedSlot.id}
                  className="glass-form-card glass"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button className="glass-back-btn" onClick={() => setSelectedSlot(null)} aria-label="Back to slots">
                    <FiArrowLeft className="icon" /> Back to slots
                  </button>
                  
                  <div className="form-info">
                    <h4>Booking Node</h4>
                    <p className="selected-time-value">{selectedSlot.day} at {selectedSlot.time}</p>
                  </div>

                  <form onSubmit={handleConfirmSubmit} className="glass-form">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="glass-input"
                      aria-label="Your Name"
                    />
                    <input
                      type="text"
                      placeholder="Company / Organization"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="glass-input"
                      aria-label="Company or Organization"
                    />
                    <input
                      type="email"
                      placeholder="Your Work Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="glass-input"
                      aria-label="Your Work Email"
                    />
                    <button
                      type="submit"
                      disabled={bookingStatus === 'booking'}
                      className={`btn glass-confirm-btn ${bookingStatus === 'booking' ? 'is-loading' : ''}`}
                    >
                      {bookingStatus === 'booking' ? 'Confirming...' : 'Confirm'}
                    </button>
                  </form>
                </motion.div>
              )}

              {}
              {selectedSlot && bookingStatus === 'success' && (
                <motion.div
                  key="success-glow"
                  layoutId={selectedSlot.id}
                  className="glass-success-card glass"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <div className="success-glowing-circle">
                    <FiCheck className="check-icon" />
                  </div>
                  
                  <h3>Slot Secured.</h3>
                  <p className="success-sub">Invite delivered to <span className="highlight">{email}</span></p>

                  {}
                  <div className="ds-prep-hud glass">
                    <div className="ds-badge">
                      <FiCode className="icon" />
                      <span>BHAVESH'S CORE TECH FOCUS</span>
                    </div>
                    <p className="ds-note">Here are the core areas Bhavesh is ready to discuss and demonstrate:</p>
                    <ul className="ds-list">
                      <li>
                        <strong>Full-Stack Development (MERN):</strong> Building interactive user interfaces in React.js and highly optimized REST APIs under Node.js & Express.
                      </li>
                      <li>
                        <strong>Data Structures & Algorithms:</strong> Solid computer science fundamentals with 350+ solved challenges on LeetCode.
                      </li>
                      <li>
                        <strong>Software Engineering & DevOps:</strong> Practical experience with containerization (Docker, Kubernetes) and structured Git workflows.
                      </li>
                      <li>
                        <strong>Systems & Performance:</strong> Scaling backend data pipelines, model mapping in MongoDB, and latency optimizations.
                      </li>
                    </ul>
                  </div>

                  <div className="success-actions" style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    <a href={resumeUrl} download className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      Download CV PDF
                    </a>
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('open-bhavesh-ai'))}
                      className="btn btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <FiMessageSquare /> Ask Bhavesh AI
                    </button>
                    <button
                      onClick={handleDownloadVCard}
                      className="btn btn-secondary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <FiUserPlus /> Save Contact
                    </button>
                    <button
                      onClick={() => setShowTemplate(!showTemplate)}
                      className="btn btn-secondary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <FiCopy /> Forward Template
                    </button>
                  </div>

                  <AnimatePresence>
                    {showTemplate && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="recruiter-template-box glass"
                        style={{ overflow: 'hidden', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)', textAlign: 'left', marginTop: '1rem' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>RECRUITER EMAIL FORWARD TEMPLATE</span>
                          <button
                            type="button"
                            onClick={handleCopyTemplate}
                            style={{ background: 'transparent', border: 'none', color: 'var(--cyan)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                          >
                            [ Copy Text ]
                          </button>
                        </div>
                        <pre style={{ margin: 0, fontSize: '0.8rem', whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: 'var(--muted)', lineHeight: '1.4' }}>
                          {`Hi Team,\n\nI just scheduled a discussion with Bhavesh Sharma. He's a Computer Science student (CGPA 9.20) specializing in the MERN stack with 350+ LeetCode DSA solves.\n\nHere is a link to his credentials:\n• Portfolio: https://bhavesh-portfolio189.vercel.app/\n• Email: bhaveshyt.infinity@gmail.com\n\nHe seems like a highly qualified candidate for our software engineering / full-stack opening.`}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
