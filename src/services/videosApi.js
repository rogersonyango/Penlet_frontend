// src/services/videosApi.js

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
 * Create a new video
 */
export const createVideo = async (videoData) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/videos/?user_id=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(videoData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create video');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};

/**
 * Get user's videos with filters
 */
export const getVideos = async (params = {}) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const queryParams = new URLSearchParams({
      user_id: userId,
      page: params.page || 1,
      page_size: params.page_size || 100,
      ...(params.search && { search: params.search }),
      ...(params.subject_id && { subject_id: params.subject_id }),
      ...(params.subject_name && { subject_name: params.subject_name }),
      ...(params.video_type && { video_type: params.video_type }),
      ...(params.is_favorite !== undefined && { is_favorite: params.is_favorite })
    });

    const response = await fetch(`${API_URL}/videos/?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

/**
 * Get public videos
 */
export const getPublicVideos = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      page_size: params.page_size || 20,
      ...(params.search && { search: params.search }),
      ...(params.subject_id && { subject_id: params.subject_id })
    });

    const response = await fetch(`${API_URL}/videos/public?${queryParams}`);

    if (!response.ok) {
      throw new Error('Failed to fetch public videos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching public videos:', error);
    throw error;
  }
};

/**
 * Get featured videos
 */
export const getFeaturedVideos = async (limit = 10) => {
  try {
    const response = await fetch(`${API_URL}/videos/featured?limit=${limit}`);

    if (!response.ok) {
      throw new Error('Failed to fetch featured videos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching featured videos:', error);
    throw error;
  }
};

/**
 * Get a single video
 */
export const getVideo = async (videoId) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/videos/${videoId}?user_id=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Video not found');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching video:', error);
    throw error;
  }
};

/**
 * Update a video
 */
export const updateVideo = async (videoId, updateData) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/videos/${videoId}?user_id=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update video');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};

/**
 * Delete a video
 */
export const deleteVideo = async (videoId) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/videos/${videoId}?user_id=${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete video');
    }

    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

/**
 * Toggle favorite
 */
export const toggleFavorite = async (videoId) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/videos/${videoId}/favorite?user_id=${userId}`, {
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
 * Update watch progress
 */
export const updateProgress = async (videoId, progressData) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/videos/${videoId}/progress?user_id=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(progressData)
    });

    if (!response.ok) {
      throw new Error('Failed to update progress');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};

/**
 * Get video progress
 */
export const getProgress = async (videoId) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/videos/${videoId}/progress?user_id=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('No progress found');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching progress:', error);
    throw error;
  }
};

/**
 * Toggle like
 */
export const toggleLike = async (videoId) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/videos/${videoId}/like?user_id=${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to toggle like');
    }

    return await response.json();
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

/**
 * Add comment
 */
export const addComment = async (videoId, content) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/videos/${videoId}/comments?user_id=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      throw new Error('Failed to add comment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

/**
 * Get comments
 */
export const getComments = async (videoId) => {
  try {
    const response = await fetch(`${API_URL}/videos/${videoId}/comments`);

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

/**
 * Delete comment
 */
export const deleteComment = async (commentId) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();

    const response = await fetch(`${API_URL}/videos/comments/${commentId}?user_id=${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }

    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};