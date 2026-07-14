import React, { useState } from 'react';
import './css/Add.css';
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const navigate = useNavigate();
  const [formMode, setFormMode] = useState('new'); 
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    nLecture: '',
    studentName: '',
    courseName: '',
    certId: ''
  });
  const [links, setLinks] = useState(['']);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const addLinkField = () => setLinks([...links, '']);
  const removeLinkField = (index) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const formatToEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('/embed/')) return url;
    try {
      let videoId = '';
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else return url;
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (e) {
      return url;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formMode === 'new' || formMode === 'existing') {
        const finalLinks = links
          .filter(link => link.trim() !== '')
          .map(link => formatToEmbedUrl(link.trim()));

        if (finalLinks.length === 0) {
          setMessage({ type: 'error', text: 'Please add at least one valid video link.' });
          return;
        }

        if (formMode === 'new') {
          if (!imageFile) {
            setMessage({ type: 'error', text: 'Please upload a course thumbnail image.' });
            return;
          }

          const submitData = new FormData();
          submitData.append('name', formData.name);
          submitData.append('id', Number(formData.id));
          submitData.append('nLecture', Number(formData.nLecture));
          submitData.append('image', imageFile); 
          submitData.append('link', JSON.stringify(finalLinks)); 

          const res = await fetch('https://studytop-backend.onrender.com/addC', {
            method: 'POST',
            body: submitData,
            credentials: 'include' 
          });

          const data = await res.json();
          if (data.a === "h") handleSuccess('Course Added Successfully.');
          else handleError();

        } else {
          const appendData = {
            id: Number(formData.id),
            newLinks: finalLinks
          };

          const res = await fetch('https://studytop-backend.onrender.com/appendC', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appendData),
            credentials: 'include' 
          });

          const data = await res.json();
          if (data.a === "h") handleSuccess('Links Added to Existing Course.');
          else handleError();
        }
      } else if (formMode === 'certificate') {
        const certData = {
          id: formData.certId,
          studentName: formData.studentName,
          courseName: formData.courseName
        };

        const res = await fetch('https://studytop-backend.onrender.com/addCert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(certData),
          credentials: 'include' 
        });

        const data = await res.json();
        if (data.c === "h") handleSuccess('Certificate Generated Successfully.');
        else handleError();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Server Error. Cannot connect.' });
    }
  };

  const handleSuccess = (text) => {
    setMessage({ type: 'success', text });
    setFormData({ name: '', id: '', nLecture: '', studentName: '', courseName: '', certId: '' });
    setLinks(['']);
    setImageFile(null);
    if (document.getElementById('course-image')) document.getElementById('course-image').value = '';
  };

  const handleError = () => {
    setMessage({ type: 'error', text: 'Access Denied: You are not an Admin.' });
  };

  const Icons = {
    plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
    upload: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
  };

  return (
    <div className="add-wrapper">
      <div className="bg-glow top-left"></div>
      <div className="bg-glow bottom-right"></div>
      
      <div className="add-container fade-in-up">
        <div className="add-header">
          <h2>Admin <span>Dashboard</span></h2>
          <p>Create courses, add videos, or generate certificates.</p>
        </div>

        <div className="mode-toggle">
          <button className={`toggle-btn ${formMode === 'new' ? 'active' : ''}`} onClick={() => setFormMode('new')}>
            New Course
          </button>
          <button className={`toggle-btn ${formMode === 'existing' ? 'active' : ''}`} onClick={() => setFormMode('existing')}>
            Add Videos
          </button>
          <button className={`toggle-btn ${formMode === 'certificate' ? 'active' : ''}`} onClick={() => setFormMode('certificate')}>
            Generate Cert
          </button>
        </div>

        {message && <div className={`message-box ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit} className="add-form">
          {formMode === 'certificate' ? (
            <div className="slide-down">
              <div className="input-group">
                <label>Certificate ID</label>
                <input type="text" name="certId" placeholder="e.g. CRT-2026-ABX" value={formData.certId} onChange={handleInputChange} required />
              </div>
              <div className="input-group">
                <label>Student Name</label>
                <input type="text" name="studentName" placeholder="e.g. John Doe" value={formData.studentName} onChange={handleInputChange} required />
              </div>
              <div className="input-group">
                <label>Course Name</label>
                <input type="text" name="courseName" placeholder="e.g. Master React in 30 Days" value={formData.courseName} onChange={handleInputChange} required />
              </div>
            </div>
          ) : (
            <>
              {formMode === 'new' && (
                <div className="input-group slide-down">
                  <label>Course Title</label>
                  <input type="text" name="name" placeholder="e.g. Master React in 30 Days" value={formData.name} onChange={handleInputChange} required />
                </div>
              )}

              <div className="form-row slide-down">
                <div className="input-group">
                  <label>Course ID</label>
                  <input type="number" name="id" placeholder="e.g. 101" value={formData.id} onChange={handleInputChange} required />
                </div>

                {formMode === 'new' && (
                  <div className="input-group">
                    <label>Total Lectures</label>
                    <input type="number" name="nLecture" placeholder="e.g. 45" value={formData.nLecture} onChange={handleInputChange} required />
                  </div>
                )}
              </div>

              {formMode === 'new' && (
                <div className="input-group slide-down">
                  <label>Course Thumbnail (Image)</label>
                  <div className="file-upload-wrapper">
                    <input type="file" id="course-image" name="image" accept="image/*" onChange={handleFileChange} className="file-input" required />
                    <label htmlFor="course-image" className="file-upload-label">
                      {Icons.upload}
                      <span>{imageFile ? imageFile.name : 'Choose Image from PC'}</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="links-section slide-down">
                <label>{formMode === 'new' ? 'Initial Lecture Links' : 'New Video Links to Append'}</label>
                <div className="links-list">
                  {links.map((link, index) => (
                    <div key={index} className="link-item">
                      <span className="link-number">{index + 1}</span>
                      <input type="text" placeholder="https://www.youtube.com/watch?v=..." value={link} onChange={(e) => handleLinkChange(index, e.target.value)} required />
                      {links.length > 1 && (
                        <button type="button" className="icon-btn danger" onClick={() => removeLinkField(index)}>{Icons.trash}</button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" className="add-link-btn" onClick={addLinkField}>{Icons.plus} Add Another Video Link</button>
              </div>
            </>
          )}

          <div className="action-buttons">
            <button type="button" className="btn-secondary" onClick={() => navigate('/')}>Back to Home</button>
            <button type="submit" className="btn-primary">
              {formMode === 'new' ? 'Publish Course' : formMode === 'existing' ? 'Update Course' : 'Generate Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;