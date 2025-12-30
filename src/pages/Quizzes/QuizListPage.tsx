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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Quizzes</h1>
      
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <label className="block text-gray-700 mb-2">Filter by Curriculum</label>
        <input
          type="text"
          placeholder="e.g., Uganda UCE Biology"
          className="w-full md:w-1/3 border border-gray-300 p-2 rounded"
          value={curriculum}
          onChange={(e) => setCurriculum(e.target.value)}
        />
      </div>

      {error && <div className="mb-4 text-red-600 p-3 bg-red-50 rounded">{error}</div>}

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Loading quizzes...</p>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No quizzes available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-800">{quiz.title}</h2>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {quiz.curriculum}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{quiz.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {quiz.questions?.length || 0} questions
                  </span>
                  <button
                    onClick={() => navigate(`/quiz/${quiz.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}