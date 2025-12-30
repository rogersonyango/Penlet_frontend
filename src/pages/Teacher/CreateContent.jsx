import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Video, BookOpen, X, AlertCircle, School } from 'lucide-react';
import { contentAPI, subjectsAPI } from '../../services/apiService';
import { useAppStore } from '../../store/appStore';

// Available class levels
const CLASS_LEVELS = [
  { id: 'S1', name: 'Senior 1' },
  { id: 'S2', name: 'Senior 2' },
  { id: 'S3', name: 'Senior 3' },
  { id: 'S4', name: 'Senior 4' },
  { id: 'S5', name: 'Senior 5' },
  { id: 'S6', name: 'Senior 6' },
];

export default function CreateContent() {
  const navigate = useNavigate();
  const { theme } = useAppStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'note',
    class_level: '',
    subject_id: '',
    video_url: '',
  });
  const [file, setFile] = useState(null);
  const [allSubjects, setAllSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Filter subjects when class level changes
  useEffect(() => {
    if (formData.class_level) {
      const filtered = allSubjects.filter(s => s.class_level === formData.class_level);
      setFilteredSubjects(filtered);
      // Reset subject selection if current selection is not in filtered list
      if (formData.subject_id && !filtered.find(s => s.id === formData.subject_id)) {
        setFormData(prev => ({ ...prev, subject_id: '' }));
      }
    } else {
      setFilteredSubjects([]);
    }
  }, [formData.class_level, allSubjects]);

  const fetchSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const data = await subjectsAPI.getActive();
      setAllSubjects(data || []);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      // Use empty array on error
      setAllSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (100MB max)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError('File size must be less than 100MB');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title || !formData.class_level || !formData.subject_id) {
      setError('Please fill in all required fields (title, class, and subject)');
      return;
    }

    if (formData.type !== 'video' && !file) {
      setError('Please upload a file');
      return;
    }

    if (formData.type === 'video' && !formData.video_url && !file) {
      setError('Please provide either a video URL or upload a video file');
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('type', formData.type);
      submitData.append('class_level', formData.class_level);
      submitData.append('subject_id', formData.subject_id);
      
      if (formData.video_url) {
        submitData.append('video_url', formData.video_url);
      }
      
      if (file) {
        submitData.append('file', file);
      }

      setUploadProgress(50);

      // Submit to API
      const response = await contentAPI.create(submitData);

      setUploadProgress(100);

      console.log('Content created successfully:', response);

      // Navigate back to content list
      setTimeout(() => {
        navigate('/teacher/content');
      }, 500);

    } catch (err) {
      console.error('Error creating content:', err);
      setError(err.message || 'Failed to create content. Please try again.');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'note':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'assignment':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Content</h1>
        <p className="text-gray-600">Upload notes, videos, or assignments for your students</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Content Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Content Type *
          </label>
          <div className="grid grid-cols-3 gap-4">
            {['note', 'video', 'assignment'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type }))}
                className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  formData.type === type
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {getTypeIcon(type)}
                <span className="ml-2 font-medium capitalize">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., Introduction to Algebra"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Describe what students will learn..."
          />
        </div>

        {/* Class Level Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <School size={18} className="text-gray-500" />
              Target Class *
            </div>
          </label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {CLASS_LEVELS.map((cls) => (
              <button
                key={cls.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, class_level: cls.id }))}
                className={`p-3 rounded-lg border-2 transition-all text-center font-medium ${
                  formData.class_level === cls.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                {cls.id}
              </button>
            ))}
          </div>
          {formData.class_level && (
            <p className="mt-2 text-sm text-gray-500">
              Content will be visible to {CLASS_LEVELS.find(c => c.id === formData.class_level)?.name} students
            </p>
          )}
        </div>

        {/* Subject Selection */}
        <div>
          <label htmlFor="subject_id" className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          {!formData.class_level ? (
            <div className="text-amber-600 text-sm bg-amber-50 p-3 rounded-lg">
              Please select a class first to see available subjects
            </div>
          ) : loadingSubjects ? (
            <div className="text-gray-500 text-sm">Loading subjects...</div>
          ) : filteredSubjects.length === 0 ? (
            <div className="text-gray-500 text-sm bg-gray-50 p-3 rounded-lg">
              No subjects found for {formData.class_level}. Please contact an administrator to add subjects.
            </div>
          ) : (
            <select
              id="subject_id"
              name="subject_id"
              value={formData.subject_id}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="">Select a subject</option>
              {filteredSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Video URL (only for video type) */}
        {formData.type === 'video' && (
          <div>
            <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-2">
              Video URL (YouTube, Vimeo, etc.)
            </label>
            <input
              type="url"
              id="video_url"
              name="video_url"
              value={formData.video_url}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://youtube.com/watch?v=..."
            />
            <p className="mt-1 text-sm text-gray-500">Or upload a video file below</p>
          </div>
        )}

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formData.type === 'video' ? 'Upload Video File (Optional)' : 'Upload File *'}
          </label>
          
          {!file ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Click to upload
                </span>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept={formData.type === 'note' ? '.pdf,.docx,.doc' : formData.type === 'video' ? '.mp4,.avi,.mov' : '*'}
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">
                {formData.type === 'note' && 'PDF, DOCX (max 100MB)'}
                {formData.type === 'video' && 'MP4, AVI, MOV (max 100MB)'}
                {formData.type === 'assignment' && 'Any file type (max 100MB)'}
              </p>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {loading && uploadProgress > 0 && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/teacher/content')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Content'
            )}
          </button>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your content will be submitted for admin approval before it becomes visible to students.
          </p>
        </div>
      </form>
    </div>
  );
}