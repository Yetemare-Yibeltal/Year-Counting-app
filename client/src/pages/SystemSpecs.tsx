import React, { useState } from "react";

// ============================================================================
// TYPE DEFINITIONS & DOMAIN INTERFACES
// ============================================================================

export interface SystemStructuralUnit {
  unitName: string;
  subUnitsCount: number | string;
  notes: string;
}

export interface SystemMilestone {
  year: number | string;
  event: string;
}

export interface YearCountingSystem {
  id: string;
  name: string;
  nativeName?: string;
  family: "Solar" | "Lunisolar" | "Lunar" | "Astronomical" | "Civic";
  eraName: string;
  epochJulianDay: number;
  averageYearLengthDays: number;
  leapYearRule: string;
  description: string;
  historicalContext: string;
  timeAccuracyDrift: string;
  mathematicalFormula: string;
  structuralUnits: SystemStructuralUnit[];
  keyMilestones: SystemMilestone[];
}

export interface MetricComparisonItem {
  id: string;
  name: string;
  epochName: string;
  epochGregorianEquivalent: string;
  cycleLengthYears: string;
  intercalaryFrequency: string;
  annualDriftSeconds: number;
  primaryCulturalRegions: string[];
  astronomicalAnchor: string;
}

// ============================================================================
// COMPREHENSIVE CALENDRICAL SYSTEM DATABASE
// ============================================================================

