import React, { useState, useEffect, useCallback } from 'react';
import { FlaskConical, Trophy, Clock, RotateCcw, Home, Zap, Atom } from 'lucide-react';
import { submitGameScore } from '../../../services/gamesApi';
import { useAppStore } from '../../../store/appStore';

const ChemistryMatch = ({ onExit }) => {
  const { theme } = useAppStore();
  const [gameState, setGameState] = useState('menu');
  const [difficulty, setDifficulty] = useState('easy');
  const [gameMode, setGameMode] = useState('elements');
  
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const difficultySettings = {
    easy: { pairs: 6, points: 10 },
    medium: { pairs: 8, points: 20 },
    hard: { pairs: 10, points: 30 },
    expert: { pairs: 12, points: 50 },
  };

  // Chemistry content banks
  const chemistryContent = {
    elements: [
      { symbol: 'H', name: 'Hydrogen' },
      { symbol: 'He', name: 'Helium' },
      { symbol: 'C', name: 'Carbon' },
      { symbol: 'N', name: 'Nitrogen' },
      { symbol: 'O', name: 'Oxygen' },
      { symbol: 'Na', name: 'Sodium' },
      { symbol: 'Mg', name: 'Magnesium' },
      { symbol: 'Al', name: 'Aluminum' },
      { symbol: 'Si', name: 'Silicon' },
      { symbol: 'P', name: 'Phosphorus' },
      { symbol: 'S', name: 'Sulfur' },
      { symbol: 'Cl', name: 'Chlorine' },
      { symbol: 'K', name: 'Potassium' },
      { symbol: 'Ca', name: 'Calcium' },
      { symbol: 'Fe', name: 'Iron' },
      { symbol: 'Cu', name: 'Copper' },
      { symbol: 'Zn', name: 'Zinc' },
      { symbol: 'Ag', name: 'Silver' },
      { symbol: 'Au', name: 'Gold' },
      { symbol: 'Pb', name: 'Lead' },
    ],
    compounds: [
      { formula: 'H₂O', name: 'Water' },
      { formula: 'CO₂', name: 'Carbon Dioxide' },
      { formula: 'NaCl', name: 'Salt' },
      { formula: 'H₂O₂', name: 'Hydrogen Peroxide' },
      { formula: 'NH₃', name: 'Ammonia' },
      { formula: 'CH₄', name: 'Methane' },
      { formula: 'HCl', name: 'Hydrochloric Acid' },
      { formula: 'H₂SO₄', name: 'Sulfuric Acid' },
      { formula: 'NaOH', name: 'Sodium Hydroxide' },
      { formula: 'CaCO₃', name: 'Calcium Carbonate' },
      { formula: 'O₂', name: 'Oxygen Gas' },
      { formula: 'N₂', name: 'Nitrogen Gas' },
      { formula: 'C₆H₁₂O₆', name: 'Glucose' },
      { formula: 'KOH', name: 'Potassium Hydroxide' },
      { formula: 'MgO', name: 'Magnesium Oxide' },
    ],
    reactions: [
      { type: 'Combustion', example: 'Burning' },
      { type: 'Synthesis', example: 'Combining' },
      { type: 'Decomposition', example: 'Breaking Down' },
      { type: 'Oxidation', example: 'Rust Formation' },
      { type: 'Reduction', example: 'Gain Electrons' },
      { type: 'Neutralization', example: 'Acid + Base' },
      { type: 'Precipitation', example: 'Solid Forms' },
      { type: 'Endothermic', example: 'Absorbs Heat' },
      { type: 'Exothermic', example: 'Releases Heat' },
      { type: 'Redox', example: 'Electron Transfer' },
      { type: 'Hydrolysis', example: 'Water Breaks Bond' },
      { type: 'Photosynthesis', example: 'Light + CO₂' },
    ],
  };

  const generateCards = useCallback(() => {
    const numPairs = difficultySettings[difficulty].pairs;
    const content = chemistryContent[gameMode];
    const selectedItems = content.slice(0, numPairs);
    
    const cardPairs = [];
    selectedItems.forEach((item, index) => {
      const leftKey = gameMode === 'elements' ? 'symbol' : gameMode === 'compounds' ? 'formula' : 'type';
      const rightKey = gameMode === 'elements' ? 'name' : gameMode === 'compounds' ? 'name' : 'example';
      
      cardPairs.push({
        id: `${index}-a`,
        content: item[leftKey],
        pairId: index,
        type: 'left'
      });
      cardPairs.push({
        id: `${index}-b`,
        content: item[rightKey],
        pairId: index,
        type: 'right'
      });
    });
    
    return cardPairs.sort(() => Math.random() - 0.5);
  }, [difficulty, gameMode]);

  const startGame = () => {
    setGameState('playing');
    setCards(generateCards());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimeElapsed(0);
    setScore(0);
    setStartTime(Date.now());
  };

  useEffect(() => {
    if (gameState === 'playing' && startTime) {
      const timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, startTime]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [firstId, secondId] = flipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);
      
      setMoves(prev => prev + 1);

      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        setMatched(prev => [...prev, firstId, secondId]);
        setScore(prev => prev + difficultySettings[difficulty].points);
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

  const handleCardClick = (cardId) => {
    if (flipped.length === 2 || flipped.includes(cardId) || matched.includes(cardId)) return;
    setFlipped(prev => [...prev, cardId]);
  };

  const endGame = async () => {
    setGameState('finished');
    
    try {
      const accuracy = moves > 0 ? Math.round((cards.length / 2 / moves) * 100) : 0;
      
      await submitGameScore('chemistry-match', {
        score,
        time_taken: timeElapsed,
        accuracy,
        answers_correct: cards.length / 2,
        answers_total: cards.length / 2,
      });
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  // Menu screen
  if (gameState === 'menu') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center">
              <FlaskConical size={40} className="text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              Chemistry Match
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Match chemical symbols, formulas, and reaction types!
            </p>
          </div>

          {/* Game Mode */}
          <div className="mb-6">
            <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Game Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'elements', label: 'Elements', icon: Atom },
                { id: 'compounds', label: 'Compounds', icon: FlaskConical },
                { id: 'reactions', label: 'Reactions', icon: Zap },
              ].map(mode => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setGameMode(mode.id)}
                    className={`p-3 rounded-lg font-medium ${
                      gameMode === mode.id
                        ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={20} className="inline mr-2" />
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
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
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {diff}
                  <div className="text-xs mt-1">{difficultySettings[diff].pairs} pairs</div>
                </button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className={`mb-8 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-cyan-50'}`}>
            <h3 className={`font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              How to Play:
            </h3>
            <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>✓ Match chemical symbols with their element names</li>
              <li>✓ Or match formulas with compound names</li>
              <li>✓ Or match reaction types with examples</li>
              <li>✓ Click two cards to flip them</li>
              <li>✓ Make all matches to complete the game!</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button onClick={startGame} className="btn btn-primary flex-1 py-4 text-lg">
              Start Game
            </button>
            <button 
              onClick={onExit} 
              className={`px-6 py-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            >
              <Home size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  if (gameState === 'playing') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Stats */}
        <div className="flex justify-between mb-6 gap-4">
          <div className="card flex-1 text-center">
            <Clock className="inline mr-2 text-blue-500" size={20} />
            <span className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {timeElapsed}s
            </span>
          </div>
          <div className="card flex-1 text-center">
            <Trophy className="inline mr-2 text-yellow-500" size={20} />
            <span className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {score} pts
            </span>
          </div>
          <div className="card flex-1 text-center">
            <Zap className="inline mr-2 text-purple-500" size={20} />
            <span className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {moves} moves
            </span>
          </div>
          <div className="card flex-1 text-center">
            <FlaskConical className="inline mr-2 text-cyan-500" size={20} />
            <span className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {matched.length / 2}/{cards.length / 2}
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className={`grid gap-4 ${
          difficulty === 'easy' ? 'grid-cols-4' : 
          difficulty === 'medium' ? 'grid-cols-4' : 
          difficulty === 'hard' ? 'grid-cols-5' : 'grid-cols-6'
        }`}>
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-xl flex items-center justify-center text-center p-2 cursor-pointer transition-all transform hover:scale-105 ${
                flipped.includes(card.id) || matched.includes(card.id)
                  ? 'bg-gradient-to-br from-cyan-400 to-cyan-500 text-white shadow-lg'
                  : theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-200 text-gray-700'
              }`}
            >
              <span className={`font-bold ${
                difficulty === 'expert' ? 'text-sm' : 'text-lg'
              }`}>
                {(flipped.includes(card.id) || matched.includes(card.id)) ? card.content : '?'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Results screen
  if (gameState === 'finished') {
    const accuracy = moves > 0 ? Math.round((cards.length / 2 / moves) * 100) : 0;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
            <Trophy size={48} className="text-white" />
          </div>

          <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            Excellent Chemistry!
          </h2>
          <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            You matched all the pairs!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-cyan-50'}`}>
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
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{accuracy}%</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Efficiency</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={startGame} className="btn btn-primary flex-1 py-4">
              <RotateCcw size={20} className="mr-2 inline" />
              Play Again
            </button>
            <button 
              onClick={onExit}
              className={`px-6 py-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            >
              <Home size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default ChemistryMatch;