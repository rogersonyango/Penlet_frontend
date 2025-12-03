// @ts-nocheck
// src/hooks/timetable.js

import { useState, useEffect } from 'react';
import { timetableService } from '../services/timetable';

export const useWeeklyTimetable = (userId) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchWeekly = async () => {
      try {
        setLoading(true);
        const weeklySlots = await timetableService.getWeeklySchedule(userId);
        setSlots(weeklySlots);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load timetable');
        console.error('Error fetching weekly timetable:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeekly();
  }, [userId]);

  return { slots, loading, error };
};

export const useDailyTimetable = (userId, date) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchDaily = async () => {
      try {
        setLoading(true);
        const dailySlots = await timetableService.getDailySchedule(userId, date);
        setSlots(dailySlots);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load daily schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchDaily();
  }, [userId, date]);

  return { slots, loading, error };
};