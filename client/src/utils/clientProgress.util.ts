import { YearMetrics } from "../types/time.types";

export class ClientProgressUtil {
  public static calculateLive(now: Date = new Date()): YearMetrics {
    const year = now.getFullYear();
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const totalDays = isLeap ? 366 : 365;

    const startOfYear = new Date(year, 0, 1, 0, 0, 0, 0);
    const endOfYear = new Date(year + 1, 0, 1, 0, 0, 0, 0);

    const elapsedMs = now.getTime() - startOfYear.getTime();
    const totalMsInYear = endOfYear.getTime() - startOfYear.getTime();

    const percentageCompleted = Number(
      ((elapsedMs / totalMsInYear) * 100).toFixed(7),
    );
    const percentageRemaining = Number((100 - percentageCompleted).toFixed(7));

    const dayOfYear = Math.floor(elapsedMs / (1000 * 60 * 60 * 24)) + 1;
    const daysRemaining = totalDays - dayOfYear;

    const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
    const qStart = new Date(year, (currentQuarter - 1) * 3, 1);
    const qEnd = new Date(year, currentQuarter * 3, 1);
    const quarterElapsed = now.getTime() - qStart.getTime();
    const quarterTotal = qEnd.getTime() - qStart.getTime();
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
