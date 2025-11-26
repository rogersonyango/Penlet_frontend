import React from 'react';
import { Box } from 'lucide-react';

const Resources3D = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">3D Resources</h1>
      <div className="card max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Box size={40} className="text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Interactive 3D Models</h2>
        <p className="text-gray-600 mb-6">Explore educational content in 3D</p>
        <p className="text-sm text-gray-500">Coming soon...</p>
      </div>
    </div>
  );
};

export default Resources3D;