// src/pages/DeckCreatePage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { flashcardApi } from '../../services/flashcardApi';
import { TeacherAdminGuard } from '../../utils/withRoleGuard';
import { DeckCreate } from '../../types/flashcard';
// import { DeckCreate } from '../types/flashcard';
// import { flashcardApi } from '../services/flashcardApi';
// import { TeacherAdminGuard } from '../utils/withRoleGuard';

export default function DeckCreatePage() {
  const [formData, setFormData] = useState<DeckCreate>({
    title: '',
    subject: '',
    level: '',
    is_public: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await flashcardApi.createDeck(formData);
      navigate('/');
    } catch (err) {
      // Error handled by interceptor → no need to re-toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherAdminGuard>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Deck</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Title *</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="e.g., Medical Terminology"
            />
          </div>

          <div>
            <label className="block mb-1">Subject</label>
            <input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Level</label>
            <select
              name="level"
              value={formData.level || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Make public</label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Deck'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </TeacherAdminGuard>
  );
}