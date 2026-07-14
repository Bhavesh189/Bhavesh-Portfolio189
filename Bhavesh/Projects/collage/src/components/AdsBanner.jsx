import React from 'react';

const AdsBanner = () => {
  return (
    <div className="ads-banner-container glass">
      <a 
        href="https://bhavesh189.github.io/EnterNet/home.html" 
        target="_blank" 
        rel="noopener noreferrer"
        className="ad-anchor"
      >
        <span className="ad-badge">ADVERTISEMENT</span>
        <img src="/ad.png" alt="Watch Movies on EnterNet" className="ad-image" />
      </a>
    </div>
  );
};

export default AdsBanner;

