"use client";

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import TimetableHeader from '../../components/timetable/TimetableHeader';
import TimeSlotCard from '../../components/timetable/TimeSlotCard';
import { useWeeklyTimetable } from '../../hooks/timetable';
import { dayOrder, getWeekStart } from '../../utils/date';

const MOCK_USER_ID = 1;

export default function TimetablePage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart());
  const { slots, loading, error } = useWeeklyTimetable(MOCK_USER_ID);

  const filteredSlots = useMemo(() => slots, [slots]);

  const groupedSlots = useMemo(() => {
    return filteredSlots.reduce((acc, slot) => {
      const day = slot.day_of_week.toLowerCase();
      if (!acc[day]) acc[day] = [];
      acc[day].push(slot);
      return acc;
    }, {});
  }, [filteredSlots]);

  const sortedDays = Object.keys(groupedSlots).sort(
    (a, b) => dayOrder[a] - dayOrder[b]
  );

  const nextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const prevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const weekLabel = `${currentWeekStart.toLocaleDateString()} – ${new Date(
    currentWeekStart.getTime() + 6 * 86400000
  ).toLocaleDateString()}`;

  // Day color schemes
  const dayColors = {
    monday: { border: 'border-purple-400', bg: 'from-purple-50 to-purple-100', header: 'bg-gradient-to-r from-purple-500 to-purple-600', emoji: '🌟' },
    tuesday: { border: 'border-pink-400', bg: 'from-pink-50 to-pink-100', header: 'bg-gradient-to-r from-pink-500 to-pink-600', emoji: '🔥' },
    wednesday: { border: 'border-yellow-400', bg: 'from-yellow-50 to-yellow-100', header: 'bg-gradient-to-r from-yellow-500 to-yellow-600', emoji: '⚡' },
    thursday: { border: 'border-green-400', bg: 'from-green-50 to-green-100', header: 'bg-gradient-to-r from-green-500 to-green-600', emoji: '🚀' },
    friday: { border: 'border-cyan-400', bg: 'from-cyan-50 to-cyan-100', header: 'bg-gradient-to-r from-cyan-500 to-cyan-600', emoji: '🎉' },
    saturday: { border: 'border-purple-400', bg: 'from-purple-50 to-purple-100', header: 'bg-gradient-to-r from-purple-500 to-purple-600', emoji: '🌈' },
    sunday: { border: 'border-pink-400', bg: 'from-pink-50 to-pink-100', header: 'bg-gradient-to-r from-pink-500 to-pink-600', emoji: '☀️' },
  };

  // Count total classes
  const totalClasses = filteredSlots.length;
  const daysWithClasses = sortedDays.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-purple-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Loading your timetable...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-red-400 animate-shake max-w-md">
          <div className="text-6xl mb-4 text-center">⚠️</div>
          <p className="text-xl font-bold text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-purple-300">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-transparent bg-clip-text">
                  📅 Weekly Timetable
                </h1>
                <p className="text-gray-600 text-sm sm:text-base font-bold">
                  {weekLabel}
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={prevWeek}
                className="flex-1 sm:flex-none px-6 py-3 bg-white border-3 border-purple-300 text-purple-700 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-sm sm:text-base hover:border-purple-400"
              >
                ← Prev Week
              </button>

              <button
                onClick={nextWeek}
                className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-sm sm:text-base"
              >
                Next Week →
              </button>

              <Link
                to="/timetable/create"
                className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-sm sm:text-base text-center"
              >
                ➕ New Class
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        {totalClasses > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 animate-slideUp">
            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-purple-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2 text-center">📚</div>
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  {totalClasses}
                </div>
                <div className="text-gray-600 font-bold text-sm">Total Classes</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-green-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2 text-center">🗓️</div>
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-cyan-600 text-transparent bg-clip-text">
                  {daysWithClasses}
                </div>
                <div className="text-gray-600 font-bold text-sm">Active Days</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-yellow-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2 text-center">⏰</div>
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 text-transparent bg-clip-text">
                  {Math.round(totalClasses / Math.max(daysWithClasses, 1))}
                </div>
                <div className="text-gray-600 font-bold text-sm">Avg per Day</div>
              </div>
            </div>
          </div>
        )}

        {/* Week Slots Grid */}
        {sortedDays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 animate-slideUp" style={{ animationDelay: '100ms' }}>
            {sortedDays.map((day, index) => {
              const colorScheme = dayColors[day] || dayColors.monday;
              
              return (
                <div
                  key={day}
                  className={`bg-gradient-to-br ${colorScheme.bg} rounded-3xl shadow-xl border-4 ${colorScheme.border} transform hover:scale-102 transition-all duration-300 overflow-hidden animate-slideUp`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Day Header */}
                  <div className={`${colorScheme.header} p-4 text-center`}>
                    <div className="text-3xl mb-1">{colorScheme.emoji}</div>
                    <h3 className="text-xl sm:text-2xl font-black text-white capitalize">
                      {day}
                    </h3>
                    <div className="text-white text-sm font-bold opacity-90">
                      {groupedSlots[day]?.length || 0} {groupedSlots[day]?.length === 1 ? 'class' : 'classes'}
                    </div>
                  </div>

                  {/* Classes List */}
                  <div className="p-4 space-y-3">
                    {groupedSlots[day]
                      ?.sort(
                        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
                      )
                      .map((slot) => (
                        <div key={slot.id} className="bg-white p-4 rounded-2xl shadow-md border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 transform hover:scale-102">
                          <TimeSlotCard slot={slot} />
                        </div>
                      ))}

                    {/* No Classes Notice */}
                    {(!groupedSlots[day] || groupedSlots[day].length === 0) && (
                      <div className="text-center py-8 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                        <div className="text-4xl mb-2">😴</div>
                        <p className="text-gray-500 font-medium">No classes</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 sm:py-20 animate-fadeIn">
            <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border-4 border-gray-200 max-w-md mx-auto">
              <div className="text-6xl sm:text-7xl mb-4">📅</div>
              <p className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
                No Timetable Yet!
              </p>
              <p className="text-gray-500 text-sm sm:text-base mb-6">
                Start by creating your first class schedule
              </p>
              <Link
                to="/timetable/create"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold"
              >
                ➕ Create First Class
              </Link>
            </div>
          </div>
        )}

        {/* Link to Today */}
        {totalClasses > 0 && (
          <div className="text-center animate-slideUp" style={{ animationDelay: '200ms' }}>
            <Link
              to="/timetable/daily"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-base sm:text-lg"
            >
              <span className="text-2xl">📆</span>
              View Today's Schedule
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}