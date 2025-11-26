import React from 'react';
import { TrendingUp, Clock, Award, Target } from 'lucide-react';
import { mockAnalytics } from '../../services/mockData';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Learning Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Study Time</p>
              <p className="text-2xl font-bold">{mockAnalytics.studyTime.today}m</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold">86%</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Target size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Goals Met</p>
              <p className="text-2xl font-bold">8/10</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Subject Progress</h2>
        <div className="space-y-4">
          {mockAnalytics.subjectProgress.map(item => (
            <div key={item.subject}>
              <div className="flex justify-between mb-1">
                <span className="font-medium">{item.subject}</span>
                <span className="text-gray-600">{item.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;