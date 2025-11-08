import { closeRedisClient } from "@lib/redis.client";
import { expect } from "chai";
import { getCache, setCache, deleteCache } from "@utils/cache.utils";

describe("Integration - Redis Cache", () => {
    const testKey = "sutraai:test:key";

    after(async () => {
        await closeRedisClient();
    });

    it("should set and get a cache value correctly", async () => {
        const payload = { message: "Hello, Redis!" };

        await setCache(testKey, payload, 5); // 5 seconds TTL
        const cached = await getCache(testKey);

        expect(cached).to.deep.equal(payload);
    });

    it("should expire cache entries after TTL", async function () {
        // allow TTL to elapse
        this.timeout(7000);
        const payload = { data: "Temporary Data" };

        await setCache(testKey, payload, 2); // 2 seconds TTL

        await new Promise((resolve) => setTimeout(resolve, 3000));

        const cached = await getCache(testKey);
        expect(cached).to.be.null;
    });

    it("should delete a cache entry", async () => {
        const payload = { info: "To be deleted" };

        await setCache(testKey, payload, 10);
        await deleteCache(testKey);

        const cached = await getCache(testKey);
        expect(cached).to.be.null;
    });
});
