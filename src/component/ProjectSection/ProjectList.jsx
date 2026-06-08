import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark, faArrowRight, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const ProjectList = ({number, name, scrollTo}) => {
  return (
    <div className='list' onClick={scrollTo}>
      <p>{number}.</p>
      <h6>{name}</h6>
      <div className='x' title='Go on This Project'>
      <FontAwesomeIcon icon={faRightFromBracket} />
      </div>
    </div>
  )
}

export default ProjectList