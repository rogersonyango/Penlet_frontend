import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Trophy, Clock, RotateCcw, Home, Zap } from 'lucide-react';
import { submitGameScore } from '../../../services/gamesApi';
import { useAppStore } from '../../../store/appStore';

const TrueFalse = ({ onExit }) => {
  const { theme } = useAppStore();
  const [gameState, setGameState] = useState('menu');
  const [difficulty, setDifficulty] = useState('easy');
  const [subject, setSubject] = useState('general');
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [rapidMode, setRapidMode] = useState(false);

  const difficultySettings = {
    easy: { questions: 10, timePerQuestion: 10, points: 10 },
    medium: { questions: 15, timePerQuestion: 8, points: 20 },
    hard: { questions: 20, timePerQuestion: 6, points: 30 },
    expert: { questions: 25, timePerQuestion: 5, points: 50 },
  };

  // Question banks
  const questionBanks = {
    general: [
      { statement: 'The Earth is flat', answer: false },
      { statement: 'Water boils at 100°C at sea level', answer: true },
      { statement: 'Humans have 10 fingers', answer: true },
      { statement: 'The sun revolves around Earth', answer: false },
      { statement: 'Light travels faster than sound', answer: true },
      { statement: 'Spiders are insects', answer: false },
      { statement: 'Ice is denser than water', answer: false },
      { statement: 'Plants need sunlight to grow', answer: true },
      { statement: 'The human body has 4 chambers in the heart', answer: true },
      { statement: 'Sharks are mammals', answer: false },
      { statement: 'The Earth has one moon', answer: true },
      { statement: 'A week has 8 days', answer: false },
      { statement: 'Bats are blind', answer: false },
      { statement: 'Lightning can strike the same place twice', answer: true },
      { statement: 'Goldfish have a 3-second memory', answer: false },
      { statement: 'Mount Everest is the tallest mountain', answer: true },
      { statement: 'Penguins can fly', answer: false },
      { statement: 'The Great Wall of China is visible from space', answer: false },
      { statement: 'Sound travels through vacuum', answer: false },
      { statement: 'Humans and dinosaurs lived at the same time', answer: false },
    ],
    science: [
      { statement: 'Atoms are mostly empty space', answer: true },
      { statement: 'The speed of light is constant in all media', answer: false },
      { statement: 'DNA stands for Deoxyribonucleic Acid', answer: true },
      { statement: 'Electrons are positively charged', answer: false },
      { statement: 'The human body has 206 bones', answer: true },
      { statement: 'Plants breathe carbon dioxide during photosynthesis', answer: true },
      { statement: 'Pure water is a good conductor of electricity', answer: false },
      { statement: 'Vaccines contain weakened pathogens', answer: true },
      { statement: 'The Earth core is liquid', answer: false },
      { statement: 'All planets orbit the sun in the same direction', answer: true },
      { statement: 'Glass is a liquid', answer: false },
      { statement: 'Antibiotics work against viruses', answer: false },
      { statement: 'Diamonds are made of carbon', answer: true },
      { statement: 'The moon produces its own light', answer: false },
      { statement: 'Bacteria are all harmful to humans', answer: false },
    ],
    math: [
      { statement: 'Zero is an even number', answer: true },
      { statement: 'A prime number can only be divided by 1 and itself', answer: true },
      { statement: 'Pi equals exactly 3.14', answer: false },
      { statement: 'A triangle has 4 sides', answer: false },
      { statement: 'The sum of angles in a triangle is 180°', answer: true },
      { statement: 'Any number multiplied by zero equals zero', answer: true },
      { statement: 'A negative times a negative equals a negative', answer: false },
      { statement: 'The square root of 144 is 12', answer: true },
      { statement: 'One is a prime number', answer: false },
      { statement: 'A circle has infinite lines of symmetry', answer: true },
      { statement: 'Parallel lines never meet', answer: true },
      { statement: 'A dozen equals 10', answer: false },
      { statement: 'A pentagon has 6 sides', answer: false },
      { statement: 'The median is always equal to the mean', answer: false },
      { statement: '2 + 2 = 4', answer: true },
    ],
  };

  const getRandomQuestions = useCallback(() => {
    const questions = questionBanks[subject] || questionBanks.general;
    const numQuestions = difficultySettings[difficulty].questions;
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
  }, [difficulty, subject]);

  const [questions, setQuestions] = useState([]);

  const startGame = () => {
    const newQuestions = getRandomQuestions();
    setQuestions(newQuestions);
    setGameState('playing');
    setScore(0);
    setCorrectAnswers(0);
    setStreak(0);
    setBestStreak(0);
    setQuestionIndex(0);
    setCurrentQuestion(newQuestions[0]);
    setTimeLeft(difficultySettings[difficulty].timePerQuestion);
    setAnswered(false);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answer) => {
    if (answered) return;

    setAnswered(true);
    setSelectedAnswer(answer);

    const isCorrect = answer === currentQuestion.answer;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      let points = difficultySettings[difficulty].points;
      // Streak bonus
      if (newStreak >= 5) points += 10;
      if (newStreak >= 10) points += 20;
      // Time bonus in rapid mode
      if (rapidMode && timeLeft > 3) points += timeLeft * 2;

      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
    } else {
      setStreak(0);
    }

    // Move to next question after delay
    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setQuestionIndex(prev => prev + 1);
        setCurrentQuestion(questions[questionIndex + 1]);
        setTimeLeft(difficultySettings[difficulty].timePerQuestion);
        setAnswered(false);
        setSelectedAnswer(null);
      } else {
        endGame();
      }
    }, 1500);
  };

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && !answered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && !answered && timeLeft === 0) {
      // Auto-answer as wrong when time runs out
      handleAnswer(!currentQuestion.answer); // Wrong answer
    }
  }, [gameState, timeLeft, answered]);

  const endGame = async () => {
    setGameState('finished');
    
    try {
      const accuracy = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;
      
      await submitGameScore('true-false', {
        score,
        time_taken: questions.length * difficultySettings[difficulty].timePerQuestion,
        accuracy,
        answers_correct: correctAnswers,
        answers_total: questions.length,
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
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              True or False
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Quick quiz game - are these statements true or false?
            </p>
          </div>

          {/* Subject Selection */}
          <div className="mb-6">
            <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Subject
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['general', 'science', 'math'].map(subj => (
                <button
                  key={subj}
                  onClick={() => setSubject(subj)}
                  className={`p-3 rounded-lg font-medium capitalize ${
                    subject === subj
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-6">
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
                  <div className="text-xs mt-1">{difficultySettings[diff].questions} questions</div>
                </button>
              ))}
            </div>
          </div>

          {/* Rapid Mode Toggle */}
          <div className={`mb-8 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-orange-50'}`}>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rapidMode}
                onChange={(e) => setRapidMode(e.target.checked)}
                className="mr-3 w-5 h-5"
              />
              <div>
                <div className={`font-medium flex items-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  <Zap size={18} className="mr-2 text-orange-500" />
                  Rapid Mode
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Earn bonus points for quick answers!
                </div>
              </div>
            </label>
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
      <div className="max-w-4xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card text-center">
            <Trophy className="inline mb-1 text-yellow-500" size={20} />
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{score}</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Score</div>
          </div>

          <div className="card text-center">
            <Clock className="inline mb-1 text-blue-500" size={20} />
            <div className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-500' : theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {timeLeft}s
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Time</div>
          </div>

          <div className="card text-center">
            <Zap className="inline mb-1 text-orange-500" size={20} />
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{streak} 🔥</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Streak</div>
          </div>

          <div className="card text-center">
            <CheckCircle className="inline mb-1 text-green-500" size={20} />
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {questionIndex + 1}/{questions.length}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Question</div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card mb-6">
          <div className="text-center py-16">
            <div className={`text-3xl md:text-4xl font-bold mb-12 px-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {currentQuestion?.statement}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleAnswer(true)}
                disabled={answered}
                className={`px-16 py-8 rounded-2xl text-2xl font-bold transition-all transform hover:scale-105 ${
                  answered
                    ? selectedAnswer === true
                      ? currentQuestion.answer === true
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'opacity-50'
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl'
                }`}
              >
                <CheckCircle size={32} className="inline mr-3" />
                TRUE
              </button>

              <button
                onClick={() => handleAnswer(false)}
                disabled={answered}
                className={`px-16 py-8 rounded-2xl text-2xl font-bold transition-all transform hover:scale-105 ${
                  answered
                    ? selectedAnswer === false
                      ? currentQuestion.answer === false
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'opacity-50'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-xl'
                }`}
              >
                <XCircle size={32} className="inline mr-3" />
                FALSE
              </button>
            </div>

            {answered && (
              <div className={`mt-8 text-xl font-semibold ${
                selectedAnswer === currentQuestion.answer ? 'text-green-500' : 'text-red-500'
              }`}>
                {selectedAnswer === currentQuestion.answer ? '✓ Correct!' : '✗ Wrong!'}
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
            style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  // Results screen
  if (gameState === 'finished') {
    const accuracy = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
            <Trophy size={48} className="text-white" />
          </div>

          <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            Quiz Complete!
          </h2>
          <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            You answered {correctAnswers} out of {questions.length} correctly!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-orange-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{score}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Score</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{accuracy}%</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{bestStreak}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Best Streak</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{correctAnswers}/{questions.length}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Correct</div>
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

export default TrueFalse;