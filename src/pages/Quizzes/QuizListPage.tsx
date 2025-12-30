import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quiz } from '../../types/quiz';
import { fetchQuizzes } from '../../services/quiz';

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [curriculum, setCurriculum] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuizzes = async () => {
      setLoading(true);
      setError(null);
      const response = await fetchQuizzes({ curriculum }); // Call your API
      if (response.error) {
        setError(response.error);
      } else {
        setQuizzes(response.data || []);
      }
      setLoading(false);
    };
    loadQuizzes();
  }, [curriculum]);

  // Color options for quiz cards
  const cardColors = [
    { border: 'border-vibrant-purple-400', bg: 'from-purple-50 to-purple-100', badge: 'from-purple-400 to-purple-600', glow: 'hover:shadow-glow-purple' },
    { border: 'border-vibrant-pink-500', bg: 'from-pink-50 to-pink-100', badge: 'from-pink-400 to-pink-600', glow: 'hover:shadow-glow-pink' },
    { border: 'border-vibrant-yellow-400', bg: 'from-yellow-50 to-yellow-100', badge: 'from-yellow-400 to-yellow-600', glow: 'hover:shadow-glow-yellow' },
    { border: 'border-vibrant-green-300', bg: 'from-green-50 to-green-100', badge: 'from-green-400 to-green-600', glow: 'hover:shadow-glow-green' },
    { border: 'border-vibrant-cyan-400', bg: 'from-cyan-50 to-cyan-100', badge: 'from-cyan-400 to-cyan-600', glow: 'hover:shadow-glow-cyan' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 text-center animate-slideDown">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-transparent bg-clip-text">
            🎯 Available Quizzes
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-medium">
            Choose a quiz and test your knowledge!
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8 sm:mb-10 animate-slideUp" style={{ animationDelay: '100ms' }}>
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-purple-200 hover:border-purple-300 transition-all duration-300">
            <label className="block text-gray-700 font-bold mb-3 text-base sm:text-lg flex items-center gap-2">
              🔍 Filter by Curriculum
            </label>
            <input
              type="text"
              placeholder="e.g., Uganda UCE Biology"
              className="w-full p-4 border-3 border-cyan-300 rounded-2xl focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all duration-300 text-base font-medium placeholder-gray-400"
              value={curriculum}
              onChange={(e) => setCurriculum(e.target.value)}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-5 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-2xl shadow-lg animate-shake">
            <p className="font-bold flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              {error}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16 sm:py-20 animate-fadeIn">
            <div className="inline-block">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-8 border-purple-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
              <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Loading awesome quizzes...
              </p>
            </div>
          </div>
        ) : quizzes.length === 0 ? (
          // Empty State
          <div className="text-center py-16 sm:py-20 animate-fadeIn">
            <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border-4 border-gray-200 max-w-md mx-auto">
              <div className="text-6xl sm:text-7xl mb-4">📚</div>
              <p className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">No quizzes available</p>
              <p className="text-gray-500 text-sm sm:text-base">Try adjusting your filter or check back later!</p>
            </div>
          </div>
        ) : (
          // Quiz Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {quizzes.map((quiz, index) => {
              const colorScheme = cardColors[index % cardColors.length];
              return (
                <div
                  key={quiz.id}
                  className={`group bg-gradient-to-br ${colorScheme.bg} rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl ${colorScheme.glow} transform hover:scale-105 transition-all duration-300 border-4 ${colorScheme.border} animate-slideUp`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6 sm:p-7">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                      <h2 className="text-xl sm:text-2xl font-black text-gray-800 group-hover:scale-105 transition-transform duration-300">
                        {quiz.title}
                      </h2>
                      <span className={`flex-shrink-0 bg-gradient-to-r ${colorScheme.badge} text-white text-xs sm:text-sm px-3 py-1.5 rounded-full font-bold shadow-md whitespace-nowrap`}>
                        {quiz.curriculum}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm sm:text-base mb-5 line-clamp-2 font-medium">
                      {quiz.description || 'Test your knowledge with this exciting quiz!'}
                    </p>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl sm:text-3xl">📝</span>
                        <span className="text-sm sm:text-base font-bold text-gray-700">
                          {quiz.questions?.length || 0} Questions
                        </span>
                      </div>
                      <button
                        onClick={() => navigate(`/quiz/${quiz.id}`)}
                        className={`w-full sm:w-auto bg-gradient-to-r ${colorScheme.badge} hover:opacity-90 text-white px-5 sm:px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 text-sm sm:text-base whitespace-nowrap`}
                      >
                        🚀 Start Quiz
                      </button>
                    </div>

                    {/* Decorative Element */}
                    <div className="mt-4 pt-4 border-t-2 border-gray-200">
                      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="text-base">⏱️</span>
                          {quiz.time_limit_minutes ? `${quiz.time_limit_minutes} min` : 'No limit'}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-base">🎓</span>
                          Quiz
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats Section (Optional) */}
        {!loading && quizzes.length > 0 && (
          <div className="mt-12 sm:mt-16 animate-slideUp" style={{ animationDelay: '300ms' }}>
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-green-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-2">
                    {quizzes.length}
                  </div>
                  <div className="text-gray-600 font-bold text-sm sm:text-base">Total Quizzes</div>
                </div>
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-pink-600 to-yellow-600 text-transparent bg-clip-text mb-2">
                    {quizzes.reduce((acc, q) => acc + (q.questions?.length || 0), 0)}
                  </div>
                  <div className="text-gray-600 font-bold text-sm sm:text-base">Total Questions</div>
                </div>
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-600 to-cyan-600 text-transparent bg-clip-text mb-2">
                    {new Set(quizzes.map(q => q.curriculum)).size}
                  </div>
                  <div className="text-gray-600 font-bold text-sm sm:text-base">Curriculums</div>
                </div>
              </div>
            </div>
          </div>
        )}
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

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
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

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .border-3 {
          border-width: 3px;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}