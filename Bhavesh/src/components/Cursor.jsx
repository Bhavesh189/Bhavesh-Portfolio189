import { useEffect, useState, useRef } from 'react';

const SNIPPET = "import React, { useState, useEffect } from 'react'; console.log('Welcome to Bhavesh Infinity Portfolio'); const dev = { name: 'Bhavesh Sharma', role: 'MERN & Distributed Systems', cgpa: 9.20 }; function hireBhavesh() { return status === 'hired'; } npm run dev --open ... ";

export default function Cursor() {
  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const particles = useRef([]);
  const sparks = useRef([]);
  const charIndex = useRef(0);
  

  const mousePos = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  
  const ringPos = useRef({ x: 0, y: 0 });
  const ringScale = useRef({ x: 1, y: 1 });
  const ringRotation = useRef(0);
  const ringAlpha = useRef(1);

  const [isTrailActive, setIsTrailActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {

    document.body.classList.add('has-custom-cursor');

    const checkTrail = () => {
      setIsTrailActive(document.body.classList.contains('typingtrail-active'));
    };
    checkTrail();
    window.addEventListener('mod-toggle', checkTrail);

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };


      if (document.body.classList.contains('typingtrail-active')) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 16) {
          const char = SNIPPET[charIndex.current];
          charIndex.current = (charIndex.current + 1) % SNIPPET.length;

          particles.current.push({
            x: e.clientX,
            y: e.clientY,
            char,
            alpha: 1.0,
            size: 11 + Math.random() * 4,
            vx: (Math.random() - 0.5) * 1.6,
            vy: (Math.random() - 0.5) * 1.6 - 1.0,
          });

          lastMousePos.current = { x: e.clientX, y: e.clientY };
        }
      }


      const target = e.target;
      const isClickable = target && (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.proj-filter-btn') ||
        target.closest('.matrix-node-chip') ||
        target.getAttribute('role') === 'button'
      );
      setIsHovered(!!isClickable);
    };

    const onClick = (e) => {
      const activeColor = getComputedStyle(document.documentElement).getPropertyValue('--violet').trim() || '#7c5cff';
      const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--cyan').trim() || '#29d3ee';
      
      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5.5;
        sparks.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.8,
          alpha: 1.0,
          decay: 0.015 + Math.random() * 0.02,
          size: 2 + Math.random() * 3.5,
          color: Math.random() > 0.45 ? activeColor : secondaryColor,
        });
      }
    };

    window.addEventListener('pointermove', onMouseMove);
    window.addEventListener('click', onClick);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mod-toggle', checkTrail);
      window.removeEventListener('pointermove', onMouseMove);
      window.removeEventListener('click', onClick);
    };
  }, []);


  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const updateCursor = () => {

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }


      const speedCoeff = isHovered ? 0.3 : 0.15;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * speedCoeff;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * speedCoeff;


      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      let stretchX = 1;
      let stretchY = 1;
      
      if (!isHovered) {
        stretchX = Math.min(1 + distance * 0.012, 1.6);
        stretchY = 1 / stretchX;
        if (distance > 1) {
          ringRotation.current = Math.atan2(dy, dx);
        }
      } else {
        ringRotation.current = 0;
      }


      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) scale(${stretchX}, ${stretchY}) rotate(${ringRotation.current}rad)`;
      }


      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const activeColor = getComputedStyle(document.documentElement).getPropertyValue('--violet').trim() || '#7c5cff';

      if (particles.current.length > 0) {
        particles.current.forEach((p, idx) => {
          p.alpha -= 0.016;
          p.x += p.vx;
          p.y += p.vy;

          if (p.alpha <= 0) {
            particles.current.splice(idx, 1);
            return;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.font = `bold ${p.size}px monospace`;
          ctx.fillStyle = activeColor;
          ctx.shadowColor = activeColor;
          ctx.shadowBlur = 6;
          ctx.fillText(p.char, p.x, p.y);
          ctx.restore();
        });
      }

      if (sparks.current.length > 0) {
        sparks.current.forEach((s, idx) => {
          s.alpha -= s.decay;
          s.x += s.vx;
          s.y += s.vy;
          s.vy += 0.14;

          if (s.alpha <= 0) {
            sparks.current.splice(idx, 1);
            return;
          }

          ctx.save();
          ctx.globalAlpha = s.alpha;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.restore();
        });
      }

      animId = requestAnimationFrame(updateCursor);
    };

    updateCursor();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, [isTrailActive, isHovered]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9996,
        }}
      />
      <div ref={dotRef} className={`cursor-dot ${isHovered ? 'hover' : ''}`} />
      <div ref={ringRef} className={`cursor-ring ${isHovered ? 'hover' : ''}`} />
    </>
  );
}
