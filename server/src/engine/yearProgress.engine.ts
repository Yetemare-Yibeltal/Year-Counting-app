import { LeapYearEngine } from "./leapYear.engine";
import { TIME_CONSTANTS } from "../constants/time.constants";

export interface ProgressResult {
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

export class YearProgressEngine {
  public static calculate(targetDate: Date = new Date()): ProgressResult {
    const year = targetDate.getFullYear();
    const isLeap = LeapYearEngine.isLeapYear(year);
    const totalDays = LeapYearEngine.getDaysInYear(year);

    const startOfYear = new Date(year, 0, 1, 0, 0, 0, 0);
    const endOfYear = new Date(year + 1, 0, 1, 0, 0, 0, 0);

    const elapsedMs = targetDate.getTime() - startOfYear.getTime();
    const totalMsInYear = endOfYear.getTime() - startOfYear.getTime();

    const rawPercentage = (elapsedMs / totalMsInYear) * 100;
    const percentageCompleted = Number(
      Math.max(0, Math.min(100, rawPercentage)).toFixed(7),
    );
    const percentageRemaining = Number((100 - percentageCompleted).toFixed(7));

    const dayOfYear = Math.floor(elapsedMs / (1000 * 60 * 60 * 24)) + 1;
    const daysRemaining = totalDays - dayOfYear;

    const currentQuarter =
      Math.floor(targetDate.getMonth() / TIME_CONSTANTS.MONTHS_PER_QUARTER) + 1;
    const qStartMonth =
      (currentQuarter - 1) * TIME_CONSTANTS.MONTHS_PER_QUARTER;
    const startOfQuarter = new Date(year, qStartMonth, 1);
    const endOfQuarter = new Date(year, qStartMonth + 3, 1);
    const quarterElapsed = targetDate.getTime() - startOfQuarter.getTime();
    const quarterTotal = endOfQuarter.getTime() - startOfQuarter.getTime();
    const quarterProgress = Number(
      ((quarterElapsed / quarterTotal) * 100).toFixed(4),
    );

    return {
      year,
      dayOfYear,
      totalDays,
      daysRemaining,
      percentageCompleted,
      percentageRemaining,
      currentQuarter,
      quarterProgress,
      isLeap,
    };
  }
}
