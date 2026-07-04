import './Marquee.css';



export default function Marquee({ items, speed = 30, reverse = false, className = '' }) {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <div
        className="marquee-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {doubled.map((item, i) => (
          <span className="marquee-item" key={i}>
            {item}
            <span className="marquee-dot">∞</span>
          </span>
        ))}
      </div>
    </div>
  );
}
