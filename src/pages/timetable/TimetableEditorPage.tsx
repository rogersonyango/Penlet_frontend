// src/pages/timetable/TimetableEditorPage.jsx

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TimetableHeader from '../../components/timetable/TimetableHeader';
import { timetableService } from '../../services/timetable';

const MOCK_USER_ID = 1;

export default function TimetableEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    day_of_week: 'monday',
    start_time: '08:00',
    end_time: '09:00',
    course: '',
    room: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const isoStart = new Date(`1970-01-01T${formData.start_time}:00Z`).toISOString();
      const isoEnd = new Date(`1970-01-01T${formData.end_time}:00Z`).toISOString();

      const slotData = {
        ...formData,
        start_time: isoStart,
        end_time: isoEnd,
      };

      if (isEditing) {
        await timetableService.addTimeSlot(parseInt(id), slotData);
      } else {
        const newTimetable = await timetableService.createTimetable({
          user_id: MOCK_USER_ID,
          term: 'Term 1',
        });
        await timetableService.addTimeSlot(newTimetable.id, slotData);
      }

      navigate('/timetable');
    } catch (err) {
      setError(err.message || 'Failed to save slot');
      setLoading(false);
    }
  };

  // Day color schemes
  const dayColors = {
    monday: { border: 'border-purple-400', bg: 'from-purple-50 to-purple-100', ring: 'focus:ring-purple-200 focus:border-purple-500' },
    tuesday: { border: 'border-pink-400', bg: 'from-pink-50 to-pink-100', ring: 'focus:ring-pink-200 focus:border-pink-500' },
    wednesday: { border: 'border-yellow-400', bg: 'from-yellow-50 to-yellow-100', ring: 'focus:ring-yellow-200 focus:border-yellow-500' },
    thursday: { border: 'border-green-400', bg: 'from-green-50 to-green-100', ring: 'focus:ring-green-200 focus:border-green-500' },
    friday: { border: 'border-cyan-400', bg: 'from-cyan-50 to-cyan-100', ring: 'focus:ring-cyan-200 focus:border-cyan-500' },
    saturday: { border: 'border-purple-400', bg: 'from-purple-50 to-purple-100', ring: 'focus:ring-purple-200 focus:border-purple-500' },
    sunday: { border: 'border-pink-400', bg: 'from-pink-50 to-pink-100', ring: 'focus:ring-pink-200 focus:border-pink-500' },
  };

  const selectedDayColor = dayColors[formData.day_of_week];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-purple-300">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-transparent bg-clip-text">
              {isEditing ? '✏️ Edit Timetable' : '➕ Create New Timetable'}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base font-medium">
              {isEditing ? 'Update your class details' : 'Add your first class to get started!'}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-2xl shadow-lg animate-shake">
            <p className="font-semibold flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-slideUp">
          {/* Day of Week */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-xl border-4 border-purple-200 hover:border-purple-300 transition-all duration-300">
            <label className="block text-gray-700 font-bold mb-3 text-base sm:text-lg flex items-center gap-2">
              <span className="text-2xl">📅</span>
              Day of Week
            </label>
            <select
              name="day_of_week"
              value={formData.day_of_week}
              onChange={handleChange}
              className="w-full p-4 border-3 border-purple-300 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 font-bold text-base bg-white cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '3rem',
              }}
            >
              {[
                { value: 'monday', emoji: '🌟', label: 'Monday' },
                { value: 'tuesday', emoji: '🔥', label: 'Tuesday' },
                { value: 'wednesday', emoji: '⚡', label: 'Wednesday' },
                { value: 'thursday', emoji: '🚀', label: 'Thursday' },
                { value: 'friday', emoji: '🎉', label: 'Friday' },
                { value: 'saturday', emoji: '🌈', label: 'Saturday' },
                { value: 'sunday', emoji: '☀️', label: 'Sunday' },
              ].map(day => (
                <option key={day.value} value={day.value}>
                  {day.emoji} {day.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Fields */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-xl border-4 border-pink-200 hover:border-pink-300 transition-all duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="transform hover:scale-102 transition-transform duration-300">
                <label className="block text-gray-700 font-bold mb-3 text-base sm:text-lg flex items-center gap-2">
                  <span className="text-2xl">🕐</span>
                  Start Time
                </label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="w-full p-4 border-3 border-cyan-300 rounded-2xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500 transition-all duration-300 font-bold text-lg bg-white"
                />
              </div>

              <div className="transform hover:scale-102 transition-transform duration-300">
                <label className="block text-gray-700 font-bold mb-3 text-base sm:text-lg flex items-center gap-2">
                  <span className="text-2xl">🕐</span>
                  End Time
                </label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className="w-full p-4 border-3 border-yellow-300 rounded-2xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 font-bold text-lg bg-white"
                />
              </div>
            </div>
          </div>

          {/* Course */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-xl border-4 border-green-200 hover:border-green-300 transition-all duration-300 transform hover:scale-102">
            <label className="block text-gray-700 font-bold mb-3 text-base sm:text-lg flex items-center gap-2">
              <span className="text-2xl">📚</span>
              Course Name
            </label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="e.g., Mathematics, Science, History..."
              className="w-full p-4 border-3 border-green-300 rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 font-medium text-base placeholder-gray-400"
              required
            />
          </div>

          {/* Room */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-xl border-4 border-cyan-200 hover:border-cyan-300 transition-all duration-300 transform hover:scale-102">
            <label className="block text-gray-700 font-bold mb-3 text-base sm:text-lg flex items-center gap-2">
              <span className="text-2xl">🏫</span>
              Room Location
            </label>
            <input
              type="text"
              name="room"
              value={formData.room}
              onChange={handleChange}
              placeholder="e.g., Room 101, Lab A, Auditorium..."
              className="w-full p-4 border-3 border-cyan-300 rounded-2xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500 transition-all duration-300 font-medium text-base placeholder-gray-400"
              required
            />
          </div>

          {/* Preview Card */}
          <div className={`bg-gradient-to-br ${selectedDayColor.bg} p-6 sm:p-7 rounded-3xl shadow-xl border-4 ${selectedDayColor.border} animate-slideUp`} style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-md">
                👀
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-800">
                Preview
              </h3>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border-3 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold text-gray-500 uppercase">
                  {formData.day_of_week}
                </div>
                <div className="text-sm font-bold text-gray-700">
                  {formData.start_time} - {formData.end_time}
                </div>
              </div>
              
              <div className="text-xl font-black text-gray-800 mb-1">
                {formData.course || 'Course Name'}
              </div>
              
              <div className="text-sm text-gray-600 font-medium flex items-center gap-2">
                <span>📍</span>
                {formData.room || 'Room Location'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slideUp" style={{ animationDelay: '200ms' }}>
            <button
              type="button"
              onClick={() => navigate('/timetable')}
              className="w-full sm:flex-1 px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg"
            >
              ← Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:flex-1 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg ${
                loading
                  ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                <span>{isEditing ? '💾 Update Class' : '🚀 Save Class'}</span>
              )}
            </button>
          </div>
        </form>
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

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }

        .border-3 {
          border-width: 3px;
        }

        /* Custom styling for time inputs */
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(0.5);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}