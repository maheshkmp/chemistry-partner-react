import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

// Components
// import Header from './components/Header'; 
import Footer from './components/Footer';
import Navbar from './components/Navbar';

// Pages
import HomePage from './pages/HomePage';
import PaperList from './pages/PaperList';
import TimedPaper from './pages/TimedPaper';
import FinalizePaper from './pages/FinalizePaper';
import AnswerCheck from './pages/AnswerCheck';
import Login from './pages/Login';
import Register from './pages/Register';
import PaperManagePage from './pages/PaperManagePage';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import PaperView from './pages/PaperView';

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      <div className="app">
        <Navbar />
       
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/papers" 
              element={isAuthenticated ? <PaperList /> : <Navigate to="/login" />} 
            />
            <Route path="/papers/:paperId" element={<TimedPaper />} />
            <Route path="/papers/:paperId/manage" element={<PaperManagePage />} />
            <Route path="/papers/:paperId/finalize" element={<FinalizePaper />} />
            <Route path="/papers/:paperId/check" element={<AnswerCheck />} />
            <Route path="/papers/:id" element={<PaperView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;