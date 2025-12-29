// src/types/reminder.ts
export interface Reminder {
  id: number;
  user_id: number;
  title: string;
  description?: string | null;
  due_date: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReminderCreate {
  title: string;
  description?: string;
  due_date: string;
}

export interface ReminderUpdate {
  title?: string;
  description?: string;
  due_date?: string;
  is_completed?: boolean;
}