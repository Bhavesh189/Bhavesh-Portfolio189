import { useRef, useState } from 'react';
import { useToast } from './Toast';

export default function RebelButton({ children = 'Reject offer ✖' }) {
  const btnRef = useRef(null);
  const toast = useToast();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - btnCenterX;
    const dy = e.clientY - btnCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);


    const Proximity = 85;

    if (dist < Proximity) {

      const angle = Math.atan2(dy, dx);

      const escapeDist = 120;
      let newX = position.x - Math.cos(angle) * escapeDist;
      let newY = position.y - Math.sin(angle) * escapeDist;


      const padding = 60;
      if (rect.left + newX < padding) newX = padding - rect.left;
      if (rect.right + newX > window.innerWidth - padding) newX = window.innerWidth - padding - rect.right;
      if (rect.top + newY < padding) newY = padding - rect.top;
      if (rect.bottom + newY > window.innerHeight - padding) newY = window.innerHeight - padding - rect.bottom;

      setPosition({ x: newX, y: newY });


      window.dispatchEvent(
        new CustomEvent('portfolio-xp', {
          detail: { amount: 10, id: 'evaded-click', text: 'Persistent Recruiter (Chased the evasive button)' },
        })
      );
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    toast('Nice try, but rejection is not an option! 😉', 'error');
  };

  return (
    <button
      ref={btnRef}
      className="btn btn-secondary rebel-btn"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        zIndex: 50,
      }}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
