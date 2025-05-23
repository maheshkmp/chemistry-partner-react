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
  const token = localStorage.getItem('token');

  const handleEndPaper = useCallback(() => {
    navigate(`/papers/${paperId}/finalize`);
  }, [navigate, paperId]);

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

  // Format time left into MM:SS
  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  const handleSaveAnswers = (answers) => {
    console.log('Saved answers:', answers);
  };

  return (
    <div className="timed-paper">
      <div className="paper-header">
        <h2 className="paper-title">{paperTitle || 'Loading...'}</h2>
        <div className="timer">{formatTime(timeLeft)}</div>
        <button className="end-paper-btn" onClick={handleEndPaper}>
          End Paper
        </button>
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
        Show Questions
      </button>

      <MCQPanel 
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSaveAnswers={handleSaveAnswers}
      />
    </div>
  );
};

export default TimedPaper;