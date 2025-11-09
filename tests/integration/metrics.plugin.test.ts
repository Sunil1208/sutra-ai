import { expect } from "chai";
import { createTestApp, closeTestApp } from "@root/utils/setup";
import request from "supertest";
import type { FastifyInstance } from "fastify";
import { metricsRegistry } from "@root/plugins";

describe("Integration - Metrics Plugin", () => {
    let app: FastifyInstance;

    before(async () => {
        app = await createTestApp({
            setupRoutes: async (instance) => {
                instance.get("/metrics-test", async () => ({ ok: true }));
            }
        });
    });

    after(async () => {
        await closeTestApp(app);
    });

    it("should expose /metrics endpoint with Prometheus data", async () => {
        const res = await request(app.server).get("/metrics");
        expect(res.status).to.equal(200);
        expect(res.text).to.include("sutraai_http_requests_total");
    });

    it("should increment HTTP request counter on requests", async () => {
        metricsRegistry.resetMetrics();

        // Step 1: Get initial metrics
        const beforeMetrics = await metricsRegistry.getSingleMetricAsString(
            "sutraai_http_requests_total"
        );
        const beforeCount = parseCounterValue(beforeMetrics, "/metrics-test");

        // Step 2: Make test requests
        await request(app.server).get("/metrics-test");
        await request(app.server).get("/metrics-test");

        // Step 3: Get updated metrics
        const afterMetrics = await metricsRegistry.getSingleMetricAsString(
            "sutraai_http_requests_total"
        );

        const afterCount = parseCounterValue(afterMetrics, "/metrics-test");
        expect(afterCount).to.be.greaterThan(beforeCount);

        // Step 4: Verify counter incremented by 2
        expect(afterCount - beforeCount).to.equal(2);
    });
});

function parseCounterValue(
    metricText: string,
    route: string,
    method = "GET",
    statusCode = "200"
): number {
    const pattern = new RegExp(
        `sutraai_http_requests_total\\{[^}]*method="${method}"[^}]*route="${route}"[^}]*status_code="${statusCode}"[^}]*\\}\\s+(\\d+(?:\\.\\d+)?)`
    );
    const match = metricText.match(pattern);
    return match && match[1] ? parseFloat(match[1]) : 0;
}
