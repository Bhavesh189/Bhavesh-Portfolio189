import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { initAccent } from './config.js';
import './index.css';
import './responsive.css';

initAccent();


console.log(
  `%c  ___        __ _       _ _           ____  _                                
 |_ _|_ __  / _(_)_ __ (_) |_ _   _  / ___|| |__   __ _ _ __ _ __ ___   __ _ 
  | || '_ \\| |_| | '_ \\| | __| | | | \\___ \\| '_ \\ / _\` | '__| '_ \` _ \\ / _\` |
  | || | | |  _| | | | | | |_| |_| |  ___) | | | | (_| | |  | | | | | | (_| |
 |___|_| |_|_| |_|_| |_|_|\\__|\\__, | |____/|_| |_|\\__,_|_|  |_| |_| |_|\\__,_|
                              |___/                                          
=========================================================================
‍ Bhavesh Sharma | MERN Stack Developer & Bug Bounty Expert
 Live: thebhavesh.online
 BTU Undergrad (CGPA 9.20) | Solved 350+ LeetCode DSA Problems
=========================================================================
️ KEYBOARD SHORTCUTS NAVIGATION:
[A] -> About      [S] -> Skills      [J] -> Journey
[P] -> Projects   [C] -> Contact     [T]/[H] -> Top
[Esc] -> Close Active Mod/AI Panels
=========================================================================`,
  'color: #dfa95c; font-family: monospace; font-weight: bold; background: #030303; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); text-shadow: 0 0 8px rgba(223, 169, 92, 0.35);'
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
