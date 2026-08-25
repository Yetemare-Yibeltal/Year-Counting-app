import React, { useState, useEffect, useMemo, useCallback } from 'react';

export type CalendarFamily =
  | "solar"
  | "luni_solar"
  | "lunar"
  | "astronomical"
  | "arithmetic";

export type CalculatorTab =
  | "dashboard"
  | "converter"
  | "difference"
  | "age"
  | "countdown"
  | "leap"
  | "business"
  | "julian"
  | "systems"
  | "timeline"
  | "education"
  | "saved";

export interface CalendarSystem {
  id: string;
  name: string;
  nativeName?: string;
  family: CalendarFamily;
  era: string;
  epochYear: number;
  epochJulianDay: number;
  averageYearLength: number;
  leapRule: string;
  description: string;
  origin: string;
  significance: string;
  monthStructure: string;
  accuracy: string;
}

export interface SimpleDate {
  year: number;
  month: number;
  day: number;
}

export interface DifferenceResult {
  totalDays: number;
  totalWeeks: number;
  years: number;
  months: number;
  days: number;
  inclusiveDays: number;
  weekdays: number;
  weekends: number;
}

export interface SavedCalculation {
  id: string;
  title: string;
  type: string;
  value: string;
  createdAt: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];

const ETHIOPIAN_MONTHS = [
  "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir",
  "Yekatit", "Megabit", "Miazia", "Ginbot", "Sene",
  "Hamle", "Nehase", "Pagume",
];

const ETHIOPIAN_MONTHS_AMHARIC = [
  "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር",
  "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ",
  "ሐምሌ", "ነሐሴ", "ጳጉሜ",
];

const ISLAMIC_MONTHS = [
  "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qadah", "Dhu al-Hijjah",
];

const SYSTEMS: CalendarSystem[] = [
  {
    id: "gregorian",
    name: "Gregorian Calendar",
    nativeName: "Calendarium Gregorianum",
    family: "solar",
    era: "AD / CE",
    epochYear: 1,
    epochJulianDay: 1721425.5,
    averageYearLength: 365.2425,
    leapRule: "Divisible by 4, except centuries unless divisible by 400.",
    description: "The internationally dominant civil calendar.",
    origin: "Introduced in 1582 as a reform of the Julian calendar.",
    significance: "Used for international civil, scientific, commercial and administrative dates.",
    monthStructure: "12 months with 28–31 days.",
    accuracy: "Approximately one day of seasonal drift in 3,236 years.",
  },
  {
    id: "ethiopian",
    name: "Ethiopian Calendar",
    nativeName: "የኢትዮጵያ ዘመን አቆጣጠር",
    family: "solar",
    era: "Amete Mihret",
    epochYear: 1,
    epochJulianDay: 1724220.5,
    averageYearLength: 365.25,
    leapRule: "Leap year when the year modulo 4 equals 3.",
    description: "A 13-month solar calendar with twelve 30-day months and Pagume.",
    origin: "Closely related to the Alexandrian and Coptic calendar tradition.",
    significance: "Official civil calendar of Ethiopia and a major cultural timekeeping system.",
    monthStructure: "12 × 30 days + Pagume of 5 or 6 days.",
    accuracy: "Averages 365.25 days per year.",
  },
  {
    id: "islamic",
    name: "Tabular Islamic Calendar",
    nativeName: "التقويم الهجري",
    family: "lunar",
    era: "AH",
    epochYear: 1,
    epochJulianDay: 1948439.5,
    averageYearLength: 354.36667,
    leapRule: "11 leap years occur in a 30-year arithmetic cycle.",
    description: "A deterministic arithmetic model of the Islamic lunar calendar.",
    origin: "Uses the Hijri epoch associated with the migration to Medina.",
    significance: "Useful for computational and historical calendar work.",
    monthStructure: "12 lunar months alternating approximately 29 and 30 days.",
    accuracy: "Tracks a mean lunar year rather than direct crescent observation.",
  },
  {
    id: "coptic",
    name: "Coptic Calendar",
    nativeName: "ⲧⲁⲡⲟⲩⲁⲗⲉ",
    family: "solar",
    era: "Anno Martyrum",
    epochYear: 1,
    epochJulianDay: 1825029.5,
    averageYearLength: 365.25,
    leapRule: "Four-year cycle with a sixth epagomenal day in leap years.",
    description: "An ancient Egyptian-derived calendar retained by the Coptic tradition.",
    origin: "Era begins in 284 CE under Diocletian.",
    significance: "Important for Coptic liturgical and historical chronology.",
    monthStructure: "12 × 30 days + a short thirteenth month.",
    accuracy: "Julian-style seasonal drift.",
  },
  {
    id: "persian",
    name: "Persian Solar Hijri",
    nativeName: "گاه‌شماری هجری خورشیدی",
    family: "solar",
    era: "SH",
    epochYear: 1,
    epochJulianDay: 1948320.5,
    averageYearLength: 365.2422,
    leapRule: "Solar-equinox based; implementations may use astronomical or algorithmic rules.",
    description: "A highly accurate solar calendar centered on the spring equinox.",
    origin: "Modern form derives from the Persian calendar reform tradition.",
    significance: "Official civil calendar of Iran and Afghanistan.",
    monthStructure: "Six 31-day months, five 30-day months and a variable final month.",
    accuracy: "Very close to the tropical year.",
  },
  {
    id: "hebrew",
    name: "Hebrew Luni-Solar Calendar",
    nativeName: "הלוח העברי",
    family: "luni_solar",
    era: "AM",
    epochYear: 1,
    epochJulianDay: 347995.5,
    averageYearLength: 365.2468,
    leapRule: "Seven embolismic years in a 19-year Metonic cycle.",
    description: "A luni-solar system using intercalation to preserve seasonal alignment.",
    origin: "Fixed mathematical rules are traditionally associated with Hillel II.",
    significance: "Defines Jewish religious dates and festivals.",
    monthStructure: "12 or 13 lunar months depending on the year.",
    accuracy: "Highly structured long-term luni-solar approximation.",
  },
  {
    id: "mayan",
    name: "Mayan Long Count",
    nativeName: "Long Count",
    family: "arithmetic",
    era: "Long Count",
    epochYear: 0,
    epochJulianDay: 584282.5,
    averageYearLength: 360,
    leapRule: "No solar leap-year correction; it is a linear day count.",
    description: "A positional count of elapsed days using a modified vigesimal structure.",
    origin: "Developed in ancient Mesoamerican chronology.",
    significance: "Provides long-range historical and calendrical chronology.",
    monthStructure: "Kin, Winal, Tun, K'atun and B'ak'tun units.",
    accuracy: "An elapsed-day count rather than a seasonal calendar.",
  },
  {
    id: "julian-day",
    name: "Julian Day Number",
    nativeName: "JD",
    family: "astronomical",
    era: "JD",
    epochYear: -4712,
    epochJulianDay: 0,
    averageYearLength: 365.25,
    leapRule: "Continuous numerical day count.",
    description: "A continuous astronomical time scale used for chronology and computation.",
    origin: "Associated with the Julian Period introduced by Joseph Scaliger.",
    significance: "Useful as a common computational bridge between calendar systems.",
    monthStructure: "No months or weeks; days are counted continuously.",
    accuracy: "A mathematical reference count rather than a seasonal calendar.",
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const pad = (value: number, size = 2) =>
  String(value).padStart(size, "0");

const formatNumber = (value: number, digits = 0) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const toDate = ({ year, month, day }: SimpleDate) =>
  new Date(year, month - 1, day);

const fromDate = (date: Date): SimpleDate => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
});

