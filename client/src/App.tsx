import React from "react";
import Header from "./components/layout/Header";
import { LiveTracker } from "./components/features/LiveTracker";
import { CalculatorSuite } from "./components/features/CalculatorSuite";
import { SystemSpecs } from "./components/features/SystemSpecs";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      <Header />
      <main>
        <LiveTracker />
        <CalculatorSuite />
        <SystemSpecs />
      </main>
    </div>
  );
};

export default App;
