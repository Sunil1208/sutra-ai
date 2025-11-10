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

/**
 * Increment a counter with TTL atomically
 * ---------------------------------------
 * Used for:
 *   - Rate limiting
 *   - Usage counting
 *   - Analytics events
 *
 * Ensures:
 *   - Atomic INCR + TTL (PEXPIRE)
 *   - No race conditions
 *   - TTL applied only once per window
 *
 * @param key Redis key
 * @param ttlMs Expiration window in milliseconds
 * @returns new counter value
 */
export async function incrementCacheWithTTL(key: string, ttlMs: number): Promise<number> {
    const multi = redis.multi();
    multi.incr(key);
    multi.pexpire(key, ttlMs);
    const results = await multi.exec();

    // result = [[null, newValue], [null, "OK"]
    const newValue = results?.[0]?.[1] as number;
    return newValue || 0;
}

/**
 * Simple increment (no TTL)
 * Useful for lifetime counters (e.g., total requests, job processed count)
 */
export async function incrementKey(key: string): Promise<number> {
    const value = await redis.incr(key);
    return value;
}
