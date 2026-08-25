import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  showFriendlyErrorStack: true,
  retryStrategy() {
    // Stop reconnecting attempts immediately when offline
    return null;
  },
});

redis.on("error", () => {
  // Graceful handling to prevent Node process from crashing
});

redis.on("connect", () => {
  console.log("✅ Connected to Redis successfully.");
});

export default redis;
