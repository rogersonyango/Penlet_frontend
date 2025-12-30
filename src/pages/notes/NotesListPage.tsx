// src/pages/notes/NotesListPage.tsx
import { useState } from 'react';
import { useNotes } from '../../hooks/notes/useNotes';
import { NoteCard } from './NotesCard';

export default function NotesListPage() {
  const [search, setSearch] = useState('');
  const [curriculum, setCurriculum] = useState('');

  const { data: notes = [], isLoading } = useNotes({ search, curriculum });

  // Stats calculations
  const totalNotes = notes.length;
  const curricula = [...new Set(notes.map(note => note.curriculum))].length;
  const subjects = [...new Set(notes.map(note => note.subject))].length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-purple-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Loading notes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-transparent bg-clip-text text-center">
            📚 Study Notes
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-medium text-center">
            Find the perfect notes to ace your exams!
          </p>
        </div>

        {/* Stats Summary */}
        {totalNotes > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-slideUp">
            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-purple-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2 text-center">📝</div>
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  {totalNotes}
                </div>
                <div className="text-gray-600 font-bold text-sm">Total Notes</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-green-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2 text-center">🎓</div>
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-cyan-600 text-transparent bg-clip-text">
                  {curricula}
                </div>
                <div className="text-gray-600 font-bold text-sm">Curricula</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-yellow-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-2 text-center">📖</div>
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 text-transparent bg-clip-text">
                  {subjects}
                </div>
                <div className="text-gray-600 font-bold text-sm">Subjects</div>
              </div>
            </div>
          </div>
        )}

        {/* Search + Filter Section */}
        <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 mb-8 border-4 border-purple-200 animate-slideUp" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
              🔍
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-purple-600">
              Find Your Notes
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Search bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for notes, topics, subjects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-4 pl-12 rounded-2xl border-3 border-purple-300 bg-white focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 font-medium text-base placeholder-gray-400"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 text-xl">
                🔎
              </div>
            </div>

            {/* Curriculum Filter */}
            <div className="relative md:w-64">
              <select
                value={curriculum}
                onChange={(e) => setCurriculum(e.target.value)}
                className="w-full p-4 pl-12 rounded-2xl border-3 border-cyan-300 bg-white focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500 transition-all duration-300 font-bold text-base appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '3rem',
                }}
              >
                <option value="">🌍 All Curricula</option>
                <option value="O-Level">📘 O-Level</option>
                <option value="A-Level">📗 A-Level</option>
                <option value="University">🎓 University</option>
              </select>
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 text-xl pointer-events-none">
                🎯
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(search || curriculum) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-gray-600">Active filters:</span>
              {search && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-bold flex items-center gap-2">
                  🔍 "{search}"
                  <button
                    onClick={() => setSearch('')}
                    className="ml-1 hover:bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center transition-all"
                  >
                    ×
                  </button>
                </span>
              )}
              {curriculum && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-sm font-bold flex items-center gap-2">
                  🎯 {curriculum}
                  <button
                    onClick={() => setCurriculum('')}
                    className="ml-1 hover:bg-cyan-200 rounded-full w-5 h-5 flex items-center justify-center transition-all"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearch('');
                  setCurriculum('');
                }}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full text-sm font-bold transition-all"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Notes Grid */}
        {notes.length > 0 ? (
          <div className="animate-slideUp" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-gray-800">
                {search || curriculum ? `Found ${notes.length} note${notes.length !== 1 ? 's' : ''}` : 'All Notes'}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {notes.map((note, index) => (
                <div
                  key={note.id}
                  className="animate-slideUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <NoteCard note={note} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 sm:py-20 animate-fadeIn">
            <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border-4 border-gray-200 max-w-md mx-auto">
              <div className="text-6xl sm:text-7xl mb-4">
                {search || curriculum ? '🔍' : '📚'}
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
                {search || curriculum ? 'No notes found' : 'No notes available'}
              </p>
              <p className="text-gray-500 text-sm sm:text-base mb-6">
                {search || curriculum 
                  ? 'Try adjusting your search or filters' 
                  : 'Check back later for new study materials'}
              </p>
              {(search || curriculum) && (
                <button
                  onClick={() => {
                    setSearch('');
                    setCurriculum('');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}