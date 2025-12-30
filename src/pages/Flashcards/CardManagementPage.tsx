// src/pages/CardManagementPage.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flashcard } from '../../types/flashcard';
// @ts-ignore
import { flashcardApi } from '../../services/flashcardApi';
import { TeacherAdminGuard } from '../../utils/withRoleGuard';

export default function CardManagementPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (deckId) {
      flashcardApi.getCards(Number(deckId)).then(setCards).finally(() => setLoading(false));
    }
  }, [deckId]);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.front.trim() || !newCard.back.trim()) return;
    
    setSubmitting(true);
    try {
      const card = await flashcardApi.addCard(Number(deckId), newCard);
      setCards(prev => [...prev, card]);
      setNewCard({ front: '', back: '' });
    } catch (err) {
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!confirm('Delete this card?')) return;
    try {
      await flashcardApi.deleteCard(cardId);
      setCards(prev => prev.filter(c => c.id !== cardId));
    } catch (err) {
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-vibrant-purple-200 border-t-vibrant-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold bg-gradient-to-r from-vibrant-purple-600 to-vibrant-pink-500 text-transparent bg-clip-text">
            Loading cards...
          </p>
        </div>
      </div>
    );
  }

  return (
    <TeacherAdminGuard>
      <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-slideDown">
            <button
              onClick={() => navigate('/flashcards')}
              className="mb-6 px-6 py-3 bg-white border-3 border-vibrant-purple-300 text-vibrant-purple-700 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-sm sm:text-base hover:border-vibrant-purple-400"
            >
              ← Back to Flashcards
            </button>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-vibrant-purple-600 via-vibrant-pink-500 to-vibrant-cyan-500 text-transparent bg-clip-text">
                  🃏 Manage Cards
                </h1>
                <p className="text-gray-600 text-base sm:text-lg font-medium mt-1">
                  Add, edit, and organize your flashcards
                </p>
              </div>
              <button
                onClick={() => navigate(`/study/${deckId}`)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-vibrant-cyan-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <span className="text-xl">📚</span>
                Start Study
              </button>
            </div>
          </div>

          {/* Add Card Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-vibrant-purple-200 mb-8 animate-slideUp">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-vibrant-purple-500 to-vibrant-pink-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                ➕
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-vibrant-purple-600">
                Add New Card
              </h2>
            </div>

            <form onSubmit={handleAddCard}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Front (Question) */}
                <div className="group relative">
                  <label className="block text-gray-700 font-bold mb-3 flex items-center gap-2">
                    <span className="text-2xl">❓</span>
                    Front (Question)
                  </label>
                  <textarea
                    value={newCard.front}
                    onChange={(e) => setNewCard(prev => ({ ...prev, front: e.target.value }))}
                    required
                    className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-3 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 focus:outline-none transition-all duration-300 font-medium text-base placeholder-gray-400 resize-none"
                    rows={4}
                    placeholder="Enter the question..."
                  />
                </div>

                {/* Back (Answer) */}
                <div className="group relative">
                  <label className="block text-gray-700 font-bold mb-3 flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    Back (Answer)
                  </label>
                  <textarea
                    value={newCard.back}
                    onChange={(e) => setNewCard(prev => ({ ...prev, back: e.target.value }))}
                    required
                    className="w-full p-4 bg-gradient-to-r from-cyan-50 to-purple-50 border-3 border-cyan-200 rounded-2xl focus:ring-4 focus:ring-cyan-300 focus:border-cyan-500 focus:outline-none transition-all duration-300 font-medium text-base placeholder-gray-400 resize-none"
                    rows={4}
                    placeholder="Enter the answer..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`mt-6 px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                  submitting
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-vibrant-purple-500 via-vibrant-pink-500 to-vibrant-cyan-500 hover:from-vibrant-purple-600 hover:via-vibrant-pink-600 hover:to-vibrant-cyan-600 text-white'
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-xl">➕</span>
                    Add Card
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Card List */}
          <div className="animate-slideUp" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-vibrant-cyan-400 to-vibrant-green-400 rounded-full flex items-center justify-center text-2xl shadow-lg">
                📋
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
                Existing Cards ({cards.length})
              </h2>
            </div>

            {cards.length === 0 ? (
              <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border-4 border-gray-200 text-center">
                <div className="text-6xl sm:text-7xl mb-4">🃏</div>
                <p className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
                  No cards yet
                </p>
                <p className="text-gray-500 text-sm sm:text-base">
                  Add your first card using the form above!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cards.map((card, index) => (
                  <div
                    key={card.id}
                    className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border-3 border-vibrant-cyan-200 hover:border-vibrant-cyan-300 transform hover:scale-102 transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg text-xs font-bold">
                            ❓ Question
                          </span>
                          <span className="px-2 py-1 bg-gradient-to-r from-cyan-100 to-green-100 text-cyan-700 rounded-lg text-xs font-bold">
                            💡 Answer
                          </span>
                        </div>
                        <p className="text-gray-800 font-medium mb-1">{card.front}</p>
                        <div className="w-full h-px bg-gray-200 my-2"></div>
                        <p className="text-gray-600 font-medium">{card.back}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                      >
                        <span>🗑️</span>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <style>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slideDown {
            animation: slideDown 0.6s ease-out;
          }

          .animate-slideUp {
            animation: slideUp 0.6s ease-out;
            animation-fill-mode: both;
          }

          .border-3 {
            border-width: 3px;
          }

          .scale-102 {
            transform: scale(1.02);
          }
        `}</style>
      </div>
    </TeacherAdminGuard>
  );
}

