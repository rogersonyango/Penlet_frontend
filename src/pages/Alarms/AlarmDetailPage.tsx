// src/pages/AlarmDetailPage.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// @ts-ignore
import { alarmService } from '../../services/alarmService';
import { Alarm } from '../../types/alarm';

export default function AlarmDetailPage() {
  const { alarmId } = useParams<{ alarmId: string }>();
  const navigate = useNavigate();  
  const [alarm, setAlarm] = useState<Alarm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!alarmId) {
      navigate('/alarms');
      return;
    }

    const fetchAlarm = async () => {
      try {
        const res = await alarmService.getById(parseInt(alarmId, 10));
        setAlarm(res.data);
      } catch (err) {
        navigate('/alarms');
      } finally {
        setLoading(false);
      }
    };
    fetchAlarm();
  }, [alarmId, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-purple-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Loading alarm...
          </p>
        </div>
      </div>
    );
  }

  if (!alarm) return null;

  // Determine color scheme based on alarm status
  const colorScheme = alarm.is_active 
    ? {
        badge: 'from-green-400 to-green-600',
        border: 'border-green-400',
        bg: 'from-green-50 to-green-100',
        emoji: '✅'
      }
    : {
        badge: 'from-gray-400 to-gray-600',
        border: 'border-gray-400',
        bg: 'from-gray-50 to-gray-100',
        emoji: '⏸️'
      };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/alarms')}
          className="mb-6 px-6 py-3 bg-white border-3 border-vibrant-purple-300 text-vibrant-purple-700 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-sm sm:text-base hover:border-vibrant-purple-400 animate-slideDown"
        >
          ← Back to Alarms
        </button>

        {/* Header Card */}
        <div className={`bg-gradient-to-br ${colorScheme.bg} p-6 sm:p-8 rounded-3xl shadow-xl border-4 ${colorScheme.border} mb-8 animate-slideDown`} style={{ animationDelay: '100ms' }}>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            {/* Status Badge */}
            <span
              className={`
                inline-flex items-center gap-2
                bg-gradient-to-r ${colorScheme.badge}
                text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg
              `}
            >
              <span className="text-xl">{colorScheme.emoji}</span>
              {alarm.is_active ? 'Active' : 'Disabled'}
            </span>

            {/* Recurring Badge */}
            {alarm.is_recurring && (
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg">
                <span className="text-xl">🔄</span>
                Recurring
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800 mb-3 leading-tight">
            {alarm.title}
          </h1>

          {/* Description */}
          {alarm.description && (
            <p className="text-base sm:text-lg text-gray-700 font-medium flex items-center gap-2">
              <span className="text-xl">📋</span>
              {alarm.description}
            </p>
          )}
        </div>

        {/* Alarm Details Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-vibrant-pink-300 mb-8 animate-slideUp" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-vibrant-pink-500 to-vibrant-purple-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
              ⏰
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-vibrant-pink-600">
              Alarm Details
            </h2>
          </div>

          <div className="space-y-5">
            {/* Alarm Time */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-2xl border-3 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wide mb-1">Alarm Time</p>
                  <p className="text-xl sm:text-2xl font-black text-gray-800">
                    {new Date(alarm.alarm_time).toLocaleString()}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-vibrant-purple-500 to-vibrant-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  📅
                </div>
              </div>
            </div>

            {/* Time Remaining */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-5 rounded-2xl border-3 border-cyan-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wide mb-1">Time Remaining</p>
                  <p className="text-xl sm:text-2xl font-black text-gray-800">
                    {Math.round((new Date(alarm.alarm_time).getTime() - Date.now()) / (1000 * 60 * 60))} hours
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-vibrant-cyan-400 to-vibrant-purple-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  ⏱️
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-vibrant-cyan-300 mb-8 animate-slideUp" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-vibrant-cyan-400 to-vibrant-green-400 rounded-full flex items-center justify-center text-2xl shadow-lg">
              ⚡
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-vibrant-cyan-600">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/alarms')}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-vibrant-purple-500 to-vibrant-pink-500 hover:from-vibrant-purple-600 hover:to-vibrant-pink-600 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl font-bold text-base sm:text-lg transform hover:scale-105 transition-all duration-300"
            >
              <span className="text-2xl">📋</span>
              View All Alarms
            </button>

            <button
              onClick={() => navigate('/alarms')}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-vibrant-cyan-500 to-vibrant-purple-500 hover:from-vibrant-cyan-600 hover:to-vibrant-purple-600 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl font-bold text-base sm:text-lg transform hover:scale-105 transition-all duration-300"
            >
              <span className="text-2xl">➕</span>
              Create New Alarm
            </button>
          </div>
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

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}

