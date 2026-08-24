import { Request, Response } from "express";

export const getSystemSpecs = (req: Request, res: Response): void => {
  const memoryUsage = process.memoryUsage();
  
  res.status(200).json({
    status: "healthy",
    engine: "Active",
    uptimeSeconds: Math.floor(process.uptime()),
    memory: {
      heapUsedMB: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
      heapTotalMB: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
    },
    timestamp: new Date().toISOString(),
  });
};
