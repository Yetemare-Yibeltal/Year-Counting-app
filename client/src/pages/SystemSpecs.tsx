import React, { useState } from "react";

export const SystemSpecs: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"frontend" | "backend" | "database" | "security" | "api_docs">("frontend");

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white">Full-Stack Architecture & System Specifications</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-2">
          Comprehensive technical specification detailing client state orchestration, REST API routes, Prisma ORM schemas, and Redis caching policies.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-4">
        {[
          { id: "frontend", label: "Client Engine (React/TS)" },
          { id: "backend", label: "API Pipeline (Express/Node)" },
          { id: "database", label: "Data Schema (Prisma ORM)" },
          { id: "security", label: "Security & Caching" },
          { id: "api_docs", label: "REST Endpoint Docs" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeSection === tab.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl">
        {activeSection === "frontend" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-indigo-400">Frontend Client Architecture</h2>
              <p className="text-xs text-gray-400 mt-1">Single Page Application (SPA) driven by React 18, Vite build pipelines, and Tailwind CSS.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                <div className="text-xs font-semibold text-gray-400">Rendering Engine</div>
                <div className="text-sm font-bold text-white mt-1">React 18 Concurrent Root</div>
                <p className="text-[11px] text-gray-500 mt-2">Utilizes concurrent transitions and state batching for continuous live timer updates without UI blocking.</p>
              </div>
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                <div className="text-xs font-semibold text-gray-400">Type Safety</div>
                <div className="text-sm font-bold text-white mt-1">TypeScript 5 Strict Mode</div>
                <p className="text-[11px] text-gray-500 mt-2">Strict type definitions for health payloads, date states, and calculator interfaces.</p>
              </div>
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                <div className="text-xs font-semibold text-gray-400">Client Navigation</div>
                <div className="text-sm font-bold text-white mt-1">React Router v6 DOM</div>
                <p className="text-[11px] text-gray-500 mt-2">Declarative client routes with path-based state isolation.</p>
              </div>
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                <div className="text-xs font-semibold text-gray-400">Design System</div>
                <div className="text-sm font-bold text-white mt-1">Tailwind CSS Utility Engine</div>
                <p className="text-[11px] text-gray-500 mt-2">JIT compiled styling with customizable dark mode palettes.</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "backend" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-purple-400">Node.js REST Services</h2>
              <p className="text-xs text-gray-400 mt-1">Non-blocking express server handling API requests, health checks, and database telemetry.</p>
            </div>

            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 font-mono text-xs space-y-3">
              <div className="text-indigo-400">// Server Initialization & Middleware Architecture</div>
              <div className="text-gray-300">import express from "express";</div>
              <div className="text-gray-300">import cors from "cors";</div>
              <div className="text-gray-300">import helmet from "helmet";</div>
              <div className="text-gray-400 pt-2">// Middleware registration</div>
              <div className="text-emerald-400">{"app.use(cors({ origin: 'http://localhost:5173' }));"}</div>
              <div className="text-emerald-400">app.use(helmet());</div>
            </div>
          </div>
        )}

        {activeSection === "database" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-pink-400">Prisma ORM & Persistence Schema</h2>
              <p className="text-xs text-gray-400 mt-1">Declarative data modeling targeting relational engines (PostgreSQL / SQLite).</p>
            </div>

            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 font-mono text-xs space-y-2 overflow-x-auto">
              <div className="text-gray-500">// prisma/schema.prisma</div>
              <div className="text-purple-400">model SystemLog &#123;</div>
              <div className="text-gray-300 pl-4">id        String   @id @default(uuid())</div>
              <div className="text-gray-300 pl-4">status    String</div>
              <div className="text-gray-300 pl-4">timestamp DateTime @default(now())</div>
              <div className="text-gray-300 pl-4">latencyMs Int</div>
              <div className="text-purple-400">&#125;</div>
            </div>
          </div>
        )}

        {activeSection === "security" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-emerald-400">Security Policies & In-Memory Redis Caching</h2>
              <p className="text-xs text-gray-400 mt-1">Rate limiting, CORS validation, and high-performance caching layers.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                <div className="text-xs font-semibold text-gray-400">Cache Layer</div>
                <div className="text-sm font-bold text-white mt-1">Redis Key-Value Cache</div>
                <p className="text-[11px] text-gray-500 mt-2">Caches heavy analytical query results with automatic TTL expiration.</p>
              </div>
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                <div className="text-xs font-semibold text-gray-400">Abuse Protection</div>
                <div className="text-sm font-bold text-white mt-1">express-rate-limit</div>
                <p className="text-[11px] text-gray-500 mt-2">Restricts endpoint calls to 100 requests per 15-minute window per IP.</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "api_docs" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-amber-400">REST API Reference Specification</h2>
              <p className="text-xs text-gray-400 mt-1">Formal schema definitions for server communication endpoints.</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">GET</span>
                  <span className="font-mono text-sm text-white">/health</span>
                </div>
                <p className="text-xs text-gray-400">Returns server availability, uptime metrics, and downstream service connectivity status.</p>
              </div>

              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold">GET</span>
                  <span className="font-mono text-sm text-white">/api/v1/year-metrics</span>
                </div>
                <p className="text-xs text-gray-400">Returns precomputed leap adjustments, total days, and quarterly offsets.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemSpecs;