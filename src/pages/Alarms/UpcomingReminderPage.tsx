// src/pages/UpcomingRemindersPage.tsx

"use client";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reminderService } from '../../services/reminderService';
import GradientHeader from '../../components/alarms/GradientHeader';
import Card from '../../components/alarms/Card';
import type { Reminder } from '../../types/reminder'; 

export default function UpcomingRemindersPage() {
  const navigate = useNavigate();
  
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await reminderService.getUpcoming(20);
        setReminders(res.data); 
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-text-primary">Loading upcoming reminders...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <GradientHeader title="Upcoming Reminders" subtitle={undefined} />

      {reminders.length === 0 ? (
        <Card>
          <p className="text-text-secondary text-center">No upcoming reminders.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reminders.map((rem) => (
            <Card key={rem.id} className="flex justify-between items-center p-5">
              <div>
                <h3 className="font-bold text-text-primary">{rem.title}</h3>
                <p className="text-yellow-dark font-medium">
                  {new Date(rem.due_date).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => navigate(`/reminders/${rem.id}`)}
                className="bg-yellow text-white py-2 px-4 rounded-button"
              >
                View
              </button>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/reminders')}
          className="text-primary-600 font-medium hover:underline"
        >
          ← Back to All Reminders
        </button>
      </div>
    </div>
  );
}