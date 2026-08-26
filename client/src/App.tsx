// src/App.tsx (or src/components/Layout.tsx)
import React from "react";
import { BrowserRouter, Routes, Route } from "react_router_dom"; // Or your router setup
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import LiveTrackingPage from "./pages/LiveTracking";
import OrbitalSimulator from "./pages/OrbitalSimulator";

export const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      {/* Main Content Area */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tracking" element={<LiveTrackingPage />} />
          <Route path="/simulator" element={<OrbitalSimulator />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default App;