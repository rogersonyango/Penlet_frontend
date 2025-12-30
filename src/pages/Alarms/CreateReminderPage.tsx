// src/pages/CreateReminderPage.tsx
"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReminders } from '../../hooks/useReminders';

export default function CreateReminderPage() {
  const navigate = useNavigate();
  const { createReminder } = useReminders();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    const dueDate = new Date(formData.due_date);
    if (isNaN(dueDate.getTime())) {
      setFormError('Please select a valid date and time.');
      setLoading(false);
      return;
    }

    if (dueDate <= new Date()) {
      setFormError('Due date must be in the future.');
      setLoading(false);
      return;
    }

    try {
      await createReminder(formData);
      navigate('/reminders');
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <button
            onClick={() => navigate('/reminders')}
            className="mb-6 px-6 py-3 bg-white border-3 border-vibrant-cyan-300 text-vibrant-cyan-700 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-sm sm:text-base hover:border-vibrant-cyan-400"
          >
            ← Back to Reminders
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-vibrant-cyan-400 to-vibrant-purple-500 rounded-3xl shadow-2xl mb-4 transform hover:rotate-12 hover:scale-110 transition-all duration-300 animate-float">
              <span className="text-5xl drop-shadow-lg">📌</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-vibrant-cyan-600 via-vibrant-purple-600 to-vibrant-pink-500 text-transparent bg-clip-text mb-2">
              Create Reminder
            </h1>
            <p className="text-gray-600 text-base sm:text-lg font-medium">
              Never forget important tasks again!
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-vibrant-cyan-200 animate-slideUp">
          {/* Icon Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-vibrant-cyan-400 to-vibrant-purple-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 hover:rotate-6 transition-all duration-300">
              📝
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">Reminder Details</h2>
              <p className="text-sm text-gray-500 font-medium">Fill in the information below</p>
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
                <span className="text-2xl group-focus-within:scale-125 transition-transform">📌</span>
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What do you need to remember?"
                className="w-full pl-14 pr-4 py-4 bg-gradient-to-r from-cyan-50 to-purple-50 border-3 border-cyan-200 rounded-2xl focus:ring-4 focus:ring-cyan-300 focus:border-cyan-500 focus:outline-none transition-all duration-300 font-medium text-lg placeholder-gray-400 group-hover:border-cyan-300"
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
                placeholder="Add some details (optional)..."
                rows={4}
                className="w-full pl-14 pr-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-3 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 focus:outline-none transition-all duration-300 font-medium text-lg placeholder-gray-400 resize-none group-hover:border-purple-300"
              />
            </div>

            {/* Due Date Input */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-2xl group-focus-within:scale-125 transition-transform">📅</span>
              </div>
              <input
                type="datetime-local"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full pl-14 pr-4 py-4 bg-gradient-to-r from-pink-50 to-cyan-50 border-3 border-pink-200 rounded-2xl focus:ring-4 focus:ring-pink-300 focus:border-pink-500 focus:outline-none transition-all duration-300 font-medium text-lg bg-white group-hover:border-pink-300"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-4 rounded-2xl font-black shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-lg ${
                  loading
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-vibrant-cyan-500 via-vibrant-purple-500 to-vibrant-pink-500 hover:from-vibrant-cyan-600 hover:via-vibrant-purple-600 hover:to-vibrant-pink-600 text-white'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-2xl">✅</span>
                    Create Reminder
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/reminders')}
                className="flex-1 py-4 bg-white border-3 border-gray-300 text-gray-700 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:bg-gray-50 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-white p-6 rounded-3xl shadow-lg border-4 border-vibrant-yellow-200 animate-slideUp" style={{ animationDelay: '100ms' }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-vibrant-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
              💡
            </div>
            <div>
              <h3 className="font-black text-yellow-700 text-lg mb-2">Reminder Tips</h3>
              <ul className="text-gray-700 space-y-2 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  Use clear, specific titles so you recognize the task immediately
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  Set due dates that give you enough time to complete the task
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  Add descriptions to remember all the important details
                </li>
              </ul>
            </div>
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

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
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

