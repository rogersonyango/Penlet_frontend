import React, { useState } from 'react';
import { Plus, RotateCw } from 'lucide-react';
import { mockFlashcards, mockSubjects } from '../../services/mockData';

const Flashcards = () => {
  const [flipped, setFlipped] = useState({});

  const toggleFlip = (id) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Flashcards</h1>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          <span>Create Flashcard</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFlashcards.map(card => {
          const subject = mockSubjects.find(s => s.id === card.subjectId);
          const isFlipped = flipped[card.id];
          return (
            <div
              key={card.id}
              onClick={() => toggleFlip(card.id)}
              className="card cursor-pointer h-64 flex flex-col justify-center items-center text-center transition-all hover:shadow-lg"
            >
              <div className="mb-4">
                <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: subject?.color + '20', color: subject?.color }}>
                  {subject?.name}
                </span>
              </div>
              <p className="text-lg font-medium px-4">
                {isFlipped ? card.back : card.front}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <RotateCw size={16} />
                <span>Click to flip</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Flashcards;