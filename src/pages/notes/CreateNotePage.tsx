// src/pages/notes/CreateNotePage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../../services/notes/noteServices';

export default function CreateNotePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [curriculum, setCurriculum] = useState('O-Level');
  const [file, setFile] = useState<File | undefined>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createNote({ title, content, curriculum }, file);
    navigate('/notes');
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-text-primary mb-8 
                     bg-gradient-primary text-transparent bg-clip-text">
        Create New Note
      </h1>

      {/* Card Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-card rounded-card p-8 space-y-6 border border-pink-light"
      >
        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-4 rounded-card border border-purple-light bg-white
                     focus:outline-none focus:ring-2 focus:ring-primary-400 
                     shadow-sm text-text-secondary"
          required
        />

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note content..."
          rows={12}
          className="w-full p-4 rounded-card border border-purple-light bg-white
                     focus:outline-none focus:ring-2 focus:ring-primary-400 
                     shadow-sm text-text-secondary"
          required
        />

        {/* Curriculum */}
        <select
          value={curriculum}
          onChange={(e) => setCurriculum(e.target.value)}
          className="w-full p-4 rounded-card border border-purple-light bg-white
                     focus:outline-none focus:ring-2 focus:ring-primary-400 
                     shadow-sm text-text-secondary"
        >
          <option value="O-Level">O-Level</option>
          <option value="A-Level">A-Level</option>
          <option value="University">University</option>
        </select>

        {/* File Upload */}
        <div>
          <label className="block mb-2 text-text-secondary font-medium">Attach File (optional)</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0])}
            className="w-full rounded-card border border-pink-light bg-white p-3 
                       focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-sm"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 transition-all 
                     text-white py-4 rounded-button font-semibold shadow-button"
        >
          Create Note
        </button>
      </form>
    </div>
  );
}
