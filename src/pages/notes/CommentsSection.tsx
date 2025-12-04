

// src/pages/notes/CommentsSection.tsx
import { useState } from 'react';
import type { Comment } from '../../types/notes';

export interface CommentsSectionProps {
  noteId: number;
  comments?: Comment[]; // 👈 make it optional
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

  // Safe fallback: if comments is undefined, treat as empty array
  const commentList = Array.isArray(comments) ? comments : [];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Comments ({commentList.length})</h2>
      
      <div className="flex gap-2 mb-6">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-card text-white px-4 rounded"
        >
          Post
        </button>
      </div>

      <div className="space-y-4">
        {commentList.map((comment) => (
          <div key={comment.id} className="p-3 border rounded bg-gray-50">
            <p>{comment.content}</p>
            <button
              onClick={() => onDelete(noteId, comment.id)}
              className="text-red-500 text-sm mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}