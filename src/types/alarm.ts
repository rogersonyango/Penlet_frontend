// src/types/alarm.ts
export interface Alarm {
  id: number;
  user_id: number;
  title: string;
  description?: string | null;
  alarm_time: string;
  is_active: boolean;
  is_recurring: boolean;
  recurrence_pattern?: Record<string, any> | null;
  snooze_count: number;
  max_snooze: number;
  created_at: string;
  updated_at: string;
}

export interface AlarmCreate {
  title: string;
  description?: string;
  alarm_time: string;
  is_active?: boolean;
  is_recurring?: boolean;
  recurrence_pattern?: Record<string, any> | null;
}

export interface AlarmUpdate {
  title?: string;
  description?: string;
  alarm_time?: string;
  is_active?: boolean;
  is_recurring?: boolean;
  recurrence_pattern?: Record<string, any> | null;
}