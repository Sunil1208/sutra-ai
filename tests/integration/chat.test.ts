import { createTestApp, closeTestApp } from "@utils/setup";
import { expect } from "chai";
import { FastifyInstance } from "fastify";
import request from "supertest";

describe("Integration - /v1/chat Orchestration", () => {
    let app: FastifyInstance;

    before(async () => {
        app = await createTestApp();
    });

    after(async () => {
        await closeTestApp(app);
    });

    it("should auto-route a prompt and return a model response", async () => {
        const payload = {
            messages: [
                { role: "user", content: "Explain the theory of relativity in simple terms." }
            ]
        };
        const res = await request(app.server).post("/v1/chat").send(payload);

        console.log("MOCK CHAT RESPONSE:", res.body);

        expect(res.status).to.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data.modelUsed).to.be.oneOf(["gpt-4o", "gemini-1.5", "claude-2"]);
        expect(res.body.data.latencyMs).to.be.a("number");
        expect(res.body.data.output).to.include("MOCK");
    });

    it("should allow explicit model override", async () => {
        const payload = {
            model: "claude",
            messages: [{ role: "user", content: "What is the capital of France?" }]
        };
        const res = await request(app.server).post("/v1/chat").send(payload);

        expect(res.status).to.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data.modelUsed).to.equal("claude-2");
        expect(res.body.data.latencyMs).to.be.a("number");
        expect(res.body.data.output).to.include("MOCK");
    });
});
