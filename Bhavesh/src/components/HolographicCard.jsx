import { useRef, useState } from 'react';
import './HolographicCard.css';

export default function HolographicCard({ children }) {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;


    const relX = (e.clientX - rect.left) / width - 0.5;
    const relY = (e.clientY - rect.top) / height - 0.5;


    const maxTilt = 15;
    const rotX = -relY * maxTilt;
    const rotY = relX * maxTilt;

    setRotate({ x: rotX, y: rotY });


    const shineX = ((e.clientX - rect.left) / width) * 100;
    const shineY = ((e.clientY - rect.top) / height) * 100;
    setShine({ x: shineX, y: shineY });
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setShine({ x: 50, y: 50 });
  };

  const cardStyle = {
    transform: isHovered
      ? `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`
      : `perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  return (
    <div
      ref={cardRef}
      className={`holo-card-wrapper ${isHovered ? 'hovered' : ''}`}
      style={cardStyle}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {}
      {isHovered && (
        <div
          className="holo-card-sheen"
          style={{
            background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 50%),
                         linear-gradient(${135 + rotate.x * 2}deg, rgba(255, 0, 128, 0.14) 0%, rgba(0, 255, 230, 0.14) 40%, rgba(255, 230, 0, 0.14) 80%)`,
            backgroundPosition: `${shine.x}% ${shine.y}%`,
          }}
        />
      )}
      <div className="holo-card-inner">{children}</div>
    </div>
  );
}
