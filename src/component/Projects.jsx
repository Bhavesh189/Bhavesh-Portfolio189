import React from 'react'
import Navbar from './Navbar'
import Background from './Background'
import Project from './ProjectSection/Project'
import DocAna from '../assets/DOCANA.png'
import Taskwave from '../assets/Taskwave.png'
import Notes from '../assets/Notes.png'
import Enternet from '../assets/Enternet.png'
import Leetcode from '../assets/Leetcode.png'
import S from '../assets/SB.png'
import ProjectList from './ProjectSection/ProjectList'
import { useRef } from 'react'


const Projects = () => {

  const projectRef = useRef({});

  const scrollTo = (id) => {
    const element = projectRef.current[id];

    if(element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block : 'start'
      });
    }
  }

  const ProjectsList = [
  {
    id: 0,
    number: 1,
    name: "DocAna AI"
  },
  {
    id: 1,
    number: 2,
    name: "EnterNet : Netflix Clone"
  },
  {
    id: 2,
    number: 3,
    name: "Notes Web + App"
  },
  {
    id: 3,
    number: 4,
    name: "TaskWave"
  },
  {
    id: 4,
    number: 5,
    name: "Leetcode Metrix app"
  },
  {
    id: 5,
    number: 6,
    name: "Study Top"
  }
];


