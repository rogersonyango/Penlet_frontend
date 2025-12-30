// src/pages/Flashcards/DeckListPage.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { flashcardApi } from '../../services/flashcardApi';
import { TeacherAdminGuard } from '../../utils/withRoleGuard';
import { Deck } from '../../types/flashcard';

export default function DeckListPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    flashcardApi.getDecks().then((data: Deck[]) => {
      setDecks(data);
      setLoading(false);
    });
  }, []);

  const handleCreateDeck = () => {
    navigate('/flashcards/create');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-vibrant-purple-200 border-t-vibrant-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold bg-gradient-to-r from-vibrant-purple-600 to-vibrant-pink-500 text-transparent bg-clip-text">
            Loading your decks...
          </p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalDecks = decks.length;
  const totalCards = decks.reduce((sum, deck) => sum + (deck.card_count || 0), 0);

  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 bg-gradient-to-r from-vibrant-purple-600 via-vibrant-pink-500 to-vibrant-cyan-500 text-transparent bg-clip-text text-center">
            🃏 My Flashcard Decks
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-medium text-center">
            Master any topic with flashcards!
          </p>
        </div>

        {/* Stats Summary */}
        {totalDecks > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 animate-slideUp">
            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-vibrant-purple-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2 text-center">📚</div>
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-vibrant-purple-600 to-vibrant-pink-500 text-transparent bg-clip-text">
                  {totalDecks}
                </div>
                <div className="text-gray-600 font-bold text-sm">Total Decks</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-vibrant-cyan-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2 text-center">🎯</div>
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-vibrant-cyan-600 to-vibrant-purple-500 text-transparent bg-clip-text">
                  {totalCards}
                </div>
                <div className="text-gray-600 font-bold text-sm">Total Cards</div>
              </div>
            </div>
          </div>
        )}

        {/* Create Deck Button */}
        <TeacherAdminGuard>
          <div className="mb-8 animate-slideUp" style={{ animationDelay: '100ms' }}>
            <button
              onClick={handleCreateDeck}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-vibrant-purple-500 via-vibrant-pink-500 to-vibrant-cyan-500 hover:from-vibrant-purple-600 hover:via-vibrant-pink-600 hover:to-vibrant-cyan-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="text-2xl">➕</span>
              Create New Deck
            </button>
          </div>
        </TeacherAdminGuard>

        {/* Decks Grid */}
        {decks.length === 0 ? (
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border-4 border-gray-200 text-center animate-fadeIn">
            <div className="text-6xl sm:text-7xl mb-4">🃏</div>
            <p className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
              No decks yet
            </p>
            <p className="text-gray-500 text-sm sm:text-base mb-6">
              Create your first flashcard deck to start learning!
            </p>
            <TeacherAdminGuard>
              <button
                onClick={handleCreateDeck}
                className="px-8 py-3 bg-gradient-to-r from-vibrant-purple-500 via-pink-500 to-cyan-500 hover:from-vibrant-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold"
              >
                Create Deck
              </button>
            </TeacherAdminGuard>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-slideUp" style={{ animationDelay: '200ms' }}>
            {decks.map((deck, index) => (
              <div
                key={deck.id}
                className="animate-slideUp bg-white p-5 sm:p-6 rounded-2xl shadow-lg border-3 border-vibrant-purple-200 hover:border-vibrant-purple-300 transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Deck Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h2 className="font-black text-xl text-gray-800 mb-1">{deck.title}</h2>
                    <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                      <span>📖</span>
                      {deck.subject || 'No subject'}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-vibrant-purple-400 to-vibrant-pink-400 rounded-xl flex items-center justify-center text-xl shadow-md">
                    🃏
                  </div>
                </div>

                {/* Card Count */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-bold border border-purple-200">
                    🎯 {deck.card_count || 0} cards
                  </span>
                  {deck.is_public && (
                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-100 to-green-100 text-cyan-700 rounded-full text-sm font-bold border border-cyan-200">
                      🌐 Public
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => navigate(`/flashcards/study/${deck.id}`)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-vibrant-cyan-400 text-white rounded-xl font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>📚</span>
                    Study
                  </button>
                  <TeacherAdminGuard>
                    <button
                      onClick={() => navigate(`/flashcards/${deck.id}/cards`)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-vibrant-purple-400 to-vibrant-pink-400 text-white rounded-xl font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>⚙️</span>
                      Manage
                    </button>
                  </TeacherAdminGuard>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Public Decks Link */}
        <div className="mt-8 text-center animate-slideUp" style={{ animationDelay: '300ms' }}>
          <button
            onClick={() => navigate('/flashcards/public')}
            className="px-8 py-4 bg-white border-3 border-vibrant-yellow-300 text-vibrant-yellow-700 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:bg-yellow-50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            <span className="text-xl">🌍</span>
            Browse Public Decks
          </button>
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}

