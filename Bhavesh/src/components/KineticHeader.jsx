import { useEffect, useRef } from 'react';
import './Skills.css';

export default function KineticHeader({ text }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;
    
    let width = container.clientWidth || 300;
    let height = 60;
    

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);


    ctx.fillStyle = '#ffffff';
    ctx.font = '900 2.2rem Outfit, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, height / 2);


    const imgData = ctx.getImageData(0, 0, width * dpr, height * dpr);
    const data = imgData.data;
    
    const particles = [];
    const step = 4;

    for (let y = 0; y < height * dpr; y += step) {
      for (let x = 0; x < width * dpr; x += step) {
        const index = (y * width * dpr + x) * 4;
        const alpha = data[index + 3];
        if (alpha > 128) {

          particles.push({
            x: x / dpr,
            y: y / dpr,
            ox: x / dpr,
            oy: y / dpr,
            dx: (Math.random() - 0.5) * 80,
            dy: (Math.random() - 0.5) * 80 + 30,
          });
        }
      }
    }

    let active = true;
    let scrollProgress = 0.0;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      

      const threshold = rect.top / windowHeight;
      if (threshold < 0.25) {
        scrollProgress = Math.min(1.0, (0.25 - threshold) * 2.2);
      } else {
        scrollProgress = 0.0;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const render = () => {
      if (!active) return;
      
      ctx.clearRect(0, 0, width, height);


      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        

        const currentX = p.ox + p.dx * scrollProgress;
        const currentY = p.oy + p.dy * scrollProgress;
        const opacity = 1.0 - scrollProgress * 0.7;


        ctx.fillStyle = `rgba(41, 211, 238, ${opacity})`;
        ctx.fillRect(currentX, currentY, 1.8, 1.8);
      }

      requestAnimationFrame(render);
    };
    render();

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth;
      canvas.width = width * dpr;
      canvas.style.width = `${width}px`;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', onResize);

    return () => {
      active = false;
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [text]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '60px' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
