import { Request, Response, NextFunction, RequestHandler } from "express";
import { rateLimit, Options } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis, isRedisReady } from "../lib/redis";

export interface RateLimiterOptions {
  windowMs?: number;
  limit?: number;
  message?: string;
}

const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_LIMIT = 100;

export const createCustomRateLimiter = (
  options?: RateLimiterOptions,
): RequestHandler => {
  const windowMs = options?.windowMs || DEFAULT_WINDOW_MS;
  const limit = options?.limit || DEFAULT_LIMIT;

  const redisStore = new RedisStore({
    // @ts-expect-error - ioredis type compatibility with rate-limit-redis
    sendCommand: (...args: string[]) => {
      if (!isRedisReady()) {
        return Promise.reject(
          new Error("Redis store unavailable - bypassing rate limiter"),
        );
      }
      return redis.call(...args);
    },
  });

  const limiterOptions: Partial<Options> = {
    windowMs,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    passOnStoreError: true,
    store: redisStore,
    handler: (
      req: Request,
      res: Response,
      _next: NextFunction,
      options: Options,
    ) => {
      res.status(options.statusCode).json({
        status: "error",
        statusCode: options.statusCode,
        message:
          options.message || "Too many requests, please try again later.",
      });
    },
    skip: (_req: Request) => {
      return false;
    },
  };

  return rateLimit(limiterOptions);
};

export const globalLimiter = createCustomRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

export const authLimiter = createCustomRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 15,
});

export const apiRateLimiter = globalLimiter;

export default globalLimiter;
