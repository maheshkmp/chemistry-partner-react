import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PaperAttempt from '../components/PaperAttempt';
import axios from 'axios';

const PaperView = () => {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/papers/${id}`);
        setPaper(response.data);
      } catch (error) {
        console.error('Error fetching paper:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!paper) return <div>Paper not found</div>;

  return <PaperAttempt paper={paper} />;
};

export default PaperView;