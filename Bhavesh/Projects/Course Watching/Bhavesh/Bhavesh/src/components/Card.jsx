import React from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ course }) => {
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate('/see', { state: { courseData: course } });
  };

  return (
    <div className="course-card-wrapper" onClick={handlePlay}>
      <div className="card-border-animation"></div>
      <div className="course-card-content">
        <div className="card-top">
          <span className="lecture-count">{course.nLecture} Lectures</span>
        </div>
        <h3 className="course-name">{course.name}</h3>
        <button className="watch-now-btn">
          Watch Now
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width: '16px', marginLeft: '8px'}}>
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Card;