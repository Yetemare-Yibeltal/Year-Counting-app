import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/30">
            YC
          </div>
          <span className="text-lg font-bold text-white tracking-wide">
            YearCounter <span className="text-xs font-normal text-gray-400">v1.0.0</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
          <a href="#live-tracker" className="hover:text-indigo-400 transition-colors">
            Live Tracker
          </a>
          <a href="#calculator" className="hover:text-indigo-400 transition-colors">
            Calculator Suite
          </a>
          <a href="#architecture" className="hover:text-indigo-400 transition-colors">
            System Specs
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-mono text-emerald-400">Engine Active</span>
        </div>
      </div>
    </header>
  );
};

export default Header;