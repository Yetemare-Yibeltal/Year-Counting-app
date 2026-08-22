import React from 'react';
import { Header } from './components/layout/Header';
import { YearProgressBar } from './components/dashboard/YearProgressBar';
import { AgeCalculatorView } from './components/calculator/AgeCalculatorView';
import { useLiveTicker } from './hooks/useLiveTicker';
import { ClientProgressUtil } from './utils/clientProgress.util';

export const App: React.FC = () => {
  const now = useLiveTicker(50);
  const metrics = ClientProgressUtil.calculateLive(now);

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col font-sans">
      <Header />
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 md:px-6">
        <YearProgressBar metrics={metrics} />
        <AgeCalculatorView />
      </main>
      <footer className="border-t border-gray-900 py-6 text-center text-xs text-gray-600">
        &copy; {metrics.year} Chronos Year Counter Systems. All rights reserved.
      </footer>
    </div>
  );
};

export default App;