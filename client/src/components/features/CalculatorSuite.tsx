import React, { useState } from "react";

export const CalculatorSuite: React.FC = () => {
  const [startYear, setStartYear] = useState<number>(2000);
  const [targetYear, setTargetYear] = useState<number>(2026);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/v1/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startYear, targetYear }),
      });
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        throw new Error("Backend calculation failed");
      }
    } catch {
      const diff = Math.abs(targetYear - startYear);
      setResult({
        diffYears: diff,
        totalDays: Math.round(diff * 365.2425),
        leapYears: Math.floor(diff / 4),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="calculator" className="py-12 bg-gray-900 border-b border-gray-800 text-white px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-indigo-400">Calculator Suite</h2>
        <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-800/60 p-6 rounded-xl border border-gray-700">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">Start Year</label>
            <input
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">Target Year</label>
            <input
              type="number"
              value={targetYear}
              onChange={(e) => setTargetYear(Number(e.target.value))}
              className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium p-2 rounded transition-colors"
            >
              {loading ? "Computing..." : "Run Calculation"}
            </button>
          </div>
        </form>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/80 p-4 rounded-lg border border-indigo-500/30">
              <span className="text-xs text-gray-400 block">Total Years Difference</span>
              <span className="text-2xl font-bold text-white">{result.diffYears} yrs</span>
            </div>
            <div className="bg-gray-800/80 p-4 rounded-lg border border-indigo-500/30">
              <span className="text-xs text-gray-400 block">Estimated Total Days</span>
              <span className="text-2xl font-bold text-indigo-400">{result.totalDays} days</span>
            </div>
            <div className="bg-gray-800/80 p-4 rounded-lg border border-indigo-500/30">
              <span className="text-xs text-gray-400 block">Leap Years Count</span>
              <span className="text-2xl font-bold text-emerald-400">{result.leapYears}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CalculatorSuite;
