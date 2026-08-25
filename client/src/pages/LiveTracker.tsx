import React, { useState, useEffect } from "react";

export const LiveTracker: React.FC = () => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10);
    return () => clearInterval(timer);
  }, []);

  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1).getTime();
  const endOfYear = new Date(year + 1, 0, 1).getTime();
  const totalMsInYear = endOfYear - startOfYear;
  const elapsedMs = now.getTime() - startOfYear;
  const progressPercentage = ((elapsedMs / totalMsInYear) * 100).toFixed(6);

  const daysPassed = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.ceil((endOfYear - now.getTime()) / (1000 * 60 * 60 * 24));
  const hoursPassed = Math.floor(elapsedMs / (1000 * 60 * 60));
  const minutesPassed = Math.floor(elapsedMs / (1000 * 60));

  const quarters = [
    { label: "Q1 (Jan - Mar)", progress: Math.min(100, Math.max(0, ((elapsedMs / (totalMsInYear / 4)) * 100))).toFixed(2) },
    { label: "Q2 (Apr - Jun)", progress: Math.min(100, Math.max(0, (((elapsedMs - totalMsInYear / 4) / (totalMsInYear / 4)) * 100))).toFixed(2) },
    { label: "Q3 (Jul - Sep)", progress: Math.min(100, Math.max(0, (((elapsedMs - totalMsInYear / 2) / (totalMsInYear / 4)) * 100))).toFixed(2) },
    { label: "Q4 (Oct - Dec)", progress: Math.min(100, Math.max(0, (((elapsedMs - (3 * totalMsInYear) / 4) / (totalMsInYear / 4)) * 100))).toFixed(2) },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 text-slate-100">
      {/* Retained Core Feature */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl backdrop-blur-md">
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400 mb-4">
          <span className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></span>
          Live Year Progress Tracker
        </h2>
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-5">
          <div className="flex justify-between items-center mb-2 font-mono text-sm">
            <span className="text-slate-400">Year {year} Elapsed</span>
            <span className="text-indigo-400 font-bold">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-500 h-full transition-all duration-75"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="mt-3 font-mono text-xs text-slate-500 text-right">
            System UTC: {now.toISOString()}
          </div>
        </div>
      </div>

      {/* Expanded Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Days Completed</div>
          <div className="text-3xl font-extrabold text-white mt-2">{daysPassed} <span className="text-sm font-normal text-slate-500">days</span></div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Days Remaining</div>
          <div className="text-3xl font-extrabold text-indigo-400 mt-2">{daysRemaining} <span className="text-sm font-normal text-slate-500">days</span></div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Hours Elapsed</div>
          <div className="text-3xl font-extrabold text-purple-400 mt-2">{hoursPassed.toLocaleString()} <span className="text-sm font-normal text-slate-500">hrs</span></div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Minutes Elapsed</div>
          <div className="text-3xl font-extrabold text-blue-400 mt-2">{minutesPassed.toLocaleString()} <span className="text-sm font-normal text-slate-500">min</span></div>
        </div>
      </div>

      {/* Quarterly Breakdown Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Quarterly Progression Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quarters.map((q, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-lg border border-slate-800/60">
              <div className="flex justify-between text-sm mb-2 font-mono">
                <span className="text-slate-300 font-medium">{q.label}</span>
                <span className="text-indigo-400 font-bold">{q.progress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full"
                  style={{ width: `${q.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTracker;