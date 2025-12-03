import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useInfiniteScroll Hook
 * 
 * Load more content as user scrolls to bottom
 * Perfect for videos list, subjects, leaderboards, etc.
 * 
 * @param {Function} loadMore - Function to load more data
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Distance from bottom to trigger (default: 100px)
 * @param {boolean} options.hasMore - Whether there's more data to load
 * @param {boolean} options.loading - Whether currently loading
 * @returns {Object} { observerRef, isLoading, hasMore }
 * 
 * @example
 * const [items, setItems] = useState([]);
 * const [page, setPage] = useState(1);
 * const [hasMore, setHasMore] = useState(true);
 * 
 * const loadMoreItems = async () => {
 *   const newItems = await fetchItems(page);
 *   setItems(prev => [...prev, ...newItems]);
 *   setPage(prev => prev + 1);
 *   setHasMore(newItems.length > 0);
 * };
 * 
 * const { observerRef, isLoading } = useInfiniteScroll(loadMoreItems, {
 *   hasMore,
 *   threshold: 200
 * });
 * 
 * return (
 *   <div>
 *     {items.map(item => <div key={item.id}>{item.name}</div>)}
 *     <div ref={observerRef}>
 *       {isLoading && <div>Loading...</div>}
 *     </div>
 *   </div>
 * );
 */
const useInfiniteScroll = (loadMore, options = {}) => {
  const {
    threshold = 100,
    hasMore = true,
    loading: externalLoading = false,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);
  const loadingRef = useRef(false);

  const handleLoadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setIsLoading(true);

    try {
      await loadMore();
    } catch (error) {
      console.error('Error loading more:', error);
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [loadMore, hasMore]);

  useEffect(() => {
    loadingRef.current = externalLoading;
    setIsLoading(externalLoading);
  }, [externalLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loadingRef.current) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: `${threshold}px` }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [handleLoadMore, hasMore, threshold]);

  return {
    observerRef,
    isLoading: isLoading || externalLoading,
    hasMore,
  };
};

/**
 * useScrollPosition Hook
 * 
 * Track scroll position
 * Useful for showing/hiding elements based on scroll
 * 
 * @returns {Object} { scrollY, scrollX, scrollDirection }
 * 
 * @example
 * const { scrollY, scrollDirection } = useScrollPosition();
 * 
 * return (
 *   <div>
 *     <Header className={scrollDirection === 'down' && scrollY > 100 ? 'hidden' : ''} />
 *     <div>Scrolled: {scrollY}px</div>
 *   </div>
 * );
 */
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    scrollY: 0,
    scrollX: 0,
    scrollDirection: null,
  });

  const previousScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentScrollX = window.scrollX;

      setScrollPosition({
        scrollY: currentScrollY,
        scrollX: currentScrollX,
        scrollDirection: currentScrollY > previousScrollY.current ? 'down' : 'up',
      });

      previousScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollPosition;
};

/**
 * useScrollToTop Hook
 * 
 * Scroll to top of page
 * 
 * @returns {Function} scrollToTop function
 * 
 * @example
 * const scrollToTop = useScrollToTop();
 * 
 * return (
 *   <button onClick={scrollToTop}>
 *     Back to Top
 *   </button>
 * );
 */
export const useScrollToTop = () => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return scrollToTop;
};

/**
 * useScrollToElement Hook
 * 
 * Scroll to a specific element
 * 
 * @returns {Function} scrollToElement function
 * 
 * @example
 * const scrollTo = useScrollToElement();
 * const sectionRef = useRef(null);
 * 
 * return (
 *   <>
 *     <button onClick={() => scrollTo(sectionRef)}>
 *       Go to Section
 *     </button>
 *     <div ref={sectionRef}>Section content</div>
 *   </>
 * );
 */
export const useScrollToElement = () => {
  const scrollToElement = useCallback((ref, options = {}) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        ...options,
      });
    }
  }, []);

  return scrollToElement;
};

/**
 * useIsBottom Hook
 * 
 * Detect when user has scrolled to bottom
 * Simpler alternative to useInfiniteScroll for basic use cases
 * 
 * @param {number} offset - Offset from bottom in pixels (default: 0)
 * @returns {boolean} isBottom
 * 
 * @example
 * const isBottom = useIsBottom(100);
 * 
 * useEffect(() => {
 *   if (isBottom && hasMore) {
 *     loadMoreData();
 *   }
 * }, [isBottom]);
 */
export const useIsBottom = (offset = 0) => {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      const bottom = scrollTop + clientHeight >= scrollHeight - offset;
      setIsBottom(bottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [offset]);

  return isBottom;
};

export default useInfiniteScroll;