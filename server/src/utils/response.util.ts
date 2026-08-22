import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export class ResponseUtil {
  public static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode = 200,
  ): void {
    const payload: ApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    res.status(statusCode).json(payload);
  }

  public static error(res: Response, error: string, statusCode = 400): void {
    const payload: ApiResponse = {
      success: false,
      error,
      timestamp: new Date().toISOString(),
    };
    res.status(statusCode).json(payload);
  }
}
