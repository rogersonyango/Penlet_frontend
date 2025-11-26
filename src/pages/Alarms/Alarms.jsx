import React from 'react';
import { Plus, Bell } from 'lucide-react';
import { mockAlarms } from '../../services/mockData';

const Alarms = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Alarms & Reminders</h1>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          <span>New Alarm</span>
        </button>
      </div>

      <div className="space-y-4">
        {mockAlarms.map(alarm => (
          <div key={alarm.id} className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Bell size={24} className="text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold">{alarm.title}</h3>
                <p className="text-sm text-gray-600">{alarm.time}</p>
                <div className="flex gap-2 mt-1">
                  {alarm.repeat.map(day => (
                    <span key={day} className="text-xs px-2 py-1 bg-gray-100 rounded">{day}</span>
                  ))}
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={alarm.enabled} className="sr-only peer" onChange={() => {}} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alarms;