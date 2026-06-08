import React from 'react'
import Navbar from './Navbar'
import Background from './Background'
import Card from './Card'

// imgages

import CIMG from '../assets/CIMG.png'
import CPPIMG from '../assets/CPPIMG.png'
import CSIMG from '../assets/CSIMG.jpeg'
import CSSIMG from '../assets/CSSIMG.png'
import DSAIMG from '../assets/DSAIMG.png'
import EXPRESSIMG from '../assets/EXPRESSIMG.png'
import HTMLIMG from '../assets/HTMLIMG.png'
import JSIMG from '../assets/JSIMG.jpeg'
import MERNIMG from '../assets/MERNIMG.jpeg'
import MONGOIMG from '../assets/MONGOIMG.png'
import NODEIMG from '../assets/NODEIMG.png'
import NUMPYIMG from '../assets/NUMPYIMG.png'
import OOPSIMG from '../assets/OOPSIMG.jpeg'
import PANDASIMG from '../assets/PANDASIMG.png'
import PYTHONIMG from '../assets/PYTHONIMG.png'
import REACTIMG from '../assets/REACTIMG.png'

const About = () => {

  const skills = [
  { id: 5, skillImg: HTMLIMG, name: "HTML" },
  { id: 4, skillImg: CSSIMG, name: "CSS" },
  { id: 6, skillImg: JSIMG, name: "JAVASCRIPT" },
  { id: 7, skillImg: REACTIMG, name: "REACT.JS" },
  { id: 8, skillImg: NODEIMG, name: "NODE.js" },
  { id: 9, skillImg: EXPRESSIMG, name: "EXPRESS.js" },
  { id: 10, skillImg: MONGOIMG, name: "MONGODB" },
  { id: 11, skillImg: MERNIMG, name: "MERN STACK" },
  { id: 1, skillImg: CIMG, name: "C Language" },
  { id: 2, skillImg: CPPIMG, name: "C++" },
  { id: 12, skillImg: DSAIMG, name: "DSA" },
  { id: 13, skillImg: OOPSIMG, name: "OOPS" },
  { id: 14, skillImg: PYTHONIMG, name: "PYTHON" },
  { id: 15, skillImg: NUMPYIMG, name: "NUMPY" },
  { id: 16, skillImg: PANDASIMG, name: "PANDAS" },
  { id: 3, skillImg: CSIMG, name: "Communication Skills" }
];


  return (
    <div>
      <Background>
        <Navbar />
        <div className="holder">

          {
            skills.map((o) => {
              return <Card skillImg={o.skillImg} name={o.name}/>
            })
          }
        </div>
      </Background>
    </div>
  )
}

export default About