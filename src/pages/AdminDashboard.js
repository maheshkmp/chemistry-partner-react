import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import './AdminDashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [averageMarks, setAverageMarks] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await axios.get('http://localhost:8000/users/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUsers(usersResponse.data);

        // Fetch submissions for average marks
        const submissionsResponse = await axios.get('http://localhost:8000/papers/submissions/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Calculate average marks
        const marksByPaper = {};
        submissionsResponse.data.forEach(submission => {
          if (!marksByPaper[submission.paper_title]) {
            marksByPaper[submission.paper_title] = [];
          }
          marksByPaper[submission.paper_title].push(submission.marks);
        });

        const averages = {};
        Object.entries(marksByPaper).forEach(([title, marks]) => {
          averages[title] = marks.reduce((a, b) => a + b, 0) / marks.length;
        });

        setAverageMarks(averages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token]);

  const chartData = {
    labels: Object.keys(averageMarks),
    datasets: [
      {
        data: Object.values(averageMarks),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }
    ]
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="dashboard-content">
        <div className="users-section">
          <h2>Student Users</h2>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Papers Completed</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  !user.is_admin && (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                      <td>{user.papers_completed || 0}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="stats-section">
          <h2>Average Marks by Paper</h2>
          <div className="chart-container">
            <Pie data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;