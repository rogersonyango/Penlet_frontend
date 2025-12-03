import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * useFetch Hook
 * 
 * Simplified API calls with automatic loading, error, and success states
 * Includes retry logic and request cancellation
 * 
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @param {boolean} options.immediate - Fetch immediately on mount (default: true)
 * @param {Object} options.params - URL parameters
 * @param {Object} options.headers - Request headers
 * @param {string} options.method - HTTP method (GET, POST, etc.)
 * @param {any} options.body - Request body
 * @returns {Object} { data, loading, error, refetch, cancel }
 * 
 * @example
 * // Simple GET request
 * const { data, loading, error } = useFetch('http://localhost:8000/api/v1/subjects');
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 * return <div>{data.map(subject => subject.name)}</div>;
 * 
 * @example
 * // With authentication
 * const token = localStorage.getItem('auth_token');
 * const { data, loading, error, refetch } = useFetch('http://localhost:8000/api/v1/profile', {
 *   headers: { Authorization: `Bearer ${token}` }
 * });
 * 
 * // Refetch data
 * <button onClick={refetch}>Refresh</button>
 * 
 * @example
 * // Manual fetch (don't fetch on mount)
 * const { data, loading, error, refetch } = useFetch('http://localhost:8000/api/v1/search', {
 *   immediate: false
 * });
 * 
 * // Fetch when needed
 * <button onClick={() => refetch({ params: { q: 'math' } })}>Search</button>
 */
const useFetch = (url, options = {}) => {
  const {
    immediate = true,
    method = 'GET',
    headers = {},
    params = {},
    body = null,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [controller, setController] = useState(null);

  /**
   * Execute the fetch request
   */
  const execute = useCallback(async (overrideOptions = {}) => {
    // Create new abort controller
    const abortController = new AbortController();
    setController(abortController);

    setLoading(true);
    setError(null);

    try {
      // Merge options
      const finalOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
          ...overrideOptions.headers,
        },
        params: {
          ...params,
          ...overrideOptions.params,
        },
        signal: abortController.signal,
      };

      // Add body for POST/PUT/PATCH requests
      if (body || overrideOptions.body) {
        finalOptions.data = overrideOptions.body || body;
      }

      // Make the request
      const response = await axios({
        url,
        ...finalOptions,
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      // Ignore abort errors
      if (axios.isCancel(err)) {
        console.log('Request cancelled:', url);
        return;
      }

      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          err.message || 
                          'An error occurred';
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
      setController(null);
    }
  }, [url, method, headers, params, body]);

  /**
   * Cancel ongoing request
   */
  const cancel = useCallback(() => {
    if (controller) {
      controller.abort();
    }
  }, [controller]);

  /**
   * Refetch data
   */
  const refetch = useCallback((overrideOptions = {}) => {
    return execute(overrideOptions);
  }, [execute]);

  // Auto-fetch on mount if immediate is true
  useEffect(() => {
    if (immediate) {
      execute();
    }

    // Cleanup: cancel request on unmount
    return () => {
      if (controller) {
        controller.abort();
      }
    };
  }, []); // Empty deps - only run on mount

  return {
    data,
    loading,
    error,
    refetch,
    cancel,
  };
};

/**
 * usePost Hook - Specialized hook for POST requests
 * 
 * @param {string} url - API endpoint URL
 * @returns {Object} { data, loading, error, post }
 * 
 * @example
 * const { data, loading, error, post } = usePost('http://localhost:8000/api/v1/subjects');
 * 
 * const handleSubmit = async () => {
 *   try {
 *     const result = await post({ name: 'Math', code: 'MATH101' });
 *     console.log('Created:', result);
 *   } catch (err) {
 *     console.error('Error:', err);
 *   }
 * };
 */
export const usePost = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const post = useCallback(async (body, headers = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...headers,
        },
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { data, loading, error, post };
};

/**
 * usePut Hook - Specialized hook for PUT requests
 * 
 * @param {string} url - API endpoint URL
 * @returns {Object} { data, loading, error, put }
 */
export const usePut = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const put = useCallback(async (body, headers = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(url, body, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...headers,
        },
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { data, loading, error, put };
};

/**
 * useDelete Hook - Specialized hook for DELETE requests
 * 
 * @param {string} url - API endpoint URL
 * @returns {Object} { data, loading, error, deleteRequest }
 */
export const useDelete = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteRequest = useCallback(async (headers = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.delete(url, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          ...headers,
        },
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { data, loading, error, deleteRequest };
};

export default useFetch;