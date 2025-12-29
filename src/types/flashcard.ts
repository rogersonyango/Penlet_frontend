// src/types/flashcard.ts

export type Role = 'student' | 'teacher' | 'admin';

export interface User {
  id?: number;
  email: string;
  role: Role;
}

// --- FLASHCARD TYPES ---
export interface Flashcard {
  id: number;
  front: string;
  back: string;
  deck_id: number;
  next_review: string; // ISO string
  interval: number;
  repetition: number;
  ease_factor: number;
  created_at: string;
}

export interface Deck {
  id: number;
  title: string;
  subject?: string;
  level?: string;
  is_public: boolean;
  card_count: number;
  created_at: string;
  share_token?: string;
}

export interface DeckCreate {
  title: string;
  subject?: string;
  level?: string;
  is_public?: boolean;
}

export interface ReviewUpdate {
  quality: number; // 0–5
}

export interface StudySession {
  deck_id: number;
  cards: Flashcard[];
}

export interface StudyStats {
  total_cards: number;
  cards_due: number;
  mastery_level: number;
}