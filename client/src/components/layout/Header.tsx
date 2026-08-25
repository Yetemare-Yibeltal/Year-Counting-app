import React from "react";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <header className="border-b border-gray-800 bg-gray-900/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-white text-lg">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-mono">
            YC
          </span>
          YearCounter <span className="text-xs text-gray-500 font-normal">v1.0.0</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-gray-300">
          <a href="/#live-tracker" className="hover:text-indigo-400 transition-colors">
            Live Tracker
          </a>
          <a href="/#calculator" className="hover:text-indigo-400 transition-colors">
            Calculator Suite
          </a>
          <a href="/#architecture" className="hover:text-indigo-400 transition-colors">
            System Specs
          </a>
        </nav>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Engine Active
        </div>
      </div>
    </header>
  );
};

export default Header;