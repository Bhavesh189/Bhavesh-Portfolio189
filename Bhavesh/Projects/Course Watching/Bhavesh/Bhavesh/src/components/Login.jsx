import React, { useState } from 'react';
import './css/Login.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      mail: localStorage.getItem("mail") || "",
      pass: localStorage.getItem("pass") || ""
    }
  }); 

  async function sendData(data) {
      try {
        const url = 'https://studytop-backend.onrender.com/create';
        const sData = {
          name : data.name,
          email : data.mail,
          pass : data.pass
        }

        const res = await fetch(url, {
          method : 'POST',
          headers : {
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify(sData)
        });

        const ress = await res.json();

        if(ress.c === "n") {
          alert("Email Already Exists. Please login.");
          navigate('/login');
          return;
        }

        alert("Sign Up Successful. Please login.");
        navigate('/login');
      } catch(e) {
        console.error('Error:', e);
        alert('Cannot send data.')
      }
  }

  async function loginData(data) {
    try {
      const sdata = {
        email : data.mail,
        pass : data.pass
      }
      localStorage.setItem("mail", data.mail);
      localStorage.setItem("pass", data.pass);
      const res = await fetch('https://studytop-backend.onrender.com/login', {
        method : 'POST',
        credentials: 'include',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(sdata)
      });
      const ress = await res.json();
      if(ress.l === "h") {
        alert("Login Successful.");
        navigate('/');
      } else {
        alert("Invalid Email or Password.");
      }
    } catch(e) {
      console.error('Error:', e);
      alert('Cannot send data.')
    }
  }

  const Icons = {
    email: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    lock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeOff: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    google: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
    github: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
  };

  return (
    <div className="login-wrapper">
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      
      <div className="login-container fade-in-up">
        
        <div className="auth-toggle">
          <button 
            className={`toggle-btn ${isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(true)}
          >
            Log In
          </button>
          <button 
            className={`toggle-btn ${!isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
          <div className={`toggle-slider ${!isLogin ? 'right' : ''}`}></div>
        </div>

        <div className="login-header">
          <h2>{isLogin ? 'Welcome back' : 'Create an account'}</h2>
          <p>{isLogin ? 'Enter your details to access your dashboard.' : 'Start your mastery journey today.'}</p>
        </div>

        <form className="login-form" onSubmit={isLogin ? handleSubmit(loginData) : handleSubmit(sendData)}>
          
          {!isLogin && (
              <>
                <div className="input-group slide-down">
                  <div className="input-icon">{Icons.user}</div>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required 
                    {...register('name', { 
                        minLength: { value: 2, message: "Name must be at least 2 characters long" }, 
                        required: true 
                    })}
                  />
                </div>
                
                {errors.name && <p className="error-message">{errors.name.message}</p>}
              </>
            )}

          <div className="input-group">
            <div className="input-icon">{Icons.email}</div>
            <input type="email" placeholder="Email address" required {...register('mail', { required: true })} />
          </div>

          <div className="input-group">
            <div className="input-icon">{Icons.lock}</div>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              required {...register('pass', { minLength: { value: 6, message: "Password must be at least 6 characters long" }, required: true })}
            />
            {errors.pass && <p className="error-message">{errors.pass.message}</p>}
            <button 
              type="button" 
              className="password-toggle" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? Icons.eyeOff : Icons.eye}
            </button>
          </div>

          {isLogin && (
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isLogin ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <div className="social-divider">
          <span>or continue with</span>
        </div>

      </div>
    </div>
  );
};

export default Login;