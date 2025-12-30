"use client";

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import TimetableHeader from '../../components/timetable/TimetableHeader';
import TimeSlotCard from '../../components/timetable/TimeSlotCard';
import { useWeeklyTimetable } from '../../hooks/timetable';
import { dayOrder, getWeekStart } from '../../utils/date';

const MOCK_USER_ID = 1;

export default function TimetablePage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart());
  const { slots, loading, error } = useWeeklyTimetable(MOCK_USER_ID);

  const filteredSlots = useMemo(() => slots, [slots]);

  const groupedSlots = useMemo(() => {
    return filteredSlots.reduce((acc, slot) => {
      const day = slot.day_of_week.toLowerCase();
      if (!acc[day]) acc[day] = [];
      acc[day].push(slot);
      return acc;
    }, {});
  }, [filteredSlots]);

  const sortedDays = Object.keys(groupedSlots).sort(
    (a, b) => dayOrder[a] - dayOrder[b]
  );

  const nextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const prevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const weekLabel = `${currentWeekStart.toLocaleDateString()} – ${new Date(
    currentWeekStart.getTime() + 6 * 86400000
  ).toLocaleDateString()}`;

  if (loading)
    return (
      <div className="p-8 text-center text-text-secondary animate-pulse">
        Loading your timetable...
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Error: {error}
      </div>
    );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-gradient-primary rounded-card shadow-float animate-fadeIn">
      <TimetableHeader
        title="Weekly Timetable"
        subtitle={weekLabel}
        actions={
          <div className="flex space-x-3">
            {/* Prev Week */}
            <button
              onClick={prevWeek}
              className="px-4 py-2 bg-white text-purple-gradient border border-purple-light 
              rounded-button shadow-button font-medium hover:bg-purple-light/10 transition"
            >
              ← Prev Week
            </button>

            {/* Next Week */}
            <button
              onClick={nextWeek}
              className="px-4 py-2 bg-gradient-to-r from-blue-card to-blue-dark 
              text-white rounded-button shadow-button font-medium"
            >
              Next Week →
            </button>

            {/* New Timetable */}
            <Link
              to="/timetable/create"
              className="px-4 py-2 bg-gradient-to-r from-pink-gradient-start to-orange-light 
              text-white rounded-button shadow-button font-medium"
            >
              + New Timetable
            </Link>
          </div>
        }
      />

      {/* Week Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
        {sortedDays.map((day) => (
          <div
            key={day}
            className="bg-white rounded-card p-5 shadow-card border-l-4 border-purple-mid"
          >
            <h3 className="text-subheading font-bold text-text-primary capitalize mb-4 text-center pb-2 border-b border-purple-light">
              {day}
            </h3>

            <div className="space-y-3">
              {groupedSlots[day]
                ?.sort(
                  (a, b) => new Date(a.start_time) - new Date(b.start_time)
                )
                .map((slot) => <TimeSlotCard key={slot.id} slot={slot} />)}

              {/* No Classes Notice */}
              {(!groupedSlots[day] || groupedSlots[day].length === 0) && (
                <p className="text-gray-500 text-center italic">No classes</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Link to Today */}
      <div className="mt-10 text-center">
        <Link
          to="/timetable/daily"
          className="inline-block px-6 py-3 bg-gradient-to-r from-cyan to-cyan-light 
          text-teal-dark rounded-button shadow-button font-semibold"
        >
          View Today’s Schedule
        </Link>
      </div>
    </div>
  );
}
