import { useState, useEffect } from 'react';

/**
 * useNetwork Hook
 * 
 * Detect online/offline status and network changes
 * Show offline indicators, pause sync, etc.
 * 
 * @returns {Object} Network status information
 * 
 * @example
 * const { isOnline, wasOffline, effectiveType, downlink } = useNetwork();
 * 
 * return (
 *   <div>
 *     {!isOnline && (
 *       <div className="offline-banner">
 *         You are offline. Some features may be unavailable.
 *       </div>
 *     )}
 *     
 *     {wasOffline && isOnline && (
 *       <div className="back-online-banner">
 *         You're back online! Syncing data...
 *       </div>
 *     )}
 *     
 *     <div>Connection: {effectiveType}</div>
 *   </div>
 * );
 */
const useNetwork = () => {
  const [networkState, setNetworkState] = useState({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    wasOffline: false,
    effectiveType: null,
    downlink: null,
    rtt: null,
    saveData: false,
  });

  useEffect(() => {
    // Update online/offline status
    const handleOnline = () => {
      setNetworkState(prev => ({
        ...prev,
        isOnline: true,
        wasOffline: !prev.isOnline, // Was just offline
      }));

      // Clear wasOffline after 5 seconds
      setTimeout(() => {
        setNetworkState(prev => ({ ...prev, wasOffline: false }));
      }, 5000);
    };

    const handleOffline = () => {
      setNetworkState(prev => ({
        ...prev,
        isOnline: false,
      }));
    };

    // Get network information (if available)
    const updateNetworkInfo = () => {
      if ('connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        setNetworkState(prev => ({
          ...prev,
          effectiveType: connection.effectiveType || null,
          downlink: connection.downlink || null,
          rtt: connection.rtt || null,
          saveData: connection.saveData || false,
        }));
      }
    };

    // Set up listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for network changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateNetworkInfo);
    }

    // Initial update
    updateNetworkInfo();

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, []);

  return networkState;
};

/**
 * useOnlineStatus Hook
 * 
 * Simple hook that only returns online status
 * Lighter alternative to useNetwork
 * 
 * @returns {boolean} isOnline
 * 
 * @example
 * const isOnline = useOnlineStatus();
 * 
 * if (!isOnline) {
 *   return <OfflineMessage />;
 * }
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

/**
 * useNetworkEffect Hook
 * 
 * Run an effect when network status changes
 * Useful for syncing data when back online
 * 
 * @param {Function} onOnline - Called when online
 * @param {Function} onOffline - Called when offline
 * 
 * @example
 * useNetworkEffect(
 *   () => {
 *     console.log('Back online! Syncing data...');
 *     syncPendingData();
 *   },
 *   () => {
 *     console.log('Offline! Pausing sync...');
 *     pauseSync();
 *   }
 * );
 */
export const useNetworkEffect = (onOnline, onOffline) => {
  const { isOnline, wasOffline } = useNetwork();

  useEffect(() => {
    if (isOnline && wasOffline && onOnline) {
      onOnline();
    }
  }, [isOnline, wasOffline, onOnline]);

  useEffect(() => {
    if (!isOnline && onOffline) {
      onOffline();
    }
  }, [isOnline, onOffline]);
};

/**
 * useConnectionSpeed Hook
 * 
 * Get connection speed category
 * 
 * @returns {string} 'slow' | 'medium' | 'fast' | 'unknown'
 * 
 * @example
 * const speed = useConnectionSpeed();
 * 
 * return (
 *   <div>
 *     {speed === 'slow' && (
 *       <div>Slow connection detected. Using reduced quality.</div>
 *     )}
 *   </div>
 * );
 */
export const useConnectionSpeed = () => {
  const { effectiveType } = useNetwork();

  if (!effectiveType) return 'unknown';

  switch (effectiveType) {
    case 'slow-2g':
    case '2g':
      return 'slow';
    case '3g':
      return 'medium';
    case '4g':
    case '5g':
      return 'fast';
    default:
      return 'unknown';
  }
};

/**
 * usePing Hook
 * 
 * Measure latency to a server
 * 
 * @param {string} url - URL to ping
 * @param {number} interval - Ping interval in ms (default: 30000)
 * @returns {Object} { latency, isChecking }
 * 
 * @example
 * const { latency, isChecking } = usePing('http://localhost:8000/api/v1/ping');
 * 
 * return (
 *   <div>
 *     {!isChecking && <div>Latency: {latency}ms</div>}
 *   </div>
 * );
 */
export const usePing = (url, interval = 30000) => {
  const [latency, setLatency] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const ping = async () => {
      setIsChecking(true);
      const startTime = Date.now();

      try {
        await fetch(url, { method: 'HEAD' });
        const endTime = Date.now();
        setLatency(endTime - startTime);
      } catch (error) {
        console.error('Ping failed:', error);
        setLatency(null);
      } finally {
        setIsChecking(false);
      }
    };

    // Initial ping
    ping();

    // Set up interval
    const intervalId = setInterval(ping, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [url, interval]);

  return { latency, isChecking };
};

export default useNetwork;