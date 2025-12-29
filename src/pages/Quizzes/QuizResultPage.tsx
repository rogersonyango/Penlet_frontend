// src/pages/QuizResultsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Quiz, QuizAttempt } from '../../types/quiz';
import { useAuth } from '../../hooks/useAuth';
// import { fetchQuizResults, fetchQuiz, uploadResource } from '../services/api';
// import { useAuth } from '../hooks/useAuth';
// import type { Quiz, QuizAttempt } from '../services/types';

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

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!attempt || !quiz) return <div className="p-6">Loading results...</div>;

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

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Quiz Results</h1>
      <p className="text-gray-600 mb-8">Review your answers and learn from mistakes</p>

      <div className={`p-6 rounded-xl mb-8 ${isPassing ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <div className="text-5xl font-bold mb-2">
              {attempt.score} / {attempt.max_score}
            </div>
            <div className="text-lg">{percentage.toFixed(1)}% {isPassing ? '✅' : '❌'}</div>
          </div>
          
          <div className="mt-4 md:mt-0 text-center">
            <div className="text-sm text-gray-600 mb-2">Retries used</div>
            <div className="text-2xl font-bold">{retryCount} / 2</div>
            {!showCorrectAnswers && retryCount < 2 && (
              <button
                onClick={handleRetry}
                className="mt-3 w-full md:w-auto px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
              >
                {retryCount === 0 ? 'Retry Quiz' : 'Final Retry'}
              </button>
            )}
          </div>
        </div>
      </div>

      {incorrectQuestions.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Questions to Review
            {showCorrectAnswers && <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Answers Revealed</span>}
          </h2>
          
          <div className="space-y-6">
            {incorrectQuestions.map((question) => (
              <div key={question.id} className="border border-red-200 rounded-lg p-5 bg-red-50">
                <h3 className="font-bold text-lg mb-3">Q: {question.text}</h3>
                <div>
                  <span className="font-semibold">Your answer:</span>
                  <span className="ml-2 text-red-700">
                    {userAnswers[question.id] || 'No answer'}
                  </span>
                </div>
                {showCorrectAnswers && (
                  <div className="mt-3 p-3 bg-green-100 rounded">
                    <span className="font-semibold">Correct answer:</span>
                    <span className="ml-2 text-green-800">{question.correct_answer}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <div className="border-t pt-8 mt-8">
          <h2 className="text-2xl font-bold mb-4">Upload Learning Resource</h2>
          <p className="text-gray-600 mb-4">Help students understand these concepts.</p>
          
          <form onSubmit={handleDocumentUpload} className="max-w-md">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.glb,.gltf,.obj"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="mb-3 w-full"
              required
            />
            <button
              type="submit"
              disabled={uploading || !uploadFile}
              className={`w-full py-2 px-4 rounded ${
                uploading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
              } text-white`}
            >
              {uploading ? 'Uploading...' : 'Upload Resource'}
            </button>
            {uploadMessage && (
              <p className={`mt-2 text-center ${uploadMessage.startsWith('❌') ? 'text-red-600' : 'text-green-600'}`}>
                {uploadMessage}
              </p>
            )}
          </form>
        </div>
      )}

      <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-8">
        <button
          onClick={() => navigate('/quizzes')}
          className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
        >
          Back to Quizzes
        </button>
        {showCorrectAnswers && quiz && (
          <button
            onClick={() => navigate(`/quiz/${quiz.id}`)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Retake Quiz
          </button>
        )}
      </div>
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

