export interface YearMetrics {
  year: number;
  dayOfYear: number;
  totalDays: number;
  daysRemaining: number;
  percentageCompleted: number;
  percentageRemaining: number;
  currentQuarter: number;
  quarterProgress: number;
  isLeap: boolean;
}

export interface DetailedDateDiff {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  totalMilliseconds: number;
}

export interface MilestoneItem {
  id: string;
  title: string;
  targetYear: number;
  category: "PERSONAL" | "CAREER" | "LIFE" | "FINANCIAL";
  completed: boolean;
}
