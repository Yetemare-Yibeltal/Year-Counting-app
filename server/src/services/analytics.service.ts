export interface LifeExpectancyMetrics {
  birthDate: string;
  targetAge: number;
  currentAgeYears: number;
  lifePercentageElapsed: number;
  totalDaysLived: number;
  estimatedDaysRemaining: number;
  estimatedSleepHoursSpent: number;
  estimatedWorkHoursSpent: number;
}

export class AnalyticsService {
  public static calculateLifeMetrics(
    birthDateStr: string,
    targetAge: number = 80,
  ): LifeExpectancyMetrics {
    const birth = new Date(birthDateStr);
    const now = new Date();

    const ageMs = now.getTime() - birth.getTime();
    const totalDaysLived = Math.floor(ageMs / (1000 * 60 * 60 * 24));
    const currentAgeYears = Number((totalDaysLived / 365.25).toFixed(2));

    const targetDays = targetAge * 365.25;
    const lifePercentageElapsed = Number(
      ((totalDaysLived / targetDays) * 100).toFixed(4),
    );
    const estimatedDaysRemaining = Math.max(
      0,
      Math.floor(targetDays - totalDaysLived),
    );

    const totalHoursLived = totalDaysLived * 24;
    const estimatedSleepHoursSpent = Math.floor(totalHoursLived * (8 / 24));
    const estimatedWorkHoursSpent = Math.floor(
      totalHoursLived * (8 / 24) * (5 / 7),
    );

    return {
      birthDate: birthDateStr,
      targetAge,
      currentAgeYears,
      lifePercentageElapsed: Math.min(100, lifePercentageElapsed),
      totalDaysLived,
      estimatedDaysRemaining,
      estimatedSleepHoursSpent,
      estimatedWorkHoursSpent,
    };
  }
}
