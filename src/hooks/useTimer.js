import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useTimer Hook
 * 
 * Countdown or countup timer with pause/resume/reset
 * Perfect for games, quizzes, and timed activities
 * 
 * @param {Object} options - Timer options
 * @param {number} options.initialTime - Starting time in seconds
 * @param {boolean} options.countdown - Count down if true, count up if false (default: true)
 * @param {boolean} options.autoStart - Start automatically (default: false)
 * @param {Function} options.onComplete - Called when countdown reaches 0
 * @param {Function} options.onTick - Called every second with current time
 * @returns {Object} Timer state and controls
 * 
 * @example
 * // Countdown timer
 * const { time, isRunning, start, pause, resume, reset } = useTimer({
 *   initialTime: 60,
 *   countdown: true,
 *   onComplete: () => {
 *     console.log('Time is up!');
 *   }
 * });
 * 
 * return (
 *   <div>
 *     <div>Time: {time}s</div>
 *     {!isRunning && <button onClick={start}>Start</button>}
 *     {isRunning && <button onClick={pause}>Pause</button>}
 *     <button onClick={reset}>Reset</button>
 *   </div>
 * );
 * 
 * @example
 * // Countup timer (stopwatch)
 * const { time, isRunning, start, pause, reset } = useTimer({
 *   initialTime: 0,
 *   countdown: false,
 *   autoStart: true
 * });
 * 
 * return (
 *   <div>
 *     <div>Elapsed: {formatTime(time)}</div>
 *     <button onClick={pause}>Pause</button>
 *   </div>
 * );
 */
const useTimer = (options = {}) => {
  const {
    initialTime = 0,
    countdown = true,
    autoStart = false,
    onComplete = null,
    onTick = null,
  } = options;

  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(initialTime);

  /**
   * Start the timer
   */
  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = Date.now();
    }
  }, [isRunning]);

  /**
   * Pause the timer
   */
  const pause = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      pausedTimeRef.current = time;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isRunning, time]);

  /**
   * Resume the timer
   */
  const resume = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = Date.now();
    }
  }, [isRunning]);

  /**
   * Reset the timer
   */
  const reset = useCallback(() => {
    setIsRunning(false);
    setTime(initialTime);
    pausedTimeRef.current = initialTime;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [initialTime]);

  /**
   * Add time to timer
   */
  const addTime = useCallback((seconds) => {
    setTime(prev => Math.max(0, prev + seconds));
    pausedTimeRef.current = Math.max(0, pausedTimeRef.current + seconds);
  }, []);

  /**
   * Set time directly
   */
  const setTimeDirect = useCallback((newTime) => {
    setTime(Math.max(0, newTime));
    pausedTimeRef.current = Math.max(0, newTime);
  }, []);

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(currentTime => {
          const newTime = countdown 
            ? Math.max(0, currentTime - 1)
            : currentTime + 1;

          // Call onTick callback
          if (onTick) {
            onTick(newTime);
          }

          // Check if countdown is complete
          if (countdown && newTime === 0) {
            setIsRunning(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            if (onComplete) {
              onComplete();
            }
          }

          return newTime;
        });
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [isRunning, countdown, onComplete, onTick]);

  return {
    time,
    isRunning,
    start,
    pause,
    resume,
    reset,
    addTime,
    setTime: setTimeDirect,
  };
};

/**
 * useStopwatch Hook
 * 
 * Simple stopwatch (countup timer)
 * 
 * @param {boolean} autoStart - Start automatically (default: false)
 * @returns {Object} Stopwatch state and controls
 * 
 * @example
 * const { time, start, stop, reset, formatTime } = useStopwatch();
 * 
 * return (
 *   <div>
 *     <div>{formatTime()}</div>
 *     <button onClick={start}>Start</button>
 *     <button onClick={stop}>Stop</button>
 *     <button onClick={reset}>Reset</button>
 *   </div>
 * );
 */
export const useStopwatch = (autoStart = false) => {
  const timer = useTimer({
    initialTime: 0,
    countdown: false,
    autoStart,
  });

  const formatTime = useCallback(() => {
    return formatSecondsToTime(timer.time);
  }, [timer.time]);

  return {
    ...timer,
    stop: timer.pause,
    formatTime,
  };
};

/**
 * useCountdown Hook
 * 
 * Simple countdown timer
 * 
 * @param {number} initialSeconds - Starting time in seconds
 * @param {Function} onComplete - Called when countdown reaches 0
 * @returns {Object} Countdown state and controls
 * 
 * @example
 * const { time, start, pause, reset, formatTime, isComplete } = useCountdown(60, () => {
 *   alert('Time is up!');
 * });
 */
export const useCountdown = (initialSeconds, onComplete) => {
  const timer = useTimer({
    initialTime: initialSeconds,
    countdown: true,
    onComplete,
  });

  const formatTime = useCallback(() => {
    return formatSecondsToTime(timer.time);
  }, [timer.time]);

  const isComplete = timer.time === 0;

  return {
    ...timer,
    formatTime,
    isComplete,
  };
};

/**
 * Format seconds to MM:SS or HH:MM:SS
 * 
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string
 * 
 * @example
 * formatSecondsToTime(65) // "01:05"
 * formatSecondsToTime(3665) // "01:01:05"
 */
export const formatSecondsToTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * useInterval Hook
 * 
 * Declarative setInterval with cleanup
 * 
 * @param {Function} callback - Function to call on interval
 * @param {number} delay - Delay in milliseconds (null to pause)
 * 
 * @example
 * const [count, setCount] = useState(0);
 * 
 * useInterval(() => {
 *   setCount(c => c + 1);
 * }, 1000);
 * 
 * return <div>Count: {count}</div>;
 */
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

/**
 * useTimeout Hook
 * 
 * Declarative setTimeout with cleanup
 * 
 * @param {Function} callback - Function to call after delay
 * @param {number} delay - Delay in milliseconds (null to cancel)
 * 
 * @example
 * const [show, setShow] = useState(true);
 * 
 * useTimeout(() => {
 *   setShow(false);
 * }, 5000);
 * 
 * return show ? <div>This will disappear in 5 seconds</div> : null;
 */
export const useTimeout = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setTimeout(() => savedCallback.current(), delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
};

export default useTimer;