const isValidDate = (value: SimpleDate) => {
  if (!Number.isInteger(value.year) || !Number.isInteger(value.month) || !Number.isInteger(value.day)) {
    return false;
  }

  if (value.month < 1 || value.month > 12 || value.day < 1 || value.day > 31) {
    return false;
  }

  const date = toDate(value);
  return (
    date.getFullYear() === value.year &&
    date.getMonth() + 1 === value.month &&
    date.getDate() === value.day
  );
};

const daysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

const isGregorianLeapYear = (year: number) =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

const isEthiopianLeapYear = (year: number) => year % 4 === 3;

const isIslamicLeapYear = (year: number) =>
  ((11 * year + 14) % 30) < 11;

const dayOfYear = (date: SimpleDate) => {
  const start = new Date(date.year, 0, 1);
  const current = toDate(date);
  return Math.floor((current.getTime() - start.getTime()) / 86400000) + 1;
};

const daysBetween = (start: SimpleDate, end: SimpleDate) => {
  const a = toDate(start);
  const b = toDate(end);
  return Math.round((b.getTime() - a.getTime()) / 86400000);
};

const addDays = (date: SimpleDate, amount: number): SimpleDate => {
  const result = toDate(date);
  result.setDate(result.getDate() + amount);
  return fromDate(result);
};

const formatDate = (date: SimpleDate) =>
  `${date.year}-${pad(date.month)}-${pad(date.day)}`;

const formatLongDate = (date: SimpleDate) =>
  `${MONTH_NAMES[date.month - 1]} ${date.day}, ${date.year}`;

const weekdayName = (date: SimpleDate) =>
  WEEKDAY_NAMES[toDate(date).getDay()];

const getAge = (birth: SimpleDate, target: SimpleDate) => {
  let years = target.year - birth.year;
  let months = target.month - birth.month;
  let days = target.day - birth.day;

  if (days < 0) {
    months -= 1;
    const previousMonth = target.month === 1 ? 12 : target.month - 1;
    const previousYear = target.month === 1 ? target.year - 1 : target.year;
    days += daysInMonth(previousYear, previousMonth);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.max(0, daysBetween(birth, target));

  return { years, months, days, totalDays };
};

const getCalendarDifference = (
  start: SimpleDate,
  end: SimpleDate,
): DifferenceResult => {
  const rawDays = daysBetween(start, end);
  const direction = rawDays < 0 ? -1 : 1;
  const absoluteDays = Math.abs(rawDays);

  const startDate = toDate(start);
  const endDate = toDate(end);
  let years = Math.abs(end.year - start.year);
  let months = Math.abs(end.month - start.month);
  let days = Math.abs(end.day - start.day);

  if (days < 0) days = 0;

  if (years > 0 && absoluteDays < 365) {
    years = 0;
  }

  if (months > 11) {
    months %= 12;
  }

  const weekdays = countWeekdays(start, end);
  const weekends = absoluteDays - weekdays;

  return {
    totalDays: rawDays,
    totalWeeks: rawDays / 7,
    years: years * direction,
    months: months * direction,
    days: days * direction,
    inclusiveDays: absoluteDays + 1,
    weekdays,
    weekends,
  };
};

const countWeekdays = (start: SimpleDate, end: SimpleDate) => {
  const distance = Math.abs(daysBetween(start, end));
  const first = daysBetween(start, end) <= 0 ? start : end;
  let weekdays = 0;

  for (let i = 0; i <= distance; i += 1) {
    const current = addDays(first, i);
    const day = toDate(current).getDay();
    if (day !== 0 && day !== 6) weekdays += 1;
  }

  return Math.max(0, weekdays - 1);
};

const countBusinessDays = (
  start: SimpleDate,
  end: SimpleDate,
  holidays: SimpleDate[],
) => {
  const total = Math.abs(daysBetween(start, end));
  const first = daysBetween(start, end) <= 0 ? start : end;
  let result = 0;

  for (let i = 0; i <= total; i += 1) {
    const current = addDays(first, i);
    const weekday = toDate(current).getDay();
    const holiday = holidays.some((item) => formatDate(item) === formatDate(current));

    if (weekday !== 0 && weekday !== 6 && !holiday) {
      result += 1;
    }
  }

  return Math.max(0, result - 1);
};

const gregorianToJulianDay = (
  year: number,
  month: number,
  day: number,
) => {
  let adjustedYear = year;
  let adjustedMonth = month;

  if (month <= 2) {
    adjustedYear -= 1;
    adjustedMonth += 12;
  }

  const A = Math.floor(adjustedYear / 100);
  const B = 2 - A + Math.floor(A / 4);

  return (
    Math.floor(365.25 * (adjustedYear + 4716)) +
    Math.floor(30.6001 * (adjustedMonth + 1)) +
    day +
    B -
    1524.5
  );
};

const julianDayToGregorian = (jd: number): SimpleDate => {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;

  let A = z;

  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    A = z + 1 + alpha - Math.floor(alpha / 4);
  }

  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const day = Math.floor(B - D - Math.floor(30.6001 * E) + f);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  return { year, month, day };
};

