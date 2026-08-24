import React from "react";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <span>📅</span>
          <span>Year Counter App</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-gray-600">
          <span>Standard Calculator</span>
        </nav>
      </div>
    </header>
  );
};

export default Header;