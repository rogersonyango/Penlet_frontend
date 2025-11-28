import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star, X } from 'lucide-react';
import { 
  createSubject, 
  getSubjects, 
  updateSubject, 
  deleteSubject,
  toggleFavorite 
} from '../../services/subjectsApi';
import toast from 'react-hot-toast';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    color: '#6366f1',
    icon: 'BookOpen',
    grade_level: '',
    term: '',
    teacher_name: ''
  });

  // Fetch subjects on mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await getSubjects({ 
        search: searchQuery,
        page_size: 100 
      });
      setSubjects(response.subjects);
    } catch (error) {
      toast.error('Failed to load subjects');
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.code) {
      toast.error('Please enter subject name and code');
      return;
    }

    try {
      if (editingSubject) {
        // Update existing subject
        await updateSubject(editingSubject.id, formData);
        toast.success('Subject updated successfully');
      } else {
        // Create new subject
        await createSubject(formData);
        toast.success('Subject added successfully');
      }
      
      setShowModal(false);
      setEditingSubject(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        color: '#6366f1',
        icon: 'BookOpen',
        grade_level: '',
        term: '',
        teacher_name: ''
      });
      fetchSubjects();
    } catch (error) {
      toast.error(error.message || 'Failed to save subject');
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description || '',
      color: subject.color,
      icon: subject.icon || 'BookOpen',
      grade_level: subject.grade_level || '',
      term: subject.term || '',
      teacher_name: subject.teacher_name || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (subjectId) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) {
      return;
    }

    try {
      await deleteSubject(subjectId);
      toast.success('Subject deleted successfully');
      fetchSubjects();
    } catch (error) {
      toast.error('Failed to delete subject');
      console.error('Error deleting subject:', error);
    }
  };

  const handleToggleFavorite = async (subjectId, e) => {
    e.stopPropagation();
    try {
      await toggleFavorite(subjectId);
      fetchSubjects();
    } catch (error) {
      toast.error('Failed to update favorite');
      console.error('Error toggling favorite:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSubject(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      color: '#6366f1',
      icon: 'BookOpen',
      grade_level: '',
      term: '',
      teacher_name: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Subjects</h1>
        <button 
          onClick={() => setShowModal(true)} 
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && fetchSubjects()}
          className="input pl-10"
        />
        <button
          onClick={fetchSubjects}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-700"
        >
          Search
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No subjects found. Create your first subject!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(subject => (
            <div key={subject.id} className="card flex items-center justify-between relative group">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0" 
                  style={{ backgroundColor: subject.color }}
                >
                  <span className="text-xl font-bold">{subject.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg truncate">{subject.name}</h3>
                    <button
                      onClick={(e) => handleToggleFavorite(subject.id, e)}
                      className="flex-shrink-0 text-gray-400 hover:text-yellow-500 transition-colors"
                    >
                      <Star 
                        size={16} 
                        className={subject.is_favorite ? 'fill-yellow-500 text-yellow-500' : ''}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">{subject.code}</p>
                  {subject.teacher_name && (
                    <p className="text-xs text-gray-400">{subject.teacher_name}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(subject)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(subject.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h2>
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
                  Subject Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Mathematics"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Code *
                </label>
                <input
                  type="text"
                  name="code"
                  placeholder="e.g., MATH101"
                  value={formData.code}
                  onChange={handleFormChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Subject description..."
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  className="input resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade Level
                  </label>
                  <input
                    type="text"
                    name="grade_level"
                    placeholder="e.g., S4"
                    value={formData.grade_level}
                    onChange={handleFormChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Term
                  </label>
                  <input
                    type="text"
                    name="term"
                    placeholder="e.g., Term 1"
                    value={formData.term}
                    onChange={handleFormChange}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher Name
                </label>
                <input
                  type="text"
                  name="teacher_name"
                  placeholder="Teacher's name"
                  value={formData.teacher_name}
                  onChange={handleFormChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleFormChange}
                    className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleFormChange}
                    className="input flex-1"
                    placeholder="#6366f1"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleAdd} 
                  className="btn btn-primary flex-1"
                >
                  {editingSubject ? 'Update' : 'Add'}
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

export default Subjects;