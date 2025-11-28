// src/services/api.js

const API_URL = "http://localhost:8000/api/v1";

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }
    
    const data = await response.json();
    
    // Store token in localStorage
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login User
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    
    const data = await response.json();
    
    // Store token in localStorage
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get current user (from localStorage)
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem('access_token');
};