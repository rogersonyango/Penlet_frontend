import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { mockQuizzes } from '../../services/mockData';
import toast from 'react-hot-toast';

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = mockQuizzes.find(q => q.id === id);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  
  if (!quiz) return <div>Quiz not found</div>;

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleSubmit = () => {
    toast.success('Quiz submitted!');
    navigate('/quizzes');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate('/quizzes')} className="btn btn-secondary flex items-center gap-2">
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="card">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{quiz.questions[currentQuestion].question}</h2>
          <div className="space-y-3">
            {quiz.questions[currentQuestion].options.map((option, idx) => (
              <label key={idx} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="answer"
                  checked={answers[quiz.questions[currentQuestion].id] === idx}
                  onChange={() => handleAnswer(quiz.questions[currentQuestion].id, idx)}
                  className="mr-3"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="btn btn-secondary"
          >
            Previous
          </button>
          {currentQuestion === quiz.questions.length - 1 ? (
            <button onClick={handleSubmit} className="btn btn-primary">Submit Quiz</button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
              className="btn btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;