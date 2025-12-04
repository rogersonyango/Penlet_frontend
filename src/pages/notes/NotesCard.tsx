// src/pages/notes/NoteCard.tsx
import { Note } from '../../types/notes';
import { Link } from 'react-router-dom';

export interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link to={`/notes/${note.id}`} className="block">
      <div className="bg-white rounded-card p-5 shadow-card hover:shadow-float transition-all duration-300">
        <h3 className="font-bold text-lg text-text-primary mb-2 line-clamp-1">
          {note.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3">{note.content}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="bg-yellow-light text-yellow-dark text-xs px-2 py-1 rounded-badge">
            {note.curriculum}
          </span>
          <span className="text-gray-500 text-sm flex items-center">
            👁️ {note.view_count}
          </span>
        </div>
      </div>
    </Link>
  );
}