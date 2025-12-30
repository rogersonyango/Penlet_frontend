// src/pages/ReminderListPage.tsx
"use client";

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReminders } from '../../hooks/useReminders';

export default function ReminderListPage() {
  const navigate = useNavigate();
  const { reminders, loading, fetchReminders, completeReminder, deleteReminder } = useReminders();

  useEffect(() => {
    fetchReminders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-purple-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Loading reminders...
          </p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const pendingReminders = reminders.filter(r => !r.is_completed).length;
  const completedReminders = reminders.filter(r => r.is_completed).length;
  const totalReminders = reminders.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 bg-gradient-to-r from-vibrant-cyan-600 via-vibrant-purple-600 to-vibrant-pink-500 text-transparent bg-clip-text text-center">
            📌 My Reminders
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-medium text-center">
            Stay on top of your tasks and never miss a deadline!
          </p>
        </div>

        {/* Stats Summary */}
        {totalReminders > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-slideUp">
            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-vibrant-cyan-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2 text-center">📌</div>
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-vibrant-cyan-600 to-vibrant-purple-600 text-transparent bg-clip-text">
                  {totalReminders}
                </div>
                <div className="text-gray-600 font-bold text-sm">Total Reminders</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-yellow-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2 text-center">⏳</div>
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-500 text-transparent bg-clip-text">
                  {pendingReminders}
                </div>
                <div className="text-gray-600 font-bold text-sm">Pending</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-green-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2 text-center">✅</div>
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-vibrant-cyan-400 text-transparent bg-clip-text">
                  {completedReminders}
                </div>
                <div className="text-gray-600 font-bold text-sm">Completed</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slideUp" style={{ animationDelay: '100ms' }}>
          <button
            onClick={() => navigate('/reminders/new')}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-vibrant-cyan-500 via-vibrant-purple-500 to-vibrant-pink-500 hover:from-vibrant-cyan-600 hover:via-vibrant-purple-600 hover:to-vibrant-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">➕</span>
            Create New Reminder
          </button>
          <button
            onClick={() => navigate('/reminders/upcoming')}
            className="flex-1 px-8 py-4 bg-white border-3 border-vibrant-yellow-300 text-vibrant-yellow-700 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:bg-yellow-50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">📅</span>
            Upcoming Reminders
          </button>
        </div>

        {/* Reminders List */}
        {reminders.length === 0 ? (
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border-4 border-gray-200 text-center animate-fadeIn">
            <div className="text-6xl sm:text-7xl mb-4">📌</div>
            <p className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
              No reminders yet
            </p>
            <p className="text-gray-500 text-sm sm:text-base mb-6">
              Create your first reminder to stay organized!
            </p>
            <button
              onClick={() => navigate('/reminders/new')}
              className="px-8 py-3 bg-gradient-to-r from-vibrant-cyan-500 via-vibrant-purple-500 to-vibrant-pink-500 hover:from-vibrant-cyan-600 hover:via-vibrant-purple-600 hover:to-vibrant-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold"
            >
              Create Reminder
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-slideUp" style={{ animationDelay: '200ms' }}>
            {reminders.map((rem, index) => (
              <div
                key={rem.id}
                className="animate-slideUp bg-white p-5 sm:p-6 rounded-2xl shadow-lg border-3 border-vibrant-cyan-200 hover:border-vibrant-cyan-300 transform hover:scale-102 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Reminder Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${rem.is_completed ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                      <h3 className={`font-black text-xl ${rem.is_completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {rem.title}
                      </h3>
                      {rem.is_completed && (
                        <span className="px-2 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-full text-xs font-bold border border-green-300">
                          ✅ Done
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 font-medium flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      Due: {new Date(rem.due_date).toLocaleString()}
                    </p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                      rem.is_completed
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300'
                        : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border border-yellow-300'
                    }`}>
                      {rem.is_completed ? '✅ Completed' : '⏳ Pending'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {!rem.is_completed && (
                      <button
                        onClick={() => completeReminder(rem.id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        ✅ Complete
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/reminders/${rem.id}`)}
                      className="px-4 py-2 bg-gradient-to-r from-vibrant-cyan-400 to-vibrant-purple-400 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      👁️ Details
                    </button>
                    <button
                      onClick={() => deleteReminder(rem.id)}
                      className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

