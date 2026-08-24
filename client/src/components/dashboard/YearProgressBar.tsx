import React from "react";

export const YearProgressBar: React.FC = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

  const totalMs = endOfYear.getTime() - startOfYear.getTime();
  const elapsedMs = now.getTime() - startOfYear.getTime();
  const percentage = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));

  const daysPassed = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  const totalDays = Math.round(totalMs / (1000 * 60 * 60 * 24));

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
        <span>Year {now.getFullYear()} Progress</span>
        <span>{percentage.toFixed(2)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-indigo-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 text-right">
        Day {daysPassed} of {totalDays}
      </p>
    </div>
  );
};

export default YearProgressBar;