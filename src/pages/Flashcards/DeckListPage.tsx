// src/pages/Flashcards/DeckListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { flashcardApi } from '../../services/flashcardApi';
import { TeacherAdminGuard } from '../../utils/withRoleGuard';
import { Deck } from '../../types/flashcard';


export default function DeckListPage() {
const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    flashcardApi.getDecks().then(data => {
      setDecks(data);
      setLoading(false);
    });
  }, []);

  const handleCreateDeck = () => {
    navigate('/flashcards/create');
  };

  if (loading) {
    return <div className="p-6">Loading your decks...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Flashcard Decks</h1>
        <TeacherAdminGuard>
          <button
            onClick={handleCreateDeck}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Deck
          </button>
        </TeacherAdminGuard>
      </div>

      {decks.length === 0 ? (
        <p>You have no decks yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map(deck => (
            <div key={deck.id} className="border rounded-lg p-4 shadow hover:shadow-md">
              <h2 className="font-bold text-lg">{deck.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {deck.subject || 'No subject'} • {deck.card_count} cards
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => navigate(`/flashcards/study/${deck.id}`)}
                  className="text-green-600 hover:underline text-sm"
                >
                  Study
                </button>
                <TeacherAdminGuard>
                  <button
                    onClick={() => navigate(`/flashcards/${deck.id}/cards`)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Manage Cards
                  </button>
                </TeacherAdminGuard>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <a
          href="/flashcards/public"
          className="text-purple-600 hover:underline inline-block"
        >
          🌍 Browse public decks
        </a>
      </div>
    </div>
  );
}