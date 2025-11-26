import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Clock, Award } from 'lucide-react';
import { mockQuizzes, mockSubjects } from '../../services/mockData';

const Quizzes = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quizzes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockQuizzes.map(quiz => {
          const subject = mockSubjects.find(s => s.id === quiz.subjectId);
          return (
            <Link key={quiz.id} to={`/quizzes/${quiz.id}`} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: subject?.color }}>
                  <Brain size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{quiz.title}</h3>
                  <p className="text-sm text-gray-500">{subject?.name}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{quiz.duration / 60} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} />
                  <span>{quiz.totalQuestions} questions</span>
                </div>
              </div>
              <button className="btn btn-primary w-full mt-4">Start Quiz</button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Quizzes;