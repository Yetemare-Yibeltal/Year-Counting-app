import React, { useState } from "react";

export const CalculatorSuite: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>("2000-01-01");
  const [startDate, setStartDate] = useState<string>("2026-01-01");
  const [endDate, setEndDate] = useState<string>("2026-12-31");

  const calculateAge = (dob: string) => {
    const birth = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    return { years, months, days };
  };

  const age = calculateAge(birthDate);

  const calculateDaysBetween = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 text-slate-100">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Calculator Suite</h1>
        <p className="text-slate-400 text-sm">Perform chronological, business, and milestone time calculations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exact Age Calculator */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-indigo-400">Exact Chronological Age</h2>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Select Date of Birth</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
              <div className="text-2xl font-bold text-white">{age.years}</div>
              <div className="text-xs text-slate-500 uppercase">Years</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
              <div className="text-2xl font-bold text-indigo-400">{age.months}</div>
              <div className="text-xs text-slate-500 uppercase">Months</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
              <div className="text-2xl font-bold text-purple-400">{age.days}</div>
              <div className="text-xs text-slate-500 uppercase">Days</div>
            </div>
          </div>
        </div>

        {/* Date Span Counter */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-indigo-400">Date Span & Duration</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex justify-between items-center">
            <span className="text-sm text-slate-400">Total Duration:</span>
            <span className="text-2xl font-bold text-indigo-400 font-mono">
              {calculateDaysBetween(startDate, endDate)} Days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorSuite;