// Update the API_BASE to your AWS EC2 public IP or domain
const API_BASE = process.env.REACT_APP_API_URL || "http://16.170.171.15:8000";

// Rest of your API endpoints remain the same
export const login = async (credentials) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(credentials)
  });
  if (!response.ok) throw new Error('Login failed');
  return await response.json();
};

// Paper endpoints
export const getPapers = async (token) => {
  const response = await fetch(`${API_BASE}/papers/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch papers');
  return await response.json();
};

export const createPaper = async (paperData, token) => {
  const response = await fetch(`${API_BASE}/papers/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
    body: paperData
  });
  if (!response.ok) throw new Error('Failed to create paper');
  return await response.json();
};

export const updatePaper = async (paperId, paperData, token) => {
  const response = await fetch(`${API_BASE}/papers/${paperId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
    body: paperData
  });
  if (!response.ok) throw new Error('Failed to update paper');
  return await response.json();
};

export const deletePaper = async (paperId, token) => {
  const response = await fetch(`${API_BASE}/papers/${paperId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete paper');
  return await response.json();
};

// User endpoints
export const getUsers = async (token) => {
  const response = await fetch(`${API_BASE}/users`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return await response.json();
};

export const checkAdminStatus = async (token) => {
  const response = await fetch(`${API_BASE}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to check admin status');
  return await response.json();
};

// File upload endpoint
export const uploadFile = async (file, token) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  if (!response.ok) throw new Error('File upload failed');
  return await response.json();
};
