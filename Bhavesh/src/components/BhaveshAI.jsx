import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiMinimize2 } from 'react-icons/fi';
import './BhaveshAI.css';


const RESUME_DATA = {
  education: {
    title: " Education / B.Tech Degree",
    content: "I am pursuing my B.Tech in Computer Science & Engineering at Bikaner Technical University (BTU), Bikaner (Rajasthan). Batch: 2025 – 2029. Current CGPA: 9.20 / 10. Core coursework includes: Data Structures & Algorithms (DSA), Operating Systems (OS), DBMS, Computer Networks, and Object-Oriented Programming (OOP)."
  },
  experience: {
    title: " Experience / Internship",
    content: "I worked as a Web Developer Intern at Squarecell Resource India Pvt. Ltd. (Remote, Jan 2026 – Feb 2026). During this internship, I:\n• Built a coding-practice platform on a React.js, Node.js, and Express.js stack, cutting page load time by 35%.\n• Optimized MongoDB pipelines and state sync, reducing data retrieval latency by 40%.\n• Worked in Agile sprints using Git/GitHub and CI/CD workflows."
  },
  skills: {
    title: "️ Technical Skills",
    content: "Here is my exact developer toolkit from my resume:\n• Languages: C, C++, Python, JavaScript (ES6+), Go, SQL\n• Frontend: HTML5, CSS3, React.js\n• Backend: Node.js, Express.js, REST APIs\n• Databases: MongoDB, NoSQL, SQL, JSONPowerDB\n• Tools/DevOps: Git, GitHub, Docker, Kubernetes, Postman\n• Core CS: Data Structures & Algorithms (DSA), OOP, NumPy, Pandas"
  },
  leetcode: {
    title: " LeetCode & Competitive Programming",
    content: "I have solved over 350+ data structures and algorithms (DSA) problems on LeetCode. I actively participate in competitive programming to keep my problem-solving skills sharp."
  },
  contact: {
    title: " Contact Details",
    content: "Here are my contact details from my resume:\n• Email: bhaveshyt.infinity@gmail.com\n• Phone: +91 63764 11796\n• Location: Jaipur, Rajasthan, India\n• Socials: GitHub (github.com/Bhavesh189), LinkedIn (in/bhaveshsharmainfinity)"
  },
  certifications: {
    title: " Certifications",
    content: "I hold 3 active certifications:\n1. Scala Full Stack Development: Key Skills for 2026 (GUVI Geek Networks × HCL)\n2. ReactJS Foundations (ScholarHat / Dot Net Tricks, 2026)\n3. Node.js Certification (Scaler, 2026)"
  },
  project_studytop: {
    title: " Project: StudyTop",
    content: "StudyTop (2025) is a full-stack MERN e-learning platform with REST APIs and progress tracking. It achieved a 98% Lighthouse performance score and boosted student engagement by 25% through optimized content delivery. Live: https://study-top.vercel.app/"
  },
  project_docana: {
    title: " Project: DocAna AI",
    content: "DocAna AI (2025) is an AI healthcare document assistant. It integrates the Google Gemini API to parse clinical documents, reducing manual review time by 60%. Hardened with Jest tests to 85% coverage. Live: https://bhavesh189.github.io/DocAna/"
  },
  project_enternet: {
    title: " Project: EnterNet",
    content: "EnterNet (2024) is a Netflix-style streaming experience with a modular React architecture. It reduced video buffering by 30% and was containerized using Docker for consistent cross-device environments. Live: https://bhavesh189.github.io/EnterNet/home.html"
  },
  project_notes: {
    title: " Project: Notes Web + App",
    content: "Notes Web & App (2024) is a cross-platform note-taking workspace. It utilizes a minimalist UI and optimized state sync, cutting task management time by 20% for 100+ active users. Live: https://collage-notes-chi.vercel.app/"
  },
  project_metrix: {
    title: " Project: LeetCode Metrix",
    content: "LeetCode Metrix (2025) is a competitive-programming analytics dashboard. It visualizes 50+ DSA problem-solving metrics via REST APIs to map strengths and momentum over time. Live: https://bhavesh189.github.io/LeetCodeProfile/"
  }
};


