import React from 'react';
import { useNavigate } from 'react-router-dom';
import { topics } from '../data/topics';
import { Gamepad2 } from 'lucide-react';
import VisitCounter from '../components/VisitCounter';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8 pt-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-800 mb-4 flex items-center justify-center gap-3">
            <Gamepad2 className="w-12 h-12" />
            Word Making Game
          </h1>
          <p className="text-gray-600 text-lg">Choose a topic and start playing!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => navigate(`/play/${topic.id}`)}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 
                transition-all duration-200 text-left group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{topic.icon}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                  {topic.words.length} words
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600">
                {topic.name}
              </h2>
              <p className="text-gray-600 text-sm">
                {topic.description}
              </p>
            </button>
          ))}
        </div>
      </div>
      <VisitCounter />
    </div>
  );
}

export default HomePage;