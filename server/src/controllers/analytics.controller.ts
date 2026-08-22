import { Request, Response } from "express";
import { CalendarService } from "../services/calendar.service";
import { AnalyticsService } from "../services/analytics.service";

export class AnalyticsController {
  public static getCalendarConversions(req: Request, res: Response): void {
    const dateParam = req.query.date
      ? new Date(req.query.date as string)
      : new Date();
    const ethiopian = CalendarService.toEthiopian(dateParam);
    const unixTimestamp = Math.floor(dateParam.getTime() / 1000);

    res.json({
      gregorianISO: dateParam.toISOString(),
      unixTimestamp,
      ethiopian,
    });
  }

  public static getLifeAnalytics(req: Request, res: Response): void {
    const birthDate = (req.query.birthDate as string) || "2000-01-01";
    const targetAge = Number(req.query.targetAge) || 80;

    const metrics = AnalyticsService.calculateLifeMetrics(birthDate, targetAge);
    res.json(metrics);
  }
}