const details = [
  {
    id: 0,
    name: "DocAna AI",
    hook: "Stop drowning in complex medical jargon, terrifying diagnoses, and endless clinical paperwork—DocAna AI instantly weaponizes advanced intelligence to transform dense, confusing medical documents into crystal-clear, highly actionable insights you can actually understand in seconds.",
    para: "DocAna AI is a disruptive healthcare companion engineered to completely bridge the gap between complex medical diagnostics and human comprehension. Deeply integrated with Google’s cutting-edge Gemini API, the platform seamlessly parses through multi-page medical reports, chaotic doctor prescriptions, and intricate laboratory results to extract instant, human-readable summaries without losing vital context. Beyond basic summarization, it features an interactive, real-time AI medical assistant that allows users to converse with their documents, asking critical follow-up questions about symptoms, terminology, or generic alternatives. Built over a sleek, ultra-responsive React ecosystem with fortified data pipelines, DocAna AI champions absolute personal health literacy, making critical medical clarity accessible to anyone, anywhere, at any moment.",
    img: DocAna,
    link: "https://bhavesh189.github.io/DocAna/"
  },
  {
    id: 1,
    name: "EnterNet : Netflix Clone",
    hook: "Don’t just watch content, experience the future of digital streaming—EnterNet completely redefines the cinematic interface by blending pixel-perfect fluid responsiveness with real-time media rendering that keeps users hooked from the very first click.",
    para: "EnterNet is a premium, full-scale entertainment streaming architecture meticulously crafted to emulate the pristine user experience of global platforms like Netflix. Powered by React's lightning-fast component rendering and modular architecture, this application dynamically fetches live cinematic data, offering high-fidelity trailer playback, immersive carousels, and intuitive categorized carousels that mimic modern industry standards. The frontend layout leverages advanced styling frameworks to ensure zero-latency navigation, fluid micro-interactions, and flawless multi-device adaptability. By integrating secure routing and optimized image caching mechanism, EnterNet showcases an elite mastery over high-performance UI engineering, state handling, and the sophisticated delivery of modern web entertainment.",
    img: Enternet,
    link: "https://bhavesh189.github.io/EnterNet/home.html"
  },
  {
    id: 2,
    name: "Notes Web + App",
    hook: "In a world of scattered thoughts and chaotic schedules, human efficiency demands structure—Notes Web + App acts as your second brain, seamlessly capturing, organizing, and deploying your daily intellect through a pristine, hyper-productive workspace.",
    para: "Notes Web + App is a high-performance productivity ecosystem designed for modern developers, students, and professionals who cannot afford to let genius ideas slip away. Moving far beyond traditional text editors, this application provides an agile, cross-platform workspace featuring multi-format note creation, instant real-time saving mechanisms, and rich interactive components. Engineered with a heavy emphasis on state synchronization and structural rendering, it allows users to categorise, tag, and filter through hundreds of thoughts within milliseconds. The UI is built to combat cognitive fatigue, wrapping robust frontend logic inside a minimalistic, distraction-free interface that maximizes daily workflow efficiency and transforms chaotic brainstorming into perfectly structured executions.",
    img: Notes,
    link: "https://bhavesh189.github.io/CollageNotes"
  },
  {
    id: 3,
    name: "TaskWave",
    hook: "Bid farewell to missed deadlines, fractured workflows, and project anxiety—TaskWave acts as your ultimate operational command center, streamlining complex task lifecycle management into one frictionless, high-velocity sprint.",
    para: "TaskWave is an agile project management and task orchestration engine meticulously engineered to optimize productivity pipelines for fast-moving teams and individuals. Built to resolve the overhead of cluttered task tracking, this platform enables users to create, assign, prioritize, and track the lifecycle of projects through dynamic state transitions. With built-in modern drag-and-drop mechanics, immediate status filtering, and clean visual progress bars, TaskWave turns complex execution timelines into an intuitive layout. The frontend is heavily optimized to manage high-frequency state updates without UI blockages, proving absolute expertise in writing scalable, robust React logic that guarantees a highly performant, fluid user journey.",
    img: Taskwave,
    link: "https://bhavesh189.github.io/TaskWave/"
  },
  {
    id: 4,
    name: "Leetcode Metrix app",
    hook: "Stop practicing blindly in the dark and start engineering your data structure triumphs—Leetcode Metrix strips away the guesswork by transforming raw coding statistics into a gamified, hyper-analytical performance dashboard.",
    para: "Leetcode Metrix App is a comprehensive analytical tracker engineered for competitive programmers who want to optimize their technical interview preparation through raw data. By establishing secure connections with competitive coding data streams, this application pulls real-time user statistics, problem-solving distributions, and consistency metrics, presenting them through beautifully rendered, interactive data visualizations. Users can deep-dive into their daily coding speed, difficulty ratios, and global rankings through customized charts and progress algorithms. Built using highly optimized data-handling techniques on the frontend, Leetcode Metrix transforms flat, uninspiring numbers into an immersive dashboard, serving as the ultimate strategic tool for mastering DSA and engineering interview success.",
    img: Leetcode,
    link: "https://bhavesh189.github.io/LeetCodeProfile/"
  },
  {
    id: 5,
    name: "Study Top",
    hook: "In a world where knowledge is power, Study Top acts as your personal academic strategist, transforming scattered study materials into a cohesive, high-yield learning ecosystem that maximizes retention and performance.",
    para: "Study Top is a revolutionary academic management platform designed to streamline the learning process for students and educators alike. By integrating seamlessly with existing educational resources, this application provides a centralized hub for organizing notes, tracking progress, and accessing personalized study plans. With its intuitive interface and powerful analytics, Study Top empowers users to optimize their study habits and achieve superior academic results.",
    img: S,
    link: "https://study-top.vercel.app/login"
  }
];

  return (
    <div>
      <Background>
        <Navbar />
        <div className="full">
        {
          ProjectsList.map((o)=> {
            return <ProjectList number={o.number} name={o.name} scrollTo={()=> scrollTo(o.id)}/>
          })
        }
        </div>

        {
          details.map((o)=> {
            return (
              <div id={o.id} ref={(e)=> projectRef.current[o.id] = e} className='full1'>
                <Project
                  st="Project"
                  num={o.id + 1}
                  name={o.name}
                  hook={o.hook}
                  para={o.para}
                  img={o.img}
                  link={o.link}
                />
                </div>
            )
          })
        }
      </Background>
    </div>
  )
}

export default Projects