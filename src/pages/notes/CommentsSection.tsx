// src/pages/notes/CommentsSection.tsx
import { useState } from 'react';
import type { Comment } from '../../types/notes';

export interface CommentsSectionProps {
  noteId: number;
  comments?: Comment[];
  onAdd: (noteId: number, content: string) => Promise<Comment>;
  onDelete: (noteId: number, commentId: number) => Promise<boolean>; 
}

export function CommentsSection({ noteId, comments = [], onAdd, onDelete }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newComment.trim()) return;
    setIsAdding(true);
    try {
      await onAdd(noteId, newComment);
      setNewComment('');
    } finally {
      setIsAdding(false);
    }
  };

  const commentList = Array.isArray(comments) ? comments : [];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-yellow-300 animate-slideUp">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
          💬
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-yellow-600">
          Comments ({commentList.length})
        </h2>
      </div>

      {/* Input + Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts or ask a question..."
          className="flex-1 p-4 border-3 border-yellow-300 rounded-2xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 font-medium text-base placeholder-gray-400 bg-white"
        />
        <button
          onClick={handleAdd}
          disabled={isAdding || !newComment.trim()}
          className={`px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base ${
            isAdding || !newComment.trim()
              ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white'
          }`}
        >
          {isAdding ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              Posting...
            </span>
          ) : (
            '✉️ Post'
          )}
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {commentList.length === 0 ? (
          <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-3 border-gray-200">
            <div className="text-4xl mb-2">💭</div>
            <p className="text-gray-600 font-medium">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          commentList.map((comment) => (
            <div
              key={comment.id}
              className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-md border-3 border-purple-200 hover:border-purple-300 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-gray-800 text-base leading-relaxed font-medium flex-1">{comment.content}</p>
                <button
                  onClick={() => onDelete(noteId, comment.id)}
                  className="flex-shrink-0 px-4 py-2 bg-white border-2 border-red-300 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-50 hover:border-red-400 transition-all duration-300"
                >
                  🗑️ Delete
                </button>
              </div>
              <div className="mt-3 text-xs text-gray-500 font-medium flex items-center gap-2">
                <span>📅 {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
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
      `}</style>
    </div>
  );
}
