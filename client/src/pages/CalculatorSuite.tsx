import React, { useState } from "react";

type CalcMode = "age" | "difference" | "add_days" | "leap_check" | "work_hours" | "timezone";

export const CalculatorSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalcMode>("age");

  // Age State
  const [birthDate, setBirthDate] = useState<string>("2000-01-01");
  const [ageResult, setAgeResult] = useState<{ years: number; months: number; days: number; totalDays: number; totalHours: number } | null>(null);

  // Interval State
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [diffResult, setDiffResult] = useState<{ days: number; weeks: number; hours: number } | null>(null);

  // Projection State
  const [baseDate, setBaseDate] = useState<string>("");
  const [daysToAdd, setDaysToAdd] = useState<number>(30);
  const [projectedDate, setProjectedDate] = useState<string | null>(null);

  // Leap State
  const [checkYear, setCheckYear] = useState<number>(new Date().getFullYear());
  const [isLeapResult, setIsLeapResult] = useState<boolean | null>(null);

  // Work Hours State
  const [workDaysCount, setWorkDaysCount] = useState<number>(20);
  const [hoursPerDay, setHoursPerDay] = useState<number>(8);
  const [totalWorkHours, setTotalWorkHours] = useState<number | null>(null);

  // Timezone Offset State
  const [selectedOffset, setSelectedOffset] = useState<number>(0);
  const [convertedTime, setConvertedTime] = useState<string | null>(null);

  const calculateAge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;
    const start = new Date(birthDate);
    const today = new Date();

    let years = today.getFullYear() - start.getFullYear();
    let months = today.getMonth() - start.getMonth();
    let days = today.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;
    setAgeResult({ years, months, days, totalDays, totalHours });
  };

  const calculateDifference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    const d1 = new Date(startDate).getTime();
    const d2 = new Date(endDate).getTime();
    const diff = Math.abs(d2 - d1);
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    const weeks = +(days / 7).toFixed(1);
    const hours = days * 24;
    setDiffResult({ days, weeks, hours });
  };

  const calculateProjected = (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseDate) return;
    const d = new Date(baseDate);
    d.setDate(d.getDate() + Number(daysToAdd));
    setProjectedDate(d.toISOString().split("T")[0]);
  };

  const checkLeapYear = (e: React.FormEvent) => {
    e.preventDefault();
    const y = Number(checkYear);
    const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    setIsLeapResult(isLeap);
  };

  const calculateWorkHours = (e: React.FormEvent) => {
    e.preventDefault();
    setTotalWorkHours(workDaysCount * hoursPerDay);
  };

  const calculateTimezone = (e: React.FormEvent) => {
    e.preventDefault();
    const utcNow = new Date();
    const utcHours = utcNow.getUTCHours();
    const targetHours = (utcHours + Number(selectedOffset) + 24) % 24;
    const minutes = utcNow.getUTCMinutes().toString().padStart(2, "0");
    setConvertedTime(`${targetHours.toString().padStart(2, "0")}:${minutes} UTC${selectedOffset >= 0 ? "+" : ""}${selectedOffset}`);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white">Interactive Temporal Calculator Suite</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-2">
          High-precision computational utilities for interval analysis, age breakdown, work effort estimates, and timezone conversions.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-4">
        {[
          { id: "age", label: "Exact Age Engine" },
          { id: "difference", label: "Interval Between Dates" },
          { id: "add_days", label: "Future Date Projection" },
          { id: "leap_check", label: "Leap Year Validator" },
          { id: "work_hours", label: "Work Effort Estimator" },
          { id: "timezone", label: "UTC Offset Converter" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as CalcMode)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl max-w-3xl">
        {activeTab === "age" && (
          <form onSubmit={calculateAge} className="space-y-6">
            <div>
              <label htmlFor="birthdate-input" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Select Date of Birth
              </label>
              <input
                id="birthdate-input"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
            >
              Compute Precise Age
            </button>

            {ageResult && (
              <div className="pt-6 border-t border-gray-800 grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-center">
                  <div className="text-xl font-bold text-indigo-400">{ageResult.years}</div>
                  <div className="text-[10px] text-gray-400 mt-1 uppercase">Years</div>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-center">
                  <div className="text-xl font-bold text-purple-400">{ageResult.months}</div>
                  <div className="text-[10px] text-gray-400 mt-1 uppercase">Months</div>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-center">
                  <div className="text-xl font-bold text-pink-400">{ageResult.days}</div>
                  <div className="text-[10px] text-gray-400 mt-1 uppercase">Days</div>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-center">
                  <div className="text-xl font-bold text-emerald-400">{ageResult.totalDays.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-400 mt-1 uppercase">Total Days</div>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-center col-span-2 sm:col-span-1">
                  <div className="text-xl font-bold text-amber-400">{ageResult.totalHours.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-400 mt-1 uppercase">Total Hours</div>
                </div>
              </div>
            )}
          </form>
        )}

        {activeTab === "difference" && (
          <form onSubmit={calculateDifference} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-date-input" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Start Date
                </label>
                <input
                  id="start-date-input"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="end-date-input" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  End Date
                </label>
                <input
                  id="end-date-input"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
            >
              Calculate Duration Difference
            </button>

            {diffResult && (
              <div className="pt-6 border-t border-gray-800 grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                  <div className="text-2xl font-bold text-indigo-400">{diffResult.days.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-400 mt-1 uppercase">Days</div>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                  <div className="text-2xl font-bold text-purple-400">{diffResult.weeks}</div>
                  <div className="text-[10px] text-gray-400 mt-1 uppercase">Weeks</div>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                  <div className="text-2xl font-bold text-pink-400">{diffResult.hours.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-400 mt-1 uppercase">Hours</div>
                </div>
              </div>
            )}
          </form>
        )}

        {activeTab === "add_days" && (
          <form onSubmit={calculateProjected} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="base-date-input" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Initial Base Date
                </label>
                <input
                  id="base-date-input"
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="days-offset-input" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Days Offset
                </label>
                <input
                  id="days-offset-input"
                  type="number"
                  value={daysToAdd}
                  onChange={(e) => setDaysToAdd(Number(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
            >
              Project Future Date
            </button>

            {projectedDate && (
              <div className="pt-6 border-t border-gray-800 text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Target Calculated Date</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-2">{projectedDate}</div>
              </div>
            )}
          </form>
        )}

        {activeTab === "leap_check" && (
          <form onSubmit={checkLeapYear} className="space-y-6">
            <div>
              <label htmlFor="target-year-input" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Target Calendar Year
              </label>
              <input
                id="target-year-input"
                type="number"
                value={checkYear}
                onChange={(e) => setCheckYear(Number(e.target.value))}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
            >
              Evaluate Astronomical Rule
            </button>

            {isLeapResult !== null && (
              <div className="pt-6 border-t border-gray-800 text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Evaluation Verdict</div>
                <div className={`text-2xl font-extrabold mt-2 ${isLeapResult ? "text-emerald-400" : "text-amber-400"}`}>
                  {isLeapResult ? `${checkYear} IS a Leap Year (366 Days)` : `${checkYear} IS NOT a Leap Year (365 Days)`}
                </div>
              </div>
            )}
          </form>
        )}

        {activeTab === "work_hours" && (
          <form onSubmit={calculateWorkHours} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="work-days-input" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Number of Working Days
                </label>
                <input
                  id="work-days-input"
                  type="number"
                  value={workDaysCount}
                  onChange={(e) => setWorkDaysCount(Number(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="hours-per-day-input" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Hours Per Day
                </label>
                <input
                  id="hours-per-day-input"
                  type="number"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
            >
              Compute Work Effort Capacity
            </button>

            {totalWorkHours !== null && (
              <div className="pt-6 border-t border-gray-800 text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Total Allocated Labor Hours</div>
                <div className="text-3xl font-extrabold text-purple-400 mt-2">{totalWorkHours.toLocaleString()} Hours</div>
              </div>
            )}
          </form>
        )}

        {activeTab === "timezone" && (
          <form onSubmit={calculateTimezone} className="space-y-6">
            <div>
              <label htmlFor="timezone-offset-select" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Select UTC Offset (Hours)
              </label>
              <select
                id="timezone-offset-select"
                value={selectedOffset}
                onChange={(e) => setSelectedOffset(Number(e.target.value))}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              >
                {Array.from({ length: 25 }, (_, i) => i - 12).map((offset) => (
                  <option key={offset} value={offset}>
                    UTC {offset >= 0 ? `+${offset}` : offset}:00
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
            >
              Convert Live UTC Time
            </button>

            {convertedTime && (
              <div className="pt-6 border-t border-gray-800 text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Converted Regional Time</div>
                <div className="text-3xl font-mono font-extrabold text-indigo-400 mt-2">{convertedTime}</div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default CalculatorSuite;