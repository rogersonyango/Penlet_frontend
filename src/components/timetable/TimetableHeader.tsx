// src/components/timetable/TimetableHeader.jsx

export default function TimetableHeader({ title, subtitle, actions }) {
  return (
    <div className="bg-gradient-to-r from-pink-gradient-start to-purple-gradient p-6 rounded-card shadow-float mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-hero font-bold text-white">{title}</h1>
          {subtitle && <p className="text-yellow-light mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="mt-4 md:mt-0">{actions}</div>}
      </div>
    </div>
  );
}