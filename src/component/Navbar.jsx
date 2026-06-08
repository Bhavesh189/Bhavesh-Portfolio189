import React, { useRef } from 'react'
import Logo1 from '../assets/Logo2.png'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import pdff from '../assets/BhaveshResume189.pdf'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate();
  const [bars, setBars] = useState(true);
  const location = useLocation();

  function handlleClick() {
    if(bars)
    ulRef.current.style.right = "0";
  else ulRef.current.style.right = "-70%";
    setBars(prev => !prev);
  }

  let ulRef = useRef();

  const activeStyle = {
    borderBottom : "2px solid red",
    paddingBottom : '5px'
  };

  return (
    <div>
      <nav>
        <div className="c">
        <img src={Logo1} alt="Logo" className='logo'/>
        </div>

        
        {  bars ?
          <FontAwesomeIcon icon={faBars} className='barss' onClick={handlleClick} />
        : <FontAwesomeIcon icon={faXmark} className='barss barsss' onClick={handlleClick} />
        }


        <ul ref={ulRef}>
            <li style={location.pathname == '/' ? activeStyle : {}} onClick={()=> {
              navigate('/'); 
            }}>Home</li>
            <li style={location.pathname == '/skills' ? activeStyle : {}} onClick={()=> {
              navigate('/skills'); 
            }}>Skills</li>
            <li style={location.pathname == '/exp' ? activeStyle : {}} onClick={()=> {
              navigate('/exp'); 
            }}>Experience</li>
            <li style={location.pathname == '/projects' ? activeStyle : {}} onClick={()=> {
              navigate('/projects'); 
            }}>Projects</li>
            <li style={location.pathname == '/contact' ? activeStyle : {}} onClick={()=> {
              navigate('/contact'); 
            }}>Contact</li>
            <a href={pdff} target="_blank" rel="noopener noreferrer">
              <li>Resume</li>
            </a>
        </ul>
      </nav>
      
    </div>
  )
}

export default Navbar