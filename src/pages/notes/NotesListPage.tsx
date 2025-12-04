// src/pages/notes/NotesListPage.tsx
import { useState } from 'react';
import { useNotes } from '../../hooks/notes/useNotes';
import { NoteCard } from './NotesCard';

export default function NotesListPage() {
  const [search, setSearch] = useState('');
  const [curriculum, setCurriculum] = useState('');

  const { data: notes = [], isLoading } = useNotes({ search, curriculum });

  if (isLoading) return <div className="p-6 text-center text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50/70 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Search + Filter Section */}
        <div className="bg-white shadow-card rounded-card p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Browse Notes</h2>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Search bar */}
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-3 rounded-full border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-primary-400 focus:outline-none transition"
            />

            {/* Curriculum Filter */}
            <select
              value={curriculum}
              onChange={(e) => setCurriculum(e.target.value)}
              className="p-3 rounded-full border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-primary-400 focus:outline-none transition"
            >
              <option value="">All Curricula</option>
              <option value="O-Level">O-Level</option>
              <option value="A-Level">A-Level</option>
              <option value="University">University</option>
            </select>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </div>
    </div>
  );
}
