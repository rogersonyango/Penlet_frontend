const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Get all games with filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} List of games
 */
export const getGames = async ({
  category = null,
  difficulty = null,
  isFeatured = null,
  page = 1,
  pageSize = 20
} = {}) => {
  try {
    const params = new URLSearchParams({ page, page_size: pageSize });
    
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    if (isFeatured !== null) params.append('is_featured', isFeatured);

    const response = await fetch(
      `${API_BASE_URL}/games/?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch games: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get games error:', error);
    throw error;
  }
};

/**
 * Get a specific game by ID
 * @param {string} gameId - Game ID
 * @returns {Promise<Object>} Game details
 */
export const getGame = async (gameId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/games/${gameId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch game: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get game error:', error);
    throw error;
  }
};

/**
 * Submit a game score
 * @param {Object} scoreData - Score data
 * @returns {Promise<Object>} Created score with achievements
 */
export const submitScore = async (scoreData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/games/scores?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to submit score: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Submit score error:', error);
    throw error;
  }
};

/**
 * Get user's scores
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} List of scores
 */
export const getUserScores = async ({
  gameId = null,
  page = 1,
  pageSize = 20
} = {}) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const params = new URLSearchParams({ user_id: userId, page, page_size: pageSize });
    if (gameId) params.append('game_id', gameId);

    const response = await fetch(
      `${API_BASE_URL}/games/scores/user?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch scores: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get scores error:', error);
    throw error;
  }
};

/**
 * Get leaderboard for a game
 * @param {string} gameId - Game ID
 * @param {number} limit - Number of entries (default: 10)
 * @returns {Promise<Object>} Leaderboard with rankings
 */
export const getLeaderboard = async (gameId, limit = 10) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    const params = new URLSearchParams({ limit });
    if (userId) params.append('user_id', userId);

    const response = await fetch(
      `${API_BASE_URL}/games/${gameId}/leaderboard?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get leaderboard error:', error);
    throw error;
  }
};

/**
 * Get user's game statistics
 * @returns {Promise<Object>} Comprehensive game statistics
 */
export const getUserStatistics = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/games/statistics/user?user_id=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch statistics: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get statistics error:', error);
    throw error;
  }
};

/**
 * Get user's achievements
 * @returns {Promise<Object>} List of achievements
 */
export const getUserAchievements = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/games/achievements/user?user_id=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch achievements: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get achievements error:', error);
    throw error;
  }
};

/**
 * Initialize default achievements for user
 * @returns {Promise<Object>} Success message
 */
export const initializeAchievements = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/games/achievements/initialize?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to initialize achievements: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Initialize achievements error:', error);
    throw error;
  }
};