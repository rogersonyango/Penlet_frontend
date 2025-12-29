// src/pages/CreateAlarmPage.jsx
"use client";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlarms } from '../../hooks/useAlarms';
import GradientHeader from '../../components/alarms/GradientHeader';
import Card from '../../components/alarms/Card';


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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (formError) setFormError('');
  };

  const handleSubmit = async (e) => {
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
      // Global error handler (via axios interceptor) shows toast
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <GradientHeader title="New Alarm" subtitle={undefined} />

      <Card>
        {formError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-text-primary font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-1">Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-1">Alarm Time</label>
            <input
              type="datetime-local"
              name="alarm_time"
              value={formData.alarm_time}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_recurring"
              name="is_recurring"
              checked={formData.is_recurring}
              onChange={handleChange}
              className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
            />
            <label htmlFor="is_recurring" className="ml-2 text-text-secondary">
              Recurring Alarm
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-6 rounded-button shadow-button transition disabled:opacity-70"
            >
              {loading ? 'Creating...' : 'Create Alarm'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/alarms')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 px-6 rounded-button transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}