const gregorianToEthiopian = (date: SimpleDate): SimpleDate => {
  const jd = Math.floor(gregorianToJulianDay(date.year, date.month, date.day));
  const r = (jd - 1723856) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const year =
    4 * Math.floor((jd - 1723856) / 1461) +
    Math.floor(r / 365) -
    Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;

  return { year, month, day };
};

const ethiopianToGregorian = (date: SimpleDate): SimpleDate => {
  const jd =
    1723856 +
    365 * (date.year - 1) +
    Math.floor(date.year / 4) +
    30 * (date.month - 1) +
    date.day -
    0.5;

  return julianDayToGregorian(jd);
};

const gregorianToIslamic = (date: SimpleDate): SimpleDate => {
  const jd = Math.floor(gregorianToJulianDay(date.year, date.month, date.day)) + 0.5;
  const days = Math.floor(jd - 1948439.5);
  const year = Math.floor((30 * days + 10646) / 10631);
  const month = Math.min(
    12,
    Math.ceil((days - (354 * (year - 1) + Math.floor((3 + 11 * year) / 30))) / 29.5) + 1,
  );
  const monthStart =
    1948439.5 +
    354 * (year - 1) +
    Math.floor((3 + 11 * year) / 30) +
    Math.ceil(29.5 * (month - 1));

  const day = Math.floor(jd - monthStart) + 1;

  return { year, month, day };
};

const gregorianToCoptic = (date: SimpleDate): SimpleDate => {
  const eth = gregorianToEthiopian(date);
  return {
    year: eth.year + 276,
    month: eth.month,
    day: eth.day,
  };
};

const gregorianToPersianApprox = (date: SimpleDate): SimpleDate => {
  const year = date.year - 621;
  const march21 = new Date(date.year, 2, 21);
  const beforeNowruz = toDate(date).getTime() < march21.getTime();
  const adjustedYear = beforeNowruz ? year - 1 : year;
  const dayOfPersianYear = Math.max(
    1,
    Math.floor(
      (toDate(date).getTime() -
        new Date(date.year, beforeNowruz ? 2 : 2, beforeNowruz ? 21 : 21).getTime()) /
        86400000,
    ) + 1,
  );

  if (dayOfPersianYear <= 186) {
    return {
      year: adjustedYear,
      month: Math.ceil(dayOfPersianYear / 31),
      day: ((dayOfPersianYear - 1) % 31) + 1,
    };
  }

  const remaining = dayOfPersianYear - 186;
  return {
    year: adjustedYear,
    month: 6 + Math.ceil(remaining / 30),
    day: ((remaining - 1) % 30) + 1,
  };
};

const gregorianToMayan = (date: SimpleDate) => {
  const jd = gregorianToJulianDay(date.year, date.month, date.day);
  let count = Math.floor(jd - 584282.5);

  const bakun = Math.floor(count / 144000);
  count %= 144000;
  const katun = Math.floor(count / 7200);
  count %= 7200;
  const tun = Math.floor(count / 360);
  count %= 360;
  const winal = Math.floor(count / 20);
  const kin = count % 20;

  return {
    bakun,
    katun,
    tun,
    winal,
    kin,
    formatted: `${bakun}.${katun}.${tun}.${winal}.${kin}`,
  };
};

const getDayOfYearProgress = (date: SimpleDate) => {
  const total = isGregorianLeapYear(date.year) ? 366 : 365;
  const current = dayOfYear(date);
  return (current / total) * 100;
};

const getDaysRemainingInYear = (date: SimpleDate) => {
  const total = isGregorianLeapYear(date.year) ? 366 : 365;
  return total - dayOfYear(date);
};

const getQuarter = (month: number) => Math.ceil(month / 3);

const getWeekOfYear = (date: SimpleDate) => {
  const start = new Date(date.year, 0, 1);
  const current = toDate(date);
  const difference = Math.floor(
    (current.getTime() - start.getTime()) / 86400000,
  );
  return Math.ceil((difference + start.getDay() + 1) / 7);
};

const getOrdinal = (value: number) => {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  switch (value % 10) {
    case 1: return `${value}st`;
    case 2: return `${value}nd`;
    case 3: return `${value}rd`;
    default: return `${value}th`;
  }
};

const getSystem = (id: string) =>
  SYSTEMS.find((system) => system.id === id) ?? SYSTEMS[0];

const today = (): SimpleDate => {
  const now = new Date();
  return fromDate(now);
};

const todayValue = today();

const DEFAULT_DATE: SimpleDate = {
  year: todayValue.year,
  month: todayValue.month,
  day: todayValue.day,
};

const DEFAULT_BIRTHDAY: SimpleDate = {
  year: todayValue.year - 25,
  month: todayValue.month,
  day: todayValue.day,
};

