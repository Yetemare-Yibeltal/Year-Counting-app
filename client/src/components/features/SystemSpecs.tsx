import React from "react";

export const SystemSpecs: React.FC = () => {
  return (
    <section id="architecture" className="py-12 bg-gray-900 text-white px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-emerald-400">System Specifications & API Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/60 p-5 rounded-xl border border-gray-700 space-y-2">
            <h3 className="font-semibold text-gray-200">Backend Express API</h3>
            <p className="text-xs text-gray-400">Node.js TypeScript Server Architecture</p>
            <div className="text-xs font-mono bg-gray-900 p-3 rounded border border-gray-800 text-emerald-400">
              GET /api/v1/users - 200 OK (300s cache)<br/>
              POST /api/v1/calculate - Active
            </div>
          </div>
          <div className="bg-gray-800/60 p-5 rounded-xl border border-gray-700 space-y-2">
            <h3 className="font-semibold text-gray-200">Database Engine</h3>
            <p className="text-xs text-gray-400">MySQL / Prisma ORM Persistence Layer</p>
            <div className="text-xs font-mono bg-gray-900 p-3 rounded border border-gray-800 text-indigo-400">
              Database Status: Connected<br/>
              Connection Pool: Healthy
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemSpecs;
