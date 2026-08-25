import Redis, { RedisOptions, RedisKey, RedisValue } from "ioredis";

export interface RedisConfigOptions {
  url?: string;
  host?: string;
  port?: number;
  password?: string;
  db?: number;
}

export interface RedisHealthStatus {
  status: "connected" | "disconnected" | "reconnecting" | "error";
  latencyMs: number | null;
  uptimeSeconds: number | null;
  connectedClients: number | null;
  memoryUsedHuman: string | null;
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
    console.log("[Redis Engine] Connection handshake initiated.");
  });

  client.on("ready", () => {
    console.log("[Redis Engine] Ready to execute commands.");
  });

  client.on("error", (error: Error) => {
    console.warn(
      `[Redis Engine Warning] Offline or degraded: ${error.message}`,
    );
  });

  client.on("close", () => {
    console.warn("[Redis Engine] Connection closed.");
  });

  client.on("reconnecting", (delay: number) => {
    console.log(`[Redis Engine] Reconnecting in ${delay}ms...`);
  });

  client.on("end", () => {
    console.warn("[Redis Engine] Connection terminated.");
  });

  return client;
};

export const redis = createRedisClient();

export const isRedisReady = (): boolean => {
  return redis.status === "ready";
};

export const safeRedisGet = async (key: RedisKey): Promise<string | null> => {
  if (!isRedisReady()) {
    return null;
  }
  try {
    return await redis.get(key);
  } catch (error) {
    console.warn(
      `[Redis Safe Get Error] Failed for key "${String(key)}":`,
      error,
    );
    return null;
  }
};

export const safeRedisSetEx = async (
  key: RedisKey,
  seconds: number,
  value: RedisValue,
): Promise<boolean> => {
  if (!isRedisReady()) {
    return false;
  }
  try {
    await redis.setex(key, seconds, value);
    return true;
  } catch (error) {
    console.warn(
      `[Redis Safe SetEx Error] Failed for key "${String(key)}":`,
      error,
    );
    return false;
  }
};

export const safeRedisDel = async (...keys: RedisKey[]): Promise<number> => {
  if (!isRedisReady() || keys.length === 0) {
    return 0;
  }
  try {
    return await redis.del(...keys);
  } catch (error) {
    console.warn(
      `[Redis Safe Del Error] Failed for keys "${keys.join(", ")}":`,
      error,
    );
    return 0;
  }
};

export const safeRedisFlushPattern = async (
  pattern: string,
): Promise<number> => {
  if (!isRedisReady()) {
    return 0;
  }
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      return await redis.del(...keys);
    }
    return 0;
  } catch (error) {
    console.warn(
      `[Redis Safe Flush Error] Failed for pattern "${pattern}":`,
      error,
    );
    return 0;
  }
};

export const getRedisHealth = async (): Promise<RedisHealthStatus> => {
  if (!isRedisReady()) {
    return {
      status: "disconnected",
      latencyMs: null,
      uptimeSeconds: null,
      connectedClients: null,
      memoryUsedHuman: null,
    };
  }

  const startTime = Date.now();
  try {
    const pingResult = await redis.ping();
    const latencyMs = Date.now() - startTime;

    if (pingResult !== "PONG") {
      return {
        status: "error",
        latencyMs,
        uptimeSeconds: null,
        connectedClients: null,
        memoryUsedHuman: null,
        errorDetail: "Ping did not return PONG response",
      };
    }

    const info = await redis.info();
    const uptimeMatch = info.match(/uptime_in_seconds:(\d+)/);
    const clientsMatch = info.match(/connected_clients:(\d+)/);
    const memoryMatch = info.match(/used_memory_human:(.+)/);

    return {
      status: "connected",
      latencyMs,
      uptimeSeconds: uptimeMatch ? parseInt(uptimeMatch[1], 10) : null,
      connectedClients: clientsMatch ? parseInt(clientsMatch[1], 10) : null,
      memoryUsedHuman: memoryMatch ? memoryMatch[1].trim() : null,
    };
  } catch (error) {
    return {
      status: "error",
      latencyMs: Date.now() - startTime,
      uptimeSeconds: null,
      connectedClients: null,
      memoryUsedHuman: null,
      errorDetail: error instanceof Error ? error.message : String(error),
    };
  }
};

export default redis;
