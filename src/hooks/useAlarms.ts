// src/hooks/useAlarms.ts
import { useState, useCallback } from 'react';
import { alarmService } from '../services/alarmService';
import { Alarm, AlarmCreate } from '../types/alarm';

export const useAlarms = () => {
  // ✅ Explicitly type the state
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlarms = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await alarmService.getAll(filters);
      setAlarms(res.data); // ✅ Now TypeScript knows res.data is Alarm[]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAlarm = useCallback(async (data: AlarmCreate) => {
    const res = await alarmService.create(data);
    setAlarms((prev) => [res.data, ...prev]);
    return res.data;
  }, []);

  const toggleAlarm = useCallback(async (id: number) => {
    const res = await alarmService.toggle(id);
    setAlarms((prev) => prev.map(a => a.id === id ? res.data : a));
  }, []);

  const snoozeAlarm = useCallback(async (id: number, minutes: number) => {
    const res = await alarmService.snooze(id, minutes);
    setAlarms((prev) => prev.map(a => a.id === id ? res.data : a));
  }, []);

  const deleteAlarm = useCallback(async (id: number) => {
    await alarmService.delete(id);
    setAlarms((prev) => prev.filter(a => a.id !== id));
  }, []);

  return {
    alarms,
    loading,
    error,
    fetchAlarms,
    createAlarm,
    toggleAlarm,
    snoozeAlarm,
    deleteAlarm,
  };
};