import React, { useState, useEffect, useCallback } from 'react';
import { Calculator, Trophy, Clock, Target, RotateCcw, Home } from 'lucide-react';
import { submitGameScore } from '../../../services/gamesApi';
import { useAppStore } from '../../../store/appStore';

const QuickMath = ({ onExit }) => {
  const { theme } = useAppStore();
  const [gameState, setGameState] = useState('menu'); // menu, playing, finished
  const [difficulty, setDifficulty] = useState('easy');
  const [operation, setOperation] = useState('addition');
  
  // Game data
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Difficulty settings
  const difficultySettings = {
    easy: { max: 20, time: 60 },
    medium: { max: 50, time: 90 },
    hard: { max: 100, time: 120 },
    expert: { max: 500, time: 150 },
  };

  // Generate random number based on difficulty
  const getRandomNumber = useCallback(() => {
    const max = difficultySettings[difficulty].max;
    return Math.floor(Math.random() * max) + 1;
  }, [difficulty]);

  // Generate new question
  const generateQuestion = useCallback(() => {
    const num1 = getRandomNumber();
    const num2 = getRandomNumber();
    let answer;
    let questionText;

    switch (operation) {
      case 'addition':
        answer = num1 + num2;
        questionText = `${num1} + ${num2}`;
        break;
      case 'subtraction':
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        answer = larger - smaller;
        questionText = `${larger} - ${smaller}`;
        break;
      case 'multiplication':
        answer = num1 * num2;
        questionText = `${num1} × ${num2}`;
        break;
      case 'division':
        const divisor = Math.max(1, num2);
        const dividend = divisor * num1;
        answer = num1;
        questionText = `${dividend} ÷ ${divisor}`;
        break;
      default:
        answer = num1 + num2;
        questionText = `${num1} + ${num2}`;
    }

    setQuestion({ text: questionText, answer });
  }, [operation, getRandomNumber]);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(difficultySettings[difficulty].time);
    setUserAnswer('');
    generateQuestion();
  };

  // Check answer
  const checkAnswer = useCallback(() => {
    if (userAnswer === '') return;

    const isCorrect = parseInt(userAnswer) === question.answer;
    setQuestionsAnswered(prev => prev + 1);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      
      const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : difficulty === 'hard' ? 30 : 50;
      const bonusPoints = Math.floor(newStreak / 5) * 10;
      setScore(prev => prev + points + bonusPoints);
      setCorrectAnswers(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setUserAnswer('');
    generateQuestion();
  }, [userAnswer, question, streak, bestStreak, difficulty, generateQuestion]);

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

  // End game and submit score
  const endGame = async () => {
    setGameState('finished');
    
    try {
      const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
      const timeTaken = difficultySettings[difficulty].time - timeLeft;
      
      await submitGameScore('quick-math', {
        score,
        time_taken: timeTaken,
        accuracy,
        answers_correct: correctAnswers,
        answers_total: questionsAnswered,
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
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Calculator size={40} className="text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              Quick Math
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Test your arithmetic skills with timed challenges!
            </p>
          </div>

          {/* Operation Selection */}
          <div className="mb-6">
            <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Operation
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['addition', 'subtraction', 'multiplication', 'division'].map(op => (
                <button
                  key={op}
                  onClick={() => setOperation(op)}
                  className={`p-3 rounded-lg font-medium capitalize transition-all ${
                    operation === op
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {op === 'addition' && '+'}
                  {op === 'subtraction' && '−'}
                  {op === 'multiplication' && '×'}
                  {op === 'division' && '÷'}
                  <span className="ml-2">{op}</span>
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
                  <div className="text-xs mt-1 opacity-80">
                    Max: {difficultySettings[diff].max} | {difficultySettings[diff].time}s
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="flex gap-3">
            <button onClick={startGame} className="btn btn-primary flex-1 py-4 text-lg">
              Start Game
            </button>
            <button 
              onClick={onExit} 
              className={`px-6 py-4 rounded-lg font-medium transition-colors ${
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
            <div className="flex items-center justify-center mb-2">
              <Trophy size={20} className="text-yellow-500 mr-2" />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Score</span>
            </div>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {score}
            </div>
          </div>

          <div className="card text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock size={20} className="text-blue-500 mr-2" />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Time</span>
            </div>
            <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500' : theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {timeLeft}s
            </div>
          </div>

          <div className="card text-center">
            <div className="flex items-center justify-center mb-2">
              <Target size={20} className="text-green-500 mr-2" />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Streak</span>
            </div>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {streak} 🔥
            </div>
          </div>

          <div className="card text-center">
            <div className="flex items-center justify-center mb-2">
              <Calculator size={20} className="text-purple-500 mr-2" />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Correct</span>
            </div>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {correctAnswers}/{questionsAnswered}
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card mb-6">
          <div className="text-center py-12">
            <div className={`text-6xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {question?.text}
            </div>
            
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Your answer"
              autoFocus
              className={`text-4xl text-center font-bold p-4 rounded-xl border-2 w-64 mx-auto ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-gray-100'
                  : 'bg-white border-purple-200 text-gray-900'
              }`}
              style={{ outline: 'none' }}
            />

            <button
              onClick={checkAnswer}
              className="btn btn-primary mt-6 px-12 py-4 text-xl"
              disabled={userAnswer === ''}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${(timeLeft / difficultySettings[difficulty].time) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  // Results screen
  if (gameState === 'finished') {
    const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;

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
            Great job on your math skills!
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{score}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Final Score</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{accuracy}%</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{bestStreak}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Best Streak</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{correctAnswers}/{questionsAnswered}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Correct</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button onClick={startGame} className="btn btn-primary flex-1 py-4">
              <RotateCcw size={20} className="mr-2 inline" />
              Play Again
            </button>
            <button 
              onClick={onExit}
              className={`px-6 py-4 rounded-lg font-medium transition-colors ${
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
};

export default QuickMath;