import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
      toast.success('Password reset link sent to your email');
    }, 1500);
  };

  if (emailSent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
        <p className="text-gray-600 mb-6">
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <Link to="/login" className="btn btn-primary inline-flex items-center space-x-2">
          <ArrowLeft size={20} />
          <span>Back to Sign In</span>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={16} className="mr-1" />
        Back to Sign In
      </Link>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot password?</h2>
      <p className="text-gray-600 mb-6">
        No worries, we'll send you reset instructions
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input pl-10"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
          {isLoading ? 'Sending...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;