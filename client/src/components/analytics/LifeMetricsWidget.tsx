import React, { useState } from 'react';
import { AnalyticsService } from '../../../../server/src/services/analytics.service';

export const LifeMetricsWidget: React.FC = () => {
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [targetAge, setTargetAge] = useState(80);

  const metrics = AnalyticsService.calculateLifeMetrics(birthDate, targetAge);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Life Span & Allocation Analytics</h3>
          <p className="text-xs text-gray-400">Statistical distribution of time allocation across life milestones</p>
        </div>
        <div className="flex gap-3">
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
          />
          <input
            type="number"
            value={targetAge}
            onChange={(e) => setTargetAge(Number(e.target.value))}
            className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white w-20 focus:outline-none"
            placeholder="Target Age"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Life Progress ({metrics.currentAgeYears} / {metrics.targetAge} years)</span>
          <span className="font-bold text-indigo-400">{metrics.lifePercentageElapsed}%</span>
        </div>
        <div className="w-full bg-gray-950 rounded-full h-4 p-0.5 border border-gray-800">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, metrics.lifePercentageElapsed)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
          <span className="text-xs text-gray-500 uppercase">Days Lived</span>
          <div className="text-2xl font-black text-white tabular-nums">{metrics.totalDaysLived.toLocaleString()}</div>
        </div>
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
          <span className="text-xs text-gray-500 uppercase">Est. Days Left</span>
          <div className="text-2xl font-black text-pink-400 tabular-nums">{metrics.estimatedDaysRemaining.toLocaleString()}</div>
        </div>
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
          <span className="text-xs text-gray-500 uppercase">Hours Asleep (8h/day)</span>
          <div className="text-2xl font-black text-purple-400 tabular-nums">{metrics.estimatedSleepHoursSpent.toLocaleString()}</div>
        </div>
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
          <span className="text-xs text-gray-500 uppercase">Work Hours Spent</span>
          <div className="text-2xl font-black text-indigo-400 tabular-nums">{metrics.estimatedWorkHoursSpent.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};