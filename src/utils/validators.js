/**
 * Validators Utility
 * 
 * Validation functions for forms, inputs, and data
 * Returns error message string if invalid, null if valid
 */

/**
 * Validate email address
 * 
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null
 * 
 * @example
 * validateEmail('test@example.com') // null (valid)
 * validateEmail('invalid-email') // 'Invalid email address'
 */
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return 'Invalid email address';
  }
  
  if (email.length > 254) {
    return 'Email is too long';
  }
  
  return null;
};

/**
 * Validate password
 * 
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {string|null} Error message or null
 * 
 * @example
 * validatePassword('secret', { minLength: 8 }) // 'Password must be at least 8 characters'
 * validatePassword('SecurePass123!') // null (valid)
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 6,
    maxLength = 128,
    requireUppercase = false,
    requireLowercase = false,
    requireNumber = false,
    requireSpecial = false,
  } = options;

  if (!password) return 'Password is required';
  
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  
  if (password.length > maxLength) {
    return `Password must be no more than ${maxLength} characters`;
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (requireNumber && !/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character';
  }
  
  return null;
};

/**
 * Validate password confirmation
 * 
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {string|null} Error message or null
 */
export const validatePasswordConfirm = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

/**
 * Validate username
 * 
 * @param {string} username - Username to validate
 * @returns {string|null} Error message or null
 */
export const validateUsername = (username) => {
  if (!username) return 'Username is required';
  
  if (username.length < 3) {
    return 'Username must be at least 3 characters';
  }
  
  if (username.length > 30) {
    return 'Username must be no more than 30 characters';
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return 'Username can only contain letters, numbers, underscores, and hyphens';
  }
  
  return null;
};

/**
 * Validate phone number
 * 
 * @param {string} phone - Phone number to validate
 * @param {string} format - Expected format ('us', 'international', 'any')
 * @returns {string|null} Error message or null
 */
export const validatePhone = (phone, format = 'any') => {
  if (!phone) return 'Phone number is required';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (format === 'us') {
    if (cleaned.length !== 10 && cleaned.length !== 11) {
      return 'Invalid US phone number';
    }
  } else if (format === 'international') {
    if (cleaned.length < 10 || cleaned.length > 15) {
      return 'Invalid international phone number';
    }
  } else {
    if (cleaned.length < 10) {
      return 'Phone number is too short';
    }
  }
  
  return null;
};

/**
 * Validate URL
 * 
 * @param {string} url - URL to validate
 * @returns {string|null} Error message or null
 */
export const validateURL = (url) => {
  if (!url) return 'URL is required';
  
  try {
    new URL(url);
    return null;
  } catch {
    return 'Invalid URL';
  }
};

/**
 * Validate required field
 * 
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of field for error message
 * @returns {string|null} Error message or null
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  
  if (typeof value === 'string' && !value.trim()) {
    return `${fieldName} is required`;
  }
  
  return null;
};

/**
 * Validate minimum length
 * 
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @param {string} fieldName - Name of field for error message
 * @returns {string|null} Error message or null
 */
export const validateMinLength = (value, minLength, fieldName = 'Field') => {
  if (!value) return null;
  
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  
  return null;
};

/**
 * Validate maximum length
 * 
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Name of field for error message
 * @returns {string|null} Error message or null
 */
export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
  if (!value) return null;
  
  if (value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters`;
  }
  
  return null;
};

/**
 * Validate number
 * 
 * @param {any} value - Value to validate
 * @param {Object} options - Validation options
 * @returns {string|null} Error message or null
 */
export const validateNumber = (value, options = {}) => {
  const { min, max, integer = false } = options;
  
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  const num = Number(value);
  
  if (isNaN(num)) {
    return 'Must be a number';
  }
  
  if (integer && !Number.isInteger(num)) {
    return 'Must be a whole number';
  }
  
  if (min !== undefined && num < min) {
    return `Must be at least ${min}`;
  }
  
  if (max !== undefined && num > max) {
    return `Must be no more than ${max}`;
  }
  
  return null;
};

/**
 * Validate date
 * 
 * @param {string|Date} date - Date to validate
 * @param {Object} options - Validation options
 * @returns {string|null} Error message or null
 */
export const validateDate = (date, options = {}) => {
  const { minDate, maxDate, future = false, past = false } = options;
  
  if (!date) return null;
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }
  
  const now = new Date();
  
  if (future && d <= now) {
    return 'Date must be in the future';
  }
  
  if (past && d >= now) {
    return 'Date must be in the past';
  }
  
  if (minDate && d < new Date(minDate)) {
    return `Date must be after ${minDate}`;
  }
  
  if (maxDate && d > new Date(maxDate)) {
    return `Date must be before ${maxDate}`;
  }
  
  return null;
};

/**
 * Validate file
 * 
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {string|null} Error message or null
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = [],
    allowedExtensions = [],
  } = options;
  
  if (!file) return null;
  
  if (file.size > maxSize) {
    return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
  }
  
  if (allowedExtensions.length > 0) {
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return `File extension not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`;
    }
  }
  
  return null;
};

/**
 * Validate age
 * 
 * @param {string|Date} birthDate - Birth date
 * @param {number} minAge - Minimum age required
 * @returns {string|null} Error message or null
 */
export const validateAge = (birthDate, minAge = 13) => {
  if (!birthDate) return null;
  
  const birth = new Date(birthDate);
  
  if (isNaN(birth.getTime())) {
    return 'Invalid birth date';
  }
  
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  if (age < minAge) {
    return `You must be at least ${minAge} years old`;
  }
  
  return null;
};

/**
 * Validate array
 * 
 * @param {Array} array - Array to validate
 * @param {Object} options - Validation options
 * @returns {string|null} Error message or null
 */
export const validateArray = (array, options = {}) => {
  const { minLength, maxLength, unique = false } = options;
  
  if (!Array.isArray(array)) {
    return 'Must be an array';
  }
  
  if (minLength !== undefined && array.length < minLength) {
    return `Must have at least ${minLength} items`;
  }
  
  if (maxLength !== undefined && array.length > maxLength) {
    return `Must have no more than ${maxLength} items`;
  }
  
  if (unique && new Set(array).size !== array.length) {
    return 'Array must contain unique values';
  }
  
  return null;
};

/**
 * Check if value is empty
 * 
 * @param {any} value - Value to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && !value.trim()) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

/**
 * Sanitize input (remove potentially dangerous characters)
 * 
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export default {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateUsername,
  validatePhone,
  validateURL,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumber,
  validateDate,
  validateFile,
  validateAge,
  validateArray,
  isEmpty,
  sanitizeInput,
};