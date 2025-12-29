// src/pages/ReminderListPage.jsx

"use client";

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReminders } from '../../hooks/useReminders';
import GradientHeader from '../../components/alarms/GradientHeader';
import Card from '../../components/alarms/Card';
// import { useReminders } from '../hooks/useReminders';
// import Card from '../components/Card';
// import GradientHeader from '../components/GradientHeader';

export default function ReminderListPage() {
  const navigate = useNavigate();
  const { reminders, loading, fetchReminders, completeReminder, deleteReminder } = useReminders();

  useEffect(() => {
    fetchReminders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-text-primary">Loading reminders...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <GradientHeader title="My Reminders" subtitle="Stay on top of your tasks" />

      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/reminders/new')}
          className="bg-gradient-to-r from-cyan to-cyan-light text-white font-semibold py-3 px-6 rounded-button shadow-button"
        >
          + New Reminder
        </button>
        <button
          onClick={() => navigate('/reminders/upcoming')}
          className="bg-yellow text-white font-medium py-2 px-4 rounded-button"
        >
          Upcoming
        </button>
      </div>

      {reminders.length === 0 ? (
        <Card>
          <p className="text-text-secondary text-center">No reminders yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reminders.map((rem) => (
            <Card key={rem.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${
                  rem.is_completed ? 'line-through text-gray-500' : 'text-text-primary'
                }`}>
                  {rem.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  Due: {new Date(rem.due_date).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                {!rem.is_completed && (
                  <button
                    onClick={() => completeReminder(rem.id)}
                    className="px-3 py-1.5 bg-yellow-light text-yellow-dark rounded-button text-sm font-medium hover:bg-yellow"
                  >
                    Complete
                  </button>
                )}
                <button
                  onClick={() => deleteReminder(rem.id)}
                  className="px-3 py-1.5 bg-red-100 text-red-700 rounded-button text-sm font-medium hover:bg-red-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/reminders/${rem.id}`)}
                  className="px-3 py-1.5 bg-blue-light text-blue-dark rounded-button text-sm font-medium hover:bg-blue-card"
                >
                  Details
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}