/**
 * Helpers Utility
 * 
 * General helper functions for common operations
 */

/**
 * Truncate text with ellipsis
 * 
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 * 
 * @example
 * truncate('Hello World', 5) // 'Hello...'
 */
export const truncate = (text, length, suffix = '...') => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length) + suffix;
};

/**
 * Capitalize first letter
 * 
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Capitalize all words
 * 
 * @param {string} text - Text to capitalize
 * @returns {string} Title cased text
 */
export const titleCase = (text) => {
  if (!text) return '';
  return text.split(' ').map(capitalize).join(' ');
};

/**
 * Convert to slug (URL-friendly)
 * 
 * @param {string} text - Text to convert
 * @returns {string} Slug
 */
export const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Debounce function
 * 
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Throttle function
 * 
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between calls
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Shuffle array
 * 
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array (new array)
 */
export const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Group array by key
 * 
 * @param {Array} array - Array to group
 * @param {string|Function} key - Key to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {});
};

/**
 * Sort array by key
 * 
 * @param {Array} array - Array to sort
 * @param {string|Function} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted array (new array)
 */
export const sortBy = (array, key, order = 'asc') => {
  const arr = [...array];
  return arr.sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Remove duplicates from array
 * 
 * @param {Array} array - Array with duplicates
 * @param {string|Function} key - Optional key for objects
 * @returns {Array} Array without duplicates
 */
export const unique = (array, key) => {
  if (!key) return [...new Set(array)];
  
  const seen = new Set();
  return array.filter(item => {
    const k = typeof key === 'function' ? key(item) : item[key];
    return seen.has(k) ? false : seen.add(k);
  });
};

/**
 * Deep clone object
 * 
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Merge objects deeply
 * 
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
export const deepMerge = (target, source) => {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  
  return output;
};

/**
 * Check if value is object
 * 
 * @param {any} item - Value to check
 * @returns {boolean} True if object
 */
export const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

/**
 * Get nested property safely
 * 
 * @param {Object} obj - Object to get from
 * @param {string} path - Property path (e.g., 'user.profile.name')
 * @param {any} defaultValue - Default value if not found
 * @returns {any} Property value or default
 */
export const getNestedProperty = (obj, path, defaultValue = undefined) => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result === undefined ? defaultValue : result;
};

/**
 * Generate random ID
 * 
 * @param {number} length - ID length
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
  return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Sleep/delay function
 * 
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry function with exponential backoff
 * 
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} Function result
 */
export const retry = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(delay * Math.pow(2, i));
    }
  }
};

/**
 * Copy text to clipboard
 * 
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} True if successful
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Download file
 * 
 * @param {string} url - File URL
 * @param {string} filename - Filename
 */
export const downloadFile = (url, filename) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * Check if mobile device
 * 
 * @returns {boolean} True if mobile
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Get query parameters from URL
 * 
 * @param {string} url - URL string (optional, defaults to current URL)
 * @returns {Object} Query parameters object
 */
export const getQueryParams = (url = window.location.href) => {
  const params = {};
  const searchParams = new URL(url).searchParams;
  
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  
  return params;
};

/**
 * Build query string from object
 * 
 * @param {Object} params - Parameters object
 * @returns {string} Query string
 */
export const buildQueryString = (params) => {
  return Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};

export default {
  truncate,
  capitalize,
  titleCase,
  slugify,
  debounce,
  throttle,
  shuffle,
  groupBy,
  sortBy,
  unique,
  deepClone,
  deepMerge,
  isObject,
  getNestedProperty,
  generateId,
  sleep,
  retry,
  copyToClipboard,
  downloadFile,
  isMobile,
  getQueryParams,
  buildQueryString,
};