export class YearCountingDatabase {
  public static readonly SYSTEMS: YearCountingSystem[] = [
    {
      id: "ethiopian",
      name: "Ethiopian Calendar",
      nativeName: "የኢትዮጵያ ዘመን አቆጣጠር",
      family: "Solar",
      eraName: " ዓ.ም (Amete Mihret) / Incarnation Era",
      epochJulianDay: 1724220.5,
      averageYearLengthDays: 365.25,
      leapYearRule: "Every 4 years without exception (Adds 6th Epagomenal day in Pagumē)",
      description:
        "The Ethiopian calendar is an ancient solar timekeeping system derived from the Alexandrian/Coptic structure. It counts time using 12 uniform months of 30 days followed by 5 or 6 epagomenal days (Pagumē). It maintains a 7-to-8 year offset from the Gregorian calendar due to alternate calculations of the Annunciation date.",
      historicalContext:
        "Deeply integrated with Ethiopian Orthodox Tewahedo ecclesiastical computation (Bahre Hasab), this calendar is used for civil and religious administration across Ethiopia and Eritrea. It traces back to early Christian chronological computations fixed by Annianus of Alexandria in the early 5th century CE.",
      timeAccuracyDrift: "Gains ~1 day every 128 years relative to the solar tropical year.",
      mathematicalFormula:
        "JD = 1724220.5 + 365 * (EthYear - 1) + ⌊EthYear / 4⌋ + DayOfYear - 1",
      structuralUnits: [
        { unitName: "Meskrem to Nehase (12 Months)", subUnitsCount: 30, notes: "12 equal 30-day cycles" },
        { unitName: "Pagumē (Intercalary Month)", subUnitsCount: "5 or 6", notes: "5 days common, 6 days leap year" },
        { unitName: "Weket (Four Evangelists Cycle)", subUnitsCount: 4, notes: "4-year cycle named after Matthew, Mark, Luke, John" },
        { unitName: "Kene (7-Day Week)", subUnitsCount: 7, notes: "Standard 7-day week beginning on Ehud (Sunday)" }
      ],
      keyMilestones: [
        { year: "9 AD (Eth. 1 AD)", event: "Calculated epoch of the Incarnation of Jesus Christ according to Annianus." },
        { year: 1582, event: "Ethiopian Church retains Julian intercalary structure during Gregorian reform." },
        { year: 2000, event: "Ethiopian Millennium celebrated on Gregorian September 12, 2007." }
      ]
    },
    {
      id: "gregorian",
      name: "Gregorian Calendar",
      nativeName: "Calendarium Gregorianum",
      family: "Solar",
      eraName: "AD (Anno Domini) / CE (Common Era)",
      epochJulianDay: 1721425.5,
      averageYearLengthDays: 365.2425,
      leapYearRule: "Year divisible by 4, except centurial years unless divisible by 400",
      description:
        "The international standard solar calendar established by Pope Gregory XIII in October 1582. Designed to fix the seasonal drift of the Vernal Equinox and realign the computation of Easter with the First Council of Nicaea (325 CE).",
      historicalContext:
        "Promulgated by the papal bull Inter gravissimas to correct the 11-minute annual error of the Julian calendar. Adopted progressively worldwide across four centuries, becoming the universal international civil standard.",
      timeAccuracyDrift: "Drifts by ~1 day every 3,030 years relative to the tropical year.",
      mathematicalFormula:
        "JD = 1721425.5 + 365*Y + ⌊Y/4⌋ - ⌊Y/100⌋ + ⌊Y/400⌋ + ⌊(153*m + 2)/5⌋ + D - 1",
      structuralUnits: [
        { unitName: "Standard Months", subUnitsCount: "28 - 31", notes: "12 irregular length months" },
        { unitName: "Solar Quarter", subUnitsCount: "90 - 92", notes: "Used for commercial and meteorological metrics" },
        { unitName: "Civil Week", subUnitsCount: 7, notes: "Universal 7-day cycle" }
      ],
      keyMilestones: [
        { year: 1582, event: "Papal decree drops 10 days in October to align Equinox." },
        { year: 1752, event: "Great Britain and American Colonies adopt Gregorian system." },
        { year: 1923, event: "Greece becomes last European nation to adopt civil Gregorian calendar." }
      ]
    },
    {
      id: "islamic",
      name: "Islamic Hijri Calendar",
      nativeName: "التقويم الهجري",
      family: "Lunar",
      eraName: "AH (Anno Hegirae)",
      epochJulianDay: 1948439.5,
      averageYearLengthDays: 354.367,
      leapYearRule: "11 leap days added in a 30-year tabular cycle (or observational crescent sighting)",
      description:
        "A purely lunar calendar consisting of 12 synodic lunar months in a year of 354 or 355 days. Because it lacks seasonal intercalation, the Islamic calendar shifts backward relative to the Gregorian calendar by roughly 11 days each year.",
      historicalContext:
        "Established by Caliph Umar ibn al-Khattab in 638 CE. The epoch commemorates the Hijrah (migration) of the Prophet Muhammad from Mecca to Medina in 622 CE.",
      timeAccuracyDrift: "Observational system synced directly with the physical Moon; tabular version drifts 1 day per 2,500 years against synodic months.",
      mathematicalFormula:
        "JD = 1948439.5 + ⌊(354 * H + 3 + 11 * H) / 30⌋ + MonthOffset + Day",
      structuralUnits: [
        { unitName: "Lunar Months", subUnitsCount: "29 or 30", notes: "Determined by Hilal (crescent observation)" },
        { unitName: "Tabular Cycle", subUnitsCount: 30, notes: "30-year cycle containing 11 leap years of 355 days" }
      ],
      keyMilestones: [
        { year: "1 AH", event: "The Hijrah from Mecca to Medina (622 CE)." },
        { year: "17 AH", event: "Official establishment of the Hijri era by Caliph Umar." },
        { year: "1448 AH", event: "Contemporary mid-15th century Hijri era operational period." }
      ]
    },
    {
      id: "julian",
      name: "Julian Calendar",
      nativeName: "Calendarium Iulianum",
      family: "Solar",
      eraName: "BC / AD",
      epochJulianDay: 1721423.5,
      averageYearLengthDays: 365.25,
      leapYearRule: "Every 4 years without exception",
      description:
        "Implemented by Julius Caesar in 45 BC upon the advice of Sosigenes of Alexandria. Replaced the chaotic Roman republican intercalary system with a clean 365.25-day solar system.",
      historicalContext:
        "The standard calendar of the Roman Empire, Byzantine Empire, and medieval Europe for over 1,600 years. Continues to be used by Eastern Orthodox churches for calculating Easter dates.",
      timeAccuracyDrift: "Gains 1 day every 128 years due to assuming a 365.25 day tropical year (actual: 365.2422).",
      mathematicalFormula:
        "JD = 1721423.5 + 365*Y + ⌊Y/4⌋ + ⌊(153*m + 2)/5⌋ + D - 1",
      structuralUnits: [
        { unitName: "Roman Months", subUnitsCount: "28 - 31", notes: "Direct precursor to modern month lengths" },
        { unitName: "Kalends, Nones, Ides", subUnitsCount: 3, notes: "Classical Roman monthly anchor points" }
      ],
      keyMilestones: [
        { year: "-45", event: "Implementation of the Julian reform (Year of Confusion)." },
        { year: 325, event: "First Council of Nicaea fixes Easter computation rules based on Julian calendar." },
        { year: 1918, event: "Russia transitions from Julian to Gregorian civil administration." }
      ]
    },
    {
      id: "hebrew",
      name: "Hebrew Lunisolar Calendar",
      nativeName: "הלוח העברי",
      family: "Lunisolar",
      eraName: "AM (Anno Mundi)",
      epochJulianDay: 347995.5,
      averageYearLengthDays: 365.2468,
      leapYearRule: "19-year Metonic cycle with 7 leap months (Adar II added in years 3, 6, 8, 11, 14, 17, 19)",
      description:
        "A mathematical lunisolar calendar used for Jewish religious timing and civil operations in Israel. Combines lunar months with solar intercalary years to keep Passover in spring.",
      historicalContext:
        "Transitioned from observational tracking to fixed mathematical rules codified by Hillel II in 358 CE. Epoch begins at the calculated creation of the world.",
      timeAccuracyDrift: "Gains 1 day every ~216 years relative to the mean solar tropical year.",
      mathematicalFormula:
        "Molad Tishrei Calculation: Molad = Epoch + 29d 12h 44m 3.33s * MonthsElapsed",
      structuralUnits: [
        { unitName: "Lunisolar Month", subUnitsCount: "29 or 30", notes: "Synced to synodic moon cycle" },
        { unitName: "Metonic Cycle", subUnitsCount: 19, notes: "19-year pattern restoring solar-lunar alignment" }
      ],
      keyMilestones: [
        { year: "358 CE", event: "Hillel II publishes fixed mathematical leap-year insertion rules." },
        { year: "5786 AM", event: "Modern operational era." }
      ]
    },
    {
      id: "chinese",
      name: "Chinese Lunisolar Calendar",
      nativeName: "农历 (Nónglì)",
      family: "Lunisolar",
      eraName: "Huangdi Era / Ganzhi Cycle",
      epochJulianDay: 758325.5,
      averageYearLengthDays: 365.2422,
      leapYearRule: "Astronomical calculation: Leap month (Rùnyuè) added when a lunar month lacks a Major Solar Term (Zhōngqì)",
      description:
        "A traditional lunisolar system tracking both astronomical lunar phases and 24 Solar Terms (Jiéqì) tied to solar longitude. Years are categorized by a 60-year sexagenary cycle.",
      historicalContext:
        "Developed over three millennia, governed by imperial astronomers at the Purple Mountain Observatory. Essential for agriculture, traditional holidays, and astrology.",
      timeAccuracyDrift: "Highly precise as it is calibrated continuously directly against true astronomical observations.",
      mathematicalFormula:
        "Solar Term Longitude: λ = (N * 15°) % 360°; Lunar Phase: New Moon at Conjunction",
      structuralUnits: [
        { unitName: "Ganzhi (Sexagenary)", subUnitsCount: 60, notes: "10 Heavenly Stems x 12 Earthly Branches" },
        { unitName: "Jieqi (Solar Terms)", subUnitsCount: 24, notes: "15-degree solar longitude divisions" }
      ],
      keyMilestones: [
        { year: "-104", event: "Han Dynasty establishes Taichu Calendar reform." },
        { year: 1645, event: "Qing Dynasty introduces Shíxiàn Calendar using Keplerian planetary orbits." }
      ]
    }
  ];
}

// ============================================================================
// METROLOGICAL & METRIC MATRIX DATA
// ============================================================================

export const METRIC_COMPARISON_MATRIX: MetricComparisonItem[] = [
  {
    id: "ethiopian",
    name: "Ethiopian",
    epochName: "Amete Mihret",
    epochGregorianEquivalent: "8 CE (Aug 29)",
    cycleLengthYears: "4 Years",
    intercalaryFrequency: "Every 4th year (+1 day in Pagumē)",
    annualDriftSeconds: 675,
    primaryCulturalRegions: ["Ethiopia", "Eritrea"],
    astronomicalAnchor: "Alexandrian Solar Model"
  },
  {
    id: "gregorian",
    name: "Gregorian",
    epochName: "Anno Domini",
    epochGregorianEquivalent: "1 CE (Jan 1)",
    cycleLengthYears: "400 Years",
    intercalaryFrequency: "97 leap years per 400-year cycle",
    annualDriftSeconds: 27,
    primaryCulturalRegions: ["Global Standard", "Americas", "Europe", "Asia"],
    astronomicalAnchor: "Mean Vernal Equinox (March 21)"
  },
  {
    id: "islamic",
    name: "Islamic (Hijri)",
    epochName: "Anno Hegirae",
    epochGregorianEquivalent: "622 CE (Jul 16)",
    cycleLengthYears: "30 Years (Tabular)",
    intercalaryFrequency: "11 leap days per 30 lunar years",
    annualDriftSeconds: -950400, // ~11 days shorter than solar year
    primaryCulturalRegions: ["Middle East", "North Africa", "South/Southeast Asia"],
    astronomicalAnchor: "Synodic Lunar Month (Hilal Observation)"
  },
  {
    id: "julian",
    name: "Julian",
    epochName: "Anno Domini",
    epochGregorianEquivalent: "1 CE (Jan 3)",
    cycleLengthYears: "4 Years",
    intercalaryFrequency: "Every 4th year (+1 day in Feb)",
    annualDriftSeconds: 675,
    primaryCulturalRegions: ["Eastern Orthodox Church", "Historical Antiquity"],
    astronomicalAnchor: "Mean Solar Year (Sosigenes Model)"
  },
  {
    id: "hebrew",
    name: "Hebrew",
    epochName: "Anno Mundi",
    epochGregorianEquivalent: "-3761 CE (Oct 7)",
    cycleLengthYears: "19 Years",
    intercalaryFrequency: "7 leap months per 19-year Metonic cycle",
    annualDriftSeconds: 400,
    primaryCulturalRegions: ["Israel", "Jewish Diaspora"],
    astronomicalAnchor: "Molad Tishrei & Spring Equinox"
  },
  {
    id: "chinese",
    name: "Chinese",
    epochName: "Huangdi Era",
    epochGregorianEquivalent: "-2698 CE",
    cycleLengthYears: "60 Years",
    intercalaryFrequency: "Dynamic leap month when Solar Term missing",
    annualDriftSeconds: 5,
    primaryCulturalRegions: ["China", "Taiwan", "Vietnam", "East Asia"],
    astronomicalAnchor: "True Sun Longitude & Lunar Conjunction"
  }
];

// ============================================================================
// CONVERSION COMPUTATION ENGINE
// ============================================================================

export class CalendarConverterEngine {
  public static gregorianToJD(year: number, month: number, day: number): number {
    let a = Math.floor((14 - month) / 12);
    let y = year + 4800 - a;
    let m = month + 12 * a - 3;
    return (
      day +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      32045.5
    );
  }

  public static jdToGregorian(jd: number): { year: number; month: number; day: number } {
    let j = Math.floor(jd + 0.5) + 32044;
    let g = Math.floor(j / 146097);
    let dg = j % 146097;
    let c = Math.floor((Math.floor(dg / 36524) + 1) * 3 / 4);
    let dc = dg - c * 36524;
    let b = Math.floor(dc / 1461);
    let db = dc % 1461;
    let a = Math.floor((Math.floor(db / 365) + 1) * 3 / 4);
    let da = db - a * 365;
    let y = g * 400 + c * 100 + b * 4 + a;
    let m = Math.floor((da * 5 + 308) / 153);
    let day = Math.floor(da - Math.floor((m * 153 - 357) / 5) + 1);
    let month = Math.floor((m + 2) % 12 + 1);
    let year = Math.floor(y - 4800 + Math.floor((m + 2) / 12));

    return { year, month, day };
  }

  public static ethiopianToJD(year: number, month: number, day: number): number {
    return 1724220.5 + 365 * (year - 1) + Math.floor(year / 4) + 30 * (month - 1) + day - 1;
  }

  public static jdToEthiopian(jd: number): { year: number; month: number; day: number } {
    let r = (jd - 1724220.5) % 1461;
    let n = (r % 365) + 365 * Math.floor(r / 1460);
    let year = Math.floor((jd - 1724220.5) / 1461) * 4 + Math.floor(r / 365) - Math.floor(r / 1460);
    let month = Math.floor(n / 30) + 1;
    let day = (n % 30) + 1;

    if (month > 13) {
      month = 13;
    }

    return { year, month, day };
  }
}

