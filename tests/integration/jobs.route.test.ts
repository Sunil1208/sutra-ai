import { expect } from "chai";
import { createTestApp, closeTestApp } from "@utils/setup";
import request from "supertest";
import { setCache } from "@utils/cache.utils";

describe("Integration - Jobs Route", () => {
    let app: any;

    before(async () => {
        app = await createTestApp();
    });

    after(async () => {
        await closeTestApp(app);
    });

    it("should return 404 for non-existent job", async () => {
        const res = await request(app.server).get("/v1/jobs/nonexistentjobid");
        console.log("response for nonexistent job:", res.status, res.body);
        expect(res.status).to.equal(404);
        expect(res.body.success).to.be.false;
    });

    it("should return completed job data when found", async () => {
        const jobId = "testjob123";
        const mockData = { status: "completed", data: { output: "Test output" } };
        await setCache(`job:${jobId}`, JSON.stringify(mockData), 600);

        const res = await request(app.server).get(`/v1/jobs/${jobId}`);

        expect(res.status).to.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.jobId).to.equal(jobId);
        expect(res.body.status).to.equal("completed");
        expect(res.body.data).to.deep.equal({ output: "Test output" });
    });
});
