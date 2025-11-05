import { createTestApp, closeTestApp } from "@root/utils/setup";
import { expect } from "chai";
import request from "supertest";
import type { FastifyInstance } from "fastify";

describe("Global Error Handler", () => {
    let app: FastifyInstance;

    before(async () => {
        app = await createTestApp({
            setupRoutes: async (instance) => {
                instance.get("/error", async () => {
                    throw new Error("Something went wrong");
                });
            }
        });
    });

    after(async () => {
        await closeTestApp(app);
    });

    it("should return standardized error response", async () => {
        const res = await request(app.server).get("/error");
        console.log("response body is ", res.body);

        expect(res.status).to.equal(500);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal("Something went wrong");
        expect(res.body.errorCodes).to.equal("INTERNAL_SERVER_ERROR");
    });
});
