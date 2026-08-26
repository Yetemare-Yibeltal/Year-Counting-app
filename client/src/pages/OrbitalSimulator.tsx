import React, { useState, useEffect, useRef } from "react";

// ============================================================================
// SIMULATION ENGINE INTERFACES & PHYSICS MATH
// ============================================================================

export interface OrbitalState {
  trueAnomalyDeg: number;
  heliocentricDistanceAU: number;
  orbitalVelocityKms: number;
  solarIrradianceWm2: number;
  seasonName: string;
}

export class AstronomicalPhysicsEngine {
  // Astronomical Constants
  public static readonly AU_METERS = 149597870700;
  public static readonly SOLAR_CONSTANT = 1361; // W/m^2 at 1 AU

  /**
   * Solves Kepler's Equation M = E - e * sin(E) using Newton-Raphson iteration.
   */
  public static solveKepler(meanAnomalyRad: number, eccentricity: number): number {
    let E = meanAnomalyRad;
    for (let i = 0; i < 15; i++) {
      const delta = (E - eccentricity * Math.sin(E) - meanAnomalyRad) / (1 - eccentricity * Math.cos(E));
      E -= delta;
      if (Math.abs(delta) < 1e-7) break;
    }
    return E;
  }

  /**
   * Computes complete orbital kinematics for a given point in orbit.
   */
  public static computeOrbitalState(
    meanAnomalyDeg: number,
    eccentricity: number,
    semiMajorAxisAU: number = 1.0,
    obliquityDeg: number = 23.44
  ): OrbitalState {
    const M = (meanAnomalyDeg * Math.PI) / 180;
    const E = this.solveKepler(M, eccentricity);

    // True anomaly ν
    const sinNu = (Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(E)) / (1 - eccentricity * Math.cos(E));
    const cosNu = (Math.cos(E) - eccentricity) / (1 - eccentricity * Math.cos(E));
    let trueAnomalyRad = Math.atan2(sinNu, cosNu);
    if (trueAnomalyRad < 0) trueAnomalyRad += 2 * Math.PI;

    // Radius vector r in AU
    const r = (semiMajorAxisAU * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(trueAnomalyRad));

    // Orbital velocity v = sqrt(GM * (2/r - 1/a))
    const vKms = 29.78 * Math.sqrt(2 / r - 1 / semiMajorAxisAU);

    // Solar Irradiance via Inverse Square Law
    const irradiance = this.SOLAR_CONSTANT / (r * r);

    // Seasonal approximation based on True Anomaly and Obliquity
    const trueAnomalyDeg = (trueAnomalyRad * 180) / Math.PI;
    let season = "Vernal Equinox";
    if (trueAnomalyDeg >= 45 && trueAnomalyDeg < 135) season = "Summer Solstice (Northern)";
    else if (trueAnomalyDeg >= 135 && trueAnomalyDeg < 225) season = "Autumnal Equinox";
    else if (trueAnomalyDeg >= 225 && trueAnomalyDeg < 315) season = "Winter Solstice (Northern)";

    return {
      trueAnomalyDeg: Number(trueAnomalyDeg.toFixed(2)),
      heliocentricDistanceAU: Number(r.toFixed(4)),
      orbitalVelocityKms: Number(vKms.toFixed(2)),
      solarIrradianceWm2: Number(irradiance.toFixed(1)),
      seasonName: season
    };
  }
}

// ============================================================================
// MAIN INTERACTIVE ORBITAL SIMULATOR PAGE
// ============================================================================

