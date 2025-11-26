import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { mockTimetable, mockSubjects } from '../../services/mockData';

const Timetable = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Timetable</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {days.map((day, dayIndex) => (
          <div key={day} className="card">
            <h2 className="font-bold text-lg mb-4">{day}</h2>
            <div className="space-y-3">
              {mockTimetable
                .filter(item => item.dayOfWeek === dayIndex + 1)
                .map(item => {
                  const subject = mockSubjects.find(s => s.id === item.subjectId);
                  return (
                    <div key={item.id} className="p-3 rounded-lg" style={{ backgroundColor: subject.color + '20' }}>
                      <p className="font-semibold text-sm">{subject.name}</p>
                      <div className="flex items-center text-xs text-gray-600 mt-1">
                        <Clock size={12} className="mr-1" />
                        {item.startTime} - {item.endTime}
                      </div>
                      <div className="flex items-center text-xs text-gray-600 mt-1">
                        <MapPin size={12} className="mr-1" />
                        {item.room}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timetable;