import { config } from "@config/env";
import { buildApp } from "app";

const startServer = async () => {
    const app = buildApp();

    try {
        await app.listen({
            port: config.PORT,
            host: "0.0.0.0"
        });

        app.log.info(`🚀 Server running at http://localhost:${config.PORT}/`);
    } catch (error) {
        app.log.error(error);
    }
};

startServer();
