// src/pages/AlarmDetailPage.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { alarmService } from '../../services/alarmService';
import GradientHeader from '../../components/alarms/GradientHeader';
import Card from '../../components/alarms/Card';
import { Alarm } from '../../types/alarm';

export default function AlarmDetailPage() {
  const { alarmId } = useParams<{ alarmId: string }>();
const navigate = useNavigate();  
  const [alarm, setAlarm] = useState<Alarm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!alarmId) {
      navigate('/alarms');
      return;
    }

    const fetchAlarm = async () => {
      try {
        const res = await alarmService.getById(parseInt(alarmId, 10));
        setAlarm(res.data);
      } catch (err) {
        navigate('/alarms');
      } finally {
        setLoading(false);
      }
    };
    fetchAlarm();
  }, [alarmId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-text-primary">Loading alarm...</div>
      </div>
    );
  }

  if (!alarm) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <GradientHeader title={alarm.title} subtitle={undefined} />

      <Card>
        <div className="space-y-4">
          <div>
            <p className="text-text-secondary font-medium">Description</p>
            <p>{alarm.description || '—'}</p>
          </div>

          <div>
            <p className="text-text-secondary font-medium">Alarm Time</p>
            <p>{new Date(alarm.alarm_time).toLocaleString()}</p>
          </div>

          <div>
            <p className="text-text-secondary font-medium">Status</p>
            <span className={`inline-block px-3 py-1 rounded-badge ${
              alarm.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {alarm.is_active ? 'Active' : 'Disabled'}
            </span>
          </div>

          {alarm.is_recurring && (
            <div>
              <p className="text-text-secondary font-medium">Recurrence</p>
              <p>Repeats based on pattern</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => navigate('/alarms')}
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