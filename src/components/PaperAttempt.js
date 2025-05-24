import React, { useState } from 'react';
import PaperResult from './PaperResult';
import './PaperAttempt.css';

const PaperAttempt = ({ paper }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnswerChange = (questionNumber, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionNumber]: parseInt(answer)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/papers/${paper.id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submission: {
            answers: Object.entries(answers).map(([question_number, selected_option]) => ({
              question_number: parseInt(question_number),
              selected_option: parseInt(selected_option)
            }))
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit answers');
      }

      const result = await response.json();
      setSubmitted(true);
      setResult(result);
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert(error.message || 'Failed to submit answers. Please try again.');
    }
  };

  if (submitted && result) {
    return <PaperResult result={result} />;
  }

  return (
    <div className="paper-attempt">
      <h2>{paper.title}</h2>
      <form onSubmit={handleSubmit}>
        <div className="answer-sheet">
          <h3>Answer Sheet</h3>
          <div className="answer-grid">
            {[...Array(20)].map((_, index) => (
              <div key={index} className="answer-item">
                <span>Q{index + 1}</span>
                <select
                  value={answers[index + 1] || ''}
                  onChange={(e) => handleAnswerChange(index + 1, e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="submit-button">
          Submit Answers
        </button>
      </form>
    </div>
  );
};

export default PaperAttempt;