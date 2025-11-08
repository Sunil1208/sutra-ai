import crypto from "crypto";

/**
 * Normalize input before hashing - ensures deterministic hashes.
 * even if JSON key order changes
 */
function normalizedInput(input: unknown): string {
    if (typeof input === "string") {
        return input;
    }
    try {
        return JSON.stringify(input, Object.keys(input as object).sort());
    } catch {
        return String(input);
    }
}

// Create a SHA256 hash for any input
function createHash(input: unknown): string {
    const normalize = normalizedInput(input);
    return crypto.createHash("sha256").update(normalize).digest("hex");
}

export { normalizedInput, createHash };
