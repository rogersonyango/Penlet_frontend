import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target,
  Clock,
  Award,
  BookOpen,
  Video,
  FileText,
  Gamepad2,
  Zap,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  Trophy,
  Flame
} from 'lucide-react';
import {
  getDashboard,
  getTimeSeriesData,
  getSubjectAnalytics,
  getGoals,
  getInsights
} from '../../services/analyticsApi';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [goals, setGoals] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState(30);
  const [selectedMetric, setSelectedMetric] = useState('study_time');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [dashData, subjectsData, goalsData, insightsData] = await Promise.all([
        getDashboard(),
        getSubjectAnalytics(),
        getGoals(true),
        getInsights()
      ]);
      
      setDashboard(dashData);
      setSubjects(subjectsData.subjects);
      setGoals(goalsData.goals);
      setInsights(insightsData);
    } catch (error) {
      toast.error('Failed to load analytics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const getMasteryColor = (level) => {
    const colors = {
      beginner: 'bg-gray-100 text-gray-800',
      intermediate: 'bg-blue-100 text-blue-800',
      advanced: 'bg-purple-100 text-purple-800',
      expert: 'bg-yellow-100 text-yellow-800'
    };
    return colors[level] || colors.beginner;
  };

  const getInsightIcon = (type) => {
    const icons = {
      trend: <TrendingUp size={20} />,
      warning: <Zap size={20} />,
      suggestion: <Lightbulb size={20} />,
      achievement: <Trophy size={20} />
    };
    return icons[type] || icons.suggestion;
  };

  const getInsightColor = (color) => {
    const colors = {
      green: 'bg-green-50 border-green-200 text-green-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800'
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="card text-center py-12">
        <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No data yet</h3>
        <p className="text-gray-600">Start studying to see your analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your progress and performance</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Study Time</p>
              <p className="text-2xl font-bold">{formatTime(dashboard.total_study_time_minutes)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Activities</p>
              <p className="text-2xl font-bold">{dashboard.total_activities}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Flame size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold">{dashboard.current_streak} days</p>
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
              <p className="text-2xl font-bold">{dashboard.overall_avg_score.toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* This Week Summary */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar size={24} />
          This Week
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Study Time</p>
            <p className="text-3xl font-bold text-blue-600">{formatTime(dashboard.week_study_time)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Activities Completed</p>
            <p className="text-3xl font-bold text-purple-600">{dashboard.week_activities}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Average Score</p>
            <p className="text-3xl font-bold text-green-600">{dashboard.week_avg_score.toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* Insights & Achievements */}
      {insights && (insights.insights.length > 0 || insights.achievements.length > 0 || insights.recommendations.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Insights */}
          {insights.insights.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Lightbulb size={24} />
                Insights
              </h2>
              <div className="space-y-3">
                {insights.insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${getInsightColor(insight.color)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{insight.title}</h3>
                        <p className="text-sm mt-1">{insight.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements & Recommendations */}
          <div className="space-y-6">
            {insights.achievements.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Trophy size={24} className="text-yellow-600" />
                  Achievements
                </h2>
                <div className="space-y-2">
                  {insights.achievements.map((achievement, idx) => (
                    <div key={idx} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {insights.recommendations.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Zap size={24} className="text-blue-600" />
                  Recommendations
                </h2>
                <ul className="space-y-2">
                  {insights.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Subjects */}
      {dashboard.top_subjects.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen size={24} />
            Top Subjects
          </h2>
          <div className="space-y-3">
            {dashboard.top_subjects.map((subject, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 text-center font-bold text-2xl text-gray-400">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{subject.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getMasteryColor(subject.mastery)}`}>
                      {subject.mastery}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatTime(subject.time)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target size={14} />
                      {subject.score.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Goals */}
      {goals.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target size={24} />
            Active Goals
          </h2>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                    )}
                  </div>
                  <span className="text-2xl font-bold text-primary-600">
                    {goal.completion_percentage.toFixed(0)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(goal.completion_percentage, 100)}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{goal.current_value.toFixed(0)} / {goal.target_value} {goal.target_unit}</span>
                  <span className="capitalize">{goal.period}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {dashboard.recent_events.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity size={24} />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {dashboard.recent_events.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="mt-1">
                  {event.event_type === 'video_watched' && <Video size={18} className="text-purple-600" />}
                  {event.event_type === 'quiz_completed' && <FileText size={18} className="text-green-600" />}
                  {event.event_type === 'note_created' && <BookOpen size={18} className="text-blue-600" />}
                  {event.event_type === 'game_played' && <Gamepad2 size={18} className="text-orange-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {event.event_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    {event.subject_name && ` - ${event.subject_name}`}
                  </p>
                  {event.score !== null && (
                    <p className="text-xs text-gray-600 mt-1">Score: {event.score.toFixed(0)}%</p>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(event.event_timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;