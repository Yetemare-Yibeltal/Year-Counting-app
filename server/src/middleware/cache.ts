import { Request, Response, NextFunction } from "express";
import { redis } from "../lib/redis";

export const cacheMiddleware = (keyPrefix: string, ttlSeconds = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Construct cache key based on route parameters or query strings
    const cacheKey = `${keyPrefix}:${req.originalUrl || req.url}`;

    try {
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
        res.setHeader("X-Cache", "HIT");
        return res.json(JSON.parse(cachedData));
      }

      res.setHeader("X-Cache", "MISS");

      // Intercept res.json to capture response payload and write to Redis
      const originalJson = res.json.bind(res);
      res.json = (body: unknown) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redis
            .setex(cacheKey, ttlSeconds, JSON.stringify(body))
            .catch((err) => {
              console.error("Redis set cache error:", err);
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
