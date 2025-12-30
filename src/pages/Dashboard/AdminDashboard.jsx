import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, FileText, Clock, CheckCircle, AlertCircle, UserCog, Shield, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { theme } = useAppStore();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalSubjects: 0,
    totalContent: 0,
    pendingContent: 0,
    approvedContent: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Try to fetch from API, fall back to default state
      try {
        const { contentAPI, subjectsAPI } = await import('../../services/apiService');
        
        const [contentStats, subjectsData, contentData] = await Promise.all([
          contentAPI.getStats().catch(() => ({ total: 0, pending: 0 })),
          subjectsAPI.getAll({ page_size: 1 }).catch(() => ({ total: 0 })),
          contentAPI.getAll({ page: 1, page_size: 5 }).catch(() => ({ content: [] })),
        ]);

        setStats({
          totalUsers: 0, // Will be populated when usersAPI endpoint is available
          totalTeachers: 0,
          totalStudents: 0,
          totalSubjects: subjectsData.total || 0,
          totalContent: contentStats.total || 0,
          pendingContent: contentStats.pending || 0,
          approvedContent: (contentStats.total || 0) - (contentStats.pending || 0),
        });

        // Transform content data into activity format
        const activities = (contentData.content || []).map(item => ({
          id: item.id,
          type: 'content',
          action: item.status === 'pending' ? 'submitted' : item.status,
          title: item.title,
          user: item.created_by_name || 'A teacher',
          time: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recently',
        }));
        setRecentActivity(activities);
      } catch (err) {
        console.log('API not available, using default state');
      }
    } finally {
      setLoading(false);
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
          Welcome back, {user?.full_name?.split(' ')[0] || 'Admin'}!
        </h1>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          System overview and management
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
              <FileText className="w-6 h-6 text-primary-600" />
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
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Subjects</p>
              <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.totalSubjects}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className={`rounded-xl shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              to="/admin/content/pending"
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-yellow-900 bg-opacity-30 hover:bg-opacity-50' 
                  : 'bg-yellow-50 hover:bg-yellow-100'
              }`}
            >
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-600 mr-3" />
                <span className={`font-medium ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-900'}`}>
                  Review Pending Content
                </span>
              </div>
              {stats.pendingContent > 0 && (
                <span className="bg-yellow-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {stats.pendingContent}
                </span>
              )}
            </Link>

            <Link
              to="/admin/users"
              className={`flex items-center p-4 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-blue-900 bg-opacity-30 hover:bg-opacity-50' 
                  : 'bg-blue-50 hover:bg-blue-100'
              }`}
            >
              <UserCog className="w-5 h-5 text-blue-600 mr-3" />
              <span className={`font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-900'}`}>
                Manage Users
              </span>
            </Link>

            <Link
              to="/admin/subjects"
              className={`flex items-center p-4 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-purple-900 bg-opacity-30 hover:bg-opacity-50' 
                  : 'bg-purple-50 hover:bg-purple-100'
              }`}
            >
              <BookOpen className="w-5 h-5 text-purple-600 mr-3" />
              <span className={`font-medium ${theme === 'dark' ? 'text-purple-400' : 'text-purple-900'}`}>
                Manage Subjects
              </span>
            </Link>

            <Link
              to="/admin/analytics"
              className={`flex items-center p-4 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-green-900 bg-opacity-30 hover:bg-opacity-50' 
                  : 'bg-green-50 hover:bg-green-100'
              }`}
            >
              <TrendingUp className="w-5 h-5 text-green-600 mr-3" />
              <span className={`font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-900'}`}>
                View Analytics
              </span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`rounded-xl shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Recent Activity
            </h2>
            <Link 
              to="/admin/activity" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <Shield className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
                <p>No recent activity</p>
                <p className="text-sm mt-1">Activity will appear here as users interact with the system</p>
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {activity.title}
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                    activity.action === 'approved' ? 'bg-green-100 text-green-800' :
                    activity.action === 'submitted' || activity.action === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    activity.action === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.action}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className={`rounded-xl shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          System Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                User Statistics
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Total Users</span>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalUsers || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Teachers</span>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalTeachers || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Students</span>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalStudents || '—'}
                </span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center mb-3">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Content Statistics
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Total Content</span>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalContent}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Approved</span>
                <span className="font-semibold text-green-600">{stats.approvedContent}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Pending</span>
                <span className="font-semibold text-yellow-600">{stats.pendingContent}</span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center mb-3">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Platform Health
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Status</span>
                <span className="font-semibold text-green-600">Healthy</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Uptime</span>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>99.9%</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Subjects</span>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalSubjects}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}