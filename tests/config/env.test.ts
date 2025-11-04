import { expect } from "chai";
import { z } from "zod";

describe("Environment validation", () => {
    const EnvSchema = z.object({
        PORT: z.coerce.number(),
        DATABASE_URL: z.string(),
        REDIS_URL: z.string(),
    })

    it("should validate environment variables", () => {
        const data = EnvSchema.parse({
            PORT: 8080,
            DATABASE_URL: "postgres://localhost",
            REDIS_URL: "redis://localhost",
        });

        expect(data.PORT).to.equal(8080);
        expect(data.DATABASE_URL).to.equal("postgres://localhost");
        expect(data.REDIS_URL).to.equal("redis://localhost");
    })

    it("should fail on missing keys", () => {
        expect(() => EnvSchema.parse({})).to.throw();
    })
})