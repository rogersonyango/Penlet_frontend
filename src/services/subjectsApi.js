// src/services/subjectsApi.js

const API_URL = "http://localhost:8000/api/v1";

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper to get user ID
const getUserId = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.id;
    } catch (e) {
      console.error('Error parsing user:', e);
      return null;
    }
  }
  return null;
};

/**
 * Create a new subject
 */
export const createSubject = async (subjectData) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/subjects/?user_id=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(subjectData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create subject');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
};

/**
 * Get all subjects with filters
 */
export const getSubjects = async (params = {}) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const queryParams = new URLSearchParams({
      user_id: userId,
      page: params.page || 1,
      page_size: params.page_size || 100,
      ...(params.search && { search: params.search }),
      ...(params.grade_level && { grade_level: params.grade_level }),
      ...(params.term && { term: params.term }),
      ...(params.is_favorite !== undefined && { is_favorite: params.is_favorite }),
      ...(params.is_active !== undefined && { is_active: params.is_active })
    });

    const response = await fetch(`${API_URL}/subjects/?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subjects');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
};

/**
 * Get active subjects (for dropdowns)
 */
export const getActiveSubjects = async () => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/subjects/active?user_id=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch active subjects');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching active subjects:', error);
    throw error;
  }
};

/**
 * Get a single subject by ID
 */
export const getSubject = async (subjectId) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/subjects/${subjectId}?user_id=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Subject not found');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subject:', error);
    throw error;
  }
};

/**
 * Update a subject
 */
export const updateSubject = async (subjectId, updateData) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/subjects/${subjectId}?user_id=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update subject');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating subject:', error);
    throw error;
  }
};

/**
 * Delete a subject
 */
export const deleteSubject = async (subjectId) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/subjects/${subjectId}?user_id=${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete subject');
    }

    return true;
  } catch (error) {
    console.error('Error deleting subject:', error);
    throw error;
  }
};

/**
 * Toggle favorite status
 */
export const toggleFavorite = async (subjectId) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/subjects/${subjectId}/favorite?user_id=${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to toggle favorite');
    }

    return await response.json();
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

/**
 * Get subjects with statistics
 */
export const getSubjectsWithStats = async () => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/subjects/stats?user_id=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subject statistics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subject stats:', error);
    throw error;
  }
};

/**
 * Refresh subject counts
 */
export const refreshSubjectCounts = async (subjectId) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/subjects/${subjectId}/refresh-counts?user_id=${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to refresh counts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error refreshing counts:', error);
    throw error;
  }
};