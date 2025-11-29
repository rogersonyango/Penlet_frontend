import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  Target, 
  Clock, 
  Star,
  Award,
  TrendingUp,
  Play,
  Filter,
  Crown
} from 'lucide-react';
import {
  getGames,
  getUserStatistics,
  getUserAchievements,
  getLeaderboard
} from '../../services/gamesApi';
import toast from 'react-hot-toast';

const Games = () => {
  const [games, setGames] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState(null);

  useEffect(() => {
    fetchGames();
    fetchStatistics();
    fetchAchievements();
  }, [categoryFilter, difficultyFilter]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await getGames({
        category: categoryFilter,
        difficulty: difficultyFilter
      });
      setGames(data.games);
    } catch (error) {
      toast.error('Failed to load games');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await getUserStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const data = await getUserAchievements();
      setAchievements(data.achievements);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  };

  const handlePlayGame = (game) => {
    // This would navigate to the actual game
    toast.success(`Starting ${game.title}...`);
    // In a real implementation, you'd navigate to the game component
    // navigate(`/games/play/${game.id}`)
  };

  const handleViewLeaderboard = async (game) => {
    try {
      const data = await getLeaderboard(game.id);
      setLeaderboard(data);
      setSelectedGame(game);
      setShowLeaderboard(true);
    } catch (error) {
      toast.error('Failed to load leaderboard');
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-blue-100 text-blue-800',
      hard: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || colors.medium;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      math: '🔢',
      science: '🔬',
      language: '📚',
      geography: '🌍',
      history: '📜',
      quiz: '❓',
      memory: '🧠',
      puzzle: '🧩',
      typing: '⌨️',
      general: '🎮'
    };
    return icons[category] || icons.general;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins > 0) return `${mins}m`;
    return `${seconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Educational Games</h1>
        <p className="text-gray-600 mt-1">Learn while having fun!</p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Gamepad2 size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Games Played</p>
                <p className="text-2xl font-bold">{statistics.games_played}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold">{statistics.average_score.toFixed(0)}%</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Trophy size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Perfect Scores</p>
                <p className="text-2xl font-bold">{statistics.perfect_scores}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Achievements</p>
                <p className="text-2xl font-bold">{statistics.achievements_unlocked}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-3">
          <select
            value={categoryFilter || ''}
            onChange={(e) => setCategoryFilter(e.target.value || null)}
            className="input"
          >
            <option value="">All Categories</option>
            <option value="math">Math</option>
            <option value="science">Science</option>
            <option value="language">Language</option>
            <option value="geography">Geography</option>
            <option value="history">History</option>
            <option value="quiz">Quiz</option>
            <option value="memory">Memory</option>
            <option value="puzzle">Puzzle</option>
            <option value="typing">Typing</option>
          </select>

          <select
            value={difficultyFilter || ''}
            onChange={(e) => setDifficultyFilter(e.target.value || null)}
            className="input"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      {/* Games Grid - Preserving original styling */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : games.length === 0 ? (
        <div className="card text-center py-12">
          <Gamepad2 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No games found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map(game => (
            <div key={game.id} className="card hover:shadow-lg transition-shadow">
              {/* Icon and Title */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
                  {getCategoryIcon(game.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg">{game.title}</h3>
                    {game.is_featured && (
                      <Crown size={20} className="text-yellow-500 fill-current flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{game.description}</p>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
                <div className="p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                    <Play size={14} />
                  </div>
                  <p className="text-gray-600">Plays</p>
                  <p className="font-semibold">{game.play_count}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                    <TrendingUp size={14} />
                  </div>
                  <p className="text-gray-600">Avg</p>
                  <p className="font-semibold">{game.average_score.toFixed(0)}%</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                    <Target size={14} />
                  </div>
                  <p className="text-gray-600">Rate</p>
                  <p className="font-semibold">{game.completion_rate.toFixed(0)}%</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className={`text-sm px-3 py-1 rounded-full ${getDifficultyColor(game.difficulty)}`}>
                  {game.difficulty}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewLeaderboard(game)}
                    className="btn btn-sm text-sm"
                  >
                    Leaderboard
                  </button>
                  <button
                    onClick={() => handlePlayGame(game)}
                    className="btn btn-primary btn-sm"
                  >
                    Play Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && leaderboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{leaderboard.game_title}</h2>
                  <p className="text-gray-600">Top {leaderboard.entries.length} Players</p>
                </div>
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {leaderboard.user_rank && (
                <div className="card bg-primary-50 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-primary-900">Your Rank:</span>
                    <span className="text-2xl font-bold text-primary-600">#{leaderboard.user_rank}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {leaderboard.entries.map((entry, idx) => (
                  <div
                    key={entry.user_id}
                    className={`flex items-center gap-4 p-4 rounded-lg ${
                      idx === 0 ? 'bg-yellow-50 border-2 border-yellow-300' :
                      idx === 1 ? 'bg-gray-50 border-2 border-gray-300' :
                      idx === 2 ? 'bg-orange-50 border-2 border-orange-300' :
                      'bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl font-bold w-12 text-center">
                      {idx === 0 ? '🥇' :
                       idx === 1 ? '🥈' :
                       idx === 2 ? '🥉' :
                       `#${entry.rank}`}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Player {entry.user_id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">
                        {entry.time_taken && `⏱️ ${formatTime(entry.time_taken)}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">{entry.score}</p>
                      <p className="text-sm text-gray-600">{entry.percentage.toFixed(0)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.slice(0, 6).map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 ${
                  achievement.is_unlocked
                    ? 'bg-yellow-50 border-yellow-300'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">
                    {achievement.is_unlocked ? '🏆' : '🔒'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{achievement.current_progress}/{achievement.target_progress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${(achievement.current_progress / achievement.target_progress) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Games;