import React from 'react'
import Navbar from './Navbar'
import Background from './Background'
import Project from './ProjectSection/Project'
import GUVI from '../assets/GUVI.png'
import Squarcell from '../assets/Squarcell.png'
import REACT from '../assets/REACT.png'
import NodeC from '../assets/NodeC.png'
import SquarCellCert from '../assets/SquarCell.pdf'
import SquarCellLorCert from '../assets/SquarCell_LOR.pdf'
import ReactCert from '../assets/React_Certificate.pdf'

const Exp = () => {

  const experience = [
  {
    id: 0,
    name: "Squarecell Resource India Pvt. Ltd. (Web Developer Intern)",
    type: "Experience & Internship",
    hook: "Spearheaded full-stack web application development as a Web Developer Intern, engineering robust client-server interfaces, component modularity, and database state synchronization to deliver high-fidelity user experiences.",
    para: "During my structured professional tenure as a Web Developer Intern at Squarecell Resource India Pvt. Ltd. (from January 10th, 2026 to February 13th, 2026), I was actively embedded into the core engineering team under the Qskill virtual internship framework. My primary objective was to architect, optimize, and engineer a high-performance, fully responsive coding and practice platform. On the frontend layer, I utilized React.js to construct dynamic user interfaces and fluid layouts. On the backend, I engineered clean RESTful API routes using Node.js and Express.js with MongoDB data pipelines, cutting data latency by 40% and page load times by 35%. Collaborating under direct industry guidance allowed me to master version control via Git/GitHub, handle cross-functional sprints, and tackle production-level challenges.",
    img: Squarcell, 
    docLink: SquarCellCert,
    link: null
  },
  {
    id: 1,
    name: "ScholarHat (Dot Net Tricks) — ReactJS Foundations",
    type: "Certified Specialization",
    hook: "Mastered the structural foundations of ReactJS framework architecture, validating technical proficiency in component lifecycle execution, hooks optimization, state management, and modern frontend design.",
    para: "Successfully earned professional credentials in frontend engineering by completing the intensive ReactJS Foundations Course certified by ScholarHat (Dot Net Tricks) on June 8th, 2026, under Certificate ID: MX5Z080626. Throughout the specialization, I systematically mastered component-driven development, building modular, reusable, and maintainable UI elements that scale effectively. Practiced state management using core hooks (useState, useEffect, useMemo, useCallback), virtual DOM mechanics, performance tuning, and optimizing reconciliation processes to eliminate UI latency under heavy operational loads.",
    img: REACT,
    docLink: ReactCert,
    link: null
  },
  {
    id: 2,
    name: "GUVI Geek Networks × HCL — Future of Full Stack",
    type: "Industrial Technical Summit",
    hook: "Recognized for active participation and technical competence in the premium joint industrial summit 'The Future of Full Stack Development: Key Skills Needed in 2026' hosted by GUVI Geek Networks and HCL.",
    para: "Engaged in a high-impact technical workshop (Certificate ID: 1470Sc8433G767D5ZA) focused on evaluating next-generation architectural shifts in full-stack software engineering. Topics included real-time bi-directional data flow architectures, cloud-native deployments, algorithmic runtime optimization in C++/Java, serverless computing modules, and low-latency communication using Socket.io and MongoDB database clustering for concurrent user loads.",
    img: GUVI,
    docLink: GUVI,
    link: null
  },
  {
    id: 3,
    name: "SCALER — Node.js Certification",
    type: "Backend Certification",
    hook: "Earned the official Node.js Certification from SCALER, demonstrating proficiency in server-side development, non-blocking I/O event loops, and building scalable RESTful web APIs.",
    para: "Completed the Node.js specialization from SCALER, covering core backend architecture, event-driven programming, asynchronous workflows, database integration with MongoDB/SQL, and secure token-based authentication protocols. This credential confirms readiness to build enterprise backend microservices and reliable client-server data flows.",
    img: NodeC,
    docLink: NodeC,
    link: null
  },
  {
    id: 4,
    name: "Squarecell Resource India Pvt. Ltd. — Letter of Recommendation (LOR)",
    type: "Official Recommendation",
    hook: "Awarded an official Letter of Recommendation (LOR) from corporate leadership at Squarecell for demonstrating exemplary problem-solving skills, MERN architecture mastery, and teamwork.",
    para: "Honored with a corporate Letter of Recommendation (LOR) following outstanding performance during the software engineering internship at Squarecell Resource India Pvt. Ltd. The recommendation commends my dedication to clean, modular code, ability to deliver responsive frontends and resilient Node.js / Express.js REST APIs ahead of sprint deadlines, and proactive analytical problem-solving.",
    img: Squarcell,
    docLink: SquarCellLorCert,
    link: null
  }
];

  return (
    <div>
      <Background>
        <Navbar />
        <div className="full1">
          <div className="section-title-banner">
            <h2>Experience &amp; Certifications</h2>
            <p>Verified industry credentials, corporate internship achievements, and technical specializations</p>
          </div>
          {
            experience.map((o) => {
              return <Project 
                key={o.id}
                st="Credential No."
                num={o.id + 1}
                name={o.name}
                type={o.type}
                hook={o.hook}
                para={o.para}
                img={o.img}
                link={o.link}
                docLink={o.docLink}
              />
            })
          }
        </div>
      </Background>
    </div>
  )
}

export default Exp