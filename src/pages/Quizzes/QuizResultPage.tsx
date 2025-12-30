// src/pages/QuizResultsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Quiz, QuizAttempt } from '../../types/quiz';
import { useAuth } from '../../hooks/useAuth';

export default function QuizResultsPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!attemptId) return;
    
    const loadResults = async () => {
      setError(null);
      
      // Fetch attempt
      const { data: attemptData, error: attemptError } = await fetchQuizResults(Number(attemptId));
      if (attemptError) {
        setError(attemptError);
        return;
      }
      setAttempt(attemptData!);

      // Fetch quiz
      const { data: quizData, error: quizError } = await fetchQuiz(attemptData!.quiz_id);
      if (quizError) {
        setError(quizError);
        return;
      }
      setQuiz(quizData!);
    };

    loadResults();
  }, [attemptId]);

  const handleRetry = () => {
    if (retryCount >= 1) {
      setShowCorrectAnswers(true);
      return;
    }
    if (quiz) {
      setRetryCount(retryCount + 1);
      navigate(`/quiz/${quiz.id}`);
    }
  };

  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !quiz) return;
    
    setUploading(true);
    const resourceData = {
      title: `Study Guide: ${quiz.title}`,
      subject: quiz.curriculum,
      category_id: 1,
      is_featured: false,
    };

    const { error } = await uploadResource(uploadFile, resourceData);
    if (error) {
      setUploadMessage(`❌ ${error}`);
    } else {
      setUploadMessage('✅ Resource uploaded successfully!');
      setUploadFile(null);
    }
    setUploading(false);
    setTimeout(() => setUploadMessage(''), 3000);
  };

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

  if (!attempt || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-purple-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Loading your results...
          </p>
        </div>
      </div>
    );
  }

  const userAnswers = attempt.answers || {};
  const incorrectQuestions = quiz.questions.filter(q => {
    const userAnswer = userAnswers[q.id];
    if (q.type === 'multiple_choice') {
      return userAnswer !== q.correct_answer;
    }
    return userAnswer?.trim()?.toLowerCase() !== (q.correct_answer || '').trim().toLowerCase();
  });

  const percentage = attempt.max_score! > 0 ? (attempt.score! / attempt.max_score!) * 100 : 0;
  const isPassing = percentage >= 50;
  const correctCount = quiz.questions.length - incorrectQuestions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center animate-slideDown">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-transparent bg-clip-text">
            {isPassing ? '🎉 Quiz Results' : '📊 Quiz Results'}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-medium">
            {isPassing ? 'Great job! Keep up the awesome work! 🚀' : 'Review and learn from your mistakes 💪'}
          </p>
        </div>

        {/* Score Card */}
        <div 
          className={`p-6 sm:p-8 lg:p-10 rounded-3xl mb-8 shadow-2xl border-4 transform hover:scale-102 transition-all duration-300 animate-slideUp ${
            isPassing 
              ? 'bg-gradient-to-br from-green-50 to-cyan-50 border-green-400' 
              : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-400'
          }`}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Score Display */}
            <div className="text-center lg:text-left">
              <div className={`text-6xl sm:text-7xl lg:text-8xl font-black mb-4 ${
                isPassing 
                  ? 'bg-gradient-to-r from-green-600 to-cyan-600 text-transparent bg-clip-text' 
                  : 'bg-gradient-to-r from-red-600 to-pink-600 text-transparent bg-clip-text'
              }`}>
                {attempt.score} / {attempt.max_score}
              </div>
              <div className={`text-2xl sm:text-3xl font-bold mb-2 ${isPassing ? 'text-green-700' : 'text-red-700'}`}>
                {percentage.toFixed(1)}% {isPassing ? '✅' : '❌'}
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-4 text-gray-700 font-bold">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  {correctCount} Correct
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-2xl">❌</span>
                  {incorrectQuestions.length} Wrong
                </span>
              </div>
            </div>
            
            {/* Retry Section */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-3 border-purple-300 text-center min-w-[250px]">
              <div className="text-sm text-gray-600 font-bold mb-2">🔄 Retries Used</div>
              <div className="flex items-center justify-center gap-2 mb-4">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl font-black border-3 ${
                      i < retryCount
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-600 text-white'
                        : 'bg-gray-200 border-gray-400 text-gray-500'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              {!showCorrectAnswers && retryCount < 2 && (
                <button
                  onClick={handleRetry}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {retryCount === 0 ? '🔄 Retry Quiz' : '⚡ Final Retry'}
                </button>
              )}
              {showCorrectAnswers && (
                <div className="bg-gradient-to-r from-green-400 to-cyan-400 text-white px-4 py-2 rounded-full font-bold text-sm">
                  ✨ Answers Revealed
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 bg-white rounded-full h-6 overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-3 font-bold text-white text-sm ${
                isPassing 
                  ? 'bg-gradient-to-r from-green-400 to-cyan-400' 
                  : 'bg-gradient-to-r from-red-400 to-pink-500'
              }`}
              style={{ width: `${percentage}%` }}
            >
              {percentage > 15 && `${percentage.toFixed(0)}%`}
            </div>
          </div>
        </div>

        {/* Incorrect Questions Section */}
        {incorrectQuestions.length > 0 && (
          <div className="mb-10 animate-slideUp" style={{ animationDelay: '100ms' }}>
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-red-300">
              <h2 className="text-2xl sm:text-3xl font-black text-red-600 mb-6 flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">📝</span>
                Questions to Review
                {showCorrectAnswers && (
                  <span className="ml-auto text-sm bg-gradient-to-r from-green-400 to-cyan-400 text-white px-4 py-2 rounded-full font-bold">
                    ✨ Answers Revealed
                  </span>
                )}
              </h2>
              
              <div className="space-y-6">
                {incorrectQuestions.map((question, idx) => (
                  <div 
                    key={question.id} 
                    className="border-4 border-pink-200 rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-red-50 to-pink-50 hover:shadow-xl transition-all duration-300 transform hover:scale-101"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <span className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-400 to-pink-500 text-white rounded-full flex items-center justify-center font-black text-lg">
                        {idx + 1}
                      </span>
                      <h3 className="font-bold text-lg sm:text-xl text-gray-800 flex-1">
                        {question.text}
                      </h3>
                    </div>
                    
                    {/* User's Answer */}
                    <div className="bg-white p-4 rounded-2xl mb-3 border-3 border-red-300">
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">❌</span>
                        <div>
                          <div className="font-bold text-gray-700 mb-1">Your answer:</div>
                          <div className="text-red-700 font-semibold">
                            {userAnswers[question.id] || 'No answer provided'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Correct Answer */}
                    {showCorrectAnswers && (
                      <div className="bg-gradient-to-br from-green-100 to-cyan-100 p-4 rounded-2xl border-3 border-green-400 animate-slideDown">
                        <div className="flex items-start gap-2">
                          <span className="text-2xl">✅</span>
                          <div>
                            <div className="font-bold text-gray-700 mb-1">Correct answer:</div>
                            <div className="text-green-800 font-bold text-lg">
                              {question.correct_answer}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Perfect Score Celebration */}
        {incorrectQuestions.length === 0 && (
          <div className="mb-10 animate-slideUp" style={{ animationDelay: '100ms' }}>
            <div className="bg-gradient-to-br from-yellow-100 via-green-100 to-cyan-100 p-8 sm:p-12 rounded-3xl shadow-xl border-4 border-yellow-400 text-center">
              <div className="text-6xl sm:text-7xl mb-4 animate-bounce-slow">🏆</div>
              <h2 className="text-3xl sm:text-4xl font-black mb-3 bg-gradient-to-r from-yellow-600 via-green-600 to-cyan-600 text-transparent bg-clip-text">
                Perfect Score!
              </h2>
              <p className="text-xl text-gray-700 font-bold">
                You got all questions right! Amazing work! 🌟
              </p>
            </div>
          </div>
        )}

        {/* Upload Resource Section (Teacher/Admin Only) */}
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <div className="mb-10 animate-slideUp" style={{ animationDelay: '200ms' }}>
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-purple-300">
              <h2 className="text-2xl sm:text-3xl font-black text-purple-600 mb-4 flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">📚</span>
                Upload Learning Resource
              </h2>
              <p className="text-gray-600 mb-6 font-medium">
                Help students understand these concepts better by sharing study materials!
              </p>
              
              <form onSubmit={handleDocumentUpload} className="max-w-md">
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-3 flex items-center gap-2">
                    <span className="text-xl">📎</span>
                    Choose File
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.glb,.gltf,.obj"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full p-4 border-3 border-purple-300 rounded-2xl focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all duration-300 font-medium bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-purple-500 file:to-pink-500 file:text-white file:font-bold file:cursor-pointer hover:file:opacity-90"
                    required
                  />
                  {uploadFile && (
                    <p className="mt-2 text-sm text-gray-600 font-medium flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      {uploadFile.name}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className={`w-full py-4 px-6 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg ${
                    uploading || !uploadFile
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white'
                  }`}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </span>
                  ) : (
                    '📤 Upload Resource'
                  )}
                </button>
                
                {uploadMessage && (
                  <div className={`mt-4 p-4 rounded-2xl text-center font-bold animate-slideDown ${
                    uploadMessage.startsWith('❌') 
                      ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-3 border-red-300' 
                      : 'bg-gradient-to-r from-green-100 to-cyan-100 text-green-700 border-3 border-green-300'
                  }`}>
                    {uploadMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp" style={{ animationDelay: '300ms' }}>
          <button
            onClick={() => navigate('/quizzes')}
            className="px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg"
          >
            ← Back to Quizzes
          </button>
          {showCorrectAnswers && quiz && (
            <button
              onClick={() => navigate(`/quiz/${quiz.id}`)}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg"
            >
              🔄 Retake Quiz
            </button>
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

        .animate-bounce-slow {
          animation: bounce 3s infinite;
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

        @keyframes bounce {
          0%, 100% {
            transform: translateY(-5%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
      `}</style>
    </div>
  );
}

function fetchQuizResults(arg0: number): { data: any; error: any; } | PromiseLike<{ data: any; error: any; }> {
    throw new Error('Function not implemented.');
}
function fetchQuiz(quiz_id: any): { data: any; error: any; } | PromiseLike<{ data: any; error: any; }> {
    throw new Error('Function not implemented.');
}

function uploadResource(uploadFile: File, resourceData: { title: string; subject: string; category_id: number; is_featured: boolean; }): { error: any; } | PromiseLike<{ error: any; }> {
    throw new Error('Function not implemented.');
}