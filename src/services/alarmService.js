// src/services/alarmService.js
import apiClient from './apiClient';

export const alarmService = {
  getAll: (params = {}) => apiClient.get('/api/alarms/', { params }),
  getById: (id) => apiClient.get(`/api/alarms/${id}/`),
  create: (data) => apiClient.post('/api/alarms/', data),
  update: (id, data) => apiClient.put(`/api/alarms/${id}/`, data),
  delete: (id) => apiClient.delete(`/api/alarms/${id}/`),
  toggle: (id) => apiClient.post(`/api/alarms/${id}/toggle/`),
  snooze: (id, minutes = 5) =>
    apiClient.post(`/api/alarms/${id}/snooze/`, { snooze_minutes: minutes }),
};