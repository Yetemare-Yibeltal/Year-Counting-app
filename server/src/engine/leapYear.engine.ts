export class LeapYearEngine {
  /**
   * Determines whether a given year is a leap year in the Gregorian calendar.
   */
  public static isLeapYear(year: number): boolean {
    if (isNaN(year) || !Number.isInteger(year)) {
      throw new Error("Year must be a valid integer.");
    }
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  /**
   * Returns total days in a specific year.
   */
  public static getDaysInYear(year: number): number {
    return this.isLeapYear(year) ? 366 : 365;
  }

  /**
   * Returns total days in a specific month for a target year.
   */
  public static getDaysInMonth(year: number, monthIndex: number): number {
    if (monthIndex < 0 || monthIndex > 11) {
      throw new Error("Month index must be between 0 and 11.");
    }
    const daysPerMonth = [
      31,
      this.isLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    return daysPerMonth[monthIndex];
  }
}
