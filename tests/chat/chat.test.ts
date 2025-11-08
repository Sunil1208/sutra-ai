import { ChatSchemas } from "@schemas";
import { createTestApp, closeTestApp } from "@root/utils/setup";
import { expect } from "chai";
import { FastifyInstance } from "fastify";
import request from "supertest";

const { Request: ChatRequestSchema, Response: ChatResponseSchema } = ChatSchemas;

describe("Chat Route", () => {
    let app: FastifyInstance;

    before(async () => {
        app = await createTestApp({
            setupRoutes: async (instance) => {
                instance.post("/test/v1/chat", async (req, reply) => {
                    instance.validate(ChatRequestSchema, req.body);
                    const mockResponse = {
                        success: true,
                        modelUsed: "gpt-4o",
                        output: "Hello SutraAi",
                        latencyMs: 30,
                        cached: false
                    };

                    // Validate response schema
                    const response = instance.validate(ChatResponseSchema, mockResponse);
                    return reply.code(200).send(response);
                });
            }
        });
    });

    after(async () => {
        await closeTestApp(app);
    });

    it("should invalidate invalid request body", async function () {
        const res = await request(app.server)
            .post("/test/v1/chat")
            .send({ invalidField: "invalid" });
        expect(res.status).to.equal(400);
        expect(res.body.success).to.be.false;
        expect(res.body.errorCodes).to.equal("VALIDATION_ERROR");
    });

    it("should accept valid request body and return mock response", async function () {
        const validMockPayload = {
            model: "gpt-4o",
            messages: [{ role: "user", content: "Hello SutraAi" }]
        };
        const res = await request(app.server).post("/test/v1/chat").send(validMockPayload);
        expect(res.status).to.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.modelUsed).to.equal("gpt-4o");
        expect(res.body.output).to.include("Hello SutraAi");
    });
});
