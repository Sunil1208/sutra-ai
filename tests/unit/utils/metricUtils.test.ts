import { expect } from "chai";
import sinon from "sinon";
import { recordCacheEvent, recordModelLatency } from "@utils/metric.utils";

describe("Unit - Metric Utilities", () => {
    const fakeApp: any = {
        metrics: {
            recordCacheHit: sinon.spy(),
            recordCacheMiss: sinon.spy(),
            recordModelLatency: sinon.spy()
        }
    };

    it("should record cache hit and miss correctly", () => {
        recordCacheEvent(fakeApp as any, true);
        recordCacheEvent(fakeApp as any, false);
        expect(fakeApp.metrics.recordCacheHit.calledOnce).to.be.true;
        expect(fakeApp.metrics.recordCacheMiss.calledOnce).to.be.true;
    });

    it("should record model latency correctly", () => {
        recordModelLatency(fakeApp as any, "gpt-4", 150);
        expect(fakeApp.metrics.recordModelLatency.calledWith("gpt-4", 150)).to.be.true;
    });
});
