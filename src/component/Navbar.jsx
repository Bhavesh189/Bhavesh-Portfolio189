import React, { useRef } from 'react'
import Logo1 from '../assets/Logo2.png'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import pdff from '../assets/BhaveshResume189.pdf'
import { useState } from 'react'

const Navbar = () => {

  const navigate = useNavigate();
  const [bars, setBars] = useState(true);

  function handlleClick() {
    if(bars)
    ulRef.current.style.right = "0";
  else ulRef.current.style.right = "-40%";
    setBars(prev => !prev);
  }

  let ulRef = useRef();

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
            <li onClick={()=> {
              navigate('/about');
            }}>About</li>
            <li onClick={()=> {
              navigate('/exp');
            }}>Experience</li>
            <li onClick={()=> {
              navigate('/projects');
            }}>Projects</li>
            <li onClick={()=> {
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