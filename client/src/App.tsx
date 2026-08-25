import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import CalculatorSuite from "./pages/CalculatorSuite";
import SystemSpecs from "./pages/SystemSpecs";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<CalculatorSuite />} />
          <Route path="/specs" element={<SystemSpecs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="border-t border-gray-800 bg-gray-900/60 py-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} YearCounter Platform. Enterprise Precision Time Engine.</p>
          <div className="flex items-center gap-4 font-mono text-gray-400">
            <span>React 18</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Express API</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;