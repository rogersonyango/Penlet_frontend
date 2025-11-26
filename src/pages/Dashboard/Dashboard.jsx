import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Brain, Video, Calendar, TrendingUp, Clock, BookOpen, Award
} from 'lucide-react';
import { mockAnalytics, mockSubjects, mockNotes } from '../../services/mockData';

const Dashboard = () => {
  const stats = [
    { icon: FileText, label: 'Total Notes', value: '24', color: 'bg-blue-500', link: '/notes' },
    { icon: Brain, label: 'Quizzes Taken', value: '12', color: 'bg-purple-500', link: '/quizzes' },
    { icon: Video, label: 'Videos Watched', value: '45', color: 'bg-pink-500', link: '/videos' },
    { icon: Award, label: 'Achievements', value: '8', color: 'bg-yellow-500', link: '/analytics' },
  ];

  const recentNotes = mockNotes.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
        <p className="text-primary-100">Here's what's happening with your studies today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Notes</h2>
            <Link to="/notes" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentNotes.map((note) => {
              const subject = mockSubjects.find(s => s.id === note.subjectId);
              return (
                <Link
                  key={note.id}
                  to={`/notes/${note.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: subject?.color }}
                    >
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{note.title}</h3>
                      <p className="text-sm text-gray-500">{subject?.name}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Study Time */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Study Time</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock size={24} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.floor(mockAnalytics.studyTime.today / 60)}h {mockAnalytics.studyTime.today % 60}m
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp size={24} className="text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.floor(mockAnalytics.studyTime.week / 60)}h {mockAnalytics.studyTime.week % 60}m
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/notes/new" className="btn btn-outline flex items-center justify-center space-x-2">
            <FileText size={20} />
            <span>New Note</span>
          </Link>
          <Link to="/quizzes" className="btn btn-outline flex items-center justify-center space-x-2">
            <Brain size={20} />
            <span>Take Quiz</span>
          </Link>
          <Link to="/timetable" className="btn btn-outline flex items-center justify-center space-x-2">
            <Calendar size={20} />
            <span>View Schedule</span>
          </Link>
          <Link to="/chatbot" className="btn btn-outline flex items-center justify-center space-x-2">
            <BookOpen size={20} />
            <span>AI Help</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;