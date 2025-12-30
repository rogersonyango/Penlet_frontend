// src/services/flashcardApi.js

import axios from 'axios';
import { toast } from 'react-toastify';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const FLASHCARD_API_URL = `${API_BASE_URL}/api/flashcards`;

const api = axios.create({
  baseURL: FLASHCARD_API_URL,
  timeout: 10000,
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An error occurred';
    toast.error(`❌ ${message}`);
    return Promise.reject(error);
  }
);

/**
 * Flashcard API service — all endpoints for decks, cards, and study sessions.
 */
export const flashcardApi = {
  // === DECKS ===
  getDecks(params) {
    return api.get('/decks/', { params }).then((res) => res.data);
  },

  getPublicDecks() {
    return api.get('/decks/public/').then((res) => res.data);
  },

  createDeck(data) {
    return api.post('/decks/', data).then((res) => {
      toast.success('✅ Deck created!');
      return res.data;
    });
  },

  getDeck(deckId) {
    return api.get(`/decks/${deckId}/`).then((res) => res.data);
  },

  updateDeck(deckId, data) {
    return api.put(`/decks/${deckId}/`, data).then((res) => {
      toast.success('✅ Deck updated!');
      return res.data;
    });
  },

  deleteDeck(deckId) {
    return api.delete(`/decks/${deckId}/`).then((res) => {
      toast.success('🗑️ Deck deleted');
      return res.data;
    });
  },

  shareDeck(deckId) {
    return api.post(`/decks/${deckId}/share/`).then((res) => {
      toast.success('🔗 Deck shared!');
      return res.data;
    });
  },

  // === CARDS ===
  getCards(deckId) {
    return api.get(`/decks/${deckId}/cards/`).then((res) => res.data);
  },

  addCard(deckId, card) {
    return api.post(`/decks/${deckId}/cards/`, card).then((res) => {
      toast.success('✅ Card added!');
      return res.data;
    });
  },

  getCard(cardId) {
    return api.get(`/cards/${cardId}/`).then((res) => res.data);
  },

  updateCard(cardId, card) {
    return api.put(`/cards/${cardId}/`, card).then((res) => {
      toast.success('✅ Card updated!');
      return res.data;
    });
  },

  deleteCard(cardId) {
    return api.delete(`/cards/${cardId}/`).then((res) => {
      toast.success('🗑️ Card deleted');
      return res.data;
    });
  },

  // === REVIEW & SPACED REPETITION ===
  reviewCard(cardId, review) {
    return api.post(`/cards/${cardId}/review/`, review).then((res) => {
      toast.success('🧠 Review recorded!');
      return res.data;
    });
  },

  // === STUDY SESSIONS ===
  startStudy(deckId) {
    return api.get(`/study/${deckId}/`).then((res) => res.data);
  },

  getStudyStats() {
    return api.get('/study/stats/').then((res) => res.data);
  },
};