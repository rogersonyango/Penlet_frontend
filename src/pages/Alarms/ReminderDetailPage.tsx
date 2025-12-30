// src/pages/ReminderDetailPage.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Reminder } from '../../types/reminder';
import { reminderService } from '../../services/reminderService';
import GradientHeader from '../../components/alarms/GradientHeader';
import Card from '../../components/alarms/Card';


export default function ReminderDetailPage() {
  const { reminderId } = useParams<{ reminderId: string }>();
  const navigate = useNavigate();
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reminderId) {
      navigate('/reminders');
      return;
    }

    const fetchReminder = async () => {
      try {
        const res = await reminderService.getById(parseInt(reminderId, 10));
        setReminder(res.data);
      } catch (err) {
        navigate('/reminders');
      } finally {
        setLoading(false);
      }
    };
    fetchReminder();
  }, [reminderId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-text-primary">Loading reminder...</div>
      </div>
    );
  }

  if (!reminder) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <GradientHeader title={reminder.title} subtitle={undefined} />

      <Card>
        <div className="space-y-4">
          <div>
            <p className="text-text-secondary font-medium">Description</p>
            <p>{reminder.description || '—'}</p>
          </div>

          <div>
            <p className="text-text-secondary font-medium">Due Date</p>
            <p>{new Date(reminder.due_date).toLocaleString()}</p>
          </div>

          <div>
            <p className="text-text-secondary font-medium">Status</p>
            <span className={`inline-block px-3 py-1 rounded-badge ${
              reminder.is_completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {reminder.is_completed ? 'Completed' : 'Pending'}
            </span>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => navigate('/reminders')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-5 rounded-button"
            >
              Back to List
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}