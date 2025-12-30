import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, FileText, Video, BookOpen, AlertCircle } from 'lucide-react';
import { contentAPI } from '../../services/apiService';

export default function ContentModeration() {
  const [pendingContent, setPendingContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPendingContent();
  }, []);

  const fetchPendingContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contentAPI.getPending();
      setPendingContent(data || []);
    } catch (err) {
      console.error('Error fetching pending content:', err);
      setError('Failed to load pending content');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setProcessing(id);
      await contentAPI.approve(id);
      fetchPendingContent();
    } catch (err) {
      console.error('Error approving content:', err);
      alert('Failed to approve content');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to reject this content?')) return;
    
    try {
      setProcessing(id);
      await contentAPI.reject(id);
      fetchPendingContent();
    } catch (err) {
      console.error('Error rejecting content:', err);
      alert('Failed to reject content');
    } finally {
      setProcessing(null);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'note':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-red-600" />;
      case 'assignment':
        return <BookOpen className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
        <p className="text-gray-600">Review and approve pending content submissions</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        {pendingContent.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">No pending content to review</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingContent.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description || 'No description provided'}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {item.type}
                        </span>
                        <span>Submitted {new Date(item.created_at).toLocaleDateString()}</span>
                        {item.file_path && (
                          <span className="text-indigo-600">Has attachment</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleApprove(item.id)}
                      disabled={processing === item.id}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {processing === item.id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      disabled={processing === item.id}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {pendingContent.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>{pendingContent.length}</strong> item{pendingContent.length !== 1 ? 's' : ''} pending review
          </p>
        </div>
      )}
    </div>
  );
}