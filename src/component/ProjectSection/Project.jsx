import React from 'react'

const Project = ({ st, num, name, hook, para, img, link, docLink, type }) => {
  return (
    <div className='project'>
      <div className="project-header">
        <h1>{st} {num} : {name}</h1>
        {type && <span className="project-badge">{type}</span>}
      </div>
      <p className="project-hook">{hook}</p>
      <div className="detail">
        <p className="badaPara">{para}</p>
        {img && (
          <div className="project-img-wrap">
            <img src={img} alt={name} />
          </div>
        )}
      </div>
      <div className="project-actions">
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="proj-btn proj-btn-primary">
            <span>Live Link / Verification</span> ↗
          </a>
        )}
        {docLink && (
          <a href={docLink} target="_blank" rel="noopener noreferrer" className="proj-btn proj-btn-secondary">
            <span>View Full Document</span> 📄
          </a>
        )}
      </div>
    </div>
  )
}

export default Project