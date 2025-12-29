// src/pages/Flashcards/StudySessionPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flashcard } from '../../types/flashcard'; // ✅ Import type
import { flashcardApi } from '../../services/flashcardApi';

export default function StudySessionPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  // ✅ Type the state
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    flashcardApi.startStudy(Number(deckId)).then(session => {
      setCards(session.cards);
      setLoading(false);
    }).catch(() => {
      navigate('/flashcards');
    });
  }, [deckId, navigate]);

  const currentCard = cards[currentIndex];

  const handleReview = async (quality) => {
    if (!currentCard) return;

    await flashcardApi.reviewCard(currentCard.id, { quality });

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      alert('🎉 Study session complete! Great job!');
      navigate('/flashcards');
    }
  };

  if (loading) return <div className="p-6">Starting your study session...</div>;
  if (cards.length === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <p className="text-lg">No cards are due for review right now. 🎉</p>
        <button
          onClick={() => navigate('/flashcards')}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Back to Decks
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <p>Card {currentIndex + 1} of {cards.length}</p>
      </div>

      <div className="bg-white border rounded-xl p-8 min-h-[250px] shadow">
        <p className="text-xl text-gray-800">{currentCard?.front}</p>

        {showAnswer && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <p className="text-lg text-gray-700">{currentCard?.back}</p>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Show Answer
            </button>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map(q => (
                <button
                  key={q}
                  onClick={() => handleReview(q)}
                  className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-800 font-bold"
                  title={`Quality: ${q} (0 = Forgot, 5 = Perfect)`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}