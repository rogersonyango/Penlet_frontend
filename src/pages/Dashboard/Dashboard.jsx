import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Brain, Video, Calendar, TrendingUp, Clock, BookOpen, Award, Target, Zap
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  
  // You can replace these with actual API calls
  const stats = [
    { icon: FileText, label: 'Total Notes', value: '24', color: 'from-blue-500 to-blue-600', link: '/notes' },
    { icon: Brain, label: 'Quizzes Taken', value: '12', color: 'from-purple-500 to-purple-600', link: '/quizzes' },
    { icon: Video, label: 'Videos Watched', value: '45', color: 'from-pink-500 to-pink-600', link: '/videos' },
    { icon: Award, label: 'Achievements', value: '8', color: 'from-yellow-500 to-yellow-600', link: '/analytics' },
  ];

  const recentNotes = [
    { id: 1, title: 'Introduction to Physics', subject: 'Physics', color: '#3b82f6' },
    { id: 2, title: 'Chemical Reactions', subject: 'Chemistry', color: '#10b981' },
    { id: 3, title: 'Calculus Basics', subject: 'Mathematics', color: '#f97316' }
  ];

  const studyTime = {
    today: { hours: 2, minutes: 0 },
    thisWeek: { hours: 14, minutes: 0 }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner - Updated with purple gradient */}
      <div 
        className="rounded-xl p-6 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
          boxShadow: '0 8px 24px rgba(147, 51, 234, 0.3)'
        }}
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-purple-100">
            Here's what's happening with your studies today
          </p>
        </div>
        {/* Decorative circle */}
        <div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="card hover:shadow-xl transition-all transform hover:-translate-y-1"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div 
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
                >
                  <Icon size={28} className="text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Notes - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Notes</h2>
              <Link 
                to="/notes" 
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentNotes.map((note) => (
                <Link
                  key={note.id}
                  to={`/notes/${note.id}`}
                  className="block p-4 rounded-xl hover:bg-gray-50 transition-all border-l-4 hover:shadow-md"
                  style={{ borderLeftColor: note.color }}
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: note.color }}
                    >
                      <FileText size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{note.title}</h3>
                      <p className="text-sm text-gray-600">{note.subject}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Study Time - Takes 1 column */}
        <div className="space-y-6">
          {/* Study Time Card */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Study Time</h2>
            
            <div className="space-y-4">
              <div 
                className="p-4 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                    <Clock size={20} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Today</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  {studyTime.today.hours}h {studyTime.today.minutes}m
                </p>
              </div>

              <div 
                className="p-4 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)'
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-md">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">This Week</span>
                </div>
                <p className="text-3xl font-bold text-purple-600">
                  {studyTime.thisWeek.hours}h {studyTime.thisWeek.minutes}m
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <Link
                to="/notes/new"
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <FileText size={20} />
                New Note
              </Link>
              
              <Link
                to="/quizzes"
                className="btn w-full flex items-center justify-center gap-2 bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50 font-medium"
              >
                <Target size={20} />
                Take Quiz
              </Link>
              
              <Link
                to="/timetable"
                className="btn w-full flex items-center justify-center gap-2 bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50 font-medium"
              >
                <Calendar size={20} />
                View Schedule
              </Link>
              
              <Link
                to="/chatbot"
                className="btn w-full flex items-center justify-center gap-2 bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50 font-medium"
              >
                <Zap size={20} />
                AI Help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;