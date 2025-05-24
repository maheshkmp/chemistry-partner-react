import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaperResult.css';

const PaperResult = ({ paperId, userAnswers }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `http://localhost:8000/papers/${paperId}/check-answers`,
          { answers: userAnswers },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setResult(response.data);
      } catch (err) {
        setError('Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [paperId, userAnswers]);

  if (loading) return <div>Calculating results...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="paper-result">
      <h2>Your Results</h2>
      <div className="result-summary">
        <p>Total Questions: {result.total_questions}</p>
        <p>Correct Answers: {result.total_correct}</p>
        <p>Score: {result.score_percentage.toFixed(2)}%</p>
      </div>
      <div className="detailed-results">
        <h3>Detailed Breakdown</h3>
        {result.detailed_results.map((item, index) => (
          <div 
            key={index} 
            className={`result-item ${item.is_correct ? 'correct' : 'incorrect'}`}
          >
            <span>Question {item.question_number}:</span>
            <span>Your Answer: {item.selected_option}</span>
            <span>Correct Answer: {item.correct_option}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaperResult;