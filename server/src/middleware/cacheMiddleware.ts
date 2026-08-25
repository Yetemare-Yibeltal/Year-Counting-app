import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';

export const cacheMiddleware = (duration: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (redisClient.status !== 'ready') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        res.setHeader('X-Cache', 'HIT');
        res.json(JSON.parse(cachedData));
        return;
      }
    } catch {
      return next();
    }
    next();
  };
};
