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
                instance.get("/concurrent-log-test", async () => {
                    // small delay to overlap responses
                    await new Promise((res) => setTimeout(res, Math.random() * 30));
                    return { ok: true };
                });
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

    it("should assign unique traceIds for concurrent requests", async () => {
        const PARALLEL_REQUEST_COUNT = 5;
        const requests = Array.from({ length: PARALLEL_REQUEST_COUNT }).map(() => {
            return request(app.server).get("/concurrent-log-test");
        });
        const responses = await Promise.all(requests);
        responses.forEach((res) => expect(res.status).to.equal(200));

        // group logs by traceId
        const outgoingLogs = logs.filter((log) => log.msg?.includes("<- Response sent"));
        expect(outgoingLogs.length).to.equal(PARALLEL_REQUEST_COUNT);

        const traceIds = outgoingLogs.map((log) => log.data.traceId);
        const uniqueTraceIds = new Set(traceIds);

        // All traceIds should be unique and should have length of UUID v4
        uniqueTraceIds.forEach((traceId) => {
            expect(traceId).to.be.a("string");
            expect(traceId.length).to.equal(36);
        });
        expect(uniqueTraceIds.size).to.equal(traceIds.length);

        // Each traceId should appear exaclty twice (incoming + outgoing)
        uniqueTraceIds.forEach((id) => {
            const count = logs.filter((log) => log.data.traceId && log.data.traceId === id).length;
            expect(count).to.equal(2, `TraceId ${id} does not have exactly 2 log entries`);
        });
    });
});
