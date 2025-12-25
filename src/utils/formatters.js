/**
 * Formatters Utility
 * 
 * Collection of formatting functions for dates, numbers, currency, etc.
 * Ensures consistent formatting across the entire Penlet application
 */

/**
 * Format a date to a readable string
 * 
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'time', 'datetime', 'relative')
 * @returns {string} Formatted date string
 * 
 * @example
 * formatDate(new Date(), 'short') // "Dec 3, 2024"
 * formatDate(new Date(), 'long') // "December 3, 2024"
 * formatDate(new Date(), 'time') // "2:30 PM"
 * formatDate(new Date(), 'datetime') // "Dec 3, 2024 at 2:30 PM"
 * formatDate(new Date(), 'relative') // "2 hours ago"
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return 'Invalid Date';

  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    time: { hour: 'numeric', minute: '2-digit', hour12: true },
    datetime: { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    },
  };

  if (format === 'relative') {
    return formatRelativeTime(d);
  }

  return new Intl.DateTimeFormat('en-US', options[format]).format(d);
};

/**
 * Format time relative to now (e.g., "2 hours ago", "just now")
 * 
 * @param {Date|string|number} date - Date to format
 * @returns {string} Relative time string
 * 
 * @example
 * formatRelativeTime(new Date(Date.now() - 1000 * 60 * 5)) // "5 minutes ago"
 * formatRelativeTime(new Date(Date.now() - 1000 * 30)) // "just now"
 */
export const formatRelativeTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - d) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

/**
 * Format seconds to MM:SS or HH:MM:SS
 * 
 * @param {number} seconds - Total seconds
 * @param {boolean} alwaysShowHours - Always show hours even if 0
 * @returns {string} Formatted time string
 * 
 * @example
 * formatTime(65) // "01:05"
 * formatTime(3665) // "01:01:05"
 * formatTime(45, true) // "00:00:45"
 */
export const formatTime = (seconds, alwaysShowHours = false) => {
  if (typeof seconds !== 'number' || isNaN(seconds)) return '00:00';
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0 || alwaysShowHours) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format a number with thousands separators
 * 
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 * 
 * @example
 * formatNumber(1234.5) // "1,234.5"
 * formatNumber(1234.5678, 2) // "1,234.57"
 */
