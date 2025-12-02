import React, { useState, useEffect, useCallback } from 'react';
import { Shuffle, Trophy, Clock, RotateCcw, Home, HelpCircle, Lightbulb } from 'lucide-react';
import { submitGameScore } from '../../../services/gamesApi';
import { useAppStore } from '../../../store/appStore';

const WordScramble = ({ onExit }) => {
  const { theme } = useAppStore();
  const [gameState, setGameState] = useState('menu');
  const [difficulty, setDifficulty] = useState('easy');
  const [category, setCategory] = useState('general');
  
  // Game data
  const [currentWord, setCurrentWord] = useState(null);
  const [scrambled, setScrambled] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);

  const difficultySettings = {
    easy: { wordLength: [3, 5], time: 120, points: 10 },
    medium: { wordLength: [5, 7], time: 150, points: 20 },
    hard: { wordLength: [7, 10], time: 180, points: 30 },
    expert: { wordLength: [10, 15], time: 210, points: 50 },
  };

  // Word banks by category
  const wordBanks = {
    general: [
      { word: 'EDUCATION', hint: 'Process of learning' },
      { word: 'KNOWLEDGE', hint: 'Information and understanding' },
      { word: 'STUDENT', hint: 'Person who studies' },
      { word: 'TEACHER', hint: 'Person who educates' },
      { word: 'LEARNING', hint: 'Acquiring knowledge' },
      { word: 'SCIENCE', hint: 'Study of natural world' },
      { word: 'MATHEMATICS', hint: 'Study of numbers' },
      { word: 'HISTORY', hint: 'Study of past events' },
      { word: 'GEOGRAPHY', hint: 'Study of Earth' },
      { word: 'LITERATURE', hint: 'Written works' },
      { word: 'CHEMISTRY', hint: 'Study of substances' },
      { word: 'BIOLOGY', hint: 'Study of life' },
      { word: 'PHYSICS', hint: 'Study of matter and energy' },
      { word: 'COMPUTER', hint: 'Electronic device' },
      { word: 'TECHNOLOGY', hint: 'Application of science' },
    ],
    science: [
      { word: 'OXYGEN', hint: 'Gas we breathe' },
      { word: 'MOLECULE', hint: 'Group of atoms' },
      { word: 'ELECTRON', hint: 'Negative particle' },
      { word: 'GRAVITY', hint: 'Force pulling objects' },
      { word: 'ENERGY', hint: 'Capacity to do work' },
      { word: 'CARBON', hint: 'Element in all living things' },
      { word: 'NUCLEUS', hint: 'Center of atom or cell' },
      { word: 'EVOLUTION', hint: 'Change over time' },
      { word: 'ECOSYSTEM', hint: 'Community of organisms' },
      { word: 'PHOTOSYNTHESIS', hint: 'Plants making food' },
    ],
    math: [
      { word: 'ALGEBRA', hint: 'Branch using letters' },
      { word: 'GEOMETRY', hint: 'Study of shapes' },
      { word: 'TRIANGLE', hint: 'Three-sided shape' },
      { word: 'EQUATION', hint: 'Mathematical statement' },
      { word: 'FRACTION', hint: 'Part of a whole' },
      { word: 'DECIMAL', hint: 'Number with point' },
      { word: 'PERCENTAGE', hint: 'Parts per hundred' },
      { word: 'CALCULATOR', hint: 'Computing device' },
      { word: 'MULTIPLICATION', hint: 'Repeated addition' },
      { word: 'DIVISION', hint: 'Splitting into parts' },
    ],
  };

  // Scramble word
  const scrambleWord = (word) => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const scrambled = arr.join('');
    // If by chance it's the same, scramble again
    return scrambled === word ? scrambleWord(word) : scrambled;
  };

  // Get random word based on difficulty
  const getRandomWord = useCallback(() => {
    const words = wordBanks[category] || wordBanks.general;
    const [minLen, maxLen] = difficultySettings[difficulty].wordLength;
    const filteredWords = words.filter(w => w.word.length >= minLen && w.word.length <= maxLen);
    
    if (filteredWords.length === 0) return words[0];
    return filteredWords[Math.floor(Math.random() * filteredWords.length)];
  }, [difficulty, category]);

  // Generate new question
  const generateQuestion = useCallback(() => {
    const wordObj = getRandomWord();
    setCurrentWord(wordObj);
    setScrambled(scrambleWord(wordObj.word));
    setUserAnswer('');
    setShowHint(false);
  }, [getRandomWord]);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setWordsCompleted(0);
    setCorrectAnswers(0);
    setStreak(0);
    setHintsUsed(0);
    setTimeLeft(difficultySettings[difficulty].time);
    generateQuestion();
  };

  // Check answer
  const checkAnswer = useCallback(() => {
    if (!userAnswer.trim()) return;

    const isCorrect = userAnswer.toUpperCase() === currentWord.word;
    setWordsCompleted(prev => prev + 1);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      let points = difficultySettings[difficulty].points;
      // Bonus for streak
      if (newStreak >= 5) points += 10;
      if (newStreak >= 10) points += 20;
      // Penalty for using hint
      if (showHint) points = Math.floor(points / 2);
      
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      generateQuestion();
    } else {
      setStreak(0);
      setUserAnswer('');
    }
  }, [userAnswer, currentWord, streak, difficulty, showHint, generateQuestion]);

  // Show hint
  const useHint = () => {
    if (!showHint) {
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
    }
  };

  // Skip word
  const skipWord = () => {
    setWordsCompleted(prev => prev + 1);
    setStreak(0);
    generateQuestion();
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      endGame();
    }
  }, [gameState, timeLeft]);

  // End game
  const endGame = async () => {
    setGameState('finished');
    
    try {
      const accuracy = wordsCompleted > 0 ? Math.round((correctAnswers / wordsCompleted) * 100) : 0;
      const timeTaken = difficultySettings[difficulty].time - timeLeft;
      
      await submitGameScore('word-scramble', {
        score,
        time_taken: timeTaken,
        accuracy,
        answers_correct: correctAnswers,
        answers_total: wordsCompleted,
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
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <Shuffle size={40} className="text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              Word Scramble
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Unscramble educational vocabulary words!
            </p>
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Category
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['general', 'science', 'math'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-lg font-medium capitalize transition-all ${
                    category === cat
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8">
            <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Difficulty
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.keys(difficultySettings).map(diff => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`p-3 rounded-lg font-medium capitalize transition-all ${
                    difficulty === diff
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={startGame} className="btn btn-primary flex-1 py-4 text-lg">
              Start Game
            </button>
            <button 
              onClick={onExit} 
              className={`px-6 py-4 rounded-lg font-medium ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
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
      <div className="max-w-4xl mx-auto p-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card text-center">
            <Trophy className="inline mb-1 text-yellow-500" size={20} />
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {score}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Score</div>
          </div>

          <div className="card text-center">
            <Clock className="inline mb-1 text-blue-500" size={20} />
            <div className={`text-xl font-bold ${timeLeft <= 20 ? 'text-red-500' : theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {timeLeft}s
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Time</div>
          </div>

          <div className="card text-center">
            <Shuffle className="inline mb-1 text-green-500" size={20} />
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {streak} 🔥
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Streak</div>
          </div>

          <div className="card text-center">
            <HelpCircle className="inline mb-1 text-purple-500" size={20} />
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {correctAnswers}/{wordsCompleted}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Correct</div>
          </div>
        </div>

        {/* Word Card */}
        <div className="card mb-6">
          <div className="text-center py-12">
            <div className={`text-sm uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Unscramble this word:
            </div>
            
            <div className="text-5xl md:text-6xl font-bold mb-8 tracking-widest">
              {scrambled.split('').map((letter, i) => (
                <span 
                  key={i}
                  className={`inline-block mx-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}
                  style={{ animation: `bounce ${0.5 + i * 0.1}s ease-in-out infinite` }}
                >
                  {letter}
                </span>
              ))}
            </div>

            {showHint && (
              <div className={`mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-yellow-900 bg-opacity-30' : 'bg-yellow-50'}`}>
                <Lightbulb className="inline mr-2 text-yellow-500" size={20} />
                <span className={theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}>
                  Hint: {currentWord?.hint}
                </span>
              </div>
            )}
            
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="TYPE YOUR ANSWER"
              autoFocus
              className={`text-3xl text-center font-bold p-4 rounded-xl border-2 w-full max-w-md mx-auto uppercase ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-gray-100'
                  : 'bg-white border-green-200 text-gray-900'
              }`}
            />

            <div className="flex gap-3 mt-6 justify-center">
              <button
                onClick={checkAnswer}
                className="btn btn-primary px-8 py-3"
                disabled={!userAnswer.trim()}
              >
                Submit
              </button>
              <button
                onClick={useHint}
                disabled={showHint}
                className={`px-6 py-3 rounded-lg font-medium ${
                  showHint
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                }`}
              >
                <Lightbulb size={20} className="inline mr-1" />
                Hint
              </button>
              <button
                onClick={skipWord}
                className={`px-6 py-3 rounded-lg font-medium ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Skip
              </button>
            </div>
          </div>
        </div>

        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
            style={{ width: `${(timeLeft / difficultySettings[difficulty].time) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  // Results screen
  if (gameState === 'finished') {
    const accuracy = wordsCompleted > 0 ? Math.round((correctAnswers / wordsCompleted) * 100) : 0;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
            <Trophy size={48} className="text-white" />
          </div>

          <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            Game Over!
          </h2>
          <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Great vocabulary skills!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{score}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Score</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{accuracy}%</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{correctAnswers}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Correct</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{hintsUsed}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Hints Used</div>
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

export default WordScramble;