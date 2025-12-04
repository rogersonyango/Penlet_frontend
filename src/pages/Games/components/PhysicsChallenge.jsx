import React, { useState, useEffect, useCallback } from 'react';
import { Atom, Trophy, Clock, RotateCcw, Home, Zap, Activity } from 'lucide-react';
import { submitGameScore } from '../../../services/gamesApi';
import { useAppStore } from '../../../store/appStore';

const PhysicsChallenge = ({ onExit }) => {
  const { theme } = useAppStore();
  const [gameState, setGameState] = useState('menu');
  const [difficulty, setDifficulty] = useState('easy');
  const [topic, setTopic] = useState('mechanics');
  
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

  const questionBanks = {
    mechanics: [
      { question: 'What is the formula for force?', options: ['F = ma', 'F = mv', 'F = m/a', 'F = a/m'], correct: 0 },
      { question: 'What is the SI unit of force?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correct: 1 },
      { question: 'What causes acceleration?', options: ['Velocity', 'Force', 'Mass', 'Energy'], correct: 1 },
      { question: 'What is inertia?', options: ['Resistance to motion change', 'Speed', 'Force', 'Energy'], correct: 0 },
      { question: 'What is gravitational acceleration on Earth?', options: ['8.8 m/s²', '9.8 m/s²', '10.8 m/s²', '11.8 m/s²'], correct: 1 },
      { question: 'What is momentum formula?', options: ['p = mv', 'p = ma', 'p = Ft', 'p = m/v'], correct: 0 },
      { question: 'What is friction?', options: ['Pushing force', 'Opposing force', 'Gravitational force', 'Magnetic force'], correct: 1 },
      { question: 'What is work formula?', options: ['W = Fd', 'W = Ft', 'W = ma', 'W = mv'], correct: 0 },
      { question: 'What is pressure formula?', options: ['P = F/A', 'P = FA', 'P = A/F', 'P = F+A'], correct: 0 },
      { question: "What is Newton's First Law?", options: ['Object at rest stays at rest', 'F = ma', 'Action-reaction', 'Gravity'], correct: 0 },
      { question: 'What is terminal velocity?', options: ['Maximum falling speed', 'Initial speed', 'Zero speed', 'Light speed'], correct: 0 },
      { question: 'What affects gravitational force?', options: ['Mass and distance', 'Only mass', 'Only distance', 'Temperature'], correct: 0 },
      { question: 'What is centripetal force?', options: ['Force toward center', 'Force outward', 'Friction force', 'Gravity only'], correct: 0 },
      { question: 'What is torque?', options: ['Rotational force', 'Linear force', 'Magnetic force', 'Electric force'], correct: 0 },
      { question: 'What is equilibrium?', options: ['Net force is zero', 'Moving fast', 'At rest', 'Accelerating'], correct: 0 },
    ],
    energy: [
      { question: 'What is kinetic energy formula?', options: ['KE = ½mv²', 'KE = mv', 'KE = mgh', 'KE = ½mh'], correct: 0 },
      { question: 'What is potential energy formula?', options: ['PE = mgh', 'PE = ½mv²', 'PE = Fd', 'PE = ma'], correct: 0 },
      { question: 'What is the law of energy conservation?', options: ['Energy cannot be created or destroyed', 'Energy can be created', 'Energy disappears', 'Energy increases'], correct: 0 },
      { question: 'What is power?', options: ['Energy per time', 'Force per time', 'Mass per time', 'Distance per time'], correct: 0 },
      { question: 'What is the SI unit of energy?', options: ['Watt', 'Joule', 'Newton', 'Pascal'], correct: 1 },
      { question: 'What is the SI unit of power?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correct: 2 },
      { question: 'What type of energy does a moving car have?', options: ['Potential', 'Kinetic', 'Chemical', 'Nuclear'], correct: 1 },
      { question: 'What type of energy does a raised object have?', options: ['Kinetic', 'Potential', 'Thermal', 'Light'], correct: 1 },
      { question: 'What is thermal energy?', options: ['Heat energy', 'Light energy', 'Sound energy', 'Chemical energy'], correct: 0 },
      { question: 'What is mechanical energy?', options: ['KE + PE', 'Only KE', 'Only PE', 'Thermal energy'], correct: 0 },
      { question: 'What is efficiency?', options: ['Output/Input', 'Input/Output', 'Output + Input', 'Output - Input'], correct: 0 },
      { question: 'What is renewable energy?', options: ['Can be replenished', 'Limited resource', 'Non-reusable', 'Fossil fuel'], correct: 0 },
      { question: 'What converts chemical to electrical energy?', options: ['Battery', 'Motor', 'Generator', 'Transformer'], correct: 0 },
      { question: 'What is nuclear energy from?', options: ['Splitting atoms', 'Burning fuel', 'Moving water', 'Wind'], correct: 0 },
      { question: 'What is elastic potential energy?', options: ['Stored in stretched/compressed objects', 'Moving objects', 'Hot objects', 'Falling objects'], correct: 0 },
    ],
    waves: [
      { question: 'What is the speed of light?', options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10⁷ m/s', '3×10⁹ m/s'], correct: 0 },
      { question: 'What is frequency?', options: ['Waves per second', 'Wave height', 'Wave speed', 'Wave length'], correct: 0 },
      { question: 'What is wavelength?', options: ['Distance between waves', 'Wave height', 'Wave speed', 'Wave frequency'], correct: 0 },
      { question: 'What is amplitude?', options: ['Wave height', 'Wave length', 'Wave speed', 'Wave frequency'], correct: 0 },
      { question: 'What is the relationship: v = fλ?', options: ['Speed = frequency × wavelength', 'Speed = frequency + wavelength', 'Speed = frequency / wavelength', 'Speed = frequency - wavelength'], correct: 0 },
      { question: 'What type of wave needs a medium?', options: ['Sound', 'Light', 'Radio', 'X-ray'], correct: 0 },
      { question: 'What type of wave does not need a medium?', options: ['Sound', 'Seismic', 'Electromagnetic', 'Water'], correct: 2 },
      { question: 'What is refraction?', options: ['Bending of waves', 'Reflection of waves', 'Absorption of waves', 'Creation of waves'], correct: 0 },
      { question: 'What is the Doppler effect?', options: ['Frequency change due to motion', 'Wave speed change', 'Wave height change', 'Wave creation'], correct: 0 },
      { question: 'What color has longest wavelength?', options: ['Violet', 'Blue', 'Green', 'Red'], correct: 3 },
      { question: 'What color has highest frequency?', options: ['Red', 'Yellow', 'Green', 'Violet'], correct: 3 },
      { question: 'What is an echo?', options: ['Reflected sound', 'Absorbed sound', 'Refracted sound', 'Created sound'], correct: 0 },
      { question: 'What determines pitch of sound?', options: ['Frequency', 'Amplitude', 'Speed', 'Wavelength only'], correct: 0 },
      { question: 'What determines loudness of sound?', options: ['Amplitude', 'Frequency', 'Speed', 'Wavelength'], correct: 0 },
      { question: 'What is resonance?', options: ['Matching frequencies vibrate', 'Waves cancel', 'Waves reflect', 'Waves refract'], correct: 0 },
    ],
    electricity: [
      { question: 'What is electric current?', options: ['Flow of charge', 'Amount of charge', 'Electric force', 'Electric energy'], correct: 0 },
      { question: 'What is the SI unit of current?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], correct: 1 },
      { question: 'What is voltage?', options: ['Potential difference', 'Current', 'Resistance', 'Power'], correct: 0 },
      { question: 'What is the SI unit of voltage?', options: ['Ampere', 'Volt', 'Ohm', 'Watt'], correct: 1 },
      { question: 'What is resistance?', options: ['Opposition to current', 'Flow of current', 'Amount of current', 'Speed of current'], correct: 0 },
      { question: 'What is the SI unit of resistance?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], correct: 2 },
      { question: "What is Ohm's Law?", options: ['V = IR', 'I = VR', 'R = VI', 'V = I/R'], correct: 0 },
      { question: 'What is electric power formula?', options: ['P = VI', 'P = V/I', 'P = I/V', 'P = V+I'], correct: 0 },
      { question: 'What is a conductor?', options: ['Allows current flow', 'Blocks current', 'Stores charge', 'Creates current'], correct: 0 },
      { question: 'What is an insulator?', options: ['Blocks current', 'Allows current', 'Stores charge', 'Creates current'], correct: 0 },
      { question: 'What is a series circuit?', options: ['One path for current', 'Multiple paths', 'No current flow', 'Parallel connections'], correct: 0 },
      { question: 'What is a parallel circuit?', options: ['Multiple paths for current', 'One path', 'No current', 'Series connection'], correct: 0 },
      { question: 'What stores electrical energy?', options: ['Capacitor', 'Resistor', 'Wire', 'Switch'], correct: 0 },
      { question: 'What converts electrical to mechanical energy?', options: ['Motor', 'Generator', 'Battery', 'Capacitor'], correct: 0 },
      { question: 'What converts mechanical to electrical energy?', options: ['Generator', 'Motor', 'Battery', 'Resistor'], correct: 0 },
    ],
  };

  const getRandomQuestions = useCallback(() => {
    const bank = questionBanks[topic];
    const numQuestions = difficultySettings[difficulty].questions;
    const shuffled = [...bank].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
  }, [difficulty, topic]);

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

  useEffect(() => {
    if (gameState === 'playing' && !answered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && !answered && timeLeft === 0) {
      handleAnswer(-1);
    }
  }, [gameState, timeLeft, answered]);

  const endGame = async () => {
    setGameState('finished');
    
    try {
      const accuracy = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;
      
      await submitGameScore('physics-challenge', {
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

  if (gameState === 'menu') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Atom size={40} className="text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              Physics Challenge
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Test your physics knowledge across multiple topics!
            </p>
          </div>

          <div className="mb-6">
            <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Topic
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'mechanics', label: 'Mechanics', icon: Activity },
                { id: 'energy', label: 'Energy', icon: Zap },
                { id: 'waves', label: 'Waves', icon: Activity },
                { id: 'electricity', label: 'Electricity', icon: Zap },
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTopic(t.id)}
                    className={`p-3 rounded-lg font-medium capitalize ${
                      topic === t.id
                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={20} className="inline mr-2" />
                    {t.label}
                  </button>
                );
              })}
            </div>
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
              Start Challenge
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

  if (gameState === 'playing') {
    return (
      <div className="max-w-4xl mx-auto p-6">
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
            <Zap className="inline mb-1 text-indigo-500" size={20} />
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{streak} 🔥</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Streak</div>
          </div>
          <div className="card text-center">
            <Atom className="inline mb-1 text-purple-500" size={20} />
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {currentIndex + 1}/{questions.length}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Question</div>
          </div>
        </div>

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

        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const accuracy = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
            <Trophy size={48} className="text-white" />
          </div>

          <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            Challenge Complete!
          </h2>
          <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Great physics knowledge!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-50'}`}>
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

export default PhysicsChallenge;