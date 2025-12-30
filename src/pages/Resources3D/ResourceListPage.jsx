// src/pages/Resources3D/Home.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useResources, useFeatured, useCategories } from '../../hooks/useResources';
import { Resource } from '../../types/resource';
import { formatDate } from '../../utils/formatDate';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { data: featured, isLoading: loadingFeatured } = useFeatured();
  const { data: categories } = useCategories();
  const { data: resources, isLoading: loadingResources } = useResources({ size: 6 });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page (or handle inline)
    }
  };

  // Calculate stats
  const totalResources = resources?.data?.total || 0;
  const totalCategories = categories?.data?.length || 0;
  const featuredCount = featured?.data?.length || 0;

  if (loadingFeatured || loadingResources) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-purple-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Loading resources...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="mb-8 animate-slideDown">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-purple-300 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-200 to-purple-200 rounded-full opacity-20 blur-3xl translate-y-10 -translate-x-10"></div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-transparent bg-clip-text animate-gradient">
                    🎨 3D Educational Resources
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base font-medium">
                    Explore interactive 3D models for enhanced learning
                  </p>
                </div>
                <Link
                  to="/resources/new"
                  className="w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-center text-sm sm:text-base flex items-center justify-center gap-2 group"
                >
                  <span className="text-xl group-hover:rotate-90 transition-transform duration-300">➕</span>
                  Add Resource
                </Link>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative group">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search models, subjects, topics..."
                      className="w-full px-5 py-4 pl-12 bg-gradient-to-r from-purple-50 to-pink-50 border-3 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 focus:outline-none transition-all duration-300 font-medium text-base placeholder-gray-400 group-hover:border-purple-300"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl group-hover:scale-110 transition-transform duration-300">
                      🔎
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-base flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">🔍</span>
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        {totalResources > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-slideUp" style={{ animationDelay: '50ms' }}>
            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-purple-300 transform hover:scale-105 hover:rotate-1 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  📦
                </div>
                <div>
                  <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                    {totalResources}
                  </div>
                  <div className="text-gray-600 font-bold text-sm">Total Resources</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-yellow-300 transform hover:scale-105 hover:rotate-1 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  ⭐
                </div>
                <div>
                  <div className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 text-transparent bg-clip-text">
                    {featuredCount}
                  </div>
                  <div className="text-gray-600 font-bold text-sm">Featured</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-cyan-300 transform hover:scale-105 hover:rotate-1 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  🏷️
                </div>
                <div>
                  <div className="text-3xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 text-transparent bg-clip-text">
                    {totalCategories}
                  </div>
                  <div className="text-gray-600 font-bold text-sm">Categories</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Categories Pills */}
        {categories?.data && (
          <div className="mb-8 animate-slideUp" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-cyan-400 rounded-xl flex items-center justify-center text-xl shadow-lg">
                🏷️
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-800">
                Browse by Category
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm shadow-lg transform hover:scale-105 transition-all duration-300 ${
                  selectedCategory === null
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white scale-105'
                    : 'bg-white text-gray-700 border-3 border-gray-300 hover:border-gray-400'
                }`}
              >
                🌟 All
              </button>
              {categories.data.map((cat, index) => {
                const categoryColors = [
                  { gradient: 'from-purple-400 to-pink-400', border: 'border-purple-400', emoji: '🔮' },
                  { gradient: 'from-pink-400 to-cyan-400', border: 'border-pink-400', emoji: '💎' },
                  { gradient: 'from-cyan-400 to-green-400', border: 'border-cyan-400', emoji: '🌊' },
                  { gradient: 'from-yellow-400 to-orange-400', border: 'border-yellow-400', emoji: '⚡' },
                  { gradient: 'from-green-400 to-cyan-400', border: 'border-green-400', emoji: '🌿' },
                ];
                const colorScheme = categoryColors[index % categoryColors.length];
                const isSelected = selectedCategory === cat.id;
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                    className={`px-5 py-2.5 rounded-full font-bold text-sm shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                      isSelected
                        ? `bg-gradient-to-r ${colorScheme.gradient} text-white scale-105`
                        : `bg-white text-gray-700 border-3 ${colorScheme.border}`
                    }`}
                  >
                    {!isSelected && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${colorScheme.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    )}
                    <span className="relative flex items-center gap-2">
                      <span className={isSelected ? 'animate-bounce' : 'group-hover:scale-125 transition-transform duration-300'}>
                        {colorScheme.emoji}
                      </span>
                      {cat.name}
                      {isSelected && (
                        <span className="ml-1 animate-pulse">✓</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            {selectedCategory && (
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-3 border-purple-200 animate-slideDown">
                <p className="text-sm font-bold text-purple-700 flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  Filtering by: {categories.data.find(c => c.id === selectedCategory)?.name}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="ml-auto px-3 py-1 bg-white rounded-full text-xs hover:bg-purple-50 transition-colors"
                  >
                    Clear ×
                  </button>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Featured Section with Enhanced Cards */}
        <div className="mb-10 animate-slideUp" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg animate-pulse-slow">
              ⭐
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
              Featured Resources
            </h2>
          </div>
          
          {featured?.data?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featured.data.slice(0, 3).map((resource, index) => (
                <Link
                  key={resource.id}
                  to={`/resources/${resource.id}`}
                  className="animate-slideUp bg-white p-5 sm:p-6 rounded-3xl shadow-lg border-3 border-purple-200 hover:border-yellow-400 transform hover:scale-105 hover:-rotate-1 transition-all duration-300 group relative overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500 opacity-30"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-md group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                        🎯
                      </div>
                      <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-600 rounded-full text-xs font-bold border-2 border-yellow-300 shadow-md animate-pulse-slow">
                        ⭐ Featured
                      </span>
                    </div>
                    <h3 className="font-black text-lg sm:text-xl text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 font-medium text-sm mb-4">{resource.subject}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 font-medium pt-3 border-t-2 border-gray-100">
                      <span className="flex items-center gap-1.5">
                        <span className="text-base">📅</span>
                        {formatDate(resource.created_at)}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full font-bold">
                        {resource.category?.name || 'Uncategorized'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border-4 border-gray-200 text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl font-bold text-gray-700">No featured resources yet</p>
            </div>
          )}
        </div>

        {/* Recent Resources with Enhanced Cards */}
        <div className="animate-slideUp" style={{ animationDelay: '250ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              🆕
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
              Recent Models
            </h2>
          </div>

          {resources?.data?.items?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {resources.data.items.map((resource, index) => (
                <Link
                  key={resource.id}
                  to={`/resources/${resource.id}`}
                  className="animate-slideUp bg-white p-5 sm:p-6 rounded-3xl shadow-lg border-3 border-cyan-200 hover:border-cyan-400 transform hover:scale-105 transition-all duration-300 group relative overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center text-3xl shadow-md flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        📦
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-lg text-gray-800 mb-1 truncate group-hover:text-cyan-600 transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-gray-600 font-medium text-sm line-clamp-2">
                          {resource.description || 'No description available'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-3 border-t-2 border-gray-100">
                      <span className="px-3 py-1 bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-700 rounded-full text-xs font-bold shadow-sm">
                        {resource.category?.name || 'General'}
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-full text-xs font-bold shadow-sm">
                        {resource.file_format?.toUpperCase() || '3D'}
                      </span>
                      <span className="ml-auto text-xs text-gray-500 font-bold flex items-center gap-1 group-hover:text-cyan-600 transition-colors">
                        View <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border-4 border-gray-200 text-center">
              <div className="text-6xl mb-4 animate-bounce-slow">📦</div>
              <p className="text-xl font-bold text-gray-700 mb-2">No resources yet</p>
              <p className="text-gray-500 text-sm mb-6">Be the first to add a 3D resource!</p>
              <Link
                to="/resources/new"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold"
              >
                <span className="text-2xl">➕</span>
                Add First Resource
              </Link>
            </div>
          )}
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

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(-10%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }

        .hover\:scale-105:hover {
          transform: scale(1.05);
        }

        .border-3 {
          border-width: 3px;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Home;