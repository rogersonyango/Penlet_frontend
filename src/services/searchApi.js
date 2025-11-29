const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Global search across all modules
 * @param {string} query - Search query
 * @param {number} limit - Max results per category (default: 10)
 * @returns {Promise<Object>} Search results categorized by type
 */
export const globalSearch = async (query, limit = 10) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/search/global?query=${encodeURIComponent(query)}&user_id=${userId}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Global search error:', error);
    throw error;
  }
};

/**
 * Get search suggestions as user types (for autocomplete)
 * @param {string} query - Search query
 * @param {number} limit - Max suggestions (default: 5)
 * @returns {Promise<Object>} Search suggestions
 */
export const getSearchSuggestions = async (query, limit = 5) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/search/suggestions?query=${encodeURIComponent(query)}&user_id=${userId}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Suggestions failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Search suggestions error:', error);
    throw error;
  }
};