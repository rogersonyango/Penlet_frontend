import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, FileText, Video, BookOpen } from 'lucide-react';
import { contentAPI } from '../../services/apiService';

export default function Analytics({ userRole = 'teacher' }) {
  const [stats, setStats] = useState({
    total: 0,
    notes: 0,
    videos: 0,
    assignments: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contentAPI.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Content statistics and insights</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-gray-500">Total Notes</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.notes || 0}</p>
          <p className="text-sm text-gray-500 mt-1">
            {((stats.notes / stats.total) * 100 || 0).toFixed(1)}% of total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <Video className="w-8 h-8 text-red-600" />
            <span className="text-sm text-gray-500">Total Videos</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.videos || 0}</p>
          <p className="text-sm text-gray-500 mt-1">
            {((stats.videos / stats.total) * 100 || 0).toFixed(1)}% of total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-8 h-8 text-green-600" />
            <span className="text-sm text-gray-500">Assignments</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.assignments || 0}</p>
          <p className="text-sm text-gray-500 mt-1">
            {((stats.assignments / stats.total) * 100 || 0).toFixed(1)}% of total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-sm text-gray-500">Total Content</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total || 0}</p>
          <p className="text-sm text-yellow-600 mt-1">
            {stats.pending || 0} pending approval
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Distribution</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Notes</span>
              <span className="font-medium">{stats.notes || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(stats.notes / stats.total) * 100 || 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Videos</span>
              <span className="font-medium">{stats.videos || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{ width: `${(stats.videos / stats.total) * 100 || 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Assignments</span>
              <span className="font-medium">{stats.assignments || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${(stats.assignments / stats.total) * 100 || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {userRole === 'teacher' && stats.pending > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <BarChart3 className="w-5 h-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-yellow-800 font-medium">
                You have {stats.pending} content item{stats.pending !== 1 ? 's' : ''} pending approval
              </p>
              <p className="text-yellow-700 text-sm">
                Contact admin to review your submissions
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}