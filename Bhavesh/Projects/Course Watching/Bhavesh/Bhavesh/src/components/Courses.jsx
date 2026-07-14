import React, { useEffect, useState } from 'react';
import Card from './Card';
import See from './See';
import './css/Courses.css';

const Courses = () => {
  const [allCoursesData, setAllCoursesData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await fetch('https://studytop-backend.onrender.com/v'); 
      const data = await res.json();
      setAllCoursesData(data);
    } catch (e) {
      console.error(e);
    }
  }

  if (selectedCourse) {
    return <See courseData={selectedCourse} goBack={() => setSelectedCourse(null)} />;
  }

  return (
    <section className="courses-section">
      <div className="courses-header">
        <h2 className="courses-title">
          Share <span>to support</span>
        </h2>
        <button className="view-all-btn">Explore All</button>
      </div>

      <div className="courses-grid">
        {allCoursesData.map((course) => (
          <Card 
            key={course._id} 
            course={course} 
            onCardClick={setSelectedCourse} 
          />
        ))}
      </div>
    </section>
  );
};

export default Courses;