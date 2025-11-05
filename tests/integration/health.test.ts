import { createTestApp, closeTestApp } from "@root/utils/setup";
import { expect } from "chai";
import request from "supertest";
import type { FastifyInstance } from "fastify";

describe("GET /health", () => {
    let app: FastifyInstance;

    before(async () => {
        app = await createTestApp();
    });

    after(async () => {
        await closeTestApp(app);
    });

    it("should return service health info", async () => {
        const res = await request(app.server).get("/health/");

        expect(res.status).to.equal(200);
        expect(res.body.data.status).to.equal("ok");
        expect(res.body.data.service).to.equal("sutra-ai");
    });
});
