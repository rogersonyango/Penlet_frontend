// src/pages/AlarmListPage.tsx
"use client";
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlarms } from '../../hooks/useAlarms';

export default function AlarmListPage() {
  const navigate = useNavigate();
  const { alarms, loading, fetchAlarms, toggleAlarm, snoozeAlarm, deleteAlarm } = useAlarms();

  useEffect(() => {
    fetchAlarms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-purple-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Loading alarms...
          </p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const activeAlarms = alarms.filter(a => a.is_active).length;
  const totalAlarms = alarms.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 bg-gradient-to-r from-vibrant-purple-600 via-vibrant-pink-500 to-vibrant-cyan-500 text-transparent bg-clip-text text-center">
            ⏰ My Alarms
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-medium text-center">
            Manage your daily alerts and schedules
          </p>
        </div>

        {/* Stats Summary */}
        {totalAlarms > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 animate-slideUp">
            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-vibrant-purple-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2 text-center">🔔</div>
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-vibrant-purple-600 to-vibrant-pink-500 text-transparent bg-clip-text">
                  {totalAlarms}
                </div>
                <div className="text-gray-600 font-bold text-sm">Total Alarms</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-green-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2 text-center">✅</div>
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-vibrant-cyan-400 text-transparent bg-clip-text">
                  {activeAlarms}
                </div>
                <div className="text-gray-600 font-bold text-sm">Active</div>
              </div>
            </div>
          </div>
        )}

        {/* Create Alarm Button */}
        <div className="mb-8 animate-slideUp" style={{ animationDelay: '100ms' }}>
          <button
            onClick={() => navigate('/alarms/new')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-vibrant-purple-500 via-vibrant-pink-500 to-vibrant-cyan-500 hover:from-vibrant-purple-600 hover:via-vibrant-pink-600 hover:to-vibrant-cyan-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">➕</span>
            Create New Alarm
          </button>
        </div>

        {/* Alarms List */}
        {alarms.length === 0 ? (
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border-4 border-gray-200 text-center animate-fadeIn">
            <div className="text-6xl sm:text-7xl mb-4">🔔</div>
            <p className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
              No alarms yet
            </p>
            <p className="text-gray-500 text-sm sm:text-base mb-6">
              Create your first alarm to stay on track!
            </p>
            <button
              onClick={() => navigate('/alarms/new')}
              className="px-8 py-3 bg-gradient-to-r from-vibrant-purple-500 via-pink-500 to-cyan-500 hover:from-vibrant-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold"
            >
              Create Alarm
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-slideUp" style={{ animationDelay: '200ms' }}>
            {alarms.map((alarm, index) => (
              <div
                key={alarm.id}
                className="animate-slideUp bg-white p-5 sm:p-6 rounded-2xl shadow-lg border-3 border-vibrant-purple-200 hover:border-vibrant-purple-300 transform hover:scale-102 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Alarm Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${alarm.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                      <h3 className="font-black text-xl text-gray-800">{alarm.title}</h3>
                      {alarm.is_recurring && (
                        <span className="px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-600 rounded-full text-xs font-bold border border-yellow-300">
                          🔄 Recurring
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 font-medium flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      {new Date(alarm.alarm_time).toLocaleString()}
                    </p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                      alarm.is_active 
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300' 
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border border-gray-300'
                    }`}>
                      {alarm.is_active ? '✅ Active' : '⏸️ Disabled'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${
                        alarm.is_active
                          ? 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'
                          : 'bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600'
                      }`}
                    >
                      {alarm.is_active ? '⏸️ Disable' : '✅ Enable'}
                    </button>
                    <button
                      onClick={() => snoozeAlarm(alarm.id, 5)}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      😴 Snooze
                    </button>
                    <button
                      onClick={() => navigate(`/alarms/${alarm.id}`)}
                      className="px-4 py-2 bg-gradient-to-r from-vibrant-purple-400 to-vibrant-pink-400 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => deleteAlarm(alarm.id)}
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

