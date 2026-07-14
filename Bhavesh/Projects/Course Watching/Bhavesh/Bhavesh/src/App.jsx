import { useState } from 'react'
import './App.css'
import Home from './components/Home.jsx'
import Login from './components/Login.jsx';
import Navbar from './components/Navbar.jsx';
import {createBrowserRouter, Outlet} from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import Account from './components/Account.jsx';
import Courses from './components/Courses.jsx';
import { useNavigate } from 'react-router-dom';
import See from './components/See.jsx'
import Add from './components/Add.jsx';
import Preloader from './components/Preloader.jsx';

function App() {

  const routes = createBrowserRouter( [
    
    {
      path : '/',
      element : (<>
            <Navbar />
            <Outlet />
              </>),

      children : [
        {
          path : '/',
          element : <Home></Home>
        },
        
        {
          path : '/courses',
          element : <Courses> </Courses>
        },

        {
          path : '/account',
          element : <Account />
        },
        {
          path : '/see',
          element : <See />
        }
      ]
    },
    
        {
          path : '/login',
          element : <Login />
        },
        {
          path : '/add',
          element : <Add />
        },
        {
          path : '*',
          element : <h1 style={{color : "white", textAlign : "center", marginTop : "20vh"}}>404 Not Found</h1>
        }
  ]
  )



    const [login, isLogin] = useState(false);

  return (
    <>
    <RouterProvider router={routes}>
    <Navbar/>
    </RouterProvider>    
    </>
  )
}

export default App