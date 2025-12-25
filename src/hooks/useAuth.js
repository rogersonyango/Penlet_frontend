import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import axios from 'axios';

/**
 * useAuth Hook
 * 
 * Centralized authentication management for Penlet
 * Handles login, logout, registration, and user state
 * 
 * @returns {Object} Authentication state and methods
 * 
 * @example
 * const { user, isAuthenticated, login, logout, register, loading, error } = useAuth();
 * 
 * // Login
 * await login({ email: 'user@example.com', password: 'password' });
 * 
 * // Check if authenticated
 * if (isAuthenticated) {
 *   // Show protected content
 * }
 * 
 * // Logout
 * logout();
 */
const useAuth = () => {
  const { user, setUser, logout: zustandLogout } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
  }, [setUser]);

  // Update isAuthenticated when user changes
  useEffect(() => {
    setIsAuthenticated(!!user && !!localStorage.getItem('auth_token'));
  }, [user]);

  /**
   * Login user
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} User data
   */
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/login', credentials);
      
      const { access_token, user: userData } = response.data;

      // Store token and user data
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update global state
      setUser(userData);
      setIsAuthenticated(true);

      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  /**
   * Register new user
   * @param {Object} userData - Registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.name - User name
   * @returns {Promise<Object>} User data
   */
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/register', userData);
      
      const { access_token, user: newUser } = response.data;

      // Store token and user data
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('user', JSON.stringify(newUser));

      // Update global state
      setUser(newUser);
      setIsAuthenticated(true);

      return newUser;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    // Clear storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');

    // Clear global state
    zustandLogout();
    setIsAuthenticated(false);
    setError(null);
  }, [zustandLogout]);

  /**
   * Get current user from API
   * @returns {Promise<Object>} Current user data
   */
  const getCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:8000/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch user';
      setError(errorMessage);
      
      // If unauthorized, logout
      if (err.response?.status === 401) {
        logout();
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setUser, logout]);

  /**
   * Update user profile
   * @param {Object} updates - User data to update
   * @returns {Promise<Object>} Updated user data
   */
  const updateProfile = useCallback(async (updates) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        'http://localhost:8000/api/v1/auth/profile',
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  /**
   * Change password
   * @param {Object} passwords - Password data
   * @param {string} passwords.currentPassword - Current password
   * @param {string} passwords.newPassword - New password
   * @returns {Promise<void>}
   */
  const changePassword = useCallback(async (passwords) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(
        'http://localhost:8000/api/v1/auth/change-password',
        passwords,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to change password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  const requestPasswordReset = useCallback(async (email) => {
    setLoading(true);
    setError(null);

    try {
      await axios.post('http://localhost:8000/api/v1/auth/forgot-password', { email });
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to send reset email';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get authentication token
   * @returns {string|null} JWT token
   */
  const getToken = useCallback(() => {
    return localStorage.getItem('auth_token');
  }, []);

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,

    // Methods
    login,
    logout,
    register,
    getCurrentUser,
    updateProfile,
    changePassword,
    requestPasswordReset,
    getToken,
  };
};

export default useAuth;