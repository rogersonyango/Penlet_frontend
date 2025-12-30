// src/types/timetable.ts

export interface TimeSlot {
  id: number;
  timetable_id: number;
  day_of_week: string;
  start_time: string;  // ISO 8601 string
  end_time: string;
  course: string;
  room: string;
  is_active: boolean;
}

export interface Timetable {
  id: number;
  user_id: number;
  term: string;
  created_at: string;
  slots: TimeSlot[];
}