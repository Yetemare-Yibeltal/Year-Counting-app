import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export const redisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  retryStrategy(times) {
    if (times > 1) {
      return null;
    }
    return 2000;
  },
});

redisClient.on('error', () => {
  console.warn('⚠️ Redis offline — bypassing cache layer.');
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis cache service.');
});
