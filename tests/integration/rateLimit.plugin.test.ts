import { expect } from "chai";
import { createTestApp, closeTestApp } from "@root/utils/setup";
import request from "supertest";
import type { FastifyInstance } from "fastify";
import { rateLimitPlugin } from "@root/plugins";
import { deleteCache, setCache } from "@root/utils/cache.utils";

describe("Integration - Rate Limit Plugin", () => {
    let app: FastifyInstance;

    before(async () => {
        app = await createTestApp({
            setupRoutes: async (instance) => {
                instance.get("/rate-limit-test", async () => ({ ok: true }));
            }
        });
    });

    after(async () => {
        await closeTestApp(app);
    });

    it("should allow requests under the rate limit", async () => {
        const cacheKey = "rateLimit:free:127.0.0.1";
        await deleteCache(cacheKey);

        const res = await request(app.server).get("/rate-limit-test");

        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ ok: true });
    });

    it("should block request exceeding the rate limit", async () => {
        let currentCount = 50; // simulate over the limit for 'free' plan
        const cacheKey = "rateLimit:free:127.0.0.1";
        await setCache(cacheKey, currentCount.toString());

        const res = await request(app.server).get("/rate-limit-test").set("x-user-plan", "free");

        expect(res.status).to.equal(429);
        expect(res.body.success).to.be.false;
        // Reset the cache for other tests
        await deleteCache(cacheKey);
        console.log("Reset rate limit cache for key:", cacheKey);
    });
});
