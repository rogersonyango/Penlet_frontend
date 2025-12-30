// src/pages/CreateQuizPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { QuizQuestion } from '../../types/quiz';
// import { useAuth } from '../hooks/useAuth';
// import { createQuiz } from '../services/api';
// import type { QuizQuestion } from '../services/types';

export default function CreateQuizPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authorized
  if (user?.role !== 'teacher' && user?.role !== 'admin') {
    navigate('/quizzes');
  }

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [curriculum, setCurriculum] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    { id: '1', text: '', type: 'multiple_choice', options: ['', ''], correct_answer: '' }
  ]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const addQuestion = () => {
    const newId = (questions.length + 1).toString();
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

    const { error } = await createQuiz(quizData);
    if (error) {
      setError(error);
    } else {
      navigate('/quizzes');
    }
    setSubmitting(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Quiz</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Quiz Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Curriculum *</label>
            <input
              type="text"
              value={curriculum}
              onChange={(e) => setCurriculum(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g., Uganda UCE Biology"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Time Limit (minutes)</label>
            <input
              type="number"
              min="1"
              max="180"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Add Question
            </button>
          </div>

          {questions.map((question, qIndex) => (
            <div key={question.id} className="border p-4 mb-4 rounded bg-gray-50">
              <div className="flex justify-between items-start">
                <h3 className="font-medium mb-3">Question {qIndex + 1}</h3>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="mb-3">
                <label className="block text-gray-700 mb-1">Question Text *</label>
                <textarea
                  value={question.text}
                  onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={2}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-gray-700 mb-1">Question Type</label>
                <select
                  value={question.type}
                  onChange={(e) => updateQuestion(question.id, 'type', e.target.value as any)}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="text">Text Answer</option>
                </select>
              </div>

              {question.type === 'multiple_choice' && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700">Options</label>
                    <button
                      type="button"
                      onClick={() => addOption(question.id)}
                      className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                    >
                      Add Option
                    </button>
                  </div>
                  {question.options?.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded mr-2"
                        placeholder={`Option ${optIndex + 1}`}
                      />
                      {question.options!.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(question.id, optIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-gray-700 mb-1">
                  {question.type === 'multiple_choice' ? 'Correct Answer' : 'Expected Answer'}
                </label>
                {question.type === 'multiple_choice' ? (
                  <select
                    value={question.correct_answer}
                    onChange={(e) => updateQuestion(question.id, 'correct_answer', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Select correct option</option>
                    {question.options?.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={question.correct_answer}
                    onChange={(e) => updateQuestion(question.id, 'correct_answer', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Expected answer for auto-grading"
                    required
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/quizzes')}
            className="px-5 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`px-5 py-2 rounded ${
              submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {submitting ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}

function createQuiz(quizData: { title: string; description: string | null; curriculum: string; time_limit_minutes: number; questions: QuizQuestion[]; }): { error: any; } | PromiseLike<{ error: any; }> {
    throw new Error('Function not implemented.');
}
