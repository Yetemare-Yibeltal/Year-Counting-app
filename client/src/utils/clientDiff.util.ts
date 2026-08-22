import { DetailedDateDiff } from "../types/time.types";

export class ClientDiffUtil {
  public static calculateDiff(
    startDate: Date,
    endDate: Date = new Date(),
  ): DetailedDateDiff {
    let start = new Date(startDate);
    let end = new Date(endDate);

    if (start.getTime() > end.getTime()) {
      const temp = start;
      start = end;
      end = temp;
    }

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    let hours = end.getHours() - start.getHours();
    let minutes = end.getMinutes() - start.getMinutes();
    let seconds = end.getSeconds() - start.getSeconds();
    let milliseconds = end.getMilliseconds() - start.getMilliseconds();

    if (milliseconds < 0) {
      milliseconds += 1000;
      seconds--;
    }
    if (seconds < 0) {
      seconds += 60;
      minutes--;
    }
    if (minutes < 0) {
      minutes += 60;
      hours--;
    }
    if (hours < 0) {
      hours += 24;
      days--;
    }
    if (days < 0) {
      const prevMonthYear =
        end.getMonth() === 0 ? end.getFullYear() - 1 : end.getFullYear();
      const prevMonthIndex = end.getMonth() === 0 ? 11 : end.getMonth() - 1;
      const daysInPrevMonth = new Date(
        prevMonthYear,
        prevMonthIndex + 1,
        0,
      ).getDate();
      days += daysInPrevMonth;
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }

    const totalMilliseconds = end.getTime() - start.getTime();
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    return {
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      totalMilliseconds,
    };
  }
}
