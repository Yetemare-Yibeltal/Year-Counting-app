import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis } from "../lib/redis";

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  passOnStoreError: true, // Allow requests through if Redis is disconnected or fails
  store: new RedisStore({
    // @ts-expect-error - ioredis type compatibility with rate-limit-redis
    sendCommand: (...args: string[]) => {
      if (redis.status !== "ready") {
        return Promise.reject(new Error("Redis store offline"));
      }
      return redis.call(...args);
    },
  }),
});
