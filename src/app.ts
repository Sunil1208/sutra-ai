import Fastify from "fastify";
import { logger } from "@utils/loggers";
import healthRoute from "@routes/health.route";

export const buildApp = () => {
    const app = Fastify({
        logger: true
    });

    app.log = logger;

    app.register(healthRoute, { prefix: "/health" });

    app.get("/", async () => ({
        status: "ok",
        message: "Sutra AI Gateway is running"
    }));

    return app;
};
