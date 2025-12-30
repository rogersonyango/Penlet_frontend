/**
 * Admin API Service
 * 
 * Handles all API calls for admin operations
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// ==================== USER MANAGEMENT ====================

/**
 * Get all users
 * @param {Object} filters - Optional filters (role, search)
 * @returns {Promise<Array>} List of users
 */
export const getAllUsers = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/users?${params}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} User details
 */
export const getUserById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Create new user
 * @param {Object} userData - User data {name, email, password, role}
 * @returns {Promise<Object>} Created user
 */
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error('Failed to create user');
    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update user
 * @param {number} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (id, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error('Failed to update user');
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Delete user
 * @param {number} id - User ID
 * @returns {Promise<void>}
 */
export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to delete user');
    return await response.json();
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// ==================== SUBJECT MANAGEMENT ====================

/**
 * Get all subjects
 * @returns {Promise<Array>} List of subjects
 */
export const getAllSubjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch subjects');
    return await response.json();
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
};

/**
 * Create new subject
 * @param {Object} subjectData - Subject data {name, code, description, teacher_id}
 * @returns {Promise<Object>} Created subject
 */
export const createSubject = async (subjectData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(subjectData),
    });

    if (!response.ok) throw new Error('Failed to create subject');
    return await response.json();
  } catch (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
};

/**
 * Update subject
 * @param {number} id - Subject ID
 * @param {Object} subjectData - Updated subject data
 * @returns {Promise<Object>} Updated subject
 */
export const updateSubject = async (id, subjectData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(subjectData),
    });

    if (!response.ok) throw new Error('Failed to update subject');
    return await response.json();
  } catch (error) {
    console.error('Error updating subject:', error);
    throw error;
  }
};

/**
 * Delete subject
 * @param {number} id - Subject ID
 * @returns {Promise<void>}
 */
export const deleteSubject = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to delete subject');
    return await response.json();
  } catch (error) {
    console.error('Error deleting subject:', error);
    throw error;
  }
};

// ==================== ANALYTICS ====================

/**
 * Get admin dashboard analytics
 * @returns {Promise<Object>} Dashboard stats
 */
export const getAdminAnalytics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/admin`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch analytics');
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

/**
 * Get teacher analytics
 * @returns {Promise<Object>} Teacher stats
 */
export const getTeacherAnalytics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/teacher`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch analytics');
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

/**
 * Get system activity log
 * @param {Object} filters - Optional filters (limit, offset)
 * @returns {Promise<Array>} Activity log
 */
export const getActivityLog = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/admin/activity?${params}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch activity log');
    return await response.json();
  } catch (error) {
    console.error('Error fetching activity log:', error);
    throw error;
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getAdminAnalytics,
  getTeacherAnalytics,
  getActivityLog,
};