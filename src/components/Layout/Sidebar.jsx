import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Calendar,
  MessageSquare,
  // Users,
  Brain,
  Video,
  CreditCard,
  Gamepad2,
  // FileImage,
  Box,
  Bell,
  TrendingUp,
  Settings,
  X,
  User,
  LogOut,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';

const Sidebar = () => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar, theme } = useAppStore();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Notes', path: '/notes' },
    { icon: BookOpen, label: 'Subjects', path: '/subjects' },
    { icon: Calendar, label: 'Timetable', path: '/timetable' },
    { icon: MessageSquare, label: 'AI Chatbot', path: '/chatbot' },
    // { icon: Users, label: 'Chatroom', path: '/chatroom' },
    { icon: Brain, label: 'Quizzes', path: '/quizzes' },
    { icon: Video, label: 'Videos', path: '/videos' },
    { icon: CreditCard, label: 'Flashcards', path: '/flashcards' },
    { icon: Gamepad2, label: 'Games', path: '/games' },
    // { icon: FileImage, label: 'Documents', path: '/documents' },
    { icon: Box, label: '3D Resources', path: '/resources-3d' },
    { icon: Bell, label: 'Alarms', path: '/alarms' },
    { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 border-r
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${theme === 'dark' 
            ? 'border-gray-700' 
            : 'border-purple-100'
          }
        `}
        style={{
          background: theme === 'dark' 
            ? 'rgba(17, 24, 39, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: theme === 'dark'
            ? '2px 0 10px rgba(0, 0, 0, 0.3)'
            : '2px 0 10px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center justify-between px-6 py-4 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-purple-100'
          }`}>
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Penlet
              </span>
            </Link>
            <button
              onClick={toggleSidebar}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-purple-50 text-gray-700'
              }`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hide">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg
                        font-medium transition-all duration-200
                        ${active 
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-primary-400'
                            : 'text-gray-700 hover:bg-purple-50 hover:text-primary-600'
                        }
                      `}
                      style={active ? {
                        boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)'
                      } : {}}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile Section */}
          <div className={`p-4 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-purple-100'
          }`}>
            <div className={`mb-3 p-3 rounded-lg transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-purple-50 hover:bg-purple-100'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate text-sm ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {user?.name || 'User'}
                  </p>
                  <p className={`text-xs truncate ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={logout}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                theme === 'dark'
                  ? 'text-red-400 hover:bg-red-900 hover:bg-opacity-20'
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;