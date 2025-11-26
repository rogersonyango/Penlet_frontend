import React from 'react';
import { mockGames } from '../../services/mockData';
import { Gamepad2 } from 'lucide-react';

const Games = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Educational Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockGames.map(game => (
          <div key={game.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Gamepad2 size={24} className="text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{game.title}</h3>
                <p className="text-sm text-gray-600">{game.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm px-3 py-1 bg-gray-100 rounded-full">{game.difficulty}</span>
              <button className="btn btn-primary btn-sm">Play Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;