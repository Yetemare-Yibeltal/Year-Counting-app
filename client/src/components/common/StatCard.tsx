import React from 'react';

interface Props {
  label: string;
  value: string | number;
  subtitle?: string;
  highlightColor?: string;
}

export const StatCard: React.FC<Props> = ({ label, value, subtitle, highlightColor = 'text-indigo-400' }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">{label}</span>
      <div className={`text-2xl md:text-3xl font-extrabold tabular-nums ${highlightColor}`}>
        {value}
      </div>
      {subtitle && <span className="text-xs text-gray-500 mt-2">{subtitle}</span>}
    </div>
  );
};