/**
 * Constants Utility
 * 
 * Application-wide constants for Penlet
 * Centralized configuration for easy maintenance and deployment
 */

/**
 * API Configuration
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  },

  // Games
  GAMES: {
    BASE: `${API_BASE_URL}/games`,
    SUBMIT: (gameId) => `${API_BASE_URL}/games/${gameId}/submit`,
    MY_SCORES: `${API_BASE_URL}/games/scores/me`,
    HIGH_SCORES: (gameId) => `${API_BASE_URL}/games/${gameId}/highscores`,
    LEADERBOARD: `${API_BASE_URL}/games/leaderboard`,
    ACHIEVEMENTS: `${API_BASE_URL}/games/achievements`,
    STATS: (gameId) => `${API_BASE_URL}/games/${gameId}/stats`,
  },

  // Subjects
  SUBJECTS: {
    BASE: `${API_BASE_URL}/subjects`,
    BY_ID: (id) => `${API_BASE_URL}/subjects/${id}`,
    NOTES: (id) => `${API_BASE_URL}/subjects/${id}/notes`,
    VIDEOS: (id) => `${API_BASE_URL}/subjects/${id}/videos`,
  },

  // Videos
  VIDEOS: {
    BASE: `${API_BASE_URL}/videos`,
    BY_ID: (id) => `${API_BASE_URL}/videos/${id}`,
    SEARCH: `${API_BASE_URL}/videos/search`,
  },

  // Search
  SEARCH: {
    GLOBAL: `${API_BASE_URL}/search`,
    SUBJECTS: `${API_BASE_URL}/search/subjects`,
    VIDEOS: `${API_BASE_URL}/search/videos`,
    NOTES: `${API_BASE_URL}/search/notes`,
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: `${API_BASE_URL}/notifications`,
    MARK_READ: (id) => `${API_BASE_URL}/notifications/${id}/read`,
    MARK_ALL_READ: `${API_BASE_URL}/notifications/read-all`,
  },

  // Analytics
  ANALYTICS: {
    OVERVIEW: `${API_BASE_URL}/analytics/overview`,
    SUBJECTS: `${API_BASE_URL}/analytics/subjects`,
    GAMES: `${API_BASE_URL}/analytics/games`,
    PROGRESS: `${API_BASE_URL}/analytics/progress`,
  },
};

/**
 * Responsive Breakpoints (matching Tailwind defaults)
 */
export const BREAKPOINTS = {
  SM: 640,   // Small devices (landscape phones)
  MD: 768,   // Medium devices (tablets)
  LG: 1024,  // Large devices (desktops)
  XL: 1280,  // Extra large devices (large desktops)
  '2XL': 1536, // 2X Extra large devices
};

/**
 * Media Queries
 */
export const MEDIA_QUERIES = {
  MOBILE: `(max-width: ${BREAKPOINTS.SM - 1}px)`,
  TABLET: `(min-width: ${BREAKPOINTS.SM}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`,
  DESKTOP: `(min-width: ${BREAKPOINTS.LG}px)`,
  SMALL: `(max-width: ${BREAKPOINTS.SM}px)`,
  MEDIUM: `(min-width: ${BREAKPOINTS.MD}px)`,
  LARGE: `(min-width: ${BREAKPOINTS.LG}px)`,
};

/**
 * Theme Colors
 */
export const COLORS = {
  // Primary brand colors
  PRIMARY: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Game colors
  GAMES: {
    QUICK_MATH: '#3b82f6',      // Blue
    MEMORY_MATCH: '#a855f7',    // Purple
    WORD_SCRAMBLE: '#22c55e',   // Green
    TRUE_FALSE: '#f97316',      // Orange
    TYPE_RACE: '#ec4899',       // Pink
    GEOGRAPHY: '#14b8a6',       // Teal
    CHEMISTRY: '#06b6d4',       // Cyan
    PHYSICS: '#6366f1',         // Indigo
    BIOLOGY: '#10b981',         // Emerald
  },

  // Status colors
  SUCCESS: '#22c55e',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',

  // Difficulty colors
  DIFFICULTY: {
    EASY: '#22c55e',
    MEDIUM: '#f59e0b',
    HARD: '#f97316',
    EXPERT: '#ef4444',
  },
};

/**
 * Game Difficulty Levels
 */
export const DIFFICULTY_LEVELS = {
  EASY: {
    label: 'Easy',
    color: COLORS.DIFFICULTY.EASY,
    multiplier: 1,
  },
  MEDIUM: {
    label: 'Medium',
    color: COLORS.DIFFICULTY.MEDIUM,
    multiplier: 1.5,
  },
  HARD: {
    label: 'Hard',
    color: COLORS.DIFFICULTY.HARD,
    multiplier: 2,
  },
  EXPERT: {
    label: 'Expert',
    color: COLORS.DIFFICULTY.EXPERT,
    multiplier: 3,
  },
};

/**
 * Game IDs
 */
export const GAME_IDS = {
  QUICK_MATH: 'quick-math',
  MEMORY_MATCH: 'memory-match',
  WORD_SCRAMBLE: 'word-scramble',
  TRUE_FALSE: 'true-false',
  TYPE_RACE: 'type-race',
  GEOGRAPHY_QUIZ: 'geography-quiz',
  CHEMISTRY_MATCH: 'chemistry-match',
  PHYSICS_CHALLENGE: 'physics-challenge',
  BIOLOGY_EXPLORER: 'biology-explorer',
};

/**
 * Game Settings
 */
