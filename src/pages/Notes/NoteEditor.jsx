import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { mockNotes, mockSubjects } from '../../services/mockData';

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subjectId: '',
    tags: [],
  });

  useEffect(() => {
    if (isEdit) {
      const note = mockNotes.find(n => n.id === id);
      if (note) setFormData(note);
    }
  }, [id, isEdit]);

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success(isEdit ? 'Note updated!' : 'Note created!');
    navigate('/notes');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      toast.success('Note deleted');
      navigate('/notes');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/notes')} className="btn btn-secondary flex items-center space-x-2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <div className="flex gap-2">
          {isEdit && (
            <button onClick={handleDelete} className="btn bg-red-600 text-white hover:bg-red-700">
              <Trash2 size={20} />
            </button>
          )}
          <button onClick={handleSave} className="btn btn-primary flex items-center space-x-2">
            <Save size={20} />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="card space-y-4">
        <input
          type="text"
          placeholder="Note title..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="text-3xl font-bold border-none outline-none w-full"
        />
        
        <select
          value={formData.subjectId}
          onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
          className="input max-w-xs"
        >
          <option value="">Select Subject</option>
          {mockSubjects.map(subject => (
            <option key={subject.id} value={subject.id}>{subject.name}</option>
          ))}
        </select>

        <textarea
          placeholder="Start writing your note..."
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full min-h-96 border-none outline-none resize-none"
        />
      </div>
    </div>
  );
};

export default NoteEditor;