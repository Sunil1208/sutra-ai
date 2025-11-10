import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import client from "prom-client";
import { getRateLimitForPlan } from "@utils/rateLimit.utils";
import { logger } from "@utils/loggers";
import { getCache, setCache, incrementCacheWithTTL } from "@root/utils/cache.utils";

const rateLimitHitCounter = new client.Counter({
    name: "sutraai_rate_limit_hits_total",
    help: "Number of blocked requests due to rate limiting",
    labelNames: ["plan"]
});

export const rateLimitPlugin = fp(async (app: FastifyInstance) => {
    const ttlCache = new Map<string, number>();

    app.addHook("onRequest", async (req, reply) => {
        const ip = req.ip || "unknown";
        const plan = (req.headers["x-user-plan"] as string) || "free";
        const { windowMs, max } = getRateLimitForPlan(plan);

        const cacheKey = `rateLimit:${plan}:${ip}`;
        const now = Date.now();

        const current = parseInt((await getCache(cacheKey)) || "0", 10);

        if (current >= max) {
            rateLimitHitCounter.inc({ plan });
            logger.warn({ ip, plan }, "[RateLimitPlugin] Rate limit exceeded");
            return reply.status(429).send({
                success: false,
                error: "Too many requests. Please try again later."
            });
        }

        // increment request count
        await incrementCacheWithTTL(cacheKey, windowMs);
        ttlCache.set(cacheKey, now + windowMs);
    });
    app.log.info("[RateLimit] Plugin initialized");
});
