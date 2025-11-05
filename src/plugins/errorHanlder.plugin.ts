/**
 * Global Error Handler Plugin
 * ---------------------------
 * Purpose:
 *   Provides a single, centralized mechanism for catching and formatting
 *   all unhandled exceptions across the entire Fastify app.
 *
 * Why `fastify-plugin`?
 *   - By default, Fastify plugins are "encapsulated", meaning hooks and handlers
 *     only apply to routes defined within that plugin.
 *   - Wrapping this plugin in `fastify-plugin` disables that encapsulation,
 *     making the error handler truly GLOBAL.
 *
 * Example Behavior:
 *   If any route throws an error (e.g., throw new Error("Bad request")),
 *   this plugin ensures a consistent JSON structure:
 *   {
 *     success: false,
 *     message: "Bad request",
 *     errorCodes: "INTERNAL_SERVER_ERROR",
 *     timestamp: "2025-11-05T06:45:09.840Z"
 *   }
 */

import { FastifyInstance, FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

/**
 * The actual error handler logic.
 * This function is wrapped by `fastify-plugin` below to make it globally applied.
 */
async function errorHandler(app: FastifyInstance) {
    app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
        // Log the error with request metadata for debugging
        app.log.error(
            {
                err: error,
                method: request.method,
                url: request.url
            },
            " -> Unhandled Error"
        );

        // Default to HTTP 500 unless the error provides a specific status code
        const statusCode = error.statusCode ?? 500;

        // Send a consistent, machine-readable response
        reply.status(statusCode).send({
            success: false,
            message: error.message || "Internal Server Error",
            errorCodes: error.code || "INTERNAL_SERVER_ERROR",
            timestamp: new Date().toISOString()
        });
    });
}

/**
 * Exported plugin instance.
 * `fp()` ensures this plugin runs once and attaches to the root Fastify instance
 * instead of being encapsulated to its own context.
 */
export const errorHandlerPlugin = fp(errorHandler, { name: "errorHandlerPlugin" });
