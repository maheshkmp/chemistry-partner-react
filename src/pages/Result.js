import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Result.css';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalCorrect, scorePercentage, timeSpent } = location.state || {};

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="result-page">
      <div className="result-card">
        <h2>Exam Results</h2>
        <div className="result-stats">
          <div className="stat-item">
            <h3>Correct Answers</h3>
            <p>{totalCorrect} / 50</p>
          </div>
          <div className="stat-item">
            <h3>Score</h3>
            <p>{scorePercentage.toFixed(2)}%</p>
          </div>
          <div className="stat-item">
            <h3>Time Taken</h3>
            <p>{formatTime(timeSpent)}</p>
          </div>
        </div>
        <button onClick={() => navigate('/profile')} className="back-btn">
          Back to Profile
        </button>
      </div>
    </div>
  );
};

export default Result;