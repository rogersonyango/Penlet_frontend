import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Calendar,
  MessageSquare,
  Users,
  Brain,
  Video,
  CreditCard,
  Gamepad2,
  FileImage,
  Box,
  Bell,
  TrendingUp,
  Settings,
  X,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const Sidebar = () => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Notes', path: '/notes' },
    { icon: BookOpen, label: 'Subjects', path: '/subjects' },
    { icon: Calendar, label: 'Timetable', path: '/timetable' },
    { icon: MessageSquare, label: 'AI Chatbot', path: '/chatbot' },
    { icon: Users, label: 'Chatroom', path: '/chatroom' },
    { icon: Brain, label: 'Quizzes', path: '/quizzes' },
    { icon: Video, label: 'Videos', path: '/videos' },
    { icon: CreditCard, label: 'Flashcards', path: '/flashcards' },
    { icon: Gamepad2, label: 'Games', path: '/games' },
    { icon: FileImage, label: 'Documents', path: '/documents' },
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
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Penlet</span>
            </Link>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
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
                      className={`
                        flex items-center space-x-3 px-3 py-2 rounded-lg
                        transition-colors duration-150
                        ${active
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <Icon size={20} className={active ? 'text-primary-600' : 'text-gray-500'} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-200 p-4">
            <Link
              to="/profile"
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                <p className="text-xs text-gray-500 truncate">john.doe@example.com</p>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;