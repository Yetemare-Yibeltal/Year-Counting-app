import React, { useState } from 'react';
import { useCustomCountdowns } from '../../hooks/useCustomCountdowns';
import { ClientDiffUtil } from '../../utils/clientDiff.util';
import { useLiveTicker } from '../../hooks/useLiveTicker';

export const CustomCountdownList: React.FC = () => {
  const { countdowns, addCountdown, removeCountdown } = useCustomCountdowns();
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const now = useLiveTicker(1000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetDate) return;
    addCountdown({ title, targetDate, category: 'personal' });
    setTitle('');
    setTargetDate('');
  };

  return (
    <div id="milestones" className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 shadow-2xl">
      <h3 className="text-xl font-bold text-white mb-4">Custom Live Event Countdowns</h3>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Event Title (e.g. Project Launch)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-grow bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
        />
        <input
          type="datetime-local"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors"
        >
          Add Event
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {countdowns.map((item) => {
          const diff = ClientDiffUtil.calculateDiff(now, new Date(item.targetDate));
          return (
            <div key={item.id} className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-white text-base">{item.title}</h4>
                <div className="text-xs text-indigo-400 font-mono mt-1">
                  {diff.days}d {diff.hours}h {diff.minutes}m {diff.seconds}s
                </div>
              </div>
              <button
                onClick={() => removeCountdown(item.id)}
                className="text-gray-600 hover:text-red-400 text-xs px-2 py-1 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};