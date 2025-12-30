import React, { useState } from 'react';
import { Search, Bell, Menu, Moon, Sun, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { toggleSidebar, theme, setTheme, notifications } = useAppStore();
  const { logout, user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get user role (default to student)
  const userRole = user?.role || 'student';

  // Get profile path based on role
  const getProfilePath = () => {
    switch (userRole) {
      case 'teacher':
        return '/teacher/profile';
      case 'admin':
        return '/admin/profile';
      default:
        return '/profile';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return (
    <nav 
      className={`border-b px-6 py-4 ${
        theme === 'dark' ? 'border-gray-700' : 'border-purple-100'
      }`}
      style={{
        background: theme === 'dark'
          ? 'rgba(17, 24, 39, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: theme === 'dark'
          ? '0 2px 10px rgba(0, 0, 0, 0.3)'
          : '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-purple-50 text-gray-700'
            }`}
          >
            <Menu size={20} />
          </button>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-2xl">
            <Search
              size={20}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}
            />
            <input
              type="text"
              placeholder="Search notes, subjects, videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                theme === 'dark'
                  ? 'bg-gray-800 border-2 border-gray-700 text-gray-100 focus:border-transparent'
                  : 'bg-white border-2 border-purple-100 text-gray-700 focus:border-transparent'
              }`}
              style={{
                boxShadow: theme === 'dark'
                  ? '0 2px 4px rgba(0, 0, 0, 0.3)'
                  : '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 ml-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-purple-50 text-gray-700'
            }`}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <Moon size={20} />
            ) : (
              <Sun size={20} />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-lg transition-colors relative ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-purple-50 text-gray-700'
              }`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-xl border overflow-hidden z-20 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <p className="text-xs text-purple-100 mt-1">
                        {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications && notifications.length > 0 ? (
                      <ul className={`divide-y ${
                        theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                      }`}>
                        {notifications.slice(0, 5).map((notification) => (
                          <li
                            key={notification.id}
                            className={`p-4 cursor-pointer transition-colors ${
                              !notification.read 
                                ? theme === 'dark'
                                  ? 'bg-purple-900 bg-opacity-20'
                                  : 'bg-purple-50'
                                : theme === 'dark'
                                  ? 'hover:bg-gray-700'
                                  : 'hover:bg-gray-50'
                            }`}
                          >
                            <p className={`text-sm font-medium ${
                              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </p>
                            <p className={`text-xs mt-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {notification.message}
                            </p>
                            <p className={`text-xs mt-1 ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {notification.time}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className={`p-8 text-center ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <Bell size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    )}
                  </div>
                  {notifications && notifications.length > 0 && (
                    <div className={`p-3 text-center border-t ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* User Avatar */}
          <button 
            onClick={() => navigate(getProfilePath())}
            className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-lg transition-all"
            style={{
              boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)'
            }}
            title="View Profile"
          >
            {user?.full_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;