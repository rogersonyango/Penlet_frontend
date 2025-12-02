"use client";

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import TimetableHeader from '../../components/timetable/TimetableHeader';
import TimeSlotCard from '../../components/timetable/TimeSlotCard';
import { useDailyTimetable } from '../../hooks/timetable';
import { formatTime } from '../../utils/date';

const MOCK_USER_ID = 1;

export default function DailyTimetablePage() {
  const today = new Date().toISOString().split('T')[0];
  const { slots, loading, error } = useDailyTimetable(MOCK_USER_ID, today);

  const sortedSlots = useMemo(() => {
    return [...slots].sort(
      (a, b) => new Date(a.start_time) - new Date(b.start_time)
    );
  }, [slots]);

  if (loading)
    return (
      <div className="p-8 text-center text-text-secondary animate-pulse">
        Loading today’s schedule...
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Error: {error}
      </div>
    );

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto bg-gradient-primary rounded-card shadow-float">
      <TimetableHeader
        title="Today’s Schedule"
        subtitle={new Date(today).toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        actions={
          <Link
            to="/timetable"
            className="px-5 py-2 bg-gradient-to-r from-pink-gradient-start to-purple-mid 
            text-white rounded-button shadow-button font-semibold"
          >
            Weekly View
          </Link>
        }
      />

      {/* No Schedule */}
      {sortedSlots.length === 0 ? (
        <div className="text-center py-16 animate-fadeIn">
          <div className="text-yellow text-6xl mb-5">📅</div>
          <p className="text-text-secondary text-lg">
            No classes scheduled for today!
          </p>
        </div>
      ) : (
        <div className="space-y-5 mt-4 animate-fadeIn">
          {sortedSlots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-start gap-4 p-5 bg-white rounded-card shadow-card 
              border-l-4 border-primary-500"
            >
              {/* Time block */}
              <div className="text-center min-w-[80px]">
                <div className="text-blue-card font-extrabold text-xl">
                  {formatTime(slot.start_time).replace(':00', '')}
                </div>
                <div className="text-gray-500 text-xs">to</div>
                <div className="text-blue-card font-extrabold text-xl">
                  {formatTime(slot.end_time).replace(':00', '')}
                </div>
              </div>

              {/* Class info */}
              <TimeSlotCard slot={slot} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
