// src/services/gamesApi.js
// Games API Service - Connects to Penlet Backend Games Module

const API_URL = "http://localhost:8000/api/v1";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper function for authenticated requests
const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  
  return response.json();
};

// ==================== GAMES ====================

export const getGames = async (category = null, difficulty = null) => {
  try {
    let url = `${API_URL}/games/`;
    const params = new URLSearchParams();
    
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    
    if (params.toString()) url += `?${params.toString()}`;
    
    return await authenticatedFetch(url);
  } catch (error) {
    console.error('Get games error:', error);
    throw error;
  }
};

export const getGame = async (gameId) => {
  try {
    return await authenticatedFetch(`${API_URL}/games/${gameId}`);
  } catch (error) {
    console.error('Get game error:', error);
    throw error;
  }
};

export const getFeaturedGames = async () => {
  try {
    return await authenticatedFetch(`${API_URL}/games/featured`);
  } catch (error) {
    console.error('Get featured games error:', error);
    throw error;
  }
};

export const startGameSession = async (gameId) => {
  try {
    return await authenticatedFetch(`${API_URL}/games/${gameId}/start`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Start game session error:', error);
    throw error;
  }
};

export const submitGameScore = async (gameId, scoreData) => {
  try {
    return await authenticatedFetch(`${API_URL}/games/${gameId}/submit`, {
      method: 'POST',
      body: JSON.stringify(scoreData),
    });
  } catch (error) {
    console.error('Submit game score error:', error);
    throw error;
  }
};

export const getMyScores = async (gameId = null) => {
  try {
    const url = gameId 
      ? `${API_URL}/games/scores/me?game_id=${gameId}`
      : `${API_URL}/games/scores/me`;
    return await authenticatedFetch(url);
  } catch (error) {
    console.error('Get my scores error:', error);
    throw error;
  }
};

export const getHighScores = async (gameId, limit = 10) => {
  try {
    return await authenticatedFetch(`${API_URL}/games/${gameId}/highscores?limit=${limit}`);
  } catch (error) {
    console.error('Get high scores error:', error);
    throw error;
  }
};

export const getGameStats = async () => {
  try {
    return await authenticatedFetch(`${API_URL}/games/stats`);
  } catch (error) {
    console.error('Get game stats error:', error);
    throw error;
  }
};

export const getLeaderboard = async (period = 'all_time', limit = 10) => {
  try {
    return await authenticatedFetch(`${API_URL}/games/leaderboard?period=${period}&limit=${limit}`);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    throw error;
  }
};

export const getAchievements = async () => {
  try {
    return await authenticatedFetch(`${API_URL}/games/achievements`);
  } catch (error) {
    console.error('Get achievements error:', error);
    throw error;
  }
};

// Utility functions
export const formatGameTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const calculateAccuracy = (correct, total) => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

export const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    hard: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    expert: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };
  return colors[difficulty] || 'bg-gray-100 text-gray-700';
};