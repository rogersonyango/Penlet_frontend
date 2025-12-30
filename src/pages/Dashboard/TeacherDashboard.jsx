import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Video, Users, CheckCircle, Clock, AlertCircle, PlusCircle, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';

export default function TeacherDashboard() {
  const { user } = useAuthStore();
  const { theme } = useAppStore();
  
  const [stats, setStats] = useState({
    totalContent: 0,
    pendingContent: 0,
    approvedContent: 0,
    totalSubjects: 0,
  });
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API, fall back to mock data
      try {
        const { contentAPI, subjectsAPI } = await import('../../services/apiService');
        
        const [contentStats, subjectsData, recentData] = await Promise.all([
          contentAPI.getStats().catch(() => ({ total: 0, pending: 0 })),
          subjectsAPI.getAll({ page_size: 100 }).catch(() => ({ total: 0 })),
          contentAPI.getMy({ page: 1, page_size: 5 }).catch(() => ({ content: [] })),
        ]);

        setStats({
          totalContent: contentStats.total || 0,
          pendingContent: contentStats.pending || 0,
          approvedContent: (contentStats.total || 0) - (contentStats.pending || 0),
          totalSubjects: subjectsData.total || 0,
        });

        setRecentContent(recentData.content || []);
      } catch (err) {
        console.log('API not available, using default state');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'note':
        return <FileText className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'assignment':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Welcome back, {user?.full_name?.split(' ')[0] || 'Teacher'}!
        </h1>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Manage your content and track student progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`rounded-xl shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Content</p>
              <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.totalContent}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Pending Approval</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingContent}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approvedContent}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>My Subjects</p>
              <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.totalSubjects}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`rounded-xl shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/teacher/content/create"
            className={`flex items-center p-4 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-primary-900 bg-opacity-30 hover:bg-opacity-50' 
                : 'bg-primary-50 hover:bg-primary-100'
            }`}
          >
            <PlusCircle className="w-5 h-5 text-primary-600 mr-3" />
            <span className={`font-medium ${theme === 'dark' ? 'text-primary-400' : 'text-primary-900'}`}>
              Create Content
            </span>
          </Link>
          <Link
            to="/teacher/subjects"
            className={`flex items-center p-4 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-purple-900 bg-opacity-30 hover:bg-opacity-50' 
                : 'bg-purple-50 hover:bg-purple-100'
            }`}
          >
            <BookOpen className="w-5 h-5 text-purple-600 mr-3" />
            <span className={`font-medium ${theme === 'dark' ? 'text-purple-400' : 'text-purple-900'}`}>
              My Subjects
            </span>
          </Link>
          <Link
            to="/teacher/content"
            className={`flex items-center p-4 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-green-900 bg-opacity-30 hover:bg-opacity-50' 
                : 'bg-green-50 hover:bg-green-100'
            }`}
          >
            <FileText className="w-5 h-5 text-green-600 mr-3" />
            <span className={`font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-900'}`}>
              My Content
            </span>
          </Link>
          <Link
            to="/teacher/progress"
            className={`flex items-center p-4 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-blue-900 bg-opacity-30 hover:bg-opacity-50' 
                : 'bg-blue-50 hover:bg-blue-100'
            }`}
          >
            <TrendingUp className="w-5 h-5 text-blue-600 mr-3" />
            <span className={`font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-900'}`}>
              Student Progress
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Content */}
      <div className={`rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`p-6 border-b flex justify-between items-center ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Recent Content
          </h2>
          <Link 
            to="/teacher/content" 
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        <div className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
          {recentContent.length === 0 ? (
            <div className={`p-8 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <FileText className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
              <p className="text-lg font-medium mb-2">No content yet</p>
              <p className="text-sm mb-4">Create your first content item to get started!</p>
              <Link
                to="/teacher/content/create"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Content
              </Link>
            </div>
          ) : (
            recentContent.map((item) => (
              <div 
                key={item.id} 
                className={`p-4 transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </p>
                      <p className={`text-sm truncate ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {item.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 ml-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-primary-100 text-primary-800'
                    }`}>
                      {item.type}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(item.status)}
                      <span className={`text-xs capitalize ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}