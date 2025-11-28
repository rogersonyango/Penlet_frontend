import React, { useState, useEffect } from 'react';
import { Play, Clock, Eye, Plus, Star, Trash2, X, Search } from 'lucide-react';
import { 
  getVideos, 
  createVideo, 
  deleteVideo,
  toggleFavorite
} from '../../services/videosApi';
import { getActiveSubjects } from '../../services/subjectsApi';
import toast from 'react-hot-toast';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    subject_id: '',
    subject_name: '',
    topic: '',
    tags: '',
    duration: 0,
    video_type: 'youtube',
    is_public: false
  });

  // Fetch videos and subjects on mount
  useEffect(() => {
    fetchVideos();
    fetchSubjectsList();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await getVideos({ 
        search: searchQuery,
        subject_id: selectedSubject !== 'all' ? selectedSubject : undefined,
        page_size: 100 
      });
      setVideos(response.videos);
    } catch (error) {
      toast.error('Failed to load videos');
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjectsList = async () => {
    try {
      const subjectsData = await fetchSubjects();
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.video_url) {
      toast.error('Please enter video title and URL');
      return;
    }

    try {
      // Find subject name if subject_id is selected
      if (formData.subject_id && !formData.subject_name) {
        const subject = subjects.find(s => s.id === formData.subject_id);
        formData.subject_name = subject ? subject.name : '';
      }

      await createVideo(formData);
      toast.success('Video added successfully');
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        subject_id: '',
        subject_name: '',
        topic: '',
        tags: '',
        duration: 0,
        video_type: 'youtube',
        is_public: false
      });
      fetchVideos();
    } catch (error) {
      toast.error(error.message || 'Failed to add video');
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      await deleteVideo(videoId);
      toast.success('Video deleted successfully');
      fetchVideos();
    } catch (error) {
      toast.error('Failed to delete video');
      console.error('Error deleting video:', error);
    }
  };

  const handleToggleFavorite = async (videoId, e) => {
    e.stopPropagation();
    try {
      await toggleFavorite(videoId);
      fetchVideos();
    } catch (error) {
      toast.error('Failed to update favorite');
      console.error('Error toggling favorite:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVideoThumbnail = (video) => {
    if (video.thumbnail_url) {
      return video.thumbnail_url;
    }
    
    // Generate YouTube thumbnail from URL
    if (video.video_type === 'youtube' && video.video_url) {
      const videoId = extractYouTubeId(video.video_url);
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }
    
    // Default placeholder
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Crect fill="%23e5e7eb" width="400" height="225"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Thumbnail%3C/text%3E%3C/svg%3E';
  };

  const extractYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const handleVideoClick = (video) => {
    // Open video in new tab
    window.open(video.video_url, '_blank');
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      title: '',
      description: '',
      video_url: '',
      thumbnail_url: '',
      subject_id: '',
      subject_name: '',
      topic: '',
      tags: '',
      duration: 0,
      video_type: 'youtube',
      is_public: false
    });
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || video.subject_id === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Video Library</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Video</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="input max-w-xs"
        >
          <option value="all">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject.id} value={subject.id}>{subject.name}</option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <Play size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No videos found. Add your first video!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <div key={video.id} className="card group cursor-pointer hover:shadow-lg transition-shadow relative">
              <div 
                className="relative aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden"
                onClick={() => handleVideoClick(video)}
              >
                <img 
                  src={getVideoThumbnail(video)} 
                  alt={video.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <Play size={24} className="text-primary-600 ml-1" />
                  </div>
                </div>
                
                {/* Favorite Star */}
                <button
                  onClick={(e) => handleToggleFavorite(video.id, e)}
                  className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all z-10"
                >
                  <Star 
                    size={18} 
                    className={video.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-white'}
                  />
                </button>
              </div>

              <h3 className="font-semibold mb-2">{video.title}</h3>
              
              {video.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{formatDuration(video.duration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span>{video.view_count}</span>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(video.id);
                }}
                className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Video Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Add New Video</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Introduction to Calculus"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL * (YouTube, Vimeo, or direct link)
                </label>
                <input
                  type="url"
                  name="video_url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.video_url}
                  onChange={handleFormChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail URL (optional)
                </label>
                <input
                  type="url"
                  name="thumbnail_url"
                  placeholder="https://..."
                  value={formData.thumbnail_url}
                  onChange={handleFormChange}
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to auto-generate from YouTube
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Video description..."
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  className="input resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    name="subject_id"
                    value={formData.subject_id}
                    onChange={handleFormChange}
                    className="input"
                  >
                    <option value="">Select subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    placeholder="e.g., 300"
                    value={formData.duration}
                    onChange={handleFormChange}
                    className="input"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  name="topic"
                  placeholder="e.g., Derivatives"
                  value={formData.topic}
                  onChange={handleFormChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="calculus, math, derivatives"
                  value={formData.tags}
                  onChange={handleFormChange}
                  className="input"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_public"
                  id="is_public"
                  checked={formData.is_public}
                  onChange={handleFormChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_public" className="text-sm text-gray-700">
                  Make this video public
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleCreate} 
                  className="btn btn-primary flex-1"
                >
                  Add Video
                </button>
                <button 
                  onClick={closeModal} 
                  className="btn border border-gray-300 flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;