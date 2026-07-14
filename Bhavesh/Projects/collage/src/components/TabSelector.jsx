import React from 'react';

const TabSelector = ({ activeTab, onChangeTab }) => {
  const semesters = [
    { id: 'sem1', label: 'Sem 1' },
    { id: 'sem2', label: 'Sem 2' },
    { id: 'sem3', label: 'Sem 3' },
    { id: 'sem4', label: 'Sem 4' },
    { id: 'sem5', label: 'Sem 5' },
    { id: 'sem6', label: 'Sem 6' },
    { id: 'sem7', label: 'Sem 7' },
    { id: 'sem8', label: 'Sem 8' }
  ];

  return (
    <div className="tabs-container">
      <div className="tab-box glass">
        {semesters.map((sem) => (
          <button
            key={sem.id}
            className={`tab-btn ${activeTab === sem.id ? 'active' : ''}`}
            onClick={() => onChangeTab(sem.id)}
          >
            {sem.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabSelector;
