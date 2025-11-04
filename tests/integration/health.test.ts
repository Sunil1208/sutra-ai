import { buildApp } from "app";
import { expect } from "chai";
import request from "supertest";

describe("GET /health", () => {
    let app: ReturnType<typeof buildApp>;

    before(async () => {
        app = buildApp();
        await app.ready(); // wait for Fastify to be ready before running tests
    });

    after(async () => {
        await app.close(); // close the app after tests
    });

    it("should return service health info", async () => {
        const res = await request(app.server).get("/health/");

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("ok");
        expect(res.body.service).to.equal("sutra-ai");
    });
});
