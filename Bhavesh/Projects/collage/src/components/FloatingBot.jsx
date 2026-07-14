import React from 'react';

const FloatingBot = () => {
  return (
    <div className="ai-bot-widget">
      <div className="ai-tooltip">
        Analyze notes with DocAna AI 🤖
      </div>
      <a 
        href="https://bhavesh189.github.io/DocAna/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="ai-bot-link"
        title="DocAna - AI Document Analyzer"
      >
        <img src="/docana.png" alt="DocAna Logo" />
      </a>
    </div>
  );
};

export default FloatingBot;
