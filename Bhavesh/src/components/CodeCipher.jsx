import { useEffect, useState, useRef } from 'react';

const CHARS = '01011001XX__$$##@@&&%%*+-//<>[]{}';

export default function CodeCipher({ text, speed = 30, delay = 0 }) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);
  const frameRef = useRef(0);

  const startScramble = () => {
    setIsHovered(true);
    if (intervalRef.current) clearInterval(intervalRef.current);

    frameRef.current = 0;
    intervalRef.current = setInterval(() => {
      const scrambled = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';

          if (index < frameRef.current / 3) {
            return text[index];
          }
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      setDisplayText(scrambled);
      frameRef.current += 1;

      if (frameRef.current / 3 >= text.length) {
        setDisplayText(text);
        clearInterval(intervalRef.current);
      }
    }, speed);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText(text);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span
      className="code-cipher"
      style={{ fontFamily: 'monospace', cursor: 'pointer' }}
      onPointerEnter={startScramble}
      onPointerLeave={handlePointerLeave}
    >
      {displayText}
    </span>
  );
}