function queryResume(query) {
  const clean = query.toLowerCase();


  if (clean.includes('study') || clean.includes('learning') || clean.includes('top')) {
    return `${RESUME_DATA.project_studytop.title}\n${RESUME_DATA.project_studytop.content}`;
  }
  if (clean.includes('docana') || clean.includes('healthcare') || clean.includes('gemini') || clean.includes('medical') || clean.includes('doctor')) {
    return `${RESUME_DATA.project_docana.title}\n${RESUME_DATA.project_docana.content}`;
  }
  if (clean.includes('enternet') || clean.includes('netflix') || clean.includes('stream') || clean.includes('video')) {
    return `${RESUME_DATA.project_enternet.title}\n${RESUME_DATA.project_enternet.content}`;
  }
  if (clean.includes('notes') || clean.includes('workspace') || clean.includes('collagenotes')) {
    return `${RESUME_DATA.project_notes.title}\n${RESUME_DATA.project_notes.content}`;
  }
  if (clean.includes('metrix') || clean.includes('analytic') || clean.includes('visual')) {
    return `${RESUME_DATA.project_metrix.title}\n${RESUME_DATA.project_metrix.content}`;
  }


  if (clean.includes('education') || clean.includes('college') || clean.includes('university') || clean.includes('btu') || clean.includes('degree') || clean.includes('cgpa') || clean.includes('btech') || clean.includes('b.tech') || clean.includes('study')) {
    return `${RESUME_DATA.education.title}\n${RESUME_DATA.education.content}`;
  }
  if (clean.includes('intern') || clean.includes('experience') || clean.includes('squarecell') || clean.includes('work') || clean.includes('job') || clean.includes('history')) {
    return `${RESUME_DATA.experience.title}\n${RESUME_DATA.experience.content}`;
  }
  if (clean.includes('skill') || clean.includes('language') || clean.includes('react') || clean.includes('node') || clean.includes('python') || clean.includes('cpp') || clean.includes('c++') || clean.includes('go') || clean.includes('docker') || clean.includes('database') || clean.includes('mongodb')) {
    return `${RESUME_DATA.skills.title}\n${RESUME_DATA.skills.content}`;
  }
  if (clean.includes('leetcode') || clean.includes('dsa') || clean.includes('problem') || clean.includes('solve') || clean.includes('algo')) {
    return `${RESUME_DATA.leetcode.title}\n${RESUME_DATA.leetcode.content}`;
  }
  if (clean.includes('contact') || clean.includes('email') || clean.includes('phone') || clean.includes('number') || clean.includes('mobile') || clean.includes('mail') || clean.includes('jaipur') || clean.includes('address') || clean.includes('location')) {
    return `${RESUME_DATA.contact.title}\n${RESUME_DATA.contact.content}`;
  }
  if (clean.includes('certification') || clean.includes('guvi') || clean.includes('scholarhat') || clean.includes('scaler')) {
    return `${RESUME_DATA.certifications.title}\n${RESUME_DATA.certifications.content}`;
  }
  if (clean.includes('project') || clean.includes('build') || clean.includes('ship')) {
    return `Bhavesh has built 5 major projects documented in his resume:\n1. **StudyTop** (MERN platform)\n2. **DocAna AI** (AI clinical assistant)\n3. **EnterNet** (Netflix clone)\n4. **Notes Web + App** (Productivity note taker)\n5. **LeetCode Metrix** (DSA dashboard)\nAsk me about any specific project name for exact metrics! `;
  }


  if (clean.includes('hi') || clean.includes('hello') || clean.includes('hey') || clean.includes('sup') || clean.includes('greet')) {
    return "Hi! I am Bhavesh's AI Assistant. Ask me anything directly from his resume — including skills, education at BTU, intern work at Squarecell, certifications, or projects! ";
  }


  return `I can search and output facts strictly from Bhavesh's resume. Please ask about:
• **Education / CGPA** (B.Tech at BTU)
• **Work Experience** (Squarecell Internship)
• **Technical Skills** (MERN, Go, Python, SQL, Docker)
• **Projects** (StudyTop, DocAna AI, EnterNet, Notes, Metrix)
• **LeetCode Stats** (350+ solved problems)
• **Contact Info** (Email, phone, location)
• **Certifications** (Scaler, GUVI, ScholarHat)`;
}

export default function BhaveshAI({ autoOpen = false }) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hey! I am Bhavesh's AI Assistant. Ask me any details about my skills, B.Tech studies, projects, or internship, and I will answer directly from my resume!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-bhavesh-ai', handleOpen);
    return () => window.removeEventListener('open-bhavesh-ai', handleOpen);
  }, []);

  useEffect(() => {
    if (autoOpen) setIsOpen(true);
  }, [autoOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);


    setTimeout(() => {
      const resumeResponse = queryResume(input);

      const botMessage = {
        sender: 'bot',
        text: resumeResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <>
      {}
      <div className="ai-launcher">
        <button
          className="ai-launch-btn"
          onClick={() => setIsOpen(true)}
          title="Chat with Bhavesh AI!"
          aria-label="Chat with Bhavesh AI"
        >
          <FiMessageSquare size={20} />
          <span className="ai-pulse" />
        </button>
      </div>

      {}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-chat-window glass"
            initial={{ y: 80, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 80, scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
          >
            {}
            <div className="ai-chat-header">
              <div className="ai-header-profile">
                <div className="ai-profile-avatar">∞</div>
                <div>
                  <h4 className="ai-profile-name">Bhavesh AI</h4>
                  <span className="ai-profile-status">resume scanner</span>
                </div>
              </div>
              <div className="ai-header-actions">
                <button className="ai-action-btn" onClick={() => setIsOpen(false)} aria-label="Minimize Chat Window">
                  <FiMinimize2 size={16} />
                </button>
                <button className="ai-action-btn" onClick={() => setIsOpen(false)} aria-label="Close Chat Window">
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {}
            <div className="ai-chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`ai-message-row ${msg.sender === 'user' ? 'is-user' : 'is-bot'}`}>
                  {msg.sender === 'bot' && <div className="ai-msg-avatar">BS</div>}
                  <div className="ai-msg-bubble">
                    <p className="ai-msg-text">{msg.text}</p>
                    <span className="ai-msg-time">{msg.time}</span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="ai-message-row is-bot">
                  <div className="ai-msg-avatar">BS</div>
                  <div className="ai-msg-bubble typing-bubble">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {}
            <form className="ai-chat-input-form" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Ask about MERN, LeetCode, projects..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={120}
              />
              <button type="submit" className="ai-send-btn" aria-label="Send message">
                <FiSend size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
