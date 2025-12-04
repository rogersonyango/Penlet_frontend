// src/pages/notes/NoteDetailPage.tsx
import { useParams } from 'react-router-dom';
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

  if (isLoading) return <div className="p-6 text-text-secondary">Loading...</div>;
  if (!note) return <div className="p-6 text-red-500">Note not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-primary text-transparent bg-clip-text">
          {note.title}
        </h1>

        <p className="text-sm text-text-secondary mt-1">
          Curriculum: <span className="font-medium">{note.curriculum}</span> • Views:{' '}
          <span className="font-medium">{note.view_count}</span>
        </p>
      </div>

      {/* Content Card */}
      <div className="bg-white p-6 rounded-card shadow-card border border-pink-light mb-10">
        <div
          className="prose max-w-none text-text-primary"
          dangerouslySetInnerHTML={{
            __html: note.content.replace(/\n/g, '<br>')
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-12">
        <button
          onClick={() => toggleLike(noteId)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 
                     rounded-button shadow-button font-semibold transition-all"
        >
          ❤️ Like
        </button>

        <button
          onClick={() => toggleFavorite(noteId)}
          className="border border-primary-500 text-primary-600 hover:bg-primary-50 
                     px-6 py-3 rounded-button font-semibold transition-all"
        >
          ⭐ Favorite
        </button>

        <button
          onClick={() => downloadNote(noteId)}
          className="bg-blue-card hover:bg-blue-dark text-white px-6 py-3 
                     rounded-button shadow-button font-semibold transition-all"
        >
          ⬇️ Download PDF
        </button>
      </div>

      {/* Comments */}
      <CommentsSection
        noteId={noteId}
        comments={comments}
        onAdd={addComment}
        onDelete={deleteComment}
      />
    </div>
  );
}
