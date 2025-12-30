import React, { useState, useRef } from 'react';
import { User, Mail, Calendar, Award, Camera, X, Save, Edit3 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const { theme } = useAppStore();
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profile_image || null);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    username: user?.username || '',
    email: user?.email || '',
  });

  // Get user initials for default avatar
  const getInitials = () => {
    if (user?.full_name) {
      const names = user.full_name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  // Get role badge color
  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'teacher':
        return 'bg-green-100 text-green-700';
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, this would call an API endpoint
      // For now, we'll update the local state
      const updatedUser = {
        ...user,
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        profile_image: profileImage,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      updateUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      full_name: user?.full_name || '',
      username: user?.username || '',
      email: user?.email || '',
    });
    setProfileImage(user?.profile_image || null);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          My Profile
        </h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className={`card ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Image */}
            <div className="relative group">
              <div 
                onClick={handleImageClick}
                className={`
                  w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold
                  overflow-hidden transition-all duration-200
                  ${isEditing ? 'cursor-pointer ring-4 ring-primary-500 ring-opacity-50' : ''}
                  ${!profileImage ? 'bg-gradient-to-br from-primary-500 to-primary-600' : ''}
                `}
                style={{
                  boxShadow: '0 8px 24px rgba(147, 51, 234, 0.3)'
                }}
              >
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials()
                )}
                
                {/* Edit overlay */}
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Camera size={28} className="text-white" />
                  </div>
                )}
              </div>

              {/* Remove image button */}
              {isEditing && profileImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X size={16} />
                </button>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {user?.full_name || 'User'}
                    </h2>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${getRoleBadgeColor()}`}>
                      {user?.role || 'student'}
                    </span>
                  </div>
                  <p className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    @{user?.username || 'username'}
                  </p>
                </>
              )}

              {/* Action buttons when editing */}
              {isEditing && (
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={`btn ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className={`card ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Mail size={20} className="text-primary-500" />
                </div>
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                  <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>{user?.email || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <User size={20} className="text-primary-500" />
                </div>
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Username</p>
                  <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>@{user?.username || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Calendar size={20} className="text-primary-500" />
                </div>
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Joined</p>
                  <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
                    {user?.created_at 
                      ? new Date(user.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : 'Recently'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`card ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Achievements
            </h3>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl shadow-lg">
                <Award size={32} className="text-white" />
              </div>
              <div>
                <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Study Streak
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  7 days in a row!
                </p>
              </div>
            </div>
            
            <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Keep up the great work! You're building excellent study habits.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;