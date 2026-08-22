import { Request, Response, NextFunction } from "express";
import { Logger } from "../utils/logger.util";
import { ResponseUtil } from "../utils/response.util";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  Logger.error(
    `Unhandled Exception on ${req.method} ${req.url}: ${err.message}`,
  );
  ResponseUtil.error(
    res,
    err.message || "Internal server error occurred.",
    500,
  );
};
