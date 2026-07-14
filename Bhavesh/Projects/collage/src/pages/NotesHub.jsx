import React, { useState, useEffect } from 'react';
import { semestersData } from '../data/notesData';
import LoginModal from '../components/LoginModal';

const NotesHub = ({ currentSem }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [pendingSubject, setPendingSubject] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check login state on mount
  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(logged);
  }, []);

  // Reset selected subject when semester changes
  useEffect(() => {
    setSelectedSubject(null);
  }, [currentSem]);

  const semData = semestersData[currentSem];
  if (!semData) return null;

  const handleSubjectClick = (subject) => {
    if (subject.secured && !isAuthenticated) {
      setPendingSubject(subject);
      setIsLoginOpen(true);
      return;
    }

    setSelectedSubject(subject);
  };

  const handleUnlockSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginOpen(false);
    if (pendingSubject) {
      setSelectedSubject(pendingSubject);
      setPendingSubject(null);
    }
  };

  const handleBack = () => {
    setSelectedSubject(null);
  };

  return (
    <div className="view-main">
      {/* Subject Panel Detail View */}
      {selectedSubject ? (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="subject-panel-header">
            <button className="back-btn" onClick={handleBack}>
              <i className="fa-solid fa-arrow-left"></i> Back to Grid
            </button>
            <h2 className="panel-title">{selectedSubject.name} Notes</h2>
            <div style={{ width: '80px' }}></div> {/* spacer */}
          </div>

          <div className="notes-list-container">
            {selectedSubject.notes && selectedSubject.notes.length > 0 ? (
              selectedSubject.notes.map((note, index) => {
                // If it's a secured subject containing sub-folders (like practical files)
                if (note.subnotes) {
                  return (
                    <div key={index} className="folder-card glass" style={{ '--i': index }}>
                      <div className="folder-header">
                        <i className="fa-solid fa-folder-open"></i>
                        <span>{note.title}</span>
                      </div>
                      <div className="folder-notes-grid">
                        {note.subnotes.map((sub, sIdx) => (
                          <a
                            key={sIdx}
                            href={sub.file}
                            download={!sub.isExternal}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="folder-note-link"
                          >
                            <span>{sub.title}</span>
                            <i className="fa-solid fa-download" style={{ color: 'var(--neon-cyan)' }}></i>
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                }

                // Normal Note Link
                return (
                  <a
                    key={index}
                    href={note.file}
                    download={!note.isExternal && !note.isPlaceholder}
                    target={note.isExternal ? "_blank" : "_self"}
                    rel={note.isExternal ? "noopener noreferrer" : ""}
                    className="note-item glass"
                    style={{ '--i': index }}
                    onClick={(e) => {
                      if (note.isPlaceholder) {
                        e.preventDefault();
                        alert("Note has not been uploaded yet! Coming soon.");
                      }
                    }}
                  >
                    <div className="note-item-left">
                      <i className={`fa-solid ${note.file && note.file.endsWith('.docx') ? 'fa-file-word' : 'fa-file-pdf'} note-item-icon`}></i>
                      <span className="note-item-title">{note.title}</span>
                    </div>
                    <div className="note-item-right">
                      <i className="fa-solid fa-arrow-down"></i>
                    </div>
                  </a>
                );
              })
            ) : (
              <div className="coming-soon-card glass" style={{ margin: '2rem auto' }}>
                <i className="fa-solid fa-hourglass-half coming-soon-icon"></i>
                <h3>No notes uploaded yet</h3>
                <p>We are currently compiling files for {selectedSubject.name}. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Grid of Subjects */
        <div style={{ width: '100%' }}>
          {semData.subjects.length > 0 ? (
            <div className="subjects-grid">
              {semData.subjects.map((sub) => (
                <div
                  key={sub.id}
                  className={`subject-card glass glass-hover ${sub.colorClass || ''}`}
                  onClick={() => handleSubjectClick(sub)}
                >
                  {sub.secured && (
                    <div className="secured-indicator">
                      <i className="fa-solid fa-shield-halved"></i> Secured
                    </div>
                  )}
                  <div className="subject-card-img-wrapper">
                    <img src={sub.image} alt={sub.name} className="subject-card-img" />
                  </div>
                  <h3 className="subject-card-name">{sub.name}</h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="coming-soon-card glass" style={{ margin: '4rem auto' }}>
              <i className="fa-solid fa-laptop-code coming-soon-icon"></i>
              <h3>Semester Coming Soon</h3>
              <p>Notes for {semData.name} are currently under preparation. Stay tuned!</p>
            </div>
          )}
        </div>
      )}

      {/* Login modal check for secured notes */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onUnlock={handleUnlockSuccess}
      />
    </div>
  );
};

export default NotesHub;
