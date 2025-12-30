// src/pages/AlarmListPage.tsx
"use client";
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlarms } from '../../hooks/useAlarms';
import GradientHeader from '../../components/alarms/GradientHeader';
import Card from '../../components/alarms/Card';


export default function AlarmListPage() {
  const navigate = useNavigate();
  const { alarms, loading, fetchAlarms, toggleAlarm, snoozeAlarm, deleteAlarm } = useAlarms();

  useEffect(() => {
    fetchAlarms();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-text-primary">Loading alarms...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <GradientHeader title="My Alarms" subtitle="Manage your daily alerts and schedules" />

      <div className="mb-6">
        <button
          onClick={() => navigate('/alarms/new')}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-button shadow-button transition"
        >
          + New Alarm
        </button>
      </div>

      {alarms.length === 0 ? (
        <Card>
          <p className="text-text-secondary text-center">No alarms yet. Create your first one!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {alarms.map((alarm) => (
            <Card key={alarm.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-text-primary text-lg">{alarm.title}</h3>
                <p className="text-text-secondary text-sm">
                  {new Date(alarm.alarm_time).toLocaleString()}
                </p>
                <span className={`inline-block mt-1 px-2 py-1 rounded-badge text-xs font-medium ${
                  alarm.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {alarm.is_active ? 'Active' : 'Disabled'}
                </span>
                {alarm.is_recurring && (
                  <span className="ml-2 inline-block px-2 py-1 rounded-badge bg-purple-light text-purple-mid text-xs font-medium">
                    Recurring
                  </span>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => toggleAlarm(alarm.id)}
                  className={`px-3 py-1.5 rounded-button text-sm font-medium ${
                    alarm.is_active
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
                >
                  {alarm.is_active ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => snoozeAlarm(alarm.id, 5)}
                  className="px-3 py-1.5 bg-pink-light text-icon-pink rounded-button text-sm font-medium hover:bg-pink-gradient-start"
                >
                  Snooze
                </button>
                <button
                  onClick={() => deleteAlarm(alarm.id)}
                  className="px-3 py-1.5 bg-red-100 text-red-700 rounded-button text-sm font-medium hover:bg-red-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/alarms/${alarm.id}`)}
                  className="px-3 py-1.5 bg-blue-light text-blue-dark rounded-button text-sm font-medium hover:bg-blue-card"
                >
                  View
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}