import React, { useState } from 'react';
import { useLiveTicker } from '../../hooks/useLiveTicker';
import { ClientDiffUtil } from '../../utils/clientDiff.util';

export const AgeCalculatorView: React.FC = () => {
  const [startDateStr, setStartDateStr] = useState<string>('2000-01-01T00:00');
  const now = useLiveTicker(50);

  const startDate = new Date(startDateStr);
  const diff = ClientDiffUtil.calculateDiff(startDate, now);

  return (
    <section id="calculator" className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Precision Age & Date Counter</h3>
          <p className="text-sm text-gray-400">Select a start date to calculate live elapsed time metrics.</p>
        </div>
        <input
          type="datetime-local"
          value={startDateStr}
          onChange={(e) => setStartDateStr(e.target.value)}
          className="bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-center">
          <div className="text-3xl font-extrabold text-indigo-400 tabular-nums">{diff.years}</div>
          <div className="text-xs text-gray-500 uppercase mt-1">Years</div>
        </div>
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-center">
          <div className="text-3xl font-extrabold text-indigo-400 tabular-nums">{diff.months}</div>
          <div className="text-xs text-gray-500 uppercase mt-1">Months</div>
        </div>
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-center">
          <div className="text-3xl font-extrabold text-indigo-400 tabular-nums">{diff.days}</div>
          <div className="text-xs text-gray-500 uppercase mt-1">Days</div>
        </div>
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-center">
          <div className="text-3xl font-extrabold text-purple-400 tabular-nums">{diff.hours}</div>
          <div className="text-xs text-gray-500 uppercase mt-1">Hours</div>
        </div>
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-center">
          <div className="text-3xl font-extrabold text-purple-400 tabular-nums">{diff.minutes}</div>
          <div className="text-xs text-gray-500 uppercase mt-1">Minutes</div>
        </div>
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-center">
          <div className="text-3xl font-extrabold text-pink-400 tabular-nums">{diff.seconds}</div>
          <div className="text-xs text-gray-500 uppercase mt-1">Seconds</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-950 p-4 rounded-xl border border-gray-800 text-sm">
        <div className="text-gray-400">Total Days: <span className="text-white font-bold tabular-nums">{diff.totalDays.toLocaleString()}</span></div>
        <div className="text-gray-400">Total Hours: <span className="text-white font-bold tabular-nums">{diff.totalHours.toLocaleString()}</span></div>
        <div className="text-gray-400">Total Seconds: <span className="text-white font-bold tabular-nums">{diff.totalSeconds.toLocaleString()}</span></div>
      </div>
    </section>
  );
};