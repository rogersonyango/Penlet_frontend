// src/pages/Flashcards/StudySessionPage.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flashcard } from '../../types/flashcard';
// @ts-ignore
import { flashcardApi } from '../../services/flashcardApi';

interface StudySession {
  cards: Flashcard[];
}

export default function StudySessionPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (deckId) {
      flashcardApi.startStudy(Number(deckId)).then((session: StudySession) => {
        setCards(session.cards);
        setLoading(false);
      }).catch(() => {
        navigate('/flashcards');
      });
    }
  }, [deckId, navigate]);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleReview = async (quality: number) => {
    if (!currentCard) return;

    await flashcardApi.reviewCard(currentCard.id, { quality });

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      alert('🎉 Study session complete! Great job!');
      navigate('/flashcards');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-vibrant-purple-200 border-t-vibrant-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold bg-gradient-to-r from-vibrant-purple-600 to-vibrant-pink-500 text-transparent bg-clip-text">
            Starting your study session...
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (cards.length === 0) {
    return (
      <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border-4 border-vibrant-green-200">
            <div className="text-6xl sm:text-7xl mb-4">🎉</div>
            <p className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">
              No cards are due for review right now!
            </p>
            <p className="text-gray-500 text-sm sm:text-base mb-6">
              Great job staying on top of your studies. Check back later for more cards.
            </p>
            <button
              onClick={() => navigate('/flashcards')}
              className="px-8 py-3 bg-gradient-to-r from-vibrant-purple-500 via-pink-500 to-cyan-500 hover:from-vibrant-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold"
            >
              ← Back to Decks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 animate-slideDown">
          <button
            onClick={() => navigate('/flashcards')}
            className="mb-4 px-5 py-2 bg-white border-3 border-vibrant-purple-300 text-vibrant-purple-700 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-sm"
          >
            ← Quit Session
          </button>

          {/* Progress Bar */}
          <div className="bg-white rounded-full h-4 shadow-md border-2 border-gray-100 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-vibrant-purple-500 to-vibrant-pink-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-600 font-bold mt-2">
            Card {currentIndex + 1} of {cards.length}
          </p>
        </div>

        {/* Flashcard */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border-4 border-vibrant-purple-200 mb-6 animate-slideUp">
          {/* Question */}
          <div className="text-center">
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-bold mb-4 border border-purple-200">
              ❓ Question
            </div>
            <p className="text-xl sm:text-2xl font-black text-gray-800 leading-relaxed">
              {currentCard?.front}
            </p>
          </div>

          {/* Answer (shown after reveal) */}
          {showAnswer && (
            <div className="mt-6 p-6 bg-gradient-to-r from-cyan-50 to-purple-50 rounded-2xl border-3 border-cyan-200 animate-fadeIn">
              <div className="text-center">
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-100 to-green-100 text-cyan-700 rounded-full text-sm font-bold mb-4 border border-cyan-200">
                  💡 Answer
                </div>
                <p className="text-lg sm:text-xl font-bold text-gray-700 leading-relaxed">
                  {currentCard?.back}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center">
            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="px-8 py-4 bg-gradient-to-r from-vibrant-purple-500 via-vibrant-pink-500 to-vibrant-cyan-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <span className="text-2xl">👁️</span>
                Show Answer
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-gray-600 font-bold">How well did you know this?</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { q: 0, label: 'Forgot', color: 'from-red-400 to-red-500' },
                    { q: 1, label: 'Hard', color: 'from-orange-400 to-orange-500' },
                    { q: 2, label: 'Good', color: 'from-yellow-400 to-yellow-500' },
                    { q: 3, label: 'Good', color: 'from-lime-400 to-lime-500' },
                    { q: 4, label: 'Easy', color: 'from-green-400 to-green-500' },
                    { q: 5, label: 'Perfect', color: 'from-vibrant-cyan-400 to-vibrant-cyan-500' },
                  ].map(({ q, label, color }) => (
                    <button
                      key={q}
                      onClick={() => handleReview(q)}
                      className={`w-14 h-14 rounded-full bg-gradient-to-r ${color} text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex flex-col items-center justify-center text-sm`}
                      title={`${label} (${q})`}
                    >
                      <span className="text-lg">{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-vibrant-yellow-200 animate-slideUp" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-vibrant-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xl shadow-md">
              💡
            </div>
            <p className="text-gray-700 font-medium">
              <span className="font-bold text-yellow-700">Tip:</span> Rate honestly to optimize your learning!
            </p>
          </div>
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
          animation: fadeIn 0.5s ease-out;
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}

