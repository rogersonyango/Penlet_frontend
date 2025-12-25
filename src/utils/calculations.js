/**
 * Calculations Utility
 * 
 * Mathematical calculations for games, scores, grades, and analytics
 * Centralized calculation logic for consistency across Penlet
 */

import { GRADE_BOUNDARIES, WPM_RATINGS, DIFFICULTY_LEVELS, GAME_SETTINGS } from './constants';

/**
 * Calculate score with difficulty multiplier
 * 
 * @param {number} basePoints - Base points earned
 * @param {string} difficulty - Difficulty level ('easy', 'medium', 'hard', 'expert')
 * @returns {number} Final score
 * 
 * @example
 * calculateScore(100, 'easy') // 100
 * calculateScore(100, 'medium') // 150
 * calculateScore(100, 'expert') // 300
 */
export const calculateScore = (basePoints, difficulty = 'easy') => {
  const multiplier = DIFFICULTY_LEVELS[difficulty.toUpperCase()]?.multiplier || 1;
  return Math.round(basePoints * multiplier);
};

/**
 * Calculate streak bonus
 * 
 * @param {number} streak - Current streak count
 * @returns {number} Bonus points
 * 
 * @example
 * calculateStreakBonus(3) // 0
 * calculateStreakBonus(5) // 10
 * calculateStreakBonus(10) // 30
 * calculateStreakBonus(15) // 30
 */
export const calculateStreakBonus = (streak) => {
  const { THRESHOLD_1, BONUS_1, THRESHOLD_2, BONUS_2 } = GAME_SETTINGS.STREAK_BONUS;
  
  if (streak >= THRESHOLD_2) {
    return BONUS_1 + BONUS_2;
  }
  if (streak >= THRESHOLD_1) {
    return BONUS_1;
  }
  return 0;
};

/**
 * Calculate time bonus
 * 
 * @param {number} timeLeft - Seconds remaining
 * @param {number} threshold - Minimum seconds for bonus (default: 5)
 * @returns {number} Bonus points
 * 
 * @example
 * calculateTimeBonus(10) // 10
 * calculateTimeBonus(3) // 0
 * calculateTimeBonus(7, 5) // 7
 */
export const calculateTimeBonus = (timeLeft, threshold = GAME_SETTINGS.TIME_BONUS_THRESHOLD) => {
  return timeLeft > threshold ? timeLeft : 0;
};

/**
 * Calculate total game score with all bonuses
 * 
 * @param {Object} params - Score parameters
 * @param {number} params.basePoints - Base points
 * @param {string} params.difficulty - Difficulty level
 * @param {number} params.streak - Current streak
 * @param {number} params.timeLeft - Seconds remaining
 * @returns {number} Total score
 * 
 * @example
 * calculateTotalScore({ basePoints: 100, difficulty: 'medium', streak: 10, timeLeft: 8 })
 * // 100 * 1.5 (difficulty) = 150
 * // + 30 (streak bonus)
 * // + 8 (time bonus)
 * // = 188
 */
export const calculateTotalScore = ({ basePoints, difficulty, streak = 0, timeLeft = 0 }) => {
  const difficultyScore = calculateScore(basePoints, difficulty);
  const streakBonus = calculateStreakBonus(streak);
  const timeBonus = calculateTimeBonus(timeLeft);
  
  return difficultyScore + streakBonus + timeBonus;
};

/**
 * Calculate accuracy percentage
 * 
 * @param {number} correct - Number of correct answers
 * @param {number} total - Total number of answers
 * @returns {number} Accuracy percentage (0-100)
 * 
 * @example
 * calculateAccuracy(8, 10) // 80
 * calculateAccuracy(15, 20) // 75
 */
export const calculateAccuracy = (correct, total) => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

/**
 * Calculate grade from percentage
 * 
 * @param {number} percentage - Score percentage (0-100)
 * @returns {string} Grade letter ('A', 'B', 'C', 'D', 'F')
 * 
 * @example
 * calculateGrade(95) // 'A'
 * calculateGrade(85) // 'B'
 * calculateGrade(55) // 'F'
 */
export const calculateGrade = (percentage) => {
  if (percentage >= GRADE_BOUNDARIES.A) return 'A';
  if (percentage >= GRADE_BOUNDARIES.B) return 'B';
  if (percentage >= GRADE_BOUNDARIES.C) return 'C';
  if (percentage >= GRADE_BOUNDARIES.D) return 'D';
  return 'F';
};

/**
 * Calculate Words Per Minute (WPM)
 * 
 * @param {number} characters - Total characters typed
 * @param {number} seconds - Time taken in seconds
 * @returns {number} WPM (rounded)
 * 
 * @example
 * calculateWPM(250, 60) // 50 WPM (250 chars / 5 = 50 words in 1 minute)
 * calculateWPM(500, 120) // 50 WPM (500 chars / 5 = 100 words in 2 minutes)
 */
