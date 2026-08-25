import { Request, Response, NextFunction, RequestHandler } from "express";
import { redis, isRedisReady } from "../lib/redis";

export interface CacheOptions {
  ttlInSeconds: number;
  keyPrefix?: string;
  excludeRoutes?: string[];
}

export interface CachedResponsePayload {
  status: number;
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
}

const buildCacheKey = (req: Request, prefix: string = "cache"): string => {
  const routeUrl = req.originalUrl || req.url;
  return `${prefix}:${req.method}:${routeUrl}`;
};

export const cacheMiddleware = (
  ttlInSeconds: number,
  customPrefix: string = "cache",
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
      return next();
    }

    const key = buildCacheKey(req, customPrefix);

    try {
      const cachedRawData = await redis.get(key);

      if (cachedRawData) {
        const parsedPayload: CachedResponsePayload = JSON.parse(cachedRawData);
        res.status(parsedPayload.status);
        res.setHeader("X-Cache-Status", "HIT");

        if (parsedPayload.headers) {
          Object.entries(parsedPayload.headers).forEach(
            ([headerName, headerValue]) => {
              if (headerValue !== undefined) {
                res.setHeader(headerName, headerValue);
              }
            },
          );
        }

        res.json(parsedPayload.body);
        return;
      }
    } catch (cacheFetchError) {
      console.warn(
        `[Cache Error] Failed reading cache key "${key}":`,
        cacheFetchError,
      );
    }

    res.setHeader("X-Cache-Status", "MISS");

    const originalJson = res.json.bind(res);

    res.json = ((body: unknown): Response => {
      if (res.statusCode >= 200 && res.statusCode < 300 && isRedisReady()) {
        const payloadToCache: CachedResponsePayload = {
          status: res.statusCode,
          headers: {
            "content-type": res.getHeader("content-type") as string | undefined,
          },
          body,
        };

        redis
          .setex(key, ttlInSeconds, JSON.stringify(payloadToCache))
          .catch((cacheSetError) => {
            console.warn(
              `[Cache Error] Failed writing cache key "${key}":`,
              cacheSetError,
            );
          });
      }

      return originalJson(body);
    }) as Response["json"];

    next();
  };
};

export const clearCacheByPattern = async (pattern: string): Promise<number> => {
  if (!isRedisReady()) {
    return 0;
  }

  try {
    const matchedKeys = await redis.keys(pattern);
    if (matchedKeys.length > 0) {
      const deletedCount = await redis.del(...matchedKeys);
      return deletedCount;
    }
    return 0;
  } catch (error) {
    console.warn(
      `[Cache Invalidation Error] Failed deleting keys for pattern "${pattern}":`,
      error,
    );
    return 0;
  }
};

export const invalidateRouteCache = (routePrefix: string): RequestHandler => {
  return async (
    _req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (isRedisReady()) {
      const pattern = `cache:GET:${routePrefix}*`;
      await clearCacheByPattern(pattern);
    }
    next();
  };
};
