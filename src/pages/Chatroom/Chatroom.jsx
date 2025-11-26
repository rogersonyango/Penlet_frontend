import React from 'react';
import { Plus, Users } from 'lucide-react';

const Chatroom = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Study Chatrooms</h1>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          <span>Create Room</span>
        </button>
      </div>

      <div className="card max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users size={40} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No Active Chatrooms</h2>
        <p className="text-gray-600 mb-6">Create or join a chatroom to collaborate with other students</p>
        <button className="btn btn-primary">Create Your First Room</button>
      </div>
    </div>
  );
};

export default Chatroom;