// src/pages/notes/NotesListPage.tsx
import { useState } from 'react';
// import { useNotes } from '@/hooks/notes/useNotes';

// import { NoteCard } from './NoteCard';
import { useNotes } from '../../hooks/notes/useNotes';
import { NoteCard } from './NotesCard';

export default function NotesListPage() {
  const [search, setSearch] = useState('');
  const [curriculum, setCurriculum] = useState('');

  const { data: notes = [], isLoading } = useNotes({ search, curriculum });

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 rounded-full border border-gray-300"
        />
        <select
          value={curriculum}
          onChange={(e) => setCurriculum(e.target.value)}
          className="p-3 rounded-full border border-gray-300"
        >
          <option value="">All Curricula</option>
          <option value="O-Level">O-Level</option>
          <option value="A-Level">A-Level</option>
          <option value="University">University</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}