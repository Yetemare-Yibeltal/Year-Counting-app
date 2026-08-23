import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/auth";
import { ApiResponse } from "../utils/apiResponse";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    ApiResponse.unauthorized(res, "Access token missing or malformed");
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    ApiResponse.forbidden(res, "Invalid or expired access token");
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      ApiResponse.unauthorized(res, "Authentication required");
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      ApiResponse.forbidden(res, "Forbidden: insufficient permissions");
      return;
    }

    next();
  };
};
