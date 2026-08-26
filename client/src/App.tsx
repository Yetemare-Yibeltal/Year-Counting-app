import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CalculatorSuite from "./pages/CalculatorSuite";
import SystemSpecs from "./pages/SystemSpecs";

// Inline Fallbacks in case LiveTracking or OrbitalSimulator files are missing locally
const LiveTrackingPage = () => (
  <div className="p-8 text-center font-mono text-gray-400">
    Live Tracking Module Loading... Ensure src/pages/LiveTracking.tsx exists.
  </div>
);

const OrbitalSimulator = () => (
  <div className="p-8 text-center font-mono text-gray-400">
    Orbital Simulator Module Loading... Ensure src/pages/OrbitalSimulator.tsx exists.
  </div>
);

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<CalculatorSuite />} />
          <Route path="/specs" element={<SystemSpecs />} />
          <Route path="/tracking" element={<LiveTrackingPage />} />
          <Route path="/simulator" element={<OrbitalSimulator />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;