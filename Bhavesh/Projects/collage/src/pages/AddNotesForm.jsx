import React, { useState, useRef } from 'react';

const AddNotesForm = () => {
  const [topicName, setTopicName] = useState('');
  const [subject, setSubject] = useState('');
  const [role, setRole] = useState('user'); // admin or user
  const [adminPassword, setAdminPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const fileInputRef = useRef(null);

  // Constants preserved from original add.js
  const api = "teri_esi_ki_tesi_api_dekhega";
  const chatId = "teri_esi_ki_tesi_address_dekhega";
  const telegramUrl = `https://api.telegram.org/bot${api}/sendDocument`;

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === 'admin' && adminPassword !== 'BhaveshSDE') {
      alert("Galat h Password be Sahi Daal");
      return;
    }

    if (!topicName || !selectedFile) {
      alert("Naam Notes Kon Dalega !!!");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData();
    formData.append("chat_id", chatId);
    const message = `Request By ${topicName}\nSubject : ${subject || 'ANY'}`;
    formData.append("caption", message);
    formData.append("document", selectedFile);

    try {
      const response = await fetch(telegramUrl, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          setTopicName('');
          setSubject('');
          setRole('user');
          setAdminPassword('');
          setSelectedFile(null);
          setSubmitStatus(null);
          setIsSubmitting(false);
        }, 2000);
      } else {
        throw new Error("Server Busy");
      }
    } catch (error) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      alert("Server Busy hai badme krio");
      // Fallback redirect preserved from add.js
      window.location.href = "https://wa.me/+916376411796";
    }
  };

  return (
    <div className="add-notes-container">
      <div className="form-title-section">
        <h2>Contribute Notes</h2>
        <p>Help other students by sharing your handwritten notes or books</p>
      </div>

      <form onSubmit={handleSubmit} className="upload-form glass">
        {submitStatus === 'success' && (
          <div className="success-toast">
            <i className="fa-solid fa-circle-check"></i>
            <div>
              <h3>Added Notes Successfully</h3>
              <p>Your contribution was sent directly to Bhavesh!</p>
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="topic">
            <i className="fa-solid fa-tag"></i> Topic Name
          </label>
          <input
            type="text"
            id="topic"
            className="form-input"
            placeholder="Enter Topic Name (e.g. Wave Optics Unit 1)"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject-select">
            <i className="fa-solid fa-book-open"></i> Select Subject
          </label>
          <select
            id="subject-select"
            className="form-select"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            disabled={isSubmitting}
          >
            <option value="" disabled>---- Select Subject ----</option>
            <option value="CFP">CFP</option>
            <option value="mefa">MEFA</option>
            <option value="chem">CHEMISTRY</option>
            <option value="bee">BEE</option>
            <option value="maths">Maths</option>
            <option value="any">ANY OTHER</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <i className="fa-solid fa-user-shield"></i> Identity
          </label>
          <div className="radio-group-container">
            <label className="radio-label">
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === 'user'}
                onChange={() => setRole('user')}
                disabled={isSubmitting}
              />
              User / Student
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === 'admin'}
                onChange={() => setRole('admin')}
                disabled={isSubmitting}
              />
              Admin
            </label>
          </div>
        </div>

        {role === 'admin' && (
          <div className="form-group" style={{ animation: 'fadeInUp 0.3s ease' }}>
            <label htmlFor="admin-pass">
              <i className="fa-solid fa-key"></i> Admin Password
            </label>
            <input
              type="password"
              id="admin-pass"
              className="form-input"
              placeholder="Enter Admin Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
        )}

        <div className="form-group">
          <label>
            <i className="fa-solid fa-file-arrow-up"></i> Upload Note
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            required
          />

          {!selectedFile ? (
            <div
              className="file-dropzone"
              onClick={triggerFileSelect}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <i className="fa-solid fa-cloud-arrow-up dropzone-icon"></i>
              <div className="dropzone-text">
                <h5>Drag & Drop your file here</h5>
                <p>or click to browse files (PDF, DOCX, Images)</p>
              </div>
            </div>
          ) : (
            <div className="selected-file-details">
              <div className="file-info">
                <i className="fa-solid fa-file-lines"></i>
                <div>
                  <strong>{selectedFile.name}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="remove-file-btn"
                onClick={handleRemoveFile}
                disabled={isSubmitting}
                title="Remove file"
              >
                <i className="fa-solid fa-circle-xmark"></i>
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting || !selectedFile || !topicName}
        >
          {isSubmitting ? (
            <>
              <i className="fa-solid fa-paper-plane fa-spin"></i> Sending To Bhavesh...
            </>
          ) : (
            <>
              <i className="fa-solid fa-share-from-square"></i> Submit Contribution
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddNotesForm;
