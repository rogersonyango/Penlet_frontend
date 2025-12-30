"use client";

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import TimetableHeader from '../../components/timetable/TimetableHeader';
import TimeSlotCard from '../../components/timetable/TimeSlotCard';
import { useDailyTimetable } from '../../hooks/timetable';
import { formatTime } from '../../utils/date';

const MOCK_USER_ID = 1;

export default function DailyTimetablePage() {
  const today = new Date().toISOString().split('T')[0];
  const { slots, loading, error } = useDailyTimetable(MOCK_USER_ID, today);

  const sortedSlots = useMemo(() => {
    return [...slots].sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  }, [slots]);

  // Determine current class
  const currentTime = new Date();
  const currentSlotIndex = useMemo(() => {
    return sortedSlots.findIndex((slot) => {
      const start = new Date(slot.start_time);
      const end = new Date(slot.end_time);
      return currentTime >= start && currentTime <= end;
    });
  }, [sortedSlots, currentTime]);

  // Get next class
  const nextSlotIndex = useMemo(() => {
    return sortedSlots.findIndex((slot) => {
      const start = new Date(slot.start_time);
      return currentTime < start;
    });
  }, [sortedSlots, currentTime]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-purple-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Loading today's schedule...
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-purple-300">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-transparent bg-clip-text">
                  📅 Today's Schedule
                </h1>
                <p className="text-gray-600 text-sm sm:text-base font-bold">
                  {new Date(today).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              
              <Link
                to="/timetable"
                className="w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-center text-sm sm:text-base"
              >
                📆 Weekly View
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        {sortedSlots.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-slideUp">
            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-purple-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2 text-center">📚</div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  {sortedSlots.length}
                </div>
                <div className="text-gray-600 font-bold text-sm">Total Classes</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-green-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2 text-center">✅</div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-green-600 to-cyan-600 text-transparent bg-clip-text">
                  {currentSlotIndex >= 0 ? currentSlotIndex : sortedSlots.filter((_, i) => i < nextSlotIndex).length}
                </div>
                <div className="text-gray-600 font-bold text-sm">Completed</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-yellow-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2 text-center">⏳</div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 text-transparent bg-clip-text">
                  {nextSlotIndex >= 0 ? sortedSlots.length - nextSlotIndex : 0}
                </div>
                <div className="text-gray-600 font-bold text-sm">Remaining</div>
              </div>
            </div>
          </div>
        )}

        {/* Current Class Highlight */}
        {currentSlotIndex >= 0 && (
          <div className="mb-8 animate-slideUp" style={{ animationDelay: '100ms' }}>
            <div className="bg-gradient-to-br from-green-100 to-cyan-100 p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-green-400 animate-pulse-slow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl animate-bounce-slow">
                  🎯
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-green-700">
                  Current Class - Happening Now!
                </h3>
              </div>
              <TimeSlotCard slot={sortedSlots[currentSlotIndex]} />
            </div>
          </div>
        )}

        {/* Next Class Preview */}
        {nextSlotIndex >= 0 && currentSlotIndex < 0 && (
          <div className="mb-8 animate-slideUp" style={{ animationDelay: '150ms' }}>
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-yellow-400">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-2xl">
                  ⏰
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-yellow-700">
                  Up Next
                </h3>
              </div>
              <TimeSlotCard slot={sortedSlots[nextSlotIndex]} />
            </div>
          </div>
        )}

        {/* No Schedule */}
        {sortedSlots.length === 0 ? (
          <div className="text-center py-16 sm:py-20 animate-fadeIn">
            <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border-4 border-gray-200 max-w-md mx-auto">
              <div className="text-6xl sm:text-7xl mb-4">🎉</div>
              <p className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
                No Classes Today!
              </p>
              <p className="text-gray-500 text-sm sm:text-base">
                Enjoy your free day and relax! 😎
              </p>
            </div>
          </div>
        ) : (
          /* Schedule List */
          <div className="animate-slideUp" style={{ animationDelay: '200ms' }}>
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-cyan-300">
              <h2 className="text-2xl sm:text-3xl font-black text-cyan-700 mb-6 flex items-center gap-3">
                <span className="text-3xl">🗓️</span>
                Full Schedule
              </h2>
              
              <div className="space-y-4">
                {sortedSlots.map((slot, index) => {
                  const isCurrent = index === currentSlotIndex;
                  const isPast = nextSlotIndex >= 0 && index < nextSlotIndex && !isCurrent;
                  const isNext = index === nextSlotIndex && !isCurrent;

                  // Color schemes for different slots
                  const colorSchemes = [
                    { border: 'border-purple-400', bg: 'from-purple-50 to-purple-100', time: 'text-purple-600' },
                    { border: 'border-pink-400', bg: 'from-pink-50 to-pink-100', time: 'text-pink-600' },
                    { border: 'border-yellow-400', bg: 'from-yellow-50 to-yellow-100', time: 'text-yellow-600' },
                    { border: 'border-green-400', bg: 'from-green-50 to-green-100', time: 'text-green-600' },
                    { border: 'border-cyan-400', bg: 'from-cyan-50 to-cyan-100', time: 'text-cyan-600' },
                  ];

                  let colorScheme = colorSchemes[index % colorSchemes.length];
                  
                  if (isCurrent) {
                    colorScheme = { border: 'border-green-500', bg: 'from-green-50 to-cyan-50', time: 'text-green-600' };
                  } else if (isPast) {
                    colorScheme = { border: 'border-gray-300', bg: 'from-gray-50 to-gray-100', time: 'text-gray-500' };
                  } else if (isNext) {
                    colorScheme = { border: 'border-yellow-500', bg: 'from-yellow-50 to-orange-50', time: 'text-yellow-600' };
                  }

                  return (
                    <div
                      key={slot.id}
                      className={`flex flex-col sm:flex-row items-start gap-4 p-5 bg-gradient-to-br ${colorScheme.bg} rounded-2xl shadow-lg border-l-8 ${colorScheme.border} transform hover:scale-102 transition-all duration-300 ${
                        isPast ? 'opacity-60' : ''
                      }`}
                    >
                      {/* Time Block */}
                      <div className="flex sm:flex-col items-center sm:items-center justify-center gap-2 sm:gap-1 min-w-[100px] sm:min-w-[90px] bg-white p-3 rounded-xl shadow-md">
                        <div className={`${colorScheme.time} font-black text-xl sm:text-2xl`}>
                          {formatTime(slot.start_time).replace(':00', '')}
                        </div>
                        <div className="text-gray-400 text-sm font-bold">to</div>
                        <div className={`${colorScheme.time} font-black text-xl sm:text-2xl`}>
                          {formatTime(slot.end_time).replace(':00', '')}
                        </div>
                      </div>

                      {/* Class Info */}
                      <div className="flex-1 w-full">
                        <TimeSlotCard slot={slot} />
                        
                        {/* Status Badge */}
                        {isCurrent && (
                          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-cyan-400 text-white rounded-full font-bold text-sm shadow-md animate-pulse">
                            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                            In Progress
                          </div>
                        )}
                        {isNext && !isCurrent && (
                          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full font-bold text-sm shadow-md">
                            ⏰ Coming Up Next
                          </div>
                        )}
                        {isPast && (
                          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-600 rounded-full font-bold text-sm">
                            ✓ Completed
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(-10%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
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

        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
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