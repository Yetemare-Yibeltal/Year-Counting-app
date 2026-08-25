import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { YearProgressBar } from "../components/dashboard/YearProgressBar";
import { AgeCalculatorView } from "../components/calculator/AgeCalculatorView";

interface ServerHealth {
  status: string;
  timestamp: string;
  services?: {
    database: string;
    redis: string;
  };
}

export const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"client" | "server" | "security">("client");
  const [serverHealth, setServerHealth] = useState<ServerHealth | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState<boolean>(true);

  const currentYear = new Date().getFullYear();
  const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  useEffect(() => {
    fetch("http://localhost:5000/health")
      .then((res) => res.json())
      .then((data: ServerHealth) => {
        setServerHealth(data);
        setIsHealthLoading(false);
      })
      .catch(() => setIsHealthLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <div>
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-10 space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-6 max-w-4xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              Precision Time Engine & Analytics Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              Standard Year Analytics & <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Time Calculation Platform
              </span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Real-time annual metric breakdown, high-precision date intervals, and astronomical leap-year accounting powered by an asynchronous client-server architecture.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-left">
              <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-xl">
                <div className="text-xs text-gray-400 font-medium">Current Cycle</div>
                <div className="text-xl font-bold text-white mt-1">{currentYear}</div>
              </div>
              <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-xl">
                <div className="text-xs text-gray-400 font-medium">Leap Year Status</div>
                <div className="text-xl font-bold text-indigo-400 mt-1">
                  {isLeapYear(currentYear) ? "366 Days (Active)" : "365 Days (Standard)"}
                </div>
              </div>
              <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-xl">
                <div className="text-xs text-gray-400 font-medium">Active Quarter</div>
                <div className="text-xl font-bold text-purple-400 mt-1">
                  Q{Math.floor(new Date().getMonth() / 3) + 1}
                </div>
              </div>
              <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-xl">
                <div className="text-xs text-gray-400 font-medium">Backend Health</div>
                <div className="text-xl font-bold mt-1 flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      serverHealth?.status === "ok" ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  ></span>
                  <span className={serverHealth?.status === "ok" ? "text-emerald-400" : "text-amber-400"}>
                    {isHealthLoading ? "Connecting..." : serverHealth?.status === "ok" ? "Online" : "Fallback"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 1: Live Progress Tracker */}
          <section id="live-tracker" className="scroll-mt-20 space-y-4">
            <div className="flex justify-between items-end border-b border-gray-800 pb-3">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">1. Real-Time Year Progress</h2>
                <p className="text-xs text-gray-400">Continuous solar cycle tracking down to microsecond intervals.</p>
              </div>
            </div>
            <YearProgressBar />
          </section>

          {/* Section 2: Calculator Suite */}
          <section id="calculator" className="scroll-mt-20 bg-gray-900/90 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-gray-800 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">2. Date & Age Calculator Suite</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Perform exact temporal duration analysis across custom intervals, years, months, and days.
                </p>
              </div>
            </div>
            <AgeCalculatorView />
          </section>

          {/* Section 3: Interactive System Specs */}
          <section id="architecture" className="scroll-mt-20 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">3. System Architecture & Tech Stack</h2>
              <p className="text-xs text-gray-400">Formal technical breakdown of computation, caching, and database layers.</p>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex justify-center gap-2 border-b border-gray-800 pb-4">
              <button
                onClick={() => setActiveTab("client")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "client"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-900 text-gray-400 hover:text-white"
                }`}
              >
                Frontend Engine
              </button>
              <button
                onClick={() => setActiveTab("server")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "server"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-900 text-gray-400 hover:text-white"
                }`}
              >
                Backend API & Cache
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "security"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-900 text-gray-400 hover:text-white"
                }`}
              >
                Security & Storage
              </button>
            </div>

            {/* Dynamic Tab Content */}
            <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl">
              {activeTab === "client" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-indigo-400">Client Runtime Architecture</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Built with React, TypeScript, and Vite for optimal build performance. Computations execute within client memory to guarantee sub-millisecond calculation speeds without forcing continuous server trips.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                      <div className="text-xs font-semibold text-gray-400">State Engine</div>
                      <div className="text-sm font-bold text-white mt-1">React 18 Concurrent Hooks</div>
                    </div>
                    <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                      <div className="text-xs font-semibold text-gray-400">Styling Framework</div>
                      <div className="text-sm font-bold text-white mt-1">Tailwind CSS Utility Engine</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "server" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-purple-400">Node.js & Express API Pipeline</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Powered by Node.js, Express, and Prisma ORM. Redis provides response caching with dynamic pattern invalidation and graceful in-memory fallbacks during local offline operation.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                      <div className="text-xs font-semibold text-gray-400">Database Layer</div>
                      <div className="text-sm font-bold text-white mt-1">Prisma Client v5 + PostgreSQL / SQLite</div>
                    </div>
                    <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                      <div className="text-xs font-semibold text-gray-400">Rate Limiter</div>
                      <div className="text-sm font-bold text-white mt-1">express-rate-limit + rate-limit-redis</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-pink-400">Stateless Privacy & Security Specs</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    User inputs for date calculations stay in local client memory. Backend endpoints utilize rate limiting headers, CORS validation, and non-blocking security checks to prevent abuse.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                      <div className="text-xs font-semibold text-gray-400">Data Isolation</div>
                      <div className="text-sm font-bold text-white mt-1">Zero Persistent User Logging</div>
                    </div>
                    <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                      <div className="text-xs font-semibold text-gray-400">Middleware Protection</div>
                      <div className="text-sm font-bold text-white mt-1">Global Rate Limiting (100 req / 15m)</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Production Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/40 py-8 mt-16 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} YearCounter Platform. Distributed under open utility license.</p>
          <div className="flex items-center gap-6 text-gray-400 font-mono">
            <span>React + Vite</span>
            <span>•</span>
            <span>Express Backend</span>
            <span>•</span>
            <span>Prisma ORM</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;