import Fastify from "fastify";
import { logger } from "@utils/loggers";
import {
    loggingPlugin,
    errorHandlerPlugin,
    validationPlugin,
    registerRoutesPlugin
} from "@plugins";

export const buildApp = () => {
    // create the app with basic logger enabled
    const app = Fastify({
        logger: true // allows Fastify to use our Pino-compatible logger instance
    });

    // Replace Fastify’s default logger with our preconfigured Pino logger
    app.log = logger;

    // Debug helper — prints every plugin registration prefix to ensure order
    app.addHook("onRegister", (instance, opts) => {
        console.log("Plugin registered:", opts.prefix || "root");
    });

    /**
     * IMPORTANT: Global Error Handler should be registered first
     * Ensures all subsequent plugins and routes are covered under it.
     */
    app.register(errorHandlerPlugin);

    app.register(loggingPlugin);
    app.register(validationPlugin);

    // Register routes
    app.register(registerRoutesPlugin);

    app.get("/", async () => ({
        status: "ok",
        message: "Sutra AI Gateway is running"
    }));

    return app;
};
