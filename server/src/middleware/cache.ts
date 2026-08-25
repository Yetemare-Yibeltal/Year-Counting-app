import { Request, Response, NextFunction } from "express";
import { redis } from "../lib/redis";

export const cacheMiddleware = (keyPrefix: string, ttlSeconds = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Bypass cache immediately if Redis is not connected
    if (redis.status !== "ready") {
      return next();
    }

    const cacheKey = `${keyPrefix}:${req.originalUrl || req.url}`;

    try {
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
        res.setHeader("X-Cache", "HIT");
        return res.json(JSON.parse(cachedData));
      }

      res.setHeader("X-Cache", "MISS");

      const originalJson = res.json.bind(res);
      res.json = (body: unknown) => {
        if (
          res.statusCode >= 200 &&
          res.statusCode < 300 &&
          redis.status === "ready"
        ) {
          redis.setex(cacheKey, ttlSeconds, JSON.stringify(body)).catch(() => {
            // Ignore write errors if offline
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

export const invalidateCachePattern = async (pattern: string) => {
  if (redis.status !== "ready") return;

  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(
        `🧹 Invalidated ${keys.length} cache keys matching pattern: ${pattern}`,
      );
    }
  } catch (error) {
    console.error("Cache invalidation error:", error);
  }
};
