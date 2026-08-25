import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis } from "../lib/redis";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  passOnStoreError: true, // Allow requests through if Redis is offline
  store: new RedisStore({
    // @ts-expect-error - ioredis type compatibility with rate-limit-redis
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: "rl:global:",
  }),
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again later.",
  },
});

export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  passOnStoreError: true, // Allow requests through if Redis is offline
  store: new RedisStore({
    // @ts-expect-error - ioredis type compatibility with rate-limit-redis
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: "rl:strict:",
  }),
  message: {
    status: 429,
    message: "Too many attempts, please try again after 15 minutes.",
  },
});
