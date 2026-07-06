

export const profile = {
  name: 'Bhavesh Sharma',
  initials: 'BS',
  roles: [
    'MERN Stack Developer',
    'Software Developer',
    'Bug Bounty Expert',
    'Distributed Systems',
    'Competitive Programmer',
  ],
  location: 'Jaipur, Rajasthan, India',
  email: 'bhaveshyt.infinity@gmail.com',
  phone: '+91 63764 11796',
  availability: 'Open to SDE & full-stack internships / roles',
  heroLine: 'I build scalable, full-stack web experiences',
  heroSub:
    'Computer Science undergrad turning algorithms into interfaces — from React pixels to Node pipelines, with an eye on distributed systems and cybersecurity.',
};

export const socials = [
  { label: 'GitHub', short: 'github.com/Bhavesh189', href: 'https://github.com/Bhavesh189', icon: 'github' },
  { label: 'LinkedIn', short: 'in/bhaveshsharmainfinity', href: 'https://www.linkedin.com/in/bhaveshsharmainfinity', icon: 'linkedin' },
  { label: 'LeetCode', short: '350+ solved', href: 'https://leetcode.com/u/bhavesh1899287/', icon: 'code' },
  { label: 'Portfolio', short: 'thebhavesh.online', href: 'https://thebhavesh.online/', icon: 'globe' },
];

export const stats = [
  { value: '9.20', label: 'CGPA / 10', suffix: '' },
  { value: '346', label: 'DSA problems solved', suffix: '+' },
  { value: '5', label: 'Projects shipped', suffix: '' },
  { value: '3', label: 'Certifications', suffix: '' },
];

export const about = {
  paragraphs: [
    'I am a Computer Science undergraduate at Bikaner Technical University with a current CGPA of 9.20, active as a premium MERN Stack Developer, Software Developer, and Bug Bounty Expert.',
    'My comfort zone spans the full stack — crafting responsive React interfaces on the front, engineering clean Node.js and Express REST APIs on the back, and modelling data in MongoDB. Alongside product work, I sharpen fundamentals daily through 350+ solved problems on LeetCode.',
    'As a bug bounty expert, I apply a defensive security mindset to software design. Right now I am drawn to distributed systems and performance — the parts of engineering where an idea has to hold up under real load. I am looking for software / full-stack roles where I can keep learning at the edge.',
  ],
};

export const skills = [
  { group: 'Languages', items: ['C', 'C++', 'Python', 'JavaScript (ES6+)', 'Go', 'SQL'] },
  { group: 'Frontend', items: ['HTML5', 'CSS3', 'React.js'] },
  { group: 'Backend', items: ['Node.js', 'Express.js', 'REST APIs'] },
  { group: 'Databases', items: ['MongoDB', 'SQL', 'NoSQL', 'JSONPowerDB'] },
  { group: 'DevOps & Tools', items: ['Git', 'GitHub', 'Docker', 'Kubernetes', 'Postman'] },
  { group: 'Core CS', items: ['Data Structures & Algorithms', 'OOP', 'NumPy', 'Pandas'] },
];


export const techMarquee = [
  'React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'TypeScript-ready',
  'Docker', 'Kubernetes', 'Go', 'Python', 'C++', 'REST APIs', 'Git', 'DSA',
];

export const journey = [
  {
    kind: 'work',
    role: 'Web Developer Intern',
    org: 'Squarecell Resource India Pvt. Ltd.',
    meta: 'Remote · Jan 2026 – Feb 2026',
    points: [
      'Built a scalable coding-practice platform on a React.js, Node.js and Express.js client–server architecture, cutting average page load time by 35%.',
      'Designed optimised MongoDB data pipelines with efficient state synchronisation, reducing data-retrieval latency by 40%.',
      'Shipped features in Agile sprints using Git and GitHub, supported by CI/CD workflows for reliable deployments.',
    ],
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'CI/CD'],
  },
  {
    kind: 'education',
    role: 'B.Tech, Computer Science',
    org: 'Bikaner Technical University',
    meta: 'Aug 2025 – Jun 2029 · CGPA 9.20 / 10',
    points: [
      'Coursework across data structures, algorithms, operating systems, DBMS and computer networks.',
      'Active in competitive programming and full-stack side projects outside the curriculum.',
    ],
    tags: ['DSA', 'DBMS', 'OS', 'Networks'],
  },
];

export const projects = [
  {
    name: 'StudyTop',
    blurb: 'A full-stack MERN e-learning platform with REST APIs and progress-tracking modules.',
    detail:
      'Achieved a 98% Lighthouse performance score and lifted student engagement by 25% through fast, cross-device delivery.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    live: 'https://study-top.vercel.app/',
    year: '2025',
    accent: 'violet',
  },
  {
    name: 'DocAna AI',
    blurb: 'An AI healthcare document assistant that reads clinical documents for you.',
    detail:
      'Integrated the Google Gemini API to parse clinical documents and cut manual review time by 60%; hardened with Jest tests to 85% coverage.',
    tags: ['React', 'REST APIs', 'Gemini API', 'Jest'],
    live: 'https://bhavesh189.github.io/DocAna/',
    year: '2025',
    accent: 'cyan',
  },
  {
    name: 'EnterNet',
    blurb: 'A Netflix-style streaming experience with a modular React architecture.',
    detail:
      'Optimised media delivery to reduce video buffering by 30% and containerised the app with Docker for consistent environments.',
    tags: ['React', 'Docker', 'Streaming'],
    live: 'https://bhavesh189.github.io/EnterNet/home.html',
    year: '2024',
    accent: 'pink',
  },
  {
    name: 'Notes Web + App',
    blurb: 'A cross-platform productivity workspace for fast, frictionless note-taking.',
    detail:
      'Prioritised rapid state synchronisation and a minimalist UI, cutting task-management time by 20% across 100+ users.',
    tags: ['JavaScript', 'Cross-platform', 'UI/UX'],
    live: 'https://bhavesh189.github.io/CollageNotes',
    year: '2024',
    accent: 'violet',
  },
  {
    name: 'LeetCode Metrix',
    blurb: 'A competitive-programming analytics dashboard for tracking real progress.',
    detail:
      'Visualises 50+ problem-solving metrics via REST APIs to map strengths, gaps and momentum over time.',
    tags: ['React', 'REST APIs', 'Data Viz'],
    live: 'https://bhavesh189.github.io/LeetCodeProfile/',
    year: '2025',
    accent: 'cyan',
  },
];

export const certifications = [
  { id: 'react', name: 'ReactJS Foundations', issuer: 'ScholarHat (Dot Net Tricks)', year: '2026' },
  { id: 'node', name: 'Node.js Certification', issuer: 'Scaler', year: '2026' },
  { id: 'fullstack', name: 'Full Stack Development: Key Skills for 2026', issuer: 'GUVI Geek Networks × HCL', year: '2026' },
  { id: 'internship', name: 'Web Developer Internship Certificate', issuer: 'Squarecell Resource India Pvt. Ltd.', year: '2026' },
  { id: 'lor', name: 'Letter of Recommendation (LOR)', issuer: 'Squarecell Resource India Pvt. Ltd.', year: '2026' },
];

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'journey', label: 'Journey' },
  { id: 'work', label: 'Work' },
  { id: 'certs', label: 'Certificates' },
  { id: 'booking', label: 'Connect' },
  { id: 'resume', label: 'Résumé' },
  { id: 'contact', label: 'Contact' },
];
