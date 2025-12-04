// src/pages/notes/NoteDetailPage.tsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { addComment, deleteComment, downloadNote, getComments, getNote, toggleFavorite, toggleLike } from '../../services/notes/noteServices';
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

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!note) return <div>Note not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">{note.title}</h1>
        <p className="text-sm text-gray-500">
          Curriculum: {note.curriculum} • Views: {note.view_count}
        </p>
      </div>

      <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: note.content.replace(/\n/g, '<br>') }} />

      <div className="flex gap-3 mb-8">
        <button
          onClick={() => toggleLike(noteId)}
          className="bg-primary-500 text-white px-4 py-2 rounded-button"
        >
          Like
        </button>
        <button
          onClick={() => toggleFavorite(noteId)}
          className="border border-primary-500 text-primary-500 px-4 py-2 rounded-button"
        >
          Favorite
        </button>
        <button
          onClick={() => downloadNote(noteId)}
          className="bg-blue-card text-white px-4 py-2 rounded-button"
        >
          Download PDF
        </button>
      </div>

      <CommentsSection noteId={noteId} comments={comments} onAdd={addComment} onDelete={deleteComment} />
    </div>
  );
}