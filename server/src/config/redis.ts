import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  retryStrategy() {
    return null; // Stop retrying immediately if Redis is unreachable
  },
});

redisClient.on("error", () => {
  // Silent fallback for development
});
