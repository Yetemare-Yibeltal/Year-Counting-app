import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  showFriendlyErrorStack: true,
  retryStrategy(times) {
    // Stop reconnecting attempts immediately when offline
    return null;
  },
});

redisClient.on("error", (err) => {
  // Gracefully log warning without letting the error bubble up to crash Node
  console.warn("⚠️ Redis offline. Cache layer bypassed.");
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis successfully.");
});

export default redisClient;
