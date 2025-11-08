import { expect } from "chai";
import * as redisClient from "@lib/redis.client";
import { setCache, getCache, deleteCache } from "@utils/cache.utils";

describe("Cache Utility (Mock Redis)", () => {
    const store: Record<string, string> = {};

    before(() => {
        // Mock shared Redis client
        (redisClient as any).getRedisClient = () => ({
            get: async (key: string) => store[key] || null,
            set: async (key: string, value: string) => (store[key] = value),
            del: async (key: string) => delete store[key]
        });
    });

    it("should store and retrieve cached values", async () => {
        const cacheKey = "testKey";
        await setCache(cacheKey, { name: "testValue" });
        const val = await getCache(cacheKey);
        expect(val).to.deep.equal({ name: "testValue" });
    });

    it("should return null for missing keys", async () => {
        const cacheKey = "nonExistentKey";
        const val = await getCache(cacheKey);
        expect(val).to.be.null;
    });

    it("should delete cached entries", async () => {
        const cacheKey = "toBeDeleted";
        await setCache(cacheKey, { key: "value" });
        await deleteCache(cacheKey);
        const val = await getCache(cacheKey);
        expect(val).to.be.null;
    });
});
