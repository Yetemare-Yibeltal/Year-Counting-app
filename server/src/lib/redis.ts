import Redis, { RedisOptions } from "ioredis";

export interface RedisConfigOptions {
  url?: string;
  host?: string;
  port?: number;
  password?: string;
  db?: number;
}

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379", 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;
const REDIS_DB = parseInt(process.env.REDIS_DB || "0", 10);
const REDIS_URL = process.env.REDIS_URL;

const connectionOptions: RedisOptions = REDIS_URL
  ? {
      enableOfflineQueue: false,
      maxRetriesPerRequest: null,
      lazyConnect: false,
      retryStrategy(times: number) {
        const delay = Math.min(times * 100, 3000);
        return delay;
      },
    }
  : {
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD,
      db: REDIS_DB,
      enableOfflineQueue: false,
      maxRetriesPerRequest: null,
      lazyConnect: false,
      retryStrategy(times: number) {
        const delay = Math.min(times * 100, 3000);
        return delay;
      },
    };

const createRedisClient = (): Redis => {
  const client = REDIS_URL
    ? new Redis(REDIS_URL, connectionOptions)
    : new Redis(connectionOptions);

  client.on("connect", () => {
    console.log("[Redis Status] Initiating connection to Redis server...");
  });

  client.on("ready", () => {
    console.log(
      "[Redis Status] Connection established and client is ready for commands.",
    );
  });

  client.on("error", (error: Error) => {
    console.warn(
      `[Redis Warning] Operating in degraded fallback mode. Cause: ${error.message}`,
    );
  });

  client.on("close", () => {
    console.warn("[Redis Status] Client connection closed.");
  });

  client.on("reconnecting", (time: number) => {
    console.log(`[Redis Status] Reconnecting to Redis in ${time}ms...`);
  });

  client.on("end", () => {
    console.warn("[Redis Status] Redis connection has ended.");
  });

  return client;
};

export const redis = createRedisClient();

export const isRedisReady = (): boolean => {
  return redis.status === "ready";
};

export const safeRedisGet = async (key: string): Promise<string | null> => {
  if (!isRedisReady()) {
    return null;
  }
  try {
    return await redis.get(key);
  } catch (error) {
    console.warn(`[Redis Execution Error] GET key "${key}" failed:`, error);
    return null;
  }
};

export const safeRedisSetEx = async (
  key: string,
  seconds: number,
  value: string,
): Promise<boolean> => {
  if (!isRedisReady()) {
    return false;
  }
  try {
    await redis.setex(key, seconds, value);
    return true;
  } catch (error) {
    console.warn(`[Redis Execution Error] SETEX key "${key}" failed:`, error);
    return false;
  }
};

export const safeRedisDel = async (...keys: string[]): Promise<number> => {
  if (!isRedisReady() || keys.length === 0) {
    return 0;
  }
  try {
    return await redis.del(...keys);
  } catch (error) {
    console.warn(
      `[Redis Execution Error] DEL keys "${keys.join(", ")}" failed:`,
      error,
    );
    return 0;
  }
};

export const safeRedisFlushPattern = async (pattern: string): Promise<void> => {
  if (!isRedisReady()) {
    return;
  }
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.warn(
      `[Redis Execution Error] Flush pattern "${pattern}" failed:`,
      error,
    );
  }
};

export default redis;
