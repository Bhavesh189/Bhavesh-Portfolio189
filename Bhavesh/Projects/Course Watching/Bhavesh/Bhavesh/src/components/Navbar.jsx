import React from 'react'
import './css/Navbar.css'
import logo from '../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Preloader from './Preloader'

const Navbar = () => {

  const navigate = useNavigate();
  const location = useLocation();

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
    async function checkAuth() {
      try {
        const response = await fetch('https://studytop-backend.onrender.com/check', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        if (data.f === "n" && location.pathname !== "/login") {
          navigate("/login");
        }
      } catch (e) {
        console.error("Auth check failed:", e);
      }
    }
    checkAuth();
  }, [navigate, location.pathname]);



  return (
    <>
    <Preloader key={location.pathname}/>
    
    <div className='nav'>
      <img src={logo} alt="Logo" onClick={() => navi('/')} />


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