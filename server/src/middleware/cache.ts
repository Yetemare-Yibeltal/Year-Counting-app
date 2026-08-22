import { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";

/**
 * Express middleware to cache GET responses in Redis.
 * @param ttlSeconds Time-to-live in seconds (default: 300 seconds)
 */
export const cacheMiddleware = (ttlSeconds: number = 300) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (req.method !== "GET") {
      next();
      return;
    }

    const cacheKey = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
        res.setHeader("X-Cache", "HIT");
        res.json(JSON.parse(cachedData));
        return;
      }

      res.setHeader("X-Cache", "MISS");

      const originalJson = res.json.bind(res);
      res.json = (body: any): Response => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redis
            .setex(cacheKey, ttlSeconds, JSON.stringify(body))
            .catch((err) => {
              console.error("Failed to write to Redis cache:", err);
            });
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error("Cache middleware error:", error);
      next();
    }
  };
};

/**
 * Helper to purge stale Redis cache keys matching a pattern.
 */
export const invalidateCachePattern = async (
  pattern: string,
): Promise<void> => {
  try {
    const keys = await redis.keys(`cache:${pattern}`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error("Cache invalidation error:", error);
  }
};
