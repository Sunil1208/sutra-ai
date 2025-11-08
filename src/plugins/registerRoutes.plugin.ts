import { chatRoutes, healthRoute } from "@routes";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

async function registerRoutes(app: FastifyInstance) {
    app.register(chatRoutes, { prefix: "/v1/chat" });
    app.register(healthRoute, { prefix: "/health" });
}

export const registerRoutesPlugin = fp(registerRoutes, {
    name: "registerRoutesPlugin"
});
