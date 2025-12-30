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

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">

      <div className="bg-gradient-primary p-6 rounded-card shadow-card mb-6">
        <TimetableHeader
          title={isEditing ? "Edit Timetable" : "Create New Timetable"}
          subtitle="Add your first class or update an existing one" actions={undefined}        />
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-button mb-4 shadow-button">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-card shadow-card"
      >
        {/* Day of Week */}
        <div>
          <label className="block text-text-secondary font-medium mb-2">Day of Week</label>
          <select
            name="day_of_week"
            value={formData.day_of_week}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-button focus:ring-2 focus:ring-primary-500"
          >
            {[
              'monday','tuesday','wednesday','thursday','friday','saturday','sunday'
            ].map(day => (
              <option key={day} value={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Time Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-text-secondary font-medium mb-2">Start Time</label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-button focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-text-secondary font-medium mb-2">End Time</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-button focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Course */}
        <div>
          <label className="block text-text-secondary font-medium mb-2">Course</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="e.g., Mathematics"
            className="w-full p-3 border border-gray-300 rounded-button focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        {/* Room */}
        <div>
          <label className="block text-text-secondary font-medium mb-2">Room</label>
          <input
            type="text"
            name="room"
            value={formData.room}
            onChange={handleChange}
            placeholder="e.g., Room 101"
            className="w-full p-3 border border-gray-300 rounded-button focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/timetable')}
            className="flex-1 py-3 bg-gray-200 text-text-secondary rounded-button font-medium shadow-button"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-gradient-blue text-white rounded-button shadow-button font-medium disabled:opacity-70"
          >
            {loading ? 'Saving...' : 'Save Class'}
          </button>
        </div>

      </form>
    </div>
  );
}
