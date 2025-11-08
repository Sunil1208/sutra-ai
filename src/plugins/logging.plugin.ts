import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";

export const loggingPlugin = fp(async (app: FastifyInstance) => {
    // Add unique trace ID for each request
    app.addHook("onRequest", async (req) => {
        const traceId = randomUUID();

        // Create a per-request child logger with enriched context
        req.log = app.log.child({
            traceId,
            method: req.method,
            url: req.url
        });

        req.log.info(
            {
                traceId,
                method: req.method,
                url: req.url
            },
            "-> Incoming request"
        );
        // Store start time for latency
        (req as any).startTime = Date.now();
    });

    // Log after response is sent
    app.addHook("onResponse", async (req, reply) => {
        const latencyMs = Date.now() - (req as any).startTime;
        req.log.info(
            {
                traceId: (req.log as any).bindings().traceId,
                statusCode: reply.statusCode,
                latencyMs,
                route: req.routeOptions?.url ?? req.url
            },
            "<- Response sent"
        );
    });
});
