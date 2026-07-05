import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSettings, FiVolume2, FiEye, FiActivity, FiTerminal, FiEdit2, FiX } from 'react-icons/fi';
import { useToast } from './Toast';
import './DevModsPanel.css';


export function playKeyboardClick() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.02);
    
    oscGain.gain.setValueAtTime(0.06, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);
    

    const bufferSize = ctx.sampleRate * 0.015;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    
    noiseGain.gain.setValueAtTime(0.035, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.012);
    
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    
    osc.start();
    noise.start();
    
    osc.stop(ctx.currentTime + 0.03);
    noise.stop(ctx.currentTime + 0.03);
  } catch (err) {

  }
}

export default function DevModsPanel() {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  

  const [flashlight, setFlashlight] = useState(false);
  const [typingTrail, setTypingTrail] = useState(false);
  const [keyboardASMR, setKeyboardASMR] = useState(false);
  const [seismic, setSeismic] = useState(false);
  const [glitch, setGlitch] = useState(true);


  useEffect(() => {
    try {
      setFlashlight(localStorage.getItem('mod-flashlight') === 'true');
      
      const savedTrail = localStorage.getItem('mod-typingtrail');
      setTypingTrail(savedTrail === null ? false : savedTrail === 'true');
      
      setKeyboardASMR(localStorage.getItem('mod-keyboardasmr') === 'true');
      setSeismic(localStorage.getItem('mod-seismic') === 'true');
      
      const savedGlitch = localStorage.getItem('mod-glitch');
      setGlitch(savedGlitch === null ? true : savedGlitch === 'true');
    } catch (e) {

    }
  }, []);


  useEffect(() => {
    document.body.classList.toggle('flashlight-active', flashlight);
    localStorage.setItem('mod-flashlight', flashlight);
    window.dispatchEvent(new CustomEvent('mod-toggle', { detail: { name: 'flashlight', active: flashlight } }));
  }, [flashlight]);

  useEffect(() => {
    document.body.classList.toggle('typingtrail-active', typingTrail);
    localStorage.setItem('mod-typingtrail', typingTrail);
    window.dispatchEvent(new CustomEvent('mod-toggle', { detail: { name: 'typingtrail', active: typingTrail } }));
  }, [typingTrail]);

  useEffect(() => {
    document.body.classList.toggle('keyboardasmr-active', keyboardASMR);
    localStorage.setItem('mod-keyboardasmr', keyboardASMR);
    window.dispatchEvent(new CustomEvent('mod-toggle', { detail: { name: 'keyboardasmr', active: keyboardASMR } }));
  }, [keyboardASMR]);

  useEffect(() => {
    document.body.classList.toggle('seismic-active', seismic);
    localStorage.setItem('mod-seismic', seismic);
    window.dispatchEvent(new CustomEvent('mod-toggle', { detail: { name: 'seismic', active: seismic } }));
  }, [seismic]);

  useEffect(() => {
    document.body.classList.toggle('glitch-active', glitch);
    localStorage.setItem('mod-glitch', glitch);
    window.dispatchEvent(new CustomEvent('mod-toggle', { detail: { name: 'glitch', active: glitch } }));
  }, [glitch]);


  useEffect(() => {
    const handleMove = (e) => {
      if (flashlight) {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      }
    };
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [flashlight]);


  useEffect(() => {
    const handleKeydown = () => {
      if (keyboardASMR) {
        playKeyboardClick();
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [keyboardASMR]);


  useEffect(() => {
    const handleClick = () => {
      if (seismic) {
        document.body.classList.remove('quake-shake');

        void document.body.offsetWidth;
        document.body.classList.add('quake-shake');
        setTimeout(() => {
          document.body.classList.remove('quake-shake');
        }, 300);
      }
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [seismic]);


  useEffect(() => {
    const handlePaletteCommand = (e) => {
      const { cmd } = e.detail;
      if (cmd === 'flashlight') setFlashlight((prev) => !prev);
      if (cmd === 'typingtrail') setTypingTrail((prev) => !prev);
      if (cmd === 'keyboardasmr') setKeyboardASMR((prev) => !prev);
      if (cmd === 'seismic') setSeismic((prev) => !prev);
      if (cmd === 'glitch') setGlitch((prev) => !prev);
      if (cmd === 'reset') {
        setFlashlight(false);
        setTypingTrail(false);
        setKeyboardASMR(false);
        setSeismic(false);
        setGlitch(false);
      }
    };
    window.addEventListener('palette-command', handlePaletteCommand);
    return () => window.removeEventListener('palette-command', handlePaletteCommand);
  }, []);

  const handleToggle = (setter, label, currentVal) => {
    setter(!currentVal);
    toast(`${label} ${!currentVal ? 'ENABLED' : 'DISABLED'}!`, 'success');
  };

  return (
    <>
      {}
      <AnimatePresence>
        {flashlight && (
          <motion.div
            className="flashlight-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {}
      <div className="mods-trigger-container">
        <button
          className={`mods-trigger-btn ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          title="Toggle Developer Mods HUD"
          aria-label="Toggle Developer Mods HUD"
        >
          {isOpen ? <FiX size={20} /> : <FiSettings size={20} className="spin-slow" />}
          <span className="mods-badge">MODS</span>
        </button>

        {}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="mods-hud-panel"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            >
              <div className="mods-hud-header">
                <h3>🎛️ PORTFOLIO MODS</h3>
                <p>Toggle high-tech interactive overlays</p>
              </div>

              <div className="mods-hud-list">
                {}
                <div className={`mods-hud-item ${flashlight ? 'active' : ''}`} onClick={() => handleToggle(setFlashlight, 'Flashlight Mask', flashlight)}>
                  <div className="item-icon"><FiEye /></div>
                  <div className="item-info">
                    <h4>Flashlight Mask</h4>
                    <p>Cursor projects 200px spotlight</p>
                  </div>
                  <div className="item-toggle-ui"><div className="toggle-slider" /></div>
                </div>

                {}
                <div className={`mods-hud-item ${typingTrail ? 'active' : ''}`} onClick={() => handleToggle(setTypingTrail, 'Typing Code Trail', typingTrail)}>
                  <div className="item-icon"><FiEdit2 /></div>
                  <div className="item-info">
                    <h4>Typing Trail</h4>
                    <p>Floating code strings follow cursor</p>
                  </div>
                  <div className="item-toggle-ui"><div className="toggle-slider" /></div>
                </div>

                {}
                <div className={`mods-hud-item ${keyboardASMR ? 'active' : ''}`} onClick={() => handleToggle(setKeyboardASMR, 'Keyboard ASMR', keyboardASMR)}>
                  <div className="item-icon"><FiVolume2 /></div>
                  <div className="item-info">
                    <h4>Keyboard ASMR</h4>
                    <p>Mechanical keys click on input/type</p>
                  </div>
                  <div className="item-toggle-ui"><div className="toggle-slider" /></div>
                </div>

                {}
                <div className={`mods-hud-item ${seismic ? 'active' : ''}`} onClick={() => handleToggle(setSeismic, 'Seismic Shaking', seismic)}>
                  <div className="item-icon"><FiActivity /></div>
                  <div className="item-info">
                    <h4>Seismic Clicks</h4>
                    <p>Shakes the viewport on click physics</p>
                  </div>
                  <div className="item-toggle-ui"><div className="toggle-slider" /></div>
                </div>

                {}
                <div className={`mods-hud-item ${glitch ? 'active' : ''}`} onClick={() => handleToggle(setGlitch, 'Matrix Glitch Theme', glitch)}>
                  <div className="item-icon"><FiTerminal /></div>
                  <div className="item-info">
                    <h4>Glitch displacement</h4>
                    <p>Chromatic distortion & scanlines</p>
                  </div>
                  <div className="item-toggle-ui"><div className="toggle-slider" /></div>
                </div>
              </div>

              <div className="mods-shortcuts-guide">
                <h4>⌨️ QUICK HOTKEYS</h4>
                <div className="shortcuts-keys-grid">
                  <div><span>A</span> About</div>
                  <div><span>S</span> Skills</div>
                  <div><span>J</span> Journey</div>
                  <div><span>P</span> Projects</div>
                  <div><span>C</span> Contact</div>
                  <div><span>T</span> Top</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
