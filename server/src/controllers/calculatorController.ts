import { Request, Response } from "express";

export const calculateTimeDifference = (req: Request, res: Response): void => {
  const { startYear, endYear } = req.body;

  if (!startYear || !endYear || isNaN(Number(startYear)) || isNaN(Number(endYear))) {
    res.status(400).json({ error: "Please provide valid numeric startYear and endYear." });
    return;
  }

  const start = Number(startYear);
  const end = Number(endYear);
  const diffYears = Math.abs(end - start);
  const diffDays = diffYears * 365.25;

  res.status(200).json({
    startYear: start,
    endYear: end,
    years: diffYears,
    totalDays: Math.floor(diffDays),
    totalHours: Math.floor(diffDays * 24),
  });
};
