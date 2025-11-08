import { expect } from "chai";
import { createHash, normalizedInput } from "@utils/hash.utils";

describe("Unit - Hash Utility", () => {
    it("should produce same hash for identical JSON objects regardless of key order", () => {
        const objA = { name: "Alice", age: 30 };
        const objB = { age: 30, name: "Alice" };

        const hashA = createHash(objA);
        const hashB = createHash(objB);

        expect(hashA).to.equal(hashB);
    });

    it("should produce different hashes for different inputs", () => {
        const input1 = { name: "Alice", age: 30 };
        const input2 = { name: "Bob", age: 25 };

        const hash1 = createHash(input1);
        const hash2 = createHash(input2);

        expect(hash1).to.not.equal(hash2);
    });

    it("should produce valid SHA256 hex string", () => {
        const input = { operation: "operation", platform: "sutra-ai" };
        const hash = createHash(input);

        expect(hash).to.match(/^[a-f0-9]{64}$/); // SHA256 produces 64 hex characters
    });

    it("shouold normalize input consistently", () => {
        const input = { b: 2, a: 1 };
        const normalized = normalizedInput(input);
        expect(normalized).to.equal(JSON.stringify({ a: 1, b: 2 }));
    });

    it("should safely handle non-JSON input", () => {
        const strInput = "simple string";
        const strResult = createHash(strInput);
        const undefinedResult = createHash(undefined);

        expect(strResult).to.be.a("string").with.length(64);
        expect(undefinedResult).to.be.a("string").with.length(64);
    });
});
