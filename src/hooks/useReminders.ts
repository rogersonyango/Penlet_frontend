// src/hooks/useReminders.ts
import { useState, useCallback } from 'react';
import { reminderService } from '../services/reminderService';
import { Reminder, ReminderCreate } from '../types/reminder';

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await reminderService.getAll(filters);
      setReminders(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const createReminder = useCallback(async (data: ReminderCreate) => {
    const res = await reminderService.create(data);
    setReminders((prev) => [res.data, ...prev]);
    return res.data;
  }, []);

  const completeReminder = useCallback(async (id: number) => {
    const res = await reminderService.complete(id);
    setReminders((prev) => prev.map(r => r.id === id ? res.data : r));
  }, []);

  const deleteReminder = useCallback(async (id: number) => {
    await reminderService.delete(id);
    setReminders((prev) => prev.filter(r => r.id !== id));
  }, []);

  return {
    reminders,
    loading,
    error,
    fetchReminders,
    createReminder,
    completeReminder,
    deleteReminder,
  };
};