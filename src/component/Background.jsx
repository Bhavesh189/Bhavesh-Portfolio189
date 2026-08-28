import React from 'react'
import Backgroundd from '../assets/Backgroundd.mp4' 

const Background = ({ children }) => {
  return (
    <div className="bg-wrapper">
      <video 
        src={Backgroundd} 
        autoPlay 
        muted 
        loop 
        playsInline
        className="bg-video"
      />
      <div className="bg-overlay" />
      <div className="bg-content">
        {children}
      </div>
    </div>
  )
}

export default Background