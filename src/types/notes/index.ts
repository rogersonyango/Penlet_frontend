// src/types/notes/index.ts
export interface Note {
  id: number;
  title: string;
  content: string;
  curriculum: string;
  file_url?: string | null;
  author_id: string; // matches your backend fix (string, not int)
  created_at: string; // ISO date
  updated_at?: string | null;
  view_count: number;
}

export interface Comment {
  id: number;
  content: string;
  author_id: string;
  created_at: string;
}

export interface CreateNoteDTO {
  title: string;
  content: string;
  curriculum: string;
}

export interface UpdateNoteDTO {
  title?: string;
  content?: string;
  curriculum?: string;
}