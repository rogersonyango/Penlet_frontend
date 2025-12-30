// src/pages/UpcomingRemindersPage.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { reminderService } from '../../services/reminderService';
import type { Reminder } from '../../types/reminder';

export default function UpcomingRemindersPage() {
  const navigate = useNavigate();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await reminderService.getUpcoming(20);
        setReminders(res.data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-purple-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Loading upcoming reminders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <button
            onClick={() => navigate('/reminders')}
            className="mb-6 px-6 py-3 bg-white border-3 border-vibrant-yellow-300 text-vibrant-yellow-700 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-sm sm:text-base hover:border-vibrant-yellow-400"
          >
            ← Back to Reminders
          </button>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 bg-gradient-to-r from-vibrant-yellow-600 via-vibrant-orange-500 to-vibrant-red-500 text-transparent bg-clip-text text-center">
            📅 Upcoming Reminders
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-medium text-center">
            Your tasks coming up soon!
          </p>
        </div>

        {/* Reminders List */}
        {reminders.length === 0 ? (
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border-4 border-gray-200 text-center animate-fadeIn">
            <div className="text-6xl sm:text-7xl mb-4">🎉</div>
            <p className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
              All caught up!
            </p>
            <p className="text-gray-500 text-sm sm:text-base mb-6">
              No upcoming reminders. Enjoy your free time!
            </p>
            <button
              onClick={() => navigate('/reminders')}
              className="px-8 py-3 bg-gradient-to-r from-vibrant-yellow-500 via-vibrant-orange-500 to-vibrant-red-500 hover:from-vibrant-yellow-600 hover:via-vibrant-orange-600 hover:to-vibrant-red-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold"
            >
              View All Reminders
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-slideUp" style={{ animationDelay: '100ms' }}>
            {reminders.map((rem, index) => (
              <div
                key={rem.id}
                className="animate-slideUp bg-white p-5 sm:p-6 rounded-2xl shadow-lg border-3 border-vibrant-yellow-200 hover:border-vibrant-yellow-300 transform hover:scale-102 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Reminder Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 rounded-full bg-vibrant-yellow-500 animate-pulse"></div>
                      <h3 className="font-black text-xl text-gray-800">{rem.title}</h3>
                    </div>
                    <p className="text-gray-600 font-medium flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      {new Date(rem.due_date).toLocaleString()}
                    </p>
                    {/* Time until due */}
                    <p className="text-vibrant-orange-600 font-bold text-sm mt-1 flex items-center gap-2">
                      <span>⏱️</span>
                      In {Math.round((new Date(rem.due_date).getTime() - Date.now()) / (1000 * 60 * 60))} hours
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(`/reminders/${rem.id}`)}
                    className="px-6 py-3 bg-gradient-to-r from-vibrant-yellow-400 to-vibrant-orange-400 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="text-lg">👁️</span>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button at Bottom */}
        <div className="mt-8 text-center animate-slideUp" style={{ animationDelay: '300ms' }}>
          <button
            onClick={() => navigate('/reminders')}
            className="px-8 py-4 bg-white border-3 border-vibrant-cyan-300 text-vibrant-cyan-700 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:bg-cyan-50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            <span className="text-xl">📋</span>
            View All Reminders
          </button>
        </div>
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

        .border-3 {
          border-width: 3px;
        }

        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}

