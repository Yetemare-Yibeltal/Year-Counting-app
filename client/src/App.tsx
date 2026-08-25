import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import { LiveTracker } from "./components/features/LiveTracker";
import { CalculatorSuite } from "./components/features/CalculatorSuite";
import { SystemSpecs } from "./components/features/SystemSpecs";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <div>
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LiveTracker />} />
            <Route path="/calculator" element={<CalculatorSuite />} />
            <Route path="/specs" element={<SystemSpecs />} />
            <Route path="*" element={<LiveTracker />} />
          </Routes>
        </main>
      </div>

      <footer className="border-t border-gray-800 bg-gray-900/40 py-8 text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} YearCounter Platform. Distributed under open utility license.</p>
          <div className="flex items-center gap-6 text-gray-400 font-mono">
            <span>React + Vite</span>
            <span>•</span>
            <span>Express Backend</span>
            <span>•</span>
            <span>Prisma ORM</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;