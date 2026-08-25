import React, { useEffect, useState } from "react";

interface HealthData {
  status: string;
  timestamp: string;
  services: {
    database: string;
    redis: string;
    redisLatencyMs?: number;
  };
}

export const SystemSpecs: React.FC = () => {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:5000/health")
      .then((res) => res.json())
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 text-slate-100">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">System Diagnostics & Infrastructure Specs</h1>
        <p className="text-slate-400 text-sm">Live telemetry for engine runtime, caching adapters, and database connections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Node Engine Environment</div>
          <div className="text-xl font-bold text-white mt-2">Node.js v22.20.0</div>
          <div className="text-xs text-slate-500 mt-1">Runtime: Express / tsx Watch Engine</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Database Service</div>
          <div className="text-xl font-bold text-emerald-400 mt-2">
            {loading ? "Checking..." : health?.services?.database || "Disconnected"}
          </div>
          <div className="text-xs text-slate-500 mt-1">ORM: Prisma Client v5.22.0</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Redis Cache Adapter</div>
          <div className="text-xl font-bold text-indigo-400 mt-2">
            {loading ? "Checking..." : health?.services?.redis || "Offline (Fallback Active)"}
          </div>
          <div className="text-xs text-slate-500 mt-1">Strategy: Safe Bypass & Memory Fallback</div>
        </div>
      </div>

      {/* System Configurations Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Application Environment Blueprint</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-mono">
              <tr>
                <th className="p-3">Module</th>
                <th className="p-3">Configuration</th>
                <th className="p-3">Status / Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              <tr>
                <td className="p-3 text-white">Rate Limiter</td>
                <td className="p-3">100 req / 15 min</td>
                <td className="p-3 text-emerald-400">Active (Fail-Open)</td>
              </tr>
              <tr>
                <td className="p-3 text-white">Response Caching</td>
                <td className="p-3">Dynamic Key Invalidation</td>
                <td className="p-3 text-indigo-400">Ready</td>
              </tr>
              <tr>
                <td className="p-3 text-white">API Health Route</td>
                <td className="p-3">GET /health</td>
                <td className="p-3 text-emerald-400">200 OK</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemSpecs;