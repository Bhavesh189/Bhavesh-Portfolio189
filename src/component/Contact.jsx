import React from 'react'
import { useForm } from 'react-hook-form'
import Navbar from './Navbar'
import Background from './Background'

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  async function onSubmit(data) {
      const name = data.name
      const mail = data.email
      const purpose = data.purpose
      const message = data.message
      let token = "8594030696:AAGFFxvCxU1uzJ9afY0rfWXuKPvyQjuaUA0";
      let id = "7411383108";


      const text = `Name : ${name}\n
      Mail : ${mail}\n
      Purpose : ${purpose}\n
      message : ${message}`


      let url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${id}&text=${text}`

      try {

      let resp = await fetch(url);

      if(resp.ok) {
        alert("Message Sended Succesfully");
      }

      else {
        alert("Try Again");
      }

    }

    catch(e) {
      console.log(e);
      alert("Try Again");
    }
  }

  return (
    <div className="contact-page">
      <Background>
        <Navbar />
        
        <div className="form-container">
          <div className="form-card">
            
            <div className="form-header">
              <h2>Get In Touch</h2>
              <p>Let's build something epic together.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
              
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Enter Your Name" 
                  className={errors.name ? 'input-error' : ''}
                  {...register('name', { 
                    required: "Name is required", 
                    minLength: { value: 3, message: "Min length is 3 characters" } 
                  })}
                />
                {errors.name && <span className="error-text">{errors.name.message}</span>}
              </div>

              <div className="input-group">
                <input 
                  type="email" 
                  placeholder="Enter Your Mail" 
                  className={errors.email ? 'input-error' : ''}
                  {...register('email', { 
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                  })}
                />
                {errors.email && <span className="error-text">{errors.email.message}</span>}
              </div>

              <div className="input-group">
                <select 
                  {...register('purpose', { required: "Please select a reason" })}
                  className="form-select"
                >
                  <option value="">Select Reason for Contact</option>
                  <option value="enjoy">For Enjoy</option>
                  <option value="career">For Career</option>
                  <option value="cons">For Consulting</option>
                </select>
                {errors.purpose && <span className="error-text">{errors.purpose.message}</span>}
              </div>

              <input type="text" placeholder='Message' {...register('messagee', {minLength : {value : 5, message: "Min Chars Required : 5, Max : 100 in Message Section"}, maxLength : 100})} />


              {errors.messagee && <span className="error-text">{errors.messagee.message}</span>}

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? <div className="spinner"></div> : "Send Message"}
              </button>

            </form>
          </div>
        </div>
      </Background>
    </div>
  )
}

export default Contact