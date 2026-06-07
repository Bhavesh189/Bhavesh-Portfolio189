import React from 'react'
import Backgroundd from '../assets/Backgroundd.mp4' 

const Background = ({ children }) => {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <video 
        src={Backgroundd} 
        autoPlay 
        muted 
        loop 
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}

export default Background