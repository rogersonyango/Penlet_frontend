// src/pages/TakeQuizPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Quiz } from '../../types/quiz';
// import { fetchQuiz, startQuizAttempt, submitAnswer } from '../services/api';
// import type { Quiz, QuizAttempt } from '../services/types';

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

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!quiz) return <div className="p-6">Quiz not found</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-mono">
          ⏱️ {minutes}:{seconds < 10 ? '0' : ''}{seconds}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="text-sm text-gray-600 mb-2">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
        <h2 className="text-lg font-semibold mb-4">{currentQuestion.text}</h2>

        {currentQuestion.type === 'multiple_choice' && (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, idx) => (
              <label 
                key={idx} 
                className={`flex items-center p-3 border rounded cursor-pointer ${
                  answers[currentQuestion.id] === option 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  checked={answers[currentQuestion.id] === option}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="h-4 w-4 text-blue-600 mr-3"
                />
                {option}
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === 'text' && (
          <textarea
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            className="w-full border border-gray-300 rounded p-3 h-32"
            placeholder="Type your answer..."
          />
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-5 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Quiz
          </button>
        )}
      </div>
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

