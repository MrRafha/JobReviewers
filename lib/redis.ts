import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("Missing REDIS_URL environment variable");
}

const globalForRedis = global as typeof globalThis & {
  redis?: Redis;
};

export const redis =
  globalForRedis.redis ??
  new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true,
    enableOfflineQueue: false,
    retryStrategy(times) {
      return Math.min(times * 50, 2000);
    },
  });

redis.on("error", (error) => {
  console.error("[Redis] connection error:", error);
});

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
