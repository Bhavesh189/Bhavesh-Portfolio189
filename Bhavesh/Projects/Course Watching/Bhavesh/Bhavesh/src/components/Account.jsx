import React, { useEffect, useState } from 'react';
import './css/Account.css';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('User');
  const [email, setEmail] = useState('No email provided');
  const [savedCourses, setSavedCourses] = useState([]);
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [requestingCert, setRequestingCert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getName();
    loadLocalCourses();
  }, []);

  const loadLocalCourses = () => {
    const localData = localStorage.getItem('courseData');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        setSavedCourses(Array.isArray(parsed) ? parsed : [parsed]);
      } catch (e) {
        console.error('Error parsing local storage data:', e);
      }
    }
  };

  const handlePlay = (course) => {
    navigate('/see', { state: { courseData: course } });
  };

  const handleLogout = async () => {
    await fetch('https://studytop-backend.onrender.com/logout', {
      credentials: 'include',
    });
    navigate('/login');
  };

  const handleVerify = async () => {
    if (!verifyInput.trim()) return;
    setVerifyLoading(true);
    setVerifyResult(null);
    try {
      const cleanId = encodeURIComponent(verifyInput.trim());
      const res = await fetch(`https://studytop-backend.onrender.com/verify/${cleanId}`);
      
      if (!res.ok) {
        setVerifyResult({ type: 'error', text: 'Invalid Certificate ID. Not found in records.' });
        setVerifyLoading(false);
        return;
      }

      const data = await res.json();
      
      if (data.v === "h") {
        setVerifyResult({ type: 'success', text: `Verified! By StudyTop` });
      } else {
        setVerifyResult({ type: 'error', text: 'Invalid Certificate ID. Not found in records.' });
      }
    } catch (e) {
      console.error("Verification Error:", e);
      setVerifyResult({ type: 'error', text: 'server error' });
    }
    setVerifyLoading(false);
  };

  const handleCertificateRequest = async (courseName) => {
    setRequestingCert(courseName);
    const token = "8594030696:AAGFFxvCxU1uzJ9afY0rfWXuKPvyQjuaUA0";
    const chatId = "7411383108";
    
    
    const text = `New Certificate Request\nName : ${name}\nEmail : ${email}\nCourse : ${courseName}\n`;
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`;

    try {
      const resp = await fetch(url);
      if (resp.ok) {
        alert("Sent Successfully! Wait for Admin's response.");
      } else {
        alert("Please try again.");
      }
    } catch (e) {
      alert("Please send again.");
    }
    setRequestingCert(null);
  };

  let ft = name.charAt(0).toUpperCase();

  async function getName() {
    try {
      let res = await fetch(`https://studytop-backend.onrender.com/getName`, {
        method: 'GET',
        credentials: 'include'
      });
      const userData = await res.json();
      setName(userData.name ? userData.name.toUpperCase() : "USER");
    } catch (e) {
      console.error('Error fetching name:', e);
      setName("Relogin to see name");
      navigate('/login');
    }
  }

  const Icons = {
    user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    history: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
    award: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>,
    shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="content-section fade-in">
            <div className="section-header">
              <h2>Profile Settings</h2>
              <p>Manage your account details and preferences.</p>
            </div>

            <div className="clean-card profile-card">
              <div className="avatar-section">
                <div className="avatar">{ft}</div>
                <div className="avatar-info">
                  <h3>{name}</h3>
                  <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '4px' }}>{email !== 'No email provided' ? email : ''}</p>
                  <span className="pro-badge" style={{ background: '#0078ff', marginTop: '8px', display: 'inline-block' }}>FREE MEMBER</span>
                </div>
              </div>

              <div className="profile-strength">
                <div className="strength-header">
                  <span>Profile Credibility</span>
                  <strong>100%</strong>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: '100%' }}></div></div>
                <p className="nudge-text">Learn with more courses to earn free certificates</p>
              </div>
            </div>
          </div>
        );

      case 'courses':
      case 'history':
        return (
          <div className="content-section fade-in">
            <div className="section-header">
              <h2>{activeTab === 'courses' ? 'My Learning' : 'Watch History'}</h2>
              <p>Pick up exactly where you left off.</p>
            </div>

            <div className="courses-grid">
              {savedCourses.length > 0 ? (
                savedCourses.map((course, index) => (
                  <div key={index} className="course-card-wrapper" onClick={() => handlePlay(course)}>
                    <div className="course-card-content">
                      <div>
                        <div className="lecture-count">{course.nLecture} Lectures</div>
                        <h3 className="course-name">{course.name}</h3>
                        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>In Progress</p>
                      </div>
                      <button className="watch-now-btn">Resume</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="clean-card">
                  <p style={{ color: '#666', padding: '1rem' }}>No recent history found.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'certificates':
        return (
          <div className="content-section fade-in">
            <div className="section-header">
              <h2>Achievements</h2>
              <p>Request, verify, and share your success with the world.</p>
            </div>

            <div className="cert-flex-container">
              {savedCourses.length > 0 ? (
                savedCourses.map((course, index) => (
                  <div key={index} className="clean-card cert-card premium-glow">
                    <div className="cert-header">
                      <div className="cert-icon-wrapper">{Icons.award}</div>
                    </div>
                    <div className="cert-info">
                      <h4>{course.name}</h4>
                      <p>Watched Course • ID: PENDING</p>
                    </div>
                    <button 
                      className="secondary-btn btn-full" 
                      onClick={() => handleCertificateRequest(course.name)}
                      disabled={requestingCert === course.name}
                    >
                      {requestingCert === course.name ? 'Sending...' : 'Request Certificate'}
                    </button>
                  </div>
                ))
              ) : (
                <div className="clean-card">
                  <p style={{ color: '#666', padding: '1rem' }}>Watch courses to earn certificates.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'verify':
        return (
          <div className="content-section fade-in">
            <div className="section-header">
              <h2>Verify Certificate</h2>
              <p>Employers can verify student credentials here.</p>
            </div>

            <div className="clean-card verify-card">
              <div className="verify-input-group">
                {Icons.shield}
                <input 
                  type="text" 
                  placeholder="Enter Certificate ID (e.g., CRT-2026-ABX)" 
                  value={verifyInput}
                  onChange={(e) => setVerifyInput(e.target.value)}
                />
              </div>
              <button className="primary-btn block-btn" onClick={handleVerify} disabled={verifyLoading}>
                {verifyLoading ? 'Verifying...' : 'Verify Authenticity'}
              </button>
              
              {verifyResult && (
                <div className={`message-box ${verifyResult.type}`} style={{marginTop: '20px', padding: '10px', borderRadius: '8px', textAlign: 'center'}}>
                  {verifyResult.text}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="modern-sidebar">
        <div className="sidebar-logo">
          <h2>Dashboard</h2>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            {Icons.user} <span>Profile</span>
          </button>
          <button className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            {Icons.history} <span>History</span>
          </button>
          <button className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
            {Icons.book} <span>My Courses</span>
          </button>
          <button className={`nav-item ${activeTab === 'certificates' ? 'active' : ''}`} onClick={() => setActiveTab('certificates')}>
            {Icons.award} <span>Certificates</span>
          </button>
          <button className={`nav-item ${activeTab === 'verify' ? 'active' : ''}`} onClick={() => setActiveTab('verify')}>
            {Icons.shield} <span>Verification</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item logout" onClick={handleLogout}>
            {Icons.logout} <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="main-content-wrapper">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Account;