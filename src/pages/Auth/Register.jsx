import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, GraduationCap, BookOpen, Shield, School } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role');
  
  const { register, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: roleFromUrl || 'student',
    studentClass: '',
    agreeToTerms: false,
  });

  // Available class levels
  const classLevels = [
    { id: 'S1', name: 'Senior 1' },
    { id: 'S2', name: 'Senior 2' },
    { id: 'S3', name: 'Senior 3' },
    { id: 'S4', name: 'Senior 4' },
    { id: 'S5', name: 'Senior 5' },
    { id: 'S6', name: 'Senior 6' },
  ];

  const roles = [
    {
      id: 'student',
      name: 'Student',
      icon: GraduationCap,
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'teacher',
      name: 'Teacher',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-50',
    },
    {
      id: 'admin',
      name: 'Admin',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate student class for students
    if (formData.role === 'student' && !formData.studentClass) {
      toast.error('Please select your class');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      studentClass: formData.role === 'student' ? formData.studentClass : null,
    });

    if (result.success) {
      toast.success('Account created successfully!');
      
      // Role-based redirect
      if (formData.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (formData.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an account</h2>
      <p className="text-gray-600 mb-6">Join Penlet to start your learning journey</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            I am a
          </label>
          <div className="grid grid-cols-3 gap-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = formData.role === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: role.id }))}
                  className={`
                    relative p-3 rounded-lg border-2 transition-all duration-200
                    flex flex-col items-center justify-center gap-2
                    ${isSelected 
                      ? `${role.borderColor} ${role.bgColor}` 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  <div className={`
                    p-2 rounded-full 
                    ${isSelected 
                      ? `bg-gradient-to-br ${role.color} text-white` 
                      : 'bg-gray-100 text-gray-500'
                    }
                  `}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                    {role.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Class Selection - Only show for students */}
        {formData.role === 'student' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <School size={18} className="text-gray-500" />
                Select Your Class
              </div>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {classLevels.map((cls) => {
                const isSelected = formData.studentClass === cls.id;
                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, studentClass: cls.id }))}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-200
                      text-center font-medium
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-600'
                      }
                    `}
                  >
                    {cls.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input"
              placeholder="John"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input"
              placeholder="Doe"
              required
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <div className="relative">
            <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input pl-10"
              placeholder="johndoe"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input pl-10"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input pl-10 pr-10"
              placeholder="At least 8 characters"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input pl-10 pr-10"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            required
          />
          <span className="ml-2 text-sm text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
              Privacy Policy
            </a>
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      {/* Sign In Link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;