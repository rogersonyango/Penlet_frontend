import React, { useState } from 'react';
import { Calculator, Brain, Shuffle, CheckCircle, Keyboard, Trophy, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import QuickMath from './components/QuickMath';
import MemoryMatch from './components/MemoryMatch';
import WordScramble from './components/WordScramble';
import TrueFalse from './components/TrueFalse';
import TypeRace from './components/TypeRace';

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
      bgLight: 'bg-blue-50',
      bgDark: 'bg-blue-900 bg-opacity-20',
      component: QuickMath,
      available: true,
    },
    {
      id: 'memory-match',
      title: 'Memory Match',
      description: 'Match all the pairs as quickly as possible',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      bgDark: 'bg-purple-900 bg-opacity-20',
      component: MemoryMatch,
      available: true,
    },
    {
      id: 'word-scramble',
      title: 'Word Scramble',
      description: 'Unscramble educational vocabulary words',
      icon: Shuffle,
      color: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50',
      bgDark: 'bg-green-900 bg-opacity-20',
      component: WordScramble,
      available: true,
    },
    {
      id: 'true-false',
      title: 'True or False',
      description: 'Quick quiz game with subject-based questions',
      icon: CheckCircle,
      color: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      bgDark: 'bg-orange-900 bg-opacity-20',
      component: TrueFalse,
      available: true,
    },
    {
      id: 'type-race',
      title: 'Type Race',
      description: 'Educational typing game with speed tracking',
      icon: Keyboard,
      color: 'from-pink-500 to-pink-600',
      bgLight: 'bg-pink-50',
      bgDark: 'bg-pink-900 bg-opacity-20',
      component: TypeRace,
      available: true,
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

  return (
    <div className="space-y-6">
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
          <span className="font-semibold">5 Games Available</span>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => {
          const Icon = game.icon;
          
          return (
            <div
              key={game.id}
              className={`card relative overflow-hidden transition-all hover:shadow-xl ${
                game.available ? 'cursor-pointer' : 'opacity-60'
              }`}
              onClick={() => handlePlayGame(game)}
            >
              {/* Availability Badge */}
              {!game.available && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium dark:bg-yellow-900 dark:text-yellow-300">
                  Coming Soon
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon size={32} className="text-white" />
              </div>

              {/* Title & Description */}
              <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                {game.title}
              </h3>
              <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {game.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  Educational
                </span>
                <span className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  Score Tracking
                </span>
                <span className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  Leaderboard
                </span>
              </div>

              {/* Play Button */}
              {game.available ? (
                <button className="btn btn-primary w-full">
                  Play Now
                </button>
              ) : (
                <button
                  disabled
                  className={`w-full py-2 rounded-lg font-medium ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Coming Soon
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Card */}
      <div className={`card ${theme === 'dark' ? 'bg-gradient-to-r from-purple-900 to-blue-900' : 'bg-gradient-to-r from-purple-50 to-blue-50'}`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h3 className={`font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              How It Works
            </h3>
            <ul className={`space-y-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>✓ Play educational games to reinforce learning</li>
              <li>✓ Earn scores and compete on leaderboards</li>
              <li>✓ Track your progress and improvement over time</li>
              <li>✓ Unlock achievements as you master each game</li>
              <li>✓ All scores are saved to your profile</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;