import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // Required if using Bull/BullMQ or to prevent crash on retry limit
  enableOfflineQueue: false, // Do not queue commands if connection fails
  retryStrategy(times) {
    // Stop reconnecting after 3 failed attempts
    if (times > 3) {
      return null;
    }
    return 2000;
  },
});

redisClient.on("error", (err) => {
  console.warn(
    "⚠️ Redis connection failed. Operating in offline/fallback mode.",
  );
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis successfully.");
});
