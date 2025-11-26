export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.penlet.com';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  VERIFY_EMAIL: '/auth/verify-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',

  // User
  USER_PROFILE: '/users/me',
  UPDATE_PROFILE: '/users/me',
  DELETE_ACCOUNT: '/users/me',

  // Notes
  NOTES: '/notes',
  NOTE_BY_ID: (id) => `/notes/${id}`,
  NOTES_BY_SUBJECT: (subjectId) => `/notes/subject/${subjectId}`,
  SEARCH_NOTES: '/notes/search',

  // Subjects
  SUBJECTS: '/subjects',
  SUBJECT_BY_ID: (id) => `/subjects/${id}`,

  // Timetable
  TIMETABLE: '/timetable',
  TIMETABLE_BY_ID: (id) => `/timetable/${id}`,
  TIMETABLE_BY_DAY: (day) => `/timetable/day/${day}`,

  // Chatbot
  CHATBOT_MESSAGE: '/chatbot/message',
  CHATBOT_HISTORY: '/chatbot/history',
  CHATBOT_CLEAR: '/chatbot/clear',

  // Chatroom
  CHATROOMS: '/chatrooms',
  CHATROOM_BY_ID: (id) => `/chatrooms/${id}`,
  CHATROOM_MESSAGES: (id) => `/chatrooms/${id}/messages`,
  CHATROOM_JOIN: (id) => `/chatrooms/${id}/join`,
  CHATROOM_LEAVE: (id) => `/chatrooms/${id}/leave`,

  // Quizzes
  QUIZZES: '/quizzes',
  QUIZ_BY_ID: (id) => `/quizzes/${id}`,
  QUIZ_SUBMIT: (id) => `/quizzes/${id}/submit`,
  QUIZ_RESULTS: (id) => `/quizzes/${id}/results`,
  QUIZ_ATTEMPTS: '/quizzes/attempts',

  // Flashcards
  FLASHCARDS: '/flashcards',
  FLASHCARD_BY_ID: (id) => `/flashcards/${id}`,
  FLASHCARDS_BY_SUBJECT: (subjectId) => `/flashcards/subject/${subjectId}`,

  // Videos
  VIDEOS: '/videos',
  VIDEO_BY_ID: (id) => `/videos/${id}`,
  VIDEOS_BY_SUBJECT: (subjectId) => `/videos/subject/${subjectId}`,

  // Documents
  DOCUMENTS: '/documents',
  DOCUMENT_BY_ID: (id) => `/documents/${id}`,
  DOCUMENT_OCR: '/documents/ocr',

  // Resources 3D
  RESOURCES_3D: '/resources-3d',
  RESOURCE_3D_BY_ID: (id) => `/resources-3d/${id}`,

  // Games
  GAMES: '/games',
  GAME_BY_ID: (id) => `/games/${id}`,
  GAME_SCORE: '/games/score',

  // Alarms
  ALARMS: '/alarms',
  ALARM_BY_ID: (id) => `/alarms/${id}`,

  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_BY_ID: (id) => `/notifications/${id}`,
  MARK_READ: (id) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/read-all',

  // Analytics
  ANALYTICS: '/analytics',
  ANALYTICS_DASHBOARD: '/analytics/dashboard',
  ANALYTICS_PROGRESS: '/analytics/progress',

  // Files
  UPLOAD_FILE: '/files/upload',
  FILE_BY_ID: (id) => `/files/${id}`,

  // Search
  SEARCH: '/search',

  // Settings
  SETTINGS: '/settings',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'penlet_auth_token',
  REFRESH_TOKEN: 'penlet_refresh_token',
  USER_DATA: 'penlet_user_data',
  THEME: 'penlet_theme',
  LANGUAGE: 'penlet_language',
};