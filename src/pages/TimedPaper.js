import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MCQPanel from '../components/MCQPanel';
import './TimedPaper.css';

const TimedPaper = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [paperTitle, setPaperTitle] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [startTime] = useState(new Date());
  const [answers, setAnswers] = useState([]);
  const token = localStorage.getItem('token');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [marks, setMarks] = useState(0);

  const handleEndPaper = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const timeSpent = Math.floor((new Date() - startTime) / 1000);
      
      // Format answers to match the backend schema
      const formattedAnswers = answers
        .map((answer, index) => ({
          question_number: index + 1,
          selected_option: parseInt(answer) || null
        }))
        .filter(answer => answer.selected_option !== null);

      const submissionData = {
        answers: formattedAnswers,
        time_spent: timeSpent
      };

      console.log('Submitting data:', submissionData); // Debug log

      const response = await fetch(`http://localhost:8000/papers/${paperId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Response status:', response.status);
        console.error('Error details:', errorData);
        throw new Error(errorData.detail || 'Failed to submit paper');
      }

      const result = await response.json();
      navigate('/result', { 
        state: { 
          totalCorrect: result.total_correct,
          scorePercentage: result.score_percentage,
          timeSpent: result.time_spent
        }
      });
    } catch (error) {
      console.error('Error submitting paper:', error);
      alert(error.message || 'Error submitting paper. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate, paperId, token, answers, startTime]);

  const handleSaveAnswers = (newAnswers, calculatedMarks) => {
    setAnswers(newAnswers);
    setMarks(calculatedMarks);
  };

  // Format time to include hours
  const formatTime = (seconds) => {
    if (seconds === null) return '--:--:--';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchPaperDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/papers/${paperId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const paper = await response.json();
          setPaperTitle(paper.title);
          setTimeLeft(paper.duration_minutes * 60); // Convert minutes to seconds
        }
      } catch (error) {
        console.error('Error fetching paper details:', error);
      }
    };

    fetchPaperDetails();
  }, [paperId, token]);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(`http://localhost:8000/papers/${paperId}/pdf?token=${token}`);
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        } else {
          console.error('Failed to fetch PDF');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPdf();
  }, [paperId, token]);

  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer);
          handleEndPaper();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleEndPaper]);

  return (
    <div className="timed-paper">
      <div className="paper-header">
        <h2 className="paper-title">{paperTitle || 'Loading...'}</h2>
        <div className="timer">{formatTime(timeLeft)}</div>
      </div>

      <div className="pdf-viewer">
        {pdfUrl && (
          <embed
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        )}
      </div>

      <button 
        className="mcq-toggle-btn"
        onClick={() => setIsPanelOpen(true)}
      >
        Marking Sheet
      </button>

      <MCQPanel 
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSaveAnswers={handleSaveAnswers}
        totalMarks={marks}
        onFinish={handleEndPaper}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default TimedPaper;