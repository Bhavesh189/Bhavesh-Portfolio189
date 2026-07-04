import React from 'react';
import './GlitchText.css';

export default function GlitchText({ text, className }) {
  return (
    <span className={`glitch-text ${className || ''}`} data-text={text}>
      {text}
    </span>
  );
}
