/**
 * Dates Utility
 * Date manipulation and formatting helpers
 */

/**
 * Add days to date
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Add months to date
 */
export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Get start of day
 */
export const startOfDay = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Get end of day
 */
export const endOfDay = (date) => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Check if date is today
 */
export const isToday = (date) => {
  const today = new Date();
  const d = new Date(date);
  return d.toDateString() === today.toDateString();
};

/**
 * Check if date is this week
 */
export const isThisWeek = (date) => {
  const now = new Date();
  const d = new Date(date);
  const weekStart = startOfDay(addDays(now, -now.getDay()));
  const weekEnd = endOfDay(addDays(weekStart, 6));
  return d >= weekStart && d <= weekEnd;
};

/**
 * Get days between dates
 */
export const daysBetween = (date1, date2) => {
  const d1 = startOfDay(date1);
  const d2 = startOfDay(date2);
  const diff = Math.abs(d2 - d1);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

/**
 * Format date range
 */
export const formatDateRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  if (startDate.toDateString() === endDate.toDateString()) {
    return startDate.toLocaleDateString();
  }
  
  return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
};

export default {
  addDays,
  addMonths,
  startOfDay,
  endOfDay,
  isToday,
  isThisWeek,
  daysBetween,
  formatDateRange,
};