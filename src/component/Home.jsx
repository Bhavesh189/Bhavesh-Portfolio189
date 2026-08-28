import React from 'react'
import Navbar from './Navbar'
import Background from './Background'
import Bhavesh from '../assets/Bhavesh.png'
import Card from './Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faCode, faTrophy, faFire } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import Typewriter from 'typewriter-effect'
import Preloader from './Preloader'

const Home = () => {
    const [load, setLoad] = useState(true);

    const ImgStyle = {
      height : "220px",
      width : "220px",
      objectFit : "cover",
      borderRadius : "50%"
    };

    useEffect(()=> {
      const stop = setTimeout(()=> {
        setLoad(false);
      }, 1000);

      return ()=> {
        clearInterval(stop);
      }
    }, [])

  return (
    <div>
      {load && <Preloader />}
      <Background>
        <Navbar />
        <div className="links">
          <a href="https://www.linkedin.com/in/bhaveshsharmainfinity" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FontAwesomeIcon icon={faLinkedin} /></a>
          <a href="https://github.com/Bhavesh189" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FontAwesomeIcon icon={faGithub} /></a>
          <a href="https://leetcode.com/u/bhavesh1899287/" target="_blank" rel="noopener noreferrer" aria-label="LeetCode"><FontAwesomeIcon icon={faCode} /></a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
        </div>

        <div className="whole">
          <div className="profile-sidebar">
            <div className="g" style={{'--hover-scale' : "scale(1.02)"}}>
              <Card skillImg={Bhavesh} name="Bhavesh Sharma" stylee={ImgStyle} />
            </div>

            {/* Live LeetCode Analytics Widget */}
            <div className="leetcode-home-card">
              <div className="lc-card-header">
                <div className="lc-title-group">
                  <FontAwesomeIcon icon={faCode} className="lc-icon" />
                  <span className="lc-title">LeetCode Metrics</span>
                </div>
                <a href="https://leetcode.com/u/bhavesh1899287/" target="_blank" rel="noopener noreferrer" className="lc-badge-link">
                  Profile ↗
                </a>
              </div>

              <div className="lc-main-stat">
                <div className="lc-total-solved">
                  <span className="lc-num">419</span>
                  <span className="lc-sub">/ 4,033 Solved</span>
                </div>
                <div className="lc-rating-pill">
                  <FontAwesomeIcon icon={faTrophy} /> Rating 1,611
                </div>
              </div>

              <div className="lc-breakdown">
                <div className="lc-diff-bar">
                  <div className="lc-diff-info">
                    <span className="diff-tag easy">Easy</span>
                    <span className="diff-count">163 / 961</span>
                  </div>
                  <div className="diff-progress-track">
                    <div className="diff-progress-fill easy" style={{ width: `${(163/961)*100}%` }}></div>
                  </div>
                </div>

                <div className="lc-diff-bar">
                  <div className="lc-diff-info">
                    <span className="diff-tag medium">Medium</span>
                    <span className="diff-count">225 / 2,105</span>
                  </div>
                  <div className="diff-progress-track">
                    <div className="diff-progress-fill medium" style={{ width: `${(225/2105)*100}%` }}></div>
                  </div>
                </div>

                <div className="lc-diff-bar">
                  <div className="lc-diff-info">
                    <span className="diff-tag hard">Hard</span>
                    <span className="diff-count">31 / 967</span>
                  </div>
                  <div className="diff-progress-track">
                    <div className="diff-progress-fill hard" style={{ width: `${(31/967)*100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="lc-chips-grid">
                <div className="lc-chip">
                  <span className="chip-label">Global Rank</span>
                  <span className="chip-val">#290,526</span>
                </div>
                <div className="lc-chip">
                  <span className="chip-label">Max Streak</span>
                  <span className="chip-val"><FontAwesomeIcon icon={faFire} style={{color: '#f97316'}} /> 277 Days</span>
                </div>
                <div className="lc-chip">
                  <span className="chip-label">Annual Solves</span>
                  <span className="chip-val">914 subs</span>
                </div>
                <div className="lc-chip">
                  <span className="chip-label">Top Skill</span>
                  <span className="chip-val">C++ (415)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="f">
            <h1>Hi, I am{' '}
              <span className="typewriter-span">
                <Typewriter 
                  options={{
                    strings: ['Bhavesh Sharma', 'a Full Stack Developer', 'a MERN Architect', 'a Problem Solver (419+ Solved)'],
                    autoStart: true,
                    loop: true,
                    delay: 65,
                    deleteSpeed: 45
                  }}
                />
              </span>
            </h1>
            <p>
              I am an ambitious, highly analytical, and detail-oriented Computer Science Engineering student and full-stack developer based in Jaipur / Alwar, Rajasthan. Currently pursuing my Bachelor of Technology (B.Tech) in Computer Science Engineering (2025–2029 cohort) with a current CGPA of 9.20, I have systematically built a strong foundation in modern software engineering, scalable cloud architectures, and competitive programming.
              <br /><br />
              Driven by curiosity about how high-throughput systems scale, my core technical expertise is centered around the MERN (MongoDB, Express.js, React.js, Node.js) and Go backend architectures. I balance product development with disciplined daily practice in Data Structures and Algorithms (DSA), holding <strong>419+ solved problems on LeetCode</strong> (Contest Rating 1,611, Max Streak 277 Days, 200 Days Badge 2026) and strong foundations in C++, C, JavaScript, and Python.
              <br /><br />
              I have gathered practical industry experience through professional software engineering internships, including my tenure as a Web Developer Intern at Squarecell Resource India Pvt. Ltd., where I engineered responsive coding platform modules that improved data latency by 40% and reduced page load times by 35%.
              <br /><br />
              • <strong>DocAna AI:</strong> An artificial intelligence-driven clinical and document analysis assistant integrating Google's Gemini API for instantaneous, context-preserving clinical report summarization.
              <br /><br />
              • <strong>EnterNet (Streaming Platform):</strong> A modular, high-fidelity media streaming platform emulating modern Netflix-style video carousels, responsive rendering, and smooth state handling.
              <br /><br />
              • <strong>LeetCode Metrix:</strong> An analytics dashboard visualizing 50+ DSA problem-solving metrics and consistency trends via REST APIs.
              <br /><br />
              • <strong>Core Competencies:</strong> React.js, Node.js, Express.js, MongoDB, Go, C++, REST APIs, Docker, Git/GitHub, System Design Foundations, NumPy, Pandas.
            </p>
          </div>
        </div>
      </Background>
    </div>
  )
}

export default Home