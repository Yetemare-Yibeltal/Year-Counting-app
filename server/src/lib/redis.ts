import Redis, { RedisOptions, RedisKey, RedisValue } from "ioredis";

export interface RedisHealthStatus {
  status: "connected" | "disconnected" | "error";
  latencyMs: number | null;
  errorDetail?: string;
}

const REDIS_HOST: string = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT: number = parseInt(process.env.REDIS_PORT || "6379", 10);
const REDIS_PASSWORD: string | undefined =
  process.env.REDIS_PASSWORD || undefined;
const REDIS_DB: number = parseInt(process.env.REDIS_DB || "0", 10);
const REDIS_URL: string | undefined = process.env.REDIS_URL;

const connectionOptions: RedisOptions = REDIS_URL
  ? {
      enableOfflineQueue: false,
      maxRetriesPerRequest: null,
      lazyConnect: false,
      retryStrategy(times: number) {
        return Math.min(times * 1000, 10000);
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
        return Math.min(times * 1000, 10000);
      },
    };

const createRedisClient = (): Redis => {
  const client = REDIS_URL
    ? new Redis(REDIS_URL, connectionOptions)
    : new Redis(connectionOptions);

  client.on("ready", () => {
    console.log("[Redis] Client connected and ready.");
  });

  client.on("error", (_error: Error) => {
    // Silent catch during offline retry cycles to avoid process noise
  });

  return client;
};

export const redis = createRedisClient();

export const isRedisReady = (): boolean => {
  return redis.status === "ready";
};

export const safeRedisGet = async (key: RedisKey): Promise<string | null> => {
  if (!isRedisReady()) return null;
  try {
    return await redis.get(key);
  } catch {
    return null;
  }
};

export const safeRedisSetEx = async (
  key: RedisKey,
  seconds: number,
  value: RedisValue,
): Promise<boolean> => {
  if (!isRedisReady()) return false;
  try {
    await redis.setex(key, seconds, value);
    return true;
  } catch {
    return false;
  }
};

export const safeRedisDel = async (...keys: RedisKey[]): Promise<number> => {
  if (!isRedisReady() || keys.length === 0) return 0;
  try {
    return await redis.del(...keys);
  } catch {
    return 0;
  }
};

export const safeRedisFlushPattern = async (
  pattern: string,
): Promise<number> => {
  if (!isRedisReady()) return 0;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      return await redis.del(...keys);
    }
    return 0;
  } catch {
    return 0;
  }
};

export const checkRedisHealth = async (): Promise<RedisHealthStatus> => {
  if (!isRedisReady()) {
    return { status: "disconnected", latencyMs: null };
  }
  const startTime = Date.now();
  try {
    const pingResult = await redis.ping();
    const latencyMs = Date.now() - startTime;
    if (pingResult === "PONG") {
      return { status: "connected", latencyMs };
    }
    return {
      status: "error",
      latencyMs,
      errorDetail: "Invalid response from Redis server",
    };
  } catch (error) {
    return {
      status: "disconnected",
      latencyMs: Date.now() - startTime,
      errorDetail: error instanceof Error ? error.message : String(error),
    };
  }
};

export default redis;
