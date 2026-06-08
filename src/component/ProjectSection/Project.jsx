import React from 'react'

const Project = ({st, num, name, hook, para, img, link}) => {
  return (
    <div className='project'>
      <h1>{st} {num} : {name}</h1>
      <p>{hook}</p>
      <div className="detail">
      <p class="badaPara">{para}</p>
      <img src={img} alt="Project Image" />
    </div>
    {
      link &&
    <h1>Live Link : <a href={link}>Click Me</a></h1>
    }
    </div>
  )
}

export default Project