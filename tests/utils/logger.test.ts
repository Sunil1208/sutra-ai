import { expect } from "chai";
import { logger } from "@utils/loggers"

describe("Logger Utility", () => {
    it("should expose standard logging methods", () => {
        expect(logger).to.have.property("info");
        expect(logger).to.have.property("warn");
        expect(logger).to.have.property("error");
    })
})