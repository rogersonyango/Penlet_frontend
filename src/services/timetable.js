// src/services/timetable.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const timetableAPI = axios.create({
  baseURL: `${API_BASE_URL}/api/timetable`,
});

// Optional: add auth token
// timetableAPI.interceptors.request.use(config => {
//   const token = localStorage.getItem('access_token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export const timetableService = {
  getUserTimetables(userId, term) {
    return timetableAPI.get('/', { params: { user_id: userId, term } }).then(res => res.data);
  },

  getDailySchedule(userId, date) {
    return timetableAPI.get('/daily/', { params: { user_id: userId, date } }).then(res => res.data);
  },

  getWeeklySchedule(userId, startDate) {
    return timetableAPI.get('/weekly/', { params: { user_id: userId, start_date: startDate } }).then(res => res.data);
  },

  getTimetableById(id) {
    return timetableAPI.get(`/${id}/`).then(res => res.data);
  },

  createTimetable(data) {
    return timetableAPI.post('/', data).then(res => res.data);
  },

  addTimeSlot(timetableId, slotData) {
    return timetableAPI.post('/slots/', slotData, { params: { timetable_id: timetableId } }).then(res => res.data);
  },

  updateTimeSlot(slotId, slotData) {
    return timetableAPI.put(`/slots/${slotId}/`, slotData).then(res => res.data);
  },

  deleteTimeSlot(slotId) {
    return timetableAPI.delete(`/slots/${slotId}/`).then(res => res.data);
  },
};