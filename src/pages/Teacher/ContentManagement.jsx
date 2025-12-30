import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Video,
  ClipboardList,
  Edit,
  Trash2,
  Eye,
  Download,
  MoreVertical,
} from 'lucide-react';
import FileUpload from '../../components/FileUpload';

/**
 * ContentManagement Component
 * 
 * Manage all content (notes, videos, assignments)
 * Used by both teachers and admins
 */
const ContentManagement = ({ userRole = 'teacher' }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    filterContentList();
  }, [searchQuery, filterType, filterSubject, content]);

  const fetchContent = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/content', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Mock data
      const mockContent = [
        {
          id: 1,
          title: 'Introduction to Algebra',
          description: 'Basic algebraic concepts and operations',
          type: 'note',
          subject: 'Mathematics',
          subject_id: 1,
          file_path: '/uploads/notes/algebra_intro.pdf',
          file_size: 2048000,
          created_by: 'John Kamau',
          created_at: '2024-12-01',
          views: 45,
        },
        {
          id: 2,
          title: 'Photosynthesis Explained',
          description: 'Complete process of photosynthesis',
          type: 'video',
          subject: 'Biology',
          subject_id: 2,
          file_url: 'https://youtube.com/watch?v=example',
          created_by: 'Sarah Nakato',
          created_at: '2024-11-28',
          views: 67,
        },
        {
          id: 3,
          title: 'Week 5 Math Assignment',
          description: 'Quadratic equations practice',
          type: 'assignment',
          subject: 'Mathematics',
          subject_id: 1,
          file_path: '/uploads/assignments/week5_math.pdf',
          file_size: 512000,
          created_by: 'John Kamau',
          created_at: '2024-11-25',
          views: 89,
        },
        {
          id: 4,
          title: 'Newton\'s Laws of Motion',
          description: 'Comprehensive notes on classical mechanics',
          type: 'note',
          subject: 'Physics',
          subject_id: 3,
          file_path: '/uploads/notes/newtons_laws.pdf',
          file_size: 1536000,
          created_by: 'Michael Ochieng',
          created_at: '2024-11-20',
          views: 53,
        },
      ];

      setContent(mockContent);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setLoading(false);
    }
  };

  const filterContentList = () => {
    let filtered = [...content];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Subject filter
    if (filterSubject !== 'all') {
      filtered = filtered.filter(item => item.subject === filterSubject);
    }

    setFilteredContent(filtered);
  };

  const getContentIcon = (type) => {
    switch (type) {
      case 'video':
        return Video;
      case 'assignment':
        return ClipboardList;
      default:
        return FileText;
    }
  };

  const getContentColor = (type) => {
    switch (type) {
      case 'video':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'assignment':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      default:
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDelete = async (contentId) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/v1/content/${contentId}`, {
      //   method: 'DELETE',
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      setContent(content.filter(item => item.id !== contentId));
      setShowDeleteModal(false);
      setSelectedContent(null);
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const uniqueSubjects = ['all', ...new Set(content.map(item => item.subject))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Content Management
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage notes, videos, and assignments
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => navigate('/teacher/content/create')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Content
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
              >
                <option value="all">All Types</option>
                <option value="note">Notes</option>
                <option value="video">Videos</option>
                <option value="assignment">Assignments</option>
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Content</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{content.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Notes</p>
            <p className="text-2xl font-bold text-blue-600">{content.filter(c => c.type === 'note').length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Videos</p>
            <p className="text-2xl font-bold text-red-600">{content.filter(c => c.type === 'video').length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Assignments</p>
            <p className="text-2xl font-bold text-orange-600">{content.filter(c => c.type === 'assignment').length}</p>
          </div>
        </div>

        {/* Content List */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No content found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating new content
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/teacher/content/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Content
                </button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContent.map((item) => {
                const Icon = getContentIcon(item.type);
                return (
                  <li key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 min-w-0">
                          {/* Icon */}
                          <div className={`flex-shrink-0 ${getContentColor(item.type)} rounded-lg p-3`}>
                            <Icon className="h-6 w-6" />
                          </div>

                          {/* Details */}
                          <div className="ml-4 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {item.description}
                            </p>
                            <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                              <span>{item.subject}</span>
                              <span>•</span>
                              <span>{item.created_at}</span>
                              <span>•</span>
                              <span>{item.views} views</span>
                              {item.file_size && (
                                <>
                                  <span>•</span>
                                  <span>{formatFileSize(item.file_size)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="ml-4 flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/content/${item.id}`)}
                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                            title="View"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/teacher/content/edit/${item.id}`)}
                            className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedContent(item);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Delete Content
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{selectedContent.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedContent(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedContent.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;