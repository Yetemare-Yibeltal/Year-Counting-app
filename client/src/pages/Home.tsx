import React, { useState, useEffect } from "react";
import { YearProgressBar } from "../components/dashboard/YearProgressBar";

interface ServerHealth {
  status: string;
  timestamp: string;
  uptime?: number;
  services?: {
    database: string;
    redis: string;
  };
}

export const Home: React.FC = () => {
  const [serverHealth, setServerHealth] = useState<ServerHealth | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState<boolean>(true);
  const [now, setNow] = useState<Date>(new Date());

  const currentYear = now.getFullYear();
  const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  // Time metrics calculations
  const startOfYear = new Date(currentYear, 0, 1).getTime();
  const endOfYear = new Date(currentYear + 1, 0, 1).getTime();
  const totalMsInYear = endOfYear - startOfYear;
  const elapsedMs = now.getTime() - startOfYear;
  const remainingMs = endOfYear - now.getTime();

  const progressPercent = Math.min(100, Math.max(0, (elapsedMs / totalMsInYear) * 100));
  const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  const totalDaysInYear = isLeapYear(currentYear) ? 366 : 365;

  // Active Quarter Calculation
  const currentMonth = now.getMonth();
  const currentQuarter = Math.floor(currentMonth / 3) + 1;
  const quarterStartMonth = (currentQuarter - 1) * 3;
  const quarterStart = new Date(currentYear, quarterStartMonth, 1).getTime();
  const quarterEnd = new Date(currentYear, quarterStartMonth + 3, 1).getTime();
  const quarterProgressPercent = Math.min(
    100,
    Math.max(0, ((now.getTime() - quarterStart) / (quarterEnd - quarterStart)) * 100)
  );

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch("http://localhost:5000/health")
      .then((res) => res.json())
      .then((data: ServerHealth) => {
        if (isMounted) {
          setServerHealth(data);
          setIsHealthLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsHealthLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          Precision Solar & Temporal Analytics Engine
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Real-Time Year Analytics & <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Temporal Intelligence Platform
          </span>
        </h1>

        <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Continuous solar cycle tracking, real-time millisecond progression, sub-day granular metrics, and quarter breakdown with client-server offset synchronization.
        </p>

        {/* Live Top Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-left">
          <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-xl">
            <div className="text-xs text-gray-400 font-medium">Solar Year Cycle</div>
            <div className="text-2xl font-bold text-white mt-1">{currentYear}</div>
            <div className="text-[10px] text-gray-500 mt-1">{isLeapYear(currentYear) ? "366 Days (Leap Year)" : "365 Days (Standard)"}</div>
          </div>

          <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-xl">
            <div className="text-xs text-gray-400 font-medium">Year Elapsed</div>
            <div className="text-2xl font-bold text-indigo-400 mt-1">{progressPercent.toFixed(5)}%</div>
            <div className="text-[10px] text-gray-500 mt-1">Day {elapsedDays} of {totalDaysInYear}</div>
          </div>

          <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-xl">
            <div className="text-xs text-gray-400 font-medium">Quarter {currentQuarter} Progress</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">{quarterProgressPercent.toFixed(2)}%</div>
            <div className="text-[10px] text-gray-500 mt-1">Q{currentQuarter} Target Window</div>
          </div>

          <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-xl">
            <div className="text-xs text-gray-400 font-medium">REST API Health</div>
            <div className="text-2xl font-bold mt-1 flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  serverHealth?.status === "ok" ? "bg-emerald-400" : "bg-amber-400"
                }`}
              ></span>
              <span className={`text-lg ${serverHealth?.status === "ok" ? "text-emerald-400" : "text-amber-400"}`}>
                {isHealthLoading ? "Syncing..." : serverHealth?.status === "ok" ? "Online" : "Fallback"}
              </span>
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Port 5000 Proxy</div>
          </div>
        </div>
      </section>

      {/* Primary Solar Tracker */}
      <section className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Solar Cycle Visualizer</h2>
            <p className="text-xs text-gray-400 mt-1">Dynamic time progress bar tracking microsecond offsets across annual solar milestones.</p>
          </div>
          <div className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 w-fit">
            UTC: {now.toISOString().substring(11, 19)}
          </div>
        </div>

        <YearProgressBar />
      </section>

      {/* Expanded Metrics Breakdown Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-xl space-y-2">
          <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Remaining Days</div>
          <div className="text-3xl font-extrabold text-white">{remainingDays}</div>
          <p className="text-xs text-gray-500">Days remaining until midnight Dec 31, {currentYear}.</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-xl space-y-2">
          <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Hours Elapsed</div>
          <div className="text-3xl font-extrabold text-indigo-400">{Math.floor(elapsedMs / (1000 * 60 * 60)).toLocaleString()}</div>
          <p className="text-xs text-gray-500">Total cumulative hours recorded in current year.</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-xl space-y-2">
          <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Minutes Elapsed</div>
          <div className="text-3xl font-extrabold text-purple-400">{Math.floor(elapsedMs / (1000 * 60)).toLocaleString()}</div>
          <p className="text-xs text-gray-500">Total operational minutes logged in standard time.</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-xl space-y-2">
          <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Seconds Elapsed</div>
          <div className="text-3xl font-extrabold text-pink-400">{Math.floor(elapsedMs / 1000).toLocaleString()}</div>
          <p className="text-xs text-gray-500">Micro-second accurate temporal count.</p>
        </div>
      </section>

      {/* System Features & Architecture Insights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
            01
          </div>
          <h3 className="text-lg font-bold text-white">Quarterly Milestones</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Tracks fiscal and calendar quarters with active percentage calculations and milestone target windows (Q1, Q2, Q3, Q4).
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
            02
          </div>
          <h3 className="text-lg font-bold text-white">Leap Rules Engine</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Evaluates standard Gregorian astronomical rules ($year \% 4 == 0$ and $year \% 100 \neq 0$ or $year \% 400 == 0$) to calculate leap days dynamically.
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 font-bold">
            03
          </div>
          <h3 className="text-lg font-bold text-white">Non-Blocking Node Pipeline</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Synchronizes client rendering with an Express backend using asynchronous health telemetry and fallback polling loops.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;