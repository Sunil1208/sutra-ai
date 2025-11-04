import { buildApp } from "@root/app";
import type { FastifyInstance } from "fastify";

/**
 * Initialized and returns a ready Fastify app instance for testing
 * Automatically calls app.ready() and app.close() for proper lifecycle management
 */
export async function createTestApp(): Promise<FastifyInstance> {
    const app = buildApp();
    await app.ready();
    return app;
}

/**
 * Gracefully closes the given app instance after tests
 */
export async function closeTestApp(app: FastifyInstance): Promise<void> {
    await app.close();
}
