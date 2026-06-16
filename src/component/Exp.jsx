import React from 'react'
import Navbar from './Navbar'
import Background from './Background'
import Project from './ProjectSection/Project'
import GUVI from '../assets/GUVI.png'
import Squarcell from '../assets/Squarcell.png'
import REACT from '../assets/REACT.png'
import NodeC from '../assets/NodeC.png'

const Exp = () => {

  const experience = [
  {
    id: 0,
    name: "Squarecell Resource India Pvt. Ltd.",
    type: "Experience",
    hook: "As a Web Developer Intern specialized in full-stack architecture, I spearheaded the technical conceptualization, development, and delivery of responsive web applications. My core focus was on implementing robust client-server interfaces, enhancing component modularity within corporate software development pipelines, and optimizing complex database state synchronizations to deliver exceptional, high-fidelity user experiences across scalable digital platforms.",
    para: "During my structured professional tenure as a Web Developer Intern at Squarecell Resource India Pvt. Ltd. (from January 10th, 2026 to February 13th, 2026), I was actively embedded into the core engineering team under the Qskill virtual internship framework[cite: 12, 17, 22]. My primary objective was to architect, optimize, and engineer a high-performance, fully responsive coding and practice platform designed specifically for global developers, engineers, and computer science students to practice complex algorithmic problems seamlessly. To achieve this, I applied advanced fluid layout methodologies, modern CSS3 paradigms, and responsive design breakpoints that guaranteed visual consistency across an extensive matrix of viewports, including mobile devices, tablets, and wide desktop screens. On the frontend layer, I utilized React.js to construct dynamic user interfaces, managing complex asynchronous client state synchronization and minimizing unnecessary component re-renders to ensure sub-millisecond layout responsiveness. On the backend, I engineered robust server-to-client communication channels, structuring clean RESTful API routes using Node.js and Express.js to facilitate lightning-fast data fetching and secure user operations. I successfully integrated secure database pipelines using MongoDB, establishing highly optimized CRUD actions and efficient data schemas for complex computational problem tracking. This professional corporate exposure gave me deep insights into standard industry workflows, deployment automation frameworks, and modular, component-driven architecture. By maintaining strict adherence to clean code principles and DRY (Don't Repeat Yourself) development strategies, I successfully helped bridge the operational latency between server requests and UI responses. Collaborating under direct industry guidance allowed me to master version control execution via Git and GitHub, handle cross-functional feature updates, and tackle real-world development blockages in a fast-paced production environment, significantly boosting my foundational capabilities as a scalable full-stack software engineer.",
    img: Squarcell, 
    link: 0
  },
  {
    id: 1,
    name: "ScholarHat (Dot Net Tricks)",
    type: "Certification",
    hook: "Successfully achieved an elite professional qualification by mastering the structural foundations of ReactJS framework architecture. The comprehensive specialization validated my technical proficiency in advanced component lifecycle execution, state management paradigms, hooks optimization hooks synchronizations, declarative UI programming, performance profiling, and building complex modern frontend systems tailored for fast-paced commercial production environments.",
    para: "I successfully earned my professional credentials in frontend engineering by completing the intensive ReactJS Foundations Course certified by ScholarHat (Dot Net Tricks) on June 8th, 2026, under Certificate ID: MX5Z080626[cite: 5, 6, 7]. This comprehensive academic specialization was designed to provide deep structural expertise in the foundational and advanced mechanisms of the React.js ecosystem. Throughout the course, I systematically mastered component-driven development, building modular, reusable, and maintainable UI elements that scale effectively in large web architectures. The curriculum covered advanced state management philosophies, where I practiced separating business logic from presentation layers using core React hooks like useState, useEffect, useMemo, and useCallback to handle background tasks and heavy client data processing. I gained hands-on expertise in synchronous and asynchronous data flow coordination, mapping out client-side API integrations, and implementing smooth routing strategies. Additionally, the training focused heavily on virtual DOM mechanics, performance tuning, and optimizing reconciliation processes to prevent interface lag under heavy operational loads. By tackling real-world project scenarios, I mastered data passing through complex components using props validation, context APIs, and proper state lifting patterns. This certification confirms my ability to write highly performant, semantic JavaScript (ES6+) and design reactive, user-centric web applications from scratch according to current industry guidelines. The authenticity of this specialization is securely verified on the corporate validation portal, proving my technical readiness to engineer responsive, highly interactive frontend layers for enterprise-level web ecosystems and modern scalable software platforms.",
    img: REACT,
    link: 0
  },
  {
    id: 2,
    name: "GUVI Geek Networks | HCL",
    type: "Certification",
    hook: "Actively participated in a high-impact, premium industrial technical workshop centered on 'The Future of Full Stack Development Key Skills Needed in 2026'. This advanced engagement verified my strategic understanding of upcoming full-stack trends, cloud-native deployments, algorithmic optimization protocols, and modern development standards required to scale complex software products globally.",
    para: "I was recognized for my active participation and technical competence in the premium joint industrial workshop hosted by GUVI Geek Networks and HCL on May 9th, 2026. The technical summit, titled 'The Future of Full Stack Development Key Skills Needed in 2026', focused on evaluating and breaking down the next-generation architectural shifts occurring in modern software engineering frameworks. During this workshop, industry leaders and engineering executives mapped out critical technological advancements, including real-time bi-directional data flow designs, serverless computing modules, and edge-side rendering techniques that are becoming standard in global software production. I engaged deeply with case studies detailing how large-scale enterprise systems handle concurrent user traffic using technologies like Socket.io for low-latency communication, alongside advanced database clustering and aggregation methodologies in MongoDB. The workshop highlighted the importance of picking up advanced cross-functional skills, combining flexible MERN stack engineering with performance-centric data structure practices in C++ and Java to optimize algorithmic runtime and computational pipelines. We analyzed how full-stack systems integrate artificial intelligence engines and orchestration workflows to handle modern analytical challenges, much like the patterns I applied in my independent projects. This technical seminar greatly expanded my perspective on software system design, responsive layout scaling, and robust development methodologies. It confirmed my engineering direction, ensuring my current practices align perfectly with commercial benchmarks, clean code strategies, and high-performance product deployments tailored for the tech landscape.",
    img: GUVI,
    link: 0
  },
  {
    id: 3,
    name : "Node js Certification from SCALER",
    type: "Certification",
    hook: "Successfully completed the Node.js Certification from SCALER, demonstrating proficiency in server-side development, asynchronous programming, and building scalable web applications using Node.js.",
    para: "I earned my Node.js Certification from SCALER, which provided me with a deep understanding of server-side development using Node.js. The course covered essential topics such as event-driven architecture, non-blocking I/O, and building RESTful APIs. I gained hands-on experience in creating scalable web applications, managing databases, and implementing authentication and authorization mechanisms. This certification has enhanced my ability to develop efficient backend solutions and has prepared me for real-world challenges in full-stack development.",
    img: NodeC,
    link: 0
  }
];

  return (
    <div>
      <Background>
        <Navbar />
        <div className="full1">
        {
        experience.map((o) => {
        return <Project 
                  st="Experience No. "
                  num={o.id + 1}
                  name={o.name}
                  hook={o.hook}
                  para={o.para}
                  img={o.img}
                  link={o.link}
        />
      })
}
      </div>
      </Background>
    </div>
  )
}

export default Exp