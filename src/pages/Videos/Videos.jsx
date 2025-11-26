import React from 'react';
import { Play, Clock, Eye } from 'lucide-react';
import { mockVideos, mockSubjects } from '../../services/mockData';

const Videos = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Video Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVideos.map(video => {
          const subject = mockSubjects.find(s => s.id === video.subjectId);
          return (
            <div key={video.id} className="card group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="relative aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <Play size={24} className="text-primary-600 ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="font-semibold mb-2">{video.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{video.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span>{video.views}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Videos;