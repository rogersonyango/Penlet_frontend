import { useState, useEffect } from 'react';

/**
 * useMediaQuery Hook
 * 
 * Detect screen size and respond to media query changes
 * Perfect for responsive design without CSS
 * 
 * @param {string} query - Media query string
 * @returns {boolean} Whether the media query matches
 * 
 * @example
 * // Check if mobile
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * 
 * return (
 *   <div>
 *     {isMobile ? <MobileMenu /> : <DesktopMenu />}
 *   </div>
 * );
 * 
 * @example
 * // Multiple breakpoints
 * const isMobile = useMediaQuery('(max-width: 640px)');
 * const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
 * const isDesktop = useMediaQuery('(min-width: 1025px)');
 * 
 * @example
 * // Tailwind breakpoints
 * const isSm = useMediaQuery('(min-width: 640px)');
 * const isMd = useMediaQuery('(min-width: 768px)');
 * const isLg = useMediaQuery('(min-width: 1024px)');
 * const isXl = useMediaQuery('(min-width: 1280px)');
 */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is defined (for SSR compatibility)
    if (typeof window === 'undefined') {
      return;
    }

    // Create media query list
    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Handler for changes
    const handler = (event) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      
      return () => {
        mediaQuery.removeEventListener('change', handler);
      };
    } 
    // Older browsers (fallback)
    else {
      mediaQuery.addListener(handler);
      
      return () => {
        mediaQuery.removeListener(handler);
      };
    }
  }, [query]);

  return matches;
};

/**
 * Predefined breakpoint hooks for common use cases
 */

/**
 * Check if screen is mobile size (max-width: 640px)
 */
export const useIsMobile = () => {
  return useMediaQuery('(max-width: 640px)');
};

/**
 * Check if screen is tablet size (641px - 1024px)
 */
export const useIsTablet = () => {
  return useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
};

/**
 * Check if screen is desktop size (min-width: 1025px)
 */
export const useIsDesktop = () => {
  return useMediaQuery('(min-width: 1025px)');
};

/**
 * Get all breakpoint states at once
 * @returns {Object} { isMobile, isTablet, isDesktop }
 * 
 * @example
 * const { isMobile, isTablet, isDesktop } = useBreakpoints();
 * 
 * if (isMobile) {
 *   // Mobile layout
 * } else if (isTablet) {
 *   // Tablet layout
 * } else {
 *   // Desktop layout
 * }
 */
export const useBreakpoints = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  return { isMobile, isTablet, isDesktop };
};

export default useMediaQuery;