import { getRedisClient } from "@lib/redis.client";

/**
 * Redis-based Cache Utility
 * Users shared Redis client from /lib for JSON-safe caching
 * All values are serialized/deserialized automatically
 */

const redis = getRedisClient();

// Save data to redis cache with optional TTL (in seconds)
export async function setCache(key: string, value: unknown, ttl: number = 300) {
    await redis.set(key, JSON.stringify(value), "EX", ttl);
}

// Retrieve cached value from Redis
export async function getCache<T = any>(key: string): Promise<T | null> {
    const cached = await redis.get(key);
    return cached ? (JSON.parse(cached) as T) : null;
}

// Delete cache entry manually
export async function deleteCache(key: string): Promise<void> {
    await redis.del(key);
}
