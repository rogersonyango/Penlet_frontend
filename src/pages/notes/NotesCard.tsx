// src/pages/notes/NoteCard.tsx
import { Note } from '../../types/notes';
import { Link } from 'react-router-dom';

export interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  // Color schemes for different curricula
  const curriculumColors = {
    'O-Level': {
      badge: 'from-purple-400 to-purple-600',
      border: 'border-purple-400',
      bg: 'from-purple-50 to-purple-100',
      text: 'text-purple-700',
      emoji: '📘'
    },
    'A-Level': {
      badge: 'from-green-400 to-green-600',
      border: 'border-green-400',
      bg: 'from-green-50 to-green-100',
      text: 'text-green-700',
      emoji: '📗'
    },
    'University': {
      badge: 'from-cyan-400 to-cyan-600',
      border: 'border-cyan-400',
      bg: 'from-cyan-50 to-cyan-100',
      text: 'text-cyan-700',
      emoji: '🎓'
    },
    'default': {
      badge: 'from-pink-400 to-pink-600',
      border: 'border-pink-400',
      bg: 'from-pink-50 to-pink-100',
      text: 'text-pink-700',
      emoji: '📝'
    }
  };

  const colorScheme = curriculumColors[note.curriculum] || curriculumColors.default;

  return (
    <Link to={`/notes/${note.id}`} className="block group">
      <div
        className={`
          relative p-6 rounded-3xl overflow-hidden
          bg-gradient-to-br ${colorScheme.bg}
          border-4 ${colorScheme.border}
          shadow-lg
          transition-all duration-300 ease-out
          group-hover:shadow-2xl group-hover:scale-105 group-hover:-rotate-1
        `}
      >
        {/* Decorative Corner Element */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-20 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Curriculum Badge */}
          <div className="flex items-center justify-between mb-3">
            <span
              className={`
                inline-flex items-center gap-2
                bg-gradient-to-r ${colorScheme.badge}
                text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-md
              `}
            >
              <span className="text-base">{colorScheme.emoji}</span>
              {note.curriculum}
            </span>

            {/* Views Badge */}
            <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 shadow-md">
              <span className="text-base">👁️</span>
              {note.view_count || 0}
            </span>
          </div>

          {/* Title */}
          <h3
            className={`
              font-black text-xl sm:text-2xl mb-3 line-clamp-2
              ${colorScheme.text}
              group-hover:scale-105 transition-transform duration-300
              leading-tight
            `}
          >
            {note.title}
          </h3>

          {/* Content Preview */}
          <p className="text-gray-700 text-sm sm:text-base line-clamp-3 leading-relaxed mb-4 font-medium">
            {note.content}
          </p>

          {/* Footer Section */}
          <div className="flex items-center justify-between pt-3 border-t-2 border-white/50">
            {/* Subject/Topic */}
            {note.subject && (
              <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                <span className="text-base">📖</span>
                {note.subject}
              </span>
            )}

            {/* Read More Arrow */}
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700 group-hover:gap-3 transition-all duration-300">
              <span>Read More</span>
              <span className="text-base transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </Link>
  );
}