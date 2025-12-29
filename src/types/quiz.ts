// src/types/quiz.ts

// ==== Quiz Types ====
export interface QuizQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'text';
  options?: string[];
  correct_answer: string;
  explanation?: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string | null;
  curriculum: string;
  time_limit_minutes: number;
  is_active: boolean;
  questions: QuizQuestion[];
  created_by: string;
}

export interface QuizAttempt {
  id: number;
  quiz_id: number;
  user_id: string;
  start_time: string;
  end_time: string | null;
  is_submitted: boolean;
  answers: Record<string, any>;
  score: number | null;
  max_score: number | null;
}

// ==== 3D Resource Types ====
export interface Resource {
  id: number;
  title: string;
  description: string | null;
  subject: string;
  category_id: number;
  is_featured: boolean;
  file_format: string;
  file_path: string;
  view_count: number;
  created_at: string;
}

export interface ResourceCreate {
  title: string;
  description?: string;
  subject: string;
  category_id: number;
  is_featured: boolean;
}

// ==== Auth/User ====
export interface User {
  email: string;
  role: 'student' | 'teacher' | 'admin';
}

// ==== API Response ====
export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};