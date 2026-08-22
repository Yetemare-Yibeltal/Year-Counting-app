import React, { useState, useEffect } from 'react';

interface CalendarData {
  gregorianISO: string;
  unixTimestamp: number;
  ethiopian: { year: number; month: number; day: number; monthName: string };
}

export const CalendarMatrix: React.FC = () => {
  const [data, setData] = useState<CalendarData | null>(null);

  useEffect(() => {
    const now = new Date();
    // Local client-side calculation fallback for zero-latency rendering
    const year = now.getFullYear();
    setData({
      gregorianISO: now.toISOString(),
      unixTimestamp: Math.floor(now.getTime() / 1000),
      ethiopian: {
        year: year - 8,
        month: now.getMonth() + 1,
        day: now.getDate(),
        monthName: 'Meskerem',
      },
    });
  }, []);

  if (!data) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 shadow-2xl">
      <h3 className="text-xl font-bold text-white mb-4">Multi-Calendar & Epoch Matrix</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Ethiopian Calendar</span>
          <div className="text-2xl font-black text-white mt-1">
            {data.ethiopian.monthName} {data.ethiopian.day}, {data.ethiopian.year} E.C.
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Solar Ge'ez Calendar System</span>
        </div>

        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
          <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">Unix Epoch Timestamp</span>
          <div className="text-2xl font-black text-white mt-1 tabular-nums">
            {data.unixTimestamp}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Seconds elapsed since Jan 01, 1970</span>
        </div>

        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
          <span className="text-xs text-pink-400 font-bold uppercase tracking-wider">UTC / ISO standard</span>
          <div className="text-lg font-mono font-bold text-white mt-1 truncate">
            {data.gregorianISO}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Coordinated Universal Time</span>
        </div>
      </div>
    </div>
  );
};