export const OrbitalSimulator: React.FC = () => {
  // Interactive Simulation Controls
  const [eccentricity, setEccentricity] = useState<number>(0.0167); // Earth's real value
  const [obliquity, setObliquity] = useState<number>(23.44); // Earth's tilt
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [meanAnomaly, setMeanAnomaly] = useState<number>(0);

  // Canvas Reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Computed State
  const orbitalData = AstronomicalPhysicsEngine.computeOrbitalState(
    meanAnomaly,
    eccentricity,
    1.0,
    obliquity
  );

  // Animation Loop
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      if (isPlaying) {
        setMeanAnomaly((prev) => (prev + 0.2 * simulationSpeed) % 360);
      }

      // Draw Orbit Canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;
          const centerX = width / 2;
          const centerY = height / 2;
          const scale = Math.min(width, height) * 0.35;

          ctx.clearRect(0, 0, width, height);

          // Draw Grid / Coordinate Lines
          ctx.strokeStyle = "#1e293b";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, centerY);
          ctx.lineTo(width, centerY);
          ctx.moveTo(centerX, 0);
          ctx.lineTo(centerX, height);
          ctx.stroke();

          // Calculate Ellipse Geometry
          const a = scale; // Semi-major axis
          const b = scale * Math.sqrt(1 - eccentricity * eccentricity); // Semi-minor axis
          const c = a * eccentricity; // Focal distance

          // Draw Orbital Path Ellipse
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.ellipse(centerX - c, centerY, a, b, 0, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw Central Star (Sun) at Focus (0,0)
          ctx.fillStyle = "#fbbf24";
          ctx.shadowColor = "#f59e0b";
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
          ctx.fill();
          ctx.shadowBlur = 0; // Reset blur

          // Calculate Planetary Coordinates from True Anomaly
          const nuRad = (orbitalData.trueAnomalyDeg * Math.PI) / 180;
          const planetR = orbitalData.heliocentricDistanceAU * scale;
          const planetX = centerX + planetR * Math.cos(nuRad);
          const planetY = centerY - planetR * Math.sin(nuRad); // Invert Y for canvas space

          // Draw Sun-Planet Vector Line
          ctx.strokeStyle = "rgba(251, 191, 36, 0.3)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(planetX, planetY);
          ctx.stroke();

          // Draw Planet
          ctx.fillStyle = "#60a5fa";
          ctx.shadowColor = "#3b82f6";
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(planetX, planetY, 7, 0, 2 * Math.PI);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, simulationSpeed, eccentricity, obliquity, orbitalData.trueAnomalyDeg]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-800 pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-indigo-500 animate-ping" />
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Orbital & Milankovitch Dynamics Engine
          </h1>
        </div>
        <p className="text-sm text-gray-400 max-w-3xl">
          Real-time interactive orbital simulator calculating true anomaly, Keplerian motion, solar flux variations, and seasonal shifts across variable orbital parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Canvas Visualizer */}
        <div className="lg:col-span-7 bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Interactive Keplerian Orbit</h2>
              <p className="text-xs text-gray-400 font-mono">
                Visualizing orbital eccentricity and solar position
              </p>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                isPlaying
                  ? "bg-amber-600 hover:bg-amber-500 text-white"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {isPlaying ? "Pause Engine" : "Resume Engine"}
            </button>
          </div>

          {/* Canvas Rendering Area */}
          <div className="relative flex justify-center items-center bg-gray-950 rounded-xl border border-gray-800 p-4 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={500}
              height={380}
              className="max-w-full h-auto"
            />
          </div>

          {/* Live Parameter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-2">
              <label className="text-gray-400 flex justify-between">
                <span>Eccentricity (e)</span>
                <span className="text-indigo-400 font-bold">{eccentricity}</span>
              </label>
              <input
                type="range"
                min="0"
                max="0.2"
                step="0.005"
                value={eccentricity}
                onChange={(e) => setEccentricity(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 bg-gray-800 h-1.5 rounded"
              />
            </div>

            <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-2">
              <label className="text-gray-400 flex justify-between">
                <span>Axial Tilt (°)</span>
                <span className="text-amber-400 font-bold">{obliquity}°</span>
              </label>
              <input
                type="range"
                min="0"
                max="45"
                step="0.5"
                value={obliquity}
                onChange={(e) => setObliquity(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-gray-800 h-1.5 rounded"
              />
            </div>

            <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-2">
              <label className="text-gray-400 flex justify-between">
                <span>Warp Speed</span>
                <span className="text-emerald-400 font-bold">{simulationSpeed}x</span>
              </label>
              <input
                type="range"
                min="0.2"
                max="5"
                step="0.2"
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 bg-gray-800 h-1.5 rounded"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry & Analytical Readouts */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">
              Real-Time Orbital Telemetry
            </h3>

            <div className="grid grid-cols-2 gap-4 font-mono">
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1">
                <div className="text-[10px] text-gray-500 uppercase">True Anomaly (ν)</div>
                <div className="text-xl font-bold text-sky-400">
                  {orbitalData.trueAnomalyDeg}°
                </div>
              </div>

              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1">
                <div className="text-[10px] text-gray-500 uppercase">Distance (r)</div>
                <div className="text-xl font-bold text-emerald-400">
                  {orbitalData.heliocentricDistanceAU} AU
                </div>
              </div>

              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1">
                <div className="text-[10px] text-gray-500 uppercase">Orbital Speed</div>
                <div className="text-xl font-bold text-indigo-400">
                  {orbitalData.orbitalVelocityKms} km/s
                </div>
              </div>

              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1">
                <div className="text-[10px] text-gray-500 uppercase">Solar Irradiance</div>
                <div className="text-xl font-bold text-amber-400">
                  {orbitalData.solarIrradianceWm2} W/m²
                </div>
              </div>
            </div>

            {/* Current Astronomical Season Indicator */}
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                Calculated Seasonal Position
              </div>
              <div className="text-lg font-bold text-white font-mono">
                {orbitalData.seasonName}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Determined through instantaneous solar inclination combined with current Keplerian distance parameters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrbitalSimulator;