import React, { useState } from 'react';

const LoginModal = ({ isOpen, onClose, onUnlock }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isShake, setIsShake] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const u = username.replace(/\s+/g, '').toLowerCase();
    const p = password.replace(/\s+/g, '').toLowerCase();

    // Verify credentials matching original script.js
    if (u === 'bhavesh' && p === 'bhavesh') {
      setTimeout(() => {
        setIsUnlocked(true);
        localStorage.setItem("isLoggedIn", "true");
        setTimeout(() => {
          setIsLoading(false);
          onUnlock();
        }, 800); // Wait for padlock morph animation
      }, 500);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setIsShake(true);
        alert("Wrong credentials! Access Denied.");
        setTimeout(() => setIsShake(false), 500);
      }, 500);
    }
  };

  return (
    <div className="login-backdrop">
      <div className={`login-card glass ${isShake ? 'login-shake' : ''}`}>
        <div className="login-icon-container">
          <div className={`login-lock-circle ${isUnlocked ? 'unlocked' : ''}`}>
            {isUnlocked ? (
              <i className="fa-solid fa-lock-open"></i>
            ) : (
              <i className="fa-solid fa-lock"></i>
            )}
          </div>
        </div>

        <h2>Security Lock</h2>
        <p>This folder requires authentication. Please sign in below.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <i className="fa-solid fa-user input-icon"></i>
            <input
              type="text"
              className="login-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <i className="fa-solid fa-key input-icon"></i>
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i> Checking...
              </>
            ) : (
              <>
                <i className="fa-solid fa-right-to-bracket"></i> Unlock Folder
              </>
            )}
          </button>
        </form>

        <div className="login-support-link">
          <a 
            href="https://wa.me/916376411796?text=Hello%20sir%20plz%20Give%20me%20id%20pass"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-whatsapp"></i> Contact Admin for Access
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
