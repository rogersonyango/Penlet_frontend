import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role'); // Get role from URL (?role=teacher)
  
  const { login, logout, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      const userRole = result.user?.role || 'student';
      
      // Validate that user's role matches the portal they're trying to access
      if (role && role !== userRole) {
        // User is trying to access wrong portal
        const roleLabels = {
          student: 'Student',
          teacher: 'Teacher', 
          admin: 'Admin'
        };
        toast.error(`This account is registered as ${roleLabels[userRole]}. Please use the ${roleLabels[userRole]} login.`);
        
        // Log them out since we already logged them in
        logout();
        return;
      }
      
      toast.success('Welcome back!');
      
      // Role-based redirect
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  // Display role-specific title
  const getRoleTitle = () => {
    if (role === 'teacher') return 'Teacher Login';
    if (role === 'admin') return 'Admin Login';
    return 'Student Login';
  };

  const getRoleSubtitle = () => {
    if (role === 'teacher') return 'Sign in to manage your classes and content';
    if (role === 'admin') return 'Sign in to manage the system';
    return 'Sign in to your account to continue';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{getRoleTitle()}</h2>
      <p className="text-gray-600 mb-6">{getRoleSubtitle()}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
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

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Back to Role Selection */}
      <div className="mt-4 text-center">
        <Link
          to="/"
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          ← Back to role selection
        </Link>
      </div>

      {/* Sign Up Link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;