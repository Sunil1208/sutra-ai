import { deleteCache, incrementCacheWithTTL } from "@root/utils/cache.utils";
import { expect } from "chai";

describe("Unit - Cache Utils", () => {
    const testKey = "test:counter";

    afterEach(async () => {
        await deleteCache(testKey);
    });

    it("should increment cache value with TTL", async () => {
        // Initial increment
        const ttlMs = 2000;
        const count1 = await incrementCacheWithTTL(testKey, ttlMs);
        const count2 = await incrementCacheWithTTL(testKey, ttlMs);

        expect(count2).to.equal(count1 + 1);

        const ttlRemaining = await (await import("@lib/redis.client"))
            .getRedisClient()
            .pttl(testKey);
        expect(ttlRemaining).to.be.within(1, ttlMs);
    });
});
