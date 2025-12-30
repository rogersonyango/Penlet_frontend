// src/services/apiClient.js
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Something went wrong. Please try again.';

    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400: message = data.detail || 'Invalid request.'; break;
        case 401:
          message = 'Unauthorized. Please log in again.';
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          break;
        case 403: message = 'Access denied.'; break;
        case 404: message = 'Item not found.'; break;
        case 422: message = 'Validation failed. Please check your input.'; break;
        case 500: message = 'Server error. Please try again later.'; break;
        default: message = data.detail || `Error ${status}`;
      }
    } else if (error.request) {
      message = 'No response from server. Check your internet connection.';
    }

    toast.error(message, { duration: 5000 });
    return Promise.reject(error);
  }
);

export default apiClient;