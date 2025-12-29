// src/pages/Flashcards/PublicDecksPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Deck } from '../../types/flashcard'; // ✅ Use your existing type
import { flashcardApi } from '../../services/flashcardApi';

export default function PublicDecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]); // ✅ Typed correctly
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    flashcardApi.getPublicDecks().then((data) => {
      setDecks(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-6">Loading public decks...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Public Flashcard Decks</h1>
        <button
          onClick={() => navigate('/flashcards')}
          className="text-blue-600 hover:underline"
        >
          ← My Decks
        </button>
      </div>

      {decks.length === 0 ? (
        <p>No public decks available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => (
            <div key={deck.id} className="border rounded-lg p-4 shadow">
              <h2 className="font-bold">{deck.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {deck.subject || 'General'} • {deck.card_count} cards
              </p>
              <button
                onClick={() => navigate(`/flashcards/study/${deck.id}`)}
                className="mt-3 w-full bg-green-600 text-white py-1.5 rounded hover:bg-green-700"
              >
                Study Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}