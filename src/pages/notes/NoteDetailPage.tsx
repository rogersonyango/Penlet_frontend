// src/pages/notes/NoteDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  addComment,
  deleteComment,
  downloadNote,
  getComments,
  getNote,
  toggleFavorite,
  toggleLike
} from '../../services/notes/noteServices';

import { CommentsSection } from './CommentsSection';

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const noteId = Number(id);

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => getNote(noteId),
    enabled: !!noteId,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', noteId],
    queryFn: () => getComments(noteId),
    enabled: !!noteId,
  });

  // Curriculum colors
    const curriculumColors = {
      'O-Level': {
        badge: 'from-purple-400 to-purple-600',
        border: 'border-purple-400',
        bg: 'from-purple-50 to-purple-100',
        emoji: '📘'
      },
      'A-Level': {
        badge: 'from-green-400 to-green-600',
        border: 'border-green-400',
        bg: 'from-green-50 to-green-100',
        emoji: '📗'
      },
      'University': {
        badge: 'from-cyan-400 to-cyan-600',
        border: 'border-cyan-400',
        bg: 'from-cyan-50 to-cyan-100',
        emoji: '🎓'
      },
      'default': {
        badge: 'from-pink-400 to-pink-600',
        border: 'border-pink-400',
        bg: 'from-pink-50 to-pink-100',
        emoji: '📝'
      }
    } as const;
  
    type CurriculumKey = keyof typeof curriculumColors;
  
    const colorScheme = note
      ? (curriculumColors[(note.curriculum as CurriculumKey)] || curriculumColors.default)
      : curriculumColors.default;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-purple-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Loading note...
          </p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-red-400 max-w-md">
          <div className="text-6xl mb-4 text-center">❌</div>
          <p className="text-xl font-bold text-red-600 text-center mb-4">Note not found</p>
          <button
            onClick={() => navigate('/notes')}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            ← Back to Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/notes')}
          className="mb-6 px-6 py-3 bg-white border-3 border-purple-300 text-purple-700 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-sm sm:text-base hover:border-purple-400 animate-slideDown"
        >
          ← Back to Notes
        </button>

        {/* Header Section */}
        <div className={`bg-gradient-to-br ${colorScheme.bg} p-6 sm:p-8 rounded-3xl shadow-xl border-4 ${colorScheme.border} mb-8 animate-slideDown`} style={{ animationDelay: '100ms' }}>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            {/* Curriculum Badge */}
            <span
              className={`
                inline-flex items-center gap-2
                bg-gradient-to-r ${colorScheme.badge}
                text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg
              `}
            >
              <span className="text-xl">{colorScheme.emoji}</span>
              {note.curriculum}
            </span>

            {/* Stats Badges */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-bold text-gray-700 shadow-md">
                <span className="text-lg">👁️</span>
                {note.view_count || 0} views
              </span>
              {note.like_count !== undefined && (
                <span className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-bold text-gray-700 shadow-md">
                  <span className="text-lg">❤️</span>
                  {note.like_count} likes
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800 mb-3 leading-tight">
            {note.title}
          </h1>

          {/* Subject */}
          {note.subject && (
            <p className="text-base sm:text-lg text-gray-700 font-bold flex items-center gap-2">
              <span className="text-xl">📖</span>
              {note.subject}
            </p>
          )}
        </div>

        {/* Content Card */}
        <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-xl border-4 border-pink-300 mb-8 animate-slideUp" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
              📄
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-pink-600">
              Note Content
            </h2>
          </div>

          <div
            className="prose max-w-none text-gray-800 text-base sm:text-lg leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: note.content.replace(/\n/g, '<br>')
            }}
            style={{
              fontFamily: 'inherit',
              lineHeight: '1.8'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-cyan-300 mb-8 animate-slideUp" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
              ⚡
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-cyan-600">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => toggleLike(noteId)}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl font-bold text-base sm:text-lg transform hover:scale-105 transition-all duration-300"
            >
              <span className="text-2xl">❤️</span>
              Like Note
            </button>

            <button
              onClick={() => toggleFavorite(noteId)}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl font-bold text-base sm:text-lg transform hover:scale-105 transition-all duration-300"
            >
              <span className="text-2xl">⭐</span>
              Favorite
            </button>

            <button
              onClick={() => downloadNote(noteId)}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl font-bold text-base sm:text-lg transform hover:scale-105 transition-all duration-300"
            >
              <span className="text-2xl">⬇️</span>
              Download
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="animate-slideUp" style={{ animationDelay: '400ms' }}>
          <CommentsSection
            noteId={noteId}
            comments={comments}
            onAdd={addComment}
            onDelete={deleteComment}
          />
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .border-3 {
          border-width: 3px;
        }

        /* Enhanced prose styling */
        .prose p {
          margin-bottom: 1em;
        }

        .prose strong {
          font-weight: 700;
          color: #1f2937;
        }

        .prose em {
          font-style: italic;
        }

        .prose ul, .prose ol {
          margin: 1em 0;
          padding-left: 2em;
        }

        .prose li {
          margin: 0.5em 0;
        }
      `}</style>
    </div>
  );
}