export const GAME_SETTINGS = {
  // Streak bonuses (apply to most games)
  STREAK_BONUS: {
    THRESHOLD_1: 5,
    BONUS_1: 10,
    THRESHOLD_2: 10,
    BONUS_2: 20,
  },

  // Time bonus threshold
  TIME_BONUS_THRESHOLD: 5, // seconds remaining

  // Score display
  SCORE_SUFFIX: 'pts',

  // Leaderboard
  LEADERBOARD_SIZE: 10,
  MY_SCORE_CONTEXT: 5, // Show 5 scores above and below user
};

/**
 * Date Formats
 */
export const DATE_FORMATS = {
  SHORT: 'short',           // "Dec 3, 2024"
  LONG: 'long',            // "December 3, 2024"
  TIME: 'time',            // "2:30 PM"
  DATETIME: 'datetime',    // "Dec 3, 2024 at 2:30 PM"
  RELATIVE: 'relative',    // "2 hours ago"
  ISO: 'iso',              // "2024-12-03T14:30:00"
};

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  GAME_SETTINGS: 'game_settings',
  RECENT_SEARCHES: 'recent_searches',
  NOTIFICATION_PREFERENCES: 'notification_preferences',
};

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
};

/**
 * Validation Rules
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  EMAIL_MAX_LENGTH: 254,
  PHONE_LENGTH: 10,
};

/**
 * File Upload
 */
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

/**
 * Animation Durations (in ms)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

/**
 * Debounce Delays (in ms)
 */
export const DEBOUNCE_DELAY = {
  SEARCH: 500,
  INPUT: 300,
  RESIZE: 200,
  SCROLL: 100,
};

/**
 * Z-Index Layers
 */
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
};

/**
 * Routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SUBJECTS: '/subjects',
  SUBJECT_DETAIL: (id) => `/subjects/${id}`,
  VIDEOS: '/videos',
  GAMES: '/games',
  NOTES: '/notes',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized. Please login.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input.',
  TIMEOUT: 'Request timeout. Please try again.',
  UNKNOWN: 'An unexpected error occurred.',
};

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in!',
  LOGOUT: 'Successfully logged out!',
  REGISTER: 'Account created successfully!',
  PROFILE_UPDATE: 'Profile updated successfully!',
  PASSWORD_CHANGE: 'Password changed successfully!',
  GAME_SCORE_SUBMIT: 'Score submitted successfully!',
  NOTE_SAVE: 'Note saved successfully!',
};

/**
 * Toast Configuration
 */
export const TOAST_CONFIG = {
  DURATION: 3000,
  POSITION: 'top-right',
  SUCCESS_ICON: '✅',
  ERROR_ICON: '❌',
  WARNING_ICON: '⚠️',
  INFO_ICON: 'ℹ️',
};

/**
 * App Metadata
 */
export const APP_INFO = {
  NAME: 'Penlet',
  VERSION: '1.0.0',
  DESCRIPTION: 'Interactive Educational Platform for Uganda\'s New Curriculum',
  AUTHOR: 'Rogers',
  SUPPORT_EMAIL: 'support@penlet.com',
};

/**
 * Feature Flags
 */
export const FEATURES = {
  DARK_MODE: true,
  GAMES: true,
  ANALYTICS: true,
  NOTIFICATIONS: true,
  CAM_SCANNER: true,
  VIDEO_UPLOAD: false, // Coming soon
  LIVE_CLASSES: false, // Coming soon
  CHAT: false,         // Coming soon
};

/**
 * Performance
 */
export const PERFORMANCE = {
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  REQUEST_TIMEOUT: 30000, // 30 seconds
};

/**
 * Social Links
 */
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/penlet',
  FACEBOOK: 'https://facebook.com/penlet',
  INSTAGRAM: 'https://instagram.com/penlet',
  YOUTUBE: 'https://youtube.com/penlet',
};

/**
 * Grade Boundaries
 */
export const GRADE_BOUNDARIES = {
  A: 90,
  B: 80,
  C: 70,
  D: 60,
  F: 0,
};

/**
 * Grade Labels
 */
export const GRADE_LABELS = {
  A: { label: 'Excellent', color: '#22c55e' },
  B: { label: 'Very Good', color: '#3b82f6' },
  C: { label: 'Good', color: '#f59e0b' },
  D: { label: 'Pass', color: '#f97316' },
  F: { label: 'Fail', color: '#ef4444' },
};

/**
 * WPM (Words Per Minute) Ratings
 */
export const WPM_RATINGS = {
  EXCELLENT: { min: 80, label: 'Excellent', color: '#22c55e' },
  GREAT: { min: 60, label: 'Great', color: '#3b82f6' },
  GOOD: { min: 40, label: 'Good', color: '#f59e0b' },
  FAIR: { min: 20, label: 'Fair', color: '#f97316' },
  SLOW: { min: 0, label: 'Keep Practicing', color: '#ef4444' },
};

/**
 * Notification Types
 */
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  ACHIEVEMENT: 'achievement',
};

/**
 * User Roles
 */
export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
};

/**
 * Export all constants as a single object (optional)
 */
export default {
  API_BASE_URL,
  API_ENDPOINTS,
  BREAKPOINTS,
  MEDIA_QUERIES,
  COLORS,
  DIFFICULTY_LEVELS,
  GAME_IDS,
  GAME_SETTINGS,
  DATE_FORMATS,
  STORAGE_KEYS,
  PAGINATION,
  VALIDATION,
  FILE_UPLOAD,
  ANIMATION_DURATION,
  DEBOUNCE_DELAY,
  Z_INDEX,
  ROUTES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  TOAST_CONFIG,
  APP_INFO,
  FEATURES,
  PERFORMANCE,
  SOCIAL_LINKS,
  GRADE_BOUNDARIES,
  GRADE_LABELS,
  WPM_RATINGS,
  NOTIFICATION_TYPES,
  USER_ROLES,
};