// src/pages/Alarms/CreateAlarmPage.tsx
"use client";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlarms } from '../../hooks/useAlarms';

export default function CreateAlarmPage() {
  const navigate = useNavigate();
  const { createAlarm } = useAlarms();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    alarm_time: '',
    is_recurring: false,
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (formError) setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    const alarmTime = new Date(formData.alarm_time);
    if (isNaN(alarmTime.getTime())) {
      setFormError('Please select a valid date and time.');
      setLoading(false);
      return;
    }

    if (alarmTime <= new Date()) {
      setFormError('Alarm time must be in the future.');
      setLoading(false);
      return;
    }

    try {
      await createAlarm(formData);
      navigate('/alarms');
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-4 sm:p-6">
      {/* Floating decorative elements */}
      <div className="fixed top-20 left-10 w-24 h-24 bg-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed top-40 right-20 w-32 h-32 bg-pink-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="fixed bottom-20 left-1/4 w-28 h-28 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 animate-bounceIn">
          <button
            onClick={() => navigate('/alarms')}
            className="group mb-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-110 hover:rotate-3 transition-all duration-300"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back</span>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-3xl shadow-2xl mb-4 transform hover:rotate-12 hover:scale-110 transition-all duration-300 animate-float">
              <span className="text-5xl drop-shadow-lg">⏰</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-transparent bg-clip-text mb-2 animate-pulse">
              Create Alarm
            </h1>
            <p className="text-gray-500 font-medium flex items-center justify-center gap-2">
              <span className="animate-bounce">✨</span>
              Never miss a beat!
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🚀</span>
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-3xl shadow-2xl border-4 border-purple-300 hover:border-pink-400 transition-all duration-300 animate-slideUp">
          {/* Icon Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 hover:rotate-6 transition-all duration-300">
              🔔
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">Alarm Details</h2>
              <p className="text-sm text-gray-500 font-medium">Fill in the info below</p>
            </div>
          </div>

          {formError && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-bold shadow-lg flex items-center gap-2 animate-shake">
              <span className="text-xl">⚠️</span>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title Input */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-2xl group-focus-within:scale-125 transition-transform">📝</span>
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Alarm title..."
                className="w-full pl-14 pr-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-3 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 focus:outline-none transition-all duration-300 font-medium text-lg placeholder-gray-400 group-hover:border-purple-300"
                required
              />
            </div>

            {/* Description Textarea */}
            <div className="group relative">
              <div className="absolute top-4 left-4 pointer-events-none">
                <span className="text-2xl group-focus-within:scale-125 transition-transform">📋</span>
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add some notes..."
                rows={3}
                className="w-full pl-14 pr-4 py-4 bg-gradient-to-r from-pink-50 to-cyan-50 border-3 border-pink-200 rounded-2xl focus:ring-4 focus:ring-pink-300 focus:border-pink-500 focus:outline-none transition-all duration-300 font-medium text-lg placeholder-gray-400 resize-none group-hover:border-pink-300"
              />
            </div>

            {/* Date/Time Input */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-2xl group-focus-within:scale-125 transition-transform">📅</span>
              </div>
              <input
                type="datetime-local"
                name="alarm_time"
                value={formData.alarm_time}
                onChange={handleChange}
                className="w-full pl-14 pr-4 py-4 bg-gradient-to-r from-cyan-50 to-purple-50 border-3 border-cyan-200 rounded-2xl focus:ring-4 focus:ring-cyan-300 focus:border-cyan-500 focus:outline-none transition-all duration-300 font-medium text-lg bg-white group-hover:border-cyan-300"
                required
              />
            </div>

            {/* Recurring Toggle */}
            <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 p-5 rounded-2xl border-3 border-yellow-300 hover:border-yellow-400 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 transition-transform">
                    🔄
                  </div>
                  <div>
                    <p className="font-black text-gray-800 text-lg">Recurring</p>
                    <p className="text-sm text-gray-500 font-medium">Repeat automatically</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_recurring"
                    checked={formData.is_recurring}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-16 h-9 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content=['🙌'] after:absolute after:top-1 after:left-1 after:bg-gradient-to-r after:from-yellow-400 after:to-orange-500 after:rounded-full after:h-7 after:w-7 after:transition-all after:flex after:items-center after:justify-center after:text-sm"></div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-4 rounded-2xl font-black shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-lg ${
                  loading
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-2xl">🔔</span>
                    Create Alarm
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/alarms')}
                className="flex-1 py-4 bg-white border-3 border-gray-300 text-gray-700 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:bg-gray-50 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Quick Stats / Tips */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-slideUp" style={{ animationDelay: '100ms' }}>
          <div className="bg-white/60 backdrop-blur-lg p-4 rounded-2xl border-3 border-purple-200 text-center transform hover:scale-105 hover:-translate-y-1 transition-all duration-300">
            <div className="text-3xl mb-1">🎯</div>
            <p className="font-bold text-purple-600 text-sm">Stay Focused</p>
          </div>
          <div className="bg-white/60 backdrop-blur-lg p-4 rounded-2xl border-3 border-pink-200 text-center transform hover:scale-105 hover:-translate-y-1 transition-all duration-300">
            <div className="text-3xl mb-1">💪</div>
            <p className="font-bold text-pink-600 text-sm">Be On Time</p>
          </div>
          <div className="bg-white/60 backdrop-blur-lg p-4 rounded-2xl border-3 border-cyan-200 text-center transform hover:scale-105 hover:-translate-y-1 transition-all duration-300">
            <div className="text-3xl mb-1">⚡</div>
            <p className="font-bold text-cyan-600 text-sm">Stay Energized</p>
          </div>
          <div className="bg-white/60 backdrop-blur-lg p-4 rounded-2xl border-3 border-yellow-200 text-center transform hover:scale-105 hover:-translate-y-1 transition-all duration-300">
            <div className="text-3xl mb-1">🌟</div>
            <p className="font-bold text-yellow-600 text-sm">Ace It!</p>
          </div>
        </div>

        {/* Fun Footer */}
        <div className="mt-6 text-center animate-pulse">
          <p className="text-gray-500 font-medium">
            Made with <span className="text-red-500">❤️</span> for productive teens
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-bounceIn {
          animation: bounceIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}

