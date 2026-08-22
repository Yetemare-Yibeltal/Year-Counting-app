import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis } from "../config/redis";

// Global Rate Limiter: 100 requests per 15 minutes per IP
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
  store: new RedisStore({
    // @ts-expect-error ioredis compatibility with rate-limit-redis types
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: "rl:global:",
  }),
});

// Strict Rate Limiter for Mutations/Auth: 5 requests per 15 minutes
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, please wait 15 minutes." },
  store: new RedisStore({
    // @ts-expect-error ioredis compatibility with rate-limit-redis types
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: "rl:strict:",
  }),
});
