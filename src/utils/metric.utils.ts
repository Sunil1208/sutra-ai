import type { FastifyInstance } from "fastify";

/**
 * Helper wrapper so services can record metric without importing prom-client directly.
 */
export const recordCacheEvent = (app: FastifyInstance, hit: boolean) => {
    if (hit) app.metrics.recordCacheHit();
    else app.metrics.recordCacheMiss();
};

export const recordModelLatency = (app: FastifyInstance, model: string, latencyMs: number) => {
    app.metrics.recordModelLatency(model, latencyMs);
};
