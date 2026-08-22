export interface EthiopianDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
}

export class CalendarService {
  private static ethMonthNames = [
    "Meskerem",
    "Tikimt",
    "Hidar",
    "Tahsas",
    "Tir",
    "Yakatit",
    "Magabit",
    "Miyazya",
    "Ginbot",
    "Sene",
    "Hamle",
    "Nehase",
    "Pagume",
  ];

  public static toEthiopian(gregorianDate: Date): EthiopianDate {
    const year = gregorianDate.getFullYear();
    const month = gregorianDate.getMonth() + 1;
    const day = gregorianDate.getDate();

    let ethYear = year - 8;
    const isNextEthYear = month > 9 || (month === 9 && day >= 11);
    if (isNextEthYear) {
      ethYear = year - 7;
    }

    const newYearDay = (ethYear + 1) % 4 === 0 ? 12 : 11;
    let ethMonth = 0;
    let ethDay = 0;

    const startOfEthYear = new Date(
      year - (isNextEthYear ? 0 : 1),
      8,
      newYearDay,
    );
    const diffDays = Math.floor(
      (gregorianDate.getTime() - startOfEthYear.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (diffDays >= 0) {
      ethMonth = Math.floor(diffDays / 30) + 1;
      ethDay = (diffDays % 30) + 1;
    } else {
      const prevEthYearNewYear = new Date(
        year - 1,
        8,
        ethYear % 4 === 0 ? 12 : 11,
      );
      const pastDiff = Math.floor(
        (gregorianDate.getTime() - prevEthYearNewYear.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      ethMonth = Math.floor(pastDiff / 30) + 1;
      ethDay = (pastDiff % 30) + 1;
    }

    return {
      year: ethYear,
      month: Math.min(ethMonth, 13),
      day: ethDay,
      monthName:
        CalendarService.ethMonthNames[Math.min(ethMonth - 1, 12)] || "Meskerem",
    };
  }
}
