import { rateLimit } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis } from "../lib/redis";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per window
  standardHeaders: "draft-7", // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers

  // Pass request through if Redis fails or is offline
  passOnStoreError: true,

  // Use RedisStore with ioredis instance
  store: new RedisStore({
    // @ts-expect-error - ioredis type compatibility with rate-limit-redis
    sendCommand: (...args: string[]) => {
      // Avoid issuing commands if connection is not ready
      if (redis.status !== "ready") {
        return Promise.reject(new Error("Redis not ready"));
      }
      return redis.call(...args);
    },
  }),
});