export const formatNumber = (num, decimals = 0) => {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Format a percentage
 * 
 * @param {number} value - Value to format (0-100 or 0-1)
 * @param {number} decimals - Number of decimal places
 * @param {boolean} isDecimal - Whether input is decimal (0-1) vs percentage (0-100)
 * @returns {string} Formatted percentage
 * 
 * @example
 * formatPercent(85.5) // "85.5%"
 * formatPercent(85.567, 2) // "85.57%"
 * formatPercent(0.855, 1, true) // "85.5%"
 */
export const formatPercent = (value, decimals = 1, isDecimal = false) => {
  if (typeof value !== 'number' || isNaN(value)) return '0%';
  
  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Format file size in bytes to human-readable format
 * 
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 * 
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1536) // "1.5 KB"
 * formatFileSize(1048576) // "1 MB"
 */
export const formatFileSize = (bytes, decimals = 1) => {
  if (bytes === 0) return '0 Bytes';
  if (typeof bytes !== 'number' || isNaN(bytes)) return 'Invalid';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Format currency (defaults to USD)
 * 
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted currency
 * 
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(1234.56, 'EUR') // "€1,234.56"
 * formatCurrency(1234.56, 'UGX') // "UGX 1,235"
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format a score with commas and optional suffix
 * 
 * @param {number} score - Score to format
 * @param {string} suffix - Optional suffix (e.g., 'pts', 'points')
 * @returns {string} Formatted score
 * 
 * @example
 * formatScore(1234) // "1,234"
 * formatScore(1234, 'pts') // "1,234 pts"
 */
export const formatScore = (score, suffix = '') => {
  const formatted = formatNumber(score);
  return suffix ? `${formatted} ${suffix}` : formatted;
};

/**
 * Format duration in milliseconds to readable format
 * 
 * @param {number} ms - Duration in milliseconds
 * @param {boolean} short - Use short format (e.g., "1h 30m" vs "1 hour 30 minutes")
 * @returns {string} Formatted duration
 * 
 * @example
 * formatDuration(90000) // "1 minute 30 seconds"
 * formatDuration(90000, true) // "1m 30s"
 * formatDuration(3665000) // "1 hour 1 minute 5 seconds"
 */
export const formatDuration = (ms, short = false) => {
  if (typeof ms !== 'number' || isNaN(ms)) return '0s';

  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  const parts = [];

  if (days > 0) {
    parts.push(short ? `${days}d` : `${days} day${days > 1 ? 's' : ''}`);
  }
  if (hours > 0) {
    parts.push(short ? `${hours}h` : `${hours} hour${hours > 1 ? 's' : ''}`);
  }
  if (minutes > 0) {
    parts.push(short ? `${minutes}m` : `${minutes} minute${minutes > 1 ? 's' : ''}`);
  }
  if (seconds > 0 || parts.length === 0) {
    parts.push(short ? `${seconds}s` : `${seconds} second${seconds > 1 ? 's' : ''}`);
  }

  return parts.join(' ');
};

/**
 * Format phone number
 * 
 * @param {string} phone - Phone number to format
 * @param {string} format - Format type ('us', 'international', 'raw')
 * @returns {string} Formatted phone number
 * 
 * @example
 * formatPhoneNumber('1234567890', 'us') // "(123) 456-7890"
 * formatPhoneNumber('1234567890', 'international') // "+1 123 456 7890"
 */
export const formatPhoneNumber = (phone, format = 'us') => {
  if (!phone) return '';

  const cleaned = phone.replace(/\D/g, '');

  if (format === 'us') {
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11) {
      return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
  }

  if (format === 'international') {
    if (cleaned.length >= 10) {
      return `+${cleaned.slice(0, -10)} ${cleaned.slice(-10, -7)} ${cleaned.slice(-7, -4)} ${cleaned.slice(-4)}`;
    }
  }

  return cleaned;
};

/**
 * Format initials from a name
 * 
 * @param {string} name - Full name
 * @param {number} max - Maximum number of initials
 * @returns {string} Initials
 * 
 * @example
 * formatInitials('John Doe') // "JD"
 * formatInitials('John Michael Doe', 2) // "JD"
 */
export const formatInitials = (name, max = 2) => {
  if (!name) return '';

  const parts = name.trim().split(' ').filter(Boolean);
  return parts
    .slice(0, max)
    .map(part => part[0].toUpperCase())
    .join('');
};

/**
 * Compact large numbers (e.g., 1,000 -> 1K, 1,000,000 -> 1M)
 * 
 * @param {number} num - Number to compact
 * @param {number} decimals - Decimal places
 * @returns {string} Compacted number
 * 
 * @example
 * formatCompactNumber(1000) // "1K"
 * formatCompactNumber(1500) // "1.5K"
 * formatCompactNumber(1000000) // "1M"
 */
export const formatCompactNumber = (num, decimals = 1) => {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  if (num < 1000) return num.toString();

  const lookup = [
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ];

  const item = lookup.find(item => num >= item.value);
  
  if (item) {
    return (num / item.value).toFixed(decimals).replace(/\.0+$/, '') + item.symbol;
  }

  return num.toString();
};

/**
 * Format ordinal numbers (1st, 2nd, 3rd, etc.)
 * 
 * @param {number} num - Number to format
 * @returns {string} Ordinal number
 * 
 * @example
 * formatOrdinal(1) // "1st"
 * formatOrdinal(2) // "2nd"
 * formatOrdinal(23) // "23rd"
 */
export const formatOrdinal = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '';

  const j = num % 10;
  const k = num % 100;

  if (j === 1 && k !== 11) return `${num}st`;
  if (j === 2 && k !== 12) return `${num}nd`;
  if (j === 3 && k !== 13) return `${num}rd`;
  
  return `${num}th`;
};