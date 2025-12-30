// src/services/quiz.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth interceptor
api.interceptors.request.use((config) => {
  const mockUser = localStorage.getItem('mockUser') || 'student';
  config.headers.Authorization = `Bearer ${mockUser}`;
  return config;
});

// Centralized error handler
const handleApiError = (error) => {
  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please check your connection.';
  }
  if (!error.response) {
    return 'Network error. Please try again later.';
  }

  const { status, data } = error.response;

  if (status === 400) {
    return data.detail || 'Invalid request. Please check your inputs.';
  }
  if (status === 401) {
    return 'Session expired. Please log in again.';
  }
  if (status === 403) {
    return 'Access denied. You do not have permission.';
  }
  if (status === 404) {
    return 'Requested item not found.';
  }
  if (status === 422) {
    return 'Validation failed. Please check your data.';
  }
  if (status >= 500) {
    return 'Server error. Please try again later.';
  }

  return 'An unexpected error occurred.';
};

// Safe API wrapper
const safeApiCall = async (promise) => {
  try {
    const response = await promise;
    return { data: response.data, error: null };
  } catch (error) {
    const message = handleApiError(error);
    console.error('API Error:', message);
    return { data: null, error: message };
  }
};



const loadQuizzes = async () => {
    setLoading(true);
    setError(null);
    const response = await fetchQuizzes({ curriculum });
    if (response.error) {
      setError(response.error);
    } else {
      setQuizzes(response.data || []);
    }
    setLoading(false);
  };


 // === Quiz Endpoints ===
export const fetchQuizzes = (params = {}) => {
  return safeApiCall(api.get('/api/quizzes/', { params }));
}; 

export const fetchQuiz = (quizId) => {
  return safeApiCall(api.get(`/api/quizzes/${quizId}/`));
};

export const startQuizAttempt = (quizId, userId) => {
  return safeApiCall(api.post(`/api/quizzes/${quizId}/start/`, { user_id: userId }));
};

export const submitAnswer = (attemptId, questionId, answer) => {
  return safeApiCall(
    api.post(`/api/quizzes/attempts/${attemptId}/answer/`, {
      question_id: questionId,
      answer,
    })
  );
};

export const submitQuiz = (attemptId) => {
  return safeApiCall(api.post(`/api/quizzes/attempts/${attemptId}/submit/`));
};

export const fetchQuizResults = (attemptId) => {
  return safeApiCall(api.get(`/api/quizzes/attempts/${attemptId}/results/`));
};

// === 3D Resource Endpoints ===
export const uploadResource = (file, resourceData) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', resourceData.title);
  formData.append('subject', resourceData.subject);
  formData.append('category_id', resourceData.category_id.toString());
  formData.append('is_featured', resourceData.is_featured.toString());

  return safeApiCall(
    api.post('/api/3d-resources/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  );
};

// === Auth/User ===
export const getCurrentUser = () => {
  const role = localStorage.getItem('mockUser') || 'student';
  const normalizedRole = ['teacher', 'admin'].includes(role) ? role : 'student';
  return {
    email: `${normalizedRole}@example.com`,
    role: normalizedRole,
  };
};

// === NEW: Create and Update Quiz ===
export const createQuiz = (quizData) => {
  return safeApiCall(api.post('/api/quizzes/', quizData));
};

export const updateQuiz = (quizId, quizData) => {
  return safeApiCall(api.put(`/api/quizzes/${quizId}/`, quizData));
};