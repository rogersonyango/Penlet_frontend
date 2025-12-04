// src/services/notes/noteService.ts
// @ts-nocheck
import axios, { AxiosError } from 'axios';
import type {
  Note,
  Comment,
  CreateNoteDTO,
  UpdateNoteDTO,
} from '../../types/notes';

// --- API Client Setup ---
const getApiBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  }
  return ' http://localhost:8000';
};

const notesAPI = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  timeout: 10000, // 10s timeout
});

// Optional: Global error interceptor (can be removed if you prefer per-call handling)
notesAPI.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // You can log errors here if desired
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// --- Helper: extract error message ---
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any;
      return data.detail || data.message || `Error ${error.response.status}`;
    }
    if (error.request) {
      // Request was made but no response received
      return 'No response from server. Please check your connection.';
    }
  }
  // Fallback for non-Axios errors
  if (error instanceof Error) return error.message;
  return 'An unknown error occurred';
};

// --- Notes Endpoints ---
export const getNotes = async (params?: {
  curriculum?: string;
  search?: string;
  skip?: number;
  limit?: number;
}) => {
  try {
    const res = await notesAPI.get<Note[]>('/api/notes/', { params });
    return res.data;
  } catch (error) {
    throw new Error(`Failed to fetch notes: ${getErrorMessage(error)}`);
  }
};

export const getNote = async (id: number) => {
  try {
    const res = await notesAPI.get<Note>(`/api/notes/${id}/`);
    return res.data;
  } catch (error) {
    throw new Error(`Failed to fetch note: ${getErrorMessage(error)}`);
  }
};

export const createNote = async ( DTO, file?: File) => {
  try {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('curriculum', data.curriculum);
    if (file) {
      formData.append('file', file);
    }
    const res = await notesAPI.post<Note>('/api/notes/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    throw new Error(`Failed to create note: ${getErrorMessage(error)}`);
  }
};

export const updateNote = async (id: number,  UpdateNoteDTO) => {
  try {
    const res = await notesAPI.put<Note>(`/api/notes/${id}/`, data);
    return res.data;
  } catch (error) {
    throw new Error(`Failed to update note: ${getErrorMessage(error)}`);
  }
};

export const deleteNote = async (id: number) => {
  try {
    await notesAPI.delete(`/api/notes/${id}/`);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete note: ${getErrorMessage(error)}`);
  }
};

// --- Likes ---
export const toggleLike = async (id: number) => {
  try {
    const res = await notesAPI.post(`/api/notes/${id}/like/`);
    return res.data;
  } catch (error) {
    throw new Error(`Failed to toggle like: ${getErrorMessage(error)}`);
  }
};

// --- Favorites ---
export const toggleFavorite = async (id: number) => {
  try {
    const res = await notesAPI.post(`/api/notes/${id}/favorite/`);
    return res.data;
  } catch (error) {
    throw new Error(`Failed to toggle favorite: ${getErrorMessage(error)}`);
  }
};

export const getFavorites = async (params?: { skip?: number; limit?: number }) => {
  try {
    const res = await notesAPI.get<Note[]>('/api/notes/favorites/', { params });
    return res.data;
  } catch (error) {
    throw new Error(`Failed to fetch favorites: ${getErrorMessage(error)}`);
  }
};

// --- My Notes ---
export const getMyNotes = async (params?: { skip?: number; limit?: number }) => {
  try {
    const res = await notesAPI.get<Note[]>('/api/notes/my-notes/', { params });
    return res.data;
  } catch (error) {
    throw new Error(`Failed to fetch your notes: ${getErrorMessage(error)}`);
  }
};

// --- Comments ---
export const getComments = async (
  noteId: number,
  params?: { skip?: number; limit?: number }
) => {
  try {
    const res = await notesAPI.get<Comment[]>(`/api/notes/${noteId}/comments/`, { params });
    return res.data;
  } catch (error) {
    throw new Error(`Failed to fetch comments: ${getErrorMessage(error)}`);
  }
};

export const addComment = async (noteId: number, content: string) => {
  try {
    const res = await notesAPI.post<Comment>(`/api/notes/${noteId}/comments/`, { content });
    return res.data;
  } catch (error) {
    throw new Error(`Failed to add comment: ${getErrorMessage(error)}`);
  }
};

export const deleteComment = async (noteId: number, commentId: number) => {
  try {
    await notesAPI.delete(`/api/notes/${noteId}/comments/${commentId}/`);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete comment: ${getErrorMessage(error)}`);
  }
};

// --- Search ---
export const searchNotes = async (
  q: string,
  params?: { skip?: number; limit?: number }
) => {
  try {
    const res = await notesAPI.get<Note[]>('/api/notes/search/', { params: { q, ...params } });
    return res.data;
  } catch (error) {
    throw new Error(`Search failed: ${getErrorMessage(error)}`);
  }
};

// --- Download ---
export const downloadNote = (id: number) => {
  const baseUrl = getApiBaseUrl().trim();
  window.open(`${baseUrl}/api/notes/${id}/download/`, '_blank');
};