import React from 'react'

const Card = ({skillImg, name, stylee}) => {
  return (
    <div className='card'>
      <img src={skillImg} alt="SkillImage" style={stylee}/>
      <h2 style={{color : "Black"}}>{name}</h2>
    </div>
  )
}

export default Card