import { createTestApp, closeTestApp } from "@root/utils/setup";
import { expect } from "chai";
import request from "supertest";
import type { FastifyInstance } from "fastify";
import { ValidationError } from "@utils/errors";

describe("ApiError Handling", () => {
    let app: FastifyInstance;

    before(async () => {
        app = await createTestApp({
            setupRoutes: async (instance) => {
                instance.get("/test-error", async () => {
                    // Simulate a validation error
                    throw new ValidationError("Invalid input data");
                });
            }
        });
    });

    after(async () => {
        await closeTestApp(app);
    });

    it("should return standardized error response for ApiError", async () => {
        const res = await request(app.server).get("/test-error");

        expect(res.status).to.equal(400);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal("Invalid input data");
        expect(res.body.errorCodes).to.equal("VALIDATION_ERROR");
    });
});
