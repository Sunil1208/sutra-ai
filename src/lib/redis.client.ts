import Redis from "ioredis";

/**
 * Redis Client Factory
 * Creates a reusable Redis client that can be shared across:
 * - Caching
 * - Queues
 * - Pub/Sub
 * - Rate Limiting
 * - Distributed Locks
 * - Metric pipelines
 * Ensures only one connect is active per process
 */

let redisInstance: Redis | null = null;

/**
 * Returns a single Redis client instance.
 * Ensures only one connection per Node process
 */
export function getRedisClient(): Redis {
    // TODO: need to add type
    if (!redisInstance) {
        const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

        redisInstance = new Redis(redisUrl, {
            maxRetriesPerRequest: null, // Prevent unhandled retry errors
            enableReadyCheck: true // Ensure the client checks if Redis is ready before sending commands
        });

        redisInstance.on("connect", () => {
            console.log(`[Redis] Connected to Redis at ${redisUrl}`);
        });

        redisInstance.on("error", (err) => {
            console.error("[Redis] Error:", err);
        });

        return redisInstance;
    }
}

// Gracefully close Redis (for testing/shutdown hooks)
export async function closeRedisClient() {
    if (redisInstance) {
        await redisInstance.quit();
        redisInstance = null;
    }
}
