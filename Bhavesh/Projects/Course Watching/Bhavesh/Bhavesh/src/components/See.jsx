import React, { useState, useEffect } from 'react';
import './css/See.css';
import { useNavigate, useLocation } from 'react-router-dom';

const See = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const courseData = location.state?.courseData || null;
  localStorage.setItem('courseData', JSON.stringify(courseData));

  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    console.log(courseData);
  }, [courseData]);

  if (!courseData) {
    return (
      <div className="loading-screen" style={{ color: 'white', padding: '2rem' }}>
        <h2>Error: Data Not Received!</h2>
        <button onClick={() => navigate('/courses')} style={{ padding: '10px', marginTop: '10px' }}>Go Back</button>
      </div>
    );
  }

  if (!courseData.link || courseData.link.length === 0) {
    return (
      <div className="loading-screen" style={{ color: 'white', padding: '2rem' }}>
        <h2>Course Data Found, But No Videos!</h2>
        <p>There are no video links saved in the database for this course ({courseData.name}).</p>
        <button onClick={() => navigate('/courses')} style={{ padding: '10px', marginTop: '10px' }}>Go Back</button>
      </div>
    );
  }

  const Icons = {
    back: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
    play: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
    menu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
    close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
  };

  return (
    <div className="see-wrapper">
      <nav className="see-navbar">
        <div className="see-nav-left">
          <button className="icon-btn back-btn" onClick={() => navigate(-1)}>
            {Icons.back}
          </button>
          <h1 className="see-course-title">{courseData.name}</h1>
        </div>
        
        {/* Desktop pe sidebar toggle karne ke liye menu button, mobile pe hide ho jayega */}
        <div className="see-nav-right desktop-menu-btn">
          <button className="icon-btn menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? Icons.close : Icons.menu}
          </button>
        </div>
      </nav>

      <main className="see-main">
        <section className="see-video-section">
          <div className="cinematic-player-wrapper">
            <div className="player-glow"></div>
            <div className="player-container">
              <iframe 
                src={courseData.link[currentVideoIndex]} 
                title={`${courseData.name} - Lecture ${currentVideoIndex + 1}`}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="course-iframe"
              ></iframe>
            </div>
          </div>

          <div className="see-tabs-wrapper">
            <div className="see-tabs">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'qna' ? 'active' : ''}`}
                onClick={() => setActiveTab('qna')}
              >
                Q&A (AI Assistant)
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-content fade-in">
                  <h2>Lecture {currentVideoIndex + 1}</h2>
                  <p>Currently playing Lecture {currentVideoIndex + 1} from {courseData.name}. Watch the video carefully and practice along.</p>
                </div>
              )}
              {activeTab === 'qna' && (
                <div className="qna-content fade-in" style={{ height: '600px', width: '100%', padding: '0' }}>
                  <iframe 
                    src="https://bhavesh189.github.io/DocAna/" 
                    title="DocAna Chat"
                    style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px', backgroundColor: '#fff' }}
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className={`see-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Course Content</h3>
          </div>
          <div className="modules-list">
            <div className="module-card">
              <div className="module-header">
                <h4>All Lectures</h4>
                <span>{courseData.link.length} Videos</span>
              </div>
              <div className="lectures-list">
                {courseData.link.map((url, index) => (
                  <button 
                    key={index}
                    className={`lecture-item ${currentVideoIndex === index ? 'playing' : ''}`}
                    onClick={() => setCurrentVideoIndex(index)}
                  >
                    <div className="lecture-icon">{Icons.play}</div>
                    <div className="lecture-details">
                      <span className="lecture-title">Lecture {index + 1}</span>
                      <span className="lecture-time">Video</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default See;