import { useEffect, useState } from 'react';


export default function LocalClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      try {
        setTime(
          new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }).format(new Date())
        );
      } catch (e) {
        setTime('');
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <span className="local-clock" title="Local time in Jaipur, India">
      <span className="local-clock-dot" />
      Jaipur&nbsp;·&nbsp;{time} IST
    </span>
  );
}
