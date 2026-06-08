import React from 'react'
import Navbar from './Navbar'
import Background from './Background'
import Bhavesh from '../assets/Bhavesh.png'
import Card from './Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faCode } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import Typewriter from 'typewriter-effect';
import Preloader from './Preloader'

const Home = () => {
    const [load, setLoad] = useState(true);

    const ImgStyle = {
      height : "200px",
      width : "200px",
    };

    useEffect(()=> {

      const stop = setTimeout(()=> {
      setLoad(false);
    }, 1100);

    return ()=> {
      clearInterval(stop);
    }

    }, [])


  return (

    <div>
      {
        load  &&
      <Preloader />
      }
        <Background>
      <Navbar />
      <div className="links">
        <a href="https://www.linkedin.com/in/bhaveshsharmainfinity" aria-label="LinkedIn"><FontAwesomeIcon icon={faLinkedin} /></a>
        <a href="https://github.com/Bhavesh189" aria-label="GitHub"><FontAwesomeIcon icon={faGithub} /></a>
        <a href="https://leetcode.com/u/bhavesh1899287/" aria-label="LeetCode"><FontAwesomeIcon icon={faCode} /></a>
        <a href="https://www.instagram.com/" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
      </div>
      <div className="whole">
        <div className="g" style={{'--hover-scale' : "scale(1)"}}>
        <Card skillImg={Bhavesh} name="Bhavesh Sharma" stylee={ImgStyle} />
        </div>
        <div className="f">
        <h1>Hi, I am

          <span style={{color : 'red'}}>
          
          <Typewriter 
          
          options={{
            strings: [' Bhavesh Sharma', ' a Full Stack Developer', ' a MERN Programmer'],
                autoStart: true,
                loop: true,
                delay: 75,
                deleteSpeed: 50
          }}
          />
          </span>
          </h1><br /> <br />
        <p>
  I am an ambitious, highly analytical, and detail-oriented Computer Science Engineering student and full-stack developer based in Alwar, Rajasthan. Currently pursuing my Bachelor of Technology (B.Tech) in Computer Science Engineering (2025–2029 cohort) at the Laxmi Devi Institute of Technology and Engineering, I have systematically built a strong foundation in modern software development methodologies, real-time data architecture, and algorithmic problem-solving. Prior to my engineering journey, I completed my senior secondary education with a core focus on Physics, Chemistry, and Mathematics (PCM) at Star Public Sr. Sec. School (2024–2025), which originally sparked my foundational passion for analytical reasoning, logical structures, and computational thinking.
  <br /><br />
  Driven by a relentless curiosity about how scalable systems function, I focus my technical expertise on the MERN (MongoDB, Express.js, React.js, Node.js) stack, positioning myself as a versatile frontend and backend engineer. I consistently balance my practical web development pursuits with rigorous, active practice in Data Structures and Algorithms (DSA), using languages like C++ and Java to optimize code efficiency, runtime complexity, and memory management. Beyond standard web paradigms, my technological agility extends to programming languages such as C, JavaScript, and Python, alongside a foundational grasp of machine learning utilities and data manipulation frameworks like NumPy and Pandas.
  <br /><br />
  Despite being early in my professional career, I have already gathered crucial industry-level software engineering experience. During my tenure as a Web Developer Intern at Squarecell Private Limited (January 2026 – February 2026), I engineered a fully responsive, high-performance coding platform meticulously designed to enable global developers and students to practice programming problems seamlessly. This professional engagement allowed me to master state synchronization, advanced fluid layout styling, responsive breakpoints, and client-server communication channels in a production environment.
  <br /><br />
  I firmly believe that true engineering capability is proven through building functional products that address modern digital demands. My independent project portfolio showcases my mastery over complex UI layouts, state handling, asynchronous programming, and real-time networking protocols:
  <br /><br />
  • <strong>DocAna AI:</strong> A disruptive, artificial intelligence-driven healthcare and text analysis companion. Built using HTML, CSS, JavaScript, Node.js, and Express.js, I integrated deep AI orchestration pipelines into this platform to instantly parse, summarize, and extract highly critical insights from dense clinical files and complex documents without losing vital contextual details.
  <br /><br />
  • <strong>EnterNet (Netflix Clone):</strong> A premium entertainment streaming architecture I built to emulate global modern industry standards. This high-fidelity frontend application utilizes React's modular ecosystem to manage lazy loading, rapid dynamic data fetching, media content grids, and fluid user interactions across diverse desktop and mobile viewports.
  <br /><br />
  • <strong>Real-Time Chat Application:</strong> A low-latency, cross-platform communications platform I developed using a robust backend architecture comprising Node.js, Express.js, and MongoDB. By utilizing Socket.io for persistent, real-time bi-directional networking, I successfully reduced operational latency to facilitate instant messaging capabilities among multiple concurrent users.
  <br /><br />
  To power these complex architectures, I rely on a modern development stack and professional workflow practices:
  <br /><br />
  • <strong>Frontend Technologies:</strong> React.js, HTML5, CSS3, JavaScript (ES6+), Advanced Responsive UI Design Architecture.
  <br />
  • <strong>Backend & Frameworks:</strong> Node.js, Express.js, Socket.io, RESTful API Design.
  <br />
  • <strong>Database Management:</strong> MongoDB, Database Aggregation, and CRUD Operations.
  <br />
  • <strong>Languages & Core Fundamentals:</strong> C++, JavaScript, Python, C, Data Structures & Algorithms (DSA), System Design Foundations.
  <br />
  • <strong>Data Science Utilities:</strong> NumPy, Pandas.
  <br />
  • <strong>Tools & Version Control:</strong> Git, GitHub, Component-Driven Development, and Deployment Automation.
  <br /><br />
  As a bilingual engineer fluent in both English and Hindi, I combine my robust code-writing capabilities with strong cross-functional communication skills. I am deeply committed to writing clean, maintainable, and DRY (Don't Repeat Yourself) code structures. Whether optimizing backend network pipelines with Socket.io, mapping responsive layouts with modern CSS, or engineering technical algorithm distributions for complex interview frameworks, I approach every digital challenge with a focus on high-performance execution and user-centric software design. I continue to actively seek opportunities to collaborate on large-scale web ecosystems and innovative engineering solutions.
</p>
      </div></div>
      </Background>
    </div>
  )
}

export default Home