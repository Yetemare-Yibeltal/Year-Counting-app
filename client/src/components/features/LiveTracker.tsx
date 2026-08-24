import React, { useState, useEffect } from "react";

export const LiveTracker: React.FC = () => {
  const [progress, setProgress] = useState<number>(0);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const current = new Date();
      setNow(current);
      const start = new Date(current.getFullYear(), 0, 1).getTime();
      const end = new Date(current.getFullYear() + 1, 0, 1).getTime();
      const pct = ((current.getTime() - start) / (end - start)) * 100;
      setProgress(parseFloat(pct.toFixed(6)));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="live-tracker" className="py-12 bg-gray-900 border-b border-gray-800 text-white px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></span> Live Year Progress Tracker
        </h2>
        <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700">
          <div className="flex justify-between mb-2 text-sm font-mono text-gray-300">
            <span>Year {now.getFullYear()} Elapsed</span>
            <span className="text-indigo-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-4 text-xs font-mono text-gray-400">
            System UTC: {now.toISOString()}
          </p>
        </div>
      </div>
    </section>
  );
};

export default LiveTracker;
