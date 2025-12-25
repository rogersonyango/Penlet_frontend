import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * 
 * Delays updating a value until after a specified delay
 * Perfect for search inputs to reduce API calls
 * 
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {any} Debounced value
 * 
 * @example
 * // In a search component
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   // This will only fire 500ms after user stops typing
 *   if (debouncedSearch) {
 *     fetchResults(debouncedSearch);
 *   }
 * }, [debouncedSearch]);
 * 
 * // Without debounce: 100 keystrokes = 100 API calls
 * // With debounce: 100 keystrokes = 1 API call (after user stops typing)
 */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value changes before delay expires
    // This ensures we only update after user stops typing
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;