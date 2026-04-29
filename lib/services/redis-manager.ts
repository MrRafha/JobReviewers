import crypto from "crypto";

import { redis } from "@/lib/redis";

const REVIEW_RATE_LIMIT_WINDOW_SECONDS = 60 * 60;
const IP_ATTEMPT_WINDOW_SECONDS = 10 * 60;
const IP_ATTEMPT_LIMIT = 20;

const getUserRateLimitKey = (userId: string) => `rl:review:${userId}`;
const getIpRateLimitKey = (ipHash: string) => `rl:review:ip:${ipHash}`;
const getSpamSetKey = (userId: string) => `spam:review:${userId}`;

export function hashIp(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 12);
}

const safeRedisCall = async <T>(
  callback: () => Promise<T>,
  fallback: T
): Promise<T> => {
  try {
    return await callback();
  } catch (error) {
    console.error("[Redis] command failed:", error);
    return fallback;
  }
};

export type RateLimitCheckResult = {
  allowed: boolean;
  reason?: "REVIEW_LIMIT_EXCEEDED" | "FLOOD_DETECTED";
  retryAfter?: number;
  ip?: string;
};

export async function checkRateLimit(userId: string, ip: string) {
  const userKey = getUserRateLimitKey(userId);
  const ipKey = getIpRateLimitKey(hashIp(ip));

  const [userCountRaw, userTTL] = await Promise.all([
    safeRedisCall(() => redis.get(userKey), null),
    safeRedisCall(() => redis.ttl(userKey), -1),
  ]);

  const ipCount = await safeRedisCall(() => redis.incr(ipKey), 0);
  if (ipCount === 1) {
    await safeRedisCall(
      () => redis.expire(ipKey, IP_ATTEMPT_WINDOW_SECONDS),
      0
    );
  }

  const ipTTL = await safeRedisCall(() => redis.ttl(ipKey), -1);
  const userCount = Number(userCountRaw ?? "0");

  if (userCount >= 1) {
    return {
      allowed: false,
      reason: "REVIEW_LIMIT_EXCEEDED" as const,
      retryAfter: userTTL > 0 ? userTTL : REVIEW_RATE_LIMIT_WINDOW_SECONDS,
      ip,
    };
  }

  if (ipCount > IP_ATTEMPT_LIMIT) {
    return {
      allowed: false,
      reason: "FLOOD_DETECTED" as const,
      retryAfter: ipTTL > 0 ? ipTTL : IP_ATTEMPT_WINDOW_SECONDS,
      ip,
    };
  }

  return {
    allowed: true,
    ip,
  };
}

export async function recordReviewAttempt(userId: string, ip: string) {
  const key = getUserRateLimitKey(userId);
  const count = await safeRedisCall(() => redis.incr(key), 0);

  if (count === 1) {
    await safeRedisCall(
      () => redis.expire(key, REVIEW_RATE_LIMIT_WINDOW_SECONDS),
      0
    );
  }
}

export async function recordSpamReviewHash(userId: string, reviewHash: string) {
  const key = getSpamSetKey(userId);
  const added = await safeRedisCall(() => redis.sadd(key, reviewHash), 0);

  if (added === 1) {
    await safeRedisCall(() => redis.expire(key, 24 * 60 * 60), 0);
  }
}

export async function getTTLRemaining(userId: string) {
  const ttl = await safeRedisCall(
    () => redis.ttl(getUserRateLimitKey(userId)),
    -1
  );
  return ttl > 0 ? ttl : 0;
}
