// src/pages/CreateReminderPage.jsx
"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReminders } from '../../hooks/useReminders';
import GradientHeader from '../../components/alarms/GradientHeader';
import Card from '../../components/alarms/Card';
// import { useReminders } from '../hooks/useReminders';
// import Card from '../components/Card';
// import GradientHeader from '../components/GradientHeader';

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError('');
  };

  const handleSubmit = async (e) => {
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
    <div className="max-w-2xl mx-auto p-4">
      <GradientHeader title="New Reminder" subtitle={undefined} />

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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-1">Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:outline-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-1">Due Date & Time</label>
            <input
              type="datetime-local"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:outline-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-cyan to-cyan-light text-white font-semibold py-2.5 px-6 rounded-button shadow-button transition disabled:opacity-70"
            >
              {loading ? 'Creating...' : 'Create Reminder'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/reminders')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 px-6 rounded-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}