// src/pages/notes/NoteCard.tsx
import { Note } from '../../types/notes';
import { Link } from 'react-router-dom';

export interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link to={`/notes/${note.id}`} className="block group">
      <div
        className="
          relative p-5 rounded-card shadow-card overflow-hidden
          transition-all duration-300 ease-out
          group-hover:shadow-float group-hover:scale-[1.02]
        "
      >
        {/* Background gradient */}
        <div
          className="
            absolute inset-0 bg-gradient-primary opacity-40
            group-hover:opacity-50 transition-opacity duration-300
          "
        />

        {/* Soft white overlay for readability */}
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>

        {/* Foreground content */}
        <div className="relative z-10">

          {/* Title */}
          <h3
            className="
              font-bold text-xl mb-2 line-clamp-1
              bg-gradient-pink-purple text-transparent bg-clip-text
            "
          >
            {note.title}
          </h3>

          {/* Content Preview */}
          <p className="text-text-secondary text-sm line-clamp-3 leading-relaxed">
            {note.content}
          </p>

          {/* Footer Section */}
          <div className="mt-4 flex justify-between items-center">

            {/* Curriculum Badge */}
            <span
              className="
                bg-yellow-light text-yellow-dark 
                text-xs px-3 py-1 rounded-badge font-medium
              "
            >
              {note.curriculum}
            </span>

            {/* Views */}
            <span className="text-text-secondary text-sm flex items-center gap-1">
              <span className="text-icon-purple">👁️</span>
              {note.view_count}
            </span>

          </div>
        </div>
      </div>
    </Link>
  );
}
