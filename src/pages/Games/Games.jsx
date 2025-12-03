import React, { useState } from 'react';
import { Calculator, Brain, Shuffle, CheckCircle, Keyboard, Globe, FlaskConical, Atom, Microscope, Trophy, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import QuickMath from './components/QuickMath';
import MemoryMatch from './components/MemoryMatch';
import WordScramble from './components/WordScramble';
import TrueFalse from './components/TrueFalse';
import TypeRace from './components/TypeRace';
import GeographyQuiz from './components/GeographyQuiz';
import ChemistryMatch from './components/ChemistryMatch';
import PhysicsChallenge from './components/PhysicsChallenge';
import BiologyExplorer from './components/BiologyExplorer';

const Games = () => {
  const { theme } = useAppStore();
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    {
      id: 'quick-math',
      title: 'Quick Math',
      description: 'Test your arithmetic skills with timed challenges',
      icon: Calculator,
      color: 'from-blue-500 to-blue-600',
      component: QuickMath,
      available: true,
      category: 'general',
    },
    {
      id: 'memory-match',
      title: 'Memory Match',
      description: 'Match all the pairs as quickly as possible',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      component: MemoryMatch,
      available: true,
      category: 'general',
    },
    {
      id: 'word-scramble',
      title: 'Word Scramble',
      description: 'Unscramble educational vocabulary words',
      icon: Shuffle,
      color: 'from-green-500 to-green-600',
      component: WordScramble,
      available: true,
      category: 'general',
    },
    {
      id: 'true-false',
      title: 'True or False',
      description: 'Quick quiz game with subject-based questions',
      icon: CheckCircle,
      color: 'from-orange-500 to-orange-600',
      component: TrueFalse,
      available: true,
      category: 'general',
    },
    {
      id: 'type-race',
      title: 'Type Race',
      description: 'Educational typing game with speed tracking',
      icon: Keyboard,
      color: 'from-pink-500 to-pink-600',
      component: TypeRace,
      available: true,
      category: 'general',
    },
    {
      id: 'geography-quiz',
      title: 'Geography Quiz',
      description: 'Test your world geography knowledge',
      icon: Globe,
      color: 'from-teal-500 to-teal-600',
      component: GeographyQuiz,
      available: true,
      category: 'subject',
    },
    {
      id: 'chemistry-match',
      title: 'Chemistry Match',
      description: 'Match elements, compounds, and reactions',
      icon: FlaskConical,
      color: 'from-cyan-500 to-cyan-600',
      component: ChemistryMatch,
      available: true,
      category: 'subject',
    },
    {
      id: 'physics-challenge',
      title: 'Physics Challenge',
      description: 'Answer questions on mechanics, energy, and more',
      icon: Atom,
      color: 'from-indigo-500 to-indigo-600',
      component: PhysicsChallenge,
      available: true,
      category: 'subject',
    },
    {
      id: 'biology-explorer',
      title: 'Biology Explorer',
      description: 'Explore cells, body systems, and ecosystems',
      icon: Microscope,
      color: 'from-emerald-500 to-emerald-600',
      component: BiologyExplorer,
      available: true,
      category: 'subject',
    },
  ];

  const handlePlayGame = (game) => {
    if (game.available && game.component) {
      setActiveGame(game);
    }
  };

  if (activeGame) {
    const GameComponent = activeGame.component;
    return <GameComponent onExit={() => setActiveGame(null)} />;
  }

  const generalGames = games.filter(g => g.category === 'general');
  const subjectGames = games.filter(g => g.category === 'subject');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            Educational Games
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Learn while having fun with interactive educational games
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
          <Trophy size={20} />
          <span className="font-semibold">9 Games Available</span>
        </div>
      </div>

      {/* General Games */}
      <div>
        <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          General Games
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generalGames.map((game) => {
            const Icon = game.icon;
            
            return (
              <div
                key={game.id}
                className="card relative overflow-hidden transition-all hover:shadow-xl cursor-pointer"
                onClick={() => handlePlayGame(game)}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon size={32} className="text-white" />
                </div>

                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  {game.title}
                </h3>
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {game.description}
                </p>

                <button className="btn btn-primary w-full">
                  Play Now
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject Games */}
      <div>
        <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          Subject-Specific Games
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjectGames.map((game) => {
            const Icon = game.icon;
            
            return (
              <div
                key={game.id}
                className="card relative overflow-hidden transition-all hover:shadow-xl cursor-pointer"
                onClick={() => handlePlayGame(game)}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon size={32} className="text-white" />
                </div>

                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  {game.title}
                </h3>
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {game.description}
                </p>

                <button className="btn btn-primary w-full">
                  Play Now
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Card */}
      <div className={`card ${theme === 'dark' ? 'bg-gradient-to-r from-purple-900 to-blue-900' : 'bg-gradient-to-r from-purple-50 to-blue-50'}`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h3 className={`font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              Complete Learning Platform
            </h3>
            <ul className={`space-y-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>✓ 5 general skill-building games</li>
              <li>✓ 4 subject-specific educational games</li>
              <li>✓ Track your progress with scores and leaderboards</li>
              <li>✓ Compete with classmates for top rankings</li>
              <li>✓ All games support multiple difficulty levels</li>
              <li>✓ Learn Geography, Chemistry, Physics, and Biology</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;