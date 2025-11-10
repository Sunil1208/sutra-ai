import { Worker } from "bullmq";
import { orchestratorService } from "@services";
import { logger } from "@utils/loggers";
import { recordModelLatency } from "@utils/metric.utils";
import { FastifyInstance } from "fastify";
import Fastify from "fastify";
import { setCache } from "@utils/cache.utils";
import { getRedisClient } from "@root/lib/redis.client";
/**
 * Background worker for ChatQueue
 * Consumes job from "chatQueue" and runs orchestrator logic
 */
const app: FastifyInstance = Fastify();
const redisConnection = getRedisClient();

const worker = new Worker(
    "chatQueue",
    async (job) => {
        const startTime = Date.now();
        const { prompt, strategy = "auto" } = job.data;

        logger.info({ jobId: job.id, strategy }, "[ChatWorker] Processing job");

        try {
            // Run orchestrator service
            const result = await orchestratorService.routePrompt(app, prompt, strategy);

            const latencyMs = Date.now() - startTime;
            recordModelLatency(app, result.modelUsed || result.chosenStrategy, latencyMs);

            // Save result in Redis with short TTL (10 min)
            await setCache(
                `job:${job.id}`,
                JSON.stringify({
                    status: "completed",
                    data: result
                }),
                600
            );

            logger.info({ jobId: job.id, latencyMs }, "[ChatWorker] Job completed successfully");
            return result;
        } catch (error) {
            logger.error({ jobId: job.id, error }, "[ChatWorker] Job failed");
            await setCache(
                `job:${job.id}`,
                JSON.stringify({
                    status: "failed",
                    error: (error as Error).message
                }),
                600
            );
            throw error;
        }
    },
    { connection: redisConnection, concurrency: Number(process.env.WORKER_CONCURRENCY || 3) }
);

// Event logging
worker.on("completed", (job) => {
    logger.info({ jobId: job.id }, "[ChatWorker] Job completed event");
});

worker.on("failed", (job, err) => {
    logger.error({ jobId: job?.id, error: err }, "[ChatWorker] Job failed event");
});

logger.info("[ChatWorker] Worker initialized and listening for jobs");

export { worker };
