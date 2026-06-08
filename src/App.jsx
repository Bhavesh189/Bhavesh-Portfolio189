import { useState } from 'react'
import './App.css'
import Navbar from './component/Navbar.jsx'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import About from './component/About.jsx'
import Contact from './component/Contact.jsx'
import Exp from './component/Exp.jsx'
import Projects from './component/Projects.jsx'
import Home from './component/Home.jsx'

function App() {
  
  const router = createBrowserRouter([
        {
            path : '/',
            element : <Home />
        },

        {
            path : '/skills',
            element : <About />
        },

        {
            path : '/contact',
            element : <Contact />
        },

        {
            path : '/exp',
            element : <Exp />
        },

        {
            path : '/projects',
            element : <Projects />
        }
    ]);

  return (
    <>
    <RouterProvider router={router}>
      </RouterProvider>
    </>
  )
}

export default App
