import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  lazyConnect: true,
});

redisClient.on("error", () => {
  // Redis is optional during local development.
});

export const connectRedis = async (): Promise<boolean> => {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected");
    return true;
  } catch {
    console.warn("⚠️ Redis unavailable — continuing without Redis");
    return false;
  }
};
