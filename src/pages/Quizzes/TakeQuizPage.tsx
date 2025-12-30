// src/pages/TakeQuizPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Quiz } from '../../types/quiz';

export default function TakeQuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) return;
    
    const init = async () => {
      setLoading(true);
      setError(null);
      
      // Fetch quiz
      const { data: quizData, error: quizError } = await fetchQuiz(Number(quizId));
      if (quizError) {
        setError(quizError);
        setLoading(false);
        return;
      }
      setQuiz(quizData!);

      // Start attempt
      const userId = localStorage.getItem('mockUser') || 'student';
      const { data: attemptData, error: attemptError } = await startQuizAttempt(Number(quizId), userId);
      if (attemptError) {
        setError(attemptError);
        setLoading(false);
        return;
      }
      setAttemptId(attemptData!.id);
      setTimeLeft((quizData!.time_limit_minutes || 30) * 60);
      setLoading(false);
    };

    init();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionId: string, value: any) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // Auto-save
    if (attemptId) {
      submitAnswer(attemptId, questionId, value);
    }
  };

  const handleSubmit = async () => {
    if (!attemptId || !quizId) return;
    navigate(`/results/${attemptId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-purple-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Loading quiz...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-red-400 animate-shake max-w-md">
          <div className="text-6xl mb-4 text-center">⚠️</div>
          <p className="text-xl font-bold text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-gray-400 max-w-md">
          <div className="text-6xl mb-4 text-center">❓</div>
          <p className="text-xl font-bold text-gray-600 text-center">Quiz not found</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLowTime = timeLeft > 0 && timeLeft <= 60;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-purple-300 mb-6 animate-slideDown">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-transparent bg-clip-text mb-2">
                {quiz.title}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-sm sm:text-base text-gray-600 font-bold flex items-center gap-2">
                  <span className="text-xl">📝</span>
                  Question {currentQuestionIndex + 1} / {quiz.questions.length}
                </span>
                <span className="text-sm sm:text-base text-gray-600 font-bold flex items-center gap-2">
                  <span className="text-xl">✅</span>
                  {answeredCount} Answered
                </span>
              </div>
            </div>
            
            {/* Timer */}
            <div className={`flex-shrink-0 px-6 py-4 rounded-2xl font-mono text-2xl sm:text-3xl font-black shadow-lg border-3 ${
              isLowTime 
                ? 'bg-gradient-to-br from-red-100 to-pink-100 text-red-600 border-red-400 animate-pulse' 
                : timeLeft <= 300 
                ? 'bg-gradient-to-br from-yellow-100 to-orange-100 text-yellow-700 border-yellow-400'
                : 'bg-gradient-to-br from-green-100 to-cyan-100 text-green-700 border-green-400'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-3xl">⏱️</span>
                {minutes}:{seconds < 10 ? '0' : ''}{seconds}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 font-bold mt-2 text-right">
            {progress.toFixed(0)}% Complete
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl border-4 border-pink-300 mb-6 animate-slideUp">
          {/* Question Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 text-white rounded-full flex items-center justify-center font-black text-xl sm:text-2xl shadow-lg">
              {currentQuestionIndex + 1}
            </div>
            <div className="flex-1">
              <div className="text-xs sm:text-sm text-gray-500 font-bold mb-2 uppercase tracking-wide">
                {currentQuestion.type === 'multiple_choice' ? '🔘 Multiple Choice' : '✍️ Text Answer'}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 leading-relaxed">
                {currentQuestion.text}
              </h2>
            </div>
          </div>

          {/* Answer Options */}
          {currentQuestion.type === 'multiple_choice' && (
            <div className="space-y-3 sm:space-y-4">
              {currentQuestion.options?.map((option, idx) => {
                const isSelected = answers[currentQuestion.id] === option;
                const optionColors = [
                  { border: 'border-purple-400', bg: 'from-purple-50 to-purple-100', selected: 'from-purple-400 to-purple-600' },
                  { border: 'border-pink-400', bg: 'from-pink-50 to-pink-100', selected: 'from-pink-400 to-pink-600' },
                  { border: 'border-yellow-400', bg: 'from-yellow-50 to-yellow-100', selected: 'from-yellow-400 to-yellow-600' },
                  { border: 'border-green-400', bg: 'from-green-50 to-green-100', selected: 'from-green-400 to-green-600' },
                  { border: 'border-cyan-400', bg: 'from-cyan-50 to-cyan-100', selected: 'from-cyan-400 to-cyan-600' },
                ];
                const color = optionColors[idx % optionColors.length];

                return (
                  <label 
                    key={idx} 
                    className={`flex items-center p-4 sm:p-5 rounded-2xl cursor-pointer transform transition-all duration-300 border-3 ${
                      isSelected 
                        ? `bg-gradient-to-r ${color.selected} border-transparent shadow-xl scale-105 text-white` 
                        : `bg-gradient-to-br ${color.bg} ${color.border} hover:shadow-lg hover:scale-102`
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-base sm:text-lg border-3 mr-4 ${
                      isSelected 
                        ? 'bg-white text-purple-600 border-white' 
                        : 'bg-white text-gray-600 border-gray-300'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={isSelected}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="hidden"
                    />
                    <span className={`flex-1 text-base sm:text-lg font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                      {option}
                    </span>
                    {isSelected && (
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold text-lg animate-bounce">
                        ✓
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'text' && (
            <div className="animate-slideUp">
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="w-full border-4 border-cyan-300 rounded-2xl p-4 sm:p-5 text-base sm:text-lg font-medium focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all duration-300 resize-none"
                rows={6}
                placeholder="Type your answer here... ✍️"
              />
              <div className="text-sm text-gray-500 mt-2 font-medium">
                {(answers[currentQuestion.id] || '').length} characters
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 animate-slideUp" style={{ animationDelay: '100ms' }}>
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className={`px-6 sm:px-8 py-4 rounded-full font-bold shadow-lg text-base sm:text-lg transition-all duration-300 ${
              currentQuestionIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white hover:shadow-xl transform hover:scale-105'
            }`}
          >
            ← Previous
          </button>

          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              className="px-6 sm:px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 sm:px-8 py-4 bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg flex items-center justify-center gap-2"
            >
              <span className="text-xl">🚀</span>
              Submit Quiz
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-8 bg-white p-6 rounded-3xl shadow-xl border-4 border-cyan-300 animate-slideUp" style={{ animationDelay: '200ms' }}>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            Question Navigator
          </h3>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3">
            {quiz.questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
              const isCurrent = idx === currentQuestionIndex;
              
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`aspect-square rounded-xl font-bold text-sm sm:text-base transition-all duration-300 border-3 ${
                    isCurrent
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-purple-600 scale-110 shadow-lg'
                      : isAnswered
                      ? 'bg-gradient-to-br from-green-400 to-cyan-400 text-white border-green-500 hover:scale-105'
                      : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-purple-600"></div>
              Current
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-400 to-cyan-400 border-2 border-green-500"></div>
              Answered
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gray-100 border-2 border-gray-300"></div>
              Not Answered
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

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }

        .border-3 {
          border-width: 3px;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </div>
  );
}

function fetchQuiz(arg0: number): { data: any; error: any; } | PromiseLike<{ data: any; error: any; }> {
  throw new Error('Function not implemented.');
}
function startQuizAttempt(arg0: number, userId: string): { data: any; error: any; } | PromiseLike<{ data: any; error: any; }> {
  throw new Error('Function not implemented.');
}

function submitAnswer(attemptId: number, questionId: string, value: any) {
  throw new Error('Function not implemented.');
}