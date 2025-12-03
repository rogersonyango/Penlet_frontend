import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage Hook
 * 
 * Persist state in localStorage with automatic JSON serialization
 * Syncs across tabs and provides easy get/set/remove methods
 * 
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value if nothing in storage
 * @returns {Array} [value, setValue, removeValue]
 * 
 * @example
 * // Simple usage
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
 * 
 * // Change theme
 * setTheme('dark'); // Automatically saved to localStorage
 * 
 * // Remove theme
 * removeTheme(); // Clears from localStorage
 * 
 * @example
 * // Store complex objects
 * const [user, setUser] = useLocalStorage('user', { name: '', email: '' });
 * 
 * setUser({ name: 'John', email: 'john@example.com' });
 * // Automatically JSON.stringified and saved
 */
const useLocalStorage = (key, initialValue) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      
      // Parse stored json or return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    // Listen for storage events (from other tabs)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  /**
   * Set value in localStorage
   * @param {any} value - Value to store (will be JSON.stringified)
   */
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function (like useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  /**
   * Remove value from localStorage
   */
  const removeValue = useCallback(() => {
    try {
      // Remove from state
      setStoredValue(initialValue);

      // Remove from local storage
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;