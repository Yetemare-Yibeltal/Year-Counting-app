import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import { LiveTracker } from "./components/features/LiveTracker";
import { CalculatorSuite } from "./components/features/CalculatorSuite";
import { SystemSpecs } from "./components/features/SystemSpecs";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      <Header />
      <main className="max-w-6xl mx-auto py-8">
        <Routes>
          <Route path="/" element={<LiveTracker />} />
          <Route path="/calculator" element={<CalculatorSuite />} />
          <Route path="/specs" element={<SystemSpecs />} />
          <Route path="*" element={<LiveTracker />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
