import React, { useState, useEffect } from "react";
import { CalendarConverterEngine } from "./SystemSpecs";

// ============================================================================
// TYPES & TELEMETRY INTERFACES
// ============================================================================

export interface RealtimeSystemState {
  id: string;
  name: string;
  nativeName: string;
  currentDateString: string;
  era: string;
  dayOfYear: number;
  totalDaysInYear: number;
  yearProgressPercent: number;
  seasonName: string;
  nextMilestoneName: string;
  nextMilestoneDaysRemaining: number;
}

export interface AstronomicalTelemetry {
  julianDay: number;
  modifiedJulianDay: number;
  unixTimestamp: number;
  solarDeclinationDeg: number;
  equationOfTimeMinutes: number;
  siderealTimeGMST: string;
  tropicalYearProgress: number;
}

// ============================================================================
// CALCULATOR & TIME UTILITY ENGINE
// ============================================================================

export class LiveTrackingTelemetryEngine {
  /**
   * Calculates Julian Day Number from standard JavaScript Date instance.
   */
  public static dateToJD(date: Date): number {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day =
      date.getUTCDate() +
      date.getUTCHours() / 24 +
      date.getUTCMinutes() / 1440 +
      date.getUTCSeconds() / 86400 +
      date.getUTCMilliseconds() / 86400000;

    return CalendarConverterEngine.gregorianToJD(year, month, day);
  }

  /**
   * Computes high-precision astronomical telemetry parameters.
   */
  public static computeTelemetry(now: Date): AstronomicalTelemetry {
    const jd = this.dateToJD(now);
    const mjd = jd - 2400000.5;
    const unix = Math.floor(now.getTime() / 1000);

    // Days since J2000.0 epoch
    const d = jd - 2451545.0;

    // Solar Declination approximation
    const meanAnomaly = (357.529 + 0.98560028 * d) * (Math.PI / 180);
    const eclipticLongitude =
      (280.459 + 0.98564736 * d + 1.915 * Math.sin(meanAnomaly)) *
      (Math.PI / 180);
    const declination =
      Math.asin(Math.sin(23.439 * (Math.PI / 180)) * Math.sin(eclipticLongitude)) *
      (180 / Math.PI);

    // Equation of Time in minutes
    const eot =
      4 *
      (eclipticLongitude * (180 / Math.PI) -
        280.459 -
        0.98564736 * d);

    // Greenwich Mean Sidereal Time (GMST)
    const gmstHours = (18.697374558 + 24.06570982441908 * d) % 24;
    const gmstNormalized = gmstHours < 0 ? gmstHours + 24 : gmstHours;
    const h = Math.floor(gmstNormalized);
    const m = Math.floor((gmstNormalized - h) * 60);
    const s = Math.floor(((gmstNormalized - h) * 60 - m) * 60);
    const gmstString = `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")} GMST`;

    // Annual Tropical Progress %
    const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    const endOfYear = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));
    const totalMs = endOfYear.getTime() - startOfYear.getTime();
    const elapsedMs = now.getTime() - startOfYear.getTime();
    const tropicalYearProgress = Number(((elapsedMs / totalMs) * 100).toFixed(4));

    return {
      julianDay: Number(jd.toFixed(5)),
      modifiedJulianDay: Number(mjd.toFixed(5)),
      unixTimestamp: unix,
      solarDeclinationDeg: Number(declination.toFixed(3)),
      equationOfTimeMinutes: Number(eot.toFixed(2)),
      siderealTimeGMST: gmstString,
      tropicalYearProgress
    };
  }

  /**
   * Synthesizes live calendar status metrics across global systems.
   */
  public static computeSystemStates(now: Date): RealtimeSystemState[] {
    const jd = this.dateToJD(now);

    // 1. Ethiopian System State
    const eth = CalendarConverterEngine.jdToEthiopian(jd);
    const isEthLeap = eth.year % 4 === 3;
    const totalEthDays = isEthLeap ? 366 : 365;
    const ethDayOfYear = (eth.month - 1) * 30 + eth.day;
    const ethMonthNames = [
      "Meskerem",
      "Tikimt",
      "Hidar",
      "Tahsas",
      "Tir",
      "Yakatit",
      "Magabit",
      "Miyazya",
      "Genbot",
      "Sene",
      "Hamle",
      "Nehase",
      "Pagumē"
    ];

    // 2. Gregorian System State
    const gYear = now.getFullYear();
    const isGregLeap =
      (gYear % 4 === 0 && gYear % 100 !== 0) || gYear % 400 === 0;
    const totalGregDays = isGregLeap ? 366 : 365;
    const startGreg = new Date(gYear, 0, 0);
    const diffGreg = now.getTime() - startGreg.getTime();
    const gregDayOfYear = Math.floor(diffGreg / (1000 * 60 * 60 * 24));
    const gregMonthName = now.toLocaleString("default", { month: "long" });

    return [
      {
        id: "ethiopian",
        name: "Ethiopian Calendar",
        nativeName: "የኢትዮጵያ ዘመን አቆጣጠር",
        currentDateString: `${ethMonthNames[eth.month - 1]} ${eth.day}, ${eth.year}`,
        era: "ዓ.ም (Amete Mihret)",
        dayOfYear: ethDayOfYear,
        totalDaysInYear: totalEthDays,
        yearProgressPercent: Number(((ethDayOfYear / totalEthDays) * 100).toFixed(2)),
        seasonName:
          eth.month <= 3
            ? "Teday (Autumn)"
            : eth.month <= 6
            ? "Bega (Winter)"
            : eth.month <= 9
            ? "Belg (Spring)"
            : "Kiremt (Summer)",
        nextMilestoneName: "Enkutatash (Ethiopian New Year)",
        nextMilestoneDaysRemaining: 365 - ethDayOfYear + 1
      },
      {
        id: "gregorian",
        name: "Gregorian Civil Standard",
        nativeName: "International Standard ISO-8601",
        currentDateString: `${gregMonthName} ${now.getDate()}, ${gYear}`,
        era: "CE / Anno Domini",
        dayOfYear: gregDayOfYear,
        totalDaysInYear: totalGregDays,
        yearProgressPercent: Number(
          ((gregDayOfYear / totalGregDays) * 100).toFixed(2)
        ),
        seasonName:
          now.getMonth() >= 2 && now.getMonth() <= 4
            ? "Vernal Season (Spring)"
            : now.getMonth() >= 5 && now.getMonth() <= 7
            ? "Estival Season (Summer)"
            : now.getMonth() >= 8 && now.getMonth() <= 10
            ? "Autumnal Season (Fall)"
            : "Hibernal Season (Winter)",
        nextMilestoneName: "New Year's Eve / Year-End Epoch",
        nextMilestoneDaysRemaining: totalGregDays - gregDayOfYear
      }
    ];
  }
}

// ============================================================================
// MAIN LIVE TRACKING PAGE COMPONENT
// ============================================================================

export const LiveTrackingPage: React.FC = () => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const telemetry = LiveTrackingTelemetryEngine.computeTelemetry(now);
  const systemStates = LiveTrackingTelemetryEngine.computeSystemStates(now);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Real-Time Temporal Telemetry
            </h1>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Synchronized astronomical clock, year progress monitoring, and cross-system temporal decomposition.
          </p>
        </div>

        {/* Realtime UTC Digital Clock Badge */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-right font-mono">
          <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
            UTC Standard Time
          </div>
          <div className="text-xl font-bold text-emerald-400">
            {now.toUTCString().split(" ")[4]}
          </div>
        </div>
      </div>

      {/* TOP SECTION: ASTRONOMICAL TELEMETRY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl space-y-2">
          <div className="text-xs font-mono text-gray-400 uppercase font-bold">
            Julian Day Number (JDN)
          </div>
          <div className="text-2xl font-black text-indigo-400 font-mono">
            {telemetry.julianDay}
          </div>
          <div className="text-[11px] text-gray-500 font-mono">
            MJD: {telemetry.modifiedJulianDay}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl space-y-2">
          <div className="text-xs font-mono text-gray-400 uppercase font-bold">
            Sidereal Time (GMST)
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {telemetry.siderealTimeGMST}
          </div>
          <div className="text-[11px] text-gray-500 font-mono">
            Unix Ep: {telemetry.unixTimestamp}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl space-y-2">
          <div className="text-xs font-mono text-gray-400 uppercase font-bold">
            Solar Declination
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {telemetry.solarDeclinationDeg}°
          </div>
          <div className="text-[11px] text-gray-500 font-mono">
            EoT: {telemetry.equationOfTimeMinutes} min
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl space-y-2">
          <div className="text-xs font-mono text-gray-400 uppercase font-bold">
            Tropical Year Elapsed
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono">
            {telemetry.tropicalYearProgress}%
          </div>
          <div className="w-full bg-gray-950 h-1.5 rounded-full overflow-hidden border border-gray-800 mt-2">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${telemetry.tropicalYearProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* SYSTEM COMPARISON CARDS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Active System Progress & Seasonal Tracking
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {systemStates.map((sys) => (
            <div
              key={sys.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6"
            >
              <div className="flex justify-between items-start border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{sys.name}</h3>
                  <p className="text-xs text-indigo-400 font-serif mt-0.5">
                    {sys.nativeName}
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                  {sys.era}
                </span>
              </div>

              {/* Current Date Banner */}
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-center space-y-1">
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  Current System Date
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {sys.currentDateString}
                </div>
              </div>

              {/* Progress Bar & Indicators */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Year Progress</span>
                  <span className="text-emerald-400 font-bold">
                    Day {sys.dayOfYear} of {sys.totalDaysInYear} ({sys.yearProgressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-gray-950 h-3 rounded-full overflow-hidden border border-gray-800 p-0.5">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${sys.yearProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-1">
                  <div className="text-[10px] text-gray-500 uppercase">Season</div>
                  <div className="font-bold text-amber-300">{sys.seasonName}</div>
                </div>
                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-1">
                  <div className="text-[10px] text-gray-500 uppercase">
                    Next Epoch Shift
                  </div>
                  <div className="font-bold text-sky-300">
                    {sys.nextMilestoneDaysRemaining} Days Left
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingPage;