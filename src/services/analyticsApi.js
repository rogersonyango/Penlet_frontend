const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Track an analytics event
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} Created event
 */
export const trackEvent = async (eventData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/analytics/events?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to track event: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Track event error:', error);
    throw error;
  }
};

/**
 * Get dashboard summary
 * @returns {Promise<Object>} Dashboard data
 */
export const getDashboard = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/analytics/dashboard?user_id=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get dashboard error:', error);
    throw error;
  }
};

/**
 * Get time series data for charts
 * @param {string} metric - Metric type (study_time, activities, performance)
 * @param {number} days - Number of days (default: 30)
 * @returns {Promise<Object>} Time series data
 */
export const getTimeSeriesData = async (metric, days = 30) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/analytics/time-series?user_id=${userId}&metric=${metric}&days=${days}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch time series: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get time series error:', error);
    throw error;
  }
};

/**
 * Get subject analytics
 * @returns {Promise<Object>} Subject analytics data
 */
export const getSubjectAnalytics = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/analytics/subjects?user_id=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch subject analytics: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get subject analytics error:', error);
    throw error;
  }
};

/**
 * Create a study goal
 * @param {Object} goalData - Goal data
 * @returns {Promise<Object>} Created goal
 */
export const createGoal = async (goalData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/analytics/goals?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create goal: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create goal error:', error);
    throw error;
  }
};

/**
 * Get study goals
 * @param {boolean} activeOnly - Show only active goals
 * @returns {Promise<Object>} List of goals
 */
export const getGoals = async (activeOnly = false) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/analytics/goals?user_id=${userId}&active_only=${activeOnly}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch goals: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get goals error:', error);
    throw error;
  }
};

/**
 * Get AI-generated insights
 * @returns {Promise<Object>} Insights and recommendations
 */
export const getInsights = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/analytics/insights?user_id=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch insights: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get insights error:', error);
    throw error;
  }
};