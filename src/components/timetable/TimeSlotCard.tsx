// src/components/timetable/TimeSlotCard.jsx

import { formatTime } from '../../utils/date';

export default function TimeSlotCard({ slot }) {
  let bgColor = 'bg-purple-light';
  const courseLower = slot.course.toLowerCase();

  if (courseLower.includes('math')) {
    bgColor = 'bg-blue-card';
  } else if (courseLower.includes('science')) {
    bgColor = 'bg-cyan';
  } else if (courseLower.includes('language') || courseLower.includes('english')) {
    bgColor = 'bg-yellow';
  }

  return (
    <div className={`${bgColor} text-white p-3 rounded-lg shadow-card`}>
      <div className="font-bold text-sm">{slot.course}</div>
      <div className="text-xs opacity-90 mt-1">{slot.room}</div>
      <div className="text-xs mt-2 flex justify-between">
        <span>{formatTime(slot.start_time)}</span>
        <span>→</span>
        <span>{formatTime(slot.end_time)}</span>
      </div>
    </div>
  );
}