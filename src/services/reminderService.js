// src/services/reminderService.js
import apiClient from './apiClient';

export const reminderService = {
  getAll: (params = {}) => apiClient.get('/api/reminders/', { params }),
  getUpcoming: (limit = 10) => apiClient.get('/api/reminders/upcoming/', { params: { limit } }),
  getById: (id) => apiClient.get(`/api/reminders/${id}/`),
  create: (data) => apiClient.post('/api/reminders/', data),
  update: (id, data) => apiClient.put(`/api/reminders/${id}/`, data),
  delete: (id) => apiClient.delete(`/api/reminders/${id}/`),
  complete: (id) => apiClient.post(`/api/reminders/${id}/complete/`),
};