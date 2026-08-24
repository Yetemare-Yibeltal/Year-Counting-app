import React from "react";
import Header from "../components/layout/Header";
import { YearProgressBar } from "../components/dashboard/YearProgressBar";
import { AgeCalculatorView } from "../components/calculator/AgeCalculatorView";

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <div>
        <Header />

        <main className="max-w-6xl mx-auto px-4 py-10 space-y-12">
          {/* Hero Section */}
          <section className="text-center space-y-4 max-w-3xl mx-auto pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
              <span>Precision Time Engine</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Standard Year Analytics & Time Calculation Platform
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Real-time annual metric breakdown, high-precision date intervals, and astronomical leap-year accounting delivered through a client-side computation architecture.
            </p>
          </section>

          {/* Section 1: Live Progress Tracker */}
          <section id="live-tracker" className="scroll-mt-20">
            <YearProgressBar />
          </section>

          {/* Section 2: Calculator Suite */}
          <section id="calculator" className="scroll-mt-20 bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-gray-800 pb-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Date & Age Calculator Suite</h2>
              <p className="text-xs text-gray-400 mt-1">
                Perform exact temporal duration analysis across custom intervals, years, months, and days.
              </p>
            </div>
            <AgeCalculatorView />
          </section>

          {/* Section 3: Fullstack System Architecture Specs */}
          <section id="architecture" className="scroll-mt-20 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">System Specifications & Architecture</h2>
              <p className="text-xs text-gray-400">Formal technical breakdown of underlying computation and execution layers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-900 border border-gray-800/80 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                  01
                </div>
                <h3 className="text-lg font-bold text-white">Client Execution Engine</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Calculations execute within browser runtime to guarantee zero latency and immediate feedback without server round-trip delays.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800/80 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                  02
                </div>
                <h3 className="text-lg font-bold text-white">Leap & Quarter Math</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Temporal algorithms evaluate 365 vs 366-day solar cycles and dynamically adjust fiscal quarters (Q1-Q4) in real time.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800/80 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 font-bold">
                  03
                </div>
                <h3 className="text-lg font-bold text-white">Stateless Security</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Inputs and computed metrics stay private on local client storage without persistent personal data logging.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Production Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/40 py-8 mt-16 text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} YearCounter App. Distributed under standard open utility license.</p>
          <div className="flex items-center gap-6 text-gray-400">
            <span>React & Tailwind Engine</span>
            <span>•</span>
            <span>TypeScript Native</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;