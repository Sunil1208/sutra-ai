import { createTestApp, closeTestApp } from "@root/utils/setup";
import { expect } from "chai";
import request from "supertest";
import type { FastifyInstance } from "fastify";
import { string, z } from "zod";

describe("Validation plugin", () => {
    let app: FastifyInstance;

    before(async () => {
        app = await createTestApp({
            setupRoutes: async (instance) => {
                // Define zod schema for testing
                const schema = z.object({
                    name: string().min(1, "Name is required")
                });
                instance.post("/validate-test", async (req, reply) => {
                    const body = instance.validate(schema, req.body); // plugin call
                    return reply.send({ success: true, name: body.name });
                });
            }
        });
    });

    after(async () => {
        await closeTestApp(app);
    });

    it("should validate invalid request body", async () => {
        const res = await request(app.server).post("/validate-test").send({});
        expect(res.status).to.equal(400);
        expect(res.body.success).to.be.false;
        expect(res.body.errorCodes).to.equal("VALIDATION_ERROR");
    });

    it("should accept valid request body", async () => {
        const res = await request(app.server).post("/validate-test").send({ name: "John" });
        expect(res.status).to.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.name).to.equal("John");
    });
});
