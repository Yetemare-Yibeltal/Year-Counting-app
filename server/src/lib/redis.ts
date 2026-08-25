// src/lib/redis.ts
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redis = new Redis(redisUrl, {
  enableOfflineQueue: false, // Prevents commands from piling up when offline
  maxRetriesPerRequest: null, // Stops ioredis from throwing MaxRetriesPerRequestError
  retryStrategy(times) {
    return Math.min(times * 100, 3000); // Retries connection silently in background
  },
});

redis.on("error", (err) => {
  // Log once gracefully without breaking the app flow
  console.warn("⚠️ Redis disconnected - operating in fallback mode.");
});

redis.on("connect", () => {
  console.log("⚡ Redis connection established.");
});

export default redis;
