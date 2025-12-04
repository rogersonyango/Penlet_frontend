// src/pages/notes/CreateNotePage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../../services/notes/noteServices';



export default function CreateNotePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [curriculum, setCurriculum] = useState('O-Level');
  const [file, setFile] = useState<File | undefined>(); // 👈 undefined, not null
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createNote({ title, content, curriculum }, file);
    navigate('/notes');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Note</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-3 border rounded-lg"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          rows={10}
          className="w-full p-3 border rounded-lg"
          required
        />
        <select
          value={curriculum}
          onChange={(e) => setCurriculum(e.target.value)}
          className="w-full p-3 border rounded-lg"
        >
          <option value="O-Level">O-Level</option>
          <option value="A-Level">A-Level</option>
          <option value="University">University</option>
        </select>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files?.[0])} // 👈 returns File | undefined
        />
        <button
          type="submit"
          className="w-full bg-primary-500 text-white py-3 rounded-button font-semibold"
        >
          Create Note
        </button>
      </form>
    </div>
  );
}