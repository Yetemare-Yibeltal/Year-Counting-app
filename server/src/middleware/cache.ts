import { Request, Response, NextFunction, RequestHandler } from "express";
import { redis, isRedisReady, safeRedisFlushPattern } from "../lib/redis";

export interface CachedResponseStructure {
  status: number;
  contentType?: string;
  body: unknown;
  cachedAt: string;
}

const generateCacheKey = (req: Request, prefix: string = "cache"): string => {
  const urlPath = req.originalUrl || req.url;
  return `${prefix}:${req.method}:${urlPath}`;
};

export const cacheMiddleware = (
  ttlInSeconds: number,
  prefix: string = "cache",
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (req.method !== "GET") {
      return next();
    }

    if (!isRedisReady()) {
      res.setHeader("X-Cache-Status", "BYPASS-OFFLINE");
      return next();
    }

    const key = generateCacheKey(req, prefix);

    try {
      const cachedContent = await redis.get(key);

      if (cachedContent) {
        const parsedPayload: CachedResponseStructure =
          JSON.parse(cachedContent);
        res.setHeader("X-Cache-Status", "HIT");
        if (parsedPayload.contentType) {
          res.setHeader("Content-Type", parsedPayload.contentType);
        }
        res.status(parsedPayload.status).json(parsedPayload.body);
        return;
      }
    } catch (readError) {
      console.warn(
        `[Cache Error] Failed reading cache key "${key}":`,
        readError,
      );
    }

    res.setHeader("X-Cache-Status", "MISS");

    const originalJson = res.json.bind(res);

    res.json = ((data: unknown): Response => {
      if (res.statusCode >= 200 && res.statusCode < 300 && isRedisReady()) {
        const payloadToCache: CachedResponseStructure = {
          status: res.statusCode,
          contentType: res.getHeader("content-type") as string | undefined,
          body: data,
          cachedAt: new Date().toISOString(),
        };

        redis
          .setex(key, ttlInSeconds, JSON.stringify(payloadToCache))
          .catch((writeError) => {
            console.warn(
              `[Cache Error] Failed writing cache key "${key}":`,
              writeError,
            );
          });
      }

      return originalJson(data);
    }) as Response["json"];

    next();
  };
};

export const clearCacheByPattern = async (pattern: string): Promise<number> => {
  return await safeRedisFlushPattern(pattern);
};

export const invalidateRouteCache = (routePrefix: string): RequestHandler => {
  return async (
    _req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (isRedisReady()) {
      const targetPattern = `cache:GET:${routePrefix}*`;
      await clearCacheByPattern(targetPattern);
    }
    next();
  };
};

export default cacheMiddleware;
