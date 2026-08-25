// src/middleware/cache.ts
import { redis } from "../lib/redis";

export const cacheMiddleware = async (req, res, next) => {
  if (redis.status !== "ready") {
    return next(); // Skip caching gracefully if Redis isn't ready
  }

  try {
    const cachedData = await redis.get(req.originalUrl);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    next();
  } catch (err) {
    next();
  }
};
