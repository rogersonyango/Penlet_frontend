import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Shield } from 'lucide-react';

/**
 * RoleSelection Component
 * 
 * Allows users to select their role (Student, Teacher, or Admin) before login
 * This component appears before the login form
 */
const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'student',
      name: 'Student',
      description: 'Access study materials, videos, and assignments',
      icon: GraduationCap,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
    },
    {
      id: 'teacher',
      name: 'Teacher',
      description: 'Manage content, subjects, and track student progress',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Manage users, content, and system settings',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
    },
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    // Navigate to login page with role parameter
    navigate(`/login?role=${roleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Penlet
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Select your role to continue
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`
                  relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300
                  transform hover:scale-105 hover:shadow-2xl
                  ${selectedRole === role.id ? 'ring-4 ring-offset-2 ring-blue-500' : ''}
                `}
              >
                {/* Gradient Background */}
                <div className={`
                  bg-gradient-to-br ${role.color} ${role.hoverColor}
                  p-8 text-white transition-all duration-300
                `}>
                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="bg-white bg-opacity-20 rounded-full p-6 backdrop-blur-sm">
                      <Icon className="w-12 h-12" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3">
                    {role.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm opacity-90">
                    {role.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-6 flex items-center justify-center text-sm font-semibold">
                    <span>Continue</span>
                    <svg
                      className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            New to Penlet?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;