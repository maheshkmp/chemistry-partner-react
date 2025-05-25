import React, { useState } from 'react';
import './MCQPanel.css';

const MCQPanel = ({ isOpen, onClose, onSaveAnswers, totalMarks, onFinish, isSubmitting }) => {
  const [answers, setAnswers] = useState(Array(50).fill(''));

  const handleOptionSelect = (questionIndex, option) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = option;
    setAnswers(newAnswers);
    
    // Format answers as an object with question numbers as keys
    const formattedAnswers = {};
    newAnswers.forEach((answer, index) => {
      if (answer !== '') {
        formattedAnswers[index + 1] = answer;
      }
    });
    onSaveAnswers(formattedAnswers);
  };

  return (
    <>
      {isOpen && <div className="mcq-overlay" onClick={onClose} />}
      <div className={`mcq-panel ${isOpen ? 'open' : ''}`}>
        <div className="mcq-header">
          <h2>Marking Sheet</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="mcq-content">
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} className="mcq-question">
              <span className="question-number">{i + 1}.</span>
              <div className="mcq-options">
                {[1, 2, 3, 4, 5].map((option) => (
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
        <div className="mcq-footer">
          <button 
            className="finish-btn" 
            onClick={onFinish}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Finish Paper'}
          </button>
        </div>
      </div>
    </>
  );
};

export default MCQPanel;