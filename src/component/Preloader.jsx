import React from 'react'
import logo from '../assets/Logo2.png'

const Preloader = () => {
  return (
    <div className='preloader'>
      <img src={logo} alt="Logo" loading="eager" className='logo22'/>
    </div>
  )
}

export default Preloader