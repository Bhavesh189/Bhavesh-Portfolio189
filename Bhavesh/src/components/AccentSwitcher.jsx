import { useEffect, useState } from 'react';
import { accents, applyAccent } from '../config';


export default function AccentSwitcher() {
  const [current, setCurrent] = useState('nebula');

  useEffect(() => {
    try {
      setCurrent(localStorage.getItem('accent') || 'nebula');
    } catch (e) {
      setCurrent('nebula');
    }
  }, []);

  const choose = (id) => {
    applyAccent(id);
    setCurrent(id);
  };

  return (
    <div className="accent-switch" role="group" aria-label="Accent colour">
      <span className="accent-switch-label">theme</span>
      {accents.map((a) => (
        <button
          key={a.id}
          className={`accent-dot ${current === a.id ? 'is-active' : ''}`}
          style={{ background: `linear-gradient(135deg, ${a.violet}, ${a.cyan})` }}
          onClick={() => choose(a.id)}
          aria-label={a.label}
          aria-pressed={current === a.id}
          title={a.label}
        />
      ))}
    </div>
  );
}
