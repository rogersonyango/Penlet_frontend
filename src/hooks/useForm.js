import { useState, useCallback } from 'react';

/**
 * useForm Hook
 * 
 * Simplified form state management with validation
 * Handles input changes, validation, and form submission
 * 
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Form submission handler
 * @param {Object} validationRules - Validation rules for each field
 * @returns {Object} Form state and handlers
 * 
 * @example
 * const { values, errors, handleChange, handleSubmit, isValid, reset } = useForm(
 *   { email: '', password: '' },
 *   (values) => {
 *     console.log('Submitting:', values);
 *     // Make API call
 *   },
 *   {
 *     email: (value) => !value ? 'Email is required' : !/\S+@\S+\.\S+/.test(value) ? 'Email is invalid' : null,
 *     password: (value) => !value ? 'Password is required' : value.length < 6 ? 'Password must be at least 6 characters' : null,
 *   }
 * );
 * 
 * return (
 *   <form onSubmit={handleSubmit}>
 *     <input name="email" value={values.email} onChange={handleChange} />
 *     {errors.email && <span>{errors.email}</span>}
 *     
 *     <input name="password" type="password" value={values.password} onChange={handleChange} />
 *     {errors.password && <span>{errors.password}</span>}
 *     
 *     <button type="submit" disabled={!isValid}>Submit</button>
 *   </form>
 * );
 */
const useForm = (initialValues = {}, onSubmit, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate a single field
   * @param {string} name - Field name
   * @param {any} value - Field value
   * @returns {string|null} Error message or null
   */
  const validateField = useCallback((name, value) => {
    if (!validationRules[name]) return null;
    return validationRules[name](value, values);
  }, [validationRules, values]);

  /**
   * Validate all fields
   * @returns {Object} Errors object
   */
  const validateAll = useCallback(() => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
      }
    });

    return newErrors;
  }, [validateField, validationRules, values]);

  /**
   * Handle input change
   * @param {Event} e - Change event
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    // Update values
    setValues(prev => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  }, [validateField, touched]);

  /**
   * Handle input blur (mark as touched)
   * @param {Event} e - Blur event
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    // Validate on blur
    const error = validateField(name, values[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, [validateField, values]);

  /**
   * Handle form submission
   * @param {Event} e - Submit event
   */
  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    const newErrors = validateAll();
    setErrors(newErrors);

    // If no errors, submit
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (err) {
        console.error('Form submission error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateAll, onSubmit]);

  /**
   * Reset form to initial values
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Set a specific field value
   * @param {string} name - Field name
   * @param {any} value - Field value
   */
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));

    // Validate if touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  }, [validateField, touched]);

  /**
   * Set a specific field error
   * @param {string} name - Field name
   * @param {string} error - Error message
   */
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  /**
   * Check if form is valid
   */
  const isValid = Object.keys(errors).length === 0 && 
                  Object.keys(touched).length > 0;

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    isValid,

    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
  };
};

/**
 * Common validation rules
 */
export const validators = {
  required: (fieldName) => (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? 'Invalid email address' : null;
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    return value.length < min ? `Must be at least ${min} characters` : null;
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    return value.length > max ? `Must be no more than ${max} characters` : null;
  },

  pattern: (regex, message) => (value) => {
    if (!value) return null;
    return !regex.test(value) ? message : null;
  },

  match: (fieldName, matchFieldName) => (value, allValues) => {
    if (!value) return null;
    return value !== allValues[matchFieldName] 
      ? `${fieldName} must match ${matchFieldName}` 
      : null;
  },

  number: (value) => {
    if (!value) return null;
    return isNaN(value) ? 'Must be a number' : null;
  },

  min: (min) => (value) => {
    if (!value) return null;
    return Number(value) < min ? `Must be at least ${min}` : null;
  },

  max: (max) => (value) => {
    if (!value) return null;
    return Number(value) > max ? `Must be no more than ${max}` : null;
  },
};

/**
 * Combine multiple validators
 * @param {...Function} validators - Validator functions
 * @returns {Function} Combined validator
 * 
 * @example
 * const passwordValidation = combineValidators(
 *   validators.required('Password'),
 *   validators.minLength(8),
 *   validators.pattern(/[A-Z]/, 'Must contain uppercase letter')
 * );
 */
export const combineValidators = (...validators) => {
  return (value, allValues) => {
    for (const validator of validators) {
      const error = validator(value, allValues);
      if (error) return error;
    }
    return null;
  };
};

export default useForm;