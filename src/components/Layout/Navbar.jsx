import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, Moon, Sun, LogOut, BookOpen, Video, FileText, Brain, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import { globalSearch } from '../../services/searchApi';

const Navbar = () => {
  const navigate = useNavigate();
  const { toggleSidebar, theme, setTheme, notifications } = useAppStore();
  const { logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Handle search with debouncing
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch();
      } else {
        setSearchResults(null);
        setShowSearchResults(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async () => {
    setIsSearching(true);
    try {
      const results = await globalSearch(searchQuery, 5);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result) => {
    navigate(result.url);
    setShowSearchResults(false);
    setSearchQuery('');
    setSearchResults(null);
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'subject':
        return <BookOpen size={20} className="text-blue-600" />;
      case 'video':
        return <Video size={20} className="text-purple-600" />;
      case 'note':
        return <FileText size={20} className="text-green-600" />;
      case 'quiz':
        return <Brain size={20} className="text-orange-600" />;
      default:
        return <Search size={20} className="text-gray-400" />;
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md" ref={searchRef}>
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search notes, subjects, videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults && setShowSearchResults(true)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            
            {/* Loading Spinner */}
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader size={16} className="animate-spin text-primary-500" />
              </div>
            )}

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults && searchResults.total_results > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                {/* Subjects */}
                {searchResults.subjects.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                      Subjects ({searchResults.subjects.length})
                    </div>
                    {searchResults.subjects.map((result) => (
                      <div
                        key={`subject-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="mt-1">{getResultIcon(result.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 truncate">
                              {result.title}
                            </p>
                            {result.color && (
                              <span
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: result.color }}
                              />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {result.subtitle}
                          </p>
                          {result.description && (
                            <p className="text-xs text-gray-400 truncate mt-1">
                              {result.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Videos */}
                {searchResults.videos.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                      Videos ({searchResults.videos.length})
                    </div>
                    {searchResults.videos.map((result) => (
                      <div
                        key={`video-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        {result.thumbnail ? (
                          <img
                            src={result.thumbnail}
                            alt={result.title}
                            className="w-16 h-12 rounded object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-12 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                            {getResultIcon(result.type)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {result.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {result.subtitle}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {result.duration && (
                              <span className="text-xs text-gray-400">
                                {formatDuration(result.duration)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes (when implemented) */}
                {searchResults.notes.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                      Notes ({searchResults.notes.length})
                    </div>
                    {searchResults.notes.map((result) => (
                      <div
                        key={`note-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="mt-1">{getResultIcon(result.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {result.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {result.subtitle}
                          </p>
                          {result.description && (
                            <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                              {result.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quizzes (when implemented) */}
                {searchResults.quizzes.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                      Quizzes ({searchResults.quizzes.length})
                    </div>
                    {searchResults.quizzes.map((result) => (
                      <div
                        key={`quiz-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="mt-1">{getResultIcon(result.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {result.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {result.subtitle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* No Results */}
            {showSearchResults && searchResults && searchResults.total_results === 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4">
                <div className="text-center text-gray-500">
                  <Search size={24} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No results found for "{searchQuery}"</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-red-600"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;