/* ============================================================================
 * Small UI primitives
 * ========================================================================== */

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  title,
  subtitle,
}) => (
  <section
    className={`rounded-2xl border border-gray-800 bg-gray-900/70 p-5 shadow-xl shadow-black/10 ${className}`}
  >
    {(title || subtitle) && (
      <div className="mb-5 border-b border-gray-800 pb-4">
        {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
        {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
      </div>
    )}
    {children}
  </section>
);

const MetricCard: React.FC<{
  label: string;
  value: string;
  detail?: string;
  accent?: string;
}> = ({ label, value, detail, accent = "text-indigo-400" }) => (
  <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
    <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
    <div className={`mt-2 text-2xl font-black ${accent}`}>{value}</div>
    {detail && <div className="mt-1 text-xs text-gray-500">{detail}</div>}
  </div>
);

const Badge: React.FC<{
  children: React.ReactNode;
  tone?: "indigo" | "green" | "amber" | "purple" | "red" | "gray";
}> = ({ children, tone = "indigo" }) => {
  const classes = {
    indigo: "border-indigo-800 bg-indigo-950/60 text-indigo-300",
    green: "border-emerald-800 bg-emerald-950/60 text-emerald-300",
    amber: "border-amber-800 bg-amber-950/60 text-amber-300",
    purple: "border-purple-800 bg-purple-950/60 text-purple-300",
    red: "border-red-800 bg-red-950/60 text-red-300",
    gray: "border-gray-700 bg-gray-900 text-gray-300",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${classes[tone]}`}
    >
      {children}
    </span>
  );
};

const InputField: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}> = ({ label, value, onChange, min, max, className = "" }) => (
  <label className={`block ${className}`}>
    <span className="mb-2 block text-xs font-semibold text-gray-400">
      {label}
    </span>
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(event) => onChange(Number(event.target.value))}
      className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
    />
  </label>
);

const DateFields: React.FC<{
  label: string;
  value: SimpleDate;
  onChange: (value: SimpleDate) => void;
}> = ({ label, value, onChange }) => (
  <div>
    <div className="mb-3 text-sm font-bold text-white">{label}</div>
    <div className="grid grid-cols-3 gap-3">
      <InputField
        label="Year"
        value={value.year}
        onChange={(year) => onChange({ ...value, year })}
      />
      <InputField
        label="Month"
        value={value.month}
        min={1}
        max={12}
        onChange={(month) =>
          onChange({ ...value, month: clamp(month || 1, 1, 12) })
        }
      />
      <InputField
        label="Day"
        value={value.day}
        min={1}
        max={31}
        onChange={(day) =>
          onChange({
            ...value,
            day: clamp(day || 1, 1, daysInMonth(value.year, value.month)),
          })
        }
      />
    </div>
  </div>
);

/* ============================================================================
 * Dashboard
 * ========================================================================== */

const DashboardPanel: React.FC<{
  date: SimpleDate;
  onTab: (tab: CalculatorTab) => void;
}> = ({ date, onTab }) => {
  const gregorianLeap = isGregorianLeapYear(date.year);
  const eth = gregorianToEthiopian(date);
  const islamic = gregorianToIslamic(date);
  const mayan = gregorianToMayan(date);
  const jd = gregorianToJulianDay(date.year, date.month, date.day);
  const progress = getDayOfYearProgress(date);
  const remaining = getDaysRemainingInYear(date);

  const quickActions: Array<[CalculatorTab, string, string]> = [
    ["converter", "Calendar Converter", "Compare calendar systems"],
    ["difference", "Date Difference", "Measure time between dates"],
    ["age", "Age Calculator", "Calculate exact age"],
    ["countdown", "Countdown", "Track a future date"],
    ["leap", "Leap Year Lab", "Analyze leap rules"],
    ["business", "Business Days", "Count working days"],
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Selected Date"
          value={formatDate(date)}
          detail={formatLongDate(date)}
        />
        <MetricCard
          label="Day of Year"
          value={formatNumber(dayOfYear(date))}
          detail={`${formatNumber(remaining)} days remaining`}
          accent="text-emerald-400"
        />
        <MetricCard
          label="Julian Day"
          value={formatNumber(jd, 1)}
          detail="Astronomical reference"
          accent="text-amber-400"
        />
        <MetricCard
          label="Leap Year"
          value={gregorianLeap ? "YES" : "NO"}
          detail={gregorianLeap ? "366 days" : "365 days"}
          accent={gregorianLeap ? "text-purple-400" : "text-gray-300"}
        />
      </div>

      <Card
        title="Year Counting Calculator"
        subtitle="A complete chronology workbench for calendar conversion, date arithmetic and year analysis."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="text-sm text-gray-400">Current date</div>
            <div className="mt-2 text-4xl font-black text-white">
              {formatLongDate(date)}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{weekdayName(date)}</Badge>
              <Badge tone="green">Quarter {getQuarter(date.month)}</Badge>
              <Badge tone="amber">Week {getWeekOfYear(date)}</Badge>
              <Badge tone="purple">{getOrdinal(dayOfYear(date))} day</Badge>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
              <span>Year progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-gray-400">
              <div className="rounded-lg bg-gray-950 p-3">
                <span className="block text-gray-600">Elapsed</span>
                <strong className="text-white">{dayOfYear(date)} days</strong>
              </div>
              <div className="rounded-lg bg-gray-950 p-3">
                <span className="block text-gray-600">Remaining</span>
                <strong className="text-white">{remaining} days</strong>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Cross-Calendar Snapshot">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
            <div className="text-xs text-gray-500">Ethiopian</div>
            <div className="mt-2 text-xl font-bold text-white">
              {eth.year}/{eth.month}/{eth.day}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {ETHIOPIAN_MONTHS[eth.month - 1] ?? "Pagume"}
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
            <div className="text-xs text-gray-500">Islamic</div>
            <div className="mt-2 text-xl font-bold text-white">
              {islamic.year} AH
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {ISLAMIC_MONTHS[islamic.month - 1] ?? "Unknown month"} {islamic.day}
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
            <div className="text-xs text-gray-500">Mayan Long Count</div>
            <div className="mt-2 text-xl font-bold text-white">
              {mayan.formatted}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              B&apos;ak&apos;tun / K&apos;atun / Tun / Winal / Kin
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
            <div className="text-xs text-gray-500">Julian Day</div>
            <div className="mt-2 text-xl font-bold text-white">
              {jd.toFixed(1)}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Continuous astronomical count
            </div>
          </div>
        </div>
      </Card>

      <Card title="Quick Calculators">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {quickActions.map(([tab, title, description]) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTab(tab)}
              className="rounded-xl border border-gray-800 bg-gray-950 p-4 text-left transition hover:border-indigo-500 hover:bg-indigo-950/20"
            >
              <div className="font-bold text-white">{title}</div>
              <div className="mt-1 text-xs text-gray-500">{description}</div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

/* ============================================================================
 * Converter
 * ========================================================================== */

const ConverterPanel: React.FC<{
  date: SimpleDate;
  onDateChange: (date: SimpleDate) => void;
}> = ({ date, onDateChange }) => {
  const eth = useMemo(() => gregorianToEthiopian(date), [date]);
  const isl = useMemo(() => gregorianToIslamic(date), [date]);
  const coptic = useMemo(() => gregorianToCoptic(date), [date]);
  const persian = useMemo(() => gregorianToPersianApprox(date), [date]);
  const mayan = useMemo(() => gregorianToMayan(date), [date]);
  const jd = useMemo(
    () => gregorianToJulianDay(date.year, date.month, date.day),
    [date],
  );

  const cards = [
    {
      name: "Gregorian",
      value: formatDate(date),
      detail: `${weekdayName(date)} · ${isGregorianLeapYear(date.year) ? "Leap year" : "Common year"}`,
      tone: "indigo" as const,
    },
    {
      name: "Ethiopian",
      value: `${eth.year}/${eth.month}/${eth.day}`,
      detail: `${ETHIOPIAN_MONTHS[eth.month - 1] ?? "Pagume"} · ${ETHIOPIAN_MONTHS_AMHARIC[eth.month - 1] ?? "ጳጉሜ"}`,
      tone: "green" as const,
    },
    {
      name: "Islamic",
      value: `${isl.year} AH / ${isl.month}/${isl.day}`,
      detail: ISLAMIC_MONTHS[isl.month - 1] ?? "Islamic month",
      tone: "purple" as const,
    },
    {
      name: "Coptic",
      value: `${coptic.year}/${coptic.month}/${coptic.day}`,
      detail: "Coptic / Anno Martyrum",
      tone: "amber" as const,
    },
    {
      name: "Persian",
      value: `${persian.year}/${persian.month}/${persian.day}`,
      detail: "Solar Hijri approximation",
      tone: "green" as const,
    },
    {
      name: "Mayan Long Count",
      value: mayan.formatted,
      detail: "Base-20 chronology",
      tone: "purple" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <Card
        title="Multi-Calendar Date Converter"
        subtitle="Enter one Gregorian date and inspect multiple year-counting representations."
      >
        <DateFields label="Source Gregorian date" value={date} onChange={onDateChange} />
        {!isValidDate(date) && (
          <div className="mt-4 rounded-xl border border-red-800 bg-red-950/30 p-3 text-sm text-red-300">
            The entered Gregorian date is not valid.
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.name}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-white">{card.name}</h3>
              <Badge tone={card.tone}>Converted</Badge>
            </div>
            <div className="mt-5 break-words text-2xl font-black text-white">
              {card.value}
            </div>
            <div className="mt-2 text-xs text-gray-500">{card.detail}</div>
          </Card>
        ))}
      </div>

      <Card title="Astronomical Reference">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard label="Julian Day" value={jd.toFixed(1)} />
          <MetricCard label="Day of Week" value={weekdayName(date)} accent="text-emerald-400" />
          <MetricCard label="Day of Year" value={String(dayOfYear(date))} accent="text-amber-400" />
        </div>
      </Card>
    </div>
  );
};

/* ============================================================================
 * Difference calculator
 * ========================================================================== */

const DifferencePanel: React.FC<{
  initialStart: SimpleDate;
  initialEnd: SimpleDate;
}> = ({ initialStart, initialEnd }) => {
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);

  const result = useMemo(
    () => getCalendarDifference(start, end),
    [start, end],
  );

  return (
    <div className="space-y-6">
      <Card
        title="Date Difference Calculator"
        subtitle="Calculate elapsed days, weeks, calendar units, weekdays and weekends."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <DateFields label="Start date" value={start} onChange={setStart} />
          <DateFields label="End date" value={end} onChange={setEnd} />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Total Days" value={formatNumber(Math.abs(result.totalDays))} />
        <MetricCard label="Total Weeks" value={Math.abs(result.totalWeeks).toFixed(2)} accent="text-emerald-400" />
        <MetricCard label="Weekdays" value={formatNumber(result.weekdays)} accent="text-purple-400" />
        <MetricCard label="Weekends" value={formatNumber(result.weekends)} accent="text-amber-400" />
      </div>

      <Card title="Difference Breakdown">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-gray-950 p-4">
            <div className="text-xs text-gray-500">Calendar years</div>
            <div className="mt-1 text-2xl font-bold text-white">
              {Math.abs(result.years)}
            </div>
          </div>
          <div className="rounded-xl bg-gray-950 p-4">
            <div className="text-xs text-gray-500">Calendar months</div>
            <div className="mt-1 text-2xl font-bold text-white">
              {Math.abs(result.months)}
            </div>
          </div>
          <div className="rounded-xl bg-gray-950 p-4">
            <div className="text-xs text-gray-500">Remaining days</div>
            <div className="mt-1 text-2xl font-bold text-white">
              {Math.abs(result.days)}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-gray-800 bg-gray-950 p-4 text-sm text-gray-400">
          Inclusive count:{" "}
          <strong className="text-white">{formatNumber(result.inclusiveDays)} days</strong>.
          This counts both endpoints.
        </div>
      </Card>
    </div>
  );
};

/* ============================================================================
 * Age calculator
 * ========================================================================== */

const AgePanel: React.FC = () => {
  const [birth, setBirth] = useState(DEFAULT_BIRTHDAY);
  const [target, setTarget] = useState(DEFAULT_DATE);

  const age = useMemo(() => getAge(birth, target), [birth, target]);

  const nextBirthday = useMemo(() => {
    let candidate: SimpleDate = {
      year: target.year,
      month: birth.month,
      day: Math.min(birth.day, daysInMonth(target.year, birth.month)),
    };

    if (daysBetween(target, candidate) < 0) {
      candidate = {
        ...candidate,
        year: target.year + 1,
        day: Math.min(birth.day, daysInMonth(target.year + 1, birth.month)),
      };
    }

    return candidate;
  }, [birth, target]);

  const daysUntilBirthday = Math.max(0, daysBetween(target, nextBirthday));

  return (
    <div className="space-y-6">
      <Card
        title="Age Calculator"
        subtitle="Calculate age in years, months, days and total elapsed days."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <DateFields label="Date of birth" value={birth} onChange={setBirth} />
          <DateFields label="Age on date" value={target} onChange={setTarget} />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Years" value={String(age.years)} />
        <MetricCard label="Months" value={String(age.months)} accent="text-emerald-400" />
        <MetricCard label="Days" value={String(age.days)} accent="text-purple-400" />
        <MetricCard label="Total Days" value={formatNumber(age.totalDays)} accent="text-amber-400" />
      </div>

      <Card title="Birthday Analysis">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Next Birthday" value={formatDate(nextBirthday)} />
          <MetricCard label="Days Remaining" value={String(daysUntilBirthday)} accent="text-emerald-400" />
          <MetricCard label="Birth Weekday" value={weekdayName(birth)} accent="text-purple-400" />
        </div>
      </Card>
    </div>
  );
};

/* ============================================================================
 * Countdown
 * ========================================================================== */

const CountdownPanel: React.FC = () => {
  const [target, setTarget] = useState(
    addDays(DEFAULT_DATE, 30),
  );

  const difference = useMemo(
    () => Math.max(0, daysBetween(DEFAULT_DATE, target)),
    [target],
  );

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const targetDateTime = new Date(
    target.year,
    target.month - 1,
    target.day,
    23,
    59,
    59,
  );

  const milliseconds = Math.max(0, targetDateTime.getTime() - now.getTime());
  const seconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="space-y-6">
      <Card
        title="Year Counting Countdown"
        subtitle="Track the exact remaining duration to a target date."
      >
        <DateFields label="Target date" value={target} onChange={setTarget} />
      </Card>

      <Card>
        <div className="text-center">
          <div className="text-sm text-gray-500">Time remaining</div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Days", days],
              ["Hours", hours],
              ["Minutes", minutes],
              ["Seconds", remainingSeconds],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
                <div className="text-3xl font-black text-white">{pad(Number(value))}</div>
                <div className="mt-1 text-xs uppercase text-gray-500">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Badge tone={difference === 0 ? "red" : "green"}>
              {difference === 0 ? "Target reached" : `${difference} calendar days`}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ============================================================================
 * Leap year laboratory
 * ========================================================================== */

const LeapYearPanel: React.FC = () => {
  const [year, setYear] = useState(DEFAULT_DATE.year);
  const gregorian = isGregorianLeapYear(year);
  const ethiopian = isEthiopianLeapYear(year);
  const islamic = isIslamicLeapYear(year);

  const rules = [
    {
      name: "Gregorian",
      leap: gregorian,
      rule: "Divisible by 4, excluding most centuries except multiples of 400.",
    },
    {
      name: "Ethiopian",
      leap: ethiopian,
      rule: "Year modulo 4 equals 3.",
    },
    {
      name: "Islamic Tabular",
      leap: islamic,
      rule: "11 leap years within every 30-year cycle.",
    },
    {
      name: "Coptic",
      leap: ethiopian,
      rule: "Four-year cycle aligned with Julian-style arithmetic.",
    },
  ];

  return (
    <div className="space-y-6">
      <Card
        title="Leap Year Laboratory"
        subtitle="Compare leap-year behavior across several arithmetic calendar models."
      >
        <div className="max-w-xs">
          <InputField label="Year" value={year} onChange={setYear} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {rules.map((item) => (
          <Card key={item.name}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-white">{item.name}</h3>
              <Badge tone={item.leap ? "green" : "gray"}>
                {item.leap ? "Leap" : "Common"}
              </Badge>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-400">{item.rule}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* ============================================================================
 * Business-day calculator
 * ========================================================================== */

const BusinessDaysPanel: React.FC = () => {
  const [start, setStart] = useState(DEFAULT_DATE);
  const [end, setEnd] = useState(addDays(DEFAULT_DATE, 30));
  const [holidayText, setHolidayText] = useState("");

  const holidays = useMemo(() => {
    return holidayText
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => {
        const [year, month, day] = value.split("-").map(Number);
        return { year, month, day };
      })
      .filter(isValidDate);
  }, [holidayText]);

  const businessDays = useMemo(
    () => countBusinessDays(start, end, holidays),
    [start, end, holidays],
  );

  const calendarDays = Math.abs(daysBetween(start, end));

  return (
    <div className="space-y-6">
      <Card
        title="Business Day Calculator"
        subtitle="Estimate working days while excluding weekends and optional holiday dates."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <DateFields label="Start date" value={start} onChange={setStart} />
          <DateFields label="End date" value={end} onChange={setEnd} />
        </div>

        <label className="mt-6 block">
          <span className="mb-2 block text-xs font-semibold text-gray-400">
            Holidays (comma-separated YYYY-MM-DD)
          </span>
          <input
            value={holidayText}
            onChange={(event) => setHolidayText(event.target.value)}
            placeholder="2026-01-01, 2026-05-01"
            className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />
        </label>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Calendar Days" value={formatNumber(calendarDays)} />
        <MetricCard label="Business Days" value={formatNumber(businessDays)} accent="text-emerald-400" />
        <MetricCard label="Excluded Holidays" value={formatNumber(holidays.length)} accent="text-amber-400" />
      </div>
    </div>
  );
};

/* ============================================================================
 * Julian Day panel
 * ========================================================================== */

const JulianPanel: React.FC = () => {
  const [date, setDate] = useState(DEFAULT_DATE);
  const [jdInput, setJdInput] = useState(gregorianToJulianDay(
    DEFAULT_DATE.year,
    DEFAULT_DATE.month,
    DEFAULT_DATE.day,
  ));

  const calculated = useMemo(
    () => gregorianToJulianDay(date.year, date.month, date.day),
    [date],
  );

  const reversed = useMemo(
    () => julianDayToGregorian(jdInput),
    [jdInput],
  );

  return (
    <div className="space-y-6">
      <Card
        title="Julian Day Calculator"
        subtitle="Move between Gregorian dates and continuous Julian Day numbers."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <DateFields label="Gregorian input" value={date} onChange={setDate} />
            <div className="mt-4 rounded-xl bg-gray-950 p-4">
              <div className="text-xs text-gray-500">Calculated JD</div>
              <div className="mt-2 text-3xl font-black text-amber-400">
                {calculated.toFixed(1)}
              </div>
            </div>
          </div>

          <div>
            <InputField
              label="Julian Day Number"
              value={jdInput}
              onChange={setJdInput}
            />
            <div className="mt-4 rounded-xl bg-gray-950 p-4">
              <div className="text-xs text-gray-500">Converted Gregorian date</div>
              <div className="mt-2 text-2xl font-black text-white">
                {formatDate(reversed)}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {formatLongDate(reversed)}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ============================================================================
 * Calendar systems explorer
 * ========================================================================== */

const SystemsPanel: React.FC = () => {
  const [selected, setSelected] = useState(SYSTEMS[0].id);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      SYSTEMS.filter((system) =>
        `${system.name} ${system.family} ${system.era}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search],
  );

  const current = getSystem(selected);

  return (
    <div className="space-y-6">
      <Card
        title="Calendar Systems Explorer"
        subtitle="Study the structure, epoch, leap rules and historical role of each supported system."
      >
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search calendar systems..."
          className="mb-5 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
        />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((system) => (
            <button
              type="button"
              key={system.id}
              onClick={() => setSelected(system.id)}
              className={`rounded-xl border p-4 text-left transition ${
                selected === system.id
                  ? "border-indigo-500 bg-indigo-950/30"
                  : "border-gray-800 bg-gray-950 hover:border-gray-700"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-white">{system.name}</span>
                <Badge tone={selected === system.id ? "indigo" : "gray"}>
                  {system.family}
                </Badge>
              </div>
              <div className="mt-2 text-xs text-gray-500">{system.era}</div>
            </button>
          ))}
        </div>
      </Card>

      <Card title={current.name}>
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Average Year"
            value={`${current.averageYearLength}`}
            detail="days"
          />
          <MetricCard
            label="Epoch"
            value={String(current.epochYear)}
            detail={current.era}
            accent="text-amber-400"
          />
          <MetricCard
            label="Family"
            value={current.family}
            detail={current.accuracy}
            accent="text-purple-400"
          />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div>
            <h4 className="font-bold text-white">Description</h4>
            <p className="mt-2 text-sm leading-7 text-gray-400">
              {current.description}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white">Historical Origin</h4>
            <p className="mt-2 text-sm leading-7 text-gray-400">
              {current.origin}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white">Leap Rule</h4>
            <p className="mt-2 text-sm leading-7 text-gray-400">
              {current.leapRule}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white">Cultural Significance</h4>
            <p className="mt-2 text-sm leading-7 text-gray-400">
              {current.significance}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ============================================================================
 * Timeline
 * ========================================================================== */

const TimelinePanel: React.FC = () => {
  const milestones = [
    ["3114 BC", "Mayan Long Count epoch", "Mesoamerican chronology"],
    ["284 AD", "Coptic Anno Martyrum era", "Coptic historical chronology"],
    ["622 AD", "Hijri epoch", "Islamic chronology"],
    ["1079 AD", "Jalali reform tradition", "Persian solar chronology"],
    ["1582 AD", "Gregorian reform", "European calendar reform"],
    ["2007 AD", "Ethiopian millennium celebration", "Ethiopian chronology"],
  ];

  return (
    <div className="space-y-6">
      <Card
        title="Calendar History Timeline"
        subtitle="Selected milestones showing how different year-counting traditions developed."
      >
        <div className="space-y-4">
          {milestones.map(([date, title, detail]) => (
            <div
              key={date}
              className="grid gap-3 rounded-xl border border-gray-800 bg-gray-950 p-4 md:grid-cols-[140px_1fr]"
            >
              <div className="font-black text-indigo-400">{date}</div>
              <div>
                <div className="font-bold text-white">{title}</div>
                <div className="mt-1 text-sm text-gray-500">{detail}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

/* ============================================================================
 * Education
 * ========================================================================== */

const EducationPanel: React.FC = () => {
  const sections = [
    {
      title: "What is a year?",
      text: "A year is a time interval associated with Earth's orbital cycle, but calendar systems approximate that interval differently.",
    },
    {
      title: "Why do calendars need leap rules?",
      text: "A calendar year made of a whole number of days does not perfectly equal the tropical year. Leap adjustments reduce accumulated seasonal drift.",
    },
    {
      title: "Solar calendars",
      text: "Solar calendars aim to keep calendar dates aligned with Earth's seasons and the annual solar cycle.",
    },
    {
      title: "Lunar calendars",
      text: "Lunar calendars use the synodic month as a primary unit. Without intercalation, a purely lunar year moves through the seasons.",
    },
    {
      title: "Luni-solar calendars",
      text: "Luni-solar systems use lunar months while periodically adding an extra month to maintain approximate seasonal alignment.",
    },
    {
      title: "Astronomical day counts",
      text: "Julian Day provides a numerical bridge that is particularly convenient for astronomy and computational chronology.",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sections.map((section) => (
        <Card key={section.title} title={section.title}>
          <p className="text-sm leading-7 text-gray-400">{section.text}</p>
        </Card>
      ))}
    </div>
  );
};

/* ============================================================================
 * Saved calculations
 * ========================================================================== */

const SavedPanel: React.FC<{
  saved: SavedCalculation[];
  onDelete: (id: string) => void;
  onClear: () => void;
}> = ({ saved, onDelete, onClear }) => (
  <Card
    title="Saved Calculations"
    subtitle="Keep useful results available during your current browser session."
  >
    <div className="mb-5 flex flex-wrap justify-end gap-2">
      <button
        type="button"
        onClick={onClear}
        disabled={!saved.length}
        className="rounded-xl border border-gray-800 px-4 py-2 text-xs font-bold text-gray-300 hover:border-red-700 hover:text-red-300 disabled:opacity-40"
      >
        Clear all
      </button>
    </div>

    {!saved.length ? (
      <div className="rounded-xl border border-dashed border-gray-800 bg-gray-950 p-10 text-center text-sm text-gray-500">
        No saved calculations yet.
      </div>
    ) : (
      <div className="space-y-3">
        {saved.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-xl border border-gray-800 bg-gray-950 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="font-bold text-white">{item.title}</div>
              <div className="mt-1 text-xs text-gray-500">
                {item.type} · {item.createdAt}
              </div>
              <div className="mt-2 text-sm text-indigo-300">{item.value}</div>
            </div>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="rounded-lg border border-gray-800 px-3 py-2 text-xs text-gray-400 hover:border-red-700 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    )}
  </Card>
);

/* ============================================================================
 * Main page
 * ========================================================================== */

const TAB_DEFINITIONS: Array<{
  id: CalculatorTab;
  label: string;
  description: string;
}> = [
  { id: "dashboard", label: "Dashboard", description: "Overview and quick tools" },
  { id: "converter", label: "Converter", description: "Cross-calendar conversion" },
  { id: "difference", label: "Date Difference", description: "Elapsed time" },
  { id: "age", label: "Age", description: "Age and birthday" },
  { id: "countdown", label: "Countdown", description: "Target-date countdown" },
  { id: "leap", label: "Leap Year", description: "Leap-year analysis" },
  { id: "business", label: "Business Days", description: "Working-day count" },
  { id: "julian", label: "Julian Day", description: "Astronomical reference" },
  { id: "systems", label: "Systems", description: "Calendar explorer" },
  { id: "timeline", label: "Timeline", description: "Historical milestones" },
  { id: "education", label: "Learn", description: "Calendar education" },
  { id: "saved", label: "Saved", description: "Saved calculations" },
];

export const YearCountingCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>("dashboard");
  const [selectedDate, setSelectedDate] = useState<SimpleDate>(DEFAULT_DATE);
  const [saved, setSaved] = useState<SavedCalculation[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");

  const selectedSystem = useMemo(
    () => getSystem("ethiopian"),
    [],
  );

  const saveCurrentDate = useCallback(() => {
    const item: SavedCalculation = {
      id: `${Date.now()}-${Math.random()}`,
      title: "Selected date",
      type: "Date",
      value: formatLongDate(selectedDate),
      createdAt: new Date().toLocaleString(),
    };

    setSaved((items) => [item, ...items]);
    setNotice("Calculation saved.");
  }, [selectedDate]);

  const deleteSaved = useCallback((id: string) => {
    setSaved((items) => items.filter((item) => item.id !== id));
  }, []);

  const clearSaved = useCallback(() => {
    setSaved([]);
  }, []);

  const copySelectedDate = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formatDate(selectedDate));
      setNotice("Date copied to clipboard.");
    } catch {
      setNotice("Clipboard access is unavailable in this browser.");
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const renderContent = () => {
    switch (activeTab) {
      case "converter":
        return (
          <ConverterPanel
            date={selectedDate}
            onDateChange={setSelectedDate}
          />
        );

      case "difference":
        return (
          <DifferencePanel
            initialStart={selectedDate}
            initialEnd={addDays(selectedDate, 30)}
          />
        );

      case "age":
        return <AgePanel />;

      case "countdown":
        return <CountdownPanel />;

      case "leap":
        return <LeapYearPanel />;

      case "business":
        return <BusinessDaysPanel />;

      case "julian":
        return <JulianPanel />;

      case "systems":
        return <SystemsPanel />;

      case "timeline":
        return <TimelinePanel />;

      case "education":
        return <EducationPanel />;

      case "saved":
        return (
          <SavedPanel
            saved={saved}
            onDelete={deleteSaved}
            onClear={clearSaved}
          />
        );

      case "dashboard":
      default:
        return (
          <DashboardPanel
            date={selectedDate}
            onTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="sticky top-0 z-30 border-b border-gray-800 bg-gray-950/95 backdrop-blur">
        <div className="mx-auto max-w-[1800px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
                Chronology Lab
              </div>
              <h1 className="mt-1 text-xl font-black text-white sm:text-2xl">
                Year Counting Calculator
              </h1>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <Badge tone="green">
                {selectedSystem.name}
              </Badge>
              <button
                type="button"
                onClick={copySelectedDate}
                className="rounded-xl border border-gray-800 px-3 py-2 text-xs font-bold text-gray-300 hover:border-indigo-600 hover:text-white"
              >
                Copy date
              </button>
              <button
                type="button"
                onClick={saveCurrentDate}
                className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500"
              >
                Save
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowMobileMenu((value) => !value)}
              className="rounded-xl border border-gray-800 px-3 py-2 text-xs text-gray-300 sm:hidden"
            >
              Menu
            </button>
          </div>

          {showMobileMenu && (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:hidden">
              <button
                type="button"
                onClick={copySelectedDate}
                className="rounded-xl border border-gray-800 px-3 py-2 text-xs text-gray-300"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={saveCurrentDate}
                className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-2">
              <div className="mb-4 px-2 text-xs font-bold uppercase tracking-wider text-gray-600">
                Calculator Tools
              </div>

              {TAB_DEFINITIONS.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    activeTab === tab.id
                      ? "border-indigo-500 bg-indigo-950/40 text-white"
                      : "border-transparent bg-gray-900/30 text-gray-400 hover:border-gray-800 hover:bg-gray-900"
                  }`}
                >
                  <div className="text-sm font-bold">{tab.label}</div>
                  <div className="mt-1 text-[11px] text-gray-600">
                    {tab.description}
                  </div>
                </button>
              ))}

              <div className="mt-5 rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                <div className="text-xs font-bold text-white">Supported systems</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SYSTEMS.map((system) => (
                    <Badge key={system.id} tone="gray">
                      {system.name.split(" ")[0]}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            <div className="mb-6 overflow-x-auto lg:hidden">
              <div className="flex gap-2 pb-1">
                {TAB_DEFINITIONS.map((tab) => (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap rounded-xl border px-4 py-2 text-xs font-bold ${
                      activeTab === tab.id
                        ? "border-indigo-500 bg-indigo-950/50 text-white"
                        : "border-gray-800 bg-gray-900 text-gray-400"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {notice && (
              <div className="mb-5 rounded-xl border border-emerald-800 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300">
                {notice}
              </div>
            )}

            {renderContent()}

            <footer className="mt-12 border-t border-gray-800 py-8">
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <div className="font-bold text-white">Year Counting Calculator</div>
                  <p className="mt-2 text-xs leading-6 text-gray-500">
                    A general-purpose educational chronology and date arithmetic
                    workbench. Calendar conversion rules can vary by historical
                    convention, geographic usage and implementation.
                  </p>
                </div>

                <div>
                  <div className="font-bold text-white">Core tools</div>
                  <div className="mt-2 space-y-1 text-xs text-gray-500">
                    <div>Calendar conversion</div>
                    <div>Age and date difference</div>
                    <div>Countdown and business days</div>
                    <div>Julian Day calculation</div>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-white">Supported chronology</div>
                  <div className="mt-2 text-xs leading-6 text-gray-500">
                    Gregorian, Ethiopian, Islamic, Coptic, Persian, Hebrew,
                    Mayan Long Count and Julian Day reference calculations.
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default YearCountingCalculator;