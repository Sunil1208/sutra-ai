import { Queue, QueueEvents } from "bullmq";
import { getRedisClient } from "@lib/redis.client";
import { logger } from "@utils/loggers";

/**
 * Shared BullMQ Connection
 */
const redisConnection = getRedisClient();

// Creates a queue instance with connected QueueEvents
export const createQueue = (name: string) => {
    const queue = new Queue(name, { connection: redisConnection });
    const events = new QueueEvents(name, { connection: redisConnection });

    events.on("completed", ({ jobId }) =>
        logger.info({ jobId }, `[BullMQ] Job completed in queue ${name}`)
    );
    events.on("failed", ({ jobId, failedReason }) =>
        logger.info({ jobId, failedReason }, `[BullMQ] Job failed in queue ${name}`)
    );
    events.on("progress", ({ jobId, data }) =>
        logger.info({ jobId, data }, `[BullMQ] Job progress in queue ${name}`)
    );
    events.on("stalled", ({ jobId }) =>
        logger.info({ jobId }, `[BullMQ] Job stalled in queue ${name}`)
    );

    logger.info(`[BullMQ] Queue initialized for ${name}`);
    return { queue, events };
};

export { Queue };
