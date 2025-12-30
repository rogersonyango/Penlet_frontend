// src/pages/CardManagementPage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Flashcard } from '../../types/flashcard';
import { flashcardApi } from '../../services/flashcardApi';
import { TeacherAdminGuard } from '../../utils/withRoleGuard';

export default function CardManagementPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (deckId) {
      flashcardApi.getCards(Number(deckId)).then(setCards).finally(() => setLoading(false));
    }
  }, [deckId]);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.front.trim() || !newCard.back.trim()) return;
    
    setSubmitting(true);
    try {
      const card = await flashcardApi.addCard(Number(deckId), newCard);
      setCards(prev => [...prev, card]);
      setNewCard({ front: '', back: '' });
    } catch (err) {
      // Handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!confirm('Delete this card?')) return;
    try {
      await flashcardApi.deleteCard(cardId);
      setCards(prev => prev.filter(c => c.id !== cardId));
    } catch (err) {
      // Handled
    }
  };

  if (loading) return <div className="p-6">Loading cards...</div>;

  return (
    <TeacherAdminGuard>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Cards</h1>
          <button
            onClick={() => navigate(`/study/${deckId}`)}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Start Study
          </button>
        </div>

        {/* Add Card Form */}
        <form onSubmit={handleAddCard} className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-bold mb-2">Add New Card</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Front (Question)</label>
              <textarea
                value={newCard.front}
                onChange={e => setNewCard(prev => ({ ...prev, front: e.target.value }))}
                required
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            <div>
              <label>Back (Answer)</label>
              <textarea
                value={newCard.back}
                onChange={e => setNewCard(prev => ({ ...prev, back: e.target.value }))}
                required
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
          >
            {submitting ? 'Adding...' : 'Add Card'}
          </button>
        </form>

        {/* Card List */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg">Existing Cards ({cards.length})</h2>
          {cards.length === 0 ? (
            <p>No cards yet. Add some above!</p>
          ) : (
            cards.map(card => (
              <div key={card.id} className="border p-4 rounded flex justify-between">
                <div>
                  <p className="font-medium">{card.front}</p>
                  <p className="text-gray-600">{card.back}</p>
                </div>
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </TeacherAdminGuard>
  );
}