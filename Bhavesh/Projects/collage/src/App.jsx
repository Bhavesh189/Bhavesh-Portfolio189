import React, { useState, useEffect } from 'react';
import './styles/App.css';
import GlowBg from './components/GlowBg';
import FloatingBot from './components/FloatingBot';
import AdsBanner from './components/AdsBanner';
import TabSelector from './components/TabSelector';
import NotesHub from './pages/NotesHub';
import AddNotesForm from './pages/AddNotesForm';

function App() {
  const [currentView, setCurrentView] = useState('notes'); // 'notes', 'add-notes'
  const [currentSem, setCurrentSem] = useState('sem1');
  const [scrollWidth, setScrollWidth] = useState('0%');

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const scrolled = (window.scrollY / totalScroll) * 100;
        setScrollWidth(`${scrolled}%`);
      } else {
        setScrollWidth('0%');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container">
      {/* Scroll Progress Indicator */}
      <div className="scroll-progress-bar" style={{ width: scrollWidth }}></div>

      {/* Dynamic Glow Background */}
      <GlowBg />

      {/* Main Header / Navigation */}
      <header className="main-header glass">
        <div className="logo-section">
          <h1>
            Bhavesh Notes <span className="logo-dot"></span>
          </h1>
        </div>
        <nav className="nav-links">
          <button 
            className={`nav-btn ${currentView === 'notes' ? 'active' : ''}`}
            onClick={() => setCurrentView('notes')}
          >
            <i className="fa-solid fa-graduation-cap"></i> Notes Dashboard
          </button>
          <a 
            href="https://bhavesh189.github.io/Result-Website/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="nav-btn"
          >
            <i className="fa-solid fa-square-poll-vertical"></i> See Result
          </a>
          <button 
            className={`nav-btn ${currentView === 'add-notes' ? 'active' : ''}`}
            onClick={() => setCurrentView('add-notes')}
          >
            <i className="fa-solid fa-circle-plus"></i> Add Notes
          </button>
        </nav>
      </header>

      {/* Marquee Notifications Ticker */}
      <div className="ticker-wrap glass">
        <div className="ticker-title">
          <i className="fa-solid fa-bullhorn" style={{ animation: 'bounce 1s infinite' }}></i>
          Notifications
        </div>
        <div className="ticker-marquee">
          <div className="ticker-text">
            🚀 Added New B.Tech Semester 2 Notes! Check them now. • 💻 Document Analyzer AI integration available on the floating widget. • 🎬 Finished studying? Stream movies for free on EnterNet below!
          </div>
        </div>
      </div>

      {/* Semester Tabs - Notes view only */}
      {currentView === 'notes' && (
        <TabSelector activeTab={currentSem} onChangeTab={setCurrentSem} />
      )}

      {/* Page Content View Router */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentView === 'notes' && (
          <NotesHub currentSem={currentSem} onNavigate={setCurrentView} />
        )}
        {currentView === 'add-notes' && (
          <AddNotesForm />
        )}
      </main>

      {/* Floating DocAna Bot Widget */}
      <FloatingBot />

      {/* Bottom Ads Banner */}
      <AdsBanner />
    </div>
  );
}

export default App;

