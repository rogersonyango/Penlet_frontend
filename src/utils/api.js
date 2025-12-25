/**
 * API Utility
 * Helper functions for API calls and error handling
 */

import { API_BASE_URL, ERROR_MESSAGES } from './constants';

/**
 * Build API URL with query parameters
 */
export const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint, API_BASE_URL);
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

/**
 * Get authorization headers
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Handle API error
 */
export const handleApiError = (error) => {
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  if (error.response.status === 401) {
    return ERROR_MESSAGES.UNAUTHORIZED;
  }
  
  if (error.response.status === 404) {
    return ERROR_MESSAGES.NOT_FOUND;
  }
  
  if (error.response.status >= 500) {
    return ERROR_MESSAGES.SERVER_ERROR;
  }
  
  return error.response.data?.detail || ERROR_MESSAGES.UNKNOWN;
};

/**
 * Check if response is successful
 */
export const isSuccessResponse = (status) => {
  return status >= 200 && status < 300;
};

/**
 * Parse API response
 */
export const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  
  return await response.text();
};

export default {
  buildApiUrl,
  getAuthHeaders,
  handleApiError,
  isSuccessResponse,
  parseResponse,
};