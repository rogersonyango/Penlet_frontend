/**
 * Content API Service
 * 
 * Handles all API calls related to content management
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

/**
 * Get all content
 * @param {Object} filters - Optional filters (type, subject, search)
 * @returns {Promise<Array>} List of content
 */
export const getAllContent = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/content?${params}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch content');
    return await response.json();
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

/**
 * Get single content by ID
 * @param {number} id - Content ID
 * @returns {Promise<Object>} Content details
 */
export const getContentById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/content/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch content');
    return await response.json();
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

/**
 * Create new content
 * @param {FormData} formData - Content data with file
 * @returns {Promise<Object>} Created content
 */
export const createContent = async (formData) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/content`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData
      },
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to create content');
    return await response.json();
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
};

/**
 * Update content
 * @param {number} id - Content ID
 * @param {FormData|Object} data - Updated content data
 * @returns {Promise<Object>} Updated content
 */
export const updateContent = async (id, data) => {
  try {
    const token = getAuthToken();
    const isFormData = data instanceof FormData;

    const response = await fetch(`${API_BASE_URL}/content/${id}`, {
      method: 'PUT',
      headers: isFormData
        ? { 'Authorization': `Bearer ${token}` }
        : getAuthHeaders(),
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update content');
    return await response.json();
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
};

/**
 * Delete content
 * @param {number} id - Content ID
 * @returns {Promise<void>}
 */
export const deleteContent = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/content/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to delete content');
    return await response.json();
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
};

/**
 * Upload file
 * @param {File} file - File to upload
 * @param {string} type - Content type (note/video/assignment)
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} Upload response with file path
 */
export const uploadFile = async (file, type, onProgress) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = getAuthToken();
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Upload failed'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${API_BASE_URL}/content/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Get content by subject
 * @param {number} subjectId - Subject ID
 * @returns {Promise<Array>} List of content for subject
 */
export const getContentBySubject = async (subjectId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}/content`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch content');
    return await response.json();
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

/**
 * Get teacher's content
 * @returns {Promise<Array>} List of teacher's content
 */
export const getMyContent = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/content/my`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch content');
    return await response.json();
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export default {
  getAllContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  uploadFile,
  getContentBySubject,
  getMyContent,
};