```ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import { rateLimit, Options } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis, isRedisReady } from "../lib/redis";

export interface CustomRateLimiterConfig {
  windowMs?: number;
  limit?: number;
  message?: string;
  statusCode?: number;
}

const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_LIMIT = 100;

export const createCustomRateLimiter = (
  config?: CustomRateLimiterConfig
): RequestHandler => {
  const windowMs = config?.windowMs ?? DEFAULT_WINDOW_MS;
  const limit = config?.limit ?? DEFAULT_LIMIT;
  const statusCode = config?.statusCode ?? 429;
  const customMessage =
    config?.message ?? "Too many requests. Please try again later.";

  const redisStore = new RedisStore({
    sendCommand: async (...args: string[]): Promise<any> => {
      if (!isRedisReady()) {
        throw new Error("Redis store offline");
      }

      const [command, ...commandArgs] = args;

      if (!command) {
        throw new Error("Redis command is missing");
      }

      return redis.call(
        command,
        ...(commandArgs as string[])
      );
    },
  });

  const limiterOptions: Partial<Options> = {
    windowMs,
    limit,

    standardHeaders: "draft-7",
    legacyHeaders: false,

    // Allow requests to continue if Redis is unavailable.
    passOnStoreError: true,

    store: redisStore,

    keyGenerator: (req: Request): string => {
      return req.ip || req.socket.remoteAddress || "unknown-client";
    },

    handler: (
      _req: Request,
      res: Response,
      _next: NextFunction,
      options: Options
    ) => {
      const responseStatusCode = options.statusCode ?? statusCode;

      res.status(responseStatusCode).json({
        status: "error",
        statusCode: responseStatusCode,
        message: customMessage,
        retryAfterSeconds: Math.ceil(options.windowMs / 1000),
      });
    },
  };

  return rateLimit(limiterOptions);
};

export const globalLimiter = createCustomRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Global rate limit exceeded. Try again in 15 minutes.",
});

export const authLimiter = createCustomRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: "Too many authentication attempts. Please wait 15 minutes.",
});

export const apiRateLimiter = globalLimiter;

export default globalLimiter;
```;
