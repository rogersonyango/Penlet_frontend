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

  const handleAdd = async () => {
    if (!newComment.trim()) return;
    await onAdd(noteId, newComment);
    setNewComment('');
  };

  const commentList = Array.isArray(comments) ? comments : [];

  return (
    <div className="mt-10 p-6 bg-gradient-primary rounded-card shadow-card">
      <h2 className="text-heading text-text-primary font-bold mb-6">
        Comments ({commentList.length})
      </h2>

      {/* Input + Button */}
      <div className="flex gap-3 mb-8">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 p-3 rounded-card border border-pink-light focus:outline-none focus:ring-2 
                     focus:ring-primary-400 bg-white shadow-sm"
        />
        <button
          onClick={handleAdd}
          className="px-5 py-3 rounded-button bg-primary-600 text-white font-semibold 
                     shadow-button hover:bg-primary-700 transition-all"
        >
          Post
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {commentList.map((comment) => (
          <div
            key={comment.id}
            className="p-4 bg-white rounded-card shadow-sm border border-purple-light"
          >
            <p className="text-text-secondary">{comment.content}</p>

            <button
              onClick={() => onDelete(noteId, comment.id)}
              className="mt-3 text-primary-600 font-medium text-sm hover:text-primary-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
