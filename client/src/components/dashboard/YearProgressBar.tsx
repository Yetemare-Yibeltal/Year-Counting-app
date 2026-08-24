import React, { useState, useEffect } from "react";

export const YearProgressBar: React.FC = () => {
  const calculateMetrics = () => {
    const now = new Date();
    const year = now.getFullYear();

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    const totalMs = endOfYear.getTime() - startOfYear.getTime();
    const elapsedMs = now.getTime() - startOfYear.getTime();

    const totalDays = Math.round(totalMs / (1000 * 60 * 60 * 24));
    const dayOfYear = Math.floor(elapsedMs / (1000 * 60 * 60 * 24)) + 1;
    const daysRemaining = totalDays - dayOfYear;

    const percentageCompleted = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));
    const percentageRemaining = 100 - percentageCompleted;

    const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
    const qStartMonth = (currentQuarter - 1) * 3;
    const qStart = new Date(year, qStartMonth, 1);
    const qEnd = new Date(year, qStartMonth + 3, 1);
    const qTotalMs = qEnd.getTime() - qStart.getTime();
    const qElapsedMs = now.getTime() - qStart.getTime();
    const quarterProgress = Number(((qElapsedMs / qTotalMs) * 100).toFixed(2));

    return {
      year,
      percentageCompleted,
      percentageRemaining,
      dayOfYear,
      totalDays,
      daysRemaining,
      currentQuarter,
      quarterProgress,
    };
  };

  const [metrics, setMetrics] = useState(calculateMetrics);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(calculateMetrics());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="dashboard" className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">{metrics.year} Live Progress</h2>
          <p className="text-sm text-gray-400 mt-1">Real-time year completion tracker</p>
        </div>
        <div className="text-left md:text-right">
          <div className="text-4xl font-black text-indigo-400 tabular-nums">
            {metrics.percentageCompleted.toFixed(6)}%
          </div>
          <p className="text-xs text-gray-500">{metrics.percentageRemaining.toFixed(6)}% remaining</p>
        </div>
      </div>

      <div className="w-full bg-gray-950 rounded-full h-8 p-1.5 border border-gray-800 mb-6 shadow-inner">
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-75 ease-linear shadow-lg"
          style={{ width: `${Math.min(100, Math.max(0, metrics.percentageCompleted))}%` }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800/80">
          <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Day of Year</span>
          <span className="text-xl font-bold text-white tabular-nums">{metrics.dayOfYear} / {metrics.totalDays}</span>
        </div>
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800/80">
          <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Days Remaining</span>
          <span className="text-xl font-bold text-pink-400 tabular-nums">{metrics.daysRemaining}</span>
        </div>
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800/80">
          <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Quarter</span>
          <span className="text-xl font-bold text-purple-400">Q{metrics.currentQuarter}</span>
        </div>
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800/80">
          <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Q{metrics.currentQuarter} Progress</span>
          <span className="text-xl font-bold text-indigo-400 tabular-nums">{metrics.quarterProgress}%</span>
        </div>
      </div>
    </section>
  );
};

export default YearProgressBar;