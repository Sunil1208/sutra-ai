import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import client from "prom-client";

export const metricsRegistry = new client.Registry();

// Metric Definitions
const httpRequestCounter = new client.Counter({
    name: "sutraai_http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"]
});

const modelLatencyHistogram = new client.Histogram({
    name: "sutraai_model_latency_ms",
    help: "Latency of model responses in milliseconds",
    labelNames: ["model_name"],
    buckets: [50, 100, 200, 400, 800, 1600, 3200, 6400]
});

const cacheHitCounter = new client.Counter({
    name: "sutraai_cache_hits_total",
    help: "Total number of cache hits",
    labelNames: ["cache_name"]
});

const cacheMissCounter = new client.Counter({
    name: "sutraai_cache_misses_total",
    help: "Total number of cache misses",
    labelNames: ["cache_name"]
});

// Register Metrics
metricsRegistry.registerMetric(httpRequestCounter);
metricsRegistry.registerMetric(modelLatencyHistogram);
metricsRegistry.registerMetric(cacheHitCounter);
metricsRegistry.registerMetric(cacheMissCounter);

// Collect Node default metrics
client.collectDefaultMetrics({ register: metricsRegistry });

export const metricsPlugin = fp(async (app: FastifyInstance) => {
    // Expose GET /metrics endpoint
    app.get("/metrics", async (_req, reply) => {
        reply.header("Content-Type", metricsRegistry.contentType);
        reply.send(await metricsRegistry.metrics());
    });

    // Count every HTTP request
    app.addHook("onResponse", (request, reply) => {
        httpRequestCounter.inc({
            method: request.method,
            route: request.routeOptions?.url || request.url || "unknown",
            status_code: reply.statusCode
        });
    });

    // Decorate Fastify instance with metric functions
    app.decorate("metrics", {
        recordModelLatency(model: string, ms: number) {
            modelLatencyHistogram.observe({ model_name: model }, ms);
        },
        recordCacheHit() {
            cacheHitCounter.inc();
        },
        recordCacheMiss() {
            cacheMissCounter.inc();
        }
    });
});

declare module "fastify" {
    interface FastifyInstance {
        metrics: {
            recordModelLatency(model: string, ms: number): void;
            recordCacheHit(): void;
            recordCacheMiss(): void;
        };
    }
}
