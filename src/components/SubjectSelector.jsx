import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { subjectsAPI } from '../../services/apiService';

export default function SubjectSelector({ value, onChange, placeholder = "Select a subject", required = false }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subjectsAPI.getActive();
      setSubjects(data || []);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative">
        <select
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
        >
          <option>Loading subjects...</option>
        </select>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <select
          disabled
          className="w-full px-4 py-2 border border-red-300 rounded-lg bg-red-50 text-red-700"
        >
          <option>Error loading subjects</option>
        </select>
        <button
          onClick={fetchSubjects}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-600 hover:text-red-700 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
      >
        <option value="">{placeholder}</option>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name} ({subject.code})
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  );
}