import React, { useState, useEffect, useCallback } from 'react';
import { Globe, Trophy, Clock, RotateCcw, Home, Map, MapPin } from 'lucide-react';
import { submitGameScore } from '../../../services/gamesApi';
import { useAppStore } from '../../../store/appStore';

const GeographyQuiz = ({ onExit }) => {
  const { theme } = useAppStore();
  const [gameState, setGameState] = useState('menu');
  const [difficulty, setDifficulty] = useState('easy');
  const [quizType, setQuizType] = useState('capitals');
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);

  const difficultySettings = {
    easy: { questions: 10, timePerQuestion: 15, points: 10 },
    medium: { questions: 15, timePerQuestion: 12, points: 20 },
    hard: { questions: 20, timePerQuestion: 10, points: 30 },
    expert: { questions: 25, timePerQuestion: 8, points: 50 },
  };

  // Geography question banks
  const questionBanks = {
    capitals: [
      { question: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin', 'Madrid'], correct: 1 },
      { question: 'What is the capital of Japan?', options: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'], correct: 2 },
      { question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correct: 2 },
      { question: 'What is the capital of Canada?', options: ['Toronto', 'Ottawa', 'Vancouver', 'Montreal'], correct: 1 },
      { question: 'What is the capital of Brazil?', options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], correct: 2 },
      { question: 'What is the capital of Egypt?', options: ['Alexandria', 'Cairo', 'Giza', 'Luxor'], correct: 1 },
      { question: 'What is the capital of India?', options: ['Mumbai', 'Kolkata', 'New Delhi', 'Bangalore'], correct: 2 },
      { question: 'What is the capital of Germany?', options: ['Munich', 'Frankfurt', 'Hamburg', 'Berlin'], correct: 3 },
      { question: 'What is the capital of Italy?', options: ['Milan', 'Rome', 'Venice', 'Florence'], correct: 1 },
      { question: 'What is the capital of Spain?', options: ['Barcelona', 'Madrid', 'Valencia', 'Seville'], correct: 1 },
      { question: 'What is the capital of Russia?', options: ['St. Petersburg', 'Moscow', 'Kazan', 'Novosibirsk'], correct: 1 },
      { question: 'What is the capital of China?', options: ['Shanghai', 'Hong Kong', 'Beijing', 'Guangzhou'], correct: 2 },
      { question: 'What is the capital of South Korea?', options: ['Busan', 'Seoul', 'Incheon', 'Daegu'], correct: 1 },
      { question: 'What is the capital of Mexico?', options: ['Guadalajara', 'Monterrey', 'Mexico City', 'Cancun'], correct: 2 },
      { question: 'What is the capital of Argentina?', options: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza'], correct: 0 },
      { question: 'What is the capital of Turkey?', options: ['Istanbul', 'Ankara', 'Izmir', 'Antalya'], correct: 1 },
      { question: 'What is the capital of South Africa?', options: ['Johannesburg', 'Cape Town', 'Pretoria', 'Durban'], correct: 2 },
      { question: 'What is the capital of Thailand?', options: ['Phuket', 'Chiang Mai', 'Bangkok', 'Pattaya'], correct: 2 },
      { question: 'What is the capital of Nigeria?', options: ['Lagos', 'Abuja', 'Kano', 'Ibadan'], correct: 1 },
      { question: 'What is the capital of Poland?', options: ['Krakow', 'Gdansk', 'Warsaw', 'Wroclaw'], correct: 2 },
    ],
    continents: [
      { question: 'Which continent is Brazil in?', options: ['Africa', 'South America', 'North America', 'Asia'], correct: 1 },
      { question: 'Which continent is Egypt in?', options: ['Africa', 'Asia', 'Europe', 'Middle East'], correct: 0 },
      { question: 'Which continent is India in?', options: ['Africa', 'Europe', 'Asia', 'Oceania'], correct: 2 },
      { question: 'Which continent is France in?', options: ['Asia', 'Europe', 'Africa', 'Australia'], correct: 1 },
      { question: 'Which continent is Australia in?', options: ['Asia', 'Africa', 'Oceania', 'Antarctica'], correct: 2 },
      { question: 'Which is the largest continent?', options: ['Africa', 'Asia', 'Europe', 'North America'], correct: 1 },
      { question: 'Which is the smallest continent?', options: ['Europe', 'Oceania', 'Antarctica', 'South America'], correct: 1 },
      { question: 'Which continent has the most countries?', options: ['Asia', 'Africa', 'Europe', 'South America'], correct: 1 },
      { question: 'Which continent is Iceland in?', options: ['Europe', 'North America', 'Asia', 'Arctic'], correct: 0 },
      { question: 'Which continent is Kenya in?', options: ['Asia', 'South America', 'Africa', 'Europe'], correct: 2 },
      { question: 'Which continent is Argentina in?', options: ['North America', 'South America', 'Europe', 'Africa'], correct: 1 },
      { question: 'Which continent is Saudi Arabia in?', options: ['Africa', 'Asia', 'Europe', 'Oceania'], correct: 1 },
      { question: 'Which continent is New Zealand in?', options: ['Asia', 'Australia', 'Oceania', 'Antarctica'], correct: 2 },
      { question: 'Which continent is Norway in?', options: ['Europe', 'Asia', 'North America', 'Arctic'], correct: 0 },
      { question: 'Which continent is Peru in?', options: ['North America', 'Central America', 'South America', 'Caribbean'], correct: 2 },
    ],
    oceans: [
      { question: 'What is the largest ocean?', options: ['Atlantic', 'Pacific', 'Indian', 'Arctic'], correct: 1 },
      { question: 'What is the smallest ocean?', options: ['Atlantic', 'Indian', 'Arctic', 'Southern'], correct: 2 },
      { question: 'Which ocean is west of Africa?', options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], correct: 1 },
      { question: 'Which ocean is east of Africa?', options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], correct: 2 },
      { question: 'Which ocean surrounds Antarctica?', options: ['Pacific', 'Atlantic', 'Southern', 'Arctic'], correct: 2 },
      { question: 'How many major oceans are there?', options: ['Three', 'Four', 'Five', 'Six'], correct: 2 },
      { question: 'Which ocean is between Asia and Americas?', options: ['Atlantic', 'Pacific', 'Indian', 'Arctic'], correct: 1 },
      { question: 'Which ocean is coldest?', options: ['Pacific', 'Atlantic', 'Arctic', 'Southern'], correct: 2 },
      { question: 'Which ocean is warmest?', options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], correct: 2 },
      { question: 'Which ocean borders Australia?', options: ['Atlantic', 'Pacific', 'Indian', 'Both B and C'], correct: 3 },
    ],
    landmarks: [
      { question: 'Where is the Eiffel Tower?', options: ['London', 'Paris', 'Rome', 'Berlin'], correct: 1 },
      { question: 'Where is the Great Wall?', options: ['Japan', 'Korea', 'China', 'Mongolia'], correct: 2 },
      { question: 'Where is the Taj Mahal?', options: ['Pakistan', 'India', 'Bangladesh', 'Nepal'], correct: 1 },
      { question: 'Where is the Statue of Liberty?', options: ['San Francisco', 'Boston', 'New York', 'Miami'], correct: 2 },
      { question: 'Where are the Pyramids of Giza?', options: ['Sudan', 'Egypt', 'Libya', 'Jordan'], correct: 1 },
      { question: 'Where is Machu Picchu?', options: ['Mexico', 'Bolivia', 'Peru', 'Chile'], correct: 2 },
      { question: 'Where is Big Ben?', options: ['Dublin', 'Edinburgh', 'London', 'Manchester'], correct: 2 },
      { question: 'Where is the Colosseum?', options: ['Athens', 'Rome', 'Venice', 'Milan'], correct: 1 },
      { question: 'Where is Christ the Redeemer statue?', options: ['Argentina', 'Chile', 'Brazil', 'Colombia'], correct: 2 },
      { question: 'Where is Angkor Wat?', options: ['Thailand', 'Vietnam', 'Cambodia', 'Laos'], correct: 2 },
      { question: 'Where is the Leaning Tower?', options: ['Rome', 'Venice', 'Pisa', 'Florence'], correct: 2 },
      { question: 'Where is Sydney Opera House?', options: ['New Zealand', 'Australia', 'Fiji', 'Indonesia'], correct: 1 },
      { question: 'Where is Mount Kilimanjaro?', options: ['Kenya', 'Tanzania', 'Uganda', 'Ethiopia'], correct: 1 },
      { question: 'Where is Petra?', options: ['Egypt', 'Jordan', 'Syria', 'Lebanon'], correct: 1 },
      { question: 'Where is Stonehenge?', options: ['Ireland', 'Scotland', 'Wales', 'England'], correct: 3 },
    ],
  };

  const getRandomQuestions = useCallback(() => {
    const bank = questionBanks[quizType] || questionBanks.capitals;
    const numQuestions = difficultySettings[difficulty].questions;
    const shuffled = [...bank].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
  }, [difficulty, quizType]);

  const startGame = () => {
    const newQuestions = getRandomQuestions();
    setQuestions(newQuestions);
    setCurrentQuestion(newQuestions[0]);
    setGameState('playing');
    setCurrentIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setStreak(0);
    setTimeLeft(difficultySettings[difficulty].timePerQuestion);
    setAnswered(false);
    setSelectedAnswer(null);
  };

  const handleAnswer = (optionIndex) => {
    if (answered) return;

    setAnswered(true);
    setSelectedAnswer(optionIndex);

    const isCorrect = optionIndex === currentQuestion.correct;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);

      let points = difficultySettings[difficulty].points;
      if (newStreak >= 5) points += 10;
      if (newStreak >= 10) points += 20;
      if (timeLeft > 5) points += timeLeft;

      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setCurrentQuestion(questions[currentIndex + 1]);
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
      handleAnswer(-1); // Wrong answer
    }
  }, [gameState, timeLeft, answered]);

  const endGame = async () => {
    setGameState('finished');
    
    try {
      const accuracy = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;
      
      await submitGameScore('geography-quiz', {
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

  const getQuizIcon = () => {
    switch(quizType) {
      case 'capitals': return <MapPin size={40} className="text-white" />;
      case 'continents': return <Globe size={40} className="text-white" />;
      case 'oceans': return <Map size={40} className="text-white" />;
      case 'landmarks': return <MapPin size={40} className="text-white" />;
      default: return <Globe size={40} className="text-white" />;
    }
  };

  // Menu screen
  if (gameState === 'menu') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <Globe size={40} className="text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              Geography Quiz
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Test your knowledge of world geography!
            </p>
          </div>

          {/* Quiz Type */}
          <div className="mb-6">
            <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Quiz Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'capitals', label: 'Capitals', icon: MapPin },
                { id: 'continents', label: 'Continents', icon: Globe },
                { id: 'oceans', label: 'Oceans', icon: Map },
                { id: 'landmarks', label: 'Landmarks', icon: MapPin },
              ].map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setQuizType(type.id)}
                    className={`p-3 rounded-lg font-medium capitalize ${
                      quizType === type.id
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={20} className="inline mr-2" />
                    {type.label}
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
                  <div className="text-xs mt-1">{difficultySettings[diff].questions} questions</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={startGame} className="btn btn-primary flex-1 py-4 text-lg">
              Start Quiz
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
            <Globe className="inline mb-1 text-teal-500" size={20} />
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{streak} 🔥</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Streak</div>
          </div>

          <div className="card text-center">
            <MapPin className="inline mb-1 text-purple-500" size={20} />
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {currentIndex + 1}/{questions.length}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Question</div>
          </div>
        </div>

        {/* Question */}
        <div className="card mb-6">
          <div className="text-center py-8">
            <div className={`text-2xl md:text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {currentQuestion?.question}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                  className={`p-4 rounded-xl text-lg font-medium transition-all transform hover:scale-105 ${
                    answered
                      ? index === currentQuestion.correct
                        ? 'bg-green-500 text-white'
                        : index === selectedAnswer
                          ? 'bg-red-500 text-white'
                          : 'opacity-50 ' + (theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700')
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
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
            Great geography knowledge!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-teal-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{score}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Score</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{accuracy}%</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{streak}</div>
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

export default GeographyQuiz;