import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export const Header: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 transition-colors px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold ${
      isActive
        ? "text-indigo-400 bg-indigo-500/10 border border-indigo-500/20"
        : "text-gray-300 hover:text-indigo-400 hover:bg-gray-800/50"
    }`;

  return (
    <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Header */}
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/30">
            YC
          </div>
          <span className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            Year Counter <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">

            </span>
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={getLinkClass}>
            Live Solar Engine
          </NavLink>
          <NavLink to="/calculator" className={getLinkClass}>
            Calculator Suite
          </NavLink>
          <NavLink to="/specs" className={getLinkClass}>
            System Architecture
          </NavLink>
        </nav>

        {/* Engine Status Tag */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono text-emerald-400">Engine Active</span>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {isMobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <nav className="md:hidden bg-gray-900 border-b border-gray-800 px-4 pt-2 pb-4 space-y-2">
          <NavLink to="/" onClick={() => setIsMobileOpen(false)} className={getLinkClass}>
            Live Solar Engine
          </NavLink>
          <NavLink to="/calculator" onClick={() => setIsMobileOpen(false)} className={getLinkClass}>
            Calculator Suite
          </NavLink>
          <NavLink to="/specs" onClick={() => setIsMobileOpen(false)} className={getLinkClass}>
            System Architecture
          </NavLink>
        </nav>
      )}
    </header>
  );
};

export default Header;