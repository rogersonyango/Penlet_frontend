// src/pages/UpdateQuizPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { QuizQuestion } from '../../types/quiz';

export default function UpdateQuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authorized
  if (user?.role !== 'teacher' && user?.role !== 'admin') {
    navigate('/quizzes');
  }

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [curriculum, setCurriculum] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch quiz on mount
  useEffect(() => {
    if (!quizId) return;
    
    const loadQuiz = async () => {
      setLoading(true);
      const { data, error } = await fetchQuiz(Number(quizId));
      if (error) {
        setError(error);
      } else if (data) {
        setTitle(data.title);
        setDescription(data.description || '');
        setCurriculum(data.curriculum);
        setTimeLimit(data.time_limit_minutes);
        setQuestions(data.questions.map((q: { type: string; options: any; }) => ({
          ...q,
          options: q.type === 'multiple_choice' ? q.options || [] : undefined
        })));
      }
      setLoading(false);
    };

    loadQuiz();
  }, [quizId]);

  // Question management functions
  const addQuestion = () => {
    const newId = Date.now().toString();
    setQuestions([...questions, { 
      id: newId, 
      text: '', 
      type: 'multiple_choice', 
      options: ['', ''], 
      correct_answer: '' 
    }]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, field: keyof QuizQuestion, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const addOption = (id: string) => {
    setQuestions(questions.map(q => {
      if (q.id === id && q.options) {
        return { ...q, options: [...q.options, ''] };
      }
      return q;
    }));
  };

  const removeOption = (qId: string, optIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id === qId && q.options && q.options.length > 2) {
        const newOptions = [...q.options];
        newOptions.splice(optIndex, 1);
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const updateOption = (qId: string, optIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId && q.options) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const validateForm = (): boolean => {
    if (!title.trim() || !curriculum.trim()) {
      setError('Title and curriculum are required');
      return false;
    }

    for (const q of questions) {
      if (!q.text.trim()) {
        setError('All questions must have text');
        return false;
      }

      if (q.type === 'multiple_choice') {
        if (!q.options || q.options.length < 2 || q.options.some(opt => !opt.trim())) {
          setError('Multiple choice questions need at least 2 non-empty options');
          return false;
        }
        if (!q.correct_answer || !q.options.includes(q.correct_answer)) {
          setError('Correct answer must be one of the options');
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setSubmitting(true);
    const quizData = {
      title,
      description: description || null,
      curriculum,
      time_limit_minutes: timeLimit,
      questions
    };

    if (!quizId) return;
    const { error } = await updateQuiz(Number(quizId), quizData);
    if (error) {
      setError(error);
    } else {
      navigate('/quizzes');
    }
    setSubmitting(false);
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

  if (error && !title) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-red-400 animate-shake max-w-md">
          <div className="text-6xl mb-4 text-center">⚠️</div>
          <p className="text-xl font-bold text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 animate-slideDown">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-transparent bg-clip-text">
            ✏️ Update Quiz
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-medium">Make changes to improve your quiz!</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-2xl shadow-lg animate-shake">
            <p className="font-semibold">⚠️ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-purple-200 hover:border-purple-300 transition-all duration-300 animate-slideUp">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-purple-600 flex items-center gap-2">
              📋 Quiz Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="transform hover:scale-102 transition-transform duration-300">
                <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">
                  Quiz Title <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 sm:p-4 border-3 border-purple-300 rounded-2xl focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all duration-300 text-sm sm:text-base font-medium"
                  placeholder="e.g., Biology Chapter 5 Quiz"
                  required
                />
              </div>

              <div className="transform hover:scale-102 transition-transform duration-300">
                <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">
                  Curriculum <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  value={curriculum}
                  onChange={(e) => setCurriculum(e.target.value)}
                  className="w-full p-3 sm:p-4 border-3 border-cyan-300 rounded-2xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition-all duration-300 text-sm sm:text-base font-medium"
                  placeholder="e.g., Uganda UCE Biology"
                  required
                />
              </div>

              <div className="transform hover:scale-102 transition-transform duration-300">
                <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 sm:p-4 border-3 border-green-300 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 text-sm sm:text-base font-medium resize-none"
                  rows={3}
                  placeholder="Brief description of the quiz..."
                />
              </div>

              <div className="transform hover:scale-102 transition-transform duration-300">
                <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">
                  ⏱️ Time Limit (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-full p-3 sm:p-4 border-3 border-yellow-300 rounded-2xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200 transition-all duration-300 text-sm sm:text-base font-bold"
                />
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-pink-200 hover:border-pink-300 transition-all duration-300 animate-slideUp" style={{ animationDelay: '100ms' }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 flex items-center gap-2">
                ❓ Questions
              </h2>
              <button
                type="button"
                onClick={addQuestion}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
              >
                ➕ Add Question
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((question, qIndex) => (
                <div 
                  key={question.id} 
                  className="border-4 border-cyan-200 p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-cyan-50 to-purple-50 hover:shadow-xl transition-all duration-300 transform hover:scale-101"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-cyan-700">
                      Question {qIndex + 1}
                    </h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="w-full sm:w-auto bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white px-4 py-2 rounded-full font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm"
                      >
                        🗑️ Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="transform hover:scale-102 transition-transform duration-300">
                      <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">
                        Question Text <span className="text-pink-500">*</span>
                      </label>
                      <textarea
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                        className="w-full p-3 sm:p-4 border-3 border-purple-300 rounded-2xl focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all duration-300 text-sm sm:text-base font-medium resize-none"
                        rows={3}
                        placeholder="Enter your question here..."
                        required
                      />
                    </div>

                    <div className="transform hover:scale-102 transition-transform duration-300">
                      <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">
                        Question Type
                      </label>
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(question.id, 'type', e.target.value as any)}
                        className="w-full sm:w-auto p-3 sm:p-4 border-3 border-yellow-300 rounded-2xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition-all duration-300 font-bold text-sm sm:text-base bg-white"
                      >
                        <option value="multiple_choice">🔘 Multiple Choice</option>
                        <option value="text">✍️ Text Answer</option>
                      </select>
                    </div>

                    {question.type === 'multiple_choice' && (
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border-3 border-green-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
                          <label className="block text-gray-700 font-bold text-sm sm:text-base">
                            📝 Options
                          </label>
                          <button
                            type="button"
                            onClick={() => addOption(question.id)}
                            className="w-full sm:w-auto bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-500 hover:to-cyan-500 text-white px-4 py-2 rounded-full font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm"
                          >
                            ➕ Add Option
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {question.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-pink-400 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                                className="flex-1 p-3 border-3 border-cyan-200 rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200 transition-all duration-300 text-sm sm:text-base font-medium"
                                placeholder={`Option ${optIndex + 1}`}
                              />
                              {question.options!.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(question.id, optIndex)}
                                  className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white rounded-full font-bold shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300 flex items-center justify-center text-lg"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="transform hover:scale-102 transition-transform duration-300">
                      <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">
                        {question.type === 'multiple_choice' ? '✅ Correct Answer' : '💡 Expected Answer'}
                        <span className="text-pink-500"> *</span>
                      </label>
                      {question.type === 'multiple_choice' ? (
                        <select
                          value={question.correct_answer}
                          onChange={(e) => updateQuestion(question.id, 'correct_answer', e.target.value)}
                          className="w-full p-3 sm:p-4 border-3 border-green-300 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 font-bold text-sm sm:text-base bg-white"
                          required
                        >
                          <option value="">Select correct option...</option>
                          {question.options?.map((opt, idx) => (
                            <option key={idx} value={opt}>
                              {String.fromCharCode(65 + idx)} - {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={question.correct_answer}
                          onChange={(e) => updateQuestion(question.id, 'correct_answer', e.target.value)}
                          className="w-full p-3 sm:p-4 border-3 border-green-300 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 text-sm sm:text-base font-medium"
                          placeholder="Expected answer for auto-grading"
                          required
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slideUp" style={{ animationDelay: '200ms' }}>
            <button
              type="button"
              onClick={() => navigate('/quizzes')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg"
            >
              ← Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full sm:flex-1 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg ${
                submitting 
                  ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white'
              }`}
            >
              {submitting ? '⏳ Updating...' : '💾 Update Quiz'}
            </button>
          </div>
        </form>
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

        .hover\:scale-101:hover {
          transform: scale(1.01);
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}

function fetchQuiz(arg0: number): { data: any; error: any; } | PromiseLike<{ data: any; error: any; }> {
    throw new Error('Function not implemented.');
}
function updateQuiz(arg0: number, quizData: { title: string; description: string | null; curriculum: string; time_limit_minutes: number; questions: QuizQuestion[]; }): { error: any; } | PromiseLike<{ error: any; }> {
    throw new Error('Function not implemented.');
}