export const calculateWPM = (characters, seconds) => {
  if (seconds === 0) return 0;
  const minutes = seconds / 60;
  const words = characters / 5; // Standard: 5 characters = 1 word
  return Math.round(words / minutes);
};

/**
 * Get WPM rating
 * 
 * @param {number} wpm - Words per minute
 * @returns {Object} Rating object with label and color
 * 
 * @example
 * getWPMRating(85) // { min: 80, label: 'Excellent', color: '#22c55e' }
 * getWPMRating(45) // { min: 40, label: 'Good', color: '#f59e0b' }
 */
export const getWPMRating = (wpm) => {
  const ratings = Object.values(WPM_RATINGS).sort((a, b) => b.min - a.min);
  return ratings.find(rating => wpm >= rating.min) || WPM_RATINGS.SLOW;
};

/**
 * Calculate typing accuracy
 * 
 * @param {number} correct - Correct characters
 * @param {number} total - Total characters typed
 * @returns {number} Accuracy percentage
 * 
 * @example
 * calculateTypingAccuracy(95, 100) // 95
 */
export const calculateTypingAccuracy = (correct, total) => {
  return calculateAccuracy(correct, total);
};

/**
 * Calculate typing score
 * 
 * @param {number} wpm - Words per minute
 * @param {number} accuracy - Accuracy percentage (0-100)
 * @param {string} difficulty - Difficulty level
 * @returns {number} Total typing score
 * 
 * @example
 * calculateTypingScore(50, 95, 'medium')
 * // 50 * (95/100) * 1.5 = 71.25 ≈ 71
 */
export const calculateTypingScore = (wpm, accuracy, difficulty = 'easy') => {
  const multiplier = DIFFICULTY_LEVELS[difficulty.toUpperCase()]?.multiplier || 1;
  return Math.round(wpm * (accuracy / 100) * multiplier);
};

/**
 * Calculate percentage
 * 
 * @param {number} value - Value
 * @param {number} total - Total
 * @param {number} decimals - Decimal places (default: 0)
 * @returns {number} Percentage
 * 
 * @example
 * calculatePercentage(3, 4) // 75
 * calculatePercentage(1, 3, 2) // 33.33
 */
export const calculatePercentage = (value, total, decimals = 0) => {
  if (total === 0) return 0;
  const percentage = (value / total) * 100;
  return decimals > 0 ? parseFloat(percentage.toFixed(decimals)) : Math.round(percentage);
};

/**
 * Calculate average
 * 
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Average
 * 
 * @example
 * calculateAverage([10, 20, 30]) // 20
 * calculateAverage([85, 90, 95, 80]) // 87.5
 */
export const calculateAverage = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

/**
 * Calculate median
 * 
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Median
 * 
 * @example
 * calculateMedian([1, 2, 3, 4, 5]) // 3
 * calculateMedian([1, 2, 3, 4]) // 2.5
 */
export const calculateMedian = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  
  return sorted[mid];
};

/**
 * Calculate range (max - min)
 * 
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Range
 * 
 * @example
 * calculateRange([10, 50, 30, 20]) // 40 (50 - 10)
 */
export const calculateRange = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  const max = Math.max(...numbers);
  const min = Math.min(...numbers);
  return max - min;
};

/**
 * Calculate improvement percentage
 * 
 * @param {number} oldValue - Previous value
 * @param {number} newValue - Current value
 * @returns {number} Improvement percentage (can be negative)
 * 
 * @example
 * calculateImprovement(50, 75) // 50 (50% improvement)
 * calculateImprovement(100, 80) // -20 (20% decrease)
 */
export const calculateImprovement = (oldValue, newValue) => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return Math.round(((newValue - oldValue) / oldValue) * 100);
};

/**
 * Calculate points needed for next level
 * 
 * @param {number} currentPoints - Current total points
 * @param {number} levelThreshold - Points per level (default: 1000)
 * @returns {Object} Level info { level, pointsInLevel, pointsToNext }
 * 
 * @example
 * calculateLevel(2500, 1000)
 * // { level: 3, pointsInLevel: 500, pointsToNext: 500 }
 */
export const calculateLevel = (currentPoints, levelThreshold = 1000) => {
  const level = Math.floor(currentPoints / levelThreshold) + 1;
  const pointsInLevel = currentPoints % levelThreshold;
  const pointsToNext = levelThreshold - pointsInLevel;
  
  return {
    level,
    pointsInLevel,
    pointsToNext,
    progress: (pointsInLevel / levelThreshold) * 100,
  };
};

/**
 * Calculate star rating from percentage
 * 
 * @param {number} percentage - Score percentage (0-100)
 * @returns {number} Stars (0-5)
 * 
 * @example
 * calculateStars(95) // 5
 * calculateStars(75) // 4
 * calculateStars(50) // 3
 */
export const calculateStars = (percentage) => {
  if (percentage >= 90) return 5;
  if (percentage >= 80) return 4;
  if (percentage >= 70) return 3;
  if (percentage >= 60) return 2;
  if (percentage >= 50) return 1;
  return 0;
};

/**
 * Calculate completion percentage
 * 
 * @param {number} completed - Completed items
 * @param {number} total - Total items
 * @returns {number} Completion percentage (0-100)
 * 
 * @example
 * calculateCompletion(7, 10) // 70
 * calculateCompletion(0, 10) // 0
 */
export const calculateCompletion = (completed, total) => {
  return calculatePercentage(completed, total);
};

/**
 * Calculate success rate from multiple attempts
 * 
 * @param {Object[]} attempts - Array of attempt objects with 'passed' boolean
 * @returns {number} Success rate percentage
 * 
 * @example
 * calculateSuccessRate([
 *   { passed: true },
 *   { passed: true },
 *   { passed: false },
 *   { passed: true }
 * ]) // 75
 */
export const calculateSuccessRate = (attempts) => {
  if (!attempts || attempts.length === 0) return 0;
  const passed = attempts.filter(a => a.passed).length;
  return calculatePercentage(passed, attempts.length);
};

/**
 * Calculate efficiency score
 * 
 * @param {number} timeUsed - Time used in seconds
 * @param {number} timeAllowed - Time allowed in seconds
 * @param {number} accuracy - Accuracy percentage (0-100)
 * @returns {number} Efficiency score (0-100)
 * 
 * @example
 * calculateEfficiency(60, 120, 90)
 * // Fast completion (50% time) + high accuracy = high efficiency
 * // Returns: 70
 */
export const calculateEfficiency = (timeUsed, timeAllowed, accuracy) => {
  if (timeAllowed === 0) return 0;
  
  const speedScore = ((timeAllowed - timeUsed) / timeAllowed) * 50;
  const accuracyScore = (accuracy / 100) * 50;
  
  return Math.round(Math.max(0, speedScore + accuracyScore));
};

/**
 * Calculate rank from score and leaderboard
 * 
 * @param {number} score - User's score
 * @param {number[]} allScores - All scores in leaderboard
 * @returns {number} Rank (1-based)
 * 
 * @example
 * calculateRank(85, [100, 90, 85, 80, 75]) // 3
 */
export const calculateRank = (score, allScores) => {
  if (!allScores || allScores.length === 0) return 1;
  const sorted = [...allScores].sort((a, b) => b - a);
  return sorted.indexOf(score) + 1;
};

/**
 * Calculate percentile
 * 
 * @param {number} score - User's score
 * @param {number[]} allScores - All scores
 * @returns {number} Percentile (0-100)
 * 
 * @example
 * calculatePercentile(85, [60, 70, 75, 80, 85, 90, 95, 100])
 * // 62.5 (better than 62.5% of scores)
 */
export const calculatePercentile = (score, allScores) => {
  if (!allScores || allScores.length === 0) return 100;
  
  const lowerScores = allScores.filter(s => s < score).length;
  return Math.round((lowerScores / allScores.length) * 100);
};

/**
 * Calculate combo multiplier
 * 
 * @param {number} combo - Current combo count
 * @param {number} maxMultiplier - Maximum multiplier (default: 5)
 * @returns {number} Multiplier
 * 
 * @example
 * calculateComboMultiplier(0) // 1
 * calculateComboMultiplier(3) // 1.3
 * calculateComboMultiplier(10) // 2
 * calculateComboMultiplier(50) // 5 (max)
 */
export const calculateComboMultiplier = (combo, maxMultiplier = 5) => {
  const multiplier = 1 + (combo * 0.1);
  return Math.min(multiplier, maxMultiplier);
};

/**
 * Calculate exponential score (for leveling systems)
 * 
 * @param {number} baseXP - Base experience points
 * @param {number} level - Current level
 * @param {number} exponent - Growth rate (default: 1.5)
 * @returns {number} XP needed for next level
 * 
 * @example
 * calculateExponentialScore(100, 1) // 100
 * calculateExponentialScore(100, 2) // 141
 * calculateExponentialScore(100, 5) // 380
 */
export const calculateExponentialScore = (baseXP, level, exponent = 1.5) => {
  return Math.round(baseXP * Math.pow(level, exponent));
};

/**
 * Calculate study time recommendation
 * 
 * @param {number} accuracy - Current accuracy (0-100)
 * @param {number} averageTime - Average time per question in seconds
 * @returns {Object} Recommendation { minutes, message }
 * 
 * @example
 * calculateStudyTime(60, 30)
 * // { minutes: 45, message: 'Need more practice' }
 */
export const calculateStudyTime = (accuracy, averageTime) => {
  let minutes = 15; // Base recommendation
  let message = 'Excellent! Maintain practice.';
  
  if (accuracy < 60) {
    minutes = 45;
    message = 'Need more practice';
  } else if (accuracy < 70) {
    minutes = 30;
    message = 'Good progress, keep practicing';
  } else if (accuracy < 80) {
    minutes = 20;
    message = 'Almost there!';
  }
  
  // Adjust for speed
  if (averageTime > 60) {
    minutes += 15;
  }
  
  return { minutes, message };
};