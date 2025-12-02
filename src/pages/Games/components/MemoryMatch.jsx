import React, { useState, useEffect } from 'react';
import { Brain, Trophy, Clock, RotateCcw, Home, Star } from 'lucide-react';
import { submitGameScore } from '../../../services/gamesApi';
import { useAppStore } from '../../../store/appStore';

const MemoryMatch = ({ onExit }) => {
  const { theme } = useAppStore();
  const [gameState, setGameState] = useState('menu');
  const [difficulty, setDifficulty] = useState('easy');
  
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);

  const difficultySettings = {
    easy: { pairs: 6, time: 60 },
    medium: { pairs: 8, time: 90 },
    hard: { pairs: 10, time: 120 },
    expert: { pairs: 12, time: 150 },
  };

  const emojis = ['📚', '✏️', '🔬', '🌍', '🎨', '🎵', '⚽', '🎭', '🌟', '🎯', '🚀', '💡'];

  const generateCards = () => {
    const numPairs = difficultySettings[difficulty].pairs;
    const selectedEmojis = emojis.slice(0, numPairs);
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    return cardPairs
      .map((emoji, index) => ({ id: index, emoji, matched: false }))
      .sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    setGameState('playing');
    setCards(generateCards());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimeElapsed(0);
    setScore(0);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      setMoves(prev => prev + 1);

      if (cards[first].emoji === cards[second].emoji) {
        setMatched(prev => [...prev, first, second]);
        setScore(prev => prev + (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30));
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  }, [flipped, cards, difficulty]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      endGame();
    }
  }, [matched, cards]);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    setFlipped(prev => [...prev, index]);
  };

  const endGame = async () => {
    setGameState('finished');
    try {
      const accuracy = moves > 0 ? Math.round((matched.length / 2 / moves) * 100) : 0;
      await submitGameScore('memory-match', {
        score,
        time_taken: timeElapsed,
        accuracy,
        answers_correct: matched.length / 2,
        answers_total: cards.length / 2,
      });
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Brain size={40} className="text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              Memory Match
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Match all the pairs as quickly as possible!
            </p>
          </div>

          <div className="mb-8">
            <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Difficulty
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.keys(difficultySettings).map(diff => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`p-3 rounded-lg font-medium capitalize ${
                    difficulty === diff
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                      : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {diff}
                  <div className="text-xs mt-1 opacity-80">{difficultySettings[diff].pairs} pairs</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={startGame} className="btn btn-primary flex-1 py-4 text-lg">Start Game</button>
            <button onClick={onExit} className={`px-6 py-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
              <Home size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between mb-6">
          <div className="card flex-1 mr-2 text-center">
            <Clock className="inline mr-2 text-blue-500" size={20} />
            <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>{timeElapsed}s</span>
          </div>
          <div className="card flex-1 mx-2 text-center">
            <Star className="inline mr-2 text-yellow-500" size={20} />
            <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>{moves} moves</span>
          </div>
          <div className="card flex-1 ml-2 text-center">
            <Trophy className="inline mr-2 text-purple-500" size={20} />
            <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>{score} pts</span>
          </div>
        </div>

        <div className={`grid gap-4 ${
          difficulty === 'easy' ? 'grid-cols-4' : difficulty === 'medium' ? 'grid-cols-4' : 'grid-cols-5'
        }`}>
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-xl flex items-center justify-center text-4xl cursor-pointer transition-all transform hover:scale-105 ${
                flipped.includes(index) || matched.includes(index)
                  ? 'bg-gradient-to-br from-purple-400 to-purple-500'
                  : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            >
              {(flipped.includes(index) || matched.includes(index)) ? card.emoji : '❓'}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const accuracy = moves > 0 ? Math.round((matched.length / 2 / moves) * 100) : 0;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
            <Trophy size={48} className="text-white" />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            Congratulations!
          </h2>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>You matched all pairs!</p>

          <div className="grid grid-cols-3 gap-4 my-8">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{score}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Score</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{timeElapsed}s</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Time</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{moves}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Moves</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={startGame} className="btn btn-primary flex-1 py-4">
              <RotateCcw size={20} className="mr-2 inline" />Play Again
            </button>
            <button onClick={onExit} className={`px-6 py-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
              <Home size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default MemoryMatch;