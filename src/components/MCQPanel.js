import React, { useState } from 'react';
import './MCQPanel.css';

const MCQPanel = ({ isOpen, onClose, onSaveAnswers }) => {
  const [answers, setAnswers] = useState(Array(50).fill(''));

  const handleOptionSelect = (questionIndex, option) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = option;
    setAnswers(newAnswers);
    onSaveAnswers(newAnswers);
  };

  return (
    <>
      {isOpen && <div className="mcq-overlay" onClick={onClose} />}
      <div className={`mcq-panel ${isOpen ? 'open' : ''}`}>
        <div className="mcq-header">
          <h2>Multiple Choice Questions</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="mcq-content">
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} className="mcq-question">
              <h3>Question {i + 1}</h3>
              <div className="mcq-options">
                {['A', 'B', 'C', 'D'].map((option) => (
                  <label key={option} className="option-label">
                    <input
                      type="radio"
                      name={`question-${i}`}
                      value={option}
                      checked={answers[i] === option}
                      onChange={() => handleOptionSelect(i, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MCQPanel;