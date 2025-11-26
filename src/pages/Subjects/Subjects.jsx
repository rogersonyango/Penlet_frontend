import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { mockSubjects } from '../../services/mockData';
import toast from 'react-hot-toast';

const Subjects = () => {
  const [subjects, setSubjects] = useState(mockSubjects);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', color: '#6366f1' });

  const handleAdd = () => {
    if (!formData.name) {
      toast.error('Please enter subject name');
      return;
    }
    toast.success('Subject added');
    setShowModal(false);
    setFormData({ name: '', color: '#6366f1' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Subjects</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Subject</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subject => (
          <div key={subject.id} className="card flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: subject.color }}>
                <span className="text-xl font-bold">{subject.name[0]}</span>
              </div>
              <h3 className="font-semibold text-lg">{subject.name}</h3>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg"><Edit2 size={18} /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-red-600"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Subject</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Subject name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input"
              />
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                className="input"
              />
              <div className="flex gap-2">
                <button onClick={handleAdd} className="btn btn-primary flex-1">Add</button>
                <button onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;