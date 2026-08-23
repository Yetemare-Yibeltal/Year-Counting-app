import { Response } from "express";

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponsePayload<T> {
  success: true;
  statusCode: number;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export class ApiResponse {
  public static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode = 200,
  ): Response<ApiResponsePayload<T>> {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
    });
  }

  public static created<T>(
    res: Response,
    data: T,
    message = "Resource created successfully",
  ): Response<ApiResponsePayload<T>> {
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message,
      data,
    });
  }

  public static paginated<T>(
    res: Response,
    data: T[],
    meta: PaginationMeta,
    message?: string,
    statusCode = 200,
  ): Response<ApiResponsePayload<T[]>> {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      meta,
    });
  }

  public static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
