import React from 'react'
import './css/Navbar.css'
import logo from '../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Preloader from './Preloader'

const Navbar = () => {

  const navigate = useNavigate();

  const [isOpen, setOpen] = useState(false);
  const [change, isChange] = useState(false)

  function handleClick() {
    setOpen(prev => !prev);
  }

  function navi(path) {
    navigate(path);
    setOpen(false);
  }

   useEffect(() => {
    const res = fetch('https://studytop-backend.onrender.com/check', {
      method: 'get',
      credentials: 'include'
    });
    if (res.f == "n") {
      navigate("/login");
    }
  }, [navigate]);



  return (
    <>
    <Preloader key={location.pathname}/>
    
    <div className='nav'>
      <img src={logo} alt="Logo" />


      <FontAwesomeIcon icon={isOpen ? faXmark : faBars} onClick={handleClick} className='bars'/>
      
      <ul  style={{right : isOpen ? "0" : "-70%"}}>
        <li onClick={()=> navi('/')}>Home</li>
        <li onClick={()=> {
          navi('/courses')
          isChange(prev => !prev)
        }}>Courses</li>
        <li onClick={()=> {
          navi('/account')
          isChange(prev => !prev)
        }}>Account</li>
      </ul>
    </div>
  </>
  )
}

export default Navbar