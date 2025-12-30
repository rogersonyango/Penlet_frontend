// src/pages/notes/CreateNotePage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../../services/notes/noteServices';

export default function CreateNotePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [curriculum, setCurriculum] = useState('O-Level');
  const [file, setFile] = useState<File | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createNote({ title, content, curriculum }, file);
      navigate('/notes');
    } catch (error) {
      console.error('Failed to create note:', error);
      setSubmitting(false);
    }
  };

  // Curriculum colors for preview
  const curriculumColors = {
    'O-Level': {
      badge: 'from-purple-400 to-purple-600',
      border: 'border-purple-400',
      bg: 'from-purple-50 to-purple-100',
      emoji: '📘'
    },
    'A-Level': {
      badge: 'from-green-400 to-green-600',
      border: 'border-green-400',
      bg: 'from-green-50 to-green-100',
      emoji: '📗'
    },
    'University': {
      badge: 'from-cyan-400 to-cyan-600',
      border: 'border-cyan-400',
      bg: 'from-cyan-50 to-cyan-100',
      emoji: '🎓'
    }
  };

  const colorScheme = curriculumColors[curriculum];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <button
            onClick={() => navigate('/notes')}
            className="mb-6 px-6 py-3 bg-white border-3 border-purple-300 text-purple-700 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-sm sm:text-base hover:border-purple-400"
          >
            ← Back to Notes
          </button>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-transparent bg-clip-text text-center">
            ✍️ Create New Note
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-medium text-center">
            Share your knowledge with fellow students!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="animate-slideUp">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-xl border-4 border-purple-200 hover:border-purple-300 transition-all duration-300">
                <label className="block text-gray-700 font-bold mb-3 text-base sm:text-lg flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  Note Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Biology Cell Structure Notes"
                  className="w-full p-4 border-3 border-purple-300 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 font-medium text-base placeholder-gray-400"
                  required
                />
              </div>

              {/* Content Textarea */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-xl border-4 border-pink-200 hover:border-pink-300 transition-all duration-300">
                <label className="block text-gray-700 font-bold mb-3 text-base sm:text-lg flex items-center gap-2">
                  <span className="text-2xl">📄</span>
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note content here... Share your knowledge!"
                  rows={10}
                  className="w-full p-4 border-3 border-pink-300 rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-all duration-300 font-medium text-base placeholder-gray-400 resize-none"
                  required
                />
                <div className="text-sm text-gray-500 mt-2 font-medium">
                  {content.length} characters
                </div>
              </div>

              {/* Curriculum Selector */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-xl border-4 border-cyan-200 hover:border-cyan-300 transition-all duration-300">
                <label className="block text-gray-700 font-bold mb-3 text-base sm:text-lg flex items-center gap-2">
                  <span className="text-2xl">🎓</span>
                  Curriculum Level
                </label>
                <select
                  value={curriculum}
                  onChange={(e) => setCurriculum(e.target.value)}
                  className="w-full p-4 border-3 border-cyan-300 rounded-2xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500 transition-all duration-300 font-bold text-base appearance-none cursor-pointer bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '3rem',
                  }}
                >
                  <option value="O-Level">📘 O-Level</option>
                  <option value="A-Level">📗 A-Level</option>
                  <option value="University">🎓 University</option>
                </select>
              </div>

              {/* File Upload */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-xl border-4 border-green-200 hover:border-green-300 transition-all duration-300">
                <label className="block text-gray-700 font-bold mb-3 text-base sm:text-lg flex items-center gap-2">
                  <span className="text-2xl">📎</span>
                  Attach File (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0])}
                  className="w-full p-4 border-3 border-green-300 rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 font-medium bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-green-500 file:to-cyan-500 file:text-white file:font-bold file:cursor-pointer hover:file:opacity-90"
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600 font-medium flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    {file.name}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 rounded-full font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg ${
                  submitting
                    ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white'
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </span>
                ) : (
                  '🚀 Create Note'
                )}
              </button>
            </form>
          </div>

          {/* Preview Section */}
          <div className="animate-slideUp" style={{ animationDelay: '100ms' }}>
            <div className="sticky top-6">
              <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-xl border-4 border-yellow-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                    👀
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-yellow-600">
                    Live Preview
                  </h2>
                </div>

                {/* Preview Card */}
                <div className={`bg-gradient-to-br ${colorScheme.bg} p-6 rounded-3xl border-4 ${colorScheme.border} shadow-lg`}>
                  {/* Curriculum Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`
                        inline-flex items-center gap-2
                        bg-gradient-to-r ${colorScheme.badge}
                        text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-md
                      `}
                    >
                      <span className="text-base">{colorScheme.emoji}</span>
                      {curriculum}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-black text-xl sm:text-2xl mb-3 text-gray-800 line-clamp-2 min-h-[3rem]">
                    {title || 'Your note title will appear here'}
                  </h3>

                  {/* Content Preview */}
                  <p className="text-gray-700 text-sm sm:text-base line-clamp-4 leading-relaxed mb-4 font-medium min-h-[5rem]">
                    {content || 'Your note content will be previewed here as you type...'}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t-2 border-white/50">
                    <span className="text-xs font-bold text-gray-600">
                      📖 Preview
                    </span>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <span>Read More</span>
                      <span className="text-base">→</span>
                    </div>
                  </div>
                </div>

                {/* Tips Section */}
                <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-3 border-blue-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h4 className="font-bold text-blue-700 mb-2">Tips for Great Notes:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Use clear, descriptive titles</li>
                        <li>• Break content into sections</li>
                        <li>• Include examples and diagrams</li>
                        <li>• Keep it concise and focused</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}