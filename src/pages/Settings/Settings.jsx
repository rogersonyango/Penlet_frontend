import React, { useState } from 'react';
import { Bell, Lock, User, Palette } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: false,
    darkMode: false,
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Bell size={20} />
          Notifications
        </h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span>Push Notifications</span>
            <input type="checkbox" checked={settings.notifications} onChange={(e) => setSettings({...settings, notifications: e.target.checked})} className="w-4 h-4" />
          </label>
          <label className="flex items-center justify-between">
            <span>Email Notifications</span>
            <input type="checkbox" checked={settings.emailNotifications} onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})} className="w-4 h-4" />
          </label>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Palette size={20} />
          Appearance
        </h2>
        <label className="flex items-center justify-between">
          <span>Dark Mode</span>
          <input type="checkbox" checked={settings.darkMode} onChange={(e) => setSettings({...settings, darkMode: e.target.checked})} className="w-4 h-4" />
        </label>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Lock size={20} />
          Security
        </h2>
        <button className="btn btn-outline w-full">Change Password</button>
      </div>
    </div>
  );
};

export default Settings;