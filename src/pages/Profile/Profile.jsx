import React from 'react';
import { User, Mail, Calendar, Award } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Profile = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>

      <div className="card">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{user?.firstName} {user?.lastName}</h2>
            <p className="text-gray-600 mb-4">@{user?.username}</p>
            <button className="btn btn-primary">Edit Profile</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-gray-400" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-gray-400" />
              <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Achievements</h3>
          <div className="flex items-center gap-3">
            <Award size={40} className="text-yellow-500" />
            <div>
              <p className="font-semibold">Study Streak</p>
              <p className="text-sm text-gray-600">7 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;