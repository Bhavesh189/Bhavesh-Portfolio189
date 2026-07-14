import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Courses from './Courses';
import './css/Home.css';
import { TypeAnimation } from 'react-type-animation';
import { useState } from 'react';

const Home = () => {

  function scrollInto() {
    const coursesSection = document.querySelector('.courses-section');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const [students, setStudents] = useState(0);

  useEffect(()=> {
    let y = false;
    let x = setInterval(()=> {
      setStudents((prev) => {
        if(prev >= 500) {
          clearInterval(x)
          return 500;
        }
        return prev+1;
      })
    },40)
  }, [])

  return (
    <div className="home-wrapper">
      <Navbar />

      <section className="hero-section">
        <div className="hero-bg-glow glow-1"></div>
        <div className="hero-bg-glow glow-2"></div>

        <div className="hero-content fade-in-up">
          
          
          <h1 className="hero-title">
            Master <span>Dev & DSA</span> <br/> Like a Pro Developer.
          </h1>
          
          <p className="hero-subtitle">
            Premium courses, real-world projects, and a community of high-achievers.
            Start your journey from absolute beginner to industry-ready today.
          </p>
          
          <div className="hero-buttons">
            <button className="btn-primary" onClick={scrollInto} style={{background: "linear-gradient(135deg, #0fd2a8, #167136)"}} >Explore Courses</button>
            <button className="btn-secondary"><a href="https://bhavesh-portfolio189.vercel.app/">Contact Admin For Pirated Content </a></button>
          </div>
          <div className="badge">
            
            
                  <TypeAnimation
              sequence={[
                'Understand Concept Deeply',
                1000,
                'Get Placed By Learning',
                1000,
                'Start your journey today',
                1000
              ]}
              wrapper="span"
              speed={50}
              style={{ fontSize: '1rem', fontWeight: 'bold', display: 'inline-block'}}
              repeat={Infinity}
            />
          </div>

          <div className="hero-stats">
            <div className="stat"><strong>{students}k+</strong> Students</div>
            <div className="stat"><strong>4.9/5</strong> Average Rating</div>
            <div className="stat"><strong>100%</strong> Practical</div>
          </div>
        </div>
      </section>

      <Courses />
    </div>
  );
}

export default Home;