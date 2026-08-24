import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50 py-4 px-6 mb-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-xl font-black tracking-wider text-white">CHRONOS</span>
          <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
            v1.0.0
          </span>
        </div>
        <nav className="flex space-x-6 text-sm text-gray-400 font-medium">
          <a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a>
          <a href="#calculator" className="hover:text-white transition-colors">Age Calculator</a>
          <a href="#milestones" className="hover:text-white transition-colors">Milestones</a>
        </nav>
      </div>
    </header>
  );
};