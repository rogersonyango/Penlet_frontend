import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Keyboard, Trophy, Clock, RotateCcw, Home, Zap, Target } from 'lucide-react';
import { submitGameScore } from '../../../services/gamesApi';
import { useAppStore } from '../../../store/appStore';

const TypeRace = ({ onExit }) => {
  const { theme } = useAppStore();
  const [gameState, setGameState] = useState('menu');
  const [difficulty, setDifficulty] = useState('easy');
  
  const [targetText, setTargetText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  const inputRef = useRef(null);

  // Text samples by difficulty
  const textSamples = {
    easy: [
      "The quick brown fox jumps over the lazy dog.",
      "Education is the key to success in life.",
      "Practice makes perfect every single day.",
      "Learning new things keeps the mind sharp.",
      "Knowledge is power when shared with others.",
    ],
    medium: [
      "Scientific research has shown that regular study habits significantly improve academic performance and long-term retention of knowledge.",
      "Mathematics is not just about numbers; it teaches logical thinking, problem-solving skills, and analytical reasoning.",
      "Effective communication skills are essential in both personal and professional relationships throughout life.",
      "Technology has revolutionized the way we learn, making education more accessible to people around the world.",
      "Critical thinking enables students to analyze information objectively and make well-informed decisions.",
    ],
    hard: [
      "Photosynthesis is the biochemical process by which plants convert light energy into chemical energy, producing glucose and oxygen as byproducts through a complex series of light-dependent and light-independent reactions.",
      "The theory of evolution, proposed by Charles Darwin, explains how species change over time through natural selection, genetic variation, and environmental adaptation across countless generations.",
      "Quantum mechanics fundamentally challenges our classical understanding of physics by demonstrating that particles can exist in multiple states simultaneously until observed or measured.",
      "Artificial intelligence and machine learning algorithms are transforming industries by enabling computers to learn from data, recognize patterns, and make decisions with minimal human intervention.",
      "Climate change represents one of humanity's greatest challenges, requiring coordinated global action to reduce greenhouse gas emissions and transition to sustainable energy sources.",
    ],
    expert: [
      "The mitochondrion, often called the powerhouse of the cell, generates adenosine triphosphate through oxidative phosphorylation in the inner membrane, where the electron transport chain creates a proton gradient that drives ATP synthase.",
      "Neuroplasticity refers to the brain's remarkable ability to reorganize itself by forming new neural connections throughout life, allowing neurons to compensate for injury, adjust activities in response to new situations, and facilitate learning and memory formation.",
      "Cryptography employs mathematical algorithms to secure digital communications through encryption, ensuring confidentiality, integrity, and authenticity of information transmitted across potentially insecure networks and storage systems.",
      "Biodiversity encompasses the variety of life forms on Earth, including genetic diversity within species, species diversity within ecosystems, and ecosystem diversity across the biosphere, all of which contribute to ecological stability and resilience.",
      "Socioeconomic factors, including education level, income inequality, access to healthcare, and social support networks, significantly influence individual and community health outcomes across diverse populations worldwide.",
    ],
  };

  const getRandomText = useCallback(() => {
    const texts = textSamples[difficulty];
    return texts[Math.floor(Math.random() * texts.length)];
  }, [difficulty]);

  const startGame = () => {
    const text = getRandomText();
    setTargetText(text);
    setUserInput('');
    setGameState('playing');
    setStartTime(Date.now());
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setTimeElapsed(0);
    
    // Focus input after a short delay
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Calculate WPM
  const calculateWPM = useCallback(() => {
    if (!startTime) return 0;
    const timeInMinutes = (Date.now() - startTime) / 60000;
    const words = userInput.trim().split(/\s+/).length;
    return Math.round(words / timeInMinutes) || 0;
  }, [startTime, userInput]);

  // Calculate accuracy
  const calculateAccuracy = useCallback(() => {
    if (userInput.length === 0) return 100;
    
    let correctChars = 0;
    const minLength = Math.min(userInput.length, targetText.length);
    
    for (let i = 0; i < minLength; i++) {
      if (userInput[i] === targetText[i]) {
        correctChars++;
      }
    }
    
    return Math.round((correctChars / userInput.length) * 100);
  }, [userInput, targetText]);

  // Update stats in real-time
  useEffect(() => {
    if (gameState === 'playing' && userInput.length > 0) {
      const currentWPM = calculateWPM();
      const currentAccuracy = calculateAccuracy();
      
      setWpm(currentWPM);
      setAccuracy(currentAccuracy);
      
      // Count errors
      let errorCount = 0;
      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] !== targetText[i]) {
          errorCount++;
        }
      }
      setErrors(errorCount);
      
      // Check if complete
      if (userInput === targetText) {
        endGame();
      }
    }
  }, [userInput, gameState]);

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && startTime) {
      const timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 100);
      return () => clearInterval(timer);
    }
  }, [gameState, startTime]);

  const endGame = async () => {
    const finalEndTime = Date.now();
    setEndTime(finalEndTime);
    setGameState('finished');
    
    try {
      const timeTaken = Math.floor((finalEndTime - startTime) / 1000);
      const finalWPM = calculateWPM();
      const finalAccuracy = calculateAccuracy();
      
      // Calculate score based on WPM and accuracy
      const score = Math.round(finalWPM * (finalAccuracy / 100) * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : difficulty === 'hard' ? 2 : 3));
      
      await submitGameScore('type-race', {
        score,
        time_taken: timeTaken,
        accuracy: finalAccuracy,
        answers_correct: targetText.length - errors,
        answers_total: targetText.length,
      });
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  // Get character status
  const getCharStatus = (index) => {
    if (index >= userInput.length) return 'pending';
    if (userInput[index] === targetText[index]) return 'correct';
    return 'incorrect';
  };

  // Menu screen
  if (gameState === 'menu') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <Keyboard size={40} className="text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              Type Race
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Test your typing speed and accuracy with educational content!
            </p>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8">
            <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Difficulty
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.keys(textSamples).map(diff => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`p-3 rounded-lg font-medium capitalize transition-all ${
                    difficulty === diff
                      ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg'
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

          {/* Info */}
          <div className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-pink-50'}`}>
            <h3 className={`font-bold mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              How to Play:
            </h3>
            <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>✓ Type the displayed text as quickly and accurately as possible</li>
              <li>✓ Green characters are correct, red are incorrect</li>
              <li>✓ Your WPM (Words Per Minute) updates in real-time</li>
              <li>✓ Higher accuracy means higher scores</li>
              <li>✓ Complete the text to finish the game</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button onClick={startGame} className="btn btn-primary flex-1 py-4 text-lg">
              Start Typing
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
      <div className="max-w-5xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card text-center">
            <Zap className="inline mb-1 text-blue-500" size={20} />
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{wpm}</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>WPM</div>
          </div>

          <div className="card text-center">
            <Target className="inline mb-1 text-green-500" size={20} />
            <div className={`text-2xl font-bold ${accuracy < 80 ? 'text-orange-500' : theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {accuracy}%
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</div>
          </div>

          <div className="card text-center">
            <Clock className="inline mb-1 text-purple-500" size={20} />
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{timeElapsed}s</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Time</div>
          </div>

          <div className="card text-center">
            <Keyboard className="inline mb-1 text-pink-500" size={20} />
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{errors}</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Errors</div>
          </div>
        </div>

        {/* Text Display */}
        <div className={`card mb-6 p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-2xl md:text-3xl leading-relaxed font-mono mb-8">
            {targetText.split('').map((char, index) => {
              const status = getCharStatus(index);
              return (
                <span
                  key={index}
                  className={`${
                    status === 'correct'
                      ? 'text-green-500'
                      : status === 'incorrect'
                        ? 'text-red-500 bg-red-100 dark:bg-red-900 dark:bg-opacity-30'
                        : theme === 'dark'
                          ? 'text-gray-500'
                          : 'text-gray-400'
                  } ${index === userInput.length ? 'border-l-4 border-pink-500 animate-pulse' : ''}`}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>

          {/* Input */}
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className={`w-full p-4 rounded-lg border-2 text-xl font-mono resize-none ${
              theme === 'dark'
                ? 'bg-gray-900 border-gray-700 text-gray-100'
                : 'bg-gray-50 border-pink-200 text-gray-900'
            }`}
            rows={4}
            placeholder="Start typing here..."
            autoFocus
          />
        </div>

        {/* Progress */}
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
            style={{ width: `${(userInput.length / targetText.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  // Results screen
  if (gameState === 'finished') {
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const finalScore = Math.round(wpm * (accuracy / 100) * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : difficulty === 'hard' ? 2 : 3));

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
            <Trophy size={48} className="text-white" />
          </div>

          <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            Race Complete!
          </h2>
          <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Great typing skills!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-pink-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{finalScore}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Score</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{wpm}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>WPM</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{accuracy}%</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{timeTaken}s</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Time</div>
            </div>
          </div>

          {/* Performance Rating */}
          <div className={`mb-8 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {wpm >= 80 ? '🏆 Excellent!' : wpm >= 60 ? '⭐ Great!' : wpm >= 40 ? '👍 Good!' : '💪 Keep Practicing!'}
            </div>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {wpm >= 80 ? 'Outstanding typing speed!' : wpm >= 60 ? 'Very good typing speed!' : wpm >= 40 ? 'Decent typing speed!' : 'Practice will improve your speed!'}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={startGame} className="btn btn-primary flex-1 py-4">
              <RotateCcw size={20} className="mr-2 inline" />
              Race Again
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

export default TypeRace;