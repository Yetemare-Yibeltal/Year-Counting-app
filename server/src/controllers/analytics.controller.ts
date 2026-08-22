import { Request, Response } from "express";
import { YearProgressEngine } from "../engine/yearProgress.engine";
import { DateDiffEngine } from "../engine/dateDiff.engine";
import { DateValidator } from "../validators/date.validator";
import { ResponseUtil } from "../utils/response.util";

export class AnalyticsController {
  public static getYearProgress(req: Request, res: Response): void {
    const targetDate = req.query.date
      ? new Date(req.query.date as string)
      : new Date();
    const metrics = YearProgressEngine.calculate(targetDate);
    ResponseUtil.success(
      res,
      metrics,
      "Year progress calculated successfully.",
    );
  }

  public static calculateDateDiff(req: Request, res: Response): void {
    const { startDate, endDate } = req.body;
    const validation = DateValidator.validateRange(startDate, endDate);

    if (!validation.valid) {
      ResponseUtil.error(
        res,
        validation.error || "Invalid date arguments.",
        400,
      );
      return;
    }

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diff = DateDiffEngine.calculateDiff(start, end);

    ResponseUtil.success(res, diff, "Date diff calculated successfully.");
  }
}

