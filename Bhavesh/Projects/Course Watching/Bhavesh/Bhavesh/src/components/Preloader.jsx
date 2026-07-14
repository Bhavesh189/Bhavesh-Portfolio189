import React, { useState, useEffect } from 'react';
import './css/Preloader.css';

const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="preloader-overlay">
      <div className="preloader-logo">
        StudyTop
      </div>
    </div>
  );
};

export default Preloader;