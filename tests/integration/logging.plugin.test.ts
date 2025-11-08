import { expect } from "chai";
import { createTestApp, closeTestApp } from "@root/utils/setup";
import request from "supertest";
import type { FastifyInstance } from "fastify";

describe("Integration - Logging Plugin", () => {
    let app: FastifyInstance;
    let logs: any[] = [];

    before(async () => {
        app = await createTestApp({
            setupRoutes: async (instance) => {
                instance.get("/log-test", async () => ({ ok: true }));
            }
        });

        // Patch app.log.info to capture emitted logs
        const originalInfo = app.log.info.bind(app.log);
        app.log.info = (data: any, msg?: string) => {
            logs.push({ data, msg });
            originalInfo(data, msg);
        };
    });

    after(async () => {
        await closeTestApp(app);
    });

    beforeEach(() => {
        logs = []; // Clear logs before each test
    });

    it("should log incoming and outgoing requests with traceId and latency", async () => {
        const res = await request(app.server).get("/log-test");
        expect(res.status).to.equal(200);

        // Find incoming and outgoing log entries
        const incoming = logs.find((l) => l.msg?.includes("-> Incoming request"));
        const outgoing = logs.find((l) => l.msg?.includes("<- Response sent"));

        // Verify both logs are present
        expect(incoming, "Missing incoming request log").to.exist;
        expect(outgoing, "Missing response log").to.exist;

        // Check traceId consistency and format
        expect(incoming.data).to.have.property("traceId");
        expect(outgoing.data).to.have.property("traceId");
        expect(incoming.data.traceId).to.be.a("string");
        expect(incoming.data.traceId.length).to.equal(36); // UUID v4 length
        expect(incoming.data.traceId).to.equal(outgoing.data.traceId);

        // Check latency is numeric and > 0
        expect(outgoing.data).to.have.property("latencyMs");
        expect(outgoing.data.latencyMs).to.be.a("number");
        expect(outgoing.data.latencyMs).to.be.greaterThanOrEqual(0);

        // status code should be present
        expect(outgoing.data).to.have.property("statusCode");
    });
});
