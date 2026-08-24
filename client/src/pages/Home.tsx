import React, { useState } from "react";
import { YearProgressBar } from "../components/dashboard/YearProgressBar";
import { AgeCalculatorView } from "../components/calculator/AgeCalculatorView";

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans pb-16">
      {/* Top Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <span className="text-xl font-bold text-white tracking-wide">YearCounter</span>
          </div>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-mono">
            Standard Utility
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8 space-y-10">
        {/* Intro */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            Precision Time & Year Analytics
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Track real-time annual completion metrics, calculate precise date intervals, and break down age milestones instantly.
          </p>
        </div>

        {/* Live Tracker Widget */}
        <YearProgressBar />

        {/* Calculator Tools Section */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-gray-800 pb-4">
            <h2 className="text-2xl font-bold text-white">Date & Age Calculator</h2>
            <p className="text-xs text-gray-400 mt-1">
              Select target dates to compute precise interval metrics down to total days, weeks, and months.
            </p>
          </div>
          <AgeCalculatorView />
        </section>

        {/* Information & Methodology FAQ */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800/80 p-5 rounded-xl space-y-2">
            <span className="text-xl">📆</span>
            <h3 className="text-lg font-bold text-white">Leap Year Aware</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Calculations automatically adjust for 365 or 366-day calendar variations based on astronomical leap cycles.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800/80 p-5 rounded-xl space-y-2">
            <span className="text-xl">⚡</span>
            <h3 className="text-lg font-bold text-white">Instant Client Calculations</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              All interval math runs locally on your device's browser engine for maximum performance and zero data latency.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800/80 p-5 rounded-xl space-y-2">
            <span className="text-xl">🔒</span>
            <h3 className="text-lg font-bold text-white">Private & Stateless</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your dates and calculations remain strictly within your browser environment without external tracking.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 pt-12 text-center border-t border-gray-800/60 mt-12 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} YearCounter App. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default Home;