// ============================================================================
// CONVERTER INTERACTIVE WIDGET COMPONENT
// ============================================================================

export const CalendarConverterWidget: React.FC = () => {
  const [gYear, setGYear] = useState<number>(2026);
  const [gMonth, setGMonth] = useState<number>(8);
  const [gDay, setGDay] = useState<number>(26);

  const currentJD = CalendarConverterEngine.gregorianToJD(gYear, gMonth, gDay);
  const ethiopianDate = CalendarConverterEngine.jdToEthiopian(currentJD);

  const ethiopianMonthNames = [
    "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yakatit",
    "Magabit", "Miyazya", "Genbot", "Sene", "Hamle", "Nehase", "Pagumē"
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="border-b border-gray-800 pb-4">
        <h3 className="text-2xl font-bold text-white">Live System Interoperability Converter</h3>
        <p className="text-xs text-gray-400 font-mono mt-1">
          Algorithmic reduction using Julian Day Numbers (JDN) as an intermediary epoch anchor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Calendar Controls */}
        <div className="bg-gray-950 p-5 rounded-xl border border-gray-800 space-y-4">
          <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
            Input: Gregorian Civil Date
          </div>
          <div className="grid grid-cols-3 gap-3 font-mono">
            <div>
              <label className="text-[10px] text-gray-500 uppercase">Year</label>
              <input
                type="number"
                value={gYear}
                onChange={(e) => setGYear(parseInt(e.target.value) || 0)}
                className="w-full bg-gray-900 border border-gray-800 text-white rounded p-2 text-sm focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase">Month</label>
              <input
                type="number"
                min="1"
                max="12"
                value={gMonth}
                onChange={(e) => setGMonth(parseInt(e.target.value) || 1)}
                className="w-full bg-gray-900 border border-gray-800 text-white rounded p-2 text-sm focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase">Day</label>
              <input
                type="number"
                min="1"
                max="31"
                value={gDay}
                onChange={(e) => setGDay(parseInt(e.target.value) || 1)}
                className="w-full bg-gray-900 border border-gray-800 text-white rounded p-2 text-sm focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
          <div className="text-[11px] font-mono text-gray-400 bg-gray-900 p-3 rounded border border-gray-800">
            Calculated Epoch JDN: <span className="text-amber-400 font-bold">{currentJD.toLocaleString()}</span>
          </div>
        </div>

        {/* Target Calendar Display */}
        <div className="bg-gray-950 p-5 rounded-xl border border-gray-800 space-y-4">
          <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            Output: Ethiopian System Equivalent
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 space-y-2">
            <div className="text-2xl font-bold text-white font-mono">
              {ethiopianMonthNames[ethiopianDate.month - 1]} {ethiopianDate.day}, {ethiopianDate.year} ዓ.ም
            </div>
            <div className="text-xs text-gray-400 font-mono">
              Month Index: {ethiopianDate.month} / 13 | Day of Year: {(ethiopianDate.month - 1) * 30 + ethiopianDate.day}
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            The conversion utilizes fixed Julian Day calculations accounting for Alexandrian intercalary alignment.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPARATIVE MATRIX COMPONENT
// ============================================================================

export const SystemComparisonMatrix: React.FC = () => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="border-b border-gray-800 pb-4">
        <h3 className="text-2xl font-bold text-white">System Dynamics & Metrics Matrix</h3>
        <p className="text-xs text-gray-400 font-mono mt-1">
          Cross-system comparative metrics evaluating astronomical alignment, cycle lengths, and annual drift parameters.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs text-gray-300 border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 uppercase bg-gray-950">
              <th className="p-3">System</th>
              <th className="p-3">Epoch Name</th>
              <th className="p-3">Gregorian Zero Anchor</th>
              <th className="p-3">Leap Intercalation Rule</th>
              <th className="p-3">Annual Drift</th>
              <th className="p-3">Primary Regions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {METRIC_COMPARISON_MATRIX.map((item) => (
              <tr key={item.id} className="hover:bg-gray-800/40 transition-colors">
                <td className="p-3 font-bold text-white">{item.name}</td>
                <td className="p-3 text-indigo-400">{item.epochName}</td>
                <td className="p-3 text-amber-400">{item.epochGregorianEquivalent}</td>
                <td className="p-3 text-gray-300 font-sans">{item.intercalaryFrequency}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      Math.abs(item.annualDriftSeconds) < 60
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-amber-950 text-amber-400 border border-amber-800"
                    }`}
                  >
                    {item.annualDriftSeconds > 0
                      ? `+${item.annualDriftSeconds}s / yr`
                      : `${item.annualDriftSeconds}s / yr`}
                  </span>
                </td>
                <td className="p-3 text-gray-400 font-sans">{item.primaryCulturalRegions.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN WORKBENCH PAGE COMPONENT
// ============================================================================

export const YearCountingWorkbench: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "converter" | "matrix" | "formulas">("overview");
  const [selectedSystemId, setSelectedSystemId] = useState<string>("ethiopian");

  const currentSystem =
    YearCountingDatabase.SYSTEMS.find((sys) => sys.id === selectedSystemId) ||
    YearCountingDatabase.SYSTEMS[0];

  const navigationTabs = [
    { id: "overview", label: "System Specifications" },
    { id: "converter", label: "Interoperability Converter" },
    { id: "matrix", label: "Metrics Matrix" },
    { id: "formulas", label: "Algorithmic Models" }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2 border-b border-gray-800 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          System Specifications & Metrology Engine
        </h1>
        <p className="text-sm text-gray-400 max-w-3xl">
          Comprehensive analytical suite for ancient and modern year-counting systems, epoch anchors, intercalary rules, and astronomical time decomposition.
        </p>
      </div>

      {/* Navigation Bar */}
      <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-4">
        {navigationTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: SYSTEM OVERVIEW & DEEP DIVE */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar: System Selector */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2">
              Select System
            </div>
            {YearCountingDatabase.SYSTEMS.map((sys) => {
              const isSelected = sys.id === selectedSystemId;
              return (
                <button
                  key={sys.id}
                  type="button"
                  onClick={() => setSelectedSystemId(sys.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? "bg-indigo-950/60 border-indigo-500 text-white shadow-lg shadow-indigo-900/20"
                      : "bg-gray-900/60 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{sys.name}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gray-950 border border-gray-800 text-indigo-400">
                      {sys.family}
                    </span>
                  </div>
                  {sys.nativeName && (
                    <div className="text-xs text-gray-400 font-serif mt-1">
                      {sys.nativeName}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main View Panel */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {currentSystem.name}
                    </h2>
                    {currentSystem.nativeName && (
                      <p className="text-sm text-indigo-400 font-serif mt-0.5">
                        {currentSystem.nativeName}
                      </p>
                    )}
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xs text-gray-400 uppercase">Era Identifier</div>
                    <div className="text-sm font-bold text-amber-400">{currentSystem.eraName}</div>
                  </div>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed mt-4">
                  {currentSystem.description}
                </p>
              </div>

              {/* Primary Specification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1">
                  <div className="text-gray-400">Epoch Julian Day Number</div>
                  <div className="text-lg font-bold text-indigo-400">
                    {currentSystem.epochJulianDay.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1">
                  <div className="text-gray-400">Mean Year Length</div>
                  <div className="text-lg font-bold text-emerald-400">
                    {currentSystem.averageYearLengthDays} Days
                  </div>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1 sm:col-span-2">
                  <div className="text-gray-400">Intercalary / Leap Mechanism</div>
                  <div className="text-xs text-amber-300 font-sans font-medium mt-1">
                    {currentSystem.leapYearRule}
                  </div>
                </div>
              </div>

              {/* Deep Historical Context */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  Historical Context & Sociocultural Impact
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-gray-950 p-4 rounded-xl border border-gray-800">
                  {currentSystem.historicalContext}
                </p>
              </div>

              {/* Internal Structural Units */}
              <div className="space-y-3">
                <h3 className="text-sm font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  Internal Time Decomposition & Structural Units
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentSystem.structuralUnits.map((unit, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-950 p-3.5 rounded-xl border border-gray-800/80 space-y-1"
                    >
                      <div className="text-xs font-bold text-white">{unit.unitName}</div>
                      <div className="text-xs font-mono text-indigo-400">
                        Sub-units: {unit.subUnitsCount}
                      </div>
                      <div className="text-[11px] text-gray-400 font-sans">{unit.notes}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chronological Milestones */}
              <div className="space-y-3">
                <h3 className="text-sm font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  Key Historical Milestones
                </h3>
                <div className="space-y-2">
                  {currentSystem.keyMilestones.map((ms, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-3 bg-gray-950 rounded-xl border border-gray-800 text-xs font-mono"
                    >
                      <span className="font-bold text-amber-400 min-w-[80px]">
                        Year {ms.year}
                      </span>
                      <span className="text-gray-300 font-sans">{ms.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE CONVERSION ENGINE */}
      {activeTab === "converter" && <CalendarConverterWidget />}

      {/* TAB 3: COMPARATIVE METRICS MATRIX */}
      {activeTab === "matrix" && <SystemComparisonMatrix />}

      {/* TAB 4: MATHEMATICAL FORMULATIONS */}
      {activeTab === "formulas" && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-gray-800 pb-4">
            <h3 className="text-2xl font-bold text-white">
              Algorithmic Specifications & Mathematical Models
            </h3>
            <p className="text-xs text-gray-400 mt-1 font-mono">
              Exact mathematical expressions used to compute epoch transformations and intercalary offsets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {YearCountingDatabase.SYSTEMS.map((sys) => (
              <div
                key={sys.id}
                className="bg-gray-950 p-5 rounded-xl border border-gray-800 space-y-3 font-mono"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-indigo-400">{sys.name}</span>
                  <span className="text-[10px] bg-gray-900 text-gray-400 px-2 py-0.5 rounded border border-gray-800">
                    ID: {sys.id}
                  </span>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg border border-gray-800/80 text-xs text-emerald-400 overflow-x-auto">
                  <code>{sys.mathematicalFormula}</code>
                </div>
                <div className="text-[11px] text-gray-400 font-sans">
                  <span className="font-bold text-gray-300 font-mono">Drift Spec:</span>{" "}
                  {sys.timeAccuracyDrift}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// EXTENDED METROLOGICAL UTILITIES & ASTROPHYSICAL COMPUTATIONS
// ============================================================================

export class AdvancedMetrologyEngine {
  /**
   * Calculates the exact delta T (Delta T = TT - UT) in seconds for historical dates.
   * Based on NASA / Espenak polynomial approximations.
   */
  public static calculateDeltaT(year: number): number {
    if (year < -500) {
      const u = (year - 1820) / 100;
      return -20 + 32 * u * u;
    } else if (year < 500) {
      const u = year / 100;
      return 10583.6 - 1014.41 * u + 33.7831 * Math.pow(u, 2) - 5.952053 * Math.pow(u, 3);
    } else if (year < 1600) {
      const u = (year - 1000) / 100;
      return 1574.2 - 556.01 * u + 71.23472 * Math.pow(u, 2) - 0.319781 * Math.pow(u, 3);
    } else if (year < 2000) {
      const t = year - 1900;
      return -2.79 + 1.494119 * t - 0.0598939 * Math.pow(t, 2) + 0.0061966 * Math.pow(t, 3);
    } else {
      const t = year - 2000;
      return 63.86 + 0.3345 * t - 0.060374 * Math.pow(t, 2) + 0.001727 * Math.pow(t, 3);
    }
  }

  /**
   * Computes the mean solar longitude in degrees for a given Julian Day.
   */
  public static getMeanSolarLongitude(jd: number): number {
    const T = (jd - 2451545.0) / 36525.0;
    let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    return ((L0 % 360) + 360) % 360;
  }

  /**
   * Calculates the Equation of Time in minutes for a given Julian Day.
   */
  public static calculateEquationOfTime(jd: number): number {
    const T = (jd - 2451545.0) / 36525.0;
    const eps = 23.439291 - 0.0130042 * T;
    const l0 = this.getMeanSolarLongitude(jd);
    const m = (357.52911 + 35999.05029 * T) * (Math.PI / 180);
    const y = Math.pow(Math.tan((eps * Math.PI) / 360), 2);

    const eot =
      y * Math.sin(2 * l0 * (Math.PI / 180)) -
      2 * 0.016708634 * Math.sin(m) +
      4 * 0.016708634 * y * Math.sin(m) * Math.cos(2 * l0 * (Math.PI / 180)) -
      0.5 * y * y * Math.sin(4 * l0 * (Math.PI / 180));

    return eot * (4 * 180 / Math.PI);
  }
}

export default YearCountingWorkbench;