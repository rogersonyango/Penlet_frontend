// src/pages/DeckCreatePage.tsx
"use client";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { flashcardApi } from '../../services/flashcardApi';
import { TeacherAdminGuard } from '../../utils/withRoleGuard';
import { DeckCreate } from '../../types/flashcard';

export default function DeckCreatePage() {
  const [formData, setFormData] = useState<DeckCreate>({
    title: '',
    subject: '',
    level: '',
    is_public: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await flashcardApi.createDeck(formData);
      navigate('/flashcards');
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherAdminGuard>
      <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-slideDown">
            <button
              onClick={() => navigate('/flashcards')}
              className="mb-6 px-6 py-3 bg-white border-3 border-vibrant-cyan-300 text-vibrant-cyan-700 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-sm sm:text-base hover:border-vibrant-cyan-400"
            >
              ← Back to Flashcards
            </button>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-vibrant-cyan-400 to-vibrant-purple-500 rounded-3xl shadow-2xl mb-4 transform hover:rotate-12 hover:scale-110 transition-all duration-300 animate-float">
                <span className="text-5xl drop-shadow-lg">🃏</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-vibrant-cyan-600 via-vibrant-purple-600 to-vibrant-pink-500 text-transparent bg-clip-text">
                Create New Deck
              </h1>
              <p className="text-gray-600 text-base sm:text-lg font-medium mt-2">
                Build your own flashcard deck!
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-vibrant-cyan-200 animate-slideUp">
            {/* Icon Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-vibrant-cyan-400 to-vibrant-purple-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 hover:rotate-6 transition-all duration-300">
                📝
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-800">Deck Details</h2>
                <p className="text-sm text-gray-500 font-medium">Fill in the information below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title Input */}
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-2xl group-focus-within:scale-125 transition-transform">📚</span>
                </div>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full pl-14 pr-4 py-4 bg-gradient-to-r from-cyan-50 to-purple-50 border-3 border-cyan-200 rounded-2xl focus:ring-4 focus:ring-cyan-300 focus:border-cyan-500 focus:outline-none transition-all duration-300 font-medium text-lg placeholder-gray-400"
                  placeholder="e.g., Medical Terminology"
                />
              </div>

              {/* Subject Input */}
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-2xl group-focus-within:scale-125 transition-transform">📖</span>
                </div>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full pl-14 pr-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-3 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 focus:outline-none transition-all duration-300 font-medium text-lg placeholder-gray-400"
                  placeholder="Subject (optional)"
                />
              </div>

              {/* Level Select */}
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-2xl group-focus-within:scale-125 transition-transform">🎯</span>
                </div>
                <select
                  name="level"
                  value={formData.level || ''}
                  onChange={handleChange}
                  className="w-full pl-14 pr-4 py-4 bg-gradient-to-r from-pink-50 to-cyan-50 border-3 border-pink-200 rounded-2xl focus:ring-4 focus:ring-pink-300 focus:border-pink-500 focus:outline-none transition-all duration-300 font-medium text-lg appearance-none cursor-pointer bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '3rem',
                  }}
                >
                  <option value="">Select level</option>
                  <option value="Beginner">🌱 Beginner</option>
                  <option value="Intermediate">🌿 Intermediate</option>
                  <option value="Advanced">🌳 Advanced</option>
                </select>
              </div>

              {/* Public Toggle */}
              <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 p-5 rounded-2xl border-3 border-yellow-300 hover:border-yellow-400 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 transition-transform">
                      🌐
                    </div>
                    <div>
                      <p className="font-black text-gray-800 text-lg">Make Public</p>
                      <p className="text-sm text-gray-500 font-medium">Allow others to see and use this deck</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_public"
                      checked={formData.is_public}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-16 h-9 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content=['🙌'] after:absolute after:top-1 after:left-1 after:bg-gradient-to-r after:from-yellow-400 after:to-orange-500 after:rounded-full after:h-7 after:w-7 after:transition-all after:flex after:items-center after:justify-center after:text-sm"></div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-4 rounded-2xl font-black shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-lg ${
                    loading
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-vibrant-cyan-500 via-vibrant-purple-500 to-vibrant-pink-500 hover:from-vibrant-cyan-600 hover:via-vibrant-purple-600 hover:to-vibrant-pink-600 text-white'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-2xl">🃏</span>
                      Create Deck
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/flashcards')}
                  className="flex-1 py-4 bg-white border-3 border-gray-300 text-gray-700 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:bg-gray-50 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Tips Section */}
          <div className="mt-6 bg-white p-6 rounded-3xl shadow-lg border-4 border-vibrant-yellow-200 animate-slideUp" style={{ animationDelay: '100ms' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-vibrant-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                💡
              </div>
              <div>
                <h3 className="font-black text-yellow-700 text-lg mb-2">Deck Tips</h3>
                <ul className="text-gray-700 space-y-2 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    Use clear, descriptive titles so others can find your deck
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    Add cards with both questions and detailed answers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    Choose the right level for your target audience
                  </li>
                </ul>
              </div>
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

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .animate-slideDown {
            animation: slideDown 0.6s ease-out;
          }

          .animate-slideUp {
            animation: slideUp 0.6s ease-out;
            animation-fill-mode: both;
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .border-3 {
            border-width: 3px;
          }
        `}</style>
      </div>
    </TeacherAdminGuard>
  );
}

