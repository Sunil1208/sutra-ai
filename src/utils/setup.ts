import { buildApp } from "@root/app";
import type { FastifyInstance } from "fastify";

interface createTestAppOptions {
    /**
     * Optional: Register additional routes or plugins before app.ready()
     * Example:
     * ```
     * async (app: FastifyInstance) => {
     *   app.get("/test", async () => ({ message: "test" }));
     * }
     * ```
     */
    setupRoutes?: (app: FastifyInstance) => Promise<void>;

    /**
     * Optional: Wether to auto-call app.ready() (default: true)
     * Set false if manual control is needed
     */
    autoReady?: boolean;
}

/**
 * Initialized and returns a ready Fastify app instance for testing.
 * It supports optional route injection and lifecycle control
 */
export async function createTestApp(options: createTestAppOptions = {}): Promise<FastifyInstance> {
    const { setupRoutes, autoReady = true } = options;
    const app = buildApp();

    // Allow injecting custom routes/plugins before app initialization
    if (setupRoutes) {
        // await app.register(setupRoutes);
        await setupRoutes(app);
    }

    // Auto-initialize the app unless manual control is requested
    if (autoReady) {
        await app.ready();
    }

    return app;
}

/**
 * Gracefully closes the given app instance after tests
 */
export async function closeTestApp(app: FastifyInstance): Promise<void> {
    await app.close();
}
