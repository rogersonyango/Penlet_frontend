// API Service - Centralized API calls for Penlet
const API_URL = 'http://localhost:8000/api/v1';

// Get auth token from localStorage
const getAuthToken = () => {
  const authData = localStorage.getItem('auth-storage');
  if (authData) {
    const { state } = JSON.parse(authData);
    return state?.token;
  }
  return null;
};

// Create headers with auth token
const getHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json',
});

// Create FormData headers (for file uploads)
const getFormDataHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  // Don't set Content-Type for FormData - browser will set it with boundary
});

// ========== AUTHENTICATION ==========

export const authAPI = {
  // Get current user
  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get user');
    return response.json();
  },
};

// ========== CONTENT ==========

export const contentAPI = {
  // Get all content (filtered by role on backend)
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      page_size: params.page_size || 20,
      ...(params.search && { search: params.search }),
      ...(params.type && { type: params.type }),
      ...(params.subject && { subject: params.subject }),
      ...(params.status && { status: params.status }),
    });

    const response = await fetch(`${API_URL}/content?${queryParams}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch content');
    return response.json();
  },

  // Get my content (teacher)
  getMy: async (params = {}) => {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      page_size: params.page_size || 20,
    });

    const response = await fetch(`${API_URL}/content/my?${queryParams}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch my content');
    return response.json();
  },

  // Get pending content (admin)
  getPending: async () => {
    const response = await fetch(`${API_URL}/content/pending`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch pending content');
    return response.json();
  },

  // Get content statistics
  getStats: async () => {
    const response = await fetch(`${API_URL}/content/stats`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch content stats');
    return response.json();
  },

  // Get single content
  getById: async (id) => {
    const response = await fetch(`${API_URL}/content/${id}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch content');
    return response.json();
  },

  // Create content with file upload
  create: async (formData) => {
    const response = await fetch(`${API_URL}/content`, {
      method: 'POST',
      headers: getFormDataHeaders(),
      body: formData, // FormData object
    });
    if (!response.ok) throw new Error('Failed to create content');
    return response.json();
  },

  // Update content
  update: async (id, data) => {
    const response = await fetch(`${API_URL}/content/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update content');
    return response.json();
  },

  // Delete content
  delete: async (id) => {
    const response = await fetch(`${API_URL}/content/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete content');
    return response.status === 204 ? null : response.json();
  },

  // Approve content (admin)
  approve: async (id) => {
    const response = await fetch(`${API_URL}/content/${id}/approve`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to approve content');
    return response.json();
  },

  // Reject content (admin)
  reject: async (id) => {
    const response = await fetch(`${API_URL}/content/${id}/reject`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to reject content');
    return response.json();
  },

  // Upload file
  uploadFile: async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${API_URL}/content/upload`, {
      method: 'POST',
      headers: getFormDataHeaders(),
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload file');
    return response.json();
  },
};

// ========== SUBJECTS ==========

export const subjectsAPI = {
  // Get all subjects
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      page_size: params.page_size || 100,
      ...(params.search && { search: params.search }),
      ...(params.grade_level && { grade_level: params.grade_level }),
      ...(params.term && { term: params.term }),
      ...(params.is_favorite !== undefined && { is_favorite: params.is_favorite }),
    });

    const response = await fetch(`${API_URL}/subjects?${queryParams}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch subjects');
    return response.json();
  },

  // Get active subjects (for dropdowns)
  getActive: async () => {
    const response = await fetch(`${API_URL}/subjects/active`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch active subjects');
    return response.json();
  },

  // Get subjects with stats
  getStats: async () => {
    const response = await fetch(`${API_URL}/subjects/stats`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch subject stats');
    return response.json();
  },

  // Get single subject
  getById: async (id) => {
    const response = await fetch(`${API_URL}/subjects/${id}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch subject');
    return response.json();
  },

  // Create subject
  create: async (data) => {
    const response = await fetch(`${API_URL}/subjects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create subject');
    return response.json();
  },

  // Update subject
  update: async (id, data) => {
    const response = await fetch(`${API_URL}/subjects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update subject');
    return response.json();
  },

  // Delete subject
  delete: async (id) => {
    const response = await fetch(`${API_URL}/subjects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete subject');
    return response.status === 204 ? null : response.json();
  },

  // Toggle favorite
  toggleFavorite: async (id) => {
    const response = await fetch(`${API_URL}/subjects/${id}/favorite`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to toggle favorite');
    return response.json();
  },
};

// ========== USERS (Admin only) ==========

export const usersAPI = {
  // Get all users (admin)
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      page_size: params.page_size || 20,
      ...(params.search && { search: params.search }),
      ...(params.user_type && { user_type: params.user_type }),
    });

    const response = await fetch(`${API_URL}/users?${queryParams}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  // Create user (admin)
  create: async (data) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  // Update user (admin)
  update: async (id, data) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  // Delete user (admin)
  delete: async (id) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.status === 204 ? null : response.json();
  },
};

// Export all APIs
export default {
  auth: authAPI,
  content: contentAPI,
  subjects: subjectsAPI,
  users: